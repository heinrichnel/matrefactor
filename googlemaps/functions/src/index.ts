import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getDatabase, ServerValue } from "firebase-admin/database";
import { getAuth } from "firebase-admin/auth";
import { onRequest, HttpsError } from "firebase-functions/v2/https";
import { onValueUpdated } from "firebase-functions/v2/database";
import { setGlobalOptions } from "firebase-functions/v2";

// Set global options for all functions
// There is no region for South Africa yet, so us-central1 is used as a default.
// You could also choose a region like europe-west3 for a closer geographical location.
setGlobalOptions({
  region: "us-central1",
});

// Initialize Firebase Admin SDK
const app = initializeApp();

// Database references for Firestore and Realtime Database
const db = getFirestore(app);
const auth = getAuth(app);
const rtdb = getDatabase(app);

const colProps = db.collection("properties");
const colFavs = db.collection("favorites");
const colDeliveries = db.collection("deliveries");
const colGeofences = db.collection("geofences");
const colAlerts = db.collection("deliveryAlerts");

/**
 * Type definition for a request object, simplified for authentication.
 */
type ReqLike = { headers: { authorization?: string }; query?: any };

/**
 * Helper function to authenticate a user from a Bearer token.
 * @param req The incoming request object.
 * @returns The user's UID.
 * @throws HttpsError if the token is missing or invalid.
 */
async function getUser(req: ReqLike): Promise<string> {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  if (!token) {
    throw new HttpsError("unauthenticated", "Missing auth token");
  }
  const decoded = await auth.verifyIdToken(token);
  return decoded.uid;
}

/* ===================== PROPERTIES ===================== */
// Functions for managing property listings.

/**
 * Creates a new property listing.
 * Requires authentication.
 * Method: POST
 * Body: { title, price, type, lat, lng, address?, city?, country?, description? }
 */
export const createProperty = onRequest(async (req, res) => {
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
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    });
    res.json({ id: doc.id });
  } catch (e: any) {
    console.error("Error creating property:", e);
    res.status(400).json({ error: e?.message || "Failed to create property" });
  }
});

/**
 * Updates an existing property listing.
 * Requires authentication and ownership of the property.
 * Method: PATCH
 * Body: { id: string, ...updates }
 */
export const updateProperty = onRequest(async (req, res) => {
  try {
    if (req.method !== "PATCH") {
      res.status(405).end();
      return;
    }
    const uid = await getUser(req);
    const { id, ...patch } = req.body as { id: string; [k: string]: any };
    const doc = await colProps.doc(id).get();

    if (!doc.exists) {
      res.status(404).json({ error: "Property not found" });
      return;
    }

    if (doc.get("owner_uid") !== uid) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    await colProps.doc(id).update({
      ...patch,
      updated_at: FieldValue.serverTimestamp(),
    });
    res.json({ ok: true });
  } catch (e: any) {
    console.error("Error updating property:", e);
    res.status(400).json({ error: e?.message || "Failed to update property" });
  }
});

/**
 * Deletes a property listing.
 * Requires authentication and ownership of the property.
 * Method: DELETE
 * Query: ?id=string
 */
export const deleteProperty = onRequest(async (req, res) => {
  try {
    if (req.method !== "DELETE") {
      res.status(405).end();
      return;
    }
    const uid = await getUser(req);
    const id = (req.query.id as string) || "";
    const doc = await colProps.doc(id).get();

    if (!doc.exists) {
      res.status(404).json({ error: "Property not found" });
      return;
    }

    if (doc.get("owner_uid") !== uid) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    await colProps.doc(id).delete();
    res.json({ ok: true });
  } catch (e: any) {
    console.error("Error deleting property:", e);
    res.status(400).json({ error: e?.message || "Failed to delete property" });
  }
});

/* ===================== FAVORITES ===================== */
// Functions for managing a user's favorite properties.

/**
 * Toggles a property as a favorite for the authenticated user.
 * Method: POST
 * Body: { propertyId: string, liked: boolean }
 */
