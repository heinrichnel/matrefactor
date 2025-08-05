import { useEffect, useState } from "react";
import { getEnvVar } from "../utils/envUtils";

export interface WialonUnitData {
  id: number;
  name: string;
  pos?: { x: number; y: number; s: number; t: number };
}

const WIALON_API_URL = getEnvVar(
  "VITE_WIALON_API_URL",
  "https://hosting.wialon.com/?token=c1099bc37c906fd0832d8e783b60ae0dD9D1A721B294486AC08F8AA3ACAC2D2FD45FF053&lang=en"
);
const TOKEN = getEnvVar("VITE_WIALON_SESSION_TOKEN", "");

export function useWialonUnits(sdkReady: boolean = true) {
  const [units, setUnits] = useState<WialonUnitData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sdkReady) return;

    setLoading(true);
    setError(null);

    // @ts-ignore
    const sess = window.wialon?.core?.Session.getInstance();
    if (!sess) {
      setError("Wialon SDK not loaded");
      setLoading(false);
      return;
    }

    function fetchUnits() {
      const flags =
        window.wialon.item.Item.dataFlag.base | window.wialon.item.Unit.dataFlag.lastMessage;

      sess.loadLibrary("itemIcon");
      sess.updateDataFlags(
        [{ type: "type", data: "avl_unit", flags, mode: 0 }],
        (code2: number) => {
          if (code2) {
            setError(window.wialon.core.Errors.getErrorText(code2));
            setLoading(false);
            return;
          }
          const arr = sess.getItems("avl_unit") as any[];
          setUnits(
            (arr || []).map((u) => ({
              id: u.getId(),
              name: u.getName(),
              pos: u.getPosition ? u.getPosition() : undefined,
            }))
          );
          setLoading(false);
        }
      );
    }

    if (!sess.getCurrUser?.()) {
      sess.initSession(WIALON_API_URL);
      sess.loginToken(TOKEN, "", (code: number) => {
        if (code) {
          setError(window.wialon.core.Errors.getErrorText(code));
          setLoading(false);
          return;
        }
        fetchUnits();
      });
    } else {
      fetchUnits();
    }
  }, [sdkReady]);

  return { units, loading, error };
}
