import { useAppContext } from "@/Context/AppContext";
import { useOfflineForm } from "@/hooks/useOfflineForm";
import { TripStatus } from "@/types/Trip";
import { useEffect, useState } from "react";
import Button from "../ui/button";
import DatePicker from "../ui/DatePicker";
import { InputField, TextAreaField } from "../ui/FormField";
import Modal from "../ui/Modal";
import Select from "../ui/Select";

interface TripFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<TripFormData>;
  tripId?: string;
}

interface TripFormData {
  origin: string;
  destination: string;
  vehicle: string;
  driver: string;
  startDate: Date | null;
  endDate: Date | null;
  cargo?: string;
  notes?: string;
  status: TripStatus;
}

const TripFormModal = ({ isOpen, onClose, initialData, tripId }: TripFormModalProps) => {
  const { vehicles, drivers } = useAppContext();
  const isEditMode = !!tripId;

  // Form state
  const [formData, setFormData] = useState<TripFormData>({
    origin: "",
    destination: "",
    vehicle: "",
    driver: "",
    startDate: new Date(),
    endDate: new Date(),
    cargo: "",
    notes: "",
    status: "pending",
    ...(initialData as Partial<TripFormData>),
  });

  // Offline form handling
  const { submit, isSubmitting, isOfflineOperation } = useOfflineForm({
    collectionPath: "trips",
    showOfflineWarning: true,
    onSuccess: () => {
      onClose();
    },
  });

  // Load reference data (no-op here; vehicles/drivers are provided by context)
  useEffect(() => {
    // Placeholder if future fetching is needed
  }, [isOpen]);

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle date changes
  const handleDateChange = (
    name: keyof Pick<TripFormData, "startDate" | "endDate">,
    date: Date | null
  ) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Transform dates to timestamps for persistence
      const payload = {
        ...formData,
        startDate: formData.startDate ? formData.startDate.getTime() : null,
        endDate: formData.endDate ? formData.endDate.getTime() : null,
      };
      await submit(payload as any, tripId);
    } catch (error) {
      console.error("Error saving trip:", error);
      // Handle error state if needed
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Edit Trip" : "Create New Trip"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            id="origin"
            label="Origin"
            value={formData.origin || ""}
            onChange={handleChange as any}
            required
          />

          <InputField
            id="destination"
            label="Destination"
            value={formData.destination || ""}
            onChange={handleChange as any}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Vehicle"
            name="vehicle"
            value={formData.vehicle || ""}
            onChange={handleChange}
            required
            options={vehicles.map((vehicle) => ({
              label: vehicle,
              value: vehicle,
            }))}
          />

          <Select
            label="Driver"
            name="driver"
            value={formData.driver || ""}
            onChange={handleChange}
            required
            options={drivers.map((driver) => ({
              label: driver,
              value: driver,
            }))}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DatePicker
            label="Start Date"
            name="startDate"
            value={formData.startDate}
            onChange={(date) => handleDateChange("startDate", date)}
            required
          />

          <DatePicker
            label="End Date"
            name="endDate"
            value={formData.endDate}
            onChange={(date) => handleDateChange("endDate", date)}
            required
          />
        </div>

        <InputField
          id="cargo"
          label="Cargo Description"
          value={formData.cargo || ""}
          onChange={handleChange as any}
          required
        />

        <TextAreaField
          id="notes"
          label="Notes"
          value={formData.notes || ""}
          onChange={handleChange as any}
          rows={3}
        />

        <div className="flex justify-end space-x-2 pt-4">
          {isOfflineOperation && (
            <div className="text-amber-500 mr-auto flex items-center">
              <span className="mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              Working offline - changes will sync when connection is restored
            </div>
          )}
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEditMode ? "Update Trip" : "Create Trip"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TripFormModal;
