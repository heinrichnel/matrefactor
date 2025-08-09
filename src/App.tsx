import React, { useEffect, useState } from "react";
import AppRoutes from "./AppRoutes";

// Context Providers
import { AppProvider } from "./context/AppContext";
import { DriverBehaviorProvider } from "./context/DriverBehaviorContext";
import { FlagsProvider } from "./context/FlagsContext";
import { FleetAnalyticsProvider } from "./context/FleetAnalyticsContext";
import { SyncProvider } from "./context/SyncContext";
import { TripProvider } from "./context/TripContext";
import { TyreReferenceDataProvider } from "./context/TyreReferenceDataContext";
import { TyreStoresProvider } from "./context/TyreStoresContext";
import { WialonProvider } from "./context/WialonProvider";
import { WorkshopProvider } from "./context/WorkshopContext";

// Error Handling
import DeploymentFallback from "./components/DeploymentFallback";
import ErrorBoundary from "./components/ErrorBoundary";
import FirestoreConnectionError from "./components/ui/FirestoreConnectionError";
import OfflineBanner from "./components/ui/OfflineBanner";
import {
  ErrorCategory,
  ErrorSeverity,
  handleError,
  registerErrorHandler,
} from "./utils/errorHandling";

// Offline & Network Support
import { initializeConnectionMonitoring } from "./utils/firebaseConnectionHandler";
import { startNetworkMonitoring } from "./utils/networkDetection";
import { initOfflineCache } from "./utils/offlineCache";
import { syncOfflineOperations } from "./utils/offlineOperations";

const App: React.FC = () => {
  const [connectionError, setConnectionError] = useState<Error | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const initializeServices = async () => {
      try {
        // Check if we're in a development environment with debugging enabled
        const debugMode = import.meta.env.VITE_DEBUG_DEPLOYMENT;

        if (debugMode) {
          console.log("🐛 Debug mode enabled - showing fallback");
          setHasError(true);
          setIsInitialized(true);
          return;
        }

        const unregisterErrorHandler = registerErrorHandler((error) => {
          console.error("Error handler triggered:", error);
          if (error.severity === ErrorSeverity.FATAL) {
            setConnectionError(error.originalError);
            setHasError(true);
          }
        });

        // Wrap initialization in try-catch to prevent blocking
        try {
          await initializeConnectionMonitoring();
        } catch (error) {
          console.warn("Failed to initialize Firebase connection:", error);
          const errorMessage = error instanceof Error ? error.message : String(error);
          setConnectionError(
            new Error(`Failed to initialize Firebase connection: ${errorMessage}`)
          );
        }

        try {
          await handleError(async () => await initOfflineCache(), {
            category: ErrorCategory.DATABASE,
            context: { component: "App", operation: "initOfflineCache" },
            maxRetries: 3,
          });
        } catch (error) {
          console.warn("Failed to initialize offline cache:", error);
          const errorMessage = error instanceof Error ? error.message : String(error);
          setConnectionError(new Error(`Failed to initialize offline cache: ${errorMessage}`));
        }

        startNetworkMonitoring(30000);
        const handleOnline = async () => {
          try {
            await handleError(async () => await syncOfflineOperations(), {
              category: ErrorCategory.NETWORK,
              context: { component: "App", operation: "syncOfflineOperations" },
              maxRetries: 3,
            });
          } catch {
            // Error is already handled by handleError utility
            // This empty catch prevents unhandled promise rejections
          }
        };
        window.addEventListener("online", handleOnline);

        setIsInitialized(true);

        return () => {
          window.removeEventListener("online", handleOnline);
          unregisterErrorHandler();
        };
      } catch (error) {
        console.error("Failed to initialize services:", error);
        setHasError(true);
        setIsInitialized(true); // Still mark as initialized to show the app
      }
    };

    initializeServices();
  }, []);

  // Show loading state until initialization is complete
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing application...</p>
        </div>
      </div>
    );
  }

  // Show fallback for debugging or critical errors
  if (hasError || import.meta.env.VITE_SHOW_FALLBACK) {
    return <DeploymentFallback />;
  }

  // Group context providers for better organization and performance
  const CoreProviders = ({ children }: { children: React.ReactNode }) => (
    <ErrorBoundary>
      <AppProvider>
        <SyncProvider>{children}</SyncProvider>
      </AppProvider>
    </ErrorBoundary>
  );

  // Group feature-specific providers
  const FeatureProviders = ({ children }: { children: React.ReactNode }) => (
    <WialonProvider>
      <TripProvider>
        <FleetAnalyticsProvider>
          <FlagsProvider>{children}</FlagsProvider>
        </FleetAnalyticsProvider>
      </TripProvider>
    </WialonProvider>
  );

  // Group data providers that might cause re-renders
  const DataProviders = ({ children }: { children: React.ReactNode }) => (
    <TyreStoresProvider>
      <DriverBehaviorProvider>
        <WorkshopProvider>
          <TyreReferenceDataProvider>{children}</TyreReferenceDataProvider>
        </WorkshopProvider>
      </DriverBehaviorProvider>
    </TyreStoresProvider>
  );

  return (
    <CoreProviders>
      <FeatureProviders>
        <DataProviders>
          {/* Application alerts and notifications */}
          <div className="fixed top-0 left-0 right-0 z-50 p-4">
            <FirestoreConnectionError />
            {connectionError && <FirestoreConnectionError error={connectionError} />}
          </div>

          <OfflineBanner />

          {/* Main application routes and layout */}
          <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex flex-col">
            <AppRoutes />
          </div>
        </DataProviders>
      </FeatureProviders>
    </CoreProviders>
  );
};

export default App;
