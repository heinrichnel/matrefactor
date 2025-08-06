import React, { useEffect, useState } from "react";
import AppRoutes from "./AppRoutes";

// Context Providers
import { AppProvider } from "./context/AppContext";
import { DriverBehaviorProvider } from "./context/DriverBehaviorContext";
import { FleetAnalyticsProvider } from "./context/FleetAnalyticsContext";
import { SyncProvider } from "./context/SyncContext";
import { TripProvider } from "./context/TripContext";
import { TyreReferenceDataProvider } from "./context/TyreReferenceDataContext";
import { TyreStoresProvider } from "./context/TyreStoresContext";
import { WialonProvider } from "./context/WialonProvider";
import { WorkshopProvider } from "./context/WorkshopContext";

// Error Handling
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

  useEffect(() => {
    const unregisterErrorHandler = registerErrorHandler((error) => {
      if (error.severity === ErrorSeverity.FATAL) setConnectionError(error.originalError);
    });

    initializeConnectionMonitoring().catch((error) =>
      setConnectionError(new Error(`Failed to initialize Firebase connection: ${error.message}`))
    );
    handleError(async () => await initOfflineCache(), {
      category: ErrorCategory.DATABASE,
      context: { component: "App", operation: "initOfflineCache" },
      maxRetries: 3,
    }).catch((error) =>
      setConnectionError(new Error(`Failed to initialize offline cache: ${error.message}`))
    );

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

    return () => {
      window.removeEventListener("online", handleOnline);
      unregisterErrorHandler();
    };
  }, []);

  return (
    <ErrorBoundary>
      <AppProvider>
        <SyncProvider>
          <WialonProvider>
            <TyreStoresProvider>
              <TripProvider>
                <DriverBehaviorProvider>
                  <WorkshopProvider>
                    <FleetAnalyticsProvider>
                      <TyreReferenceDataProvider>
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
                      </TyreReferenceDataProvider>
                    </FleetAnalyticsProvider>
                  </WorkshopProvider>
                </DriverBehaviorProvider>
              </TripProvider>
            </TyreStoresProvider>
          </WialonProvider>
        </SyncProvider>
      </AppProvider>
    </ErrorBoundary>
  );
};

export default App;
