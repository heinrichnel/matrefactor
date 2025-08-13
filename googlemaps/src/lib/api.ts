// src/lib/api.ts
import axios, { AxiosError, AxiosInstance } from "axios";

/** Resolve API base from envs (works with Vite or CRA) */
function getApiBase(): string {
  // Vite style
  const vite = (typeof import.meta !== "undefined" && (import.meta as any).env) || {};
  if (vite.VITE_API_BASE) return vite.VITE_API_BASE as string;

  // CRA / Node style
  if (typeof process !== "undefined" && process.env.REACT_APP_API_BASE) {
    return process.env.REACT_APP_API_BASE as string;
  }

  return "http://localhost:8080"; // fallback for local dev
}

/** Fetch Firebase ID token from localStorage if you’re storing it there */
async function getIdToken(): Promise<string | undefined> {
  try {
    const token = localStorage.getItem("idToken");
    return token || undefined;
  } catch {
    return undefined;
  }
}

function createClient(): AxiosInstance {
  const client = axios.create({
    baseURL: getApiBase(),
    timeout: 20000,
    withCredentials: false,
  });

  // Attach Authorization header if token is present
  client.interceptors.request.use(async (config) => {
    const token = await getIdToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Basic 401 retry once (in case token was just refreshed elsewhere)
  client.interceptors.response.use(
    (res) => res,
    async (err: AxiosError & { config: any; _retry?: boolean }) => {
      if (err.response?.status === 401 && !err.config?._retry) {
        err.config._retry = true;
        const token = await getIdToken();
        if (token) {
          err.config.headers = err.config.headers || {};
          err.config.headers.Authorization = `Bearer ${token}`;
          return client(err.config);
        }
      }
      return Promise.reject(err);
    }
  );

  return client;
}

export const api = createClient();

/* ----------------------------- Domain Types ----------------------------- */

export type LatLng = { lat: number; lng: number };

export type Property = {
  id: string;
  owner_id: string;
  title: string;
  description?: string;
  price: number;
  type: "house" | "apartment" | "land" | "commercial";
  status: "active" | "inactive" | "sold" | string;
  lat: number;
  lng: number;
  address?: string;
  city?: string;
  country?: string;
  images?: { id: string; url: string; position: number }[];
  created_at: string;
  updated_at: string;
};

export type Delivery = {
  id: string;
  customer_id?: string;
  driver_id?: string;
  status: "created" | "dispatched" | "in_transit" | "delivered" | "cancelled";
  pickup_lat: number;
  pickup_lng: number;
  dropoff_lat: number;
  dropoff_lng: number;
  pickup_address?: string;
  dropoff_address?: string;
  eta_minutes?: number;
  created_at: string;
  updated_at: string;
};

export type Trip = {
  id: string;
  user_id: string;
  mode: "DRIVING" | "WALKING" | "BICYCLING" | "TRANSIT";
  waypoints: Array<{ lat: number; lng: number; placeId?: string; label?: string }>;
  optimize_waypoints: boolean;
  distance_m?: number;
  duration_s?: number;
  created_at: string;
};

/* ------------------------------ SDK: Listings --------------------------- */

export const ListingsAPI = {
  list: (params?: {
    bbox?: string; // "minLng,minLat,maxLng,maxLat"
    minPrice?: number;
    maxPrice?: number;
    type?: Property["type"];
  }) => api.get<Property[]>("/api/properties", { params }).then((r) => r.data),

  get: (id: string) => api.get<Property>(`/api/properties/${id}`).then((r) => r.data),

  create: (payload: Omit<Property, "id" | "created_at" | "updated_at" | "images">) =>
    api.post<Property>("/api/properties", payload).then((r) => r.data),

  update: (id: string, patch: Partial<Property>) =>
    api.patch<Property>(`/api/properties/${id}`, patch).then((r) => r.data),

  remove: (id: string) => api.delete(`/api/properties/${id}`).then((r) => r.data),

  addImage: (id: string, file: File) => {
    const form = new FormData();
    form.append("file", file);
    return api.post<{ url: string }>(`/api/properties/${id}/images`, form).then((r) => r.data);
  },

  favorites: {
    list: () => api.get<Property[]>("/api/favorites").then((r) => r.data),
    add: (propertyId: string) => api.post(`/api/favorites/${propertyId}`).then((r) => r.data),
    remove: (propertyId: string) => api.delete(`/api/favorites/${propertyId}`).then((r) => r.data),
  },
};

/* ----------------------------- SDK: Deliveries -------------------------- */

export const DeliveriesAPI = {
  create: (payload: {
    customer_id?: string;
    driver_id?: string;
    pickup: LatLng & { address?: string };
    dropoff: LatLng & { address?: string };
  }) =>
    api
      .post<Delivery>("/api/deliveries", {
        customer_id: payload.customer_id,
        driver_id: payload.driver_id,
        pickup_lat: payload.pickup.lat,
        pickup_lng: payload.pickup.lng,
        pickup_address: payload.pickup.address,
        dropoff_lat: payload.dropoff.lat,
        dropoff_lng: payload.dropoff.lng,
        dropoff_address: payload.dropoff.address,
      })
      .then((r) => r.data),

  get: (id: string) => api.get<Delivery>(`/api/deliveries/${id}`).then((r) => r.data),

  setStatus: (id: string, status: Delivery["status"]) =>
    api.post<Delivery>(`/api/deliveries/${id}/status`, { status }).then((r) => r.data),

  sendTelemetry: (payload: {
    deliveryId: string;
    lat: number;
    lng: number;
    speed?: number;
    heading?: number;
  }) => api.post(`/api/telemetry`, payload).then((r) => r.data),
};

/* --------------------------- SDK: Route Planner ------------------------- */

export const RoutesAPI = {
  optimize: (payload: {
    origin: LatLng;
    destination: LatLng;
    waypoints: LatLng[];
    mode?: "driving" | "walking" | "bicycling" | "transit";
  }) => api.post(`/api/routes/optimize`, payload).then((r) => r.data),

  saveTrip: (payload: {
    user_id: string;
    mode: "DRIVING" | "WALKING" | "BICYCLING" | "TRANSIT";
    waypoints: Array<{ lat: number; lng: number; placeId?: string; label?: string }>;
    optimize_waypoints?: boolean;
    distance_m?: number;
    duration_s?: number;
  }) => api.post<Trip>(`/api/trips`, payload).then((r) => r.data),

  getTrip: (id: string) => api.get<Trip>(`/api/trips/${id}`).then((r) => r.data),
};

/* ------------------------------ Helpers -------------------------------- */

/** Narrow Axios errors with a type guard */
export function isAxiosError<T = unknown>(e: unknown): e is AxiosError<T> {
  return !!(e as AxiosError)?.isAxiosError;
}

/** Human‑readable error extraction */
export function getErrorMessage(e: unknown): string {
  if (isAxiosError(e)) {
    const data: any = e.response?.data;
    return data?.error || data?.message || e.message || "Request failed";
  }
  return (e as any)?.message ?? "Something went wrong";
}
