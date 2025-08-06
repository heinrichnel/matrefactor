// =============================================================================
// CONSOLIDATED FIREBASE CONFIGURATION AND SERVICES
// =============================================================================

import { FirebaseOptions, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  enableIndexedDbPersistence,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";

// Import types
import { Tyre, TyreConditionStatus, TyreMountStatus, TyreStatus, TyreStoreLocation } from "./data/tyreData";
import { Trip } from "./types";
import { DieselConsumptionRecord } from "./types/diesel";
import { TyreInspectionRecord } from "./types/tyre-inspection";

// =============================================================================
// FIREBASE CONFIGURATION
// =============================================================================

// Development configuration - only used in development mode
const devConfig: FirebaseOptions = {
  apiKey: "AIzaSyBtq7Z6qqaVmb22d3aNcwNiqkrbGtIhJ7g",
  authDomain: "mat1-9e6b3.firebaseapp.com",
  databaseURL: "https://mat1-9e6b3-default-rtdb.firebaseio.com",
  projectId: "mat1-9e6b3",
  storageBucket: "mat1-9e6b3.appspot.com",
  messagingSenderId: "250085264089",
  appId: "1:250085264089:web:51c2b209e0265e7d04ccc8",
  measurementId: "G-YHQHSJN5CQ",
};

// Get Firebase configuration based on environment
const getFirebaseConfig = (): FirebaseOptions => {
  // In development, we can use the dev config or env vars if present
  if (import.meta.env.DEV) {
    const config = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY || devConfig.apiKey,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || devConfig.authDomain,
      databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || devConfig.databaseURL,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || devConfig.projectId,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || devConfig.storageBucket,
      messagingSenderId:
        import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || devConfig.messagingSenderId,
      appId: import.meta.env.VITE_FIREBASE_APP_ID || devConfig.appId,
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || devConfig.measurementId,
    };

    console.log("Using development Firebase configuration");
    return config;
  }

  // In production, strictly require environment variables with no fallbacks
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };

  return config;
};

// Get the appropriate config based on environment
export const firebaseConfig = getFirebaseConfig();

// Validate the configuration
const validateConfig = () => {
  const requiredFields = [
    "apiKey",
    "authDomain",
    "projectId",
    "storageBucket",
    "messagingSenderId",
    "appId",
  ];
  const missingFields = requiredFields.filter(
    (field) => !firebaseConfig[field as keyof typeof firebaseConfig]
  );

  if (missingFields.length > 0) {
    if (import.meta.env.DEV) {
      console.warn("⚠️ Missing Firebase configuration fields:", missingFields.join(", "));
      return true; // Continue in development even with missing fields
    } else {
      // In production, throw an error for missing configuration
      const errorMessage = `Firebase initialization failed. Missing required configuration: ${missingFields.join(", ")}`;
      console.error(errorMessage);
      // We'll log the error but not throw to prevent app crash
      console.error(
        "Ensure all Firebase environment variables are set in your production environment"
      );
      return false;
    }
  }
  return true;
};

validateConfig();

// Initialize Firebase with the appropriate configuration - only if not already initialized
export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// =============================================================================
// FIREBASE SERVICES
// =============================================================================

// Initialize Firebase services
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp);
export const functions = getFunctions(firebaseApp);

// Alternative exports for compatibility
export const firestore = db;

// Enable offline persistence when possible
try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === "failed-precondition") {
      // Multiple tabs open, persistence can only be enabled in one tab at a time
      console.warn("Firebase persistence is only supported in one tab at a time");
    } else if (err.code === "unimplemented") {
      // The current browser does not support all of the features required
      console.warn("Firebase persistence is not supported in this browser");
    }
  });
} catch (error) {
  console.error("Error enabling offline persistence:", error);
}

// =============================================================================
// ERROR HANDLING
// =============================================================================

export const handleFirestoreError = async (error: any) => {
  console.error("Firestore error:", error);

  if (error.code === "unavailable") {
    console.log("Firestore is currently unavailable. Working offline...");
  } else if (error.code === "permission-denied") {
    console.error("Permission denied. Check Firestore rules.");
  } else if (error.code === "not-found") {
    console.error("Document not found.");
  }

  return Promise.resolve();
};

// =============================================================================
// AUDIT LOG FUNCTIONS
// =============================================================================

export const addAuditLogToFirebase = async (auditLogData: any) => {
  try {
    const auditLogsRef = collection(db, "auditLogs");
    const docRef = await addDoc(auditLogsRef, {
      ...auditLogData,
      timestamp: serverTimestamp(),
      createdAt: serverTimestamp(),
    });
    console.log("Audit log added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding audit log:", error);
    await handleFirestoreError(error);
    throw error;
  }
};

