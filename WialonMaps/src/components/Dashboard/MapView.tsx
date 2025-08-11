import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { WialonUnit, WialonUnitStatus } from "../../types/wialon";

interface MapViewProps {
  units?: WialonUnit[];
  onUnitSelect?: (unit: WialonUnit) => void;
}

export const MapView = ({ units = [], onUnitSelect }: MapViewProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  useEffect(() => {
    const el = document.getElementById("map");
    if (!el) return;
    mapRef.current = L.map(el).setView([0, 0], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(mapRef.current);
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // clear old markers
    Object.values(markersRef.current).forEach((marker) => mapRef.current?.removeLayer(marker));
    markersRef.current = {};

    const points: L.LatLngExpression[] = [];

    units.forEach((unit) => {
      const p = unit.position;
      if (!p) return;

      const status: WialonUnitStatus = unit.status ?? "unknown";
      const icon = getStatusIcon(status);

      const marker = L.marker([p.latitude, p.longitude], { icon })
        .addTo(mapRef.current!)
        .bindPopup(`<b>${escapeHtml(unit.name)}</b><br/>Status: ${status}<br/>Speed: ${p.speed}`);

      if (onUnitSelect) marker.on("click", () => onUnitSelect(unit));

      markersRef.current[unit.id] = marker;
      points.push([p.latitude, p.longitude]);
    });

    if (points.length) {
      mapRef.current.fitBounds(L.latLngBounds(points), { padding: [50, 50] });
    }
  }, [units, onUnitSelect]);

  return <div id="map" className="w-full h-full" />;
};

const getStatusIcon = (status: WialonUnitStatus) => {
  const iconUrl =
    {
      online:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
      moving:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
      parked:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
      offline:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
      unknown:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
    }[status] ??
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png";

  return L.icon({
    iconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
};

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default MapView;
