import { useCallback, useEffect, useState } from "react";

const WIALON_HOST =
  "https://hosting.wialon.com/?token=c1099bc37c906fd0832d8e783b60ae0dD9D1A721B294486AC08F8AA3ACAC2D2FD45FF053&lang=en";
const WIALON_TOKEN = "c1099bc37c906fd0832d8e783b60ae0d462BADEC45A6E5503B1BEADDE71E232800E9C406"; // Replace with yours

export interface WialonUnit {
  id: number;
  name: string;
  pos?: { x: number; y: number };
}

export function useWialonUnits() {
  const [units, setUnits] = useState<WialonUnit[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Utility to print errors for debugging
  const log = useCallback((msg: string) => {
    // eslint-disable-next-line no-console
    console.log("[Wialon]", msg);
  }, []);

  // Login and fetch units
  const loginAndFetchUnits = useCallback(() => {
    setLoading(true);
    setError(null);

    // @ts-ignore - Wialon SDK loads globally
    const sess = window.wialon?.core?.Session.getInstance();

    if (!sess) {
      setError("Wialon SDK not loaded");
      setLoading(false);
      return;
    }

    sess.initSession(WIALON_HOST);
    sess.loginToken(WIALON_TOKEN, "", function (code: number) {
      if (code) {
        setError(window.wialon.core.Errors.getErrorText(code));
        setLoading(false);
        return;
      }
      setLoggedIn(true);
      log("Logged in to Wialon!");

      // Flags: base data + last message
      const flags =
        window.wialon.item.Item.dataFlag.base | window.wialon.item.Unit.dataFlag.lastMessage;

      sess.loadLibrary("itemIcon");
      sess.updateDataFlags(
        [{ type: "type", data: "avl_unit", flags, mode: 0 }],
        function (code2: number) {
          if (code2) {
            setError(window.wialon.core.Errors.getErrorText(code2));
            setLoading(false);
            return;
          }
          const sdkUnits = sess.getItems("avl_unit") || [];
          const parsed: WialonUnit[] = sdkUnits.map((u: any) => ({
            id: u.getId(),
            name: u.getName(),
            pos: u.getPosition ? u.getPosition() : undefined,
          }));
          setUnits(parsed);
          setLoading(false);
        }
      );
    });
  }, [log]);

  // Optionally auto-login on mount
  useEffect(() => {
    if (!loggedIn) {
      loginAndFetchUnits();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { units, loggedIn, loading, error, refresh: loginAndFetchUnits };
}
