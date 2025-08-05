import { useEffect, useState } from "react";
import type { WialonSession, WialonUnit, WialonDriver, WialonGeofence } from "../types/wialon";

export function useWialonGeofences(session: any, resourceId: number | null) {
  const [geofences, setGeofences] = useState<WialonGeofence[]>([]);
  useEffect(() => {
    if (!session || !resourceId) { setGeofences([]); return; }
    const res = session.getItem(resourceId);
    if (!res) return;
    const all = res.getZones();
    setGeofences(Object.values(all || {}));
  }, [session, resourceId]);
  return geofences;
}