export const toggleFavorite = onRequest(async (req, res) => {
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
        created_at: FieldValue.serverTimestamp(),
      });
    } else {
      await colFavs.doc(favId).delete();
    }
    res.json({ ok: true });
  } catch (e: any) {
    console.error("Error toggling favorite:", e);
    res.status(400).json({ error: e?.message || "Failed to toggle favorite" });
  }
});

/* ===================== DELIVERIES ===================== */
// Functions for managing delivery tasks.

/**
 * Creates a new, more detailed delivery task.
 * Requires authentication.
 * Method: POST
 * Body: {
 * pickup: { lat, lng, address? },
 * dropoff: { lat, lng, address? },
 * packageDetails: { weightKg, dimensionsCm?, type },
 * vehicleType: "motorcycle" | "car" | "van",
 * customer_uid,
 * }
 */
export const createDelivery = onRequest(async (req, res) => {
  try {
    if (req.method !== "POST") {
      res.status(405).end();
      return;
    }
    await getUser(req);
    const { customer_uid, pickup, dropoff, packageDetails, vehicleType } = req.body as {
      customer_uid?: string;
      pickup: { lat: number; lng: number; address?: string };
      dropoff: { lat: number; lng: number; address?: string };
      packageDetails: {
        weightKg: number;
        dimensionsCm?: string;
        type: "document" | "small-box" | "large-box" | "pallet";
      };
      vehicleType: "motorcycle" | "car" | "van";
    };
    const doc = await colDeliveries.add({
      customer_uid,
      status: "created",
      pickup,
      dropoff,
      packageDetails,
      vehicleType,
      driver_uid: null,
      eta_minutes: null,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    });
    res.json({ id: doc.id });
  } catch (e: any) {
    console.error("Error creating delivery:", e);
    res.status(400).json({ error: e?.message || "Failed to create delivery" });
  }
});

/**
 * Assigns a delivery to a driver.
 * Requires authentication.
 * Method: POST
 * Body: { deliveryId: string, driver_uid: string }
 */
export const assignDelivery = onRequest(async (req, res) => {
  try {
    if (req.method !== "POST") {
      res.status(405).end();
      return;
    }
    await getUser(req);
    const { deliveryId, driver_uid } = req.body as { deliveryId: string; driver_uid: string };

    const ref = colDeliveries.doc(deliveryId);
    const doc = await ref.get();

    if (!doc.exists) {
      res.status(404).json({ error: "Delivery not found" });
      return;
    }

    // Check if the delivery is already assigned to a driver
    if (doc.get("driver_uid")) {
      res.status(409).json({ error: "Delivery is already assigned" });
      return;
    }

    await ref.update({
      driver_uid,
      status: "dispatched",
      updated_at: FieldValue.serverTimestamp(),
    });

    res.json({ ok: true });
  } catch (e: any) {
    console.error("Error assigning delivery:", e);
    res.status(400).json({ error: e?.message || "Failed to assign delivery" });
  }
});

/**
 * Sets the status of a delivery.
 * Requires authentication and ownership of the delivery.
 * Method: POST
 * Body: { id: string, status: "scheduled" | "accepted" | "on_the_way_to_pickup" | "at_pickup" | "on_the_way_to_dropoff" | "at_dropoff" | "delivered" | "failed" | "cancelled" }
 */
