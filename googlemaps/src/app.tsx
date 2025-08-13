// src/app.tsx
import { APIProvider } from "@vis.gl/react-google-maps";
import { useMemo, useState } from "react";

// Pages that already exist and compile
import Planner from "@/pages/Planner";
import Properties from "@/pages/Properties";

// If/when OwnerPortal has a default export, uncomment this import
// import OwnerPortal from "@/pages/OwnerPortal";

type TabKey = "home" | "properties" | "planner" | "owner";

function Home() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-2">Maps Super App</h1>
      <p className="text-gray-600">
        Property listings, real‑time delivery tracking, and a multi‑stop route planner — all on
        Google Maps Platform.
      </p>
      <ul className="mt-4 list-disc list-inside text-gray-700 space-y-1">
        <li>
          Use <span className="font-mono">VITE_GMAPS_KEY</span> for the browser key
        </li>
        <li>
          Try the <strong>Properties</strong> and <strong>Planner</strong> tabs
        </li>
        <li>
          Add an export to <span className="font-mono">src/pages/OwnerPortal.tsx</span> to enable
          the Owner tab
        </li>
      </ul>
    </div>
  );
}

function NavTabs({
  active,
  onChange,
  ownerEnabled,
}: {
  active: TabKey;
  onChange: (k: TabKey) => void;
  ownerEnabled: boolean;
}) {
  const base = "px-3 py-2 rounded-xl text-sm font-medium transition-colors";
  const activeCls = "bg-gray-900 text-white";
  const inactiveCls = "text-gray-700 hover:bg-gray-100";

  return (
    <header className="sticky top-0 z-10 border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between">
        <button className="font-semibold" onClick={() => onChange("home")}>
          Maps Super App
        </button>
        <nav className="flex items-center gap-2">
          <button
            className={`${base} ${active === "properties" ? activeCls : inactiveCls}`}
            onClick={() => onChange("properties")}
          >
            Properties
          </button>
          <button
            className={`${base} ${active === "planner" ? activeCls : inactiveCls}`}
            onClick={() => onChange("planner")}
          >
            Planner
          </button>
          <button
            className={`${base} ${
              active === "owner" ? activeCls : ownerEnabled ? inactiveCls : "text-gray-400"
            }`}
            onClick={() => ownerEnabled && onChange("owner")}
            title={
              ownerEnabled ? "Owner Portal" : "Add a default export in OwnerPortal.tsx to enable"
            }
          >
            Owner Portal
          </button>
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  const apiKey = import.meta.env.VITE_GMAPS_KEY as string | undefined;
  const [tab, setTab] = useState<TabKey>("home");

  // Detect whether OwnerPortal can be imported without breaking build
  const ownerEnabled = useMemo(() => {
    try {
      // NOTE: This only checks presence at runtime; TypeScript still needs the import to type‑check.
      // We purposefully avoid importing to keep the module error away until you add the export.
      return false; // flip to true once OwnerPortal is exporting default
    } catch {
      return false;
    }
  }, []);

  if (!apiKey) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <div className="max-w-lg text-center">
          <h1 className="text-2xl font-semibold mb-2">Google Maps key missing</h1>
          <p className="text-gray-600">
            Set <code className="px-1 py-0.5 rounded bg-gray-100">VITE_GMAPS_KEY</code> in your{" "}
            <code className="px-1 py-0.5 rounded bg-gray-100">.env</code> file.
          </p>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey} onLoad={() => console.log("Google Maps API loaded")}>
      <div className="min-h-screen flex flex-col">
        <NavTabs active={tab} onChange={setTab} ownerEnabled={ownerEnabled} />

        <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6">
          {tab === "home" && <Home />}
          {tab === "properties" && <Properties />}
          {tab === "planner" && <Planner />}

          {/* When OwnerPortal has a default export, import it at the top and enable this: */}
          {/* {tab === "owner" && <OwnerPortal />} */}
          {tab === "owner" && !ownerEnabled && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">Owner Portal</h2>
              <p className="text-gray-600">
                Add a default export to <code>src/pages/OwnerPortal.tsx</code> to enable this tab.
              </p>
            </div>
          )}
        </main>
      </div>
    </APIProvider>
  );
}
