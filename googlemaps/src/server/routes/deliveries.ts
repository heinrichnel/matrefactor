// src/server/routes/deliveries.ts
import { Router } from "express";
import { io } from "../socket"; // Add missing import for Socket.IO
import { db } from "../db/client"; // Firebase client import
import { collection, doc, getDoc, getDocs, updateDoc, addDoc } from "firebase/firestore";

const r = Router();
r.get("/", async (_req, res) => {
  try {
    const deliveriesSnapshot = await getDocs(collection(db, "deliveries"));
    const deliveries = deliveriesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(deliveries);
  } catch (error) {
    console.error("Error fetching deliveries:", error);
    res.status(500).json({ error: "Failed to fetch deliveries" });
  }
});

r.post("/", async (req, res) => {
  /* create */
});

r.get("/:id", async (req, res) => {
  try {
    const docRef = doc(db, "deliveries", req.params.id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return res.status(404).json({ error: "Delivery not found" });
    }
    res.json({
      id: docSnap.id,
      ...docSnap.data(),
    });
  } catch (error) {
    console.error("Error fetching delivery:", error);
    res.status(500).json({ error: "Failed to fetch delivery" });
  }
});

r.post("/:id/status", async (req, res) => {
  try {
    const { status } = req.body; // validate transitions
    const deliveryRef = doc(db, "deliveries", req.params.id);
    await updateDoc(deliveryRef, { status });

    const updatedDoc = await getDoc(deliveryRef);
    res.json({
      id: updatedDoc.id,
      ...updatedDoc.data(),
    });
  } catch (error) {
    console.error("Error updating delivery status:", error);
    res.status(500).json({ error: "Failed to update delivery status" });
  }
});

r.post("/telemetry", async (req, res) => {
  try {
    const { deliveryId, lat, lng, speed, heading } = req.body;
    await addDoc(collection(db, "delivery_events"), {
      delivery_id: deliveryId,
      type: "telemetry",
      lat,
      lng,
      speed_kph: speed,
      heading,
      timestamp: new Date(),
    });

    io.to(`delivery:${deliveryId}`).emit("delivery:loc", { lat, lng, speed, heading });
    res.json({ ok: true });
  } catch (error) {
    console.error("Error storing telemetry:", error);
    res.status(500).json({ error: "Failed to store telemetry data" });
  }
});

export default r;