export const setDeliveryStatus = onRequest(async (req, res) => {
  try {
    if (req.method !== "POST") {
      res.status(405).end();
      return;
    }
    const uid = await getUser(req);
    const { id, status } = req.body as {
      id: string;
      status:
        | "scheduled"
        | "accepted"
        | "on_the_way_to_pickup"
        | "at_pickup"
        | "on_the_way_to_dropoff"
        | "at_dropoff"
        | "delivered"
        | "failed"
        | "cancelled";
    };
    const ref = colDeliveries.doc(id);
    const doc = await ref.get();

    if (!doc.exists) {
      res.status(404).json({ error: "Delivery not found" });
      return;
    }

    const driver_uid = doc.get("driver_uid");
    // Ensure the driver or a dispatcher has permissions to change the status
    if (driver_uid && driver_uid !== uid && !["scheduled", "cancelled"].includes(status)) {
      // In a full application, you would add a check for a "dispatcher" role here.
      // For this example, we assume only the driver or the original requestor can change status.
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    await ref.update({ status, updated_at: FieldValue.serverTimestamp() });
    res.json({ ok: true });
  } catch (e: any) {
    console.error("Error setting delivery status:", e);
    res.status(400).json({ error: e?.message || "Failed to set delivery status" });
  }
});

/**
 * Logs telemetry data (location, speed, etc.) for a delivery in the Realtime Database.
 * Requires authentication and ownership of the delivery.
 * Method: POST
 * Body: { deliveryId: string, lat: number, lng: number, speed?, heading? }
 */
export const telemetry = onRequest(async (req, res) => {
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
      res.status(404).json({ error: "Delivery not found" });
      return;
    }

    const driver_uid = doc.get("driver_uid");
    if (driver_uid && driver_uid !== uid) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    // Write location data to Realtime Database for real-time updates
    await rtdb.ref(`deliveryLocations/${deliveryId}`).set({
      lat,
      lng,
      speed: speed ?? null,
      heading: heading ?? null,
      ts: ServerValue.TIMESTAMP,
    });

    // Write event to Firestore for historical record
    await colDeliveries.doc(deliveryId).collection("events").add({
      type: "telemetry",
      lat,
      lng,
      speed,
      heading,
      at: FieldValue.serverTimestamp(),
    });

    res.json({ ok: true });
  } catch (e: any) {
    console.error("Error logging telemetry:", e);
    res.status(400).json({ error: e?.message || "Failed to log telemetry" });
  }
});

/**
 * [NEW] - Realtime Database trigger for geofence checks and alerts.
 * This function listens for new location data from the 'telemetry' function.
 * It will check if the driver's location is within any pre-defined geofences
 * and create an alert in Firestore if a boundary is crossed.
 */
export const checkGeofenceAndAlerts = onValueUpdated(
  `deliveryLocations/{deliveryId}`,
  async (event) => {
    const deliveryId = event.params.deliveryId;
    const newLocation = event.data.after.val();

    // If there's no new location data, we can exit early.
    if (!newLocation || !newLocation.lat || !newLocation.lng) {
      return;
    }

    try {
      // Fetch all geofences from Firestore
      const geofencesSnapshot = await colGeofences.get();
      if (geofencesSnapshot.empty) {
        console.log("No geofences defined. Skipping check.");
        return;
      }

      // Iterate through each geofence to see if the driver is inside.
      for (const doc of geofencesSnapshot.docs) {
        const geofence = doc.data();
        const geofenceId = doc.id;
        const geofenceLat = geofence.lat;
        const geofenceLng = geofence.lng;
        const radius = geofence.radius || 100; // default radius of 100 meters

        const distance = getDistance(
          { latitude: newLocation.lat, longitude: newLocation.lng },
          { latitude: geofenceLat, longitude: geofenceLng }
        );

        // Check if the driver is within the geofence radius.
        if (distance <= radius) {
          // You would typically add logic here to check if the alert has already been fired for this geofence.
          // For this example, we'll just create a new alert.
          await colAlerts.add({
            deliveryId,
            geofenceId,
            geofenceName: geofence.name,
            type: "geofence-enter",
            location: newLocation,
            timestamp: FieldValue.serverTimestamp(),
          });
          console.log(
            `Alert: Driver for delivery ${deliveryId} entered geofence ${geofence.name}.`
          );
        }
      }
    } catch (error) {
      console.error("Error checking geofences:", error);
    }
  }
);

/**
 * A helper function to calculate the distance between two geographical points using the Haversine formula.
 * This is a simplified version and might not be as accurate as a dedicated library.
 */
function getDistance(
  coord1: { latitude: number; longitude: number },
  coord2: { latitude: number; longitude: number }
): number {
  const R = 6371e3; // metres
  const φ1 = (coord1.latitude * Math.PI) / 180; // φ, λ in radians
  const φ2 = (coord2.latitude * Math.PI) / 180;
  const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in metres
}

