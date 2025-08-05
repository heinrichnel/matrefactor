import {
  Activity,
  BarChart3,
  ChevronDown,
  ChevronRight,
  CircleDot,
  FileText,
  Globe,
  Users,
} from "lucide-react";
import React, { FC, useState } from "react";
import ConnectionStatusIndicator from "../ui/ConnectionStatusIndicator";
import SyncIndicator from "../ui/SyncIndicator";

interface NavItem {
  id: string;
  label: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  route: string;
  children?: NavItem[];
}

const Truck = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
    {...props}
  >
    <path d="M10 17h4V5H2v12h3"></path>
    <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h1"></path>
    <path d="M14 17a2 2 0 1 0 4 0"></path>
    <path d="M5 17a2 2 0 1 0 4 0"></path>
  </svg>
);

interface SidebarProps {
  currentView: string;
  onNavigate: (route: string) => void;
}

const Sidebar: FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // *** ONLY ROUTES THAT EXIST IN App.tsx ***
  const navCategories: {
    id: string;
    label: string;
    items: NavItem[];
    route?: string;
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }[] = [
    // Main Navigation
    {
      id: "main",
      label: "Main Navigation",
      items: [{ id: "dashboard", label: "Dashboard", icon: Activity, route: "dashboard" }],
    },

    // Core Business Operations
    {
      id: "core",
      label: "Core Business Operations",
      items: [
        {
          id: "trips",
          label: "Trip Management",
          icon: Truck,
          route: "trips",
          children: [
            { id: "trips-dashboard", label: "Trip Dashboard", route: "trips/dashboard" },
            { id: "trips-main", label: "Trip Management Home", route: "trips" },
            { id: "active-trips", label: "Active Trips", route: "trips/active" },
            {
              id: "active-trips-enhanced",
              label: "Enhanced Active Trips",
              route: "active-trips-enhanced",
            },
            { id: "trip-dashboard-page", label: "Trip Dashboard Page", route: "trip-dashboard" },
            { id: "trip-management-page", label: "Trip Management Page", route: "trip-management" },
            {
              id: "completed-trips",
              label: "Completed Trips (Dashboard)",
              route: "trips/completed-dashboard",
            },
            { id: "completed-trips-page", label: "Completed Trips", route: "completed-trips" },
            { id: "route-planning", label: "Route Planning", route: "trips/planning" },
            { id: "route-planning-page", label: "Route Planning Page", route: "route-planning" },
            { id: "route-optimization", label: "Route Optimization", route: "trips/optimization" },
            {
              id: "route-optimization-page",
              label: "Route Optimization Page",
              route: "route-optimization",
            },
            { id: "load-planning", label: "Load Planning", route: "trips/load-planning" },
            { id: "load-planning-page", label: "Load Planning Page", route: "load-planning" },
            {
              id: "load-planning-component",
              label: "Load Planning Component",
              route: "load-planning-component",
            },
            { id: "missed-loads", label: "Missed Loads Tracker", route: "missed-loads" },
            { id: "add-new-trip", label: "Add New Trip", route: "trips/add" },
            { id: "add-trip-page", label: "Add Trip Page", route: "add-trip" },
            { id: "trip-calendar", label: "Trip Calendar", route: "trips/calendar" },
            { id: "trip-calendar-page", label: "Trip Calendar Page", route: "trip-calendar" },
            { id: "trip-timeline", label: "Trip Timeline", route: "trips/timeline" },
            { id: "trip-timeline-page", label: "Trip Timeline Page", route: "trip-timeline" },
            { id: "trip-report-page", label: "Trip Report Page", route: "trip-report" },
            { id: "trip-workflow", label: "Main Trip Workflow", route: "trips/workflow" },
            {
              id: "main-trip-workflow",
              label: "Main Trip Workflow Page",
              route: "trips/main-trip-workflow",
            },
            { id: "maps-tracking", label: "Maps & Tracking", route: "trips/maps" },
            { id: "fleet-location", label: "Fleet Location Map", route: "trips/fleet-location" },
            { id: "wialon-tracking", label: "Wialon Tracking", route: "trips/wialon-tracking" },
            { id: "flags", label: "Flags / Investigations", route: "trips/flags" },
            {
              id: "flags-investigations",
              label: "Flags Investigations Page",
              route: "flags-investigations",
            },
            {
              id: "driver-performance",
              label: "Driver Performance",
              route: "trips/driver-performance",
            },
            { id: "trip-cost-analysis", label: "Trip Cost Analysis", route: "trips/cost-analysis" },
            { id: "fleet-utilization", label: "Fleet Utilization", route: "trips/utilization" },
            {
              id: "delivery-confirmations",
              label: "Delivery Confirmations",
              route: "trips/confirmations",
            },
            {
              id: "load-confirmation",
              label: "New Load Confirmation",
              route: "trips/new-load-confirmation",
            },
            {
              id: "create-load-confirmation",
              label: "Create Load Confirmation",
              route: "trips/create-load-confirmation",
            },
            { id: "trip-templates", label: "Trip Templates", route: "trips/templates" },
            { id: "trip-reports", label: "Trip Reports", route: "trips/reports" },
            // Trip sub-pages
            { id: "trip-details", label: "Trip Details", route: "trips/trip-details" },
            { id: "trip-form", label: "Trip Form", route: "trips/trip-form" },
            { id: "trip-completion", label: "Trip Completion", route: "trips/trip-completion" },
            { id: "trip-invoicing", label: "Trip Invoicing", route: "trips/trip-invoicing" },
            {
              id: "flag-investigation",
              label: "Flag Investigation",
              route: "trips/flag-investigation",
            },
            { id: "payment-tracking", label: "Payment Tracking", route: "trips/payment-tracking" },
            { id: "reporting-panel", label: "Reporting Panel", route: "trips/reporting" },
            { id: "system-cost", label: "System Cost Generator", route: "trips/system-cost" },
            { id: "cost-entry", label: "Cost Entry Form", route: "trips/cost-entry" },
          ],
        },

        {
          id: "invoices",
          label: "Invoice Management",
          icon: FileText,
          route: "invoices",
          children: [
            { id: "invoice-dashboard", label: "Invoice Dashboard", route: "invoices/dashboard" },
            {
              id: "invoice-dashboard-page",
              label: "Invoice Dashboard Page",
              route: "invoice-dashboard",
            },
            { id: "invoice-home", label: "Invoice Management Home", route: "invoices" },
            {
              id: "invoice-management-page",
              label: "Invoice Management Page",
              route: "invoice-management",
            },
            { id: "create-invoice", label: "Create Invoice", route: "invoices/new" },
            { id: "create-invoice-page", label: "Create Invoice Page", route: "create-invoice" },
            { id: "create-quote", label: "Create Quote", route: "invoices/new-quote" },
            { id: "create-quote-page", label: "Create Quote Page", route: "create-quote" },
            { id: "pending-invoices", label: "Pending Invoices", route: "invoices/pending" },
            {
              id: "pending-invoices-page",
              label: "Pending Invoices Page",
              route: "pending-invoices",
            },
            { id: "paid-invoices", label: "Paid Invoices", route: "invoices/paid" },
            { id: "paid-invoices-page", label: "Paid Invoices Page", route: "paid-invoices" },
            { id: "invoice-approval", label: "Invoice Approval", route: "invoices/approval" },
            {
              id: "invoice-approval-flow",
              label: "Invoice Approval Flow",
              route: "invoice-approval-flow",
            },
            { id: "tax-export", label: "Tax Report Export", route: "invoices/tax-export" },
            {
              id: "tax-report-export",
              label: "Tax Report Export Page",
              route: "tax-report-export",
            },
            { id: "invoice-templates", label: "Invoice Templates", route: "invoices/templates" },
            {
              id: "invoice-templates-page",
              label: "Invoice Templates Page",
              route: "invoice-templates",
            },
            { id: "invoice-reports", label: "Invoice Reports", route: "invoices/reports" },
            { id: "invoice-builder", label: "Invoice Builder", route: "invoices/builder" },
            { id: "invoice-builder-page", label: "Invoice Builder Page", route: "invoice-builder" },
            { id: "invoice-batch", label: "Batch Processing", route: "invoices/batch-processing" },
            {
              id: "invoice-reconciliation",
              label: "Invoice Reconciliation",
              route: "invoices/reconciliation",
            },
            { id: "invoice-archives", label: "Invoice Archives", route: "invoices/archives" },
          ],
        },

        {
          id: "diesel",
          label: "Diesel Management",
          icon: CircleDot,
          route: "diesel",
          children: [
            { id: "diesel-dashboard", label: "Diesel Dashboard", route: "diesel/dashboard" },
            {
              id: "diesel-dashboard-page",
              label: "Diesel Dashboard Page",
              route: "diesel-dashboard",
            },
            { id: "diesel-home", label: "Diesel Management Home", route: "diesel" },
            {
              id: "diesel-management-page",
              label: "Diesel Management Page",
              route: "diesel-management",
            },
            { id: "diesel-analysis", label: "Diesel Analysis", route: "diesel-analysis" },
            { id: "fuel-logs", label: "Fuel Logs", route: "diesel/logs" },
            { id: "fuel-logs-page", label: "Fuel Logs Page", route: "diesel/fuel-logs" },
            { id: "add-fuel-entry", label: "Add Fuel Entry", route: "diesel/add-fuel" },
            { id: "add-fuel-entry-page", label: "Add Fuel Entry Page", route: "add-fuel-entry" },
            {
              id: "fuel-card-management",
              label: "Fuel Card Management",
              route: "diesel/card-manager",
            },
            {
              id: "fuel-theft-detection",
              label: "Fuel Theft Detection",
              route: "diesel/theft-detection",
            },
            {
              id: "fuel-theft-detection-page",
              label: "Fuel Theft Detection Page",
              route: "diesel/fuel-theft-detection",
            },
            { id: "carbon-footprint", label: "Carbon Footprint", route: "diesel/carbon-footprint" },
            {
              id: "carbon-footprint-calc",
              label: "Carbon Footprint Calculator",
              route: "diesel/carbon-footprint-calc",
            },
            {
              id: "driver-fuel-behavior",
              label: "Driver Fuel Behavior",
              route: "diesel/driver-behavior",
            },
            {
              id: "driver-fuel-behavior-page",
              label: "Driver Fuel Behavior Page",
              route: "diesel/driver-fuel-behavior",
            },
            { id: "cost-analysis", label: "Cost Analysis", route: "diesel/cost-analysis" },
            { id: "efficiency-reports", label: "Fuel Efficiency", route: "diesel/efficiency" },
            {
              id: "fuel-efficiency-report",
              label: "Fuel Efficiency Report",
              route: "diesel/fuel-efficiency-report",
            },
            { id: "budget-planning", label: "Budget Planning", route: "diesel/budget" },
            {
              id: "budget-planning-page",
              label: "Budget Planning Page",
              route: "diesel/budget-planning",
            },
            { id: "fuel-stations", label: "Fuel Stations", route: "diesel/fuel-stations" },
          ],
        },

        {
          id: "customers",
          label: "Customer Management",
          icon: Users,
          route: "clients",
          children: [
            { id: "customer-dashboard", label: "Customer Dashboard", route: "clients" },
            {
              id: "customer-dashboard-page",
              label: "Customer Dashboard",
              route: "customer-dashboard",
            },
            { id: "client-management", label: "Client Management", route: "clients/management" },
            { id: "add-new-customer", label: "Add New Customer", route: "clients/new" },
            {
              id: "add-new-customer-page",
              label: "Add New Customer Page",
              route: "clients/add-new-customer",
            },
            { id: "active-customers", label: "Active Customers", route: "clients/active" },
            {
              id: "active-customers-page",
              label: "Active Customers Page",
              route: "active-customers",
            },
            { id: "client-detail", label: "Client Detail", route: "client-detail" },
            { id: "customer-reports", label: "Customer Reports", route: "clients/reports" },
            {
              id: "customer-reports-page",
              label: "Customer Reports Page",
              route: "customer-reports",
            },
            { id: "customer-retention", label: "Customer Retention", route: "customers/retention" }, // matches App.tsx
            { id: "retention-metrics", label: "Retention Metrics", route: "retention-metrics" },
            {
              id: "client-relationships",
              label: "Client Relationships",
              route: "clients/relationships",
            },
            { id: "client-network", label: "Client Network Map", route: "clients/network" },
            {
              id: "client-network-map",
              label: "Client Network Map Page",
              route: "clients/client-network-map",
            },
          ],
        },
      ],
    },

    // HR & Compliance (only what exists)
    {
      id: "hr-compliance",
      label: "Human Resources & Compliance",
      items: [
        {
          id: "drivers",
          label: "Driver Management",
          icon: BarChart3,
          route: "drivers",
          children: [
            { id: "driver-dashboard", label: "Driver Dashboard", route: "drivers/dashboard" },
            {
              id: "driver-dashboard-page",
              label: "Driver Dashboard Page",
              route: "drivers/driver-dashboard",
            },
            { id: "driver-home", label: "Driver Management Home", route: "drivers" },
            {
              id: "driver-management-page",
              label: "Driver Management Page",
              route: "drivers/driver-management",
            },
            { id: "add-new-driver", label: "Add New Driver", route: "drivers/new" },
            {
              id: "add-new-driver-page",
              label: "Add New Driver Page",
              route: "drivers/add-new-driver",
            },
            { id: "driver-profiles", label: "Driver Profiles", route: "drivers/profiles" },
            {
              id: "driver-profiles-page",
              label: "Driver Profiles Page",
              route: "drivers/driver-profiles",
            },
            { id: "driver-details", label: "Driver Details", route: "drivers/details" },
            {
              id: "driver-details-page",
              label: "Driver Details Page",
              route: "drivers/driver-details",
            },
            { id: "edit-driver", label: "Edit Driver", route: "drivers/edit" },
            { id: "edit-driver-page", label: "Edit Driver Page", route: "drivers/edit-driver" },
            { id: "license-management", label: "License Management", route: "drivers/licenses" },
            {
              id: "license-management-page",
              label: "License Management Page",
              route: "drivers/license-management",
            },
            { id: "training-records", label: "Training Records", route: "drivers/training" },
            {
              id: "training-records-page",
              label: "Training Records Page",
              route: "drivers/training-records",
            },
            {
              id: "performance-analytics",
              label: "Performance Analytics",
              route: "drivers/performance",
            },
            {
              id: "performance-analytics-page",
              label: "Performance Analytics Page",
              route: "drivers/performance-analytics",
            },
            { id: "driver-scheduling", label: "Driver Scheduling", route: "drivers/scheduling" },
            {
              id: "driver-scheduling-page",
              label: "Driver Scheduling Page",
              route: "drivers/driver-scheduling",
            },
            { id: "hours-of-service", label: "Hours of Service", route: "drivers/hours" },
            {
              id: "hours-of-service-page",
              label: "Hours of Service Page",
              route: "drivers/hours-of-service",
            },
            { id: "driver-violations", label: "Driver Violations", route: "drivers/violations" },
            {
              id: "driver-violations-page",
              label: "Driver Violations Page",
              route: "drivers/driver-violations",
            },
            { id: "driver-rewards", label: "Driver Rewards", route: "drivers/rewards" },
            {
              id: "driver-rewards-page",
              label: "Driver Rewards Page",
              route: "drivers/driver-rewards",
            },
            {
              id: "driver-fuel-behavior",
              label: "Driver Fuel Behavior",
              route: "drivers/fuel-behavior",
            },
            {
              id: "driver-behavior-analytics",
              label: "Driver Behavior Analytics",
              route: "drivers/behavior",
            },
            { id: "safety-scores", label: "Safety Scores", route: "drivers/safety-scores" },
          ],
        },
      ],
    },

    // Wialon Integration (mapped to existing route)
    {
      id: "wialon",
      label: "Wialon Integration",
      route: "wialon",
      icon: Globe,
      items: [
        { id: "wialon-dashboard", label: "Wialon Dashboard", route: "wialon/dashboard" },
        { id: "wialon-dashboard-page", label: "Wialon Dashboard Page", route: "wialon-dashboard" },
        { id: "wialon-config", label: "Wialon Config", route: "wialon-config" },
        { id: "wialon-units", label: "Wialon Units", route: "wialon-units" },
        { id: "fleet-management", label: "Fleet Management", route: "fleet-management" },
      ],
    },

    // Workshop Management
    {
      id: "workshop",
      label: "Workshop Management",
      route: "workshop",
      icon: BarChart3,
      items: [
        { id: "workshop-dashboard", label: "Workshop Dashboard", route: "workshop" },
        { id: "workshop-page", label: "Workshop Page", route: "workshop-page" },
        { id: "workshop-operations", label: "Workshop Operations", route: "workshop-operations" },
        { id: "workshop-analytics", label: "Workshop Analytics", route: "workshop-analytics" },
        { id: "qr-generator", label: "QR Generator", route: "workshop/qr-generator" },
        {
          id: "qr-generator-page",
          label: "QR Generator Page",
          route: "workshop/qr-generator-page",
        },
        { id: "qr-scanner", label: "QR Scanner", route: "workshop/qr-scanner" },
        { id: "qr-scanner-page", label: "QR Scanner Page", route: "workshop/qr-scanner-page" },
        { id: "inspections", label: "Inspections", route: "workshop/inspections" },
        {
          id: "inspection-management",
          label: "Inspection Management",
          route: "inspection-management",
        },
        { id: "job-cards", label: "Job Cards", route: "workshop/job-cards" },
        { id: "job-card-management", label: "Job Card Management", route: "job-card-management" },
        { id: "job-card-kanban", label: "Job Card Kanban Board", route: "job-card-kanban" },
        {
          id: "work-order-management",
          label: "Work Order Management",
          route: "work-order-management",
        },
        { id: "faults", label: "Fault Tracking", route: "workshop/faults" },
        { id: "workshop-tyres", label: "Tyre Management", route: "workshop/tyres" },
        {
          id: "tyre-reference-data",
          label: "Tyre Reference Data",
          route: "workshop/tyres/reference-data",
        },
        { id: "parts-ordering", label: "Parts Ordering", route: "workshop/parts-ordering" },
        { id: "parts-ordering-page", label: "Parts Ordering Page", route: "parts-ordering" },
        {
          id: "vehicle-inspection",
          label: "Vehicle Inspection",
          route: "workshop/vehicle-inspection",
        },
        { id: "purchase-orders", label: "Purchase Orders", route: "workshop/purchase-orders" },
        {
          id: "purchase-order-page",
          label: "Purchase Order Page",
          route: "workshop/purchase-order",
        },
        {
          id: "purchase-order-tracker",
          label: "Purchase Order Tracker",
          route: "purchase-order-tracker",
        },
        {
          id: "purchase-order-detail",
          label: "Purchase Order Detail View",
          route: "purchase-order-detail",
        },
        { id: "po-approval-summary", label: "PO Approval Summary", route: "po-approval-summary" },
        { id: "stock-inventory", label: "Stock Inventory", route: "workshop/stock-inventory" },
        { id: "stock-inventory-page", label: "Stock Inventory Page", route: "stock-inventory" },
        { id: "parts-inventory", label: "Parts Inventory", route: "parts-inventory" },
        { id: "receive-parts", label: "Receive Parts", route: "receive-parts" },
        { id: "inventory-dashboard", label: "Inventory Dashboard", route: "inventory-dashboard" },
        { id: "inventory-page", label: "Inventory Page", route: "inventory" },
        { id: "inventory-reports", label: "Inventory Reports", route: "inventory-reports" },
        { id: "vendors", label: "Vendors", route: "workshop/vendors" },
        { id: "vendor-page", label: "Vendor Page", route: "workshop/vendor" },
        { id: "vendor-scorecard", label: "Vendor Scorecard", route: "vendor-scorecard" },
        { id: "report-incident", label: "Report New Incident", route: "report-new-incident" },
        {
          id: "workshop-integration-debug",
          label: "Integration Debug",
          route: "integration-debug/workshop",
        },
      ],
    },

    // Tyre Management
    {
      id: "tyres",
      label: "Tyre Management",
      route: "tyres",
      icon: BarChart3,
      items: [
        { id: "tyres-home", label: "Tyre Management Home", route: "tyres" },
        { id: "tyre-management-page", label: "Tyre Management Page", route: "tyres/management" },
        { id: "tyre-dashboard", label: "Tyre Performance Dashboard", route: "tyres/dashboard" },
        {
          id: "tyre-performance-dashboard",
          label: "Tyre Performance Dashboard Page",
          route: "tyre-performance-dashboard",
        },
        { id: "tyre-add", label: "Add New Tyre", route: "tyres/add" },
        { id: "add-new-tyre", label: "Add New Tyre Page", route: "tyres/add-new-tyre" },
        { id: "tyre-reference-data2", label: "Tyre Reference Data", route: "tyres/reference-data" },
        {
          id: "tyre-reference-manager-page",
          label: "Tyre Reference Manager Page",
          route: "tyres/reference-manager-page",
        },
        { id: "tyre-fleet-map", label: "Tyre Fleet Map", route: "tyres/fleet-map" },
        { id: "tyre-fleet-map-page", label: "Tyre Fleet Map Page", route: "tyre-fleet-map" },
        { id: "tyre-history", label: "Tyre History", route: "tyres/history" },
        { id: "tyre-history-page", label: "Tyre History Page", route: "tyre-history" },
        { id: "vehicle-tyre-view", label: "Vehicle Tyre View", route: "vehicle-tyre-view" },
        { id: "vehicle-tyre-view-a", label: "Vehicle Tyre View A", route: "vehicle-tyre-view-a" },
        { id: "tyre-stores", label: "Tyre Stores", route: "tyre-stores" },
        { id: "tyre-mobile", label: "Tyre Mobile", route: "tyres/mobile" },
        { id: "tyre-mobile-scanner", label: "Tyre Mobile Scanner", route: "tyres/mobile/scanner" },
        {
          id: "tyre-integration-debug",
          label: "Integration Debug",
          route: "integration-debug/tyres",
        },
      ],
    },

    // Inventory Management
    {
      id: "inventory",
      label: "Inventory Management",
      route: "inventory",
      icon: BarChart3,
      items: [
        { id: "inventory-home", label: "Inventory Home", route: "inventory" },
        { id: "inventory-dashboard", label: "Inventory Dashboard", route: "inventory/dashboard" },
        { id: "inventory-stock", label: "Parts Inventory", route: "inventory/stock" },
        { id: "inventory-ordering", label: "Ordering", route: "inventory/ordering" },
        { id: "inventory-receive", label: "Receive Parts", route: "inventory/receive" },
        { id: "inventory-reports", label: "Inventory Reports", route: "inventory/reports" },
      ],
    },

    // Additional Sections for Missing Pages
    {
      id: "compliance",
      label: "Compliance & Quality",
      items: [
        {
          id: "compliance-dashboard",
          label: "Compliance Dashboard",
          route: "compliance-dashboard",
        },
        { id: "qa-review-panel", label: "QA Review Panel", route: "qa-review-panel" },
      ],
    },

    {
      id: "finance",
      label: "Financial Management",
      items: [
        { id: "indirect-cost", label: "Indirect Cost Breakdown", route: "indirect-cost-breakdown" },
        { id: "year-to-date", label: "Year To Date KPIs", route: "year-to-date-kpis" },
      ],
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-100 border-r shadow flex flex-col z-30">
      <div className="flex items-center justify-center px-6 py-4 border-b bg-gray-100">
        <h1 className="font-bold text-black text-lg">MATANUSKA TRANSPORT</h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-2 max-h-[calc(100vh-160px)]">
        {navCategories.map((category) => (
          <div key={category.id} className="mb-4">
            {category.label && (
              <h3 className="px-6 mb-1 text-xs font-medium uppercase tracking-wider text-gray-500">
                {category.label}
              </h3>
            )}
            <ul className="space-y-1">
              {category.items.map(({ id, label, icon: Icon, route, children }) => {
                const normalizedRoute = route
                  ? route.startsWith("/")
                    ? route.substring(1)
                    : route
                  : "";
                const normalizedCurrentView = currentView.startsWith("/")
                  ? currentView.substring(1)
                  : currentView;

                const isActive = children
                  ? normalizedCurrentView === normalizedRoute ||
                    normalizedCurrentView.startsWith(`${normalizedRoute}/`)
                  : normalizedCurrentView === normalizedRoute;

                if (children) {
                  return (
                    <li key={id} className="mb-2">
                      <div
                        className={`w-full flex items-center justify-between gap-3 px-6 py-2 rounded-lg transition-colors text-left ${
                          isActive
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div
                          className="flex items-center gap-3 flex-grow text-left cursor-pointer"
                          onClick={(e) => {
                            toggleExpand(id, e);
                            if (route) {
                              onNavigate(route);
                            }
                          }}
                        >
                          {Icon && <Icon className="w-5 h-5" />}
                          <span>{label}</span>
                        </div>

                        <button
                          className="p-1 rounded-md hover:bg-gray-200 focus:outline-none"
                          onClick={(e) => toggleExpand(id, e)}
                          aria-label={expandedItems[id] ? "Collapse menu" : "Expand menu"}
                        >
                          {expandedItems[id] ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {expandedItems[id] && (
                        <ul className="space-y-1 mt-1">
                          {children.map((child: NavItem) => (
                            <li key={child.id}>
                              <button
                                className={`w-full flex items-center gap-3 px-12 py-2 rounded-lg transition-colors text-left ${
                                  currentView === child.route ||
                                  currentView === "/" + child.route ||
                                  currentView.startsWith(child.route + "/") ||
                                  currentView.startsWith("/" + child.route + "/")
                                    ? "bg-blue-50 text-blue-600 font-medium"
                                    : "text-gray-700 hover:bg-gray-50"
                                }`}
                                onClick={() => onNavigate(child.route)}
                              >
                                {child.icon && <child.icon className="w-5 h-5" />}
                                <span>{child.label}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                }

                return (
                  <li key={id}>
                    <button
                      className={`w-full flex items-center gap-3 px-6 py-2 rounded-lg transition-colors text-left ${
                        isActive
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => onNavigate(route)}
                    >
                      {Icon && <Icon className="w-5 h-5" />}
                      <span>{label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="px-6 py-4 border-t">
        <div className="flex flex-col space-y-2 mb-3">
          <ConnectionStatusIndicator showText={true} />
          <SyncIndicator showText={true} className="mt-1" />
        </div>
        <div className="flex items-center gap-3 mt-2">
          <Users className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-700">User</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
