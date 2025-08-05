import React from "react";
import type { WialonSession, WialonUnit, WialonDriver, WialonGeofence } from "../types/wialon";
import { useWialonSdk } from "../hooks/useWialonSdk";
import { useWialonUnits } from "../hooks/useWialonUnits";

export const WialonUnitList: React.FC = () => {
  const sdkReady = useWialonSdk();
  const { units, loading, error } = useWialonUnits(sdkReady);

  if (!sdkReady) return <div>Loading Wialon SDK…</div>;
  if (loading) return <div>Loading units…</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div>
      <h2>Wialon Units</h2>
      <ul>
        {units.map((u) => (
          <li key={u.id}>
            {u.name}
            {u.pos && (
              <>
                {" — "}
                X: {u.pos.x}, Y: {u.pos.y}, Speed: {u.pos.s}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
