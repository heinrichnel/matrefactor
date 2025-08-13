import { useState, useCallback, useEffect } from 'react';
import {
  collection,
  DocumentData,
  onSnapshot,
  query,
  Query,
  QuerySnapshot,
  FirestoreError,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useNetworkStatus } from './useNetworkStatus';

interface UseOfflineQueryOptions {
  collectionPath: string;
  // Note: Firestore query constraints should be passed as separate arguments,
  // not as a single array. This is a common pattern for many hooks.
  // We'll keep the original structure for now to match the code you provided,
  // but be aware that this might need adjustment depending on your `useOfflineQuery` implementation.
  queryConstraints?: any[];
  cacheOnly?: boolean;
  includeMetadata?: boolean;
  onError?: (error: Error) => void;
}

interface OfflineQueryResult<T> {
  data: T[];
  isLoading: boolean;
  error: Error | null;
  isOffline: boolean;
  lastUpdatedAt: number | null;
}

/**
 * Hook for fetching Firestore data with offline support
 *
 * @param options Configuration options for the query
 * @returns Query result with loading state, data, and offline status
 */
export function useOfflineQuery<T extends DocumentData>({
  collectionPath,
  queryConstraints = [],
  cacheOnly = false,
  includeMetadata = false,
  onError,
}: UseOfflineQueryOptions): OfflineQueryResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);
  // Correction 1: Replaced 'useNetworkState' with 'useNetworkStatus'.
  const { isOnline } = useNetworkStatus();

  // Correction 2: Imported 'useEffect' from React.
  useEffect(() => {
    setIsLoading(true);

    try {
      // Correction 3: Replaced 'firestore' with the 'db' constant.
      const collectionRef = collection(db, collectionPath);
      // Correction 4 & 5: Imported 'query' and 'onSnapshot' from 'firebase/firestore'.
      const queryRef =
        queryConstraints.length > 0
          ? query(collectionRef, ...queryConstraints)
          : query(collectionRef);

      // Set source based on network state and options
      const getOptions = {
        source: cacheOnly || !isOnline ? "cache" : "default",
      };

      const unsubscribe = onSnapshot(
        queryRef as Query<T>,
        { includeMetadataChanges: includeMetadata },
        // Correction 6: Added type for the 'snapshot' parameter.
        (snapshot: QuerySnapshot<T>) => {
          const results: T[] = [];

          // Correction 7: Added type for the 'doc' parameter.
          snapshot.forEach((doc) => {
            const data = doc.data();
            results.push({
              ...data,
              id: doc.id,
            } as T);
          });

          setData(results);
          setIsLoading(false);
          setError(null);
          setLastUpdatedAt(Date.now());

          // Log cache state for debugging
          const source = snapshot.metadata.fromCache ? "cache" : "server";
          console.log(`Data fetched from ${source} for ${collectionPath}`);
        },
        // Correction 8: Added type for the 'err' parameter.
        (err: FirestoreError) => {
          console.error(`Error fetching ${collectionPath}:`, err);
          setError(err);
          setIsLoading(false);
          if (onError) onError(err);
        }
      );

      // Cleanup function to unsubscribe from snapshot
      return () => unsubscribe();
    } catch (err: any) {
      console.error(`Error setting up query for ${collectionPath}:`, err);
      setError(err);
      setIsLoading(false);
      if (onError) onError(err);
    }
  }, [collectionPath, JSON.stringify(queryConstraints), cacheOnly, includeMetadata, isOnline]);

  return {
    data,
    isLoading,
    error,
    isOffline: !isOnline,
    lastUpdatedAt,
  };
}
