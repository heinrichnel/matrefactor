import { db } from "./firebase";
import { addDoc, collection, getDocs, query, where, doc, updateDoc, deleteDoc } from "firebase/firestore";

const col = (path="properties") => collection(db, path);

export type Property = {
  id?: string;
  owner_uid: string;
  title: string;
  price: number;
  type: "house" | "apartment" | "land" | "commercial";
  status: "active"|"inactive"|"sold";
  lat: number; lng: number;
  address?: string; city?: string; country?: string; description?: string;
  created_at?: any; updated_at?: any;
};

export async function listProperties(opts?: { type?: Property["type"]; minPrice?: number; maxPrice?: number }) {
  // Basic example; add filters as needed
  const qs = query(col());
  const snap = await getDocs(qs);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Property));
}

export async function createPropertyFS(p: Omit<Property, "id"|"created_at"|"updated_at">) {
  const docRef = await addDoc(col(), { ...p, status:"active", created_at: new Date(), updated_at: new Date() });
  return docRef.id;
}
export async function updatePropertyFS(id: string, patch: Partial<Property>) {
  await updateDoc(doc(db, "properties", id), { ...patch, updated_at: new Date() });
}
export async function deletePropertyFS(id: string) {
  await deleteDoc(doc(db, "properties", id));
}
