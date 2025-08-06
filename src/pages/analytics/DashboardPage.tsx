import AnalyticsControls from "@/components/AnalyticsControls";
import { FleetAnalyticsLineChart } from "@/components/charts/FleetAnalyticsLineChart";
import { FleetCostAreaChart } from "@/components/charts/FleetCostAreaChart";
import { FleetStatusDoughnut } from "@/components/charts/FleetStatusDoughnut";
import { FleetUtilizationLine } from "@/components/charts/FleetUtilizationLine";
import { PerformanceLineChart } from "@/components/charts/PerformanceLineChart";
import { RechartsLineChart } from "@/components/charts/RechartsLineChart";
import { ROIBarChart } from "@/components/charts/ROIBarChart";
import { VehicleUtilizationChart } from "@/components/charts/VehicleUtilizationChart";
import { Button } from "@/components/ui/button";
import { FleetAnalyticsProvider, useFleetAnalytics } from "@/context/FleetAnalyticsContext";

const DashboardContent = () => {
  const { refreshData, isLoading } = useFleetAnalytics();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Fleet Analytics Dashboard</h2>
        <Button onClick={() => refreshData()} disabled={isLoading}>
          {isLoading ? "Refreshing..." : "Refresh Data"}
        </Button>
      </div>

      {/* Analytics Controls */}
      <div className="mb-6">
        <AnalyticsControls />
      </div>

      {/* Top row with fleet status and ROI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-3">Fleet Status</h3>
          <FleetStatusDoughnut />
        </div>

        <div className="bg-white p-4 rounded-lg shadow lg:col-span-2">
          <h3 className="text-lg font-medium mb-3">ROI Analysis</h3>
          <ROIBarChart />
        </div>
      </div>

      {/* Interactive charts row */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        <VehicleUtilizationChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-3">Performance Metrics</h3>
          <PerformanceLineChart />
        </div>

        <FleetAnalyticsLineChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-3">Cost Analysis</h3>
          <RechartsLineChart />
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <FleetCostAreaChart />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-3">Fleet Utilization Trend</h3>
        <FleetUtilizationLine />
      </div>
    </div>
  );
};

// Wrap with Provider
const DashboardPage = () => {
  return (
    <FleetAnalyticsProvider>
      <DashboardContent />
    </FleetAnalyticsProvider>
  );
};

export default DashboardPage;
