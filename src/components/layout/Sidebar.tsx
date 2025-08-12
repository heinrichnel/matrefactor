import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge";

// Define a type for the sidebar items for better code organization
interface NavItem {
  name: string;
  path: string;
  children?: NavItem[];
  badge?: {
    text: string;
    color: string;
  };
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Dashboard",
    items: [
      { name: "Dashboard", path: "/dashboard" },
      {
        name: "Analytics",
        path: "/analytics",
        children: [
          { name: "YTD KPIs", path: "/ytd-kpis" },
          { name: "Performance", path: "/analytics" },
          { name: "Fleet Analytics", path: "/analytics/fleet" },
        ],
      },
      {
        name: "Compliance",
        path: "/compliance",
        badge: { text: "New", color: "bg-green-500" },
      },
    ],
  },
  {
    title: "Trips",
    items: [
      { name: "Trip Manager", path: "/trips" },
      {
        name: "Trip Planning",
        path: "/trips/planning",
        children: [
          { name: "Load Planning", path: "/trips/load-planning" },
          { name: "Route Planning", path: "/route-planning" },
          {
            name: "Route Optimization",
            path: "/route-optimization",
            badge: { text: "Beta", color: "bg-blue-500" },
          },
        ],
      },
      { name: "Trip Dashboard", path: "/trips/dashboard" },
    ],
  },
  {
    title: "Diesel",
    items: [
      { name: "Diesel Dashboard", path: "/diesel" },
      { name: "Management", path: "/diesel/manage" },
      { name: "Fuel Logs", path: "/diesel/fuel-logs" },
      { name: "Theft Detection", path: "/diesel/fuel-theft" },
    ],
  },
  {
    title: "Drivers",
    items: [
      { name: "Driver Management", path: "/drivers" },
      { name: "Performance", path: "/drivers/performance-analytics" },
      { name: "Safety Scores", path: "/drivers/safety-scores" },
      { name: "Hours of Service", path: "/drivers/hours-of-service" },
    ],
  },
  {
    title: "Clients",
    items: [
      { name: "Client Management", path: "/clients" },
      { name: "Client Dashboard", path: "/clients/dashboard" },
      { name: "Reports", path: "/clients/reports" },
      { name: "Network Map", path: "/clients/network-map" },
    ],
  },
  {
    title: "Invoices",
    items: [
      { name: "Invoice Dashboard", path: "/invoices" },
      { name: "Manage Invoices", path: "/invoices/manage" },
      { name: "Pending", path: "/invoices/pending" },
      { name: "Paid", path: "/invoices/paid" },
    ],
  },
  {
    title: "Workshop & Inventory",
    items: [
      { name: "Workshop", path: "/workshop" },
      { name: "Inventory", path: "/workshop/inventory" },
      { name: "Job Cards", path: "/workshop/job-cards" },
      { name: "Inspections", path: "/workshop/inspections" },
    ],
  },
  {
    title: "Tyres",
    items: [
      { name: "Tyre Management", path: "/tyres" },
      { name: "Tyre Dashboard", path: "/tyres/inventory" },
      { name: "Performance", path: "/tyres/performance" },
    ],
  },
  {
    title: "Maps & Tracking",
    items: [
      { name: "Maps Dashboard", path: "/maps" },
      {
        name: "Wialon Integration",
        path: "/maps/wialon",
        children: [
          { name: "Wialon Dashboard", path: "/maps/wialon" },
          { name: "Units & Tracking", path: "/maps/wialon/units" },
          { name: "Wialon Suite", path: "/maps/wialon/suite" },
          {
            name: "Live Tracking",
            path: "/maps/wialon/tracking",
            badge: { text: "Live", color: "bg-red-500" },
          },
        ],
      },
      { name: "Fleet Map", path: "/maps/fleet-map" },
    ],
  },
];

