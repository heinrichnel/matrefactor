import { useWialon } from "../../hooks/useWialon";
import { MapView } from "./MapView";
import { Sidebar } from "./Sidebar";
import { StatusBar } from "./StatusBar";

interface DashboardLayoutProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const DashboardLayout = ({ activeTab, onTabChange }: DashboardLayoutProps) => {
  const { units, resources, refreshUnits } = useWialon();

  return (
    <div className="dashboard-container">
      <div className="sidebar-container">
        <Sidebar
          activeTab={activeTab}
          onTabChange={onTabChange}
          units={units}
          resources={resources}
          onRefresh={refreshUnits}
        />
      </div>

      <div className="map-container">
        <MapView />
      </div>

      <StatusBar />
    </div>
  );
};

export default DashboardLayout;
