import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

// Context Providers
import { AppProvider } from "./context/AppContext";
import { DriverBehaviorProvider } from "./context/DriverBehaviorContext";
import { SyncProvider } from "./context/SyncContext";
import { TripProvider } from "./context/TripContext";
import { TyreReferenceDataProvider } from "./context/TyreReferenceDataContext";
import { TyreStoresProvider } from "./context/TyreStoresContext";
import { WialonProvider, useWialon } from "./context/WialonProvider";
import { WorkshopProvider } from "./context/WorkshopContext";

// Error Handling
import ErrorBoundary from "./components/ErrorBoundary";
import ConnectionStatusIndicator from "./components/ui/ConnectionStatusIndicator";
import FirestoreConnectionError from "./components/ui/FirestoreConnectionError";
import OfflineBanner from "./components/ui/OfflineBanner";
import {
  ErrorCategory,
  ErrorSeverity,
  handleError,
  registerErrorHandler,
} from "./utils/errorHandling";

// Offline & Network Support
import { initializeConnectionMonitoring } from "./utils/firebaseConnectionHandler";
import { startNetworkMonitoring } from "./utils/networkDetection";
import { initOfflineCache } from "./utils/offlineCache";
import { syncOfflineOperations } from "./utils/offlineOperations";

// Auto-init Wialon
import "./api/wialon";

// Layout
import Layout from "./components/layout/Layout";

// Core Components
import TripFormModal from "./components/Models/Trips/TripFormModal";
import Dashboard from "./pages/Dashboard";
import DashboardPage from "./pages/DashboardPage";
import FormsIntegrationPage from "./pages/FormsIntegrationPage";

// === TRIPS ===
import DriverPerformancePage from "./components/DriverManagement/DriverPerformancePage";
import MapsView from "./components/Map/MapsView";
import LoadConfirmation from "./components/TripManagement/LoadConfirmation";
import TripTemplateManager from "./components/TripManagement/TripTemplateManager";
import ActiveTripsPage from "./pages/ActiveTripsPageEnhanced";
import AddTripPage from "./pages/AddTripPage";
import FlagsInvestigations from "./pages/FlagsInvestigationsPage";
import FleetManagementPage from "./pages/FleetManagementPage";
import LoadPlanningPage from "./pages/LoadPlanningPage";
import RouteOptimizationPage from "./pages/RouteOptimizationPage";
import RoutePlanningPage from "./pages/RoutePlanningPage";
import TripCalendarPage from "./pages/TripCalendarPage";
import TripDashboard from "./pages/TripDashboard";
import TripManagementPage from "./pages/TripManagementPage";
import TripReportPage from "./pages/TripReportPage";
import MainTripWorkflow from "./pages/trips/MainTripWorkflow";
import TripDetailsPage from "./pages/trips/TripDetailsPage";
import TripTimelinePage from "./pages/trips/TripTimelinePage";

// === INVOICES ===
import CurrencyFleetReport from "./components/InvoiceManagement/CurrencyFleetReport";
import ReportsUI from "./components/ui/reports";
import CreateInvoicePage from "./pages/invoices/CreateInvoicePage";
import CreateQuotePage from "./pages/invoices/CreateQuotePage";
import InvoiceApprovalFlow from "./pages/invoices/InvoiceApprovalFlow";
import InvoiceBuilder from "./pages/invoices/InvoiceBuilder";
import InvoiceDashboard from "./pages/invoices/InvoiceDashboard";
import InvoiceManagementPage from "./pages/invoices/InvoiceManagementPage";
import InvoiceTemplatesPage from "./pages/invoices/InvoiceTemplatesPage";
import PaidInvoicesPage from "./pages/invoices/PaidInvoicesPage";
import PendingInvoicesPage from "./pages/invoices/PendingInvoicesPage";
import TaxReportExport from "./pages/invoices/TaxReportExport";

// === DIESEL ===
import AddFuelEntryPage from "./pages/diesel/AddFuelEntryPage";
import BudgetPlanning from "./pages/diesel/BudgetPlanning";
import CarbonFootprintCalc from "./pages/diesel/CarbonFootprintCalc";
import DieselDashboardComponent from "./pages/diesel/DieselDashboardComponent";
import DieselManagementPage from "./pages/diesel/DieselManagementPage";
import DriverFuelBehavior from "./pages/diesel/DriverFuelBehavior";
import FuelCardManager from "./pages/diesel/FuelCardManager";
import FuelEfficiencyReport from "./pages/diesel/FuelEfficiencyReport";
import FuelLogs from "./pages/diesel/FuelLogs";
import FuelTheftDetection from "./pages/diesel/FuelTheftDetection";

