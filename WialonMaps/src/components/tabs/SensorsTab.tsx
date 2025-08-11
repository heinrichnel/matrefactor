// /workspaces/matrefactor/WialonMaps/src/components/tabs/SensorsTab.tsx
import { useEffect, useState } from "react";
import type { WialonSensor, WialonUnit } from "../../types/wialon";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";

interface SensorsTabProps {
  units: WialonUnit[];
}

type SensorForm = Pick<WialonSensor, "name" | "type" | "measurement" | "parameter">;

export const SensorsTab = ({ units }: SensorsTabProps) => {
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [selectedSensor, setSelectedSensor] = useState<string>("");
  const [sensors, setSensors] = useState<WialonSensor[]>([]);
  const [formData, setFormData] = useState<Partial<SensorForm>>({
    name: "",
    type: "",
    measurement: "",
    parameter: "",
  });

  useEffect(() => {
    if (selectedUnit) {
      // Fetch sensors for selected unit (TODO: replace with real call)
      const unit = units.find((u) => u.id === selectedUnit);
      if (unit) {
        const mockSensors: WialonSensor[] = [
          {
            id: "1",
            name: "Fuel Level",
            type: "fuel",
            measurement: "liters",
            parameter: "fuel_level",
          },
          {
            id: "2",
            name: "Engine Temp",
            type: "temperature",
            measurement: "°C",
            parameter: "engine_temp",
          },
        ];
        setSensors(mockSensors);
      }
    } else {
      setSensors([]);
      setSelectedSensor("");
    }
  }, [selectedUnit, units]);

  const handleSensorSelect = (sensorId: string) => {
    const sensor = sensors.find((s) => s.id === sensorId);
    if (sensor) {
      setFormData({
        name: sensor.name,
        type: sensor.type,
        measurement: sensor.measurement,
        parameter: sensor.parameter,
      });
    } else {
      setFormData({ name: "", type: "", measurement: "", parameter: "" });
    }
    setSelectedSensor(sensorId);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as { name: keyof SensorForm; value: string };
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = () => {
    // TODO: Implement sensor creation
    console.log("Creating sensor:", formData);
  };

  const handleUpdate = () => {
    if (!selectedSensor) return;
    // TODO: Implement sensor update
    console.log("Updating sensor:", selectedSensor, formData);
  };

  const handleDelete = () => {
    if (!selectedSensor) return;
    // TODO: Implement sensor deletion
    console.log("Deleting sensor:", selectedSensor);
  };

  return (
    <div className="sensors-tab space-y-4">
      <h3 className="text-lg font-semibold">Sensor Management</h3>

      <div className="grid grid-cols-1 gap-4">
        <Select
          label="Unit"
          value={selectedUnit}
          onChange={setSelectedUnit}
          options={units.map((u) => ({ value: u.id, label: u.name }))}
        />

        <Select
          label="Sensor"
          value={selectedSensor}
          onChange={handleSensorSelect}
          options={sensors.map((s) => ({ value: s.id, label: s.name }))}
          disabled={!selectedUnit}
        />

        <div className="grid grid-cols-1 gap-2">
          <input
            type="text"
            name="name"
            placeholder="Sensor Name"
            value={formData.name || ""}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="type"
            placeholder="Sensor Type"
            value={formData.type || ""}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="measurement"
            placeholder="Sensor Measurement"
            value={formData.measurement || ""}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="parameter"
            placeholder="Sensor Parameter"
            value={formData.parameter || ""}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
        </div>

        <div className="flex space-x-2">
          <Button onClick={handleCreate}>Create</Button>
          <Button onClick={handleUpdate} disabled={!selectedSensor} variant="secondary">
            Update
          </Button>
          <Button onClick={handleDelete} disabled={!selectedSensor} variant="danger">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SensorsTab;
