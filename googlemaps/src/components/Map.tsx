// src/components/Map.tsx
import { useEffect, useRef } from "react";
import { googleLoader } from "@/lib/google";

type Props = {
  center: google.maps.LatLngLiteral;
  zoom?: number;
  onReady?: (map: google.maps.Map) => void;
};
export default function Map({ center, zoom = 12, onReady }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    (async () => {
      await googleLoader.load();
      if (!ref.current) return;
      const map = new google.maps.Map(ref.current, { center, zoom, mapTypeControl: false });
      onReady?.(map);
    })();
  }, []);
  return <div ref={ref} className="h-full w-full rounded-2xl" />;
}
