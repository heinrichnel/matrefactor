// src/components/tabs/ReportsTab.tsx
import { useEffect, useState } from "react";
import { exportToExcel } from "../../lib/reportUtils";
import type { WialonReport } from "../../lib/reportUtils"; // <-- FIX: import the right type
import type { WialonResource, WialonUnit } from "../../types/wialon";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";
import { Table } from "../ui/Table";

interface ReportsTabProps {
  resources: WialonResource[];
  units: WialonUnit[];
}

export const ReportsTab = ({ resources, units }: ReportsTabProps) => {
  const [selectedResource, setSelectedResource] = useState<string>("");
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [selectedReport, setSelectedReport] = useState<string>("");
  const [interval, setInterval] = useState<string>("86400");
  const [reportData, setReportData] = useState<WialonReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableReports = selectedResource
    ? resources.find((r) => r.id === selectedResource)?.reports || []
    : [];

  useEffect(() => {
    setSelectedReport("");
    setReportData(null);
  }, [selectedResource]);

  useEffect(() => {
    setReportData(null);
  }, [selectedUnit, selectedReport, interval]);

  const handleExecute = async () => {
    if (!selectedResource || !selectedReport || !selectedUnit) {
      setError("Please select all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with real report execution call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockReport: WialonReport = {
        id: "1",
        name: "Trip Report",
        tables: [
          {
            name: "Trips",
            headers: ["Date", "Distance", "Duration", "Start", "End"],
            rows: [
              ["2023-05-01", "156 km", "2h 45m", "Warehouse A", "Client B"],
              ["2023-05-02", "89 km", "1h 30m", "Client B", "Warehouse A"],
            ],
          },
        ],
      };

      setReportData(mockReport);
    } catch (err) {
      setError("Failed to execute report");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => setReportData(null);

  const handleExport = () => {
    if (reportData) exportToExcel(reportData);
  };

  return (
    <div className="reports-tab space-y-4">
      <h3 className="text-lg font-semibold">Reports</h3>

      <div className="grid grid-cols-1 gap-4">
        <Select
          label="Resource"
          value={selectedResource}
          onChange={setSelectedResource}
          options={resources.map((r) => ({ value: r.id, label: r.name }))}
        />

        <Select
          label="Report Template"
          value={selectedReport}
          onChange={setSelectedReport}
          options={availableReports.map((r) => ({ value: r.id, label: r.name }))}
          disabled={!selectedResource}
        />

        <Select
          label="Unit"
          value={selectedUnit}
          onChange={setSelectedUnit}
          options={units.map((u) => ({ value: u.id, label: u.name }))}
        />

        <Select
          label="Interval"
          value={interval}
          onChange={setInterval}
          options={[
            { value: "86400", label: "Last day" },
            { value: "604800", label: "Last week" },
            { value: "2592000", label: "Last month" },
          ]}
        />

        <div className="flex space-x-2">
          <Button onClick={handleExecute} loading={loading}>
            Execute
          </Button>
          <Button onClick={handleClear} variant="secondary" disabled={!reportData}>
            Clear
          </Button>
          <Button onClick={handleExport} variant="success" disabled={!reportData}>
            Export to Excel
          </Button>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        {reportData && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">{reportData.name}</h4>
            {reportData.tables.map((table, index) => (
              <div key={index} className="mb-6">
                <h5 className="text-sm font-semibold mb-1">{table.name}</h5>
                <Table
                  columns={table.headers.map((h, i) => ({ key: `${i}`, header: h }))}
                  data={table.rows.map((row, rIdx) => {
                    const obj: Record<string, string | number> & { id: string | number } = {
                      id: rIdx,
                    };
                    row.forEach((cell, cIdx) => {
                      obj[`${cIdx}`] = cell;
                    });
                    return obj;
                  })}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsTab;
