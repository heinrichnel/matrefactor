// Main export file to maintain backward compatibility
export type { Vehicle, FleetStats, VehicleFilters } from "../types/vehicle";
export { FLEET_VEHICLES } from "./vehicles/fleetVehicles";
export {
  getVehicleByFleetNo,
  getVehicleByRegistration,
  getActiveVehicles,
  getVehiclesByType,
  getVehiclesByCategory,
  getVehiclesBySeries,
  getVehiclesByManufacturer,
  getVehiclesByStatus,
  searchVehicles,
  filterVehicles
} from "./vehicles/vehicleUtils";
export { getFleetStats } from "./vehicles/vehicleStats";

// Added exports for trips, tyre, and workshop data
export * from './vehicles';
export * from './inspectionTemplates';
export * from './tyreData';
export * from './workshopJobCard';

// Additional utility exports can be added here if needed