// =============================================================================
// DIESEL MANAGEMENT FUNCTIONS
// =============================================================================

export const addDieselToFirebase = async (dieselRecord: DieselConsumptionRecord) => {
  try {
    const dieselRef = doc(db, "diesel", dieselRecord.id);
    await setDoc(dieselRef, {
      ...dieselRecord,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log("Diesel record added with ID:", dieselRecord.id);
    return dieselRecord.id;
  } catch (error) {
    console.error("Error adding diesel record:", error);
    throw error;
  }
};

export async function updateDieselInFirebase(
  dieselId: string,
  dieselData: Partial<DieselConsumptionRecord>
) {
  try {
    const dieselRef = doc(db, "diesel", dieselId);
    await setDoc(
      dieselRef,
      {
        ...dieselData,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    console.log("Diesel record updated with ID:", dieselId);
    return dieselId;
  } catch (error) {
    console.error("Error updating diesel record:", error);
    throw error;
  }
}

export async function deleteDieselFromFirebase(dieselId: string) {
  try {
    const dieselRef = doc(db, "diesel", dieselId);
    await deleteDoc(dieselRef);
    console.log("Diesel record deleted with ID:", dieselId);
    return dieselId;
  } catch (error) {
    console.error("Error deleting diesel record:", error);
    throw error;
  }
}

// =============================================================================
// TRIP MANAGEMENT FUNCTIONS
// =============================================================================

export const addTripToFirebase = async (trip: Trip) => {
  try {
    const tripRef = doc(db, "trips", trip.id);
    await setDoc(tripRef, {
      ...trip,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log("Trip added with ID:", trip.id);
    return trip.id;
  } catch (error) {
    console.error("Error adding trip:", error);
    throw error;
  }
};

export async function updateTripInFirebase(tripId: string, tripData: Partial<Trip>) {
  const tripRef = doc(db, "trips", tripId);
  await setDoc(tripRef, { ...tripData, updatedAt: serverTimestamp() }, { merge: true });
}

export async function deleteTripFromFirebase(tripId: string) {
  try {
    const tripRef = doc(db, "trips", tripId);
    await deleteDoc(tripRef);
    console.log("Trip deleted with ID:", tripId);
    return tripId;
  } catch (error) {
    console.error("Error deleting trip:", error);
    throw error;
  }
}

// =============================================================================
// MISSED LOAD FUNCTIONS
// =============================================================================

export const addMissedLoadToFirebase = async (missedLoadData: any) => {
  try {
    const missedLoadsRef = collection(db, "missedLoads");
    const docRef = await addDoc(missedLoadsRef, {
      ...missedLoadData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log("Missed load added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding missed load:", error);
    throw error;
  }
};

export async function updateMissedLoadInFirebase(missedLoadId: string, missedLoadData: any) {
  try {
    const missedLoadRef = doc(db, "missedLoads", missedLoadId);
    await setDoc(
      missedLoadRef,
      {
        ...missedLoadData,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    console.log("Missed load updated with ID:", missedLoadId);
    return missedLoadId;
  } catch (error) {
    console.error("Error updating missed load:", error);
    throw error;
  }
}

export async function deleteMissedLoadFromFirebase(missedLoadId: string) {
  try {
    const missedLoadRef = doc(db, "missedLoads", missedLoadId);
    await deleteDoc(missedLoadRef);
    console.log("Missed load deleted with ID:", missedLoadId);
    return missedLoadId;
  } catch (error) {
    console.error("Error deleting missed load:", error);
    throw error;
  }
}

// =============================================================================
// DRIVER BEHAVIOR FUNCTIONS
// =============================================================================

export function listenToDriverBehaviorEvents(callback: (events: any[]) => void) {
  const eventsRef = collection(db, "driverBehaviorEvents");
  const unsubscribe = onSnapshot(eventsRef, (snapshot) => {
    const events = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(events);
  });
  return unsubscribe;
}



// =============================================================================
// TYRE MANAGEMENT FUNCTIONS
// =============================================================================

/**
 * Listen to tyres collection in real-time
 * @param callback Function to call when tyres data changes
 * @returns Unsubscribe function to stop listening
 */
export function listenToTyres(callback: (tyres: Tyre[]) => void) {
  // Query with sorting for consistent ordering
  const q = query(collection(db, "tyres"), orderBy("updatedAt", "desc"));

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

/**
 * Add or update a tyre document in Firestore
 */
export async function saveTyre(tyre: Tyre): Promise<string> {
  try {
    // Validate essential tyre data
    if (!tyre.serialNumber || !tyre.brand || !tyre.size) {
      throw new Error("Missing required tyre fields: serialNumber, brand, or size");
    }

    const tyreRef = tyre.id
      ? doc(db, "tyres", tyre.id)
      : doc(collection(db, "tyres"));

    const tyreId = tyre.id || tyreRef.id;

    // Add ID and timestamps if this is a new tyre
    const tyreData = {
      ...tyre,
      id: tyreId,
      updatedAt: serverTimestamp(),
      createdAt: tyre.createdAt || serverTimestamp(),
    };

    await setDoc(tyreRef, tyreData);
    return tyreId;
  } catch (error) {
    console.error("Error saving tyre:", error);
    await handleFirestoreError(error);
    throw error;
  }
}

/**
 * Get a tyre by ID
 */
export async function getTyreById(tyreId: string): Promise<Tyre | null> {
  try {
    const tyreRef = doc(db, "tyres", tyreId);
    const tyreSnap = await getDoc(tyreRef);

    if (!tyreSnap.exists()) {
      return null;
    }

    // Cast data to Tyre, handling potential Timestamp conversion
    const data = tyreSnap.data();
    if (data.createdAt && typeof data.createdAt.toDate === 'function') {
      data.createdAt = data.createdAt.toDate().toISOString();
    }
    if (data.updatedAt && typeof data.updatedAt.toDate === 'function') {
      data.updatedAt = data.updatedAt.toDate().toISOString();
    }

    return { id: tyreSnap.id, ...data } as Tyre;
  } catch (error) {
    console.error("Error getting tyre by ID:", error);
    await handleFirestoreError(error);
    throw error;
  }
}

/**
 * Get all tyres with optional filtering
 */
export async function getTyres(filters?: {
  status?: TyreStatus;
  mountStatus?: TyreMountStatus;
  brand?: string;
  location?: TyreStoreLocation;
  vehicleId?: string;
  condition?: TyreConditionStatus;
  minTreadDepth?: number;
  maxTreadDepth?: number;
}): Promise<Tyre[]> {
  try {
    let q = query(collection(db, "tyres"), orderBy("createdAt", "desc"));

    if (filters) {
      if (filters.status) {
        q = query(q, where("status", "==", filters.status));
      }
      if (filters.mountStatus) {
        q = query(q, where("mountStatus", "==", filters.mountStatus));
      }
      if (filters.brand) {
        q = query(q, where("brand", "==", filters.brand));
      }
      if (filters.location) {
        q = query(q, where("location", "==", filters.location));
      }
      if (filters.vehicleId) {
        q = query(q, where("vehicleId", "==", filters.vehicleId));
      }
      if (filters.condition) {
        q = query(q, where("condition", "==", filters.condition));
      }
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Tyre);
  } catch (error) {
    console.error("Error getting tyres:", error);
    await handleFirestoreError(error);
    throw error;
  }
}

/**
 * Delete a tyre
 */
export async function deleteTyre(tyreId: string): Promise<void> {
  try {
    const tyreRef = doc(db, "tyres", tyreId);
    await deleteDoc(tyreRef);
  } catch (error) {
    console.error("Error deleting tyre:", error);
    await handleFirestoreError(error);
    throw error;
  }
}

/**
 * Add a tyre inspection record
 */
export async function addTyreInspection(
  tyreId: string,
  inspection: TyreInspectionRecord
): Promise<string> {
  try {
    const inspectionsCollectionRef = collection(db, "tyres", tyreId, "inspections");
    const docRef = doc(inspectionsCollectionRef);
    const dataToSave = {
      ...inspection,
      id: docRef.id,
      createdAt: serverTimestamp(),
    };
    await setDoc(docRef, dataToSave);
    return docRef.id;
  } catch (error) {
    console.error("Error adding tyre inspection:", error);
    await handleFirestoreError(error);
    throw error;
  }
}

/**
 * Get all inspections for a tyre
 */
export async function getTyreInspections(tyreId: string): Promise<TyreInspectionRecord[]> {
  try {
    const inspectionsRef = collection(db, "tyres", tyreId, "inspections");
    const q = query(inspectionsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as TyreInspectionRecord);
  } catch (error) {
    console.error("Error getting tyre inspections:", error);
    await handleFirestoreError(error);
    throw error;
  }
}

/**
 * Get tyres mounted on a specific vehicle
 */
export async function getTyresByVehicle(vehicleId: string): Promise<Tyre[]> {
  try {
    const q = query(
      collection(db, "tyres"),
      where("vehicleId", "==", vehicleId),
      orderBy("updatedAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Tyre);
  } catch (error) {
    console.error("Error getting tyres by vehicle:", error);
    await handleFirestoreError(error);
    throw error;
  }
}

/**
 * Get tyre statistics for dashboard
 */
export async function getTyreStats(): Promise<{
  total: number;
  mounted: number;
  inStock: number;
  needsAttention: number;
  byBrand: Record<string, number>;
  byCondition: Record<string, number>;
}> {
  try {
    const tyresSnapshot = await getDocs(collection(db, "tyres"));
    const tyres = tyresSnapshot.docs.map((doc) => doc.data() as Tyre);

    const stats = {
      total: tyres.length,
      mounted: tyres.filter((t) => t.mountStatus === "mounted").length,
      inStock: tyres.filter((t) => t.status === "in-stock").length,
      needsAttention: tyres.filter((t) => t.condition === "needs-attention").length,
      byBrand: {} as Record<string, number>,
      byCondition: {} as Record<string, number>,
    };

    // Count by brand and condition
    tyres.forEach((tyre) => {
      stats.byBrand[tyre.brand] = (stats.byBrand[tyre.brand] || 0) + 1;
      stats.byCondition[tyre.condition] = (stats.byCondition[tyre.condition] || 0) + 1;
    });

    return stats;
  } catch (error) {
    console.error("Error getting tyre stats:", error);
    await handleFirestoreError(error);
    throw error;
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

// Export Firebase app and services
export default firebaseApp;

// Re-export Firebase modules for convenience
export {
  addDoc,
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
  where
} from "firebase/firestore";

/**
 * Get all tyres with optional filtering
 */
export async function getTyres(filters?: {
  status?: TyreStatus; // Changed to Enum
  mountStatus?: TyreMountStatus; // Changed to Enum
  brand?: string;
  location?: TyreStoreLocation; // Changed to Enum
  vehicleId?: string;
  condition?: TyreConditionStatus; // Changed to Enum
  minTreadDepth?: number;
  maxTreadDepth?: number;
}): Promise<Tyre[]> {
  try {
    const q = collection(firestore, "tyres");
    let queryObject = query(q);

    // Apply filters if provided
    if (filters) {
      if (filters.status) {
        queryObject = query(queryObject, where("status", "==", filters.status));
      }
      if (filters.mountStatus) {
        queryObject = query(queryObject, where("mountStatus", "==", filters.mountStatus));
      }
      if (filters.brand) {
        queryObject = query(queryObject, where("brand", "==", filters.brand));
      }
      if (filters.location) {
        queryObject = query(queryObject, where("location", "==", filters.location));
      }
      if (filters.vehicleId) {
        queryObject = query(queryObject, where("installation.vehicleId", "==", filters.vehicleId));
      }
      if (filters.condition) {
        queryObject = query(queryObject, where("condition.status", "==", filters.condition));
      }
      // Add sorting by default
      queryObject = query(queryObject, orderBy("updatedAt", "desc"));
    } else {
      // Default sorting if no filters
      queryObject = query(q, orderBy("updatedAt", "desc"));
    }

    const querySnapshot = await getDocs(queryObject);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      // Convert any Firestore Timestamps to ISO strings
      if (data.createdAt && typeof data.createdAt.toDate === 'function') {
        data.createdAt = data.createdAt.toDate().toISOString();
      }
      if (data.updatedAt && typeof data.updatedAt.toDate === 'function') {
        data.updatedAt = data.updatedAt.toDate().toISOString();
      }
      return { id: doc.id, ...data } as Tyre;
    });
  } catch (error) {
    console.error("Error getting tyres:", error);
    await handleFirestoreError(error);
    throw error;
  }
}

/**
 * Delete a tyre
 */
export async function deleteTyre(tyreId: string): Promise<void> {
  try {
    const tyreRef = doc(firestore, "tyres", tyreId);
    await deleteDoc(tyreRef);
  } catch (error) {
    console.error("Error deleting tyre:", error);
    await handleFirestoreError(error);
    throw error;
  }
}

/**
 * Add a tyre inspection record
 */
export async function addTyreInspection(
  tyreId: string,
  inspection: TyreInspectionRecord
): Promise<string> {
  try {
    if (!tyreId) {
      throw new Error("Tyre ID is required");
    }

    // Validate inspection data
    if (!inspection.inspectionDate || !inspection.inspectorName || inspection.treadDepth === undefined) {
      throw new Error("Inspection requires date, inspector and tread depth");
    }

    // Add to inspections subcollection
    const inspectionsRef = collection(firestore, "tyres", tyreId, "inspections");
    const inspectionDoc = inspection.id ? doc(inspectionsRef, inspection.id) : doc(inspectionsRef);

    const inspectionId = inspection.id || inspectionDoc.id;

    await setDoc(inspectionDoc, {
      ...inspection,
      id: inspectionId,
      createdAt: serverTimestamp(),
    });

    // Update the tyre document with latest inspection results
    const tyreRef = doc(firestore, "tyres", tyreId);
    await updateDoc(tyreRef, {
      "condition.treadDepth": inspection.treadDepth,
      "condition.pressure": inspection.pressure,
      "condition.lastInspectionDate": inspection.inspectionDate,
      updatedAt: serverTimestamp(),
    });

    return inspectionId;
  } catch (error) {
    console.error("Error adding tyre inspection:", error);
    await handleFirestoreError(error);
    throw error;
  }
}

/**
 * Get all inspections for a tyre
 */
export async function getTyreInspections(tyreId: string): Promise<TyreInspectionRecord[]> {
  try {
    const inspectionsRef = collection(firestore, "tyres", tyreId, "inspections");
    const q = query(inspectionsRef, orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      if (data.createdAt && typeof data.createdAt.toDate === 'function') {
        data.createdAt = data.createdAt.toDate().toISOString();
      }
      return { id: doc.id, ...data } as TyreInspectionRecord;
    });
  } catch (error) {
    console.error("Error getting tyre inspections:", error);
    await handleFirestoreError(error);
    throw error;
  }
}

/**
 * Get tyres mounted on a specific vehicle
 */
export async function getTyresByVehicle(vehicleId: string): Promise<Tyre[]> {
  try {
    const q = query(
      collection(firestore, "tyres"),
      where("mountStatus", "==", TyreMountStatus.MOUNTED), // Changed to enum
      where("installation.vehicleId", "==", vehicleId)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      if (data.createdAt && typeof data.createdAt.toDate === 'function') {
        data.createdAt = data.createdAt.toDate().toISOString();
      }
      if (data.updatedAt && typeof data.updatedAt.toDate === 'function') {
        data.updatedAt = data.updatedAt.toDate().toISOString();
      }
      return { id: doc.id, ...data } as Tyre;
    });
  } catch (error) {
    console.error("Error getting tyres by vehicle:", error);
    await handleFirestoreError(error);
    throw error;
  }
}

/**
 * Get tyre statistics for dashboard
 */
export async function getTyreStats(): Promise<{
  total: number;
  mounted: number;
  inStock: number;
  needsAttention: number;
  byBrand: Record<string, number>;
  byCondition: Record<string, number>;
}> {
  try {
    const totalSnapshot = await getDocs(collection(firestore, "tyres"));
    const mountedSnapshot = await getDocs(
      query(collection(firestore, "tyres"), where("mountStatus", "==", TyreMountStatus.MOUNTED)) // Changed to enum
    );
    const inStockSnapshot = await getDocs(
      query(collection(firestore, "tyres"), where("mountStatus", "==", TyreMountStatus.IN_STORAGE)) // Changed to enum
    );
    const needsAttentionSnapshot = await getDocs(
      query(
        collection(firestore, "tyres"),
        where("condition.status", "in", [TyreConditionStatus.CRITICAL, TyreConditionStatus.NEEDS_REPLACEMENT]) // Changed to enum
      )
    );

    // Get brand distribution
    const byBrand: Record<string, number> = {};
    totalSnapshot.docs.forEach((doc) => {
      const brand = doc.data().brand || "Unknown";
      byBrand[brand] = (byBrand[brand] || 0) + 1;
    });

    // Get condition distribution
    const byCondition: Record<string, number> = {};
    totalSnapshot.docs.forEach((doc) => {
      const condition = doc.data().condition?.status || "Unknown";
      byCondition[condition] = (byCondition[condition] || 0) + 1;
    });

    return {
      total: totalSnapshot.size,
      mounted: mountedSnapshot.size,
      inStock: inStockSnapshot.size,
      needsAttention: needsAttentionSnapshot.size,
      byBrand,
      byCondition,
    };
  } catch (error) {
    console.error("Error getting tyre stats:", error);
    await handleFirestoreError(error);
    throw error;
  }
}

// --- End Tyre Management Functions ---

export { firestore as db, firestore, storage };
export default firebaseApp;
