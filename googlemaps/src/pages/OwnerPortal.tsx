import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../Context/AppContext";
import { useOfflineQuery } from "../hooks/useOfflineQuery";
import LoadingSpinner from "@/ui/LoadingSpinner";
import TripFormModal from "@/Models/TripFormModal";
import TripStatusUpdateModal from "@/Models/TripStatusUpdateModal";
import { Trip } from "../types/Trip";

const OwnerPortal: React.FC = () => {
  const navigate = useNavigate();
  const { updateTripStatus } = useAppContext();
  const [showTripForm, setShowTripForm] = useState<boolean>(false);
  const [statusTrip, setStatusTrip] = useState<Trip | null>(null);
  const [statusType, setStatusType] = useState<"shipped" | "delivered">("shipped");

  // Fetch active trips using the offline-capable hook
  const {
    data: trips,
    isLoading: loading,
    error,
  } = useOfflineQuery({
    collectionPath: "trips",
    queryConstraints: [
      ["status", "in", ["active", "shipped"]],
      ["isDeleted", "==", false],
      ["orderBy", "startDate", "desc"],
    ],
  });

  // Fetch fleet metrics
  const { data: fleetMetrics } = useOfflineQuery({
    collectionPath: "fleetMetrics",
    queryConstraints: [["limit", 1]],
  });

  const metrics = fleetMetrics?.[0] || {
    activeVehicles: 0,
    totalTrips: 0,
    pendingInvoices: 0,
    fuelEfficiency: 0,
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-600">Error loading data</h1>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Owner Portal Dashboard</h1>
        <button
          onClick={() => setShowTripForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + New Trip
        </button>
      </div>

      {/* Fleet Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Active Vehicles</p>
          <h2 className="text-2xl font-bold">{metrics.activeVehicles}</h2>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Total Trips</p>
          <h2 className="text-2xl font-bold">{metrics.totalTrips}</h2>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Pending Invoices</p>
          <h2 className="text-2xl font-bold">{metrics.pendingInvoices}</h2>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Fleet Fuel Efficiency</p>
          <h2 className="text-2xl font-bold">{metrics.fuelEfficiency.toFixed(2)} km/L</h2>
        </div>
      </div>

      {/* Active Trips */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Active Trips</h2>
        {trips && trips.length > 0 ? (
          <div className="bg-white rounded shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trip ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Driver
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {trips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{trip.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{`${trip.origin} → ${trip.destination}`}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{trip.vehicle || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{trip.driver || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          trip.status === "active"
                            ? "bg-green-100 text-green-800"
                            : trip.status === "shipped"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {trip.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className="text-blue-600 hover:text-blue-800 mr-3"
                        onClick={() => navigate(`/trips/details/${trip.id}`)}
                      >
                        View
                      </button>
                      <button
                        className="text-green-600 hover:text-green-800"
                        onClick={() => {
                          setStatusTrip(trip as Trip);
                          setStatusType(trip.status === "active" ? "shipped" : "delivered");
                        }}
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="bg-white p-4 rounded shadow">No active trips found.</p>
        )}
      </div>

      {/* Trip Form Modal */}
      <TripFormModal isOpen={showTripForm} onClose={() => setShowTripForm(false)} />

      {/* Status Update Modal */}
      {statusTrip && (
        <TripStatusUpdateModal
          isOpen
          onClose={() => setStatusTrip(null)}
          trip={{
            id: statusTrip.id,
            fleetNumber: statusTrip.vehicle || "",
            driverName: statusTrip.driver || "",
            route: `${statusTrip.origin} → ${statusTrip.destination}`,
            startDate: statusTrip.startDate ? new Date(statusTrip.startDate) : undefined,
            endDate: statusTrip.endDate ? new Date(statusTrip.endDate) : undefined,
            shippedAt: (statusTrip as any).shippedAt,
          }}
          status={statusType}
          onUpdateStatus={async (id, status, notes) => {
            await updateTripStatus(id, status);
            setStatusTrip(null);
          }}
        />
      )}
    </div>
  );
};

export default OwnerPortal;
