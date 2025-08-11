import { WialonResource, WialonUnit } from "../../types/wialon";
import { CommandsTab } from "../tabs/CommandsTab";
import { DriversTab } from "../tabs/DriversTab";
import { ReportsTab } from "../tabs/ReportsTab";
import { SensorsTab } from "../tabs/SensorsTab";
import { UnitsTab } from "../tabs/UnitsTab";
import { Tabs } from "../ui/Tabs";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  units: WialonUnit[];
  resources: WialonResource[];
  onRefresh: () => void;
}

const TABS = [
  { id: "units", label: "Units" },
  { id: "drivers", label: "Drivers" },
  { id: "reports", label: "Reports" },
  { id: "sensors", label: "Sensors" },
  { id: "commands", label: "Commands" },
];

export const Sidebar = ({ activeTab, onTabChange, units, resources, onRefresh }: SidebarProps) => {
  return (
    <div className="sidebar">
      <Tabs tabs={TABS} activeTab={activeTab} onTabChange={onTabChange} />
      <div className="sidebar-content">
        {activeTab === "units" && <UnitsTab units={units} onRefresh={onRefresh} />}
        {activeTab === "drivers" && <DriversTab resources={resources} />}
        {activeTab === "reports" && <ReportsTab resources={resources} units={units} />}
        {activeTab === "sensors" && <SensorsTab units={units} />}
        {activeTab === "commands" && <CommandsTab units={units} />}
      </div>
    </div>
  );
};

export default Sidebar;
