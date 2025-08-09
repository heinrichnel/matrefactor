import {
  collection,
  collectionGroup,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { cleanObjectForFirestore, convertTimestamps } from "../utils/firestoreUtils";

// Types
export interface DriverBehaviorEvent {
  id: string;
  createdAt: string | Timestamp;
  updatedAt: string | Timestamp;
  driverName: string;
  eventDate: string; // Format: "YYYY/MM/DD"
  eventTime: string; // Format: "HH:MM"
  eventType: string;
  description: string;
  fleetNumber: string;
  importSource: string;
  location: string;
  points: number;
  severity: string;
  status: string;
  uniqueKey: string;
  eventCategory?: string; // Added for tracking the category in the path
  month?: string; // Added for tracking the month in the path
}

// Callbacks interface
export interface DriverBehaviorCallbacks {
  setDriverBehaviorEvents?: (events: DriverBehaviorEvent[]) => void;
  onDriverBehaviorUpdate?: (event: DriverBehaviorEvent) => void;
}

export class DriverBehaviorService {
  private driverBehaviorUnsubscribes: Map<string, () => void> = new Map();
  private globalUnsubscribes: Map<string, () => void> = new Map();
  private pendingChanges: Map<string, any> = new Map();
  private callbacks: DriverBehaviorCallbacks = {};
  private isOnline: boolean = navigator.onLine;
  private lastSynced: Date | null = null;
  private syncStatus: "idle" | "syncing" | "success" | "error" = "idle";

  constructor() {
    // Listen for online/offline events
    window.addEventListener("online", () => {
      this.isOnline = true;
      this.syncPendingChanges();
    });
    window.addEventListener("offline", () => {
      this.isOnline = false;
    });

    // Initial load of pending changes from localStorage
    this.loadPendingChangesFromLocalStorage();
  }

  // Set sync status
  private setSyncStatus(status: "idle" | "syncing" | "success" | "error"): void {
    this.syncStatus = status;
  }

  // Check if user is authenticated (placeholder - implement based on your auth system)
  private isAuthenticated(): boolean {
    // Replace with your actual authentication check
    return true;
  }

  // Store pending changes in localStorage for offline resilience
  private storePendingChangesInLocalStorage(): void {
    try {
      const pendingChangesObj: Record<string, any> = {};
      this.pendingChanges.forEach((value, key) => {
        pendingChangesObj[key] = value;
      });
      localStorage.setItem("driverBehavior_pendingChanges", JSON.stringify(pendingChangesObj));
    } catch (error) {
      console.error("Error storing pending changes in localStorage:", error);
    }
  }

  // Load pending changes from localStorage
  private loadPendingChangesFromLocalStorage(): void {
    try {
      const pendingChangesStr = localStorage.getItem("driverBehavior_pendingChanges");
      if (pendingChangesStr) {
        const pendingChangesObj = JSON.parse(pendingChangesStr);
        Object.entries(pendingChangesObj).forEach(([key, value]) => {
          this.pendingChanges.set(key, value);
        });
        console.log(
          `📥 Loaded ${this.pendingChanges.size} pending driver behavior changes from localStorage`
        );
      }
    } catch (error) {
      console.error("Error loading pending changes from localStorage:", error);
    }
  }

  // Sync pending changes when coming back online
  private async syncPendingChanges(): Promise<void> {
    if (!this.isOnline || this.pendingChanges.size === 0) return;

    console.log(`🔄 Syncing ${this.pendingChanges.size} pending driver behavior changes`);
    this.setSyncStatus("syncing");

    const promises: Promise<void>[] = [];
    const completedKeys: string[] = [];

    this.pendingChanges.forEach((value, key) => {
      if (key.startsWith("driverBehaviorEvents:")) {
        const eventId = key.split(":")[1];
        const { docPath, ...data } = value;

        if (docPath) {
          // This is a document with a specific path
          const eventRef = doc(db, docPath);
          promises.push(
            setDoc(
              eventRef,
              {
                ...data,
                updatedAt: serverTimestamp(),
              },
              { merge: true }
            )
              .then(() => {
                console.log(`✅ Synced driver behavior event ${eventId}`);
                completedKeys.push(key);
              })
              .catch((error) => {
                console.error(`Error syncing driver behavior event ${eventId}:`, error);
              })
          );
        } else {
          console.warn(`Missing docPath for driver behavior event ${eventId}`);
        }
      }
    });

    try {
      await Promise.all(promises);

      // Remove completed items
      completedKeys.forEach((key) => {
        this.pendingChanges.delete(key);
      });

      // Update localStorage with remaining items
      this.storePendingChangesInLocalStorage();

      console.log(`✅ Synced ${completedKeys.length} driver behavior changes`);
      this.setSyncStatus("success");
    } catch (error) {
      console.error("Error syncing pending driver behavior changes:", error);
      this.setSyncStatus("error");
    }
  }

  // Register callbacks
  public registerCallbacks(callbacks: DriverBehaviorCallbacks): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  // Subscribe to driver behavior events for a specific driver
  public subscribeToDriverBehavior(driverName: string): void {
    // Unsubscribe if already subscribed
    if (this.driverBehaviorUnsubscribes.has(driverName)) {
      this.driverBehaviorUnsubscribes.get(driverName)?.();
    }

    // Use collectionGroup to query across all nested subcollections
    // This will search through all month subcollections (01, 02, 03... 12)
    const monthQueries = Array.from({ length: 12 }, (_, i) => {
      const month = String(i + 1).padStart(2, "0");
      return query(
        collectionGroup(db, month),
        where("driverName", "==", driverName),
        where("importSource", "==", "web_book"),
        orderBy("createdAt", "desc")
      );
    });

    const unsubscribers: Array<() => void> = [];

    monthQueries.forEach((monthQuery) => {
      const unsubscribe = onSnapshot(
        monthQuery,
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            const eventData = change.doc.data();
            const docPath = change.doc.ref.path;

            // Extract additional metadata from path
            const pathParts = docPath.split("/");
            const eventCategory = pathParts[1]; // "21H_Fatigue Alert_2025"
            const month = pathParts[2]; // "06"

            // Convert Firestore timestamps to ISO strings
            const event = convertTimestamps(eventData) as DriverBehaviorEvent;

            if (change.type === "added" || change.type === "modified") {
              console.log(`🔄 Real-time update for driver behavior event ${change.doc.id}`);

              if (this.callbacks.onDriverBehaviorUpdate) {
                this.callbacks.onDriverBehaviorUpdate({
                  ...event,
                  id: change.doc.id,
                  eventCategory,
                  month,
                });
              }
            }
          });
        },
        (error) => {
          console.error(`Error subscribing to driver behavior for ${driverName}:`, error);
        }
      );

      unsubscribers.push(unsubscribe);
    });

    // Store all unsubscribers for this driver
    this.driverBehaviorUnsubscribes.set(driverName, () => {
      unsubscribers.forEach((unsub) => unsub());
    });
  }

  // Subscribe to all driver behavior events
  public subscribeToAllDriverBehaviorEvents(): void {
    // Clear any existing global driver behavior listeners
    if (this.globalUnsubscribes.has("allDriverBehavior")) {
      this.globalUnsubscribes.get("allDriverBehavior")?.();
    }

    // Check if user is authenticated before subscribing
    if (!this.isAuthenticated()) {
      console.warn("⚠️ Cannot subscribe to driver behavior events - user not authenticated");
      return;
    }

    // Known event types and fleet numbers for targeted querying
    const eventTypes = [
      "Fatigue Alert",
      "Distracted",
      "Speeding",
      "Phone Usage While Driving",
      "Seatbelt Violation",
      "Accident",
      "Unspecified Passenger",
    ];

    const fleetNumbers = ["21H", "24H"]; // Add your known fleet numbers
    const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

    const allEvents: DriverBehaviorEvent[] = [];
    const unsubscribers: Array<() => void> = [];

    fleetNumbers.forEach((fleet) => {
      eventTypes.forEach((eventType) => {
        months.forEach((month) => {
          const collectionPath = `driverBehaviorEvents/${fleet}_${eventType}_2025/${month}`;

          try {
            const eventsQuery = query(
              collection(db, collectionPath),
              where("importSource", "==", "web_book"),
              orderBy("createdAt", "desc")
            );

            const unsubscribe = onSnapshot(
              eventsQuery,
              (snapshot) => {
                // Track changes for debugging
                let added = 0,
                  modified = 0,
                  removed = 0;

                // Remove old events for this specific path
                const filteredEvents = allEvents.filter(
                  (e) =>
                    !(e.fleetNumber === fleet && e.eventType === eventType && e.month === month)
                );

                // Process document changes
                snapshot.docChanges().forEach((change) => {
                  const id = change.doc.id;
                  const data = convertTimestamps(change.doc.data());

                  if (change.type === "added") {
                    added++;
                    console.log(`Driver behavior event added: ${collectionPath}/${id}`);

                    filteredEvents.push({
                      id,
                      ...data,
                      eventCategory: `${fleet}_${eventType}_2025`,
                      month: month,
                    } as DriverBehaviorEvent);
                  } else if (change.type === "modified") {
                    modified++;
                    console.log(`Driver behavior event modified: ${collectionPath}/${id}`);

                    filteredEvents.push({
                      id,
                      ...data,
                      eventCategory: `${fleet}_${eventType}_2025`,
                      month: month,
                    } as DriverBehaviorEvent);
                  } else if (change.type === "removed") {
                    removed++;
                    console.log(`Driver behavior event removed: ${collectionPath}/${id}`);
                    // Event already filtered out above
                  }
                });

                if (added > 0 || modified > 0 || removed > 0) {
                  console.log(
                    `🔄 Driver behavior changes in ${collectionPath}: ${added} added, ${modified} modified, ${removed} removed`
                  );

                  // Update the main events array
                  allEvents.length = 0;
                  allEvents.push(...filteredEvents);

                  if (typeof this.callbacks.setDriverBehaviorEvents === "function") {
                    this.callbacks.setDriverBehaviorEvents([...allEvents]);
                  } else {
                    console.warn("⚠️ setDriverBehaviorEvents callback not registered");
                  }
                  this.lastSynced = new Date();
                }
              },
              (error) => {
                console.error(`Error in driver behavior listener for ${collectionPath}:`, error);
                // Don't break the entire subscription for one collection error
              }
            );

            unsubscribers.push(unsubscribe);
          } catch (error) {
            console.error(`Error setting up listener for ${collectionPath}:`, error);
          }
        });
      });
    });

    // Store all unsubscribers
    this.globalUnsubscribes.set("allDriverBehavior", () => {
      unsubscribers.forEach((unsub) => unsub());
    });
  }

  // Alternative method using collectionGroup for simpler querying
  public subscribeToAllDriverBehaviorEventsSimple(): void {
    // Clear any existing global driver behavior listeners
    if (this.globalUnsubscribes.has("allDriverBehavior")) {
      this.globalUnsubscribes.get("allDriverBehavior")?.();
    }

    // Check if user is authenticated before subscribing
    if (!this.isAuthenticated()) {
      console.warn("⚠️ Cannot subscribe to driver behavior events - user not authenticated");
      return;
    }

    // Use collectionGroup to query across ALL month subcollections at once
    // This queries all documents in any subcollection named "01", "02", ... "12"
    const monthQueries = Array.from({ length: 12 }, (_, i) => {
      const month = String(i + 1).padStart(2, "0");
      return query(
        collectionGroup(db, month),
        where("importSource", "==", "web_book"),
        orderBy("createdAt", "desc")
      );
    });

    const allEvents: DriverBehaviorEvent[] = [];
    const unsubscribers: Array<() => void> = [];

    monthQueries.forEach((monthQuery, index) => {
      const month = String(index + 1).padStart(2, "0");

      const unsubscribe = onSnapshot(
        monthQuery,
        (snapshot) => {
          // Remove old events for this month
          const filteredEvents = allEvents.filter((e) => e.month !== month);

          // Add new events for this month
          snapshot.forEach((doc) => {
            const data = convertTimestamps(doc.data());
            const docPath = doc.ref.path;

            // Extract metadata from path
            const pathParts = docPath.split("/");
            const eventCategory = pathParts[1]; // "21H_Fatigue Alert_2025"

            filteredEvents.push({
              id: doc.id,
              month: month,
              eventCategory: eventCategory,
              ...data,
            } as DriverBehaviorEvent);
          });

          // Update main events array
          allEvents.length = 0;
          allEvents.push(...filteredEvents);

          if (typeof this.callbacks.setDriverBehaviorEvents === "function") {
            this.callbacks.setDriverBehaviorEvents([...allEvents]);
          }
          this.lastSynced = new Date();
        },
        (error) => {
          console.error(`Error in driver behavior month ${month} listener:`, error);
        }
      );

      unsubscribers.push(unsubscribe);
    });

    // Store all unsubscribers
    this.globalUnsubscribes.set("allDriverBehavior", () => {
      unsubscribers.forEach((unsub) => unsub());
    });
  }

  // Update a driver behavior event with real-time sync
  public async updateDriverBehaviorEvent(
    eventId: string,
    data: Partial<DriverBehaviorEvent>,
    eventPath?: string
  ): Promise<void> {
    try {
      this.setSyncStatus("syncing");

      // Clean data for Firestore
      const cleanData = cleanObjectForFirestore(data);

      // Add updatedAt timestamp
      const updateData = {
        ...cleanData,
        updatedAt: this.isOnline ? serverTimestamp() : new Date().toISOString(),
      };

      if (this.isOnline) {
        // If eventPath is provided, use it directly, otherwise construct from data
        let docPath = eventPath;

        if (!docPath && data.fleetNumber && data.eventType && data.eventDate) {
          const month = data.eventDate.split("/")[1]; // Extract month from "2025/06/20"
          docPath = `driverBehaviorEvents/${data.fleetNumber}_${data.eventType}_2025/${month}/${eventId}`;
        }

        if (!docPath) {
          throw new Error("Cannot determine document path for driver behavior event update");
        }

        // Online - update directly
        const eventRef = doc(db, docPath);
        await updateDoc(eventRef, updateData);
        console.log(`✅ Driver behavior event updated at path: ${docPath}`);
      } else {
        // Offline - store for later sync
        this.pendingChanges.set(`driverBehaviorEvents:${eventId}`, { ...updateData, eventPath });
        console.log(`📝 Driver behavior event ${eventId} update queued for sync when online`);

        // Store in localStorage as backup
        this.storePendingChangesInLocalStorage();
      }

      this.setSyncStatus("success");
    } catch (error) {
      console.error(`Error updating driver behavior event ${eventId}:`, error);
      this.setSyncStatus("error");
      throw error;
    }
  }

  // Add a new driver behavior event
  public async addDriverBehaviorEvent(eventData: Omit<DriverBehaviorEvent, "id">): Promise<string> {
    try {
      this.setSyncStatus("syncing");

      // Clean data for Firestore
      const cleanData = cleanObjectForFirestore(eventData);

      // Extract components for document path
      const eventTypeYear = `${eventData.fleetNumber}_${eventData.eventType}_2025`;
      const month = eventData.eventDate.split("/")[1]; // Extract month from "2025/06/20"
      const day = eventData.eventDate.split("/")[2]; // Extract day from "2025/06/20"
      const timeFormatted = eventData.eventTime.replace(":", ""); // "17:23" -> "1723"
      const documentId = `${day}_${timeFormatted}`; // "20_1723"

      // Build document reference following the observed structure
      const docPath = `driverBehaviorEvents/${eventTypeYear}/${month}/${documentId}`;

      // Add timestamps and uniqueKey
      const finalData = {
        ...cleanData,
        createdAt: this.isOnline ? serverTimestamp() : new Date().toISOString(),
        updatedAt: this.isOnline ? serverTimestamp() : new Date().toISOString(),
        uniqueKey: `${eventData.fleetNumber}_${eventData.eventType}_${eventData.eventDate}_${eventData.eventTime}`,
      };

      if (this.isOnline) {
        // Online - add directly to Firestore using setDoc with specific path
        const docRef = doc(db, docPath);
        await setDoc(docRef, finalData);
        console.log(`✅ Driver behavior event added at path: ${docPath}`);
      } else {
        // Offline - store for later sync
        this.pendingChanges.set(`driverBehaviorEvents:${documentId}`, { ...finalData, docPath });
        console.log(`📝 Driver behavior event creation queued for sync when online`);

        // Store in localStorage as backup
        this.storePendingChangesInLocalStorage();
      }

      this.setSyncStatus("success");
      return documentId;
    } catch (error) {
      console.error(`Error adding driver behavior event:`, error);
      this.setSyncStatus("error");
      throw error;
    }
  }

  // Cleanup method to unsubscribe from all listeners
  public cleanup(): void {
    console.log("Cleaning up driver behavior listeners");

    // Clean up individual driver behavior listeners
    this.driverBehaviorUnsubscribes.forEach((unsubscribe) => {
      unsubscribe();
    });
    this.driverBehaviorUnsubscribes.clear();

    // Clean up global listeners
    this.globalUnsubscribes.forEach((unsubscribe) => {
      unsubscribe();
    });
    this.globalUnsubscribes.clear();
  }
}

// Create and export a singleton instance
export const driverBehaviorService = new DriverBehaviorService();
