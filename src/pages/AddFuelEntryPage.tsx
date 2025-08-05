import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import Card, { CardContent, CardHeader } from "../components/ui/Card";
import { Droplet, Truck, Calendar, Save } from "lucide-react";
import Button from "../components/ui/Button";

const AddFuelEntryPage: React.FC = () => {
  const { isLoading } = useAppContext();
  const [formData, setFormData] = useState({
    vehicle: "",
    liters: "",
    date: new Date().toISOString().split("T")[0],
    odometer: "",
    location: "",
    fuelType: "diesel",
    cost: "",
    currency: "USD",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting fuel entry:", formData);
    // Add code to submit the data to your backend
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Add Fuel Entry</h1>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Fuel Entry Details</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
                <select
                  name="vehicle"
                  value={formData.vehicle}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Vehicle</option>
                  <option value="vehicle-1">Vehicle 1</option>
                  <option value="vehicle-2">Vehicle 2</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Liters/Gallons
                </label>
                <input
                  type="number"
                  name="liters"
                  value={formData.liters}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Odometer (km)
                </label>
                <input
                  type="number"
                  name="odometer"
                  value={formData.odometer}
                  onChange={handleChange}
                  placeholder="Current reading"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    name="cost"
                    value={formData.cost}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full p-2 pl-7 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Fuel station location"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional information"
                className="w-full p-2 border border-gray-300 rounded-md h-24"
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Fuel Entry
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddFuelEntryPage;
