import { firestore } from '../../../firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs, 
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import { DieselConsumptionRecord, DieselNorm } from '../../../types';

// Collection references
const DIESEL_COLLECTION = 'dieselConsumption';
const DIESEL_NORMS_COLLECTION = 'dieselNorms';

/**
 * Add a new diesel consumption record
 * 
 * @param record - Diesel consumption record to add
 * @returns Promise with the record ID
 */
export const addDieselRecord = async (record: DieselConsumptionRecord): Promise<string> => {
  try {
    // Add server timestamp
    const recordWithTimestamp = {
      ...record,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(
      collection(firestore, DIESEL_COLLECTION),
      recordWithTimestamp
    );
    
    return docRef.id;
  } catch (error) {
    console.error("Error adding diesel record:", error);
    throw error;
  }
};

/**
 * Get all diesel consumption records
 * 
 * @returns Promise with array of diesel records
 */
export const getAllDieselRecords = async (): Promise<DieselConsumptionRecord[]> => {
  try {
    const querySnapshot = await getDocs(collection(firestore, DIESEL_COLLECTION));
    
    const records: DieselConsumptionRecord[] = [];
    querySnapshot.forEach((doc) => {
      records.push({ id: doc.id, ...doc.data() } as DieselConsumptionRecord);
    });
    
    return records;
  } catch (error) {
    console.error("Error getting diesel records:", error);
    throw error;
  }
};

/**
 * Get diesel records for a specific vehicle
 * 
 * @param fleetNumber - The fleet number of the vehicle
 * @returns Promise with array of diesel records for the vehicle
 */
export const getDieselRecordsForVehicle = async (fleetNumber: string): Promise<DieselConsumptionRecord[]> => {
  try {
    const q = query(
      collection(firestore, DIESEL_COLLECTION),
      where("fleetNumber", "==", fleetNumber)
    );
    
    const querySnapshot = await getDocs(q);
    
    const records: DieselConsumptionRecord[] = [];
    querySnapshot.forEach((doc) => {
      records.push({ id: doc.id, ...doc.data() } as DieselConsumptionRecord);
    });
    
    return records;
  } catch (error) {
    console.error("Error getting diesel records for vehicle:", error);
    throw error;
  }
};

/**
 * Update a diesel consumption record
 * 
 * @param id - ID of the record to update
 * @param updatedData - Updated data
 * @returns Promise
 */
export const updateDieselRecord = async (id: string, updatedData: Partial<DieselConsumptionRecord>): Promise<void> => {
  try {
    // Add updated timestamp
    const dataWithTimestamp = {
      ...updatedData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(
      doc(firestore, DIESEL_COLLECTION, id),
      dataWithTimestamp
    );
  } catch (error) {
    console.error("Error updating diesel record:", error);
    throw error;
  }
};

/**
 * Delete a diesel consumption record
 * 
 * @param id - ID of the record to delete
 * @returns Promise
 */
export const deleteDieselRecord = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(firestore, DIESEL_COLLECTION, id));
  } catch (error) {
    console.error("Error deleting diesel record:", error);
    throw error;
  }
};

/**
 * Get a diesel consumption record by ID
 * 
 * @param id - ID of the record to retrieve
 * @returns Promise with the record data
 */
