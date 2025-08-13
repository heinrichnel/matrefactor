// src/server/routes/properties.ts
import { Router } from "express";

const r = Router();

r.get("/", async (_req, res) => {
  // TODO: fetch from DB
  res.json([]);
});

export default r; // <— MUST export something (default or named)
