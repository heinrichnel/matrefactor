import React, { useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { Trip } from "../../types";
import Navigation from "./Navigation"; // Assuming this is the updated Navigation
import Sidebar from "./Sidebar";     // Assuming this is the updated Sidebar with drawer logic

interface LayoutProps {
  setShowTripForm: (show: boolean) => void;
  setEditingTrip: (trip: Trip | undefined) => void;
}

const Layout: React.FC<LayoutProps> = ({ setShowTripForm, setEditingTrip }) => {
  // Hooks
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
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
    navigate(hasQuery
      ? `/${view.split("?")[0]}?${view.split("?")[1]}`
      : `/${view.startsWith("/") ? view.substring(1) : view}`
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar is now responsible for its own mobile toggle and drawer behavior */}
      <Sidebar currentView={currentView} onNavigate={handleNavigate} />
      {/*
        This div now has 'lg:ml-60'. On large screens (lg:), it adds a left margin
        equal to the sidebar's width (60 units) to prevent content from being
        hidden behind the fixed sidebar. On smaller screens, the sidebar is a drawer
        and this margin is not applied, allowing the content to take full width.
      */}
      <div className="flex flex-col flex-1 overflow-hidden lg:ml-60">
        <Navigation />
        {/* Changed padding from p-3 md:p-4 to p-2 md:p-3 for a more compact layout */}
        <main className="flex-1 overflow-y-auto p-2 md:p-3">
          <Outlet context={{
            setSelectedTrip,
            setEditingTrip,
            setShowTripForm
          }} />
        </main>
      </div>
    </div>
  );
};

export default Layout;