export const getDieselRecordById = async (id: string): Promise<DieselConsumptionRecord | null> => {
  try {
    const docRef = doc(firestore, DIESEL_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as DieselConsumptionRecord;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting diesel record:", error);
    throw error;
  }
};

/**
 * Get diesel records for a specific date range
 * 
 * @param startDate - Start date (ISO string)
 * @param endDate - End date (ISO string)
 * @returns Promise with array of diesel records
 */
export const getDieselRecordsForDateRange = async (startDate: string, endDate: string): Promise<DieselConsumptionRecord[]> => {
  try {
    // Get all records and filter by date range
    // Note: Firestore doesn't support direct queries on date ranges for string dates
    const records = await getAllDieselRecords();
    
    return records.filter(record => {
      const recordDate = record.date;
      return recordDate >= startDate && recordDate <= endDate;
    });
  } catch (error) {
    console.error("Error getting diesel records for date range:", error);
    throw error;
  }
};

/**
 * Link a diesel record to a trip
 * 
 * @param dieselId - ID of the diesel record
 * @param tripId - ID of the trip to link
 * @returns Promise
 */
export const linkDieselToTrip = async (dieselId: string, tripId: string): Promise<void> => {
  try {
    await updateDieselRecord(dieselId, { tripId });
  } catch (error) {
    console.error("Error linking diesel to trip:", error);
    throw error;
  }
};

/**
 * Get all diesel norms
 * 
 * @returns Promise with array of diesel norms
 */
export const getAllDieselNorms = async (): Promise<DieselNorm[]> => {
  try {
    const querySnapshot = await getDocs(collection(firestore, DIESEL_NORMS_COLLECTION));
    
    const norms: DieselNorm[] = [];
    querySnapshot.forEach((doc) => {
      norms.push({ id: doc.id, ...doc.data() } as DieselNorm);
    });
    
    return norms;
  } catch (error) {
    console.error("Error getting diesel norms:", error);
    throw error;
  }
};

/**
 * Update or create a diesel norm
 * 
 * @param norm - The diesel norm to update or create
 * @returns Promise
 */
export const upsertDieselNorm = async (norm: DieselNorm): Promise<string> => {
  try {
    if (norm.id) {
      // Update existing norm
      await updateDoc(
        doc(firestore, DIESEL_NORMS_COLLECTION, norm.id),
        { ...norm, updatedAt: serverTimestamp() }
      );
      return norm.id;
    } else {
      // Create new norm
      const docRef = await addDoc(
        collection(firestore, DIESEL_NORMS_COLLECTION),
        { ...norm, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }
      );
      return docRef.id;
    }
  } catch (error) {
    console.error("Error upserting diesel norm:", error);
    throw error;
  }
};

/**
 * Delete a diesel norm
 * 
 * @param id - ID of the norm to delete
 * @returns Promise
 */
export const deleteDieselNorm = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(firestore, DIESEL_NORMS_COLLECTION, id));
  } catch (error) {
    console.error("Error deleting diesel norm:", error);
    throw error;
  }
};

/**
 * Calculate diesel consumption statistics for a vehicle
 * 
 * @param fleetNumber - The fleet number of the vehicle
 * @returns Promise with consumption stats
 */
export const calculateDieselStats = async (fleetNumber: string): Promise<{
  totalConsumption: number;
  averageConsumptionPer100km: number;
  recordCount: number;
  totalDistance: number;
}> => {
  try {
    const records = await getDieselRecordsForVehicle(fleetNumber);
    
    if (records.length === 0) {
      return {
        totalConsumption: 0,
        averageConsumptionPer100km: 0,
        recordCount: 0,
        totalDistance: 0
      };
    }
    
    const totalConsumption = records.reduce((sum, record) => sum + record.litresFilled, 0);
    
    let totalDistance = 0;
    let recordsWithDistanceCount = 0;
    
    // Calculate distance based on odometer readings
    for (let i = 0; i < records.length; i++) {
      const currentRecord = records[i];
      
      if (currentRecord.kmReading && currentRecord.previousKmReading) {
        const distance = currentRecord.kmReading - currentRecord.previousKmReading;
        
        if (distance > 0) {
          totalDistance += distance;
          recordsWithDistanceCount++;
        }
      }
    }
    
    const averageConsumptionPer100km = totalDistance > 0 ? 
      (totalConsumption / totalDistance) * 100 : 0;
    
    return {
      totalConsumption,
      averageConsumptionPer100km,
      recordCount: records.length,
      totalDistance
    };
  } catch (error) {
    console.error("Error calculating diesel stats:", error);
    throw error;
  }
};
