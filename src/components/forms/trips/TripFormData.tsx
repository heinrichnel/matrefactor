import { Trip } from "../../../types/index";

// Define TripFormData type for form data handling
export type TripFormData = Omit<Trip, "id" | "costs" | "status" | "additionalCosts">;
