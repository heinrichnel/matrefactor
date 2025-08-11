import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import { TyreProvider } from "./context/TyreContext";
import { TyreStoresProvider } from "./context/TyreStoresContext";
import "./index.css";
import "./styles/enhanced-ui.css";
import { getEnvVar, initBrowserEnv } from "./utils/envUtils";
import { initializeConnectionMonitoring } from "./utils/firebaseConnectionHandler";

// Initialize global environment variables for safer access
// This prevents "import.meta" errors in non-module contexts
try {
  // Handle potential import.meta errors by using a try-catch approach
  const envVars: Record<string, string> = {};

  // Safely access environment variables
  const envKeys = [
    "VITE_WIALON_SESSION_TOKEN",
    "VITE_WIALON_LOGIN_URL",
    "VITE_GOOGLE_MAPS_API_KEY",
    "VITE_ENV_MODE",
    "VITE_FIREBASE_API_KEY",
    "VITE_FIREBASE_AUTH_DOMAIN",
    "VITE_FIREBASE_PROJECT_ID",
    "VITE_USE_EMULATOR",
  ];

  // Safely access each environment variable
  envKeys.forEach((key) => {
    try {
      envVars[key] = getEnvVar(key, "");
    } catch {
      console.warn(`Could not access ${key} from import.meta.env`);
    }
  });

  initBrowserEnv(envVars);
} catch (error) {
  console.warn("Failed to initialize environment variables globally:", error);
}

// Function to render the application
const renderApp = (isDev: boolean) => {
  // Import AntDesignProvider lazily to ensure React is fully initialized
  const AntDesignProvider = React.lazy(() => import("./components/ui/AntDesignProvider"));

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <ErrorBoundary>
        <React.Suspense fallback={<div>Loading UI components...</div>}>
          <AntDesignProvider>
            <TyreStoresProvider>
              <TyreProvider>
                {/* This is the single, correct top-level Router for the entire app */}
                <BrowserRouter>
                  {isDev && <div className="dev-indicator">Development Mode</div>}
                  <App />
                </BrowserRouter>
              </TyreProvider>
            </TyreStoresProvider>
          </AntDesignProvider>
        </React.Suspense>
      </ErrorBoundary>
    </React.StrictMode>
  );
};

// Initialize the application with better error handling
const initializeApp = async () => {
  const isDev = getEnvVar("MODE", "") === "development" || process.env.NODE_ENV === "development";

  try {
    // Always render the app first to show something
    renderApp(isDev);

    // Then initialize services in the background
    try {
      await import("./firebase");
      console.log("🔥 Firebase initialized successfully");

      // Initialize connection monitoring
      try {
        await initializeConnectionMonitoring();
        console.log("🔄 Firebase connection monitoring initialized");
      } catch (connError) {
        console.warn("⚠️ Could not initialize connection monitoring:", connError);
      }
    } catch (firebaseError) {
      console.error("❌ Failed to initialize Firebase:", firebaseError);
      // Don't block the app if Firebase fails
    }

    // Validate environment variables
    const requiredEnvVars = [
      "VITE_FIREBASE_API_KEY",
      "VITE_FIREBASE_AUTH_DOMAIN",
      "VITE_FIREBASE_PROJECT_ID",
    ];

    const missingVars = requiredEnvVars.filter((key) => !getEnvVar(key, ""));
    const isValid = missingVars.length === 0;

    console.log(
      "Environment validation:",
      isValid ? "✅ Valid" : "❌ Issues found",
      missingVars.length > 0 ? `Missing: ${missingVars.join(", ")}` : ""
    );

    // Check emulator status in development - but handle any errors
    if (isDev) {
      try {
        const { checkEmulatorsStatus } = await import("./firebaseEmulators");
        const status = await checkEmulatorsStatus();

        if (status.firestore && status.storage) {
          console.log("✅ Firebase emulators are running and accessible");
        } else {
          console.log("⚠️ Firebase emulators not detected - using production configuration");
        }
      } catch (emulatorError) {
        console.warn("⚠️ Could not check emulator status:", emulatorError);
      }
    }
  } catch (error) {
    console.error("❌ Failed to initialize application:", error);
    // Still render the app even if initialization fails
    renderApp(isDev);
  }
};

// Initialize the application
initializeApp();
