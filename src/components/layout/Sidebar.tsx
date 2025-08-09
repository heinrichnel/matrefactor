import { ChevronDown, ChevronRight, Menu, X } from "lucide-react"; // Using Lucide icons
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

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
    if (window.innerWidth < 1024) {
      // Assuming 'lg' breakpoint is 1024px
      setIsOpen(false);
    }
  }, [location.pathname]); // Re-run when the path changes

  const toggleGroup = (groupTitle: string) => {
    setCollapsedGroups((prev) =>
      prev.includes(groupTitle) ? prev.filter((g) => g !== groupTitle) : [...prev, groupTitle]
    );
  };

  const menuGroups: MenuGroup[] = [
    {
      title: "Dashboard",
      icon: <Menu className="h-5 w-5" />,
      basePath: "/dashboard",
      items: [
        { label: "Main Dashboard", path: "/dashboard" },
        { label: "Consolidated Dashboard", path: "/dashboard/consolidated" }, // Added
        { label: "Dashboard Wrapper", path: "/dashboard/wrapper" }, // Added
        { label: "Forms Integration", path: "/forms-integration" }, // Added
      ],
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
        { label: "Trip Reports", path: "/trips/report" }, // Corrected path
        { label: "Load Planning (Inventory)", path: "/trips/load-planning" }, // Clarified
        { label: "Load Planning Component", path: "/trips/load-planning/component" }, // Corrected path
        { label: "Route Planning", path: "/route-planning" }, // Moved to top-level
        { label: "Route Optimization", path: "/route-optimization" }, // Moved to top-level
        { label: "Workflow", path: "/trips/workflow" },
        { label: "Missed Loads", path: "/trips/missed-loads" },
        { label: "Trip Details", path: "/trips/:tripId" }, // Dynamic path
        { label: "Trip Management", path: "/trips/manage" },
        { label: "Trip Management Integrated", path: "/trips/management-integrated" },
        { label: "Flag Investigations", path: "/flags" }, // Moved to top-level
        { label: "System Costs", path: "/trips/system-costs/:tripId" }, // Dynamic path
        { label: "Payment Tracking", path: "/trips/payments/:tripId" }, // Dynamic path
        { label: "Reporting Panel", path: "/trips/reports/:tripId" }, // Dynamic path
        { label: "Invoicing Panel", path: "/trips/invoicing/:tripId" }, // Dynamic path
        { label: "Completion Panel", path: "/trips/completion/:tripId" }, // Dynamic path
        { label: "Flag Investigation Panel", path: "/trips/flags/:tripId" }, // Dynamic path
        { label: "Cost Entry Form", path: "/trips/cost-entry" }, // Added
        { label: "Create Load Confirmation", path: "/trips/create-load-confirmation" }, // Added
        { label: "Flag Resolution Modal", path: "/trips/flag-resolution-modal" }, // Added
        { label: "Indirect Cost Breakdown", path: "/costs/indirect" }, // Moved to top-level
        { label: "Fleet Management", path: "/maps/fleet" }, // Moved to Maps section
      ],
    },
    {
      title: "Diesel",
      icon: <Menu className="h-5 w-5" />,
      basePath: "/diesel",
      items: [
        { label: "Diesel Dashboard", path: "/diesel/dashboard" },
        { label: "Diesel Analysis", path: "/diesel/analysis" },
        { label: "Diesel Management", path: "/diesel/manage" }, // Added
        { label: "Fuel Logs", path: "/diesel/fuel-logs" }, // Added
        { label: "Diesel Integrated", path: "/diesel/integrated" }, // Added
        { label: "Fuel Theft Detection", path: "/diesel/fuel-theft" }, // Added
        { label: "Driver Fuel Behavior", path: "/diesel/driver-fuel" }, // Added
        { label: "Fuel Efficiency Report", path: "/diesel/efficiency" }, // Added
        { label: "Fuel Card Manager", path: "/diesel/fuel-cards" }, // Added
        { label: "Budget Planning", path: "/diesel/budget" }, // Added
        { label: "Carbon Footprint Calc", path: "/diesel/carbon" }, // Added
        { label: "Cost Analysis", path: "/diesel/cost-analysis" }, // Added
        { label: "Fuel Stations", path: "/diesel/stations" }, // Added
        { label: "Add Fuel Entry", path: "/diesel/add-fuel" }, // Added
        { label: "Add Fuel Entry Wrapper", path: "/diesel/add-fuel-wrapper" }, // Added
        { label: "Diesel Component Dashboard", path: "/diesel/component-dashboard" }, // Added
      ],
    },
    {
      title: "Clients",
      icon: <Menu className="h-5 w-5" />,
      basePath: "/clients",
      items: [
        { label: "Client Management", path: "/clients/manage" }, // Corrected path
        { label: "Client Management Integrated", path: "/clients/integrated" }, // Added
        { label: "Client Network Map", path: "/clients/network-map" },
        { label: "Customer Dashboard", path: "/clients/dashboard" }, // Added
        { label: "Customer Reports", path: "/clients/reports" }, // Added
        { label: "Active Customers", path: "/clients/active" }, // Added
        { label: "Client Detail", path: "/clients/detail/:id" }, // Dynamic path
        { label: "Retention Metrics", path: "/clients/retention" }, // Added
        { label: "Add New Customer", path: "/clients/add" }, // Added
        { label: "Client Management Original", path: "/clients/management-original" }, // Added
        { label: "Client Selection Example", path: "/examples/client-selection" }, // Added from examples
      ],
    },
    {
      title: "Drivers",
      icon: <Menu className="h-5 w-5" />,
      basePath: "/drivers",
      items: [
        { label: "Driver Management", path: "/drivers/manage" }, // Corrected path
        { label: "Driver Dashboard", path: "/drivers/dashboard" },
        { label: "Driver Profiles", path: "/drivers/profiles" }, // Added
        { label: "Driver Management Integrated", path: "/drivers/integrated" }, // Added
        { label: "Driver Details", path: "/drivers/profiles/:id" }, // Dynamic path
        { label: "Driver Behavior", path: "/drivers/behavior" }, // Added
        { label: "Safety Scores", path: "/drivers/safety-scores" }, // Added
        { label: "Performance Analytics", path: "/drivers/performance-analytics" }, // Added
        { label: "Driver Rewards", path: "/drivers/rewards" }, // Added
        { label: "Driver Scheduling", path: "/drivers/scheduling" }, // Added
        { label: "Driver Violations", path: "/drivers/violations" }, // Added
        { label: "Hours of Service", path: "/drivers/hours-of-service" }, // Added
        { label: "Training Records", path: "/drivers/training" }, // Added
        { label: "License Management", path: "/drivers/licenses" }, // Added
        { label: "Add Driver", path: "/drivers/add" }, // Added
        { label: "Edit Driver", path: "/drivers/edit/:id" }, // Dynamic path
        { label: "Add New Driver", path: "/drivers/add-new" }, // Added
        { label: "Driver Details View", path: "/drivers/details-view/:id" }, // Added
        { label: "Driver Management Wrapper", path: "/drivers/management-wrapper" }, // Added
        { label: "Edit Driver Page", path: "/drivers/edit-driver-page/:id" }, // Added
      ],
    },
    {
      title: "Invoices",
      icon: <Menu className="h-5 w-5" />,
      basePath: "/invoices",
      items: [
        { label: "Invoice Dashboard", path: "/invoices" }, // Corrected path
        { label: "Invoice Management", path: "/invoices/manage" }, // Added
        { label: "Invoice Builder", path: "/invoices/builder" }, // Added
        { label: "Create Invoice", path: "/invoices/create" }, // Added
        { label: "Create Quote", path: "/invoices/quote" }, // Added
        { label: "Pending Invoices", path: "/invoices/pending" }, // Added
        { label: "Paid Invoices", path: "/invoices/paid" }, // Added
        { label: "Invoice Templates", path: "/invoices/templates" }, // Added
        { label: "Tax Report Export", path: "/invoices/tax-export" }, // Added
        { label: "Invoice Approval Flow", path: "/invoices/approval-flow" }, // Added
        { label: "Paid Invoices Component", path: "/invoices/paid-invoices-component" }, // Added
        { label: "Pending Invoices Component", path: "/invoices/pending-invoices-component" }, // Added
      ],
    },
    {
      title: "Workshop",
      icon: <Menu className="h-5 w-5" />,
      basePath: "/workshop",
      items: [
        { label: "Workshop Overview", path: "/workshop" },
        { label: "Job Cards", path: "/workshop/job-cards" },
        { label: "Job Card Kanban Board", path: "/workshop/job-cards/board" }, // Added
        { label: "Inspections", path: "/workshop/inspections" },
        { label: "Workshop Operations", path: "/workshop/operations" }, // Added
        { label: "Workshop Analytics", path: "/workshop/analytics" }, // Added
        { label: "Work Order Management", path: "/workshop/work-orders" }, // Added
        { label: "Purchase Orders", path: "/workshop/purchase-orders" }, // Added
        { label: "PO Tracker", path: "/workshop/po-tracker" }, // Added
        { label: "PO Detail View", path: "/workshop/po/:id" }, // Dynamic path
        { label: "PO Approval Summary", path: "/workshop/po-approval" }, // Added
        { label: "QR Generator", path: "/workshop/qr-generator" }, // Added
        { label: "QR Scanner", path: "/workshop/qr-scan" }, // Added
        { label: "Stock Inventory", path: "/workshop/stock" }, // Added
        { label: "Vendors", path: "/workshop/vendors" }, // Added
        { label: "Report New Incident", path: "/workshop/incident/new" }, // Added
        { label: "Action Log (QC)", path: "/workshop/action-log" }, // Added
        { label: "QA Review Panel (QC)", path: "/workshop/qa" }, // Added
        { label: "QA Review Panel Container (QC)", path: "/workshop/qa-review-container" }, // Added
      ],
    },
    {
      title: "Tyres",
      icon: <Menu className="h-5 w-5" />,
      basePath: "/tyres",
      items: [
        { label: "Tyre Management", path: "/tyres/manage" }, // Corrected path
        { label: "Tyre Performance Dashboard", path: "/tyres/performance" }, // Corrected path
        { label: "Tyre Reference Manager", path: "/tyres/reference" }, // Added
        { label: "Tyre History", path: "/tyres/history" }, // Added
        { label: "Tyre Fleet Map", path: "/tyres/fleet-map" }, // Added
        { label: "Tyre Stores", path: "/tyres/stores" }, // Added
        { label: "Vehicle Tyre View", path: "/tyres/vehicle-view" }, // Added
        { label: "Mobile Tyre Page", path: "/tyres/mobile" }, // Added
        { label: "Vehicle Tyre View A", path: "/tyres/vehicle-view-a" }, // Added
      ],
    },
    {
      title: "Inventory",
      icon: <Menu className="h-5 w-5" />,
      basePath: "/inventory",
      items: [
        { label: "Inventory Dashboard", path: "/inventory/dashboard" },
        { label: "Inventory Reports", path: "/inventory/reports" },
        { label: "Inventory Page", path: "/workshop/inventory" }, // Added (under workshop as per AppRoutes)
        { label: "Parts Inventory", path: "/workshop/parts" }, // Added (under workshop as per AppRoutes)
        { label: "Parts Ordering", path: "/workshop/parts-ordering" }, // Added (under workshop as per AppRoutes)
        { label: "Receive Parts", path: "/workshop/parts-receive" }, // Added (under workshop as per AppRoutes)
      ],
    },
    {
      title: "Analytics",
      icon: <Menu className="h-5 w-5" />,
      basePath: "/analytics",
      items: [
        { label: "Analytics Dashboard", path: "/analytics/dashboard" }, // Corrected path
        { label: "Year-to-Date KPIs", path: "/ytd-kpis" }, // Moved to top-level
        { label: "Performance Analytics", path: "/analytics" }, // Corrected path
        { label: "Vendor Scorecard", path: "/analytics/vendor-scorecard" }, // Added
        { label: "Fleet Analytics", path: "/analytics/fleet" }, // Added
        { label: "Main Analytics Dashboard", path: "/analytics/main-dashboard" }, // Added
        { label: "Compliance Dashboard (QC)", path: "/compliance" }, // Moved to top-level
      ],
    },
    {
      title: "Maps & Tracking",
      icon: <Menu className="h-5 w-5" />,
      basePath: "/maps",
      items: [
        // Fleet Maps
        { label: "Fleet Overview", path: "/maps" }, // Main Maps.tsx component
        { label: "Fleet Location Map", path: "/maps/fleet-map" },
        { label: "Maps Suite", path: "/maps/suite" }, // MapsSuitePage
        // Wialon Integration - grouped together
        { label: "Wialon Dashboard", path: "/maps/wialon" },
        { label: "Wialon Units", path: "/maps/wialon/units" },
        { label: "Wialon Config", path: "/maps/wialon/config" },
        // Remove duplicate entries that should be consolidated
        // { label: "Wialon Map Component", path: "/maps/wialon/component" }, // Duplicate - remove
        // { label: "Wialon Map Dashboard", path: "/maps/wialon/map-dashboard" }, // Duplicate - remove
        // { label: "Wialon Map Page", path: "/maps/wialon/map-page" }, // Duplicate - remove
      ],
    },
    {
      title: "Forms Testing",
      icon: <Menu className="h-5 w-5" />,
      basePath: "/forms-test",
      items: [
        { label: "Forms Test Wrapper", path: "/forms-test" }, // Added
        { label: "Drivers Forms Test", path: "/forms-test/drivers" }, // Added
        { label: "Clients Forms Test", path: "/forms-test/clients" }, // Added
      ],
    },
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
            // Check if any item in the group is active, or if the base path matches
            const isActive =
              group.items.some((item) => location.pathname.startsWith(item.path.split(":")[0])) ||
              location.pathname.startsWith(group.basePath);

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
                        to={item.path.includes(":") ? item.path.split(":")[0] : item.path} // Handle dynamic paths for navigation
                        onClick={() => onNavigate(item.path)}
                        className={`block px-7 py-1.5 text-xs hover:bg-gray-100 transition-colors ${
                          location.pathname === item.path ||
                          (item.path.includes(":") &&
                            location.pathname.startsWith(item.path.split(":")[0]))
                            ? "bg-gray-100 text-blue-700 font-medium"
                            : "text-gray-700"
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
