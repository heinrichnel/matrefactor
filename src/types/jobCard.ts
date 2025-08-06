export type JobCardCategory =
  | "preventive_maintenance"
  | "corrective_maintenance"
  | "inspection_followup"
  | "safety_repair"
  | "emergency_repair"
  | "tyre_service"
  | "body_repair";

export interface JobCardTemplate {
  id: string;
  name: string;
  category: JobCardCategory;
  tasks: string[];
  estimatedDuration: number; // in hours
  vehicleType: "truck" | "trailer" | "both";
}
