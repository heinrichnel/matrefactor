import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import * as HeroIcons from "@heroicons/react/24/outline";

interface TripStatusInfo {
  id: string;
  fleetNumber: string;
  driverName: string;
  route: string;
  startDate?: Date | string;
  endDate?: Date | string;
  shippedAt?: Date | string | null;
}

interface TripStatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: TripStatusInfo;
  status: "shipped" | "delivered";
  onUpdateStatus: (id: string, status: "shipped" | "delivered", notes: string) => Promise<void>;
}

const TripStatusUpdateModal: React.FC<TripStatusUpdateModalProps> = ({
  isOpen,
  onClose,
  trip,
  status,
  onUpdateStatus,
}) => {
  const [notes, setNotes] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const formatDate = (date: Date | string | undefined | null): string => {
    if (!date) return "N/A";

    if (typeof date === "string") {
      return new Date(date).toLocaleDateString();
    }

    return date.toLocaleDateString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsUpdating(true);
      await onUpdateStatus(trip.id, status, notes);
      setNotes("");
      onClose();
    } catch (error) {
      console.error("Failed to update trip status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={!isUpdating ? onClose : () => {}} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-xl">
          <div className="flex items-start justify-between">
            <Dialog.Title className="text-xl font-semibold text-gray-900">
              Mark Trip as {status === "shipped" ? "Shipped" : "Delivered"}
            </Dialog.Title>
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500"
              onClick={onClose}
              disabled={isUpdating}
            >
              <span className="sr-only">Close</span>
              <HeroIcons.XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-4">
            <div className="mb-4 rounded-md bg-gray-50 p-4">
              <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Fleet Number:</dt>
                  <dd className="text-sm text-gray-900">{trip.fleetNumber || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Driver:</dt>
                  <dd className="text-sm text-gray-900">{trip.driverName || "N/A"}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Route:</dt>
                  <dd className="text-sm text-gray-900">{trip.route}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Start Date:</dt>
                  <dd className="text-sm text-gray-900">{formatDate(trip.startDate)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">End Date:</dt>
                  <dd className="text-sm text-gray-900">{formatDate(trip.endDate)}</dd>
                </div>
                {status === "delivered" && trip.shippedAt && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Shipped At:</dt>
                    <dd className="text-sm text-gray-900">{formatDate(trip.shippedAt)}</dd>
                  </div>
                )}
              </dl>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Status Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder={`Enter any notes about ${status === "shipped" ? "shipment" : "delivery"}...`}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={onClose}
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  disabled={isUpdating}
                >
                  {isUpdating
                    ? "Updating..."
                    : `Confirm ${status === "shipped" ? "Shipment" : "Delivery"}`}
                </button>
              </div>
            </form>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default TripStatusUpdateModal;
