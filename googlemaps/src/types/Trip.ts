/**
 * Trip types for the APppp Fleet Management platform
 */

// Status types for tracking trip progress
export type TripStatus =
  | "pending"
  | "assigned"
  | "in_progress"
  | "shipped"
  | "delivered"
  | "completed"
  | "cancelled";

// Type for location coordinates
export interface GeoLocation {
  lat: number;
  lng: number;
}

// Type for addresses
export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  coordinates?: GeoLocation;
}

// Type for cost entries associated with trips
export interface CostEntry {
  id: string;
  type: "fuel" | "toll" | "maintenance" | "driver_allowance" | "other";
  amount: number;
  currency: string;
  description: string;
  receiptUrl?: string;
  timestamp: number;
  createdBy: string;
}

// Status update history
export interface StatusUpdate {
  status: TripStatus;
  timestamp: number;
  notes?: string;
  updatedBy: string;
}

// Main Trip interface
export interface Trip {
  id: string;
  reference: string; // Customer reference/order number

  // Basic info
  title: string;
  description?: string;

  // Dates
  startDate: number; // Unix timestamp
  endDate: number; // Unix timestamp
  createdAt: number;
  updatedAt: number;
  shippedAt?: number;
  deliveredAt?: number;

  // Locations
  origin: string;
  originAddress?: Address;
  destination: string;
  destinationAddress?: Address;
  waypoints?: string[]; // Optional waypoints

  // Assignments
  vehicle?: string; // Vehicle ID
  driver?: string; // Driver ID
  trailer?: string; // Trailer ID

  // Status tracking
  status: TripStatus;
  statusHistory?: StatusUpdate[];

  // Financial
  costs?: CostEntry[];
  revenue?: number;
  currency?: string;
  invoiceId?: string;

  // Documents
  podSignatureUrl?: string;
  podNotes?: string;
  attachments?: string[]; // URLs to attached documents

  // Cargo details
  cargoType?: string;
  cargoWeight?: number;
  cargoWeightUnit?: "kg" | "lb";
  cargoVolume?: number;
  cargoPallets?: number;

  // Metadata
  tags?: string[];
  customFields?: Record<string, any>;

  // Client/Customer information
  clientId?: string;
  clientName?: string;
  clientContact?: string;
}

// UI-specific trip type that may include computed properties
export interface UITrip extends Trip {
  distanceKm?: number;
  durationHours?: number;
  formattedDates?: {
    start: string;
    end: string;
    shipped?: string;
    delivered?: string;
  };
  isLate?: boolean;
  statusColor?: string;
  progress?: number; // 0-100
}

// Type for trip creation/update
export type TripInput = Omit<Trip, "id" | "createdAt" | "updatedAt"> & {
  id?: string;
};

// Simplified Trip interface for map usage
export interface SimplifiedTrip {
  id: string;
  reference?: string;
  origin: string;
  destination: string;
  vehicle?: string;
  driver?: string;
  startDate: string;
  endDate: string;
  status: string;
  originCoords?: {
    lat: number;
    lng: number;
  };
  destinationCoords?: {
    lat: number;
    lng: number;
  };
}
// Trip filter parameters
export interface TripFilterParams {
  status?: TripStatus | TripStatus[];
  vehicle?: string;
  driver?: string;
  clientId?: string;
  dateRange?: {
    start?: number;
    end?: number;
  };
  searchTerm?: string;
}

// Type for trip location with coordinates
export interface TripLocation {
  address: string;
  coordinates: GeoLocation;
}

// Type for tracking trip route progress
export interface RouteProgress {
  completedPercentage: number;
  currentCoordinates?: GeoLocation;
  estimatedTimeRemaining?: number; // in minutes
  distanceRemaining?: number; // in kilometers
}

// Type for waypoint with coordinates
export interface Waypoint {
  location: string;
  coordinates: GeoLocation;
  arrivalTime?: number;
  departureTime?: number;
  completed: boolean;
}

// Extended trip for enhanced map visualization
export interface MapTrip extends SimplifiedTrip {
  routePolyline?: GeoLocation[];
  waypoints?: Waypoint[];
  progress?: RouteProgress;
  color?: string;
  isSelected?: boolean;
}
