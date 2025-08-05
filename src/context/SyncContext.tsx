import React, { createContext, useContext } from 'react';
import syncService from '../utils/syncService';
import type { SyncService } from '../utils/syncService';
import { getConnectionStatus } from '../utils/firebaseConnectionHandler';

const SyncContext = createContext<SyncService | undefined>(undefined);

interface SyncProviderProps {
  children: React.ReactNode;
}

export const SyncProvider: React.FC<SyncProviderProps> = ({ children }) => {
  // Initialize syncService
  return (
    <SyncContext.Provider value={syncService}>
      {children}
    </SyncContext.Provider>
  );
};

export const useSyncContext = (): SyncService => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSyncContext must be used within a SyncProvider');
  }
  
  // Update isOnline property based on connection status
  const connectionStatus = getConnectionStatus();
  context.isOnline = connectionStatus.status === 'connected';
  
  return context;
};

// Custom hook for subscribing to a specific trip
export const useTripSync = (tripId: string | null): { isSyncing: boolean } => {
  const syncContext = useSyncContext();

  React.useEffect(() => {
    if (tripId) {
      console.log(`Setting up trip sync for trip ID: ${tripId}`);
      syncContext.subscribeToTrip(tripId);

      // Return cleanup function to unsubscribe when component unmounts
      // or when tripId changes
      return () => {
        console.log(`Cleaning up trip sync for trip ID: ${tripId}`);
        // syncService handles unsubscribing internally when a new subscription
        // is made for the same tripId
      };
    }
  }, [tripId, syncContext]);

  return {
    isSyncing: syncContext.syncStatus === 'syncing'
  };
};