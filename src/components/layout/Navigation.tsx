import { Bell, Search, Settings, User } from "lucide-react"; // Using Lucide icons
import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";

// Mock SyncContext for standalone demonstration
const SyncContext = React.createContext({ isOnline: true });
const useSyncContext = () => useContext(SyncContext);

const Navigation: React.FC = () => {
  const location = useLocation();
  const { isOnline } = useSyncContext();

  // Provide nav metadata for breadcrumb / current section display
  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/trips", label: "Trips" },
    { path: "/fleet", label: "Fleet" },
    { path: "/inventory", label: "Inventory" },
    { path: "/maintenance", label: "Maintenance" },
    { path: "/reports", label: "Reports" },
  ];

  // Determine active section label (fallback to empty string if not matched)
  const activeSection = navItems.find((i) => location.pathname.startsWith(i.path))?.label || "";

  return (
    <header className="bg-gray-50 border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center space-x-3">
          <Link to="/" className="text-base font-bold text-blue-500">
            Matanuska
          </Link>
          {activeSection && (
            <span className="hidden md:inline text-xs text-gray-400" aria-label="Current section">
              / {activeSection}
            </span>
          )}
        </div>
        <div className="hidden md:flex flex-1 mx-4 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-1.5 h-3.5 w-3.5 text-gray-300" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded border border-gray-200 pl-8 pr-2 py-1 text-xs focus:border-blue-300 focus:ring focus:ring-blue-50"
              aria-label="Global search"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              isOnline ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
            }`}
            aria-label={isOnline ? "Online" : "Offline"}
          >
            {isOnline ? "Online" : "Offline"}
          </div>
          <button className="p-1 rounded-full hover:bg-gray-100" aria-label="Notifications">
            <Bell className="h-3.5 w-3.5 text-gray-500" />
          </button>
          <button className="p-1 rounded-full hover:bg-gray-100" aria-label="Settings">
            <Settings className="h-3.5 w-3.5 text-gray-500" />
          </button>
          <button className="p-1 rounded-full hover:bg-gray-100" aria-label="User menu">
            <User className="h-3.5 w-3.5 text-gray-500" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
