// src/AppRoutes.tsx
import React, { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";

// A tiny helper to keep JSX clean
const withSuspense = (Comp: React.LazyExoticComponent<any>, props = {}) => (
  <Suspense fallback={<div className="p-6">Loading…</div>}>
    <Comp {...props} />
  </Suspense>
);

/* -----------------------------
 * Maps / Wialon
 * ----------------------------- */
// Main Map pages
const Maps = lazy(() => import("./pages/maps/Maps"));
const MapsSuitePage = lazy(() => import("./pages/maps/MapsSuitePage"));
const MapsDashboardPage = lazy(() => import("./pages/maps/MapsDashboardPage"));

// Wialon integration
const WialonDashboard = lazy(() => import("./pages/wialon/WialonDashboard"));
const WialonConfigPage = lazy(() => import("./pages/wialon/WialonConfigPage"));
const WialonUnitsPage = lazy(() => import("./pages/wialon/WialonUnitsPage"));
const WialonSuitePage = lazy(() => import("./pages/wialon/WialonSuitePage"));
const WialonTracking = lazy(() => import("./pages/wialon/WialonTrackingPage"));

// Fleet map components
const FleetManagementPage = lazy(() => import("./pages/trips/FleetManagementPage"));
const FleetLocationMapPage = lazy(() => import("./pages/FleetLocationMapPage"));

// Consolidated Wialon map components
const WialonMapComponent = lazy(() => import("./pages/wialon/WialonMapComponent"));
const WialonMapDashboard = lazy(() => import("./pages/wialon/WialonMapDashboard"));
const WialonMapPage = lazy(() => import("./pages/wialon/WialonMapPage"));

/* -----------------------------
 * Top-level / dashboard pages
 * ----------------------------- */
// Enhanced dynamic import with error handling
const DashboardPage = lazy(() =>
  import("./pages/Dashboard.tsx").catch((error) => {
    console.error("Error loading Dashboard component:", error);
    // Return a fallback module that renders an error message
    return {
      default: () => {
        console.log("Rendering fallback Dashboard due to import error");
        return (
          <div className="p-6 bg-red-100 border border-red-300 rounded-md">
            <h2 className="text-xl font-bold text-red-700">Dashboard Import Error</h2>
            <p className="text-red-600 mt-2">Failed to load the Dashboard component.</p>
            <p className="text-red-600">Error: {error.message}</p>
            <pre className="mt-4 p-2 bg-red-50 text-red-800 overflow-auto text-sm">
              {error.stack}
            </pre>
          </div>
        );
      },
    };
  })
);
// Fix additional dashboard components with .tsx extension
const YearToDateKPIs = lazy(() => import("./pages/analytics/YearToDateKPIs.tsx"));
const FormsIntegrationPage = lazy(() => import("./pages/FormsIntegrationPage.tsx"));
const ConsolidatedDashboard = lazy(() => import("./pages/dashboard/ConsolidatedDashboard.tsx"));
const DashboardWrapper = lazy(() => import("./pages/dashboard/DashboardWrapper.tsx"));
const ComplianceDashboard = lazy(() => import("./pages/qc/ComplianceDashboard.tsx"));

/* -----------------------------
 * Trips
 * ----------------------------- */
const TripManager = lazy(() => import("./pages/trips/TripManager")); // New consolidated component
const TripDashboardPage = lazy(() => import("./pages/trips/TripDashboardPage"));
const TripDetailsPage = lazy(() => import("./pages/trips/TripDetailsPage"));
const SystemCostGenerator = lazy(() => import("./pages/trips/SystemCostGenerator"));
const PaymentTrackingPanel = lazy(() => import("./pages/trips/PaymentTrackingPanel"));
const ReportingPanel = lazy(() => import("./pages/trips/ReportingPanel"));
const LoadPlanningPage = lazy(() => import("./pages/Inventory/LoadPlanningPage"));
const RoutePlanningPage = lazy(() => import("./pages/trips/RoutePlanningPage"));
const RouteOptimizationPage = lazy(() => import("./pages/trips/RouteOptimizationPage"));
const TripTimelinePage = lazy(() => import("./pages/trips/TripTimelinePage"));
const TripReportPage = lazy(() => import("./pages/trips/TripReportPage"));
const TripInvoicingPanel = lazy(() => import("./pages/trips/TripInvoicingPanel"));
const TripCompletionPanel = lazy(() => import("./pages/trips/TripCompletionPanel"));
const FlagInvestigationPanel = lazy(() => import("./pages/trips/FlagInvestigationPanel"));
const FlagsInvestigationsPage = lazy(() => import("./pages/trips/FlagsInvestigationsPage"));
const CostForm = lazy(() => import("./components/forms/cost/CostForm"));
const CreateLoadConfirmationPage = lazy(() => import("./pages/trips/CreateLoadConfirmationPage"));
const MainTripWorkflow = lazy(() => import("./pages/trips/MainTripWorkflow"));
const IndirectCostBreakdown = lazy(() => import("./pages/trips/IndirectCostBreakdown"));

/* -----------------------------
 * Diesel
 * ----------------------------- */
// Enhanced dynamic import with error handling
const DieselDashboard = lazy(() =>
  import("./pages/diesel/DieselDashboard.tsx").catch((error) => {
    console.error("Error loading DieselDashboard component:", error);
    // Return a fallback module that renders an error message
    return {
      default: () => {
        console.log("Rendering fallback DieselDashboard due to import error");
        return (
          <div className="p-6 bg-red-100 border border-red-300 rounded-md">
            <h2 className="text-xl font-bold text-red-700">DieselDashboard Import Error</h2>
            <p className="text-red-600 mt-2">Failed to load the DieselDashboard component.</p>
            <p className="text-red-600">Error: {error.message}</p>
            <pre className="mt-4 p-2 bg-red-50 text-red-800 overflow-auto text-sm">
              {error.stack}
            </pre>
          </div>
        );
      },
    };
  })
);
const DieselAnalysis = lazy(() => import("./pages/diesel/DieselAnalysis"));
const DieselIntegratedPage = lazy(() => import("./pages/diesel/DieselIntegratedPage"));
const FuelLogs = lazy(() => import("./pages/diesel/FuelLogs"));
const FuelTheftDetection = lazy(() => import("./pages/diesel/FuelTheftDetection"));
const DriverFuelBehavior = lazy(() => import("./pages/diesel/DriverFuelBehavior"));
const FuelEfficiencyReport = lazy(() => import("./pages/diesel/FuelEfficiencyReport"));
const FuelCardManager = lazy(() => import("./pages/diesel/FuelCardManager"));
const BudgetPlanning = lazy(() => import("./pages/diesel/BudgetPlanning"));
const CarbonFootprintCalc = lazy(() => import("./pages/diesel/CarbonFootprintCalc"));
const CostAnalysis = lazy(() => import("./pages/diesel/CostAnalysis"));
const DieselManagementPage = lazy(() => import("./pages/diesel/DieselManagementPage"));
const FuelStations = lazy(() => import("./pages/diesel/FuelStations"));
const AddFuelEntryPage = lazy(() => import("./pages/diesel/AddFuelEntryPage"));
const AddFuelEntryPageWrapper = lazy(() => import("./pages/diesel/AddFuelEntryPageWrapper"));
const DieselDashboardComponent = lazy(() => import("./pages/diesel/DieselDashboardComponent")); // Added

/* -----------------------------
 * Drivers
 * ----------------------------- */
const DriverManagementPageIntegrated = lazy(
  () => import("./pages/drivers/DriverManagementPageIntegrated")
);
const DriverManagementPage = lazy(() => import("./pages/drivers/DriverManagementPage"));
// Using DriverManagementPage as fallback since DriverDashboard is missing
const DriverDashboard = lazy(() => import("./pages/drivers/DriverManagementPage"));
const DriverDetailsPage = lazy(() => import("./pages/drivers/DriverDetailsPage"));
const DriverBehaviorPage = lazy(() => import("./pages/drivers/DriverBehaviorPage"));
const SafetyScores = lazy(() => import("./pages/drivers/SafetyScores"));
const PerformanceAnalytics = lazy(() => import("./pages/drivers/PerformanceAnalytics")); // From pages/drivers
const DriverRewards = lazy(() => import("./pages/drivers/DriverRewards"));
const DriverScheduling = lazy(() => import("./pages/drivers/DriverScheduling"));
const DriverViolations = lazy(() => import("./pages/drivers/DriverViolations"));
const HoursOfService = lazy(() => import("./pages/drivers/HoursOfService"));
const TrainingRecords = lazy(() => import("./pages/drivers/TrainingRecords"));
const LicenseManagement = lazy(() => import("./pages/drivers/LicenseManagement"));
const AddEditDriverPage = lazy(() => import("./pages/drivers/AddEditDriverPage"));
const DriverProfiles = lazy(() => import("./pages/drivers/DriverProfiles"));
const AddNewDriver = lazy(() => import("./pages/drivers/AddNewDriverPage"));
const DriverDetailsComponent = lazy(() => import("./pages/drivers/DriverDetails")); // Added (renamed to avoid conflict)
const DriverManagementWrapper = lazy(() => import("./pages/drivers/DriverManagementWrapper")); // Added
const EditDriverPage = lazy(() => import("./pages/drivers/EditDriver")); // Added (renamed to avoid conflict)

/* -----------------------------
 * Clients
 * ----------------------------- */
const ClientManagementPage = lazy(() => import("./pages/clients/ClientManagementPageIntegrated"));
const CustomerDashboard = lazy(() => import("./pages/clients/CustomerDashboard"));
const CustomerReports = lazy(() => import("./pages/clients/CustomerReports"));
const ActiveCustomers = lazy(() => import("./pages/clients/ActiveCustomers"));
const ClientDetail = lazy(() => import("./pages/clients/ClientDetail"));
const RetentionMetrics = lazy(() => import("./pages/clients/CustomerRetentionDashboard"));
const AddNewCustomer = lazy(() => import("./pages/clients/AddNewCustomer"));
const ClientNetworkMap = lazy(() => import("./pages/clients/ClientNetworkMap"));
const ClientManagementPageOriginal = lazy(() => import("./pages/clients/ClientManagementPage")); // Added (renamed to avoid conflict)

/* -----------------------------
 * Form Testing
 * ----------------------------- */
const FormsTestWrapper = lazy(() => import("./pages/dashboard/FormsTestWrapper"));

/* -----------------------------
 * Invoices
 * ----------------------------- */
const InvoiceManagementPage = lazy(() => import("./pages/invoices/InvoiceManagementPage"));
const InvoiceDashboard = lazy(() => import("./pages/invoices/InvoiceDashboard"));
const InvoiceBuilder = lazy(() => import("./pages/invoices/InvoiceBuilder"));
const CreateInvoicePage = lazy(() => import("./pages/invoices/CreateInvoicePage"));
const CreateQuotePage = lazy(() => import("./pages/invoices/CreateQuotePage"));
const PendingInvoicesPage = lazy(() => import("./pages/invoices/PendingInvoicesPage"));
const PaidInvoicesPage = lazy(() => import("./pages/invoices/PaidInvoicesPage"));
const InvoiceTemplatesPage = lazy(() => import("./pages/invoices/InvoiceTemplatesPage"));
const TaxReportExport = lazy(() => import("./pages/invoices/TaxReportExport"));
const InvoiceApprovalFlow = lazy(() => import("./pages/invoices/InvoiceApprovalFlow"));
const PaidInvoicesComponent = lazy(() => import("./pages/invoices/PaidInvoices")); // Added (renamed to avoid conflict)
const PendingInvoicesComponent = lazy(() => import("./pages/invoices/PendingInvoices")); // Added (renamed to avoid conflict)

/* -----------------------------
 * Workshop
 * ----------------------------- */
const WorkshopOperations = lazy(() => import("./pages/workshop/WorkshopOperations"));
const WorkshopAnalytics = lazy(() => import("./pages/workshop/WorkshopAnalytics"));
const WorkOrderManagement = lazy(() => import("./pages/workshop/WorkOrderManagement"));
const PurchaseOrderPage = lazy(() => import("./pages/workshop/PurchaseOrderPage"));
const QRGenerator = lazy(() => import("./pages/workshop/QRGenerator"));
const QRScannerPage = lazy(() => import("./pages/workshop/QRScannerPage"));
const StockInventoryPage = lazy(() => import("./pages/workshop/StockInventoryPage"));
const VendorPage = lazy(() => import("./pages/workshop/VendorPage"));
const WorkshopPage = lazy(() => import("./pages/workshop/WorkshopPage"));
const InventoryDashboard = lazy(() => import("./pages/Inventory/InventoryDashboard"));
const InventoryPage = lazy(() => import("./pages/Inventory/InventoryPage"));
const InventoryReportsPage = lazy(() => import("./pages/Inventory/InventoryReportsPage"));
const PartsInventoryPage = lazy(() => import("./pages/Inventory/PartsInventoryPage"));
const PartsOrderingPage = lazy(() => import("./pages/Inventory/PartsOrderingPage"));
const ReceivePartsPage = lazy(() => import("./pages/Inventory/ReceivePartsPage"));
const JobCardManagement = lazy(() => import("./pages/workshop/JobCardManagement"));
const JobCardKanbanBoard = lazy(() => import("./pages/workshop/JobCardKanbanBoard"));
const InspectionManagement = lazy(() => import("./pages/workshop/InspectionManagement"));
const QAReviewPanel = lazy(() => import("./pages/qc/QAReviewPanel"));
const POApprovalSummary = lazy(() => import("./pages/Inventory/POApprovalSummary"));
const PurchaseOrderTracker = lazy(() => import("./pages/Inventory/PurchaseOrderTracker"));
const PurchaseOrderDetailView = lazy(() => import("./pages/Inventory/PurchaseOrderDetailView"));
const ReportNewIncidentPage = lazy(() => import("./pages/workshop/ReportNewIncidentPage"));
const ActionLog = lazy(() => import("./pages/qc/ActionLog"));

/* -----------------------------
 * Tyres
 * ----------------------------- */
const TyreManagementPage = lazy(() => import("./pages/tyres/TyreManagementPage"));
const TyreReferenceManagerPage = lazy(() => import("./pages/tyres/TyreReferenceManagerPage"));
const TyrePerformanceDashboard = lazy(() => import("./pages/tyres/TyrePerformanceDashboard"));
const TyreHistoryPage = lazy(() => import("./pages/tyres/TyreHistoryPage"));
const TyreFleetMap = lazy(() => import("./pages/tyres/TyreFleetMap"));
const TyreStores = lazy(() => import("./pages/tyres/TyreStores"));
const VehicleTyreView = lazy(() => import("./pages/tyres/VehicleTyreView"));
const TyreMobilePage = lazy(() => import("./pages/mobile/TyreMobilePage"));
const VehicleTyreViewA = lazy(() => import("./pages/tyres/VehicleTyreViewA"));
const TyreInventoryDashboard = lazy(() => import("./pages/tyres/TyreInventoryDashboard"));

/* -----------------------------
 * Analytics
 * ----------------------------- */
const VendorScorecard = lazy(() => import("./pages/Inventory/VendorScorecard"));
const AnalyticsPerformanceAnalytics = lazy(() => import("./pages/analytics/PerformanceAnalytics"));
const AnalyticsDashboard = lazy(() => import("./pages/analytics/AnalyticsDashboard"));
const AnalyticsDashboardPage = lazy(() => import("./pages/analytics/DashboardPage"));
const FleetAnalyticsPage = lazy(() => import("./pages/analytics/FleetAnalyticsPage"));

// Maps section moved to the top of the file

/* -----------------------------
 * 404
 * ----------------------------- */
const NotFound = () => <div className="p-6">404 – Page not found</div>;

// Use a proper type definition instead of empty interface
interface Trip {
  id: string;
  // Add other trip properties as needed
}

export const AppRoutes: React.FC = () => {
  const [, setShowTripForm] = React.useState(false);
  const [, setEditingTrip] = React.useState<Trip | null>(null);

  // Create a wrapper function that matches the expected prop type
  const handleEditingTripChange = (trip: Trip | undefined) => {
    setEditingTrip(trip || null);
  };

  return (
    <Routes>
      {/* All app pages live under the Layout */}
      <Route
        path="/"
        element={
          <Layout setShowTripForm={setShowTripForm} setEditingTrip={handleEditingTripChange} />
        }
      >
        {/* Default redirect to /dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* Dashboard & Compliance */}
        <Route path="dashboard" element={withSuspense(DashboardPage)} />
        <Route path="ytd-kpis" element={withSuspense(YearToDateKPIs)} />
        <Route path="compliance" element={withSuspense(ComplianceDashboard)} />
        <Route path="forms-integration" element={withSuspense(FormsIntegrationPage)} />
        <Route path="dashboard/consolidated" element={withSuspense(ConsolidatedDashboard)} />
        <Route path="dashboard/wrapper" element={withSuspense(DashboardWrapper)} />

        {/* Trips - Consolidated with TripManager */}
        <Route path="trips">
          <Route index element={withSuspense(TripManager)} />
          <Route path="dashboard" element={withSuspense(TripDashboardPage)} />
          <Route path="manage" element={withSuspense(TripManager)} />
          <Route path="active" element={withSuspense(TripManager)} />
          <Route path="completed" element={withSuspense(TripManager)} />
          <Route path="system-costs/:tripId" element={withSuspense(SystemCostGenerator)} />
          <Route path="payments/:tripId" element={withSuspense(PaymentTrackingPanel)} />
          <Route path="reports/:tripId" element={withSuspense(ReportingPanel)} />
          <Route path="load-planning" element={withSuspense(LoadPlanningPage)} />
          <Route path="calendar" element={withSuspense(TripManager)} />
          <Route path="timeline" element={withSuspense(TripTimelinePage)} />
          <Route path="report" element={withSuspense(TripReportPage)} />
          <Route path=":tripId" element={withSuspense(TripDetailsPage)} />
          <Route path="invoicing/:tripId" element={withSuspense(TripInvoicingPanel)} />
          <Route path="completion/:tripId" element={withSuspense(TripCompletionPanel)} />
          <Route path="flags/:tripId" element={withSuspense(FlagInvestigationPanel)} />
          <Route path="missed-loads" element={withSuspense(TripManager)} />
          <Route path="cost-entry" element={withSuspense(CostForm)} />
          <Route
            path="create-load-confirmation"
            element={withSuspense(CreateLoadConfirmationPage)}
          />
          <Route path="workflow" element={withSuspense(MainTripWorkflow)} />
        </Route>

        {/* Diesel */}
        <Route path="diesel">
          <Route index element={withSuspense(DieselDashboard)} />
          <Route path="dashboard" element={withSuspense(DieselDashboard)} />
          <Route path="analysis" element={withSuspense(DieselAnalysis)} />
          <Route path="manage" element={withSuspense(DieselManagementPage)} />
          <Route path="fuel-logs" element={withSuspense(FuelLogs)} />
          <Route path="integrated" element={withSuspense(DieselIntegratedPage)} />
          <Route path="fuel-theft" element={withSuspense(FuelTheftDetection)} />
          <Route path="driver-fuel" element={withSuspense(DriverFuelBehavior)} />
          <Route path="efficiency" element={withSuspense(FuelEfficiencyReport)} />
          <Route path="fuel-cards" element={withSuspense(FuelCardManager)} />
          <Route path="budget" element={withSuspense(BudgetPlanning)} />
          <Route path="carbon" element={withSuspense(CarbonFootprintCalc)} />
          <Route path="cost-analysis" element={withSuspense(CostAnalysis)} />
          <Route path="stations" element={withSuspense(FuelStations)} />
          <Route path="add-fuel" element={withSuspense(AddFuelEntryPage)} />
          <Route path="add-fuel-wrapper" element={withSuspense(AddFuelEntryPageWrapper)} />
          <Route path="component-dashboard" element={withSuspense(DieselDashboardComponent)} />{" "}
          {/* Added */}
        </Route>

        {/* Drivers */}
        <Route path="drivers">
          <Route index element={withSuspense(DriverManagementPage)} />
          <Route path="dashboard" element={withSuspense(DriverDashboard)} />
          <Route path="profiles" element={withSuspense(DriverProfiles)} />
          <Route path="integrated" element={withSuspense(DriverManagementPageIntegrated)} />
          <Route path="manage" element={withSuspense(DriverManagementPage)} />
          <Route path="profiles/:id" element={withSuspense(DriverDetailsPage)} />
          <Route path="behavior" element={withSuspense(DriverBehaviorPage)} />
          <Route path="safety-scores" element={withSuspense(SafetyScores)} />
          <Route path="performance-analytics" element={withSuspense(PerformanceAnalytics)} />
          <Route path="rewards" element={withSuspense(DriverRewards)} />
          <Route path="scheduling" element={withSuspense(DriverScheduling)} />
          <Route path="violations" element={withSuspense(DriverViolations)} />
          <Route path="hours-of-service" element={withSuspense(HoursOfService)} />
          <Route path="training" element={withSuspense(TrainingRecords)} />
          <Route path="licenses" element={withSuspense(LicenseManagement)} />
          <Route path="add" element={withSuspense(AddEditDriverPage)} />
          <Route path="edit/:id" element={withSuspense(AddEditDriverPage)} />
          <Route path="add-new" element={withSuspense(AddNewDriver)} />
          <Route path="details-view/:id" element={withSuspense(DriverDetailsComponent)} />{" "}
          {/* Added */}
          <Route path="management-wrapper" element={withSuspense(DriverManagementWrapper)} />{" "}
          {/* Added */}
          <Route path="edit-driver-page/:id" element={withSuspense(EditDriverPage)} /> {/* Added */}
        </Route>

        {/* Clients */}
        <Route path="clients">
          <Route index element={withSuspense(ActiveCustomers)} />
          <Route path="integrated" element={withSuspense(ClientManagementPage)} />
          <Route path="manage" element={withSuspense(ClientManagementPage)} />
          <Route path="dashboard" element={withSuspense(CustomerDashboard)} />
          <Route path="reports" element={withSuspense(CustomerReports)} />
          <Route path="active" element={withSuspense(ActiveCustomers)} />
          <Route path="detail/:id" element={withSuspense(ClientDetail)} />
          <Route path="retention" element={withSuspense(RetentionMetrics)} />
          <Route path="add" element={withSuspense(AddNewCustomer)} />
          <Route path="network-map" element={withSuspense(ClientNetworkMap)} />
          <Route
            path="management-original"
            element={withSuspense(ClientManagementPageOriginal)}
          />{" "}
          {/* Added */}
        </Route>

        {/* Forms Testing */}
        <Route path="forms-test" element={withSuspense(FormsTestWrapper)}>
          <Route path="drivers" element={withSuspense(DriverManagementPage)} />
          <Route path="clients" element={withSuspense(ClientManagementPage)} />
        </Route>

        {/* Invoices */}
        <Route path="invoices">
          <Route index element={withSuspense(InvoiceDashboard)} />
          <Route path="manage" element={withSuspense(InvoiceManagementPage)} />
          <Route path="builder" element={withSuspense(InvoiceBuilder)} />
          <Route path="create" element={withSuspense(CreateInvoicePage)} />
          <Route path="quote" element={withSuspense(CreateQuotePage)} />
          <Route path="pending" element={withSuspense(PendingInvoicesPage)} />
          <Route path="paid" element={withSuspense(PaidInvoicesPage)} />
          <Route path="templates" element={withSuspense(InvoiceTemplatesPage)} />
          <Route path="tax-export" element={withSuspense(TaxReportExport)} />
          <Route path="approval-flow" element={withSuspense(InvoiceApprovalFlow)} />
          <Route
            path="paid-invoices-component"
            element={withSuspense(PaidInvoicesComponent)}
          />{" "}
          {/* Added */}
          <Route
            path="pending-invoices-component"
            element={withSuspense(PendingInvoicesComponent)}
          />{" "}
          {/* Added */}
        </Route>

        {/* Workshop / Inventory */}
        <Route path="workshop">
          <Route index element={withSuspense(WorkshopPage)} />
          <Route path="operations" element={withSuspense(WorkshopOperations)} />
          <Route path="analytics" element={withSuspense(WorkshopAnalytics)} />
          <Route path="work-orders" element={withSuspense(WorkOrderManagement)} />
          <Route path="purchase-orders" element={withSuspense(PurchaseOrderPage)} />
          <Route path="po-tracker" element={withSuspense(PurchaseOrderTracker)} />
          <Route path="po/:id" element={withSuspense(PurchaseOrderDetailView)} />
          <Route path="po-approval" element={withSuspense(POApprovalSummary)} />
          <Route path="qr-generator" element={withSuspense(QRGenerator)} />
          <Route path="qr-scan" element={withSuspense(QRScannerPage)} />
          <Route path="stock" element={withSuspense(StockInventoryPage)} />
          <Route path="vendors" element={withSuspense(VendorPage)} />
          <Route path="inventory" element={withSuspense(InventoryPage)} />
          <Route path="inventory-dashboard" element={withSuspense(InventoryDashboard)} />
          <Route path="inventory-reports" element={withSuspense(InventoryReportsPage)} />
          <Route path="parts" element={withSuspense(PartsInventoryPage)} />
          <Route path="parts-ordering" element={withSuspense(PartsOrderingPage)} />
          <Route path="parts-receive" element={withSuspense(ReceivePartsPage)} />
          <Route path="job-cards" element={withSuspense(JobCardManagement)} />
          <Route path="job-cards/board" element={withSuspense(JobCardKanbanBoard)} />
          <Route path="inspections" element={withSuspense(InspectionManagement)} />
          <Route path="qa" element={withSuspense(QAReviewPanel)} />
          <Route path="incident/new" element={withSuspense(ReportNewIncidentPage)} />
          <Route path="action-log" element={withSuspense(ActionLog)} />
        </Route>

        {/* Tyres */}
        <Route path="tyres">
          <Route index element={withSuspense(TyreManagementPage)} />
          <Route path="manage" element={withSuspense(TyreManagementPage)} />
          <Route path="reference" element={withSuspense(TyreReferenceManagerPage)} />
          <Route path="performance" element={withSuspense(TyrePerformanceDashboard)} />
          <Route path="history" element={withSuspense(TyreHistoryPage)} />
          <Route path="fleet-map" element={withSuspense(TyreFleetMap)} />
          <Route path="stores" element={withSuspense(TyreStores)} />
          <Route path="vehicle-view" element={withSuspense(VehicleTyreView)} />
          <Route path="mobile" element={withSuspense(TyreMobilePage)} />
          <Route path="vehicle-view-a" element={withSuspense(VehicleTyreViewA)} />
          {/* Newly added inventory dashboard route to use TyreInventoryDashboard */}
          <Route path="inventory" element={withSuspense(TyreInventoryDashboard)} />
        </Route>

        {/* Analytics */}
        <Route path="analytics">
          <Route index element={withSuspense(AnalyticsPerformanceAnalytics)} />
          <Route path="vendor-scorecard" element={withSuspense(VendorScorecard)} />
          <Route path="dashboard" element={withSuspense(AnalyticsDashboard)} />
          <Route path="main-dashboard" element={withSuspense(AnalyticsDashboardPage)} />
          <Route path="fleet" element={withSuspense(FleetAnalyticsPage)} />
        </Route>

        {/* Maps / Wialon */}
        <Route path="maps">
          {/* Main Maps Pages */}
          <Route index element={withSuspense(Maps)} />
          <Route path="dashboard" element={withSuspense(MapsDashboardPage)} />
          <Route path="suite" element={withSuspense(MapsSuitePage)} />

          {/* Wialon Integration */}
          <Route path="wialon" element={withSuspense(WialonDashboard)} />
          <Route path="wialon/config" element={withSuspense(WialonConfigPage)} />
          <Route path="wialon/units" element={withSuspense(WialonUnitsPage)} />
          <Route path="wialon/suite" element={withSuspense(WialonSuitePage)} />
          <Route path="wialon/tracking" element={withSuspense(WialonTracking)} />
          <Route path="wialon/component" element={withSuspense(WialonMapComponent)} />
          <Route path="wialon/map-dashboard" element={withSuspense(WialonMapDashboard)} />
          <Route path="wialon/map-page" element={withSuspense(WialonMapPage)} />

          {/* Fleet Maps */}
          <Route path="fleet" element={withSuspense(FleetManagementPage)} />
          <Route path="fleet-map" element={withSuspense(FleetLocationMapPage)} />
        </Route>

        {/* Flags / Investigations */}
        <Route path="flags" element={withSuspense(FlagsInvestigationsPage)} />

        {/* Costs */}
        <Route path="costs/indirect" element={withSuspense(IndirectCostBreakdown)} />

        {/* Misc / other routes that might be top-level or need specific handling */}
        <Route path="route-planning" element={withSuspense(RoutePlanningPage)} />
        <Route path="route-optimization" element={withSuspense(RouteOptimizationPage)} />
        <Route path="trip-calendar" element={withSuspense(TripManager)} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
