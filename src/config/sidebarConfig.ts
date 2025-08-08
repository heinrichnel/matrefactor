// Sidebar menu configuration for mapping menu options to routes and components
// Matanuska Transport Platform (2025) - Unified Routing & Sidebar Mapping
export interface SidebarItem {
  id: string;
  label: string;
  path: string;
  component: string; // import path
  icon?: string;
  children?: SidebarItem[]; // For hierarchical navigation
  subComponents?: string[]; // Additional components that might be needed by this menu item
}

export const sidebarConfig: SidebarItem[] = [
  // Dashboard
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    component: "pages/DashboardPage",
    icon: "chart-bar",
  },

  // Trip Management Section
  {
    id: "trip-management",
    label: "Trip Management",
    path: "/trips",
    component: "pages/TripManagementPage",
    icon: "truck",
    children: [
      {
        id: "trip-dashboard",
        label: "Trip Dashboard",
        path: "/trips/dashboard",
        component: "pages/TripDashboardPage",
      },
      {
        id: "active-trips",
        label: "Active Trips",
        path: "/trips/active",
        component: "pages/ActiveTripsPageEnhanced",
      },
      {
        id: "completed-trips",
        label: "Completed Trips",
        path: "/trips/completed",
        component: "pages/CompletedTrips",
      },
      {
        id: "route-planning",
        label: "Route Planning",
        path: "/trips/route-planning",
        component: "pages/RoutePlanningPage",
      },
      {
        id: "route-optimization",
        label: "Route Optimization",
        path: "/trips/optimization",
        component: "pages/RouteOptimizationPage",
        subComponents: ["components/TripManagement/OptimizedRouteSuggestion"],
      },
      {
        id: "load-planning",
        label: "Load Planning",
        path: "/trips/load-planning",
        component: "pages/LoadPlanningPage",
        subComponents: ["components/TripManagement/LoadPlanningComponent"],
      },
      {
        id: "load-planning-component",
        label: "Load Planning Component",
        path: "/trips/load-planning/component",
        component: "pages/LoadPlanningComponentPage",
      },
      {
        id: "trip-calendar",
        label: "Trip Calendar",
        path: "/trips/calendar",
        component: "pages/TripCalendarPage",
      },
      {
        id: "trip-timeline",
        label: "Trip Timeline",
        path: "/trips/timeline",
        component: "pages/trips/TripTimelinePage",
      },
      {
        id: "add-trip",
        label: "Add New Trip",
        path: "/trips/new",
        component: "pages/AddTripPage",
        subComponents: ["components/TripManagement/TripForm"],
      },
      {
        id: "trip-workflow",
        label: "Trip Workflow",
        path: "/trips/workflow",
        component: "pages/trips/MainTripWorkflow",
        subComponents: [
          "pages/trips/TripForm",
          "pages/trips/CostEntryForm",
          "pages/trips/SystemCostGenerator",
          "pages/trips/FlagInvestigationPanel",
          "pages/trips/TripCompletionPanel",
          "pages/trips/TripInvoicingPanel",
          "pages/trips/PaymentTrackingPanel",
          "pages/trips/ReportingPanel",
        ],
      },
      {
        id: "create-load-confirmation",
        label: "Create Load Confirmation",
        path: "/trips/new-load-confirmation",
        component: "pages/trips/CreateLoadConfirmationPage",
      },
      {
        id: "trip-reports",
        label: "Trip Reports",
        path: "/trips/reports",
        component: "pages/TripReportPage",
        subComponents: ["components/TripManagement/TripReport"],
      },
      {
        id: "missed-loads",
        label: "Missed Loads Tracker",
        path: "/trips/missed-loads",
        component: "pages/MissedLoadsTracker",
      },
    ],
  },

  // Invoice Management Section
  {
    id: "invoices",
    label: "Invoices",
    path: "/invoices",
    component: "pages/invoices/InvoiceManagementPage",
    icon: "file-invoice",
    children: [
      {
        id: "invoice-dashboard",
        label: "Dashboard",
        path: "/invoices/dashboard",
        component: "pages/invoices/InvoiceDashboard",
      },
      {
        id: "create-invoice",
        label: "Create New Invoice",
        path: "/invoices/new",
        component: "pages/invoices/CreateInvoicePage",
      },
      {
        id: "create-quote",
        label: "Create New Quote",
        path: "/invoices/new-quote",
        component: "pages/invoices/CreateQuotePage",
      },
      {
        id: "pending-invoices",
        label: "Pending Invoices",
        path: "/invoices/pending",
        component: "pages/invoices/PendingInvoicesPage",
      },
      {
        id: "paid-invoices",
        label: "Paid Invoices",
        path: "/invoices/paid",
        component: "pages/invoices/PaidInvoicesPage",
      },
      {
        id: "invoice-approval",
        label: "Invoice Approval",
        path: "/invoices/approval",
        component: "pages/invoices/InvoiceApprovalFlow",
      },
      {
        id: "invoice-builder",
        label: "Invoice Builder",
        path: "/invoices/builder",
        component: "pages/invoices/InvoiceBuilder",
      },
      {
        id: "invoice-templates",
        label: "Invoice Templates",
        path: "/invoices/templates",
        component: "pages/invoices/InvoiceTemplatesPage",
      },
      {
        id: "tax-reports",
        label: "Tax Reports",
        path: "/invoices/tax-reports",
        component: "pages/invoices/TaxReportExport",
      },
    ],
  },

  // Diesel Management Section
  {
    id: "diesel",
    label: "Diesel Management",
    path: "/diesel",
    component: "pages/diesel/DieselManagementPage",
    icon: "gas-pump",
    children: [
      {
        id: "diesel-dashboard",
        label: "Dashboard",
        path: "/diesel/dashboard",
        component: "pages/DieselDashboard",
        subComponents: ["pages/diesel/DieselDashboardComponent"],
      },
      {
        id: "diesel-analysis",
        label: "Diesel Analysis",
        path: "/diesel/analysis",
        component: "pages/DieselAnalysis",
      },
      {
        id: "fuel-logs",
        label: "Fuel Logs",
        path: "/diesel/fuel-logs",
        component: "pages/diesel/FuelLogs",
      },
      {
        id: "add-fuel-entry",
        label: "Add New Entry",
        path: "/diesel/add-entry",
        component: "pages/diesel/AddFuelEntryPage",
      },
      {
        id: "fuel-card-management",
        label: "Fuel Card Management",
        path: "/diesel/fuel-cards",
        component: "pages/diesel/FuelCardManager",
      },
      {
        id: "fuel-analytics",
        label: "Fuel Analytics",
        path: "/diesel/efficiency",
        component: "pages/diesel/FuelEfficiencyReport",
      },
      {
        id: "fuel-stations",
        label: "Fuel Stations",
        path: "/diesel/stations",
        component: "pages/diesel/FuelStations",
      },
      {
        id: "diesel-cost-analysis",
        label: "Cost Analysis",
        path: "/diesel/cost-analysis",
        component: "pages/diesel/CostAnalysis",
      },
      {
        id: "fuel-theft-detection",
        label: "Theft Detection",
        path: "/diesel/fuel-theft",
        component: "pages/diesel/FuelTheftDetection",
      },
      {
        id: "carbon-footprint",
        label: "Carbon Footprint",
        path: "/diesel/carbon",
        component: "pages/diesel/CarbonFootprintCalc",
      },
      {
        id: "driver-fuel-behavior",
        label: "Driver Behavior",
        path: "/diesel/driver-fuel",
        component: "pages/diesel/DriverFuelBehavior",
      },
      {
        id: "budget-planning",
        label: "Budget Planning",
        path: "/diesel/budget",
        component: "pages/diesel/BudgetPlanning",
      },
    ],
  },
  // Clients Section
  {
    id: "clients",
    label: "Clients",
    path: "/clients",
    component: "pages/clients/ClientManagementPage",
    icon: "users",
    children: [
      {
        id: "customer-dashboard",
        label: "Client Dashboard",
        path: "/clients/dashboard",
        component: "components/CustomerManagement/CustomerDashboard",
      },
      {
        id: "add-new-customer",
        label: "Add New Client",
        path: "/clients/new",
        component: "pages/clients/AddNewCustomer",
      },
      {
        id: "active-customers",
        label: "Active Clients",
        path: "/clients/active",
        component: "pages/clients/ActiveCustomers",
      },
      {
        id: "customer-reports",
        label: "Client Reports",
        path: "/clients/reports",
        component: "pages/clients/CustomerReports",
        subComponents: ["components/CustomerManagement/CustomerReports"],
      },
      {
        id: "customer-retention",
        label: "Retention Metrics",
        path: "/customers/retention",
        component: "components/CustomerManagement/RetentionMetrics",
        subComponents: ["components/Performance/CustomerRetentionDashboard"],
      },
      {
        id: "client-relationships",
        label: "Client Network",
        path: "/clients/network",
        component: "pages/clients/ClientNetworkMap",
      },
    ],
  },

  // Drivers Section
  {
    id: "drivers",
    label: "Drivers",
    path: "/drivers",
    component: "pages/drivers/DriverManagementPage",
    icon: "id-badge",
    children: [
      {
        id: "driver-dashboard",
        label: "Driver Dashboard",
        path: "/drivers/dashboard",
        component: "pages/drivers/DriverDashboard",
      },
      {
        id: "add-new-driver",
        label: "Add New Driver",
        path: "/drivers/new",
        component: "pages/drivers/AddNewDriver",
      },
      {
        id: "driver-profiles",
        label: "Driver Profiles",
        path: "/drivers/profiles",
        component: "pages/drivers/DriverProfiles",
      },
      {
        id: "license-management",
        label: "License Management",
        path: "/drivers/licenses",
        component: "pages/drivers/LicenseManagement",
      },
      {
        id: "training-records",
        label: "Training Records",
        path: "/drivers/training",
        component: "pages/drivers/TrainingRecords",
      },
      {
        id: "driver-performance-analytics",
        label: "Performance Analytics",
        path: "/drivers/performance",
        component: "pages/drivers/PerformanceAnalytics",
      },
      {
        id: "driver-scheduling",
        label: "Scheduling",
        path: "/drivers/scheduling",
        component: "pages/drivers/DriverScheduling",
      },
      {
        id: "hours-of-service",
        label: "Hours of Service",
        path: "/drivers/hours",
        component: "pages/drivers/HoursOfService",
      },
      {
        id: "driver-violations",
        label: "Violations",
        path: "/drivers/violations",
        component: "pages/drivers/DriverViolations",
      },
      {
        id: "driver-rewards",
        label: "Rewards Program",
        path: "/drivers/rewards",
        component: "pages/drivers/DriverRewards",
      },
      {
        id: "driver-behavior",
        label: "Behavior Monitoring",
        path: "/drivers/behavior",
        component: "pages/drivers/DriverBehaviorPage",
      },
      {
        id: "safety-scores",
        label: "Safety Scores",
        path: "/drivers/safety-scores",
        component: "pages/drivers/SafetyScores",
      },
    ],
  },

  // Compliance Management Section
  {
    id: "compliance",
    label: "Compliance Management",
    path: "/compliance",
    component: "pages/compliance/ComplianceManagementPage",
    icon: "clipboard-check",
    children: [
      {
        id: "compliance-dashboard",
        label: "Dashboard",
        path: "/compliance/dashboard",
        component: "pages/compliance/ComplianceDashboard",
      },
      {
        id: "dot-compliance",
        label: "DOT Compliance",
        path: "/compliance/dot",
        component: "pages/compliance/DOTCompliancePage",
      },
      {
        id: "safety-inspections",
        label: "Safety Inspections",
        path: "/compliance/safety-inspections",
        component: "pages/compliance/SafetyInspectionsPage",
        subComponents: [
          "components/workshop/InspectionList",
          "components/workshop/InspectionReportForm",
        ],
      },
      {
        id: "incident-reports",
        label: "Incident Management",
        path: "/compliance/incidents",
        component: "pages/compliance/IncidentManagement",
      },
      {
        id: "training-compliance",
        label: "Training Records",
        path: "/compliance/training",
        component: "pages/compliance/TrainingCompliancePage",
      },
      {
        id: "audit-management",
        label: "Audit Management",
        path: "/compliance/audits",
        component: "pages/compliance/AuditManagement",
      },
      {
        id: "violation-tracking",
        label: "Violations",
        path: "/compliance/violations",
        component: "pages/compliance/ViolationTracking",
      },
      {
        id: "insurance-management",
        label: "Insurance",
        path: "/compliance/insurance",
        component: "pages/compliance/InsuranceManagement",
      },
    ],
  },

  // Fleet Analytics Section
  {
    id: "analytics",
    label: "Fleet Analytics",
    path: "/analytics",
    component: "pages/analytics/FleetAnalyticsPage",
    icon: "chart-line",
    children: [
      {
        id: "analytics-dashboard",
        label: "Dashboard",
        path: "/analytics/dashboard",
        component: "pages/analytics/AnalyticsDashboard",
      },
      {
        id: "kpi-monitoring",
        label: "KPI Monitoring",
        path: "/analytics/kpi",
        component: "pages/analytics/AnalyticsInsights",
      },
      {
        id: "year-to-date-kpis",
        label: "Year to Date KPIs",
        path: "/analytics/year-to-date-kpis",
        component: "pages/analytics/YearToDateKPIs",
      },
      {
        id: "predictive-analysis",
        label: "Predictive Analysis",
        path: "/analytics/predictive",
        component: "pages/analytics/PredictiveAnalysisPage",
      },
      {
        id: "costs-analytics",
        label: "Cost Analytics",
        path: "/analytics/costs",
        component: "pages/analytics/CostsAnalyticsPage",
      },
      {
        id: "roi-calculator",
        label: "ROI Calculator",
        path: "/analytics/roi",
        component: "pages/analytics/ROICalculatorPage",
      },
      {
        id: "benchmarks",
        label: "Benchmarking",
        path: "/analytics/benchmarks",
        component: "pages/analytics/VehiclePerformance",
      },
      {
        id: "custom-reports",
        label: "Custom Reports",
        path: "/analytics/custom-reports",
        component: "pages/analytics/CreateCustomReport",
      },
    ],
  },

  // Workshop Section
  {
    id: "workshop",
    label: "Workshop Management",
    path: "/workshop",
    component: "pages/workshop/WorkshopPage",
    icon: "wrench",
    children: [
      {
        id: "fleet-setup",
        label: "Fleet Setup",
        path: "/workshop/fleet-setup",
        component: "pages/workshop/FleetTable",
        subComponents: ["components/workshop/FleetSelector", "components/workshop/FleetFormModal"],
      },
      {
        id: "maintenance-scheduler",
        label: "Maintenance Scheduler",
        path: "/workshop/maintenance-scheduler",
        component: "pages/workshop/MaintenanceSchedulerPage",
        children: [
          {
            id: "upcoming-maintenance",
            label: "Upcoming Maintenance",
            path: "/workshop/maintenance-scheduler/upcoming",
            component: "pages/workshop/UpcomingMaintenancePage",
          },
          {
            id: "maintenance-history",
            label: "Maintenance History",
            path: "/workshop/maintenance-scheduler/history",
            component: "pages/workshop/MaintenanceHistoryPage",
          },
          {
            id: "maintenance-templates",
            label: "Maintenance Templates",
            path: "/workshop/maintenance-scheduler/templates",
            component: "pages/workshop/MaintenanceTemplatePage",
          },
        ],
      },
      {
        id: "vehicle-inspection",
        label: "Vehicle Inspection",
        path: "/workshop/vehicle-inspection",
        component: "pages/vehicle-inspection/VehicleInspectionPage",
        children: [
          {
            id: "inspection-checklist",
            label: "Inspection Checklists",
            path: "/workshop/vehicle-inspection/checklists",
            component: "pages/vehicle-inspection/ChecklistPage",
          },
          {
            id: "inspection-reports",
            label: "Inspection Reports",
            path: "/workshop/vehicle-inspection/reports",
            component: "pages/vehicle-inspection/InspectionReportsPage",
          },
          {
            id: "defect-management",
            label: "Defect Management",
            path: "/workshop/vehicle-inspection/defects",
            component: "pages/vehicle-inspection/DefectManagementPage",
          },
        ],
      },
      {
        id: "parts-inventory",
        label: "Parts Inventory",
        path: "/workshop/parts-inventory",
        component: "pages/workshop/PartsInventoryPage",
        children: [
          {
            id: "inventory-management",
            label: "Inventory Management",
            path: "/workshop/parts-inventory/management",
            component: "pages/workshop/InventoryManagementPage",
          },
          {
            id: "orders-and-suppliers",
            label: "Orders & Suppliers",
            path: "/workshop/parts-inventory/orders",
            component: "pages/workshop/OrdersAndSuppliersPage",
          },
        ],
      },
      {
        id: "service-requests",
        label: "Service Requests",
        path: "/workshop/service-requests",
        component: "pages/workshop/ServiceRequestsPage",
      },
      {
        id: "workshop-planning",
        label: "Workshop Planning",
        path: "/workshop/planning",
        component: "pages/workshop/WorkshopPlanningPage",
      },
    ],
  },

  // Reports Section
  {
    id: "reports",
    label: "Reports",
    path: "/reports",
    component: "pages/reports/ReportsPage",
    icon: "file-alt",
    children: [
      {
        id: "financial-reports",
        label: "Financial Reports",
        path: "/reports/financial",
        component: "pages/reports/FinancialReportsPage",
      },
      {
        id: "operations-reports",
        label: "Operations Reports",
        path: "/reports/operations",
        component: "pages/reports/OperationsReportsPage",
      },
      {
        id: "compliance-reports",
        label: "Compliance Reports",
        path: "/reports/compliance",
        component: "pages/reports/ComplianceReportsPage",
      },
      {
        id: "environmental-reports",
        label: "Environmental Reports",
        path: "/reports/environmental",
        component: "pages/reports/EnvironmentalReportsPage",
      },
      {
        id: "custom-report-builder",
        label: "Custom Report Builder",
        path: "/reports/custom-builder",
        component: "pages/reports/CustomReportBuilder",
      },
      {
        id: "scheduled-reports",
        label: "Scheduled Reports",
        path: "/reports/scheduled",
        component: "pages/reports/ScheduledReportsPage",
      },
    ],
  },

  // Notifications Section
  {
    id: "notifications",
    label: "Notifications",
    path: "/notifications",
    component: "pages/notifications/NotificationsPage",
    icon: "bell",
    children: [
      {
        id: "notifications-center",
        label: "Notification Center",
        path: "/notifications/center",
        component: "pages/notifications/NotificationCenterPage",
      },
      {
        id: "notification-settings",
        label: "Notification Settings",
        path: "/notifications/settings",
        component: "pages/notifications/NotificationSettingsPage",
      },
      {
        id: "alerts-config",
        label: "Alerts Configuration",
        path: "/notifications/alerts",
        component: "pages/notifications/AlertsConfigurationPage",
      },
    ],
  },

  // Settings Section
  {
    id: "settings",
    label: "Settings",
    path: "/settings",
    component: "pages/settings/SettingsPage",
    icon: "cog",
    children: [
      {
        id: "user-management",
        label: "User Management",
        path: "/settings/users",
        component: "pages/settings/UserManagementPage",
        children: [
          {
            id: "user-list",
            label: "User List",
            path: "/settings/users/list",
            component: "pages/settings/UserListPage",
          },
          {
            id: "roles-permissions",
            label: "Roles & Permissions",
            path: "/settings/users/roles",
            component: "pages/settings/RolesPermissionsPage",
          },
          {
            id: "user-activity",
            label: "User Activity",
            path: "/settings/users/activity",
            component: "pages/settings/UserActivityPage",
          },
        ],
      },
      {
        id: "company-profile",
        label: "Company Profile",
        path: "/settings/company",
        component: "pages/settings/CompanyProfilePage",
      },
      {
        id: "integration-settings",
        label: "Integrations",
        path: "/settings/integrations",
        component: "pages/settings/IntegrationsPage",
        children: [
          {
            id: "api-settings",
            label: "API Settings",
            path: "/settings/integrations/api",
            component: "pages/settings/APISettingsPage",
          },
          {
            id: "wialon-integration",
            label: "Wialon Integration",
            path: "/settings/integrations/wialon",
            component: "pages/settings/WialonIntegrationPage",
          },
          {
            id: "sage-integration",
            label: "Sage Integration",
            path: "/settings/integrations/sage",
            component: "pages/settings/SageIntegrationPage",
          },
          {
            id: "external-systems",
            label: "External Systems",
            path: "/settings/integrations/external",
            component: "pages/settings/ExternalSystemsPage",
          },
        ],
      },
      {
        id: "preferences",
        label: "Preferences",
        path: "/settings/preferences",
        component: "pages/settings/PreferencesPage",
      },
      {
        id: "backup-restore",
        label: "Backup & Restore",
        path: "/settings/backup",
        component: "pages/settings/BackupRestorePage",
      },
      {
        id: "system-logs",
        label: "System Logs",
        path: "/settings/logs",
        component: "pages/settings/SystemLogsPage",
      },
    ],
  },
  // Maps & Wialon Section
  {
    id: "maps",
    label: "Maps & Tracking",
    path: "/maps",
    component: "pages/WialonDashboard",
    icon: "map-marked-alt",
    children: [
      {
        id: "wialon-dashboard",
        label: "Wialon Dashboard",
        path: "/maps/wialon",
        component: "pages/WialonDashboard",
      },
      {
        id: "wialon-config",
        label: "Wialon Configuration",
        path: "/maps/wialon/config",
        component: "pages/WialonConfigPage",
      },
      {
        id: "wialon-units",
        label: "Wialon Units",
        path: "/maps/wialon/units",
        component: "pages/WialonUnitsPage",
      },
      {
        id: "fleet-management",
        label: "Fleet Management",
        path: "/maps/fleet",
        component: "pages/FleetManagementPage",
      },
      {
        id: "fleet-location",
        label: "Fleet Location",
        path: "/maps/fleet-map",
        component: "components/Map/pages/FleetLocationMapPage",
      },
    ],
  },

  // Flags & Investigations
  {
    id: "flags",
    label: "Flags & Investigations",
    path: "/flags",
    component: "pages/trips/FlagsInvestigationsPage",
    icon: "flag",
  },

  // Costs & Financial
  {
    id: "costs",
    label: "Cost Management",
    path: "/costs",
    component: "pages/IndirectCostBreakdown",
    icon: "money-bill",
    children: [
      {
        id: "indirect-costs",
        label: "Indirect Cost Breakdown",
        path: "/costs/indirect",
        component: "pages/IndirectCostBreakdown",
      },
      {
        id: "ytd-kpis",
        label: "Year to Date KPIs",
        path: "/ytd-kpis",
        component: "pages/YearToDateKPIs",
      },
    ],
  },

  // Quality Assurance
  {
    id: "qa",
    label: "Quality Assurance",
    path: "/qa",
    component: "pages/QAReviewPanel",
    icon: "check-double",
    children: [
      {
        id: "qa-review",
        label: "QA Review Panel",
        path: "/qa/review",
        component: "pages/QAReviewPanel",
      },
      {
        id: "po-approval",
        label: "PO Approval Summary",
        path: "/qa/po-approval",
        component: "pages/POApprovalSummary",
      },
    ],
  },

  // Procurement
  {
    id: "procurement",
    label: "Procurement",
    path: "/procurement",
    component: "pages/PurchaseOrderTracker",
    icon: "shopping-cart",
    children: [
      {
        id: "purchase-order-tracker",
        label: "Purchase Order Tracker",
        path: "/procurement/po-tracker",
        component: "pages/PurchaseOrderTracker",
      },
      {
        id: "purchase-order-detail",
        label: "Purchase Order Detail",
        path: "/procurement/po/:id",
        component: "pages/PurchaseOrderDetailView",
      },
      {
        id: "report-incident",
        label: "Report New Incident",
        path: "/procurement/incident/new",
        component: "pages/ReportNewIncidentPage",
      },
    ],
  },

  // Mobile Pages
  {
    id: "mobile",
    label: "Mobile Access",
    path: "/mobile",
    component: "pages/mobile/TyreMobilePage",
    icon: "mobile-alt",
    children: [
      {
        id: "tyre-mobile",
        label: "Tyre Mobile",
        path: "/mobile/tyres",
        component: "pages/mobile/TyreMobilePage",
      },
    ],
  },

  // Vehicle Views
  {
    id: "vehicle-views",
    label: "Vehicle Views",
    path: "/vehicles",
    component: "pages/VehicleTyreView",
    icon: "truck-monster",
    children: [
      {
        id: "vehicle-tyre-view",
        label: "Vehicle Tyre View",
        path: "/vehicles/tyre-view/:vehicleId",
        component: "pages/VehicleTyreView",
      },
      {
        id: "vehicle-tyre-view-a",
        label: "Vehicle Tyre View Alternate",
        path: "/vehicles/tyre-view-a/:vehicleId",
        component: "pages/VehicleTyreViewA",
      },
    ],
  },

  // Workshop Operations
  {
    id: "workshop-ops",
    label: "Workshop Operations",
    path: "/workshop-ops",
    component: "pages/WorkshopOperations",
    icon: "tools",
    children: [
      {
        id: "workshop-operations",
        label: "Operations Dashboard",
        path: "/workshop-ops/dashboard",
        component: "pages/WorkshopOperations",
      },
      {
        id: "workshop-analytics-page",
        label: "Workshop Analytics",
        path: "/workshop-ops/analytics",
        component: "pages/WorkshopAnalytics",
      },
      {
        id: "work-order-management",
        label: "Work Order Management",
        path: "/workshop-ops/work-orders",
        component: "pages/WorkOrderManagement",
      },
      {
        id: "job-card-management",
        label: "Job Card Management",
        path: "/workshop-ops/job-cards",
        component: "pages/JobCardManagement",
      },
      {
        id: "job-card-kanban",
        label: "Job Card Kanban Board",
        path: "/workshop-ops/job-cards/board",
        component: "pages/JobCardKanbanBoard",
      },
      {
        id: "inspection-management",
        label: "Inspection Management",
        path: "/workshop-ops/inspections",
        component: "pages/InspectionManagement",
      },
    ],
  },

  // Tyre Management Section
  {
    id: "tyres",
    label: "Tyre Management",
    path: "/tyres",
    component: "pages/tyres/TyreManagementPage",
    icon: "circle-stack",
    children: [
      {
        id: "tyre-dashboard",
        label: "Dashboard",
        path: "/tyres/dashboard",
        component: "pages/tyres/TyrePerformanceDashboard",
      },
      {
        id: "tyre-inspection",
        label: "Tyre Inspection",
        path: "/tyres/inspection",
        component: "pages/tyres/inspection",
      },
      {
        id: "tyre-inventory",
        label: "Tyre Inventory",
        path: "/tyres/inventory",
        component: "pages/tyres/inventory",
      },
      {
        id: "tyre-reference-data",
        label: "Reference Data",
        path: "/tyres/reference-data",
        component: "pages/tyres/TyreReferenceManagerPage",
      },
      {
        id: "tyre-add",
        label: "Add New Tyre",
        path: "/tyres/add",
        component: "pages/tyres/AddNewTyre",
      },
      {
        id: "tyre-reports",
        label: "Tyre Reports",
        path: "/tyres/reports",
        component: "pages/tyres/reports",
      },
      {
        id: "tyre-stores",
        label: "Tyre Stores",
        path: "/tyres/stores",
        component: "pages/tyres/TyreStoresPage",
      },
      {
        id: "tyre-fleet-map",
        label: "Tyre Fleet Map",
        path: "/tyres/fleet-map",
        component: "pages/tyres/TyreFleetMap",
      },
      {
        id: "tyre-history",
        label: "Tyre History",
        path: "/tyres/history",
        component: "pages/tyres/TyreHistoryPage",
      },
    ],
  },

  // Inventory Management Section
  {
    id: "inventory",
    label: "Inventory Management",
    path: "/inventory",
    component: "pages/inventory/InventoryPage",
    icon: "box",
    children: [
      {
        id: "inventory-dashboard",
        label: "Dashboard",
        path: "/inventory/dashboard",
        component: "pages/inventory/InventoryDashboard",
      },
      {
        id: "stock-management",
        label: "Stock Management",
        path: "/inventory/stock",
        component: "pages/inventory/PartsInventoryPage",
      },
      {
        id: "parts-ordering",
        label: "Parts Ordering",
        path: "/inventory/ordering",
        component: "pages/inventory/PartsOrderingPage",
      },
      {
        id: "receive-parts",
        label: "Receive Parts",
        path: "/inventory/receive",
        component: "pages/inventory/ReceivePartsPage",
      },
      {
        id: "purchase-orders",
        label: "Purchase Orders",
        path: "/inventory/purchase-orders",
        component: "pages/inventory/PurchaseOrderTracker",
      },
      {
        id: "vendor-management",
        label: "Vendor Management",
        path: "/inventory/vendors",
        component: "pages/inventory/VendorScorecard",
      },
      {
        id: "stock-alerts",
        label: "Stock Alerts",
        path: "/inventory/alerts",
        component: "pages/inventory/StockAlertsPage",
      },
      {
        id: "inventory-reports",
        label: "Reports",
        path: "/inventory/reports",
        component: "pages/inventory/InventoryReportsPage",
      },
    ],
  },
];

// For CommonJS compatibility with scripts
module.exports = { sidebarConfig };
