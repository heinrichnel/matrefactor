import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
import React, { useEffect, useState } from "react";
import { Location, RouteOptions } from "../../types/mapTypes";
import { isGoogleMapsAPILoaded, useLoadGoogleMaps } from "../../utils/googleMapsLoader";
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_OPTIONS,
  MAP_STYLES,
  createMarkerIcon,
  getBoundsForLocations,
} from "../../utils/mapConfig";
import { initPlacesService, placeToLocation, searchPlacesByText } from "../../utils/placesService";
import RouteDrawer from "../Models/RouteDrawer";
import LocationDetailPanel from "./LocationDetailPanel";

interface EnhancedMapProps {
  locations?: Location[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string | number;
  width?: string | number;
  showInfoOnHover?: boolean;
  className?: string;
  showFullscreenControl?: boolean;
  showZoomControl?: boolean;
  showStreetViewControl?: boolean;
  showMapTypeControl?: boolean;
  customMapStyles?: any;
  defaultIconType?: string;
  showRoutes?: boolean;
  routeOptions?: RouteOptions;
  showPlacesSearch?: boolean;
  onLocationSelect?: (location: Location) => void;
  onMapLoad?: (map: google.maps.Map) => void;
}

const EnhancedMapComponent: React.FC<EnhancedMapProps> = ({
  locations = [],
  center = DEFAULT_MAP_CENTER,
  zoom = 10,
  height = "400px",
  width = "100%",
  showInfoOnHover = false,
  className = "",
  showFullscreenControl = true,
  showZoomControl = true,
  showStreetViewControl = true,
  showMapTypeControl = false,
  customMapStyles,
  defaultIconType = "default",
  showRoutes = false,
  routeOptions = {},
  showPlacesSearch = false,
  onLocationSelect,
  onMapLoad,
}) => {
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [placesService, setPlacesService] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  // Removed unused loadError state

  useLoadGoogleMaps();

  const containerStyle = {
    width,
    height,
    borderRadius: "0.375rem",
    position: "relative" as const,
  };

  // Initialize Places service when map is loaded
  useEffect(() => {
    if (mapInstance && showPlacesSearch && isGoogleMapsAPILoaded()) {
      const service = initPlacesService(mapInstance);
      setPlacesService(service);
    }
  }, [mapInstance, showPlacesSearch]);

  // Handle search
  const handleSearch = async () => {
    if (!placesService || !searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchPlacesByText(placesService, searchQuery, {
        locationBias: {
          lat: center.lat,
          lng: center.lng,
          radius: 10000,
        },
      });
      const locationResults = results.map(placeToLocation);
      setSearchResults(locationResults);

      // Fit bounds to results
      if (mapInstance && locationResults.length > 0) {
        const bounds = getBoundsForLocations(locationResults);
        if (bounds) {
          mapInstance.fitBounds(bounds);
        }
      }
    } catch (error) {
      console.error("Place search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Removed unused renderErrorState function and related code

  // Handle map load
  const handleMapLoad = (map: google.maps.Map) => {
    setMapInstance(map);
    if (onMapLoad) onMapLoad(map);
  };

  // All visible locations (original + search results)
  const allLocations = [...locations, ...searchResults];

  // Determine if we should show routes
  const showRoutePaths = showRoutes && allLocations.length >= 2;

  return (
    <div className={`relative ${className}`}>
      {/* Places search input */}
      {showPlacesSearch && (
        <div className="absolute top-3 left-3 right-3 z-10">
          <div className="bg-white rounded-lg shadow-md p-2 flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search places..."
              className="flex-1 border-0 focus:ring-0 text-sm"
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isSearching ? "..." : "Search"}
            </button>
          </div>
        </div>
      )}

      {/* Google Map */}
      {!isGoogleMapsAPILoaded() ? (
        <div className="flex items-center justify-center h-[400px] bg-gray-100 rounded-md">
          <div className="text-center">
            <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mx-auto mb-2"></div>
            <p>Loading map...</p>
          </div>
        </div>
      ) : (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={zoom}
          options={{
            ...DEFAULT_MAP_OPTIONS,
            fullscreenControl: showFullscreenControl,
            mapTypeControl: showMapTypeControl,
            streetViewControl: showStreetViewControl,
            zoomControl: showZoomControl,
            styles: customMapStyles || MAP_STYLES.clean,
          }}
          onLoad={handleMapLoad}
          onUnmount={() => setMapInstance(null)}
        >
          {/* Markers */}
          {allLocations.map((location, index) => (
            <Marker
              key={`marker-${index}`}
              position={location}
              title={location.title}
              onClick={() => {
                setSelectedLocation(location);
                if (onLocationSelect) onLocationSelect(location);
              }}
              onMouseOver={() => showInfoOnHover && setSelectedLocation(location)}
              onMouseOut={() => showInfoOnHover && setSelectedLocation(null)}
              icon={(() => {
                const icon = createMarkerIcon(location.iconType || defaultIconType);
                if (
                  icon &&
                  icon.anchor &&
                  window.google?.maps &&
                  !(icon.anchor instanceof window.google.maps.Point)
                ) {
                  icon.anchor = new window.google.maps.Point(icon.anchor.x, icon.anchor.y);
                }
                return icon as unknown as google.maps.Icon;
              })()}
            />
          ))}

          {/* Routes between locations */}
          {showRoutePaths && (
            <RouteDrawer
              origin={allLocations[0]}
              destination={allLocations[allLocations.length - 1]}
              waypoints={allLocations.slice(1, -1)}
              options={routeOptions}
            />
          )}

          {/* Info window for selected location */}
          {selectedLocation && (
            <InfoWindow position={selectedLocation} onCloseClick={() => setSelectedLocation(null)}>
              <div className="p-2 max-w-xs">
                {selectedLocation.title && (
                  <h3 className="font-medium text-sm mb-1">{selectedLocation.title}</h3>
                )}
                {selectedLocation.info && (
                  <p className="text-xs text-gray-600">{selectedLocation.info}</p>
                )}
                {selectedLocation.address && (
                  <p className="text-xs text-gray-500 mt-1">{selectedLocation.address}</p>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      )}

      {/* Location detail panel */}
      {selectedLocation && selectedLocation.id && (
        <div className="mt-4">
          <LocationDetailPanel
            locationId={selectedLocation.id}
            onClose={() => setSelectedLocation(null)}
          />
        </div>
      )}
    </div>
  );
};

export default EnhancedMapComponent;
