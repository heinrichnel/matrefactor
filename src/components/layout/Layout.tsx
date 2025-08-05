import React, { useState } from "react";
import { Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { Trip } from "../../types";
import Sidebar from "./Sidebar";

interface LayoutProps {
  setShowTripForm: (show: boolean) => void;
  setEditingTrip: (trip: Trip | undefined) => void;
}

const Layout: React.FC<LayoutProps> = ({ setShowTripForm, setEditingTrip }) => {
  const location = useLocation();
  const navigate = useNavigate();
  useAppContext(); // Keep this to ensure we're still using the AppContext
  const [searchParams] = useSearchParams();

  // State for outlet context
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  // Use the props for editingTrip and showTripForm
  const handleSetEditingTrip = (trip: Trip | undefined) => {
    setEditingTrip(trip);
  };

  const handleShowTripForm = (show: boolean) => {
    setShowTripForm(show);
  };

  // Get current path from location to determine active menu item
  const currentView = (() => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    if (pathSegments.length === 0) return "dashboard";

    // If we have a subpath, include it to properly highlight nested menu items
    if (pathSegments.length > 1) {
      return pathSegments.join("/");
    }

    // Special handling for workshop with tabs
    if (pathSegments[0] === "workshop") {
      const tab = searchParams.get("tab");
      if (tab) return `workshop-${tab}`;
    }

    return pathSegments[0];
  })();

  // Navigate to a new route
  const handleNavigate = (view: string) => {
    // Handle special cases like workshop?tab=tyres
    if (view.includes("?")) {
      const [path, query] = view.split("?");
      navigate(`/${path}?${query}`);
    } else {
      // Always ensure path starts with a slash for consistent routing
      const formattedPath = view.startsWith("/") ? view : `/${view}`;
      navigate(formattedPath);
      console.log(`Navigating to: ${formattedPath}`);
    }
  };

  // Context object to pass to outlet
  const outletContext = {
    setSelectedTrip,
    setEditingTrip: handleSetEditingTrip,
    setShowTripForm: handleShowTripForm,
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <Sidebar currentView={currentView} onNavigate={handleNavigate} />
      <main className="ml-64 p-6 pt-8">
        {/* widened container: no max-w cap, full width with responsive padding */}
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-4">
            {/* The title should be rendered by the page component instead of here */}
            <div></div>
          </div>

          {/* Outlet renders the active route component */}
          <Outlet context={outletContext} />
        </div>
      </main>
    </div>
  );
};

export default Layout;
