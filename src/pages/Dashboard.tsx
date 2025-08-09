// src/pages/Dashboard.tsx
import { collection, getDocs, limit, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import FormSelector from "../components/forms/FormSelector";
import EnhancedMapComponent from "../components/Map/EnhancedMapComponent";
import { useSyncContext } from "../context/SyncContext";
import { db } from "../firebase";
import { Location } from "../types/mapTypes";

// Log when Dashboard component is loaded to help debug dynamic import issues
console.log("Dashboard component file loaded successfully");

const Dashboard: React.FC = () => {
  const syncContext = useSyncContext();
  const [activeView, setActiveView] = useState<"map" | "fleet" | "trips" | "statistics">("map");
  const [locations, setLocations] = useState<Location[]>([]);
  const [fleetOptions, setFleetOptions] = useState<{ value: string; label: string }[]>([]);
  const [selectedFleet, setSelectedFleet] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: -33.8688,
    lng: 151.2093,
  });

  useEffect(() => {
    const loadLocations = async () => {
      if (!syncContext.isOnline) return;
      try {
        setLoading(true);
        const locationsQuery = query(collection(db, "locations"), limit(20));
        const snapshot = await getDocs(locationsQuery);
        const locationData: Location[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            lat: data.latitude || data.lat,
            lng: data.longitude || data.lng,
            title: data.name || data.title,
            info: data.description,
            address: data.address,
            iconType: data.type || "default",
          };
        });
        setLocations(locationData);
        if (locationData.length > 0) {
          setMapCenter({ lat: locationData[0].lat, lng: locationData[0].lng });
        }
      } catch (error) {
        console.error("Error loading locations:", error);
      } finally {
        setLoading(false);
      }
    };
    loadLocations();
  }, [syncContext.isOnline]);

  useEffect(() => {
    const loadFleetVehicles = async () => {
      if (!syncContext.isOnline) return;
      try {
        const fleetQuery = query(collection(db, "fleet"), limit(50));
        const snapshot = await getDocs(fleetQuery);
        const options = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            value: doc.id,
            label: `${data.registrationNumber} (${data.vehicleType})`,
          };
        });
        setFleetOptions(options);
      } catch (error) {
        console.error("Error loading fleet vehicles:", error);
      }
    };
    loadFleetVehicles();
  }, [syncContext.isOnline]);

  const statistics = [
    { title: "Active Vehicles", value: "42", change: "+3", changeType: "positive" },
    { title: "Vehicles in Maintenance", value: "7", change: "-2", changeType: "negative" },
    { title: "Ongoing Trips", value: "18", change: "+5", changeType: "positive" },
    { title: "Total Distance Today", value: "1,287 km", change: "+12%", changeType: "positive" },
    { title: "Fuel Analytics", value: "6.2 L/100km", change: "-0.5", changeType: "positive" },
    { title: "Compliance Score", value: "92%", change: "+4%", changeType: "positive" },
  ];

  const handleLocationSelect = (location: Location) => {
    console.log("Selected location:", location);
  };

  return (
    <div className="container mx-auto p-6">
      <header className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Fleet Dashboard</h1>
            <p className="text-gray-600">Monitor and manage your fleet operations</p>
          </div>
          <div
            className={`px-4 py-2 rounded-full text-sm font-medium ${syncContext.isOnline ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            {syncContext.isOnline ? "System Online" : "System Offline"}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {statistics.map((stat, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
            <div className="flex items-baseline mt-1">
              <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
              <p
                className={`ml-2 text-sm font-medium ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"}`}
              >
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px">
          {["map", "fleet", "trips", "statistics"].map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view as typeof activeView)}
              className={`py-4 px-6 font-medium text-sm ${activeView === view ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)} View
            </button>
          ))}
        </nav>
      </div>

      {activeView === "map" && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4 flex flex-wrap items-center gap-4">
            <h2 className="text-xl font-semibold">Fleet Map</h2>
            <div className="flex-1 max-w-xs">
              <select
                value={selectedFleet}
                onChange={(e) => setSelectedFleet(e.target.value)}
                className="select select-bordered w-full"
              >
                <option value="">All Vehicles</option>
                {fleetOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {loading && (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                <span className="text-sm text-gray-600">Loading...</span>
              </div>
            )}
          </div>
          <EnhancedMapComponent
            locations={locations}
            center={mapCenter}
            height="600px"
            showInfoOnHover={true}
            onLocationSelect={handleLocationSelect}
            showPlacesSearch={true}
            showRoutes={true}
          />
        </div>
      )}

      {activeView === "fleet" && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Fleet Management</h2>
          <p className="text-gray-600 mb-4">Select a vehicle from your fleet:</p>
          <div className="max-w-md">
            <FormSelector
              label="Select Vehicle"
              name="fleetId"
              value={selectedFleet}
              onChange={setSelectedFleet}
              collection="fleet"
              labelField="registrationNumber"
              valueField="id"
              sortField="fleetNumber"
              placeholder="Select a vehicle"
              required={false}
              className="mb-4"
            />
          </div>
          {selectedFleet && (
            <div className="mt-6">
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium">Vehicle Details</h3>
                <p className="text-gray-600 italic">
                  Vehicle data would display here based on selection
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {activeView === "trips" && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Active Trips</h2>
          <p className="text-gray-600">View and manage ongoing trips:</p>
          <div className="mt-6">
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium">Trip Details</h3>
              <p className="text-gray-600 italic">Trip data would display here</p>
            </div>
          </div>
        </div>
      )}

      {activeView === "statistics" && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Fleet Statistics</h2>
          <p className="text-gray-600">Overview of your fleet performance:</p>
          <div className="mt-6">
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium">Performance Metrics</h3>
              <p className="text-gray-600 italic">Advanced statistics would display here</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
