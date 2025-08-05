import React, { useEffect, useRef, useState } from "react";

// === JOU WIALON TOKEN EN URL ===
const WIALON_DIRECT_URL =
  "https://hosting.wialon.com/?token=c1099bc37c906fd0832d8e783b60ae0dD9D1A721B294486AC08F8AA3ACAC2D2FD45FF053&lang=en";

// === FUNKSIE OM DIREK IN WIALON TE OPEN ===
function openWialonDashboard() {
  window.open(WIALON_DIRECT_URL, "_blank", "width=1200,height=800");
}

// === HOOF KOMPONENT ===
const WialonMapDashboard: React.FC = () => {
  // Jou ander state/effects soos voorheen...
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Jy kan jou kaart/effects ens hierby voeg soos gewoonlik

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Title row */}
      <div className="flex justify-between items-center border-b p-4">
        <h1 className="text-xl font-bold">Wialon Map Dashboard</h1>
        {/* Die Wialon Dashboard knoppie */}
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ml-4"
          onClick={openWialonDashboard}
        >
          Open Wialon Dashboard
        </button>
      </div>

      {/* Ander dashboard inhoud */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-1/4 p-4 border-r">
          <p>Hier kom jou units, opsies, ens.</p>
        </div>
        {/* Map area */}
        <div ref={mapRef} className="flex-1 h-[calc(100vh-150px)]" />
      </div>
    </div>
  );
};

export default WialonMapDashboard;
