// src/components/DeliveryTracker.tsx
import { io } from "socket.io-client";
import Map from "@/components/Map"; // change to '../components/Map' if you don't set tsconfig paths
import { useEffect, useRef, useState } from "react";

type Props = {
  deliveryId: string;
  wsUrl?: string; // optional: pass in instead of using import.meta.env
};

export default function DeliveryTracker({ deliveryId, wsUrl }: Props) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const pathRef = useRef<google.maps.Polyline | null>(null);

  // Init marker + polyline when map is ready
  useEffect(() => {
    if (!map) return;
    (async () => {
      // Advanced Markers
      // @ts-ignore - types are under google.maps.marker namespace at runtime
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
      markerRef.current = new AdvancedMarkerElement({
        map,
        position: { lat: 0, lng: 0 },
        title: "Driver",
      });
      pathRef.current = new google.maps.Polyline({ map, path: [] });
    })();
    return () => {
      // AdvancedMarkerElement removal
      if (markerRef.current) {
        markerRef.current.map = null;
        markerRef.current = null;
      }
      pathRef.current?.setMap(null);
      pathRef.current = null;
    };
  }, [map]);

  // Socket connection
  useEffect(() => {
    if (!deliveryId) return;

    const url =
      wsUrl ??
      // fallbacks: use env only if your setup supports import.meta.env
      (typeof import.meta !== "undefined" &&
      (import.meta as any).env &&
      (import.meta as any).env.VITE_API_WS
        ? (import.meta as any).env.VITE_API_WS
        : "http://localhost:8080");

    const s = io(url, {
      auth: { token: localStorage.getItem("idToken") || undefined },
      transports: ["websocket"],
    });

    s.emit("join", { room: `delivery:${deliveryId}` });

    s.on("delivery:loc", ({ lat, lng }: { lat: number; lng: number }) => {
      if (markerRef.current) markerRef.current.position = { lat, lng };
      if (pathRef.current) {
        const path = pathRef.current.getPath();
        path.push(new google.maps.LatLng(lat, lng));
      }
      map?.panTo({ lat, lng });
    });

    s.on("delivery:status", (payload) => {
      // eslint-disable-next-line no-console
      console.log("Status:", payload);
    });

    // IMPORTANT: cleanup must return void
    return () => {
      s.disconnect();
    };
  }, [map, deliveryId, wsUrl]);

  return (
    <div className="h-[70vh]">
      <Map center={{ lat: -26.2041, lng: 28.0473 }} onReady={setMap} />
    </div>
  );
}
