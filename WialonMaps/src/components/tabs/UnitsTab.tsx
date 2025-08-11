// src/components/tabs/UnitsTab.tsx
import { useEffect, useState } from "react";
import type { WialonUnit, WialonUnitStatus } from "../../types/wialon";
import { Table } from "../ui/Table";
import { UnitDetailsModal } from "../tabs/UnitDetailsModal";

interface UnitsTabProps {
  units: WialonUnit[];
  onRefresh: () => void;
}

export const UnitsTab = ({ units, onRefresh }: UnitsTabProps) => {
  const [selectedUnit, setSelectedUnit] = useState<WialonUnit | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (autoRefresh) {
      interval = setInterval(() => {
        onRefresh();
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, onRefresh]);

  const columns = [
    { key: "status", header: "Status" },
    { key: "name", header: "Name" },
    { key: "driver", header: "Driver" },
    { key: "actions", header: "Actions" },
  ];

  const data = units.map((unit) => ({
    id: unit.id,
    status: <StatusIndicator status={unit.status ?? "unknown"} />,
    name: unit.name,
    driver: unit.driver?.name || "-",
    actions: (
      <button onClick={() => setSelectedUnit(unit)} className="text-blue-600 hover:text-blue-800">
        Details
      </button>
    ),
  }));

  return (
    <div className="units-tab">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Unit Management</h3>
        <div className="flex space-x-2">
          <button onClick={onRefresh} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
            Refresh
          </button>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            <span>Auto-refresh</span>
          </label>
        </div>
      </div>

      <Table columns={columns} data={data} />

      {selectedUnit && (
        <UnitDetailsModal unit={selectedUnit} onClose={() => setSelectedUnit(null)} />
      )}
    </div>
  );
};

const StatusIndicator = ({ status }: { status: WialonUnitStatus | undefined }) => {
  const s: WialonUnitStatus = status ?? "unknown";

  const statusColors: Record<WialonUnitStatus, string> = {
    online: "bg-green-500",
    moving: "bg-green-500",
    parked: "bg-yellow-500",
    offline: "bg-red-500",
    unknown: "bg-gray-500",
  };

  return (
    <div className="flex items-center">
      <span className={`w-3 h-3 rounded-full ${statusColors[s]}`}></span>
      <span className="ml-2 capitalize">{s}</span>
    </div>
  );
};

export default UnitsTab;
