import React, { useEffect, useState } from "react";
import AppRoutes from "./AppRoutes";

// ---------- Context Providers ----------
import { AppProvider } from "./context/AppContext";
import { DriverBehaviorProvider } from "./context/DriverBehaviorContext";
import { FlagsProvider } from "./context/FlagsContext";
import { FleetAnalyticsProvider } from "./context/FleetAnalyticsContext";
import { InventoryProvider } from "./context/InventoryContext";
import { SyncProvider } from "./context/SyncContext";
import { TaskHistoryProvider } from "./context/TaskHistoryContext";
import { TripProvider } from "./context/TripContext";
import { TripSelectionProvider } from "./context/TripSelectionContext";
import { TyreProvider } from "./context/TyreContext";
import { TyreReferenceDataProvider } from "./context/TyreReferenceDataContext";
import { TyreStoresProvider } from "./context/TyreStoresContext";
import { WialonProvider } from "./context/WialonProvider";
import { WorkshopProvider } from "./context/WorkshopContext";

// ---------- UI Providers ----------
import AntDesignProvider from "./components/ui/AntDesignProvider";

/**
 * AppProviders component that wraps all the context providers in the application.
 * This ensures a clean organization of the provider nesting structure.
 */
const AppProviders: React.FC<React.PropsWithChildren> = ({ children }) => (
  <AntDesignProvider>
    <AppProvider>
      <SyncProvider>
        <WialonProvider>
          <InventoryProvider>
            <TripProvider>
              <TaskHistoryProvider>
                <TripSelectionProvider>
                  <DriverBehaviorProvider>
                    <WorkshopProvider>
                      <FleetAnalyticsProvider>
                        <FlagsProvider>
                          <TyreStoresProvider>
                            <TyreProvider>
                              <TyreReferenceDataProvider>{children}</TyreReferenceDataProvider>
                            </TyreProvider>
                          </TyreStoresProvider>
                        </FlagsProvider>
                      </FleetAnalyticsProvider>
                    </WorkshopProvider>
                  </DriverBehaviorProvider>
                </TripSelectionProvider>
              </TaskHistoryProvider>
            </TripProvider>
          </InventoryProvider>
        </WialonProvider>
      </SyncProvider>
    </AppProvider>
  </AntDesignProvider>
);

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

  return (
    <ErrorBoundary>
      <AppProviders>
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
      </AppProviders>
    </ErrorBoundary>
  );
};

export default App;
