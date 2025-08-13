// src/pages/Properties.tsx (essentials only)
import Map from "@/components/Map";
import { useEffect, useState } from "react";
import axios from "axios";

type Property = { id: string; title: string; price: number; lat: number; lng: number };
export default function PropertiesPage() {
  const [items, setItems] = useState<Property[]>([]);
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    axios.get("/api/properties").then((r) => setItems(r.data));
  }, []);

  const onMapReady = (m: google.maps.Map) => {
    setMap(m);
  };

  useEffect(() => {
    if (!map) return;
    const markers: google.maps.marker.AdvancedMarkerElement[] = [];
    (async () => {
      //@ts-ignore
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
      items.forEach((p) => {
        const marker = new AdvancedMarkerElement({
          map,
          position: { lat: p.lat, lng: p.lng },
          title: p.title,
        });
        marker.addListener("gmp-click", () => {
          /* open sidebar/details */
        });
        markers.push(marker);
      });
    })();
    return () => markers.forEach((m) => (m.map = null));
  }, [map, items]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-8rem)] p-4">
      <div className="rounded-2xl border p-4 overflow-y-auto">{/* filters & results list */}</div>
      <div className="rounded-2xl border overflow-hidden">
        <Map center={{ lat: -26.2041, lng: 28.0473 }} onReady={onMapReady} />
      </div>
    </div>
  );
}
