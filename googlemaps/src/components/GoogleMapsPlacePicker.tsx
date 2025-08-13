// GoogleMapsPlacePicker.tsx
import { useState, useEffect, useRef } from "react";

// If you haven’t already: npm i -D @types/google.maps
// In tsconfig.json ensure:
// { "compilerOptions": { "types": ["google.maps"], "strict": true, "jsx": "react-jsx" } }

type Props = {
  apiKey: string; // pass in instead of using import.meta.env to avoid module setting issues
  initialCenter?: google.maps.LatLngLiteral;
  initialZoom?: number;
};

function loadScriptOnce(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Already loaded?
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps script"));
    document.head.appendChild(script);
  });
}

export default function GoogleMapsPlacePicker({
  apiKey,
  initialCenter = { lat: 40.749933, lng: -73.98633 },
  initialZoom = 13,
}: Props) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [searchType, setSearchType] = useState<string>("");
  const [strictBounds, setStrictBounds] = useState<boolean>(false);

  const mapRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Initialize Google Maps
  useEffect(() => {
    let cancelled = false;

    const initMap = () => {
      if (cancelled || !mapRef.current || !window.google) return;

      const mapInstance = new google.maps.Map(mapRef.current, {
        center: initialCenter,
        zoom: initialZoom,
        mapTypeControl: false,
      });

      const markerInstance = new google.maps.Marker({
        map: mapInstance,
        draggable: false,
      });

      const infoWindowInstance = new google.maps.InfoWindow();

      setMap(mapInstance);
      setMarker(markerInstance);
      setInfoWindow(infoWindowInstance);

      initAutocomplete(mapInstance, markerInstance, infoWindowInstance);
    };

    const src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      apiKey
    )}&libraries=places`;

    (async () => {
      if (!window.google) {
        await loadScriptOnce(src);
      }
      initMap();
    })();

    return () => {
      cancelled = true;
      // Cleanup
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
      infoWindow?.close();
      marker?.setMap(null);
    };
  }, [apiKey, initialCenter.lat, initialCenter.lng, initialZoom]);

  // Initialize autocomplete
  const initAutocomplete = (
    mapInstance: google.maps.Map,
    markerInstance: google.maps.Marker,
    infoWindowInstance: google.maps.InfoWindow
  ) => {
    if (!searchInputRef.current || !window.google) return;

    const autocomplete = new google.maps.places.Autocomplete(searchInputRef.current, {
      types: searchType ? [searchType] : [],
      strictBounds,
    });

    // Bind autocomplete to map bounds
    autocomplete.bindTo("bounds", mapInstance);

    // Listen for place selection
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) {
        alert(`No details available for input: '${place.name ?? "Unknown"}'`);
        return;
      }

      if (place.geometry.viewport) {
        mapInstance.fitBounds(place.geometry.viewport);
      } else {
        mapInstance.setCenter(place.geometry.location);
        mapInstance.setZoom(17);
      }

      markerInstance.setPosition(place.geometry.location);
      markerInstance.setVisible(true);

      const content = `
        <div>
          <h3>${place.name || "Unknown Place"}</h3>
          <p>${place.formatted_address || "No address available"}</p>
        </div>
      `;

      infoWindowInstance.setContent(content);
      infoWindowInstance.open({ map: mapInstance, anchor: markerInstance });

      setSelectedPlace(place);
    });

    autocompleteRef.current = autocomplete;
  };

  // Update autocomplete options when filters change
  useEffect(() => {
    if (autocompleteRef.current) {
      autocompleteRef.current.setOptions({
        types: searchType ? [searchType] : [],
        strictBounds,
      });
    }
  }, [searchType, strictBounds]);

  const handleTypeChange = (type: string) => {
    setSearchType(type);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-4">Google Maps Place Picker</h1>

        {/* Search Input */}
        <div className="mb-4">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search for a place..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter Controls */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Search Filters:</h3>

          <div className="flex flex-wrap gap-4 mb-3">
            {[
              { label: "All", value: "" },
              { label: "Address", value: "address" },
              { label: "Establishment", value: "establishment" },
              { label: "Geocode", value: "geocode" },
              { label: "Cities", value: "(cities)" },
              { label: "Regions", value: "(regions)" },
            ].map((option) => (
              <label key={option.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="searchType"
                  value={option.value}
                  checked={searchType === option.value}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="text-blue-600"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={strictBounds}
              onChange={(e) => setStrictBounds(e.target.checked)}
              className="text-blue-600"
            />
            <span>Strict Bounds (limit to current map view)</span>
          </label>
        </div>

        {/* Selected Place Info */}
        {selectedPlace && (
          <div className="mb-4 p-3 bg-gray-100 rounded-lg">
            <h3 className="font-semibold">Selected Place:</h3>
            <p>
              <strong>Name:</strong> {selectedPlace.name}
            </p>
            <p>
              <strong>Address:</strong> {selectedPlace.formatted_address}
            </p>
            {selectedPlace.geometry?.location && (
              <p>
                <strong>Coordinates:</strong> {selectedPlace.geometry.location.lat()},{" "}
                {selectedPlace.geometry.location.lng()}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Map Container */}
      <div
        ref={mapRef}
        className="w-full h-96 border border-gray-300 rounded-lg"
        style={{ minHeight: "400px" }}
      />

      <div className="mt-4 text-sm text-gray-600">
        <p>
          <strong>Instructions:</strong>
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Type in the search box to find places</li>
          <li>Select different filters to narrow your search</li>
          <li>Enable “Strict Bounds” to limit results to the current map area</li>
          <li>Click on suggestions to view the location on the map</li>
        </ul>
      </div>
    </div>
  );
}