/**
 * Fetches a list of Wialon units and their sensors.
 * Requires authentication.
 * Method: POST
 *
 * NOTE: The 'wialon' npm package does not have type definitions available.
 * To avoid a TypeScript error, a simplified REST API call using 'fetch' is used instead.
 * This is a robust and deployable solution for Cloud Functions.
 */
export const getWialonUnits = onRequest(async (req, res) => {
  try {
    const wialonToken = process.env.WIALON_TOKEN;
    if (!wialonToken) {
      res.status(500).json({ error: "Wialon API token not configured" });
      return;
    }

    // Step 1: Login to get session ID and base URL
    const loginUrl = `https://hst-api.wialon.com/wialon/ajax.html?svc=token/login&params={"token":"${wialonToken}"}`;
    const loginResponse = await fetch(loginUrl);
    const loginData = await loginResponse.json();

    if (loginData.error) {
      res.status(401).json({ error: "Wialon login failed", details: loginData.error });
      return;
    }

    const sid = loginData.eid;
    const baseUrl = loginData.base_url;

    // Step 2: Search for units with the "Engine" sensor
    const searchParams = new URLSearchParams({
      svc: "core/search_items",
      sid: sid,
      params: JSON.stringify({
        spec: {
          itemsType: "avl_unit",
          propType: "propitemname",
          propName: "unit_sensors",
          propValueMask: "Engine",
          sortType: "sys_name",
        },
        force: 1,
        flags: 1,
        from: 0,
        to: 0,
      }),
    });
    const searchUrl = `${baseUrl}/wialon/ajax.html?${searchParams.toString()}`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    // Step 3: Get sensors for each unit
    const units = searchData.items;
    const unitsWithSensors = [];

    for (const unit of units) {
      const getSensorsParams = new URLSearchParams({
        svc: "unit/get_sensors",
        sid: sid,
        params: JSON.stringify({ itemId: unit.id }),
      });
      const getSensorsUrl = `${baseUrl}/wialon/ajax.html?${getSensorsParams.toString()}`;
      const sensorsResponse = await fetch(getSensorsUrl);
      const sensorsData = await sensorsResponse.json();

      unitsWithSensors.push({
        id: unit.id,
        name: unit.nm,
        sensors: sensorsData,
      });
    }

    res.json({ units: unitsWithSensors });
  } catch (e: any) {
    console.error("Error fetching Wialon units:", e);
    res.status(400).json({ error: e?.message || "Failed to fetch Wialon units" });
  }
});

/* ===================== ROUTE OPTIMIZE ===================== */
// Functions for using the Google Maps Directions API.

/**
 * Optimizes a route using the Google Maps Directions API.
 * Method: POST
 * Body: { origin: { lat, lng }, destination: { lat, lng }, waypoints: Array<{ lat, lng }>, mode? }
 */
export const optimizeRoute = onRequest(async (req, res) => {
  try {
    if (req.method !== "POST") {
      res.status(405).end();
      return;
    }
    await getUser(req); // Ensure user is authenticated before making the external call.
    const { origin, destination, waypoints, mode } = req.body as {
      origin: { lat: number; lng: number };
      destination: { lat: number; lng: number };
      waypoints: Array<{ lat: number; lng: number }>;
      mode?: "driving" | "walking" | "bicycling" | "transit";
    };

    // Check for the API key using a .env file
    const apiKey = process.env.GOOGLEMAPS_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: "Google Maps API key not configured" });
      return;
    }

    const params = new URLSearchParams({
      origin: `${origin.lat},${origin.lng}`,
      destination: `${destination.lat},${destination.lng}`,
      waypoints: `optimize:true|${waypoints.map((w) => `${w.lat},${w.lng}`).join("|")}`,
      mode: (mode ?? "driving").toLowerCase(),
      key: apiKey,
    });

    const url = `https://maps.googleapis.com/maps/api/directions/json?${params.toString()}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (e: any) {
    console.error("Error optimizing route:", e);
    res.status(400).json({ error: e?.message || "Failed to optimize route" });
  }
});
