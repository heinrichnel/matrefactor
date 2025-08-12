import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { firestore, handleFirestoreError } from "../utils/firebaseConnectionHandler";

// The following import statement is added to include the constants and types you need.
// The exact path and names depend on the content of your 'tyre' file.
// Assuming the file exports these members correctly, this will work.


/**
 * Listen to tyres collection in real-time
 * @param callback Function to call when tyres data changes
 * @returns Unsubscribe function to stop listening
 */
export function listenToTyres(callback: (tyres: Tyre[]) => void) {
  // Query with sorting for consistent ordering
  const q = query(collection(firestore, "tyres"), orderBy("updatedAt", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const tyres = snapshot.docs.map((doc) => {
        const data = doc.data();
        // Convert Firestore Timestamps to standard dates
        if (data.createdAt) {
          data.createdAt = data.createdAt.toDate
            ? data.createdAt.toDate().toISOString()
            : data.createdAt;
        }
        if (data.updatedAt) {
          data.updatedAt = data.updatedAt.toDate
            ? data.updatedAt.toDate().toISOString()
            : data.updatedAt;
        }
        return { id: doc.id, ...data } as Tyre;
      });
      callback(tyres);
    },
    (error) => {
      console.error("Error listening to tyres:", error);
      handleFirestoreError(error);
    }
  );
}

export default {
  listenToTyres,
};

export interface Tyre {
  id: string;
  serialNumber: string;
  brand: string;
  size: string; // This could be changed to TyreSize if it's a specific type.
  // other tyre properties
}

export interface Vehicle {
  id: string;
  registration: string;
  model: string;
  // other vehicle properties
}

export interface Assignment {
  id: string;
  tyreId: string;
  vehicleId: string;
  assignedAt: Date;
  vehicle: Vehicle;
  tyre: Tyre;
}
