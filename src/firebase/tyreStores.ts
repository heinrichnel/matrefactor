import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { StockEntry, TyreStore } from "../types/tyre";
import { firestore, handleFirestoreError } from "../utils/firebaseConnectionHandler";

/**
 * Add a new TyreStore document to Firestore
 * @param store The TyreStore object to add
 */
export async function addTyreStore(store: TyreStore): Promise<void> {
  try {
    const storeRef = doc(firestore, "tyreStores", store.id);
    await setDoc(storeRef, {
      ...store,
      dateAdded: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error adding tyre store:", error);
    await handleFirestoreError(error);
    throw error;
  }
}

/**
 * Get a TyreStore by ID
 * @param storeId The ID of the TyreStore to retrieve
 */
export async function getTyreStoreById(storeId: string): Promise<TyreStore | null> {
  try {
    const storeRef = doc(firestore, "tyreStores", storeId);
    const snap = await getDoc(storeRef);

    if (!snap.exists()) return null;

    return { id: snap.id, ...snap.data() } as TyreStore;
  } catch (error) {
    console.error("Error getting tyre store:", error);
    await handleFirestoreError(error);
    throw error;
  }
}

/**
 * Get all TyreStore documents
 */
export async function getAllTyreStores(): Promise<TyreStore[]> {
  try {
    const q = query(collection(firestore, "tyreStores"), orderBy("dateAdded", "desc"));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as TyreStore);
  } catch (error) {
    console.error("Error getting tyre stores:", error);
    await handleFirestoreError(error);
    throw error;
  }
}

/**
 * Update an existing TyreStore document
 * @param storeId The ID of the TyreStore to update
 * @param storeData The updated TyreStore data
 */
export async function updateTyreStore(
  storeId: string,
  storeData: Partial<TyreStore>
): Promise<void> {
  try {
    const storeRef = doc(firestore, "tyreStores", storeId);
    await updateDoc(storeRef, {
      ...storeData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating tyre store:", error);
    await handleFirestoreError(error);
    throw error;
  }
}

/**
 * Delete a TyreStore document
 * @param storeId The ID of the TyreStore to delete
 */
export async function deleteTyreStore(storeId: string): Promise<void> {
  try {
    const storeRef = doc(firestore, "tyreStores", storeId);
    await deleteDoc(storeRef);
  } catch (error) {
    console.error("Error deleting tyre store:", error);
    await handleFirestoreError(error);
    throw error;
  }
}

/**
 * Update or insert a stock entry in a specific TyreStore
 * @param storeId The ID of the TyreStore to update
 * @param entry The StockEntry to update or insert
 */
export async function updateTyreStoreEntry(storeId: string, entry: StockEntry): Promise<void> {
  try {
    const storeRef = doc(firestore, "tyreStores", storeId);
    const snap = await getDoc(storeRef);

    if (!snap.exists()) {
      throw new Error(`TyreStore ${storeId} does not exist`);
    }

    const data = snap.data() as TyreStore;
    const entries = data.entries || [];
    const idx = entries.findIndex((e) => e.tyreId === entry.tyreId);

    if (idx >= 0) {
      entries[idx] = entry;
    } else {
      entries.push(entry);
    }

    await updateDoc(storeRef, {
      entries,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating tyre store entry:", error);
    await handleFirestoreError(error);
    throw error;
  }
}

/**
 * Remove a stock entry from a specific TyreStore
 * @param storeId The ID of the TyreStore to update
 * @param tyreId The ID of the tyre to remove
 */
export async function removeTyreStoreEntry(storeId: string, tyreId: string): Promise<void> {
  try {
    const storeRef = doc(firestore, "tyreStores", storeId);
    const snap = await getDoc(storeRef);

    if (!snap.exists()) {
      throw new Error(`TyreStore ${storeId} does not exist`);
    }

    const data = snap.data() as TyreStore;
    const entries = data.entries || [];
    const updatedEntries = entries.filter((e) => e.tyreId !== tyreId);

    await updateDoc(storeRef, {
      entries: updatedEntries,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error removing tyre store entry:", error);
    await handleFirestoreError(error);
    throw error;
  }
}

/**
 * Move a stock entry between two TyreStores
 * @param fromStoreId The ID of the source TyreStore
 * @param toStoreId The ID of the destination TyreStore
 * @param entry The StockEntry to move
 */
export async function moveTyreStoreEntry(
  fromStoreId: string,
  toStoreId: string,
  entry: StockEntry
): Promise<void> {
  try {
    // First remove the entry from the source store
    await removeTyreStoreEntry(fromStoreId, entry.tyreId);

    // Then add it to the destination store
    await updateTyreStoreEntry(toStoreId, entry);
  } catch (error) {
    console.error("Error moving tyre store entry:", error);
    await handleFirestoreError(error);
    throw error;
  }
}

/**
 * Get stock entries for a specific tyre across all stores
 * @param tyreId The ID of the tyre to find
 */
export async function getTyreStoreEntriesByTyreId(
  tyreId: string
): Promise<{ storeId: string; entry: StockEntry }[]> {
  try {
    const stores = await getAllTyreStores();
    const results: { storeId: string; entry: StockEntry }[] = [];

    for (const store of stores) {
      const entry = store.entries?.find((e) => e.tyreId === tyreId);
      if (entry) {
        results.push({
          storeId: store.id,
          entry,
        });
      }
    }

    return results;
  } catch (error) {
    console.error("Error getting tyre store entries by tyre ID:", error);
    await handleFirestoreError(error);
    throw error;
  }
}

/**
 * Listen to all TyreStore documents in real time
 * @param onChange Callback function that receives the updated stores
 */
export function listenToTyreStores(onChange: (stores: TyreStore[]) => void) {
  try {
    const collRef = collection(firestore, "tyreStores");
    const q = query(collRef, orderBy("dateAdded", "desc"));

    return onSnapshot(
      q,
      (snapshot) => {
        const stores: TyreStore[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          // Convert Firestore Timestamps to Date objects
          if (data.dateAdded) {
            data.dateAdded = data.dateAdded.toDate ? data.dateAdded.toDate() : data.dateAdded;
          }
          if (data.updatedAt) {
            data.updatedAt = data.updatedAt.toDate ? data.updatedAt.toDate() : data.updatedAt;
          }
          return { id: doc.id, ...data } as TyreStore;
        });
        onChange(stores);
      },
      (error) => {
        console.error("Error listening to tyre stores:", error);
        handleFirestoreError(error);
      }
    );
  } catch (error) {
    console.error("Error setting up tyre stores listener:", error);
    handleFirestoreError(error);
    // Return a no-op function as unsubscribe
    return () => {};
  }
}

/**
 * Get statistics for tyre stores
 */
export async function getTyreStoreStats(): Promise<{
  totalStores: number;
  totalTyres: number;
  storeTypeCounts: Record<string, number>;
  tyresByStatus: Record<string, number>;
}> {
  try {
    const stores = await getAllTyreStores();

    const storeTypeCounts: Record<string, number> = {};
    const tyresByStatus: Record<string, number> = {};
    let totalTyres = 0;

    stores.forEach((store) => {
      // Count store types
      const storeType = store.name || "Unknown";
      storeTypeCounts[storeType] = (storeTypeCounts[storeType] || 0) + 1;

      // Count tyres by status
      const entries = store.entries || [];
      totalTyres += entries.length;

      entries.forEach((entry) => {
        const status = entry.status || "Unknown";
        tyresByStatus[status] = (tyresByStatus[status] || 0) + 1;
      });
    });

    return {
      totalStores: stores.length,
      totalTyres,
      storeTypeCounts,
      tyresByStatus,
    };
  } catch (error) {
    console.error("Error getting tyre store stats:", error);
    await handleFirestoreError(error);
    throw error;
  }
}

export default {
  addTyreStore,
  getTyreStoreById,
  getAllTyreStores,
  updateTyreStore,
  deleteTyreStore,
  updateTyreStoreEntry,
  removeTyreStoreEntry,
  moveTyreStoreEntry,
  getTyreStoreEntriesByTyreId,
  listenToTyreStores,
  getTyreStoreStats,
};
