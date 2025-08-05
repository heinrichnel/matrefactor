import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  saveTyre,
  getTyres,
  getTyreById,
  deleteTyre,
  addTyreInspection,
  getTyreInspections,
  getTyresByVehicle,
  listenToTyres
} from '../firebase';
import { Tyre, TyreInspection, TyreStoreLocation } from '../types/tyre';

// Define the context interface
interface TyreContextType {
  tyres: Tyre[];
  loading: boolean;
  error: Error | null;
  saveTyre: (tyre: Tyre) => Promise<string>;
  getTyreById: (id: string) => Promise<Tyre | null>;
  deleteTyre: (id: string) => Promise<void>;
  addInspection: (tyreId: string, inspection: TyreInspection) => Promise<string>;
  getInspections: (tyreId: string) => Promise<TyreInspection[]>;
  getTyresByVehicle: (vehicleId: string) => Promise<Tyre[]>;
  filterTyres: (filters: {
    status?: string;
    mountStatus?: string;
    brand?: string;
    location?: string;
    vehicleId?: string;
  }) => Promise<Tyre[]>;
}

// Create the context with a default value
const TyreContext = createContext<TyreContextType | undefined>(undefined);

// Provider component
export const TyreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tyres, setTyres] = useState<Tyre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Set up real-time listener for tyres collection
  useEffect(() => {
    setLoading(true);

    const unsubscribe = listenToTyres((updatedTyres: Tyre[]) => {
      setTyres(updatedTyres);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Wrapper for saveTyre function
  const handleSaveTyre = async (tyre: Tyre): Promise<string> => {
    try {
      return await saveTyre(tyre);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error saving tyre'));
      throw err;
    }
  };

  // Wrapper for getTyreById function
  const handleGetTyreById = async (id: string): Promise<Tyre | null> => {
    try {
      return await getTyreById(id);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error getting tyre'));
      throw err;
    }
  };

  // Wrapper for deleteTyre function
  const handleDeleteTyre = async (id: string): Promise<void> => {
    try {
      await deleteTyre(id);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error deleting tyre'));
      throw err;
    }
  };

  // Wrapper for addTyreInspection function
  const handleAddInspection = async (tyreId: string, inspection: TyreInspection): Promise<string> => {
    try {
      return await addTyreInspection(tyreId, inspection);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error adding inspection'));
      throw err;
    }
  };

  // Wrapper for getTyreInspections function
  const handleGetInspections = async (tyreId: string): Promise<TyreInspection[]> => {
    try {
      return await getTyreInspections(tyreId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error getting inspections'));
      throw err;
    }
  };

  // Wrapper for getTyresByVehicle function
  const handleGetTyresByVehicle = async (vehicleId: string): Promise<Tyre[]> => {
    try {
      return await getTyresByVehicle(vehicleId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error getting vehicle tyres'));
      throw err;
    }
  };

  // Function to filter tyres based on criteria
  const handleFilterTyres = async (filters: {
    status?: string;
    mountStatus?: string;
    brand?: string;
    location?: string;
    vehicleId?: string;
  }): Promise<Tyre[]> => {
    try {
      return await getTyres(filters);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error filtering tyres'));
      throw err;
    }
  };

  // Context value
  const value = {
    tyres,
    loading,
    error,
    saveTyre: handleSaveTyre,
    getTyreById: handleGetTyreById,
    deleteTyre: handleDeleteTyre,
    addInspection: handleAddInspection,
    getInspections: handleGetInspections,
    getTyresByVehicle: handleGetTyresByVehicle,
    filterTyres: handleFilterTyres
  };

  return (
    <TyreContext.Provider value={value}>
      {children}
    </TyreContext.Provider>
  );
};

// Custom hook to use the context
export function useTyres(): TyreContextType {
  const context = useContext(TyreContext);
  if (!context) {
    throw new Error('useTyres must be used within a TyreProvider');
  }
  return context;
}
