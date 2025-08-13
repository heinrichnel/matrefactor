import { db } from "@/lib/firebase";
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { useNetworkStatus } from "./useNetworkStatus";
import { useOfflineQueue } from "./useOfflineQueue";

type OfflineFormOptions = {
  collectionPath: string;
  showOfflineWarning?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
};

type OfflineFormReturn = {
  submit: (data: any, id?: string) => Promise<string | undefined>;
  remove: (id: string) => Promise<boolean>;
  isSubmitting: boolean;
  isOfflineOperation: boolean;
};

/**
 * Hook for handling form submissions with offline support
 *
 * @param options Configuration options
 * @returns Form submission handlers and status
 */
export const useOfflineForm = (options: OfflineFormOptions): OfflineFormReturn => {
  const { collectionPath, showOfflineWarning = true, onSuccess, onError } = options;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { isOnline } = useNetworkStatus();
  const { addToQueue } = useOfflineQueue();

  const isOfflineOperation = !isOnline;

  const submit = useCallback(
    async (data: any, id?: string): Promise<string | undefined> => {
      setIsSubmitting(true);
      try {
        const timestamp = new Date();
        const dataWithTimestamp = {
          ...data,
          updatedAt: timestamp,
          ...(id ? {} : { createdAt: timestamp }),
        };

        if (isOnline) {
          // Online operation - direct to Firestore
          if (id) {
            // Update
            const docRef = doc(db, collectionPath, id);
            await updateDoc(docRef, dataWithTimestamp);
            onSuccess?.({ id, ...dataWithTimestamp });
            return id;
          } else {
            // Create
            const docRef = await addDoc(collection(db, collectionPath), dataWithTimestamp);
            onSuccess?.({ id: docRef.id, ...dataWithTimestamp });
            return docRef.id;
          }
        } else {
          // Offline operation - queue for later
          if (showOfflineWarning) {
            console.warn(
              `Operating offline: ${id ? "updating" : "creating"} document in ${collectionPath}`
            );
          }

          const operationType = id ? "update" : "create";
          const documentId = id || `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

          addToQueue({
            id: documentId,
            operation: operationType,
            collectionPath: collectionPath,
            data: dataWithTimestamp,
          });

          onSuccess?.({ id: documentId, ...dataWithTimestamp });
          return documentId;
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        console.error("Form submission error:", err);
        onError?.(err);
        return undefined;
      } finally {
        setIsSubmitting(false);
      }
    },
    [collectionPath, isOnline, onError, onSuccess, addToQueue, showOfflineWarning]
  );

  const remove = useCallback(
    async (id: string): Promise<boolean> => {
      setIsSubmitting(true);
      try {
        if (isOnline) {
          // Online operation - direct to Firestore
          const docRef = doc(db, collectionPath, id);
          await deleteDoc(docRef);
          onSuccess?.({ id, deleted: true });
        } else {
          // Offline operation - queue for later
          if (showOfflineWarning) {
            console.warn(`Operating offline: deleting document ${id} in ${collectionPath}`);
          }

          addToQueue({
            id,
            operation: "delete",
            collectionPath: collectionPath,
            data: null,
          });

          onSuccess?.({ id, deleted: true, offlineQueued: true });
        }
        return true;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        console.error("Document deletion error:", err);
        onError?.(err);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [collectionPath, isOnline, onError, onSuccess, addToQueue, showOfflineWarning]
  );

  return {
    submit,
    remove,
    isSubmitting,
    isOfflineOperation,
  };
};
