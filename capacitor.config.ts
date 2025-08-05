import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: '1:250085264089:android:eddb5bd08de0b1b604ccc8',          // Gebruik jou eie unieke ID
  appName: 'matmobile',      // App naam, enige string
  webDir: 'dist',                      // Moet ooreenstem met jou Vite build output (moet nie verander nie!)
  bundledWebRuntime: false,             // Standaard, behalwe as jy ‘n baie spesifieke rede het
  plugins: {
    BarcodeScanner: {
      allowDuplicates: true,
      showZoom: true,
      showFlip: true,
      androidScanningLibrary: 'zxing'
    },
    Camera: {
      saveToGallery: false,
      resultType: 'base64'
    }
  }
};

export default config;