// === CLIENTS ===
import ActiveCustomers from "./pages/clients/ActiveCustomers";
import AddNewCustomer from "./pages/clients/AddNewCustomer";
import ClientManagementPage from "./pages/clients/ClientManagementPage";
import ClientNetworkMap from "./pages/clients/ClientNetworkMap";
import CustomerReports from "./pages/clients/CustomerReports";
import RetentionMetrics from "./pages/clients/RetentionMetrics";

// === DRIVERS ===
import AddNewDriver from "./pages/drivers/AddNewDriver";
import DriverBehaviorPage from "./pages/drivers/DriverBehaviorPage";
import DriverDashboard from "./pages/drivers/DriverDashboard";
import DriverDetailsPage from "./pages/drivers/DriverDetailsPage";
import DriverManagementPage from "./pages/drivers/DriverManagementPage";
import DriverProfiles from "./pages/drivers/DriverProfiles";
import DriverRewards from "./pages/drivers/DriverRewards";
import DriverScheduling from "./pages/drivers/DriverScheduling";
import DriverViolations from "./pages/drivers/DriverViolations";
import EditDriver from "./pages/drivers/EditDriver";
import HoursOfService from "./pages/drivers/HoursOfService";
import LicenseManagement from "./pages/drivers/LicenseManagement";
import PerformanceAnalytics from "./pages/drivers/PerformanceAnalytics";
import TrainingRecords from "./pages/drivers/TrainingRecords";

// === COMPLIANCE ===
import ComplianceDashboard from "./pages/ComplianceDashboard";
import InspectionManagement from "./pages/InspectionManagement";
import QAReviewPanel from "./pages/QAReviewPanel";

// === ANALYTICS ===
import PredictiveModels from "./components/Models/Driver/PredictiveModels";
import IndirectCostBreakdown from "./pages/IndirectCostBreakdown";
import YearToDateKPIs from "./pages/YearToDateKPIs";

// === WORKSHOP ===
import FaultTracking from "./components/WorkshopManagement/FaultTracking";
import InspectionHistoryPage from "./components/WorkshopManagement/inspections";
import VehicleInspectionPage from "./components/WorkshopManagement/vehicle-inspection";
import WorkshopIntegration from "./components/workshop/WorkshopIntegration";
import InventoryDashboard from "./pages/InventoryDashboard";
import JobCardManagement from "./pages/JobCardManagement";
import PartsOrderingPage from "./pages/PartsOrderingPage";
import TyreManagementPage from "./pages/tyres/TyreManagementPage";
import PurchaseOrderPage from "./pages/workshop/PurchaseOrderPage";
import QRGenerator from "./pages/workshop/QRGenerator";
import QRScannerPage from "./pages/workshop/QRScannerPage";
import StockInventoryPage from "./pages/workshop/StockInventoryPage";
import VendorPage from "./pages/workshop/VendorPage";
import WorkshopPage from "./pages/workshop/WorkshopPage";

// === TYRES ===
import TyreIntegration from "./components/tyres/TyreIntegration";
import TyreFleetMap from "./pages/TyreFleetMap";
import TyreHistoryPage from "./pages/TyreHistoryPage";
import TyrePerformanceDashboard from "./pages/TyrePerformanceDashboard";
import TyreMobilePage from "./pages/mobile/TyreMobilePage";
import AddNewTyrePage from "./pages/tyres/AddNewTyrePage";
import TyreReferenceManagerPage from "./pages/tyres/TyreReferenceManagerPage";

// === INVENTORY ===
import InventoryPage from "./pages/InventoryPage";
import InventoryReportsPage from "./pages/InventoryReportsPage";
import PartsInventoryPage from "./pages/PartsInventoryPage";
import ReceivePartsPage from "./pages/ReceivePartsPage";

// === WIALON ===
import WialonDashboard from "./pages/WialonDashboard";

// === REPORTS & OTHER ===
import { ScanQRButton } from "./components/ScanQRButton";
import UIConnector from "./components/UIConnector";

const WialonStatusIndicator: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { initialized, initializing, error } = useWialon();

  if (error) return <div className={`text-sm text-red-500 ${className}`}>Wialon: Error</div>;
  if (initializing)
    return <div className={`text-sm text-amber-500 ${className}`}>Wialon: Connecting...</div>;
  if (initialized)
    return <div className={`text-sm text-green-500 ${className}`}>Wialon: Connected</div>;
  return <div className={`text-sm text-gray-500 ${className}`}>Wialon: Disconnected</div>;
};

