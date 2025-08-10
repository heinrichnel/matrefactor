import React, { Suspense, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { Trip } from "../../types";
import Navigation from "./Navigation"; // Assuming this is the updated Navigation
import Sidebar from "./Sidebar"; // Assuming this is the updated Sidebar with drawer logic
import { TripSelectionProvider, useTripSelection } from "../../context/TripSelectionContext";
import SelectedTripBanner from "./SelectedTripBanner";
import { ErrorBoundary } from "../common/ErrorBoundary";

interface LayoutProps {
  setShowTripForm: (show: boolean) => void;
  setEditingTrip: (trip: Trip | undefined) => void;
}

const Layout: React.FC<LayoutProps> = ({ setShowTripForm, setEditingTrip }) => {
  // Hooks
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null); // legacy state for backward compat
  useAppContext();

  // Calculate current view from URL path
  const currentView = useMemo(() => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    if (pathSegments.length === 0) return "dashboard";
    if (pathSegments.length > 1) return pathSegments.join("/");
    return pathSegments[0] === "workshop" && searchParams.get("tab")
      ? `workshop-${searchParams.get("tab")}`
      : pathSegments[0];
  }, [location.pathname, searchParams]);

  // Navigation handler
  const handleNavigate = (view: string) => {
    const hasQuery = view.includes("?");
    navigate(
      hasQuery
        ? `/${view.split("?")[0]}?${view.split("?")[1]}`
        : `/${view.startsWith("/") ? view.substring(1) : view}`
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentView={currentView} onNavigate={handleNavigate} />
      <div className="flex flex-col flex-1 overflow-hidden lg:ml-60">
        <Navigation />
        <TripSelectionProvider>
          {selectedTrip && (
            <LegacyTripStateBridge trip={selectedTrip} clear={() => setSelectedTrip(null)} />
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

// Bridge component to sync legacy selectedTrip state into new context without breaking existing pages.
const LegacyTripStateBridge: React.FC<{ trip: Trip; clear: () => void }> = ({ trip }) => {
  const { selectedTrip, setSelectedTrip } = useTripSelection();
  if (!selectedTrip || selectedTrip.id !== trip.id) {
    setSelectedTrip(trip);
  }
  return null;
};

export default Layout;
