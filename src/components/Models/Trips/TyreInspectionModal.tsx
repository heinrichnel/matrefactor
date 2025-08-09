import React from "react";
import { TyreInspection } from "../../../hooks/useTyreInspections";

interface TyreInspectionModalProps {
  open: boolean;
  tyrePosition: string;
  fleetNumber: string;
  onClose: () => void;
  onSubmit: (data: TyreInspection) => void;
}

const TyreInspectionModal: React.FC<TyreInspectionModalProps> = ({
  open,
  tyrePosition,
  fleetNumber,
  onClose,
  onSubmit,
}) => {
  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create mock inspection data
    const mockInspection: TyreInspection = {
      id: `inspection-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      tyreId: "sample-tyre-id",
      treadDepth: 18,
      pressure: 120,
      temperature: 35,
      status: "good",
      inspector: "Current User",
      notes: "Sample inspection",
    };

    onSubmit(mockInspection);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Tyre Inspection</h2>
        <p className="mb-4">
          Fleet Number: <span className="font-semibold">{fleetNumber}</span>
          <br />
          Position: <span className="font-semibold">{tyrePosition}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form fields would go here in a real implementation */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tread Depth (mm)</label>
              <input
                type="number"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="18.0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Pressure (PSI)</label>
              <input
                type="number"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="120"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              rows={3}
              placeholder="Enter inspection notes..."
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Save Inspection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TyreInspectionModal;
