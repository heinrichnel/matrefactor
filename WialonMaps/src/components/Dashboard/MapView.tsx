import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { WialonUnit } from "../../types/wialon";

interface MapViewProps {
  units?: WialonUnit[];
  onUnitSelect?: (unit: WialonUnit) => void;
}

export const MapView = ({ units = [], onUnitSelect }: MapViewProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  useEffect(() => {
    // Initialize map
    mapRef.current = L.map("map").setView([0, 0], 2);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !units.length) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => {
      mapRef.current?.removeLayer(marker);
    });
    markersRef.current = {};

    // Add new markers
    units.forEach((unit) => {
      if (!unit.position) return;

      const icon = getStatusIcon(unit.status);
      const marker = L.marker([unit.position.lat, unit.position.lng], { icon })
        .addTo(mapRef.current!)
        .bindPopup(`<b>${unit.name}</b><br>Status: ${unit.status}`);

      if (onUnitSelect) {
        marker.on("click", () => onUnitSelect(unit));
      }

      markersRef.current[unit.id] = marker;
    });

    // Fit bounds to show all markers
    if (units.some((u) => u.position)) {
      const bounds = L.latLngBounds(
        units.filter((u) => u.position).map((u) => [u.position!.lat, u.position!.lng])
      );
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [units]);

  return <div id="map" className="w-full h-full" />;
};

const getStatusIcon = (status: string) => {
  const iconUrl =
    {
      online:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
      parked:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
      offline:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    }[status] ||
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png";

  return L.icon({
    iconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
};

export default MapView;
