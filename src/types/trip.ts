export type TripStatus =
  | "active"
  | "scheduled"
  | "completed"
  | "cancelled"
  | "in_progress"
  | "pending";

export type Currency = "ZAR" | "USD";

export type ClientType = "internal" | "external";

export interface PlannedRoute {
  origin: string;
  destination: string;
  waypoints: string[];
  coordinates?: { lat: number; lng: number }[];
  estimatedDistance?: number;
  estimatedDuration?: number;
}

export interface CostEntry {
  id: string;
  description: string;
  amount: number;
  category: "fuel" | "maintenance" | "tolls" | "parking" | "accommodation" | "meals" | "other";
  date: string;
  receipt?: File;
  isFlagged?: boolean;
  notes?: string;
  createdBy?: string;
  updatedAt?: string;
}

// --- Main Trip type from Firestore ---
export interface Trip {
  id: string;
  title: string; // optional for UI, not used in TripForm
  status: TripStatus;
  loadDate: string;
  pickupDate: string;
  deliveryDate: string;
  route: string;
  vehicleId: string;
  driverId: string;
  estimatedRevenue: number;
  currency: Currency;
  createdAt?: string;
  updatedAt?: string;
  costs?: CostEntry[];
  paymentStatus: "paid" | "unpaid";
  followUpHistory: string[];
  // Extended
  fleetNumber: string;
  fleetUnitId?: number;
  clientName: string;
  driverName: string;
  startDate: string;
  endDate: string;
  description: string;
  distanceKm: number;
  baseRevenue: number;
  revenueCurrency: Currency;
  clientType: ClientType;
  plannedRoute: PlannedRoute;
}

// Used for form submission (excluding system metadata)
export type TripFormData = Omit<
  Trip,
  | "id"
  | "status"
  | "costs"
  | "title"
  | "loadDate"
  | "pickupDate"
  | "deliveryDate"
  | "vehicleId"
  | "driverId"
  | "estimatedRevenue"
  | "currency"
  | "createdAt"
  | "updatedAt"
>;
