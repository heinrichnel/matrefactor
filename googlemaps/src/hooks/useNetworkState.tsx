// src/hooks/useNetworkState.tsx
import { useState, useEffect } from "react";

export interface NetworkState {
  isOnline: boolean;
}

/**
 * Hook to track online/offline status
 */
export function useNetworkState(): NetworkState {
  const initial =
    typeof navigator !== "undefined" && "onLine" in navigator
      ? navigator.onLine
      : true;

  const [isOnline, setIsOnline] = useState<boolean>(initial);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    if (typeof window !== "undefined") {
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      }
    };
  }, []);

  return { isOnline };
}

export default useNetworkState;
