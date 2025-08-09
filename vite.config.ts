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
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
        // Add specific aliases to handle case sensitivity issues
        "~/components/TyreManagement": resolve(__dirname, "src/components/Tyremanagement"),
        "@vis.gl/react-google-maps/examples.js":
          "https://visgl.github.io/react-google-maps/scripts/examples.js",
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
      exclude: ["lucide-react"],
    },
    build: {
      outDir: "dist",
      sourcemap: true,
      // Increase warning limit slightly to reduce noise while we optimize
      chunkSizeWarningLimit: 1800,
      // Ensure the output directory is emptied before building
      emptyOutDir: true,
      // Create output folder structure based on src
      assetsDir: "assets",
      rollupOptions: {
        external: [
          // Add the TyreReports file to handle the casing issue
          "/src/components/TyreManagement/TyreReports",
          // Explicitly externalize Node.js tools that shouldn't be bundled for browser
          "jiti",
          "v8",
          "perf_hooks",
        ],
        output: {
          // Create more granular chunks to optimize loading
          manualChunks: {
            // Core vendor libraries
            "react-vendor": ["react", "react-dom", "react-router-dom"],
            // Firebase modules - grouped to prevent mixed import issues
            "firebase-core": ["firebase/app", "firebase/auth", "firebase/firestore"],
            // Scanning/barcode functionality
            scanner: ["@capacitor-community/barcode-scanner", "@capacitor/core"],
            // Document generation libraries
            "document-tools": ["jspdf", "jspdf-autotable", "xlsx"],
            // Date handling
            "date-utils": ["date-fns"],
            // UI components and icons
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
