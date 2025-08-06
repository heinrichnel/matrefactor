import React from "react";

import AppRoutes from "./AppRoutes";

import ErrorBoundary from "./components/ErrorBoundary";

import { AppProvider } from "./context/AppContext";

import { DriverBehaviorProvider } from "./context/DriverBehaviorContext";

import { FlagsProvider } from "./context/FlagsContext";

import { FleetAnalyticsProvider } from "./context/FleetAnalyticsContext";

import { InventoryProvider } from "./context/InventoryContext";

import { SyncProvider } from "./context/SyncContext";

import { TaskHistoryProvider } from "./context/TaskHistoryContext";

import { TripProvider } from "./context/TripContext";

import { TyreProvider } from "./context/TyreContext"; // Added missing import

import { TyreReferenceDataProvider } from "./context/TyreReferenceDataContext";

import { TyreStoresProvider } from "./context/TyreStoresContext";

import { WialonProvider } from "./context/WialonProvider";

import { WorkshopProvider } from "./context/WorkshopContext";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppProvider>
        <SyncProvider>
          <TripProvider>
            <TyreReferenceDataProvider>
              <TyreStoresProvider>
                <WorkshopProvider>
                  <WialonProvider>
                    <FleetAnalyticsProvider>
                      <DriverBehaviorProvider>
                        <FlagsProvider>
                          <InventoryProvider>
                            <TaskHistoryProvider>
                              <TyreProvider> {/* Added TyreProvider */}
                                <AppRoutes />
                              </TyreProvider>
                            </TaskHistoryProvider>
                          </InventoryProvider>
                        </FlagsProvider>
                      </DriverBehaviorProvider>
                    </FleetAnalyticsProvider>
                  </WialonProvider>
                </WorkshopProvider>
              </TyreStoresProvider>
            </TyreReferenceDataProvider>
          </TripProvider>
        </SyncProvider>
      </AppProvider>
    </ErrorBoundary>
  );
};

export default App;