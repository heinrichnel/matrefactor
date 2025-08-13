import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Trip } from "../types/Trip"; // ← use the shared Trip type

// Context shape
interface AppContextType {
  trips: Trip[];
  vehicles: string[];
  drivers: string[];
  updateTripStatus: (id: string, status: Trip["status"]) => Promise<void>;
  addCostEntry: (tripId: string, cost: unknown) => Promise<void>;
}

// Create the context with safe defaults
const AppContext = createContext<AppContextType>({
  trips: [],
  vehicles: [],
  drivers: [],
  updateTripStatus: async () => {},
  addCostEntry: async () => {},
});

// Provider props
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [vehicles, setVehicles] = useState<string[]>([]);
  const [drivers, setDrivers] = useState<string[]>([]);

  // Update trip status (client-side mock; wire to Firebase in real app)
  const updateTripStatus = async (id: string, status: Trip["status"]) => {
    // TODO: call Firebase (Firestore/Functions) to persist
    setTrips((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
  };

  // Add a cost entry (stub)
  const addCostEntry = async (tripId: string, cost: unknown) => {
    // TODO: persist to Firebase
    console.log("addCostEntry", { tripId, cost });
  };

  // Mock bootstrap data (replace with Firebase fetch)
  useEffect(() => {
    setVehicles(["VEH001", "VEH002", "VEH003"]);
    setDrivers(["Driver 1", "Driver 2", "Driver 3"]);
    // Optionally set some initial trips here
  }, []);

  const value: AppContextType = {
    trips,
    vehicles,
    drivers,
    updateTripStatus,
    addCostEntry,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Hook
export const useAppContext = () => useContext(AppContext);
