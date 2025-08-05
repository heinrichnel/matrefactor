// src/AppRoutes.tsx
import React, { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout"; // adjust alias/path if needed

// A tiny helper to keep JSX clean
const withSuspense = (Comp: React.LazyExoticComponent<any>) => (
  <Suspense fallback={<div className="p-6">Loading…</div>}>
    <Comp />
  </Suspense>
);

/* -----------------------------
 * Top-level / dashboard pages
 * ----------------------------- */
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const YearToDateKPIs = lazy(() => import("./pages/YearToDateKPIs"));
const ComplianceDashboard = lazy(() => import("./pages/ComplianceDashboard"));

/* -----------------------------
 * Trips
 * ----------------------------- */
const TripDashboardPage = lazy(() => import("./pages/TripDashboardPage"));
const TripManagementPage = lazy(() => import("./pages/TripManagementPage"));
const TripCalendarPage = lazy(() => import("./pages/TripCalendarPage"));
const TripTimelinePage = lazy(() => import("./pages/TripTimelinePage"));
const TripReportPage = lazy(() => import("./pages/TripReportPage"));
const ActiveTripsPage = lazy(() => import("./pages/ActiveTripsPageEnhanced"));
const CompletedTrips = lazy(() => import("./pages/CompletedTrips"));
const AddTripPage = lazy(() => import("./pages/AddTripPage"));
const TripDetailsPage = lazy(() => import("./pages/trips/TripDetailsPage"));
const TripInvoicingPanel = lazy(() => import("./pages/trips/TripInvoicingPanel"));
const TripCompletionPanel = lazy(() => import("./pages/trips/TripCompletionPanel"));
const FlagInvestigationPanel = lazy(() => import("./pages/trips/FlagInvestigationPanel"));
const SystemCostGenerator = lazy(() => import("./pages/trips/SystemCostGenerator"));
const PaymentTrackingPanel = lazy(() => import("./pages/trips/PaymentTrackingPanel"));
const ReportingPanel = lazy(() => import("./pages/trips/ReportingPanel"));
const LoadPlanningPage = lazy(() => import("./pages/LoadPlanningPage"));
const LoadPlanningComponentPage = lazy(() => import("./pages/LoadPlanningComponentPage"));
const RoutePlanningPage = lazy(() => import("./pages/RoutePlanningPage"));
const RouteOptimizationPage = lazy(() => import("./pages/RouteOptimizationPage"));
const TripCalendarTop = lazy(() => import("./pages/TripCalendarPage"));
const MissedLoadsTracker = lazy(() => import("./pages/MissedLoadsTracker"));

/* -----------------------------
 * Diesel
 * ----------------------------- */
const DieselDashboard = lazy(() => import("./pages/DieselDashboard"));
const DieselAnalysis = lazy(() => import("./pages/DieselAnalysis"));
const DieselDashboardComponent = lazy(() => import("./pages/diesel/DieselDashboardComponent"));
const AddFuelEntryPage = lazy(() => import("./pages/diesel/AddFuelEntryPage"));
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

/* -----------------------------
 * Drivers
 * ----------------------------- */
const DriverManagementPage = lazy(() => import("./pages/drivers/DriverManagementPage"));
const DriverDashboard = lazy(() => import("./pages/drivers/DriverDashboard"));
const DriverDetailsPage = lazy(() => import("./pages/drivers/DriverDetailsPage"));
const DriverBehaviorPage = lazy(() => import("./pages/drivers/DriverBehaviorPage"));
const SafetyScores = lazy(() => import("./pages/drivers/SafetyScores"));
const PerformanceAnalytics = lazy(() => import("./pages/drivers/PerformanceAnalytics"));
const DriverRewards = lazy(() => import("./pages/drivers/DriverRewards"));
const DriverScheduling = lazy(() => import("./pages/drivers/DriverScheduling"));
const DriverViolations = lazy(() => import("./pages/drivers/DriverViolations"));
const HoursOfService = lazy(() => import("./pages/drivers/HoursOfService"));
const TrainingRecords = lazy(() => import("./pages/drivers/TrainingRecords"));
const LicenseManagement = lazy(() => import("./pages/drivers/LicenseManagement"));
const AddNewDriver = lazy(() => import("./pages/drivers/AddNewDriver"));
const EditDriver = lazy(() => import("./pages/drivers/EditDriver"));

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

/* -----------------------------
 * Workshop
 * ----------------------------- */
const WorkshopOperations = lazy(() => import("./pages/WorkshopOperations"));
const WorkshopAnalytics = lazy(() => import("./pages/WorkshopAnalytics"));
const WorkOrderManagement = lazy(() => import("./pages/WorkOrderManagement"));
const PurchaseOrderPage = lazy(() => import("./pages/workshop/PurchaseOrderPage"));
const QRGenerator = lazy(() => import("./pages/workshop/QRGenerator"));
const QRScannerPage = lazy(() => import("./pages/workshop/QRScannerPage"));
const StockInventoryPage = lazy(() => import("./pages/workshop/StockInventoryPage"));
const VendorPage = lazy(() => import("./pages/workshop/VendorPage"));
const WorkshopPage = lazy(() => import("./pages/workshop/WorkshopPage"));
const InventoryDashboard = lazy(() => import("./pages/InventoryDashboard"));
const InventoryPage = lazy(() => import("./pages/InventoryPage"));
const InventoryReportsPage = lazy(() => import("./pages/InventoryReportsPage"));
const PartsInventoryPage = lazy(() => import("./pages/PartsInventoryPage"));
const PartsOrderingPage = lazy(() => import("./pages/PartsOrderingPage"));
const ReceivePartsPage = lazy(() => import("./pages/ReceivePartsPage"));
const JobCardManagement = lazy(() => import("./pages/JobCardManagement"));
const JobCardKanbanBoard = lazy(() => import("./pages/JobCardKanbanBoard"));
const InspectionManagement = lazy(() => import("./pages/InspectionManagement"));

/* -----------------------------
 * Tyres
 * ----------------------------- */
const TyreManagementPage = lazy(() => import("./pages/tyres/TyreManagementPage"));
const TyreReferenceManagerPage = lazy(() => import("./pages/tyres/TyreReferenceManagerPage"));
const AddNewTyrePage = lazy(() => import("./pages/tyres/AddNewTyrePage"));
const TyrePerformanceDashboard = lazy(() => import("./pages/TyrePerformanceDashboard"));
const TyreHistoryPage = lazy(() => import("./pages/TyreHistoryPage"));
const TyreFleetMap = lazy(() => import("./pages/TyreFleetMap"));
const TyreStores = lazy(() => import("./pages/TyreStores"));
const VehicleTyreView = lazy(() => import("./pages/VehicleTyreView"));
const VehicleTyreViewA = lazy(() => import("./pages/VehicleTyreViewA"));
const TyreMobilePage = lazy(() => import("./pages/mobile/TyreMobilePage"));

/* -----------------------------
 * Customers / Analytics
 * ----------------------------- */
const CustomerDashboard = lazy(() => import("./pages/CustomerDashboard"));
const CustomerReports = lazy(() => import("./pages/CustomerReports"));
const ActiveCustomers = lazy(() => import("./pages/ActiveCustomers"));
const ClientDetail = lazy(() => import("./pages/ClientDetail"));
const VendorScorecard = lazy(() => import("./pages/VendorScorecard"));
const RetentionMetrics = lazy(() => import("./pages/RetentionMetrics"));
const PerformanceAnalyticsPage = lazy(() => import("./pages/PerformanceAnalytics"));

/* -----------------------------
 * Maps / Wialon
 * ----------------------------- */
const WialonDashboard = lazy(() => import("./pages/WialonDashboard"));
const WialonConfigPage = lazy(() => import("./pages/WialonConfigPage"));
const WialonUnitsPage = lazy(() => import("./pages/WialonUnitsPage"));
const FleetManagementPage = lazy(() => import("./pages/FleetManagementPage"));
const FleetLocationMapPage = lazy(() => import("./components/Map/pages/FleetLocationMapPage"));

/* -----------------------------
 * Flags / Investigations
 * ----------------------------- */
const FlagsInvestigationsPage = lazy(() => import("./pages/FlagsInvestigationsPage"));

/* -----------------------------
 * Cost / Indirect costs
 * ----------------------------- */
const IndirectCostBreakdown = lazy(() => import("./pages/IndirectCostBreakdown"));

const QAReviewPanel = lazy(() => import("./pages/QAReviewPanel"));
const POApprovalSummary = lazy(() => import("./pages/POApprovalSummary"));
const PurchaseOrderTracker = lazy(() => import("./pages/PurchaseOrderTracker"));
const PurchaseOrderDetailView = lazy(() => import("./pages/PurchaseOrderDetailView"));
const ReportNewIncidentPage = lazy(() => import("./pages/ReportNewIncidentPage"));

/* -----------------------------
 * 404
 * ----------------------------- */
const NotFound = () => <div className="p-6">404 – Page not found</div>;

interface Trip {} // Add the Trip interface or import it

export const AppRoutes: React.FC = () => {
  const [showTripForm, setShowTripForm] = React.useState(false);
  const [editingTrip, setEditingTrip] = React.useState<Trip | undefined>(undefined);

  return (
    <Routes>
      {/* All app pages live under the Layout */}
      <Route
        path="/"
        element={<Layout setShowTripForm={setShowTripForm} setEditingTrip={setEditingTrip} />}
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
          <Route path="add" element={withSuspense(AddTripPage)} />
          <Route path="calendar" element={withSuspense(TripCalendarPage)} />
          <Route path="timeline" element={withSuspense(TripTimelinePage)} />
          <Route path="report" element={withSuspense(TripReportPage)} />
          <Route path="details/:tripId" element={withSuspense(TripDetailsPage)} />
          <Route path="invoicing/:tripId" element={withSuspense(TripInvoicingPanel)} />
          <Route path="completion/:tripId" element={withSuspense(TripCompletionPanel)} />
          <Route path="flags/:tripId" element={withSuspense(FlagInvestigationPanel)} />
          <Route path="system-costs/:tripId" element={withSuspense(SystemCostGenerator)} />
          <Route path="payments/:tripId" element={withSuspense(PaymentTrackingPanel)} />
          <Route path="reports/:tripId" element={withSuspense(ReportingPanel)} />
          <Route path="load-planning" element={withSuspense(LoadPlanningPage)} />
          <Route path="load-planning/component" element={withSuspense(LoadPlanningComponentPage)} />
        </Route>

        {/* Diesel */}
        <Route path="diesel">
          <Route index element={withSuspense(DieselDashboard)} />
          <Route path="dashboard" element={withSuspense(DieselDashboard)} />
          <Route path="analysis" element={withSuspense(DieselAnalysis)} />
          <Route path="manage" element={withSuspense(DieselManagementPage)} />
          <Route path="fuel-logs" element={withSuspense(FuelLogs)} />
          <Route path="add-entry" element={withSuspense(AddFuelEntryPage)} />
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
          <Route path="details/:driverId" element={withSuspense(DriverDetailsPage)} />
          <Route path="behavior" element={withSuspense(DriverBehaviorPage)} />
          <Route path="safety" element={withSuspense(SafetyScores)} />
          <Route path="performance" element={withSuspense(PerformanceAnalytics)} />
          <Route path="rewards" element={withSuspense(DriverRewards)} />
          <Route path="scheduling" element={withSuspense(DriverScheduling)} />
          <Route path="violations" element={withSuspense(DriverViolations)} />
          <Route path="hos" element={withSuspense(HoursOfService)} />
          <Route path="training" element={withSuspense(TrainingRecords)} />
          <Route path="licenses" element={withSuspense(LicenseManagement)} />
          <Route path="new" element={withSuspense(AddNewDriver)} />
          <Route path="edit/:driverId" element={withSuspense(EditDriver)} />
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
          <Route path="new" element={withSuspense(AddNewTyrePage)} />
          <Route path="performance" element={withSuspense(TyrePerformanceDashboard)} />
          <Route path="history" element={withSuspense(TyreHistoryPage)} />
          <Route path="fleet-map" element={withSuspense(TyreFleetMap)} />
          <Route path="stores" element={withSuspense(TyreStores)} />
          <Route path="vehicle-view/:vehicleId" element={withSuspense(VehicleTyreView)} />
          <Route path="vehicle-view-a/:vehicleId" element={withSuspense(VehicleTyreViewA)} />
          <Route path="mobile" element={withSuspense(TyreMobilePage)} />
        </Route>

        {/* Customers / Analytics */}
        <Route path="customers">
          <Route index element={withSuspense(CustomerDashboard)} />
          <Route path="dashboard" element={withSuspense(CustomerDashboard)} />
          <Route path="reports" element={withSuspense(CustomerReports)} />
          <Route path="active" element={withSuspense(ActiveCustomers)} />
          <Route path="detail/:id" element={withSuspense(ClientDetail)} />
          <Route path="retention" element={withSuspense(RetentionMetrics)} />
        </Route>
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
        <Route path="trip-calendar" element={withSuspense(TripCalendarTop)} />
        <Route path="incident/new" element={withSuspense(ReportNewIncidentPage)} />
        <Route path="missed-loads" element={withSuspense(MissedLoadsTracker)} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
