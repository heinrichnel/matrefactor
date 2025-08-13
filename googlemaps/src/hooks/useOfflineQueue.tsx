import { useState, useEffect, useCallback } from "react";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useNetworkStatus } from "./useNetworkStatus";

interface QueueItem {
  id: string;
  operation: "create" | "update" | "delete";
  collectionPath: string;
  data?: any;
  timestamp: number;
}

interface UseOfflineQueueOptions {
  persistenceKey?: string;
  processOnNetworkRestore?: boolean;
  onSuccess?: (operation: string, itemId: string) => void;
  onError?: (error: Error, operation: string, itemId: string) => void;
}

export function useOfflineQueue(options: UseOfflineQueueOptions = {}) {
  const {
    persistenceKey = "offline_operations_queue",
    processOnNetworkRestore = true,
    onSuccess,
    onError,
  } = options;

  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { isOnline } = useNetworkStatus();

  // Load queue from storage on initialization
  useEffect(() => {
    try {
      const storedQueue = localStorage.getItem(persistenceKey);
      if (storedQueue) {
        setQueue(JSON.parse(storedQueue));
      }
    } catch (error) {
      console.error("Failed to load offline queue from storage:", error);
    }
  }, [persistenceKey]);

  // Save queue to storage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(persistenceKey, JSON.stringify(queue));
    } catch (error) {
      console.error("Failed to save offline queue to storage:", error);
    }
  }, [queue, persistenceKey]);

  // Process queue when network is restored
  useEffect(() => {
    if (isOnline && queue.length > 0 && processOnNetworkRestore && !isProcessing) {
      processQueue();
    }
  }, [isOnline, queue.length, processOnNetworkRestore, isProcessing]);

  const addToQueue = useCallback((item: Omit<QueueItem, "timestamp">) => {
    setQueue((prevQueue) => [...prevQueue, { ...item, timestamp: Date.now() }]);
  }, []);

  const processQueue = useCallback(async () => {
    if (!isOnline || queue.length === 0 || isProcessing) return;

    setIsProcessing(true);

    try {
      const newQueue = [...queue];

      for (let i = 0; i < newQueue.length; i++) {
        const item = newQueue[i];

        // Correction: Added a check to ensure 'item' is not undefined
        // before attempting to access its properties.
        if (!item) {
          continue;
        }

        try {
          const docRef = doc(db, item.collectionPath, item.id);

          if (item.operation === "delete") {
            await deleteDoc(docRef);
          } else {
            // create or update
            await setDoc(docRef, item.data, { merge: item.operation === "update" });
          }

          // Remove processed item from queue
          newQueue.splice(i, 1);
          i--; // Adjust index after removal

          onSuccess?.(item.operation, item.id);
        } catch (error) {
          console.error(`Failed to process offline operation for ${item.id}:`, error);
          onError?.(error as Error, item.operation, item.id);

          // If we're offline again, stop processing
          if (!navigator.onLine) {
            break;
          }
        }
      }

      setQueue(newQueue);
    } finally {
      setIsProcessing(false);
    }
  }, [isOnline, queue, isProcessing, onSuccess, onError]);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  return {
    queue,
    queueSize: queue.length,
    isProcessing,
    addToQueue,
    processQueue,
    clearQueue,
  };
}
