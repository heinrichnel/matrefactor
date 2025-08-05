import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getFirestore, collection, onSnapshot, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { firebaseApp } from '../firebaseConfig';

// Define Driver Behavior Event interface
export interface DriverBehaviorEvent {
  id: string;
  fleetNumber?: string;
  eventDate: string | Date;
  eventType: string;
  severity: string;
  importSource?: string;    // <--- Add this field for clarity
  [key: string]: any;       // Allow other fields
}

// Create context type
interface DriverBehaviorContextType {
  events: DriverBehaviorEvent[];
  loading: boolean;
  error: Error | null;
  webBookEvents: DriverBehaviorEvent[];   // <--- Added here
}

// Create context with default values
const DriverBehaviorContext = createContext<DriverBehaviorContextType>({
  events: [],
  loading: true,
  error: null,
  webBookEvents: []
});

// Provider props interface
interface DriverBehaviorProviderProps {
  children: ReactNode;
}

// Driver Behavior Provider component
export const DriverBehaviorProvider: React.FC<DriverBehaviorProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<DriverBehaviorEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);

    // Initialize Firestore
    const db = getFirestore(firebaseApp);

    try {
      // Set up real-time listener to driverBehaviorEvents collection
      const unsubscribe = onSnapshot(
        collection(db, 'driverBehaviorEvents'),
        (snapshot) => {
          const eventsData: DriverBehaviorEvent[] = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
            const data = doc.data();
            return {
              id: doc.id,
              fleetNumber: data.fleetNumber || '',
              eventDate: data.eventDate || new Date(),
              eventType: data.eventType || 'unknown',
              severity: data.severity || 'medium',
              importSource: data.importSource || undefined,
              ...data
            };
          });

          setEvents(eventsData);
          setLoading(false);
        },
        (err) => {
          console.error("Error fetching driver behavior events:", err);
          setError(err);
          setLoading(false);
        }
      );

      // Clean up subscription on unmount
      return () => unsubscribe();
    } catch (err: any) {
      console.error("Error setting up driver behavior listener:", err);
      setError(err);
      setLoading(false);
      return () => {}; // Return empty function for consistency
    }
  }, []);

  // --- Add webBookEvents filtering ---
  const webBookEvents = events.filter(e => e.importSource === "web_book");

  // Value to provide to context consumers
  const value = {
    events,
    loading,
    error,
    webBookEvents   // Now available in all consumers
  };

  return (
    <DriverBehaviorContext.Provider value={value}>
      {children}
    </DriverBehaviorContext.Provider>
  );
};

// Custom hook for using the driver behavior context
export const useDriverBehavior = () => useContext(DriverBehaviorContext);
