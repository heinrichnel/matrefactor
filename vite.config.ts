import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import { resolve } from "path";
import { defineConfig } from "vite";

// Load environment variables
dotenv.config();
dotenv.config({ path: ".env.local", override: true });

// https://vitejs.dev/config/
export default defineConfig(() => {
  // Get API key from environment variable
  const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || "";

  return {
    plugins: [react()],
    define: {
      "process.env.GOOGLE_MAPS_API_KEY": JSON.stringify(GOOGLE_MAPS_API_KEY),
    },
    server: {
      host: true,
      port: 5173,
      proxy: {
        "/api": {
          target: "https://us-central1-mat1-9e6b3.cloudfunctions.net",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    ssr: {
      // Prevent SSR optimizer from pulling Node builds into client
      noExternal: [],
      external: ["firebase-admin", "googleapis", "@sentry/node", "v8", "jiti"],
    },
    resolve: {
      alias: {
        "@": "/src",
        "~/components/TyreManagement": resolve(__dirname, "src/components/Tyremanagement"),
        "@vis.gl/react-google-maps/examples.js":
          "https://visgl.github.io/react-google-maps/scripts/examples.js",
        // Specific shims for Node.js modules
        v8: resolve(__dirname, "src/shims/v8.js"),
        jiti: resolve(__dirname, "src/shims/jiti"),
        "jiti/*": resolve(__dirname, "src/shims/jiti/*"),
      },
    },
    optimizeDeps: {
      include: [
        "firebase/app",
        "firebase/firestore",
        "firebase/auth",
        "jspdf",
        "jspdf-autotable",
        "xlsx",
        "date-fns",
        "@capacitor-community/barcode-scanner",
      ],
      exclude: ["lucide-react", "firebase-admin", "googleapis", "@sentry/node", "v8", "jiti"],
    },
    build: {
      outDir: "dist",
      sourcemap: true,
      chunkSizeWarningLimit: 1800,
      emptyOutDir: true,
      assetsDir: "assets",
      rollupOptions: {
        external: [
          "/src/components/TyreManagement/TyreReports",
          "firebase-admin",
          "googleapis",
          "@sentry/node",
          "jiti",
          "v8",
          "perf_hooks",
          "node:*", // Exclude all Node.js built-in modules
          // Prevent babel/core and related from being resolved incorrectly
          "@babel/core",
          "babel-core",
        ],
        output: {
          manualChunks: {
            "react-vendor": ["react", "react-dom", "react-router-dom"],
            "firebase-core": ["firebase/app", "firebase/auth", "firebase/firestore"],
            scanner: ["@capacitor-community/barcode-scanner", "@capacitor/core"],
            "document-tools": ["jspdf", "jspdf-autotable", "xlsx"],
            "date-utils": ["date-fns"],
            "ui-components": [
              "lucide-react",
              "tailwindcss",
              "@radix-ui/react-tabs",
              "@radix-ui/react-label",
            ],
          },
        },
      },
    },
  };
});
