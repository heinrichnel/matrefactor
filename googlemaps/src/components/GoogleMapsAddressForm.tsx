// src/components/GoogleMapsAddressForm.tsx
import { useEffect, useRef, useState } from "react";

/** ---- Types ---- */
type AddressFormData = {
  location: string;
  locality: string;
  administrative_area_level_1: string;
  postal_code: string;
  country: string;
};

type AddressComponentInForm =
  | "location"
  | "locality"
  | "administrative_area_level_1"
  | "postal_code"
  | "country";

/** ---- Component ---- */
export default function GoogleMapsAddressForm() {
  const [formData, setFormData] = useState<AddressFormData>({
    location: "",
    locality: "",
    administrative_area_level_1: "",
    postal_code: "",
    country: "",
  });

  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>({
    lat: 37.4221,
    lng: -122.0841,
  });
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const locationInputRef = useRef<HTMLInputElement | null>(null);

  // Configuration (you can move this to props)
  const CONFIGURATION = {
    ctaTitle: "Checkout",
    mapOptions: {
      center: { lat: 37.4221, lng: -122.0841 },
      fullscreenControl: true,
      mapTypeControl: false,
      streetViewControl: true,
      zoom: 11,
      zoomControl: true,
      maxZoom: 22,
    } satisfies google.maps.MapOptions,
    mapsApiKey: (import.meta as any).env?.VITE_GMAPS_KEY as string, // Vite env; or pass as a prop
    capabilities: {
      addressAutocompleteControl: true,
      mapDisplayControl: true,
      ctaControl: true,
    },
  };

  const SHORT_NAME_ADDRESS_COMPONENT_TYPES = new Set<string>([
    "street_number",
    "administrative_area_level_1",
    "postal_code",
  ]);

  const ADDRESS_COMPONENT_TYPES_IN_FORM: AddressComponentInForm[] = [
    "location",
    "locality",
    "administrative_area_level_1",
    "postal_code",
    "country",
  ];

  /** ---- Load Google Maps JS ---- */
  useEffect(() => {
    const loadGoogleMaps = () => {
      if ((window as any).google?.maps) {
        initializeMap();
        return;
      }
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
        CONFIGURATION.mapsApiKey
      )}&libraries=places&loading=async`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      script.onerror = () => {
        console.error("Failed to load Google Maps API");
        setIsLoading(false);
      };
      document.head.appendChild(script);
    };
    loadGoogleMaps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** ---- Map + Marker + Autocomplete init ---- */
  const initializeMap = () => {
    if (!mapRef.current || !(window as any).google?.maps) return;

    try {
      const map = new google.maps.Map(mapRef.current, {
        ...CONFIGURATION.mapOptions,
        center: mapCenter,
      });

      const marker = new google.maps.Marker({
        map,
        draggable: false,
      });

      if (locationInputRef.current) {
        const autocomplete = new google.maps.places.Autocomplete(locationInputRef.current, {
          fields: ["address_components", "geometry", "name", "formatted_address"],
          types: ["address"],
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          handlePlaceChanged(place, map, marker);
        });

        autocompleteRef.current = autocomplete;
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error initializing map:", error);
      setIsLoading(false);
    }
  };

  /** ---- Place selection handler (typed) ---- */
  const handlePlaceChanged = (
    place: google.maps.places.PlaceResult,
    map: google.maps.Map,
    marker: google.maps.Marker
  ) => {
    if (!place.geometry || !place.geometry.location) {
      alert(`No details available for input: '${place.name ?? "Unknown"}'`);
      return;
    }

    const loc = place.geometry.location;
    map.setCenter(loc);
    map.setZoom(15);
    marker.setPosition(loc);
    marker.setVisible(true);

    setSelectedPlace(place);
    setMapCenter({ lat: loc.lat(), lng: loc.lng() });
    setMarkerPosition({ lat: loc.lat(), lng: loc.lng() });

    fillInAddress(place);
  };

  /** ---- Helpers to extract address components ---- */
  const getComponentName = (
    place: google.maps.places.PlaceResult,
    componentType: string
  ): string => {
    const comps = place.address_components ?? [];
    for (const component of comps) {
      if (component.types?.[0] === componentType) {
        return SHORT_NAME_ADDRESS_COMPONENT_TYPES.has(componentType)
          ? component.short_name || ""
          : component.long_name || "";
      }
    }
    return "";
  };

  const getComponentText = (
    place: google.maps.places.PlaceResult,
    componentType: AddressComponentInForm | string
  ): string => {
    if (componentType === "location") {
      const streetNumber = getComponentName(place, "street_number");
      const route = getComponentName(place, "route");
      return `${streetNumber} ${route}`.trim();
    }
    return getComponentName(place, componentType);
  };

  /** ---- Fill form safely with a typed object ---- */
  const fillInAddress = (place: google.maps.places.PlaceResult) => {
    const newFormData: AddressFormData = {
      location: "",
      locality: "",
      administrative_area_level_1: "",
      postal_code: "",
      country: "",
    };

    for (const componentType of ADDRESS_COMPONENT_TYPES_IN_FORM) {
      newFormData[componentType] = getComponentText(place, componentType);
    }

    setFormData(newFormData);
  };

  /** ---- Controlled inputs ---- */
  const handleInputChange = (field: keyof AddressFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /** ---- Actions ---- */
  const handleSubmit = () => {
    console.log("Form submitted with data:", formData);
    console.log("Selected place:", selectedPlace);
    alert(
      `Form submitted! Address: ${formData.location}, ${formData.locality}, ${formData.administrative_area_level_1} ${formData.postal_code}`
    );
  };

  const clearForm = () => {
    setFormData({
      location: "",
      locality: "",
      administrative_area_level_1: "",
      postal_code: "",
      country: "",
    });
    setSelectedPlace(null);
    setMarkerPosition(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading Google Maps...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Address Lookup & Form</h1>
        <p className="text-gray-600">Search for an address and automatically fill the form below.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="space-y-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="location-input" className="block text-sm font-medium text-gray-700 mb-1">
                Street Address *
              </label>
              <input
                ref={locationInputRef}
                id="location-input"
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Start typing an address..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="locality-input" className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                id="locality-input"
                type="text"
                value={formData.locality}
                onChange={(e) => handleInputChange("locality", e.target.value)}
                placeholder="City"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="administrative_area_level_1-input"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  State/Province
                </label>
                <input
                  id="administrative_area_level_1-input"
                  type="text"
                  value={formData.administrative_area_level_1}
                  onChange={(e) =>
                    handleInputChange("administrative_area_level_1", e.target.value)
                  }
                  placeholder="State"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="postal_code-input" className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code
                </label>
                <input
                  id="postal_code-input"
                  type="text"
                  value={formData.postal_code}
                  onChange={(e) => handleInputChange("postal_code", e.target.value)}
                  placeholder="12345"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="country-input" className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                id="country-input"
                type="text"
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                placeholder="Country"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
              >
                {CONFIGURATION.ctaTitle}
              </button>
              <button
                onClick={clearForm}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 font-medium"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Selected Place Info */}
          {selectedPlace && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-sm font-semibold text-green-800 mb-2">Selected Location:</h3>
              <p className="text-sm text-green-700">
                {selectedPlace.formatted_address ?? "—"}
              </p>
              {markerPosition && (
                <p className="text-xs text-green-600 mt-1">
                  Coordinates: {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Map Section */}
        <div className="space-y-4">
          <div
            ref={mapRef}
            className="w-full h-96 border border-gray-300 rounded-lg"
            style={{ minHeight: "400px" }}
          />

          <div className="text-sm text-gray-600">
            <p>
              <strong>How to use:</strong>
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Start typing in the address field</li>
              <li>Select an address from the dropdown suggestions</li>
              <li>The form will auto-fill and the map will update</li>
              <li>Review and submit the form</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
