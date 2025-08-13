// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") }
  },
  build: {
    outDir: "dist",   // 👈 Vite writes here
    sourcemap: true,
    emptyOutDir: true
  }
});
