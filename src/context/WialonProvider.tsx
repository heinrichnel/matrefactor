import React, { createContext, useContext, useEffect, useState } from "react";
import { getUnits, initializeWialon } from "../api/wialon";
import { getEnvVar } from "../utils/envUtils";

// Define Wialon context type
interface WialonContextType {
  session: any;
  loggedIn: boolean;
  initializing: boolean;
  initialized: boolean;
  units: any[];
  error: Error | null;
  login: () => void;
  logout: () => void;
  refreshUnits: () => Promise<any[]>;
}

export const WialonContext = createContext<WialonContextType>({
  session: null,
  loggedIn: false,
  initializing: false,
  initialized: false,
  units: [],
  error: null,
  login: () => {},
  logout: () => {},
  refreshUnits: async () => [],
});

export const WialonProvider = ({ children }: { children: React.ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [initializing, setInitializing] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [units, setUnits] = useState<any[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const TOKEN = getEnvVar("VITE_WIALON_SESSION_TOKEN", "");

  // Auto-initialize Wialon when component mounts
  useEffect(() => {
    let mounted = true;

    const initWialon = async () => {
      if (!window.wialon) {
        console.log("Wialon SDK not available yet, waiting...");
        // If SDK not loaded, wait and check again
        setTimeout(initWialon, 1000);
        return;
      }

      setInitializing(true);

      try {
        // Get session instance
        const sess = window.wialon.core.Session.getInstance();
        if (mounted) setSession(sess);

        // Initialize Wialon using our auto-init function
        const success = await initializeWialon();

        if (mounted) {
          setInitialized(success);
          setLoggedIn(success);

          if (success) {
            // Load units automatically
            const unitsList = await getUnits();
            setUnits(unitsList);
            console.log(`Wialon auto-initialized with ${unitsList.length} units`);
          }
        }
      } catch (err) {
        console.error("Error during Wialon auto-initialization:", err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (mounted) setInitializing(false);
      }
    };

    // Start initialization immediately
    initWialon();

    return () => {
      mounted = false;
    };
  }, []);

  const refreshUnits = async () => {
    try {
      const unitsList = await getUnits();
      setUnits(unitsList);
      return unitsList;
    } catch (err) {
      console.error("Error refreshing units:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return [];
    }
  };

  const login = async () => {
    if (!session) return;

    try {
      setInitializing(true);
      session.initSession(
        "https://hosting.wialon.com/?token=c1099bc37c906fd0832d8e783b60ae0dD9D1A721B294486AC08F8AA3ACAC2D2FD45FF053&lang=en"
      );
      session.loginToken(TOKEN, "", async (code: number) => {
        const success = code === 0;
        setLoggedIn(success);

        if (success) {
          setInitialized(true);
          await refreshUnits();
        }
        setInitializing(false);
      });
    } catch (err) {
      console.error("Error during login:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setInitializing(false);
    }
  };

  const logout = () => {
    if (session) {
      session.logout(() => {
        setLoggedIn(false);
        setInitialized(false);
        setUnits([]);
      });
    }
  };

  return (
    <WialonContext.Provider
      value={{
        session,
        loggedIn,
        initializing,
        initialized,
        units,
        error,
        login,
        logout,
        refreshUnits,
      }}
    >
      {children}
    </WialonContext.Provider>
  );
};

export const useWialon = () => useContext(WialonContext);
