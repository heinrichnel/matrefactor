// src/components/layout/Layout.tsx
import React, { Suspense, useMemo, useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { TripSelectionProvider, useTripSelection } from "../../context/TripSelectionContext";
import type { Trip } from "../../types"; // canonical Trip from your barrel
import { ErrorBoundary } from "../common/ErrorBoundary";
import Navigation from "./Navigation";
import SelectedTripBanner from "./SelectedTripBanner";
import Sidebar from "./Sidebar";

interface LayoutProps {
  setShowTripForm: (show: boolean) => void;
  setEditingTrip: (trip: Trip | undefined) => void;
}

/** Only enforce presence of additionalCosts; do NOT assume other fields (e.g., name) exist. */
const normalizeTrip = (t: Partial<Trip>): Trip => {
  return {
    ...(t as Trip), // keep whatever the caller provides
    additionalCosts: t.additionalCosts ?? [], // ensure required field
  };
};

const Layout: React.FC<LayoutProps> = ({ setShowTripForm, setEditingTrip }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  useAppContext();

  const currentView = useMemo(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    if (parts.length === 0) return "dashboard";
    if (parts.length > 1) return parts.join("/");
    return parts[0] === "workshop" && searchParams.get("tab")
      ? `workshop-${searchParams.get("tab")}`
      : parts[0];
  }, [location.pathname, searchParams]);

  const handleNavigate = (view: string) => {
    const hasQuery = view.includes("?");
    navigate(
      hasQuery
        ? `/${view.split("?")[0]}?${view.split("?")[1]}`
        : `/${view.startsWith("/") ? view.slice(1) : view}`
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Ensure Sidebar accepts these props (see Sidebar note below) */}
      <Sidebar currentView={currentView} onNavigate={handleNavigate} />

      <div className="flex flex-col flex-1 overflow-hidden lg:ml-60">
        <Navigation />
        <TripSelectionProvider>
          {selectedTrip && (
            <LegacyTripStateBridge
              trip={normalizeTrip(selectedTrip)}
              clear={() => setSelectedTrip(null)}
            />
          )}
          <SelectedTripBanner />
          <main className="flex-1 overflow-y-auto p-2 md:p-3" role="main">
            <Suspense fallback={<div className="p-4 text-xs text-gray-500">Loading...</div>}>
              <ErrorBoundary>
                <Outlet
                  context={{
                    setSelectedTrip,
                    setEditingTrip,
                    setShowTripForm,
                  }}
                />
              </ErrorBoundary>
            </Suspense>
          </main>
        </TripSelectionProvider>
      </div>
    </div>
  );
};

const LegacyTripStateBridge: React.FC<{ trip: Trip; clear: () => void }> = ({ trip }) => {
  const { selectedTrip, setSelectedTrip } = useTripSelection();
  useEffect(() => {
    if (!selectedTrip /* first time */) {
      setSelectedTrip(trip);
    }
  }, [selectedTrip, setSelectedTrip, trip]);
  return null;
};

export default Layout;
