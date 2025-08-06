// src/AppRoutes.tsx
import React, { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";

// A tiny helper to keep JSX clean
const withSuspense = (Comp: React.LazyExoticComponent<any>, props = {}) => (
  <Suspense fallback={<div className="p-6">Loading…</div>}>
    <Comp {...props} />
  </Suspense>
);/* -----------------------------
 * Top-level / dashboard pages
 * ----------------------------- */
const DashboardPage = lazy(() => import("./pages/Dashboard"));
const YearToDateKPIs = lazy(() => import("./pages/analytics/YearToDateKPIs"));
const ComplianceDashboard = lazy(() => import("./pages/qc/ComplianceDashboard"));

/* -----------------------------
 * Trips
 * ----------------------------- */
const TripDashboardPage = lazy(() => import("./pages/trips/TripDashboardPage"));
const TripManagementPage = lazy(() => import("./pages/trips/TripManagementPage"));
const TripManagementPageIntegrated = lazy(() => import("./pages/trips/TripManagementPageIntegrated")); // Added
const ActiveTripsPage = lazy(() => import("./pages/trips/ActiveTripsPageEnhanced"));
const CompletedTrips = lazy(() => import("./pages/trips/CompletedTrips"));
const TripDetailsPage = lazy(() => import("./pages/trips/TripDetailsPage"));
const SystemCostGenerator = lazy(() => import("./pages/trips/SystemCostGenerator"));
const PaymentTrackingPanel = lazy(() => import("./pages/trips/PaymentTrackingPanel"));
const ReportingPanel = lazy(() => import("./pages/trips/ReportingPanel"));
const LoadPlanningPage = lazy(() => import("./pages/Inventory/LoadPlanningPage"));
const LoadPlanningComponentPage = lazy(() => import("./pages/trips/LoadPlanningComponentPage"));
const RoutePlanningPage = lazy(() => import("./pages/trips/RoutePlanningPage"));
const RouteOptimizationPage = lazy(() => import("./pages/trips/RouteOptimizationPage"));
const TripCalendarPage = lazy(() => import("./pages/trips/TripCalendarPage"));
const TripTimelinePage = lazy(() => import("./pages/trips/TripTimelinePage")); // Path changed
const TripReportPage = lazy(() => import("./pages/trips/TripReportPage")); // Path changed
const TripInvoicingPanel = lazy(() => import("./pages/trips/TripInvoicingPanel"));
const TripCompletionPanel = lazy(() => import("./pages/trips/TripCompletionPanel"));
const FlagInvestigationPanel = lazy(() => import("./pages/trips/FlagInvestigationPanel"));
const MissedLoadsTracker = lazy(() => import("./pages/trips/MissedLoadsTracker")); // Path changed

/* -----------------------------
 * Diesel
 * ----------------------------- */
const DieselDashboard = lazy(() => import("./pages/diesel/DieselDashboard"));
const DieselAnalysis = lazy(() => import("./pages/diesel/DieselAnalysis"));
const DieselIntegratedPage = lazy(() => import("./pages/diesel/DieselIntegratedPage")); // Added
const FuelLogs = lazy(() => import("./pages/diesel/FuelLogs")); // Path changed
const FuelTheftDetection = lazy(() => import("./pages/diesel/FuelTheftDetection")); // Added
const DriverFuelBehavior = lazy(() => import("./pages/diesel/DriverFuelBehavior")); // Path changed
const FuelEfficiencyReport = lazy(() => import("./pages/diesel/FuelEfficiencyReport")); // Added
const FuelCardManager = lazy(() => import("./pages/diesel/FuelCardManager")); // Added
const BudgetPlanning = lazy(() => import("./pages/diesel/BudgetPlanning")); // Added
const CarbonFootprintCalc = lazy(() => import("./pages/diesel/CarbonFootprintCalc")); // Added
const CostAnalysis = lazy(() => import("./pages/diesel/CostAnalysis")); // Added
const DieselManagementPage = lazy(() => import("./pages/diesel/DieselManagementPage")); // Added
const FuelStations = lazy(() => import("./pages/diesel/FuelStations")); // Added

/* -----------------------------
 * Drivers
 * ----------------------------- */
const DriverManagementPageIntegrated = lazy(
  () => import("./pages/drivers/DriverManagementPageIntegrated")
); // Added
const DriverManagementPage = lazy(() => import("./pages/drivers/DriverManagementPage"));
const DriverDashboard = lazy(() => import("./pages/drivers/DriverDashboard"));
const DriverDetailsPage = lazy(() => import("./pages/drivers/DriverDetailsPage")); // Added
const DriverBehaviorPage = lazy(() => import("./pages/drivers/DriverBehaviorPage")); // Added
const SafetyScores = lazy(() => import("./pages/drivers/SafetyScores")); // Added
const PerformanceAnalytics = lazy(() => import("./pages/drivers/PerformanceAnalytics"));
const DriverRewards = lazy(() => import("./pages/drivers/DriverRewards")); // Added
const DriverScheduling = lazy(() => import("./pages/drivers/DriverScheduling")); // Added
const DriverViolations = lazy(() => import("./pages/drivers/DriverViolations")); // Added
const HoursOfService = lazy(() => import("./pages/drivers/HoursOfService")); // Added
const TrainingRecords = lazy(() => import("./pages/drivers/TrainingRecords")); // Added
const LicenseManagement = lazy(() => import("./pages/drivers/LicenseManagement")); // Added
const AddEditDriverPage = lazy(() => import("./pages/drivers/AddEditDriverPage")); // Added
const DriverProfiles = lazy(() => import("./pages/drivers/DriverProfiles")); // Added

/* -----------------------------
 * Clients
 * ----------------------------- */
const ClientManagementPage = lazy(() => import("./pages/clients/ClientManagementPageIntegrated")); // Path changed
const CustomerDashboard = lazy(() => import("./pages/clients/CustomerDashboard")); // Added
const CustomerReports = lazy(() => import("./pages/clients/CustomerReports")); // Added
const ActiveCustomers = lazy(() => import("./pages/clients/ActiveCustomers")); // Added
const ClientDetail = lazy(() => import("./pages/clients/ClientDetail")); // Added
const RetentionMetrics = lazy(() => import("./pages/clients/RetentionMetrics")); // Added

/* -----------------------------
 * Form Testing
 * ----------------------------- */
const FormsTestWrapper = lazy(() => import("./pages/dashboard/FormsTestWrapper")); // Added

/* -----------------------------
 * Invoices
 * ----------------------------- */
const InvoiceManagementPage = lazy(() => import("./pages/invoices/InvoiceManagementPage")); // Added
const InvoiceDashboard = lazy(() => import("./pages/invoices/InvoiceDashboard")); // Added
const InvoiceBuilder = lazy(() => import("./pages/invoices/InvoiceBuilder")); // Added
const CreateInvoicePage = lazy(() => import("./pages/invoices/CreateInvoicePage")); // Added
const CreateQuotePage = lazy(() => import("./pages/invoices/CreateQuotePage")); // Added
const PendingInvoicesPage = lazy(() => import("./pages/invoices/PendingInvoicesPage")); // Added
const PaidInvoicesPage = lazy(() => import("./pages/invoices/PaidInvoicesPage")); // Added
const InvoiceTemplatesPage = lazy(() => import("./pages/invoices/InvoiceTemplatesPage")); // Added
const TaxReportExport = lazy(() => import("./pages/invoices/TaxReportExport")); // Added

/* -----------------------------
 * Workshop
 * ----------------------------- */
const WorkshopOperations = lazy(() => import("./pages/workshop/WorkshopOperations")); // Added
const WorkshopAnalytics = lazy(() => import("./pages/workshop/WorkshopAnalytics")); // Added
const WorkOrderManagement = lazy(() => import("./pages/workshop/WorkOrderManagement")); // Added
const PurchaseOrderPage = lazy(() => import("./pages/workshop/PurchaseOrderPage")); // Added
const QRGenerator = lazy(() => import("./pages/workshop/QRGenerator")); // Added
const QRScannerPage = lazy(() => import("./pages/workshop/QRScannerPage")); // Added
const StockInventoryPage = lazy(() => import("./pages/workshop/StockInventoryPage")); // Added
const VendorPage = lazy(() => import("./pages/workshop/VendorPage")); // Added
const WorkshopPage = lazy(() => import("./pages/workshop/WorkshopPage"));
const InventoryDashboard = lazy(() => import("./pages/Inventory/InventoryDashboard"));
const InventoryPage = lazy(() => import("./pages/Inventory/InventoryPage")); // Added
const InventoryReportsPage = lazy(() => import("./pages/Inventory/InventoryReportsPage"));
const PartsInventoryPage = lazy(() => import("./pages/Inventory/PartsInventoryPage")); // Added
const PartsOrderingPage = lazy(() => import("./pages/Inventory/PartsOrderingPage")); // Added
const ReceivePartsPage = lazy(() => import("./pages/Inventory/ReceivePartsPage")); // Added
const JobCardManagement = lazy(() => import("./pages/workshop/JobCardManagement"));
const JobCardKanbanBoard = lazy(() => import("./pages/workshop/JobCardKanbanBoard")); // Added
const InspectionManagement = lazy(() => import("./pages/workshop/InspectionManagement"));
const QAReviewPanel = lazy(() => import("./pages/qc/QAReviewPanel")); // Added
const POApprovalSummary = lazy(() => import("./pages/Inventory/POApprovalSummary")); // Added
const PurchaseOrderTracker = lazy(() => import("./pages/Inventory/PurchaseOrderTracker")); // Added
const PurchaseOrderDetailView = lazy(() => import("./pages/Inventory/PurchaseOrderDetailView")); // Added
const ReportNewIncidentPage = lazy(() => import("./pages/workshop/ReportNewIncidentPage")); // Added

/* -----------------------------
 * Tyres
 * ----------------------------- */
const TyreManagementPage = lazy(() => import("./pages/tyres/TyreManagementPage"));
const TyreReferenceManagerPage = lazy(() => import("./pages/tyres/TyreReferenceManagerPage")); // Added
const TyrePerformanceDashboard = lazy(() => import("./pages/tyres/TyrePerformanceDashboard"));
const TyreHistoryPage = lazy(() => import("./pages/tyres/TyreHistoryPage")); // Added
const TyreFleetMap = lazy(() => import("./pages/tyres/TyreFleetMap")); // Added
const TyreStores = lazy(() => import("./pages/tyres/TyreStores")); // Added
const VehicleTyreView = lazy(() => import("./pages/tyres/VehicleTyreView")); // Added
const TyreMobilePage = lazy(() => import("./pages/mobile/TyreMobilePage")); // Added

/* -----------------------------
 * Analytics
 * ----------------------------- */
const VendorScorecard = lazy(() => import("./pages/Inventory/VendorScorecard")); // Added
const PerformanceAnalyticsPage = lazy(() => import("./pages/analytics/PerformanceAnalytics")); // Added

/* -----------------------------
 * Maps / Wialon
 * ----------------------------- */
const WialonDashboard = lazy(() => import("./pages/wialon/WialonDashboard")); // Path changed
const WialonConfigPage = lazy(() => import("./pages/wialon/WialonConfigPage")); // Added
const WialonUnitsPage = lazy(() => import("./pages/wialon/WialonUnitsPage")); // Path changed
const FleetManagementPage = lazy(() => import("./pages/trips/FleetManagementPage")); // Added
const FleetLocationMapPage = lazy(() => import("./components/Map/pages/FleetLocationMapPage"));

/* -----------------------------
 * Flags / Investigations
 * ----------------------------- */
const FlagsInvestigationsPage = lazy(() => import("./pages/trips/FlagsInvestigationsPage")); // Added

/* -----------------------------
 * Cost / Indirect costs
 * ----------------------------- */
const IndirectCostBreakdown = lazy(() => import("./pages/trips/IndirectCostBreakdown")); // Added

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

        {/* Trips */}
        <Route path="trips">
          <Route index element={withSuspense(TripDashboardPage)} />
          <Route path="dashboard" element={withSuspense(TripDashboardPage)} />
          <Route path="manage" element={withSuspense(TripManagementPage)} />
          <Route path="active" element={withSuspense(ActiveTripsPage)} />
          <Route path="completed" element={withSuspense(CompletedTrips)} />
          <Route path="system-costs/:tripId" element={withSuspense(SystemCostGenerator)} />
          <Route path="payments/:tripId" element={withSuspense(PaymentTrackingPanel)} />
          <Route path="reports/:tripId" element={withSuspense(ReportingPanel)} />
          <Route path="load-planning" element={withSuspense(LoadPlanningPage)} />
          <Route path="load-planning/component" element={withSuspense(LoadPlanningComponentPage)} />
          <Route path="calendar" element={withSuspense(TripCalendarPage)} />
          <Route path="timeline" element={withSuspense(TripTimelinePage)} />
          <Route path="report" element={withSuspense(TripReportPage)} />
          <Route path=":tripId" element={withSuspense(TripDetailsPage)} />
          <Route path="invoicing/:tripId" element={withSuspense(TripInvoicingPanel)} />
          <Route path="completion/:tripId" element={withSuspense(TripCompletionPanel)} />
          <Route path="flags/:tripId" element={withSuspense(FlagInvestigationPanel)} />
                  <Route path="missed-loads" element={withSuspense(MissedLoadsTracker, {
          missedLoads: [],
          onAddMissedLoad: (load: any) => console.log('Add missed load', load),
          onUpdateMissedLoad: (load: any) => console.log('Update missed load', load),
          onDeleteMissedLoad: (id: string) => console.log('Delete missed load', id)
        })} />
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
        </Route>

        {/* Analytics */}
        <Route path="analytics">
          <Route index element={withSuspense(PerformanceAnalyticsPage)} />
          <Route path="vendor-scorecard" element={withSuspense(VendorScorecard)} />
        </Route>

        {/* Maps / Wialon */}
        <Route path="maps">
          <Route index element={withSuspense(WialonDashboard)} />
          <Route path="wialon" element={withSuspense(WialonDashboard)} />
          <Route path="wialon/config" element={withSuspense(WialonConfigPage)} />
          <Route path="wialon/units" element={withSuspense(WialonUnitsPage)} />
          <Route path="fleet" element={withSuspense(FleetManagementPage)} />
          <Route path="fleet-map" element={withSuspense(FleetLocationMapPage)} />
        </Route>

        {/* Flags / Investigations */}
        <Route path="flags" element={withSuspense(FlagsInvestigationsPage)} />

        {/* Costs */}
        <Route path="costs/indirect" element={withSuspense(IndirectCostBreakdown)} />

        {/* Misc / other */}
        <Route path="load-planning" element={withSuspense(LoadPlanningPage)} />
        <Route path="load-planning/component" element={withSuspense(LoadPlanningComponentPage)} />
        <Route path="route-planning" element={withSuspense(RoutePlanningPage)} />
        <Route path="route-optimization" element={withSuspense(RouteOptimizationPage)} />
        <Route path="trip-calendar" element={withSuspense(TripCalendarPage)} />
        <Route path="incident/new" element={withSuspense(ReportNewIncidentPage)} />
          <Route path="missed-loads" element={withSuspense(MissedLoadsTracker, {
            missedLoads: [],
            onAddMissedLoad: (load: any) => console.log('Add missed load', load),
            onUpdateMissedLoad: (load: any) => console.log('Update missed load', load),
            onDeleteMissedLoad: (id: string) => console.log('Delete missed load', id)
          })} />        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
