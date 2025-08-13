// src/server/routes/routes.ts
import { Router } from "express";
import axios from "axios";
const r = Router();

r.post("/optimize", async (req, res) => {
  const { origin, destination, waypoints, mode } = req.body;
  const params = new URLSearchParams({
    origin: `${origin.lat},${origin.lng}`,
    destination: `${destination.lat},${destination.lng}`,
    waypoints: `optimize:true|` + waypoints.map((w: any) => `${w.lat},${w.lng}`).join("|"),
    mode: (mode || "driving").toLowerCase(),
    key: process.env.GMAPS_SERVER_KEY!,
  });
  const url = `https://maps.googleapis.com/maps/api/directions/json?${params.toString()}`;
  const { data } = await axios.get(url);
  res.json(data);
});

export default r;