// NavItemComponent to handle nested navigation items
const NavItemComponent: React.FC<{
  item: NavItem;
  level?: number;
  closeSidebar: () => void;
}> = ({ item, level = 0, closeSidebar }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  // Check if this item or any of its children are active
  const isActive =
    currentPath === item.path ||
    (item.children?.some((child) => currentPath === child.path) ?? false);

  // Check if this item should be expanded based on current path
  const shouldBeExpanded =
    item.children?.some((child) => currentPath.startsWith(child.path)) ?? false;

  // Auto-expand if a child is active
  React.useEffect(() => {
    if (shouldBeExpanded) {
      setIsExpanded(true);
    }
  }, [shouldBeExpanded]);

  const toggleExpand = (e: React.MouseEvent) => {
    if (item.children) {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <li className="mb-1">
      {item.children ? (
        <div className="sidebar-nested-menu">
          <div
            onClick={toggleExpand}
            className={twMerge(
              "flex items-center justify-between p-2 rounded-lg cursor-pointer text-sm transition-all duration-200",
              "hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-700/30 dark:hover:text-white",
              isActive || shouldBeExpanded
                ? "bg-blue-100 text-blue-700 dark:bg-blue-700/20 dark:text-blue-300"
                : "text-gray-700 dark:text-gray-200"
            )}
          >
            <div className="flex items-center">
              <span className="truncate">{item.name}</span>
              {item.badge && (
                <span
                  className={`ml-2 px-1.5 py-0.5 text-xs rounded-full text-white ${item.badge.color}`}
                >
                  {item.badge.text}
                </span>
              )}
            </div>
            <div className="transform transition-transform duration-200 text-gray-500 dark:text-gray-400">
              {isExpanded ? "▼" : "►"}
            </div>
          </div>

          {isExpanded && (
            <ul
              className={`mt-1 ml-4 pl-2 border-l border-gray-200 dark:border-gray-600 space-y-1`}
            >
              {item.children.map((child) => (
                <NavItemComponent
                  key={child.path}
                  item={child}
                  level={level + 1}
                  closeSidebar={closeSidebar}
                />
              ))}
            </ul>
          )}
        </div>
      ) : (
        <NavLink
          to={item.path}
          onClick={closeSidebar} // Close sidebar on click for mobile
          className={({ isActive }) =>
            twMerge(
              "flex items-center p-2 rounded-lg text-sm transition-all duration-200",
              "hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-700/30 dark:hover:text-white",
              isActive
                ? "bg-blue-500 text-white dark:bg-blue-600 shadow-md active-nav-item"
                : "text-gray-700 dark:text-gray-200"
            )
          }
        >
          <span className="truncate">{item.name}</span>
          {item.badge && (
            <span
              className={`ml-auto px-1.5 py-0.5 text-xs rounded-full text-white ${item.badge.color}`}
            >
              {item.badge.text}
            </span>
          )}
        </NavLink>
      )}
    </li>
  );
};

// Update SidebarProps to receive the isOpen state and a function to close it.
interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  return (
    <>
      {/* The mobile toggle button is now handled by the Navigation component */}
      {/* Backdrop for mobile */}
      <div
        className={twMerge(
          "fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ease-in-out lg:hidden",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={closeSidebar}
        aria-hidden="true"
      ></div>

      {/* Sidebar Content */}
      <aside
        className={twMerge(
          "fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 flex flex-col shadow-lg z-[60] transform transition-all duration-300 ease-in-out",
          "border-r border-gray-200 dark:border-gray-700",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <Link to="/" className="flex items-center space-x-3">
            <img src="/src/assets/matanuska-logo.png" alt="Matanuska Logo" className="h-8" />
            <span className="font-semibold text-lg">Fleet Manager</span>
          </Link>
          <button
            onClick={closeSidebar}
            className="lg:hidden p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <span className="text-gray-500 dark:text-gray-400">Close</span>
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
              <span className="text-sm">AU</span>
            </div>
            <div className="ml-3">
              <p className="font-medium text-sm">Admin User</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
            </div>
            <div className="ml-auto flex space-x-2">
              <button className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                <span className="text-sm">Alerts</span>
              </button>
              <button className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                <span className="text-sm">Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 sidebar-scroll">
          {navSections.map((section) => (
            <div key={section.title} className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <NavItemComponent key={item.path} item={item} closeSidebar={closeSidebar} />
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-xs text-center text-gray-500 dark:text-gray-400">
          Fleet Manager v2.0 • © 2023
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
