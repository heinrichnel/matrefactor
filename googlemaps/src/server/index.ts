import * as admin from "firebase-admin";
import { onRequest, HttpsError } from "firebase-functions/v2/https";
import type { Request, Response } from "express";

admin.initializeApp();

// --- Firestore collections ---
const colUsers = admin.firestore().collection("users");
const colProps = admin.firestore().collection("properties");
const colFavs = admin.firestore().collection("favorites"); // docId = `${userId}_${propertyId}`
const colDeliveries = admin.firestore().collection("deliveries");
const colTrips = admin.firestore().collection("trips");

// --- Realtime DB (for GPS pings) ---
const rtdb = admin.database(); // path: /deliveryLocations/{deliveryId} => {lat,lng,ts}

/** Extract user UID from Authorization: Bearer <idToken> */
async function getUser(req: Request): Promise<string> {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  if (!token) throw new HttpsError("unauthenticated", "Missing auth token");
  const decoded = await admin.auth().verifyIdToken(token);
  return decoded.uid;
}

/* ===================== PROPERTIES ===================== */

export const createProperty = onRequest(async (req: Request, res: Response) => {
  try {
    if (req.method !== "POST") {
      res.status(405).end();
      return;
    }
    const uid = await getUser(req);
    const body = req.body as {
      title: string;
      price: number;
      type: "house" | "apartment" | "land" | "commercial";
      lat: number;
      lng: number;
      address?: string;
      city?: string;
      country?: string;
      description?: string;
    };
    const doc = await colProps.add({
      owner_uid: uid,
      ...body,
      status: "active",
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.json({ id: doc.id });
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "failed" });
  }
});

export const updateProperty = onRequest(async (req: Request, res: Response) => {
  try {
    if (req.method !== "PATCH") {
      res.status(405).end();
      return;
    }
    const uid = await getUser(req);
    const { id, ...patch } = req.body as { id: string; [k: string]: any };
    const doc = await colProps.doc(id).get();
    if (!doc.exists) {
      res.status(404).json({ error: "not found" });
      return;
    }
    if (doc.get("owner_uid") !== uid) {
      res.status(403).json({ error: "forbidden" });
      return;
    }
    await colProps.doc(id).update({
      ...patch,
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "failed" });
  }
});

export const deleteProperty = onRequest(async (req: Request, res: Response) => {
  try {
    if (req.method !== "DELETE") {
      res.status(405).end();
      return;
    }
    const uid = await getUser(req);
    const id = (req.query.id as string) || "";
    const doc = await colProps.doc(id).get();
    if (!doc.exists) {
      res.status(404).json({ error: "not found" });
      return;
    }
    if (doc.get("owner_uid") !== uid) {
      res.status(403).json({ error: "forbidden" });
      return;
    }
    await colProps.doc(id).delete();
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "failed" });
  }
});

/* ===================== FAVORITES ===================== */

export const toggleFavorite = onRequest(async (req: Request, res: Response) => {
  try {
    if (req.method !== "POST") {
      res.status(405).end();
      return;
    }
    const uid = await getUser(req);
    const { propertyId, liked } = req.body as { propertyId: string; liked: boolean };
    const favId = `${uid}_${propertyId}`;
    if (liked) {
      await colFavs.doc(favId).set({
        user_uid: uid,
        property_id: propertyId,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      await colFavs.doc(favId).delete();
    }
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "failed" });
  }
});

/* ===================== DELIVERIES ===================== */

export const createDelivery = onRequest(async (req: Request, res: Response) => {
  try {
    if (req.method !== "POST") {
      res.status(405).end();
      return;
    }
    await getUser(req); // add role checks as needed
    const { customer_uid, driver_uid, pickup, dropoff } = req.body as {
      customer_uid?: string;
      driver_uid?: string;
      pickup: { lat: number; lng: number; address?: string };
      dropoff: { lat: number; lng: number; address?: string };
    };
    const doc = await colDeliveries.add({
      customer_uid,
      driver_uid,
      status: "created",
      pickup,
      dropoff,
      eta_minutes: null,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.json({ id: doc.id });
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "failed" });
  }
});

export const setDeliveryStatus = onRequest(async (req: Request, res: Response) => {
  try {
    if (req.method !== "POST") {
      res.status(405).end();
      return;
    }
    const uid = await getUser(req);
    const { id, status } = req.body as {
      id: string;
      status: "created" | "dispatched" | "in_transit" | "delivered" | "cancelled";
    };
    const ref = colDeliveries.doc(id);
    const doc = await ref.get();
    if (!doc.exists) {
      res.status(404).json({ error: "not found" });
      return;
    }

    const driver_uid = doc.get("driver_uid");
    if (["in_transit", "delivered", "cancelled"].includes(status) && uid !== driver_uid) {
      res.status(403).json({ error: "forbidden" });
      return;
    }

    await ref.update({
      status,
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "failed" });
  }
});

export const telemetry = onRequest(async (req: Request, res: Response) => {
  try {
    if (req.method !== "POST") {
      res.status(405).end();
      return;
    }
    const uid = await getUser(req);
    const { deliveryId, lat, lng, speed, heading } = req.body as {
      deliveryId: string;
      lat: number;
      lng: number;
      speed?: number;
      heading?: number;
    };

    const doc = await colDeliveries.doc(deliveryId).get();
    if (!doc.exists) {
      res.status(404).json({ error: "delivery not found" });
      return;
    }
    const driver_uid = doc.get("driver_uid");
    if (driver_uid && driver_uid !== uid) {
      res.status(403).json({ error: "forbidden" });
      return;
    }

    await rtdb.ref(`deliveryLocations/${deliveryId}`).set({
      lat,
      lng,
      speed: speed ?? null,
      heading: heading ?? null,
      ts: admin.database.ServerValue.TIMESTAMP,
    });

    await colDeliveries.doc(deliveryId).collection("events").add({
      type: "telemetry",
      lat,
      lng,
      speed,
      heading,
      at: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "failed" });
  }
});

/* ===================== ROUTE OPTIMIZE ===================== */

export const optimizeRoute = onRequest(async (req: Request, res: Response) => {
  try {
    if (req.method !== "POST") {
      res.status(405).end();
      return;
    }
    await getUser(req);
    const { origin, destination, waypoints, mode } = req.body as {
      origin: { lat: number; lng: number };
      destination: { lat: number; lng: number };
      waypoints: Array<{ lat: number; lng: number }>;
      mode?: "driving" | "walking" | "bicycling" | "transit";
    };

    const params = new URLSearchParams({
      origin: `${origin.lat},${origin.lng}`,
      destination: `${destination.lat},${destination.lng}`,
      waypoints: `optimize:true|${waypoints.map((w) => `${w.lat},${w.lng}`).join("|")}`,
      mode: (mode ?? "driving").toLowerCase(),
      key: process.env.GMAPS_SERVER_KEY as string,
    });

    const url = `https://maps.googleapis.com/maps/api/directions/json?${params.toString()}`;
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "failed" });
  }
});
