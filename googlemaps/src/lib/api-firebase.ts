import { auth } from "./firebase";

const region = import.meta.env.VITE_FB_REGION || "us-central1";
const projectId = import.meta.env.VITE_FB_PROJECT_ID;

function fnUrl(name: string) {
  return `https://${region}-${projectId}.cloudfunctions.net/${name}`;
}

async function withAuthHeaders(): Promise<Record<string, string>> {
  const token = await auth.currentUser?.getIdToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const FnAPI = {
  // Properties
  createProperty: async (payload: any) => {
    const headers = await withAuthHeaders();
    const res = await fetch(fnUrl("createProperty"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
  updateProperty: async (payload: any) => {
    const headers = await withAuthHeaders();
    const res = await fetch(fnUrl("updateProperty"), {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
  deleteProperty: async (id: string) => {
    const headers = await withAuthHeaders();
    const res = await fetch(`${fnUrl("deleteProperty")}?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers,
    });
    return res.json();
  },
  toggleFavorite: async (propertyId: string, liked: boolean) => {
    const headers = await withAuthHeaders();
    const res = await fetch(fnUrl("toggleFavorite"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({ propertyId, liked }),
    });
    return res.json();
  },

  // Deliveries
  createDelivery: async (payload: any) => {
    const headers = await withAuthHeaders();
    const res = await fetch(fnUrl("createDelivery"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
  setDeliveryStatus: async (id: string, status: string) => {
    const headers = await withAuthHeaders();
    const res = await fetch(fnUrl("setDeliveryStatus"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({ id, status }),
    });
    return res.json();
  },
  telemetry: async (payload: {
    deliveryId: string;
    lat: number;
    lng: number;
    speed?: number;
    heading?: number;
  }) => {
    const headers = await withAuthHeaders();
    const res = await fetch(fnUrl("telemetry"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Routes
  optimizeRoute: async (payload: any) => {
    const headers = await withAuthHeaders();
    const res = await fetch(fnUrl("optimizeRoute"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
};
