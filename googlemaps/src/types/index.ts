// googlemaps/index.js - Standalone Google Maps implementation
declare global {
  interface Window {
    initMap: () => Promise<void>;
  }
}

const API_KEY = process.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyDTHkrpqeH0nj-cpbYybjKcZYwKgDNf8z8";

/**
 * Initialize the Google Maps API
 * This matches the signature in the requirements
 */
async function initMap() {
  console.log("Maps JavaScript API loaded.");
  const center = { lat: -25.7479, lng: 28.2293 };
  const mapElement = document.getElementById("map");

  if (mapElement) {
    const map = new google.maps.Map(mapElement, {
      zoom: 12,
      center: center,
    });
    new google.maps.Marker({
      position: center,
      map: map,
      title: "Pretoria",
    });
  } else {
    console.error("Map element not found in the document");
  }
}

/**
 * Load the Google Maps API script dynamically
 */
function loadGoogleMapsScript() {
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=initMap`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);

  // Add error handling for script loading
  script.onerror = () => {
    console.error("Failed to load Google Maps API script");
    console.warn("This may be due to network issues or an invalid API key");
  };
}

// Make initMap globally accessible for Google Maps callback
window.initMap = initMap;

window.onload = loadGoogleMapsScript;
