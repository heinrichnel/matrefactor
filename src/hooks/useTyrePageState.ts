import { useState } from "react";
import { useTyres } from "../context/TyreContext";

/**
 * A custom hook that combines TyreContext data with UI-specific state management
 * for tyre management pages
 */
export const useTyrePageState = () => {
  const {
    tyres,
    loading,
    error,
    saveTyre,
    deleteTyre: deleteContextTyre,
    getTyreById,
    addInspection,
    getInspections,
    getTyresByVehicle,
    filterTyres,
  } = useTyres();

  // UI State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [uiRecords, setUiRecords] = useState<any[]>([]);

  // Generate UI records from tyres if needed
  const getUIRecords = () => {
    if (!tyres.length) return [];

    return tyres.map((tyre) => ({
      id: tyre.id,
      tyreNumber: tyre.serialNumber || "",
      manufacturer: tyre.brand || "",
      condition:
        tyre.condition?.status === "good"
          ? "Good"
          : tyre.condition?.status === "critical"
            ? "Poor"
            : "Fair",
      status:
        tyre.status === "in_service"
          ? "In-Service"
          : tyre.status === "new"
            ? "In-Stock"
            : tyre.status === "scrapped"
              ? "Scrap"
              : "Repair",
      vehicleAssignment: tyre.installation?.vehicleId || "",
      km: tyre.kmRun || 0,
      kmLimit: tyre.kmRunLimit || 60000,
      treadDepth: tyre.condition?.treadDepth || 0,
      mountStatus: tyre.installation ? "Mounted" : "Not Mounted",
    }));
  };

  return {
    // Core context data and methods
    tyres,
    loading,
    error,
    saveTyre,
    deleteTyre: deleteContextTyre,
    getTyreById,
    addInspection,
    getInspections,
    getTyresByVehicle,
    filterTyres,

    // UI state
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    brandFilter,
    setBrandFilter,

    // UI data transformations
    uiRecords: uiRecords.length ? uiRecords : getUIRecords(),
    setUiRecords,
  };
};
