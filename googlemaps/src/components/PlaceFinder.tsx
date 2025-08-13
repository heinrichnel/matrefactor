import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

// Ensure tsconfig:  "types": ["google.maps"]  and dev-dep @types/google.maps installed.

export type CurrentPlaceFinderProps = {
  initialCenter?: google.maps.LatLngLiteral;
  initialZoom?: number;
  onPlacePicked?: (place: google.maps.places.PlaceResult) => void;
  className?: string;
};

const loader = new Loader({
  apiKey: import.meta.env.VITE_GMAPS_KEY as string,
  version: "weekly",
  libraries: ["places"],
});

export default function CurrentPlaceFinder({
  initialCenter = { lat: -26.2041, lng: 28.0473 }, // Johannesburg
  initialZoom = 12,
  onPlacePicked,
  className,
}: CurrentPlaceFinderProps) {
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null); // classic Marker for setMap(null)
  const clickListenerRef = useRef<google.maps.MapsEventListener | null>(null);

  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Init map + services
  useEffect(() => {
    let canceled = false;
    (async () => {
      setLoading(true);
      try {
        await loader.load();
        if (canceled || !mapDivRef.current) return;

        mapRef.current = new google.maps.Map(mapDivRef.current, {
          center: initialCenter,
          zoom: initialZoom,
          mapTypeControl: false,
          streetViewControl: false,
        });
        geocoderRef.current = new google.maps.Geocoder();
        infoWindowRef.current = new google.maps.InfoWindow();
        markerRef.current = new google.maps.Marker({ map: mapRef.current });

        // Click to pick place (reverse geocode)
        clickListenerRef.current = mapRef.current.addListener(
          "click",
          (e: google.maps.MapMouseEvent) => {
            const latLng = e.latLng;
            if (!latLng) return;
            reverseGeocode(latLng);
          }
        );
      } catch (e: any) {
        setError(e?.message ?? "Failed to load Google Maps");
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      canceled = true;
      if (clickListenerRef.current) {
        google.maps.event.removeListener(clickListenerRef.current);
        clickListenerRef.current = null;
      }
      markerRef.current?.setMap(null);
      markerRef.current = null;
      infoWindowRef.current?.close();
      infoWindowRef.current = null;
      geocoderRef.current = null;
      mapRef.current = null;
    };
  }, [initialCenter.lat, initialCenter.lng, initialZoom]);

  const reverseGeocode = (latLng: google.maps.LatLng) => {
    if (!geocoderRef.current || !mapRef.current || !markerRef.current) return;
    setError(null);
    geocoderRef.current.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const r = results[0];
        markerRef.current!.setPosition(latLng);
        mapRef.current!.setZoom(16);
        mapRef.current!.setCenter(latLng);
        const content = r.formatted_address ?? "Selected location";
        infoWindowRef.current?.setContent(content);
        infoWindowRef.current?.open({ map: mapRef.current!, anchor: markerRef.current! });

        // Adapt GeocoderResult into a PlaceResult-like shape
        const place: google.maps.places.PlaceResult = {
          name: r.address_components?.[0]?.long_name,
          formatted_address: r.formatted_address,
          place_id: r.place_id,
          types: r.types,
          geometry: { location: latLng } as unknown as google.maps.places.PlaceGeometry,
        };
        setSelectedPlace(place);
        onPlacePicked?.(place);
      } else {
        infoWindowRef.current?.close();
        setSelectedPlace(null);
        setError(
          status === "ZERO_RESULTS" ? "No address found here." : `Geocode failed: ${status}`
        );
      }
    });
  };

  const locateMe = () => {
    if (!mapRef.current || !markerRef.current) return;
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setError(null);
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoading(false);
        const latLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        reverseGeocode(latLng);
      },
      (err) => {
        setLoading(false);
        setError(err.message || "Unable to retrieve your location.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className={"w-full " + (className ?? "")}>
      <div className="flex items-center gap-2 mb-2">
        <button onClick={locateMe} className="px-3 py-2 rounded-xl border shadow-sm">
          {loading ? "Locating…" : "Use my location"}
        </button>
        {error && <span className="text-red-600 text-sm">{error}</span>}
      </div>

      <div ref={mapDivRef} className="h-[60vh] w-full rounded-2xl border" />

      {selectedPlace && (
        <div className="mt-3 text-sm p-3 rounded-2xl border">
          <div className="font-semibold">{selectedPlace.name ?? "Selected place"}</div>
          <div>{selectedPlace.formatted_address ?? "—"}</div>
          <div className="text-xs opacity-70">{selectedPlace.place_id ?? "—"}</div>
          <div className="text-xs opacity-70">
            {(selectedPlace.types && selectedPlace.types.join(", ")) || "—"}
          </div>
        </div>
      )}
    </div>
  );
}
