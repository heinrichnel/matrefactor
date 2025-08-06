import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  saveTyre,
  getTyres,
  getTyreById,
  deleteTyre,
  addTyreInspection,
  getTyreInspections,
  getTyresByVehicle,
  listenToTyres,
} from '../firebase';
import type {
  Tyre,
  TyreInspection,
  TyreRotation,
} from '../types/tyre';

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
    status?: Tyre['status'];
    mountStatus?: Tyre['mountStatus'];
    brand?: string;
    location?: Tyre['location'];
    vehicleId?: string;
    condition?: TyreInspection['condition'];
    minTreadDepth?: number;
    maxTreadDepth?: number;
  }) => Promise<Tyre[]>;
}

const TyreContext = createContext<TyreContextType | undefined>(undefined);

export const TyreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tyres, setTyres] = useState<Tyre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = listenToTyres((updatedTyres: Tyre[]) => {
      const mapped = updatedTyres.map((tyre, index) => ({
        ...tyre,
        maintenanceHistory: {
          ...tyre.maintenanceHistory,
          rotations: tyre.maintenanceHistory?.rotations?.map((r, i) => ({
            ...r,
            id: r.id ?? `rotation-${index}-${i}`,
          })) || [],
        },
      }));
      setTyres(mapped);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSaveTyre = async (tyre: Tyre): Promise<string> => {
    try {
      return await saveTyre(tyre);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error saving tyre'));
      throw err;
    }
  };

  const handleGetTyreById = async (id: string): Promise<Tyre | null> => {
    try {
      const result = await getTyreById(id);
      if (!result) return null;
      return {
        ...result,
        maintenanceHistory: {
          ...result.maintenanceHistory,
          rotations: result.maintenanceHistory?.rotations?.map((r, i) => ({
            ...r,
            id: r.id ?? `rotation-${i}`,
          })) || [],
        },
      };
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error getting tyre'));
      throw err;
    }
  };

  const handleDeleteTyre = async (id: string): Promise<void> => {
    try {
      await deleteTyre(id);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error deleting tyre'));
      throw err;
    }
  };

  const handleAddInspection = async (
    tyreId: string,
    inspection: TyreInspection
  ): Promise<string> => {
    try {
      return await addTyreInspection(tyreId, inspection);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error adding inspection'));
      throw err;
    }
  };

  const handleGetInspections = async (tyreId: string): Promise<TyreInspection[]> => {
    try {
      const records = await getTyreInspections(tyreId);
      return records.map((r, i) => ({
        ...r,
        id: r.id ?? `inspection-${i}`,
        condition: r.condition,
        date: r.date,
        inspector: r.inspector,
        pressure: r.pressure,
        treadDepth: r.treadDepth,
        temperature: r.temperature,
        notes: r.notes,
      }));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error getting inspections'));
      throw err;
    }
  };

  const handleGetTyresByVehicle = async (vehicleId: string): Promise<Tyre[]> => {
    try {
      const result = await getTyresByVehicle(vehicleId);
      return result.map((tyre, index) => ({
        ...tyre,
        maintenanceHistory: {
          ...tyre.maintenanceHistory,
          rotations: tyre.maintenanceHistory?.rotations?.map((r, i) => ({
            ...r,
            id: r.id ?? `rotation-${index}-${i}`,
          })) || [],
        },
      }));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error getting vehicle tyres'));
      throw err;
    }
  };

  const handleFilterTyres = async (filters: {
    status?: Tyre['status'];
    mountStatus?: Tyre['mountStatus'];
    brand?: string;
    location?: Tyre['location'];
    vehicleId?: string;
    condition?: TyreInspection['condition'];
    minTreadDepth?: number;
    maxTreadDepth?: number;
  }): Promise<Tyre[]> => {
    try {
      const tyres = await getTyres(filters);
      return tyres.map((tyre, index) => ({
        ...tyre,
        maintenanceHistory: {
          ...tyre.maintenanceHistory,
          rotations: tyre.maintenanceHistory?.rotations?.map((r, i) => ({
            ...r,
            id: r.id ?? `rotation-${index}-${i}`,
          })) || [],
        },
      }));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error filtering tyres'));
      throw err;
    }
  };

  const value: TyreContextType = {
    tyres,
    loading,
    error,
    saveTyre: handleSaveTyre,
    getTyreById: handleGetTyreById,
    deleteTyre: handleDeleteTyre,
    addInspection: handleAddInspection,
    getInspections: handleGetInspections,
    getTyresByVehicle: handleGetTyresByVehicle,
    filterTyres: handleFilterTyres,
  };

  return <TyreContext.Provider value={value}>{children}</TyreContext.Provider>;
};

export function useTyres(): TyreContextType {
  const context = useContext(TyreContext);
  if (!context) {
    throw new Error('useTyres must be used within a TyreProvider');
  }
  return context;
}
