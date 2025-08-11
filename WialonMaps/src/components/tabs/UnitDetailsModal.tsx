import type { WialonUnit } from "../../types/wialon";

interface UnitDetailsModalProps {
  unit: WialonUnit;
  onClose: () => void;
}

export const UnitDetailsModal = ({ unit, onClose }: UnitDetailsModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded shadow-lg max-w-md w-full p-6 space-y-4">
        <h4 className="text-lg font-semibold">Unit Details</h4>
        <div className="space-y-1 text-sm">
          <p>
            <strong>Name:</strong> {unit.name}
          </p>
          <p>
            <strong>Status:</strong> {unit.status}
          </p>
          {unit.driver && (
            <p>
              <strong>Driver:</strong> {unit.driver.name}
            </p>
          )}
          {unit.position && (
            <p>
              <strong>Last Position:</strong> {unit.position.lat}, {unit.position.lng}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default UnitDetailsModal;
