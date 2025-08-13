import GoogleMapReact from "google-map-react";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../Context/AppContext";
import { useOfflineQuery } from "../hooks/useOfflineQuery";
import TripFormModal from "../Models/TripFormModal";
import TripStatusUpdateModal from "../Models/TripStatusUpdateModal";

// --- Type Definitions for the `useOfflineQuery` hook ---
// This is to correctly type the parameters for the hook.
type WhereConstraint = [string, "==" | ">" | "<" | ">=" | "<=", any];
type OrderByConstraint = [string, "desc" | "asc"];

interface UseOfflineQueryOptions {
  collectionPath: string;
  where?: WhereConstraint[];
  orderBy?: OrderByConstraint[];
}

// NOTE: You will need to update your `../types/Trip` interface to include
// 'originCoords' and 'destinationCoords' to fully resolve all type errors.
// For now, we define a local interface to make this component type-safe.
export interface Trip {
  id?: string;
  reference?: string;
  startDate: number | Date;
  endDate?: number | Date;
  origin: string;
  destination: string;
  vehicle?: string;
  driver?: string;
  status: "active" | "shipped" | "delivered";
  originCoords?: {
    lat: number;
    lng: number;
  };
  destinationCoords?: {
    lat: number;
    lng: number;
  };
  shippedAt?: number | Date;
}


const Planner: React.FC = () => {
  const { updateTripStatus } = useAppContext();
  const [showTripForm, setShowTripForm] = useState(false);
  const [statusTrip, setStatusTrip] = useState<Trip | null>(null);
  const [statusType, setStatusType] = useState<"shipped" | "delivered">("shipped");
  const [selectedTrips, setSelectedTrips] = useState<string[]>([]);
  const [mapCenter, setMapCenter] = useState({ lat: -26.2041, lng: 28.0473 }); // Default to Johannesburg
  const [mapZoom, setMapZoom] = useState(10);

  // Correction 1: The type definitions for the query options were updated
  // to correctly match the shape of the `where` and `orderBy` arrays.
  const {
    data: activeTrips,
    isLoading,
    error,
  } = useOfflineQuery({
    collectionPath: "trips",
    where: [["status", "==", "active"]],
    orderBy: [["startDate", "desc"]],
  } as UseOfflineQueryOptions);


  useEffect(() => {
    // Correction 2: Used optional chaining (`?.`) to safely access properties
    // to prevent errors if `originCoords` is missing on the Trip object.
    if (activeTrips && activeTrips.length > 0) {
      // Cast the first item to the Trip type to ensure correct property access
      const firstTrip = activeTrips[0] as unknown as Trip;
      if (firstTrip?.originCoords) {
        setMapCenter({
          lat: firstTrip.originCoords.lat,
          lng: firstTrip.originCoords.lng,
        });
      }
    }
  }, [activeTrips]);

  const handleTripSelection = (tripId: string) => {
    setSelectedTrips((prev) =>
      prev.includes(tripId) ? prev.filter((id) => id !== tripId) : [...prev, tripId]
    );
  };

  // Custom marker component for Google Maps
  const TripMarker = ({ text, lat, lng, isSelected }: any) => (
    <div
      style={{
        position: "absolute",
        transform: "translate(-50%, -50%)",
        width: "30px",
        height: "30px",
        borderRadius: "50%",
        backgroundColor: isSelected ? "#4CAF50" : "#2196F3",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: "bold",
        border: "2px solid white",
        cursor: "pointer",
      }}
    >
      {text}
    </div>
  );

  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-2xl font-bold">Trip Planner</h1>
        <div className="flex space-x-2">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => setShowTripForm(true)}
          >
            + New Trip
          </button>
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            disabled={selectedTrips.length === 0}
          >
            Optimize Route
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Trip List Panel */}
        <div className="w-1/3 border-r overflow-y-auto p-4">
          <h2 className="text-lg font-semibold mb-4">Active Trips</h2>

          {isLoading && <p>Loading trips...</p>}
          {error && <p className="text-red-500">Error loading trips: {error.message}</p>}

          <div className="space-y-3">
            {activeTrips?.map((tripData) => {
              const trip = tripData as unknown as Trip;
              return (
                <div
                  key={trip.id}
                  className={`border p-3 rounded-lg cursor-pointer ${
                    selectedTrips.includes(trip.id || "") ? "border-green-500 bg-green-50" : ""
                  }`}
                  onClick={() => handleTripSelection(trip.id || "")}
                >
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{trip.reference || "No Ref"}</span>
                    <span className="text-sm text-gray-600">
                      {new Date(Number(trip.startDate)).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm">
                    {trip.origin} → {trip.destination}
                  </div>
                  <div className="flex justify-between mt-2 text-sm">
                    <span>Vehicle: {trip.vehicle || "Unassigned"}</span>
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        setStatusTrip(trip);
                        setStatusType("shipped");
                      }}
                    >
                      Mark Shipped
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {activeTrips?.length === 0 && !isLoading && (
            <p className="text-gray-500 text-center py-4">No active trips found</p>
          )}
        </div>

        {/* Map Panel */}
        <div className="w-2/3 h-full">
          <GoogleMapReact
            bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "" }}
            defaultCenter={mapCenter}
            defaultZoom={mapZoom}
            center={mapCenter}
          >
            {activeTrips?.map((tripData) => {
              const trip = tripData as unknown as Trip;
              // Correction 4: Added a null check to ensure `originCoords` exists.
              if (trip.originCoords) {
                return (
                  <TripMarker
                    key={`origin-${trip.id}`}
                    lat={trip.originCoords.lat}
                    lng={trip.originCoords.lng}
                    text={trip.reference?.substring(0, 2) || "T"}
                    isSelected={selectedTrips.includes(trip.id || "")}
                  />
                );
              }
              return null;
            })}

            {activeTrips?.map((tripData) => {
              const trip = tripData as unknown as Trip;
              // Correction 5: Added a null check to ensure `destinationCoords` exists.
              if (trip.destinationCoords) {
                return (
                  <TripMarker
                    key={`dest-${trip.id}`}
                    lat={trip.destinationCoords.lat}
                    lng={trip.destinationCoords.lng}
                    text={trip.reference?.substring(0, 2) || "T"}
                    isSelected={selectedTrips.includes(trip.id || "")}
                  />
                );
              }
              return null;
            })}
          </GoogleMapReact>
        </div>
      </div>

      {/* Modals */}
      <TripFormModal isOpen={showTripForm} onClose={() => setShowTripForm(false)} />

      {/* Correction 6: Ensured `statusTrip` is not null before rendering the modal content. */}
      {statusTrip && (
        <TripStatusUpdateModal
          isOpen={true}
          onClose={() => setStatusTrip(null)}
          trip={{
            id: statusTrip.id || "",
            fleetNumber: statusTrip.vehicle || "",
            driverName: statusTrip.driver || "",
            route: `${statusTrip.origin} → ${statusTrip.destination}`,
            // Correction 7: Converted the numerical timestamps to Date objects to match the expected type.
            startDate: statusTrip.startDate ? new Date(statusTrip.startDate) : undefined,
            endDate: statusTrip.endDate ? new Date(statusTrip.endDate) : undefined,
            shippedAt: (statusTrip as any).shippedAt,
          }}
          status={statusType}
          onUpdateStatus={async (id, status) => {
            await updateTripStatus(id, status);
            setStatusTrip(null);
          }}
        />
      )}
    </div>
  );
};

export default Planner;
