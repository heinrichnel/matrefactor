// /workspaces/matrefactor/WialonMaps/src/components/tabs/DriversTab.tsx
import { useEffect, useState } from "react";
import { useWialon } from "../../hooks/useWialon";
import type { WialonDriver as BaseDriver, WialonResource } from "../../types/wialon";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";

/**
 * Locally extend the base driver with optional fields used by the UI.
 * This unblocks the component even if another file still defines a narrower WialonDriver.
 */
type WialonDriver = BaseDriver & {
  code?: string;
  phone?: string;
};

interface DriversTabProps {
  resources: WialonResource[];
}

type DriverForm = { name: string; code: string; phone: string };

export const DriversTab = ({ resources }: DriversTabProps) => {
  const [selectedResource, setSelectedResource] = useState<string>("");
  const [selectedDriver, setSelectedDriver] = useState<string>("");
  const [drivers, setDrivers] = useState<WialonDriver[]>([]);
  const [formData, setFormData] = useState<DriverForm>({ name: "", code: "", phone: "" });
  const { loading, error } = useWialon();

  useEffect(() => {
    if (!selectedResource) {
      setDrivers([]);
      setSelectedDriver("");
      return;
    }

    // TODO: Replace with real API call
    const res = resources.find((r) => r.id === selectedResource);
    if (!res) return;

    const mockDrivers: WialonDriver[] = [
      { id: "1", name: "John Doe", code: "JD123", phone: "+1234567890" },
      { id: "2", name: "Jane Smith", code: "JS456", phone: "+9876543210" },
    ];
    setDrivers(mockDrivers);
  }, [selectedResource, resources]);

  const handleDriverSelect = (driverId: string) => {
    const driver = drivers.find((d) => d.id === driverId);
    if (driver) {
      setFormData({
        name: driver.name ?? "",
        code: driver.code ?? "",
        phone: driver.phone ?? "",
      });
    } else {
      setFormData({ name: "", code: "", phone: "" });
    }
    setSelectedDriver(driverId);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as { name: keyof DriverForm; value: string };
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = () => {
    // TODO: Implement driver creation
    console.log("Creating driver:", formData);
  };

  const handleUpdate = () => {
    if (!selectedDriver) return;
    // TODO: Implement driver update
    console.log("Updating driver:", selectedDriver, formData);
  };

  const handleDelete = () => {
    if (!selectedDriver) return;
    // TODO: Implement driver deletion
    console.log("Deleting driver:", selectedDriver);
  };

  return (
    <div className="drivers-tab space-y-4">
      <h3 className="text-lg font-semibold">Driver Management</h3>

      <div className="grid grid-cols-1 gap-4">
        <Select
          label="Resource"
          value={selectedResource}
          onChange={setSelectedResource}
          options={resources.map((r) => ({ value: r.id, label: r.name }))}
          disabled={loading}
        />

        <Select
          label="Driver"
          value={selectedDriver}
          onChange={handleDriverSelect}
          options={drivers.map((d) => ({ value: d.id, label: d.name }))}
          disabled={!selectedResource || loading}
        />

        <div className="grid grid-cols-1 gap-2">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="code"
            placeholder="Code"
            value={formData.code}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
        </div>

        <div className="flex space-x-2">
          <Button onClick={handleCreate} disabled={loading}>
            Create
          </Button>
          <Button onClick={handleUpdate} disabled={!selectedDriver || loading} variant="secondary">
            Update
          </Button>
          <Button onClick={handleDelete} disabled={!selectedDriver || loading} variant="danger">
            Delete
          </Button>
        </div>

        {error && <p className="text-red-500">{error.message}</p>}
      </div>
    </div>
  );
};

export default DriversTab;
