// src/components/RoutePlanner.tsx (skeleton)
import Map from "@/components/Map";
import { useEffect, useState } from "react";

export default function RoutePlanner() {
  const [map, setMap] = useState<google.maps.Map>();
  useEffect(() => {
    if (!map) return;
    (async () => {
      const ds = new google.maps.DirectionsService();
      const dr = new google.maps.DirectionsRenderer({ map });
      const req: google.maps.DirectionsRequest = {
        origin: { lat: -26.2041, lng: 28.0473 },
        destination: { lat: -25.7479, lng: 28.2293 },
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true,
        waypoints: [
          { location: { lat: -26.14, lng: 27.99 } },
          { location: { lat: -26.3, lng: 28.05 } },
        ],
      };
      const res = await ds.route(req);
      dr.setDirections(res);
    })();
  }, [map]);
  return (
    <div className="h-[70vh]">
      <Map center={{ lat: -26.2041, lng: 28.0473 }} onReady={setMap} />
    </div>
  );
}
