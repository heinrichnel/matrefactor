// src/utils/wialonAuth.ts
import { WIALON_SDK_URL, WIALON_API_URL } from './wialonConfig';

declare global {
  interface Window {
    wialon: any; // Properly type if you have Wialon types
  }
}

/**
 * Load the Wialon SDK script if not already loaded
 */
export function loadWialonSDK(): Promise<void> {
  return new Promise((resolve, reject) => {
    // If already loaded, resolve immediately
    if (window.wialon) {
      resolve();
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="wialon.js"]');
    if (existingScript) {
      console.log("✅ Wialon SDK script already exists in DOM");
      resolve();
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = WIALON_SDK_URL;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log("✅ Wialon SDK loaded successfully");
      resolve();
    };
    
    script.onerror = () => {
      const error = "Failed to load Wialon SDK script";
      console.error(error);
      reject(new Error(error));
    };

    document.head.appendChild(script);
    console.log("🚚 Loading Wialon SDK...");
  });
}

/**
 * Login to Wialon with a token
 * @param token Wialon token
 * @returns Promise resolving to a success message
 */
export async function loginWialon(token: string): Promise<string> {
  // Ensure SDK is loaded
  await loadWialonSDK();
  
  return new Promise((resolve, reject) => {
    const sess = window.wialon.core.Session.getInstance();
    const user = sess.getCurrUser();
    if (user) {
      resolve(`Already logged in as ${user.getName()}`);
      return;
    }
    sess.initSession(WIALON_API_URL);
    sess.loginToken(token, "", (code: number) => {
      if (code) reject(window.wialon.core.Errors.getErrorText(code));
      else resolve("Logged in successfully");
    });
  });
}

/**
 * Logout from Wialon
 * @returns Promise resolving to a success message
 */
export function logoutWialon(): Promise<string> {
  return new Promise((resolve, reject) => {
    const sess = window.wialon.core.Session.getInstance();
    const user = sess.getCurrUser();
    if (!user) {
      resolve("Not logged in.");
      return;
    }
    sess.logout((code: number) => {
      if (code) reject(window.wialon.core.Errors.getErrorText(code));
      else resolve("Logout successful");
    });
  });
}

/**
 * Get the current Wialon user
 * @returns User name or null if not logged in
 */
export function getCurrentWialonUser(): string | null {
  const sess = window.wialon.core.Session.getInstance();
  const user = sess.getCurrUser();
  return user ? user.getName() : null;
}

/**
 * Get Wialon units with their positions
 * @returns Promise resolving to array of units with positions
 */
export async function getWialonUnits(): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const sess = window.wialon.core.Session.getInstance();
    if (!sess) {
      reject(new Error('Wialon session not initialized'));
      return;
    }
    
    const flags = window.wialon.item.Item.dataFlag.base | window.wialon.item.Unit.dataFlag.lastMessage;
    
    sess.updateDataFlags(
      [{ type: 'type', data: 'avl_unit', flags, mode: 0 }],
      (err: any) => {
        if (err) {
          console.error('Wialon flags load error', err);
          reject(new Error(`Wialon flags load error: ${err}`));
          return;
        }
        
        const units = sess.getItems('avl_unit') || [];
        resolve(units);
      }
    );
  });
}

/**
 * Get unit address from coordinates
 * @param lon Longitude
 * @param lat Latitude
 * @returns Promise resolving to address string
 */
export async function getUnitAddress(lon: number, lat: number): Promise<string> {
  return new Promise((resolve, reject) => {
    window.wialon.util.Gis.getLocations([{ lon, lat }], (code: number, address: string) => {
      if (code) reject(window.wialon.core.Errors.getErrorText(code));
      else resolve(address);
    });
  });
}