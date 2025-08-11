import L from 'leaflet';

export const createMap = (elementId: string, center: [number, number], zoom: number) => {
  const map = L.map(elementId).setView(center, zoom);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  return map;
};

export const createMarker = (
  map: L.Map,
  position: [number, number],
  options: {
    icon?: L.Icon;
    popup?: string;
    onClick?: () => void;
  } = {}
) => {
  const marker = L.marker(position, {
    icon: options.icon || L.divIcon({ className: 'default-marker' })
  }).addTo(map);

  if (options.popup) {
    marker.bindPopup(options.popup);
  }

  if (options.onClick) {
    marker.on('click', options.onClick);
  }

  return marker;
};

export const fitMapToMarkers = (map: L.Map, positions: [number, number][], padding: [number, number] = [50, 50]) => {
  if (positions.length === 0) return;

  const bounds = L.latLngBounds(positions);
  map.fitBounds(bounds, { padding });
};

export const getStatusIcon = (status: string): L.Icon => {
  const iconUrl = {
    online: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    parked: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
    offline: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png'
  }[status] || 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png';

  return L.icon({
    iconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  });
};
