import React, { useState } from "react";
import { useWialonSdk } from "../hooks/useWialonSdk";
import { useWialonSession } from "../hooks/useWialonSession";
import { useWialonResources } from "../hooks/useWialonResources";
import { useWialonDrivers } from "../hooks/useWialonDrivers";

export const WialonDriverManager: React.FC = () => {
  const sdkReady = useWialonSdk();
  const { loggedIn, error, session } = useWialonSession(sdkReady);
  const resources = useWialonResources(session, loggedIn);
  const [selectedRes, setSelectedRes] = useState<number | null>(null);
  const drivers = useWialonDrivers(session, selectedRes);

  // Basic driver form state
  const [form, setForm] = useState({ id: "", n: "", ds: "", p: "" });
  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  // CRUD ops (Create/Update/Delete)
  const handleCreate = () => {
    if (!selectedRes || !session) return;
    const res = session.getItem(selectedRes);
    res.createDriver(
      {
        itemId: selectedRes,
        id: 0,
        callMode: "create",
        c: "",
        ck: 0,
        ds: form.ds,
        n: form.n,
        p: form.p,
        r: 1,
        f: 0,
        jp: {},
      },
      (code: number, data: any) => {
        alert(
          code
            ? `Driver create error: ${window.wialon.core.Errors.getErrorText(code)}`
            : `Driver "${data.n}" created!`
        );
      }
    );
  };

  return (
    <div>
      <h2>Driver Manager</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <label>Resource:{" "}
        <select
          value={selectedRes ?? ""}
          onChange={(e) => setSelectedRes(Number(e.target.value))}
        >
          <option value="">-- select resource --</option>
          {resources.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </label>
      <h3>Drivers</h3>
      <ul>
        {drivers.map((d) => (
          <li key={d.id}>
            {d.n} {d.ds} {d.p}
          </li>
        ))}
      </ul>
      <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
        <input name="n" placeholder="Name" value={form.n} onChange={handleChange} />
        <input name="ds" placeholder="Description" value={form.ds} onChange={handleChange} />
        <input name="p" placeholder="Phone" value={form.p} onChange={handleChange} />
        <button type="submit" onClick={onClick}>Create Driver</button>
      </form>
    </div>
  );
};
// This component manages Wialon drivers, allowing selection of a resource and CRUD operations on drivers.