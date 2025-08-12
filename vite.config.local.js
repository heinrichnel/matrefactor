import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import fs from "fs";
import { resolve } from "path";
import { defineConfig } from "vite";

// Load local environment variables
const env = dotenv.parse(fs.readFileSync(".env.local"));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Use local API key from .env.local if available
    "process.env.GOOGLE_MAPS_API_KEY": JSON.stringify(env.GOOGLE_MAPS_API_KEY || ""),
  },
  server: {
    host: true,
    port: 5173,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
