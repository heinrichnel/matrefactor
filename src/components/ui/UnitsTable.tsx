import { useWialonUnits } from "@/hooks/useWialonUnits";

export default function UnitsTable({ sdkReady }: { sdkReady: boolean }) {
  const { units, loading, error } = useWialonUnits(sdkReady);

  return (
    <div>
      {loading && <div>Loading units...</div>}
      {error && <div>{error}</div>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Position</th>
          </tr>
        </thead>
        <tbody>
          {units.map((u: any) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>
                {u.pos && typeof u.pos.x === "number" && typeof u.pos.y === "number"
                  ? `${u.pos.x}, ${u.pos.y}`
                  : "Unknown"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
