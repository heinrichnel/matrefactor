import { useEffect, useState } from "react";

interface NetworkStatus {
  isOnline: boolean;
  lastChanged: Date | null;
  connectionType: string | null;
  effectiveType: string | null;
}

/**
 * Hook to monitor network connectivity status
 * Used throughout the app to enable offline-first functionality
 * @returns NetworkStatus object containing connection information
 */
export const useNetworkStatus = (): NetworkStatus => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    lastChanged: null,
    connectionType: null,
    effectiveType: null,
  });

  useEffect(() => {
    // Network information API events (if available)
    const updateConnectionType = () => {
      if ("connection" in navigator && navigator.connection) {
        const connection = navigator.connection as any;
        setNetworkStatus((prev) => ({
          ...prev,
          connectionType: connection.type || null,
          effectiveType: connection.effectiveType || null,
        }));
      }
    };

    // Initial setup
    updateConnectionType();

    // Online/offline event listeners
    const handleOnline = () => {
      setNetworkStatus((prev) => ({
        ...prev,
        isOnline: true,
        lastChanged: new Date(),
      }));
    };

    const handleOffline = () => {
      setNetworkStatus((prev) => ({
        ...prev,
        isOnline: false,
        lastChanged: new Date(),
      }));
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Network Information API might not be available in all browsers
    if ("connection" in navigator && navigator.connection) {
      (navigator.connection as any).addEventListener("change", updateConnectionType);
    }

    // Cleanup
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);

      if ("connection" in navigator && navigator.connection) {
        (navigator.connection as any).removeEventListener("change", updateConnectionType);
      }
    };
  }, []);

  return networkStatus;
};

export default useNetworkStatus;
