import { useEffect, useState } from "react";
import type { WialonSession, WialonUnit, WialonDriver, WialonGeofence } from "../types/wialon";
import type { WialonResource } from "../types/wialon";

export function useWialonResources(session: any, loggedIn: boolean) {
  const [resources, setResources] = useState<WialonResource[]>([]);
  useEffect(() => {
    if (!loggedIn || !session) return;
    const flags =
      window.wialon.item.Item.dataFlag.base |
      window.wialon.item.Resource.dataFlag.zones;
    session.loadLibrary("resourceZones");
    session.updateDataFlags(
      [{ type: "type", data: "avl_resource", flags, mode: 0 }],
      (code: number) => {
        if (code) return;
        const ress = session.getItems("avl_resource") as any[];
        setResources((ress || []).map((r) => ({ id: r.getId(), name: r.getName() })));
      }
    );
  }, [session, loggedIn]);
  return resources;
}
