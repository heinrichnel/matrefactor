import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, ChevronDown, ChevronRight, X } from "lucide-react"; // Using Lucide icons

interface SidebarProps {
  currentView: string; // This prop is not directly used in this standalone component but kept for consistency
  onNavigate: (view: string) => void; // Function to handle navigation, passed from parent
}

interface MenuGroup {
  title: string;
  icon: React.ReactNode;
  basePath: string;
  items: { label: string; path: string }[];
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  const location = useLocation();
  const [collapsedGroups, setCollapsedGroups] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false); // Sidebar is initially closed on mobile

  // Effect to close sidebar when navigating on mobile
  // This ensures the drawer closes after a link is clicked
  useEffect(() => {
    // Only close if the screen is small (mobile view)
    if (window.innerWidth < 1024) { // Assuming 'lg' breakpoint is 1024px
      setIsOpen(false);
    }
  }, [location.pathname]); // Re-run when the path changes

  const toggleGroup = (groupTitle: string) => {
    setCollapsedGroups((prev) =>
      prev.includes(groupTitle)
        ? prev.filter((g) => g !== groupTitle)
        : [...prev, groupTitle]
    );
  };

  const menuGroups: MenuGroup[] = [
    {
      title: "Dashboard",
      icon: <Menu className="h-5 w-5" />,
      basePath: "/dashboard",
      items: [{ label: "Main Dashboard", path: "/dashboard" }]
    },
    {
      title: "Trips",
      icon: <Menu className="h-5 w-5" />,
      basePath: "/trips",
      items: [
        { label: "Trip Dashboard", path: "/trips/dashboard" },
        { label: "Active Trips", path: "/trips/active" },
        { label: "Completed Trips", path: "/trips/completed" },
        { label: "Trip Calendar", path: "/trips/calendar" },
        { label: "Trip Timeline", path: "/trips/timeline" },
        { label: "Trip Reports", path: "/trips/reports" },
        { label: "Load Planning", path: "/trips/load-planning" },
        { label: "Load Planning Component", path: "/trips/load-planning-component" },
        { label: "Route Planning", path: "/trips/planning" },
        { label: "Route Optimization", path: "/trips/optimization" },
        { label: "Workflow", path: "/trips/workflow" },
        { label: "Missed Loads", path: "/trips/missed-loads" },
        { label: "Trip Details", path: "/trips/details" },
        { label: "Trip Management", path: "/trips/management" },
        { label: "Trip Management Integrated", path: "/trips/management-integrated" },
        { label: "Flag Investigations", path: "/trips/flags" }
      ]
    },
    {
      title: "Diesel",
      icon: <Menu className="h-5 w-5" />,
      basePath: "/diesel",
      items: [
        { label: "Diesel Dashboard", path: "/diesel/dashboard" },
        { label: "Diesel Analysis", path: "/diesel/analysis" }
      ]
    },
    {
      title: "Clients",
      icon: <Menu className="h-5 w-5" />,
      basePath: "/clients",
      items: [
        { label: "Client Management", path: "/clients/management" },
        { label: "Client Network Map", path: "/clients/network-map" }
      ]
    },
    {
      title: "Drivers",
      icon: <Menu className="h-5 w-5" />,
      basePath: "/drivers",
      items: [
        { label: "Driver Management", path: "/drivers/management" },
        { label: "Driver Dashboard", path: "/drivers/dashboard" }
      ]
    },
    {
      title: "Workshop",
      icon: <Menu className="h-5 w-5" />,
      basePath: "/workshop",
      items: [
        { label: "Workshop Overview", path: "/workshop" },
        { label: "Job Cards", path: "/workshop/job-cards" },
        { label: "Inspections", path: "/workshop/inspections" }
      ]
    },
    {
      title: "Tyres",
      icon: <Menu className="h-5 w-5" />,
      basePath: "/tyres",
      items: [
        { label: "Tyre Management", path: "/tyres/management" },
        { label: "Tyre Performance", path: "/tyres/performance" }
      ]
    },
    {
      title: "Inventory",
      icon: <Menu className="h-5 w-5" />,
      basePath: "/inventory",
      items: [
        { label: "Inventory Dashboard", path: "/inventory/dashboard" },
        { label: "Inventory Reports", path: "/inventory/reports" }
      ]
    },
    {
      title: "Analytics",
      icon: <Menu className="h-5 w-5" />,
      basePath: "/analytics",
      items: [
        { label: "Analytics Dashboard", path: "/analytics/dashboard" },
        { label: "Year-to-Date KPIs", path: "/analytics/kpis" }
      ]
    },
    {
      title: "Wialon & Maps",
      icon: <Menu className="h-5 w-5" />,
      basePath: "/wialon",
      items: [
        { label: "Wialon Dashboard", path: "/wialon/dashboard" },
        { label: "Wialon Units", path: "/wialon/units" },
        { label: "Fleet Location Map", path: "/maps/fleet-location" },
        { label: "Maps", path: "/maps" }
      ]
    }
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-50 text-gray-800 w-60 transform shadow-md ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-40 lg:translate-x-0`}
      >
        <div className="p-3 text-lg font-medium border-b border-gray-200 bg-white">
          Fleet Manager
        </div>
        <nav className="overflow-y-auto h-[calc(100%-2.75rem)]">
          {menuGroups.map((group) => {
            const isCollapsed = collapsedGroups.includes(group.title);
            const isActive = location.pathname.startsWith(group.basePath);

            return (
              <div key={group.title} className="border-b border-gray-200">
                <button
                  onClick={() => toggleGroup(group.title)}
                  className={`flex items-center justify-between w-full px-3 py-2 text-left hover:bg-blue-50 transition-colors ${
                    isActive ? "bg-blue-50 text-blue-700 font-medium" : ""
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {group.icon}
                    <span className="text-sm">{group.title}</span>
                  </div>
                  {isCollapsed ? (
                    <ChevronRight className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </button>
                {!isCollapsed && (
                  <div className="bg-white">
                    {group.items.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => onNavigate(item.path)}
                        className={`block px-7 py-1.5 text-xs hover:bg-gray-100 transition-colors ${
                          location.pathname === item.path ? "bg-gray-100 text-blue-700 font-medium" : "text-gray-700"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
      {/* Overlay for when drawer is open on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
