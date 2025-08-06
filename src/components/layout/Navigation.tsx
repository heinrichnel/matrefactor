import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, Search, Settings, User } from "lucide-react"; // Using Lucide icons

// Mock SyncContext for standalone demonstration
const SyncContext = React.createContext({ isOnline: true });
const useSyncContext = () => useContext(SyncContext);

const Navigation: React.FC = () => {
  const location = useLocation();
  const { isOnline } = useSyncContext();

  // The navItems array is no longer needed as the tabs are being removed.
  // Kept for reference if the user decides to re-introduce them differently.
  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/trips", label: "Trips" },
    { path: "/fleet", label: "Fleet" },
    { path: "/inventory", label: "Inventory" },
    { path: "/maintenance", label: "Maintenance" },
    { path: "/reports", label: "Reports" },
  ];

  return (
    // Changed background to a very light gray, border to a subtle gray, and shadow to a softer variant
    <header className="bg-gray-50 border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-3 py-2">

        {/* Logo */}
        <div className="flex items-center space-x-2">
          {/* Adjusted text color for a softer blue */}
          <Link to="/" className="text-base font-bold text-blue-500">
            Matanuska
          </Link>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 mx-4 max-w-md">
          <div className="relative w-full">
            {/* Adjusted icon color to a softer gray */}
            <Search className="absolute left-2.5 top-1.5 h-3.5 w-3.5 text-gray-300" />
            <input
              type="text"
              placeholder="Search..."
              // Adjusted border color and focus ring for a softer look
              className="w-full rounded border border-gray-200 pl-8 pr-2 py-1 text-xs focus:border-blue-300 focus:ring focus:ring-blue-50"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Adjusted online/offline badge colors for softer tones */}
          <div
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              isOnline ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
            }`}
          >
            {isOnline ? "Online" : "Offline"}
          </div>
          {/* Adjusted padding to p-1 and icon size to h-3.5 w-3.5, hover background to a very light gray */}
          <button className="p-1 rounded-full hover:bg-gray-100">
            <Bell className="h-3.5 w-3.5 text-gray-500" /> {/* Softer icon color */}
          </button>
          <button className="p-1 rounded-full hover:bg-gray-100">
            <Settings className="h-3.5 w-3.5 text-gray-500" /> {/* Softer icon color */}
          </button>
          <button className="p-1 rounded-full hover:bg-gray-100">
            <User className="h-3.5 w-3.5 text-gray-500" /> {/* Softer icon color */}
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs - These tabs have been removed as per your request. */}
      {/*
      <nav className="bg-gray-50 border-t border-gray-200 px-2">
        <div className="flex space-x-2 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-2 py-1.5 text-xs font-medium border-b-2 ${
                location.pathname.startsWith(item.path)
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-300"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
      */}
    </header>
  );
};

export default Navigation;