const App: React.FC = () => {
  const [connectionError, setConnectionError] = useState<Error | null>(null);
  const [editingTrip, setEditingTrip] = useState<any>();
  const [showTripForm, setShowTripForm] = useState(false);

  useEffect(() => {
    const unregisterErrorHandler = registerErrorHandler((error) => {
      if (error.severity === ErrorSeverity.FATAL) setConnectionError(error.originalError);
    });

    initializeConnectionMonitoring().catch((error) =>
      setConnectionError(new Error(`Failed to initialize Firebase connection: ${error.message}`))
    );
    handleError(async () => await initOfflineCache(), {
      category: ErrorCategory.DATABASE,
      context: { component: "App", operation: "initOfflineCache" },
      maxRetries: 3,
    }).catch((error) =>
      setConnectionError(new Error(`Failed to initialize offline cache: ${error.message}`))
    );

    startNetworkMonitoring(30000);
    const handleOnline = async () => {
      try {
        await handleError(async () => await syncOfflineOperations(), {
          category: ErrorCategory.NETWORK,
          context: { component: "App", operation: "syncOfflineOperations" },
          maxRetries: 3,
        });
      } catch {}
    };
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
      unregisterErrorHandler();
    };
  }, []);

  return (
    <ErrorBoundary>
      <AppProvider>
        <SyncProvider>
          <WialonProvider>
            <TyreStoresProvider>
              <TripProvider>
                <DriverBehaviorProvider>
                  <WorkshopProvider>
                    <TyreReferenceDataProvider>
                      <div className="fixed top-0 left-0 right-0 z-50 p-4">
                        <FirestoreConnectionError />
                        {connectionError && <FirestoreConnectionError error={connectionError} />}
                      </div>

                      <WialonStatusIndicator className="fixed bottom-16 right-4 z-40" />
                      <OfflineBanner />
                      <ConnectionStatusIndicator
                        showText={true}
                        className="fixed bottom-4 right-4 z-40"
                      />
                      {process.env.NODE_ENV !== "production" && <UIConnector />}

                      <Routes>
                        <Route
                          path="/*"
                          element={
                            <Layout
                              setShowTripForm={setShowTripForm}
                              setEditingTrip={setEditingTrip}
                            />
                          }
                        >
                          {/* Main */}
                          <Route index element={<DashboardPage />} />
                          <Route path="dashboard" element={<DashboardPage />} />
                          <Route path="new-dashboard" element={<Dashboard />} />
                          <Route path="forms-integration" element={<FormsIntegrationPage />} />

                          {/* Trips */}
                          <Route path="trips" element={<TripManagementPage />} />
                          <Route path="trips/active" element={<ActiveTripsPage />} />
                          <Route path="trips/:id" element={<TripDetailsPage />} />
                          <Route path="trips/timeline" element={<TripTimelinePage />} />
                          <Route path="trips/planning" element={<RoutePlanningPage />} />
                          <Route path="trips/optimization" element={<RouteOptimizationPage />} />
                          <Route path="trips/load-planning" element={<LoadPlanningPage />} />
                          <Route path="trips/calendar" element={<TripCalendarPage />} />
                          <Route path="trips/add" element={<AddTripPage />} />
                          <Route path="trips/workflow" element={<MainTripWorkflow />} />
                          <Route path="trips/map" element={<MapsView />} />
                          <Route path="trips/dashboard" element={<TripDashboard />} />
                          <Route path="trips/reports" element={<TripReportPage />} />
                          <Route path="trips/templates" element={<TripTemplateManager />} />
                          <Route path="trips/confirmations" element={<LoadConfirmation />} />
                          <Route path="trips/cost-analysis" element={<TripReportPage />} />
                          <Route path="trips/utilization" element={<FleetManagementPage />} />
                          <Route
                            path="trips/driver-performance"
                            element={<DriverPerformancePage />}
                          />
                          <Route path="trips/flags" element={<FlagsInvestigations />} />
                          <Route path="trips/wialon-tracking" element={<WialonDashboard />} />

                          {/* Invoices */}
                          <Route path="invoices" element={<InvoiceManagementPage />} />
                          <Route path="invoices/dashboard" element={<InvoiceDashboard />} />
                          <Route path="invoices/templates" element={<InvoiceTemplatesPage />} />
                          <Route path="invoices/new" element={<CreateInvoicePage />} />
                          <Route path="invoices/new-quote" element={<CreateQuotePage />} />
                          <Route path="invoices/approval" element={<InvoiceApprovalFlow />} />
                          <Route path="invoices/builder" element={<InvoiceBuilder />} />
                          <Route path="invoices/tax-export" element={<TaxReportExport />} />
                          <Route path="invoices/reports" element={<ReportsUI />} />
                          <Route path="invoices/analytics" element={<CurrencyFleetReport />} />
                          <Route path="invoices/pending" element={<PendingInvoicesPage />} />
                          <Route path="invoices/paid" element={<PaidInvoicesPage />} />

                          {/* Diesel */}
                          <Route path="diesel" element={<DieselManagementPage />} />
                          <Route path="diesel/add-fuel" element={<AddFuelEntryPage />} />
                          <Route path="diesel/dashboard" element={<DieselDashboardComponent />} />
                          <Route path="diesel/logs" element={<FuelLogs />} />
                          <Route path="diesel/card-manager" element={<FuelCardManager />} />
                          <Route path="diesel/theft-detection" element={<FuelTheftDetection />} />
                          <Route path="diesel/carbon-footprint" element={<CarbonFootprintCalc />} />
                          <Route path="diesel/driver-behavior" element={<DriverFuelBehavior />} />
                          <Route path="diesel/efficiency" element={<FuelEfficiencyReport />} />
                          <Route path="diesel/budget" element={<BudgetPlanning />} />

                          {/* Clients */}
                          <Route path="clients" element={<ClientManagementPage />} />
                          <Route path="clients/new" element={<AddNewCustomer />} />
                          <Route
                            path="clients/active"
                            element={
                              <ActiveCustomers
                                clients={[]}
                                searchTerm=""
                                onSelectClient={() => {}}
                                onAddClient={() => {}}
                              />
                            }
                          />
                          <Route
                            path="clients/reports"
                            element={
                              <CustomerReports
                                clients={[]}
                                trips={[]}
                                selectedClientId={null}
                                onSelectClient={() => {}}
                              />
                            }
                          />
                          <Route
                            path="clients/retention"
                            element={
                              <RetentionMetrics
                                clients={[]}
                                selectedClientId={null}
                                onSelectClient={() => {}}
                              />
                            }
                          />
                          <Route path="clients/relationships" element={<ClientNetworkMap />} />

                          {/* Drivers */}
                          <Route path="drivers" element={<DriverManagementPage />} />
                          <Route path="drivers/new" element={<AddNewDriver />} />
                          <Route path="drivers/profiles" element={<DriverProfiles />} />
                          <Route path="drivers/profiles/:id" element={<DriverDetailsPage />} />
                          <Route path="drivers/profiles/:id/edit" element={<EditDriver />} />
                          <Route path="drivers/licenses" element={<LicenseManagement />} />
                          <Route path="drivers/training" element={<TrainingRecords />} />
                          <Route path="drivers/performance" element={<PerformanceAnalytics />} />
                          <Route path="drivers/scheduling" element={<DriverScheduling />} />
                          <Route path="drivers/hours" element={<HoursOfService />} />
                          <Route path="drivers/violations" element={<DriverViolations />} />
                          <Route path="drivers/rewards" element={<DriverRewards />} />
                          <Route path="drivers/behavior" element={<DriverBehaviorPage />} />
                          <Route path="drivers/safety-scores" element={<PerformanceAnalytics />} />
                          <Route path="drivers/dashboard" element={<DriverDashboard />} />

                          {/* Compliance */}
                          <Route path="compliance" element={<ComplianceDashboard />} />
                          <Route path="compliance/dot" element={<ComplianceDashboard />} />
                          <Route
                            path="compliance/safety-inspections"
                            element={<InspectionManagement />}
                          />
                          <Route path="compliance/training" element={<TrainingRecords />} />
                          <Route
                            path="compliance/audits"
                            element={
                              <QAReviewPanel
                                jobCardId="JC-2023-001"
                                tasks={[
                                  {
                                    id: "1",
                                    title: "Inspect braking system",
                                    description:
                                      "Complete inspection of brake pads, discs, and fluid",
                                    category: "Safety",
                                    status: "completed",
                                    estimatedHours: 1.5,
                                    isCritical: true,
                                    completedBy: "John Technician",
                                    completedAt: new Date().toISOString(),
                                  },
                                  {
                                    id: "2",
                                    title: "Check tire pressure and condition",
                                    description:
                                      "Verify proper pressure and inspect for wear or damage",
                                    category: "Routine",
                                    status: "completed",
                                    estimatedHours: 0.5,
                                    isCritical: false,
                                    completedBy: "Jane Mechanic",
                                    completedAt: new Date().toISOString(),
                                  },
                                ]}
                                taskHistory={[
                                  {
                                    id: "101",
                                    taskId: "1",
                                    event: "statusChanged",
                                    by: "John Technician",
                                    at: new Date(Date.now() - 3600000).toISOString(),
                                    previousStatus: "pending",
                                    newStatus: "in_progress",
                                    notes: "Started the inspection",
                                  },
                                  {
                                    id: "102",
                                    taskId: "1",
                                    event: "statusChanged",
                                    by: "John Technician",
                                    at: new Date().toISOString(),
                                    previousStatus: "in_progress",
                                    newStatus: "completed",
                                    notes: "Completed with no issues found",
                                  },
                                ]}
                                onVerifyTask={async (taskId) => {
                                  console.log(`Task ${taskId} verified`);
                                  return Promise.resolve();
                                }}
                                canVerifyAllTasks={true}
                                onVerifyAllTasks={async () => {
                                  console.log("All tasks verified");
                                  return Promise.resolve();
                                }}
                                isLoading={false}
                              />
                            }
                          />
                          <Route path="compliance/violations" element={<DriverViolations />} />
                          <Route path="compliance/insurance" element={<ComplianceDashboard />} />

                          {/* Analytics */}
                          <Route path="analytics" element={<YearToDateKPIs />} />
                          <Route path="analytics/kpi" element={<YearToDateKPIs />} />
                          <Route path="analytics/predictive" element={<PredictiveModels />} />
                          <Route path="analytics/costs" element={<IndirectCostBreakdown />} />
                          <Route path="analytics/roi" element={<YearToDateKPIs />} />
                          <Route path="analytics/benchmarks" element={<PerformanceAnalytics />} />
                          <Route path="analytics/custom-reports" element={<TripReportPage />} />

                          {/* Workshop */}
                          <Route path="workshop" element={<WorkshopPage />} />
                          <Route path="workshop/vendors" element={<VendorPage />} />
                          <Route path="workshop/purchase-orders" element={<PurchaseOrderPage />} />
                          <Route path="workshop/stock-inventory" element={<StockInventoryPage />} />
                          <Route path="workshop/qr-generator" element={<QRGenerator />} />
                          <Route path="workshop/qr-scanner" element={<QRScannerPage />} />
                          <Route path="workshop/inspections" element={<InspectionHistoryPage />} />
                          <Route path="workshop/job-cards" element={<JobCardManagement />} />
                          <Route path="workshop/faults" element={<FaultTracking />} />
                          <Route path="workshop/tyres" element={<TyreManagementPage />} />
                          <Route path="workshop/parts-ordering" element={<PartsOrderingPage />} />
                          <Route
                            path="workshop/vehicle-inspection"
                            element={<VehicleInspectionPage />}
                          />
                          <Route
                            path="integration-debug/workshop"
                            element={<WorkshopIntegration />}
                          />

                          {/* Tyres */}
                          <Route path="tyres" element={<TyreManagementPage />} />
                          <Route path="tyres/mobile" element={<TyreMobilePage />} />
                          <Route path="tyres/add" element={<AddNewTyrePage />} />
                          <Route
                            path="tyres/reference-data"
                            element={<TyreReferenceManagerPage />}
                          />
                          <Route path="tyres/fleet-map" element={<TyreFleetMap />} />
                          <Route path="tyres/history" element={<TyreHistoryPage />} />
                          <Route path="tyres/dashboard" element={<TyrePerformanceDashboard />} />
                          <Route path="integration-debug/tyres" element={<TyreIntegration />} />

                          {/* Inventory */}
                          <Route path="inventory" element={<InventoryPage />} />
                          <Route path="inventory/dashboard" element={<InventoryDashboard />} />
                          <Route path="inventory/stock" element={<PartsInventoryPage />} />
                          <Route path="inventory/ordering" element={<PartsOrderingPage />} />
                          <Route path="inventory/receive" element={<ReceivePartsPage />} />
                          <Route path="inventory/reports" element={<InventoryReportsPage />} />

                          {/* Default */}
                          <Route path="*" element={<DashboardPage />} />
                        </Route>
                      </Routes>

                      <TripFormModal
                        isOpen={showTripForm}
                        onClose={() => setShowTripForm(false)}
                        editingTrip={editingTrip}
                      />
                      {typeof window !== "undefined" && (window as any).Capacitor && (
                        <div className="fixed bottom-6 right-6 z-50">
                          <ScanQRButton />
                        </div>
                      )}
                    </TyreReferenceDataProvider>
                  </WorkshopProvider>
                </DriverBehaviorProvider>
              </TripProvider>
            </TyreStoresProvider>
          </WialonProvider>
        </SyncProvider>
      </AppProvider>
    </ErrorBoundary>
  );
};

export default App;
