import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import { nodePolyfills } from 'vite-plugin-node-polyfills'; // Import the plugin

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // To disable specific polyfills, add them here.
      // For example, to disable 'fs' polyfill:
      // include: ['util', 'buffer'],
      // exclude: ['fs'],
      //
      // globals: {
      //   Buffer: true,
      // },
      // protocols: {
      //   'http:': true,
      //   'https:': true,
      // },
      // Removed 'perf_hooks' and 'v8' from exclude as they are not valid options
      // and are causing TypeScript errors. The core issue is jiti bundling.
    }),
  ],
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
        // Explicitly externalize 'jiti' as it's a Node.js runtime tool
        // and should not be bundled for the browser.
        "jiti",
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
});
