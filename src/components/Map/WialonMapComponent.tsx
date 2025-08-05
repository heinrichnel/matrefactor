import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Calendar,
  Clock,
  Eye,
  Fuel,
  Gauge,
  MapPin,
  Navigation,
  Radio,
  Route,
  Search,
  Settings,
  Shield,
  Truck,
  User,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    wialon: any;
    L: any;
    $: any;
  }
}

interface Resource {
  id: string;
  name: string;
}

interface Geofence {
  id: string;
  name: string;
  type: string;
}

interface Unit {
  id: string;
  name: string;
  position?: {
    x: number;
    y: number;
    s: number; // speed
    t: number; // time
  };
  sensors: any[];
  status: "active" | "idle" | "offline";
  driver?: string;
}

interface TrackingOrder {
  id: string;
  orderId: string;
  status: "checking" | "in_transit" | "delivered";
  timeline: {
    checking: string;
    inTransit: string;
    delivered: string;
  };
  currentLocation?: string;
  destination?: string;
}

const WialonMapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const unitMarkers = useRef<any>({});
  const trackingPolylines = useRef<any>({});
  const geofenceLayer = useRef<any>(null);

  const [resources, setResources] = useState<Resource[]>([]);
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedResource, setSelectedResource] = useState<string>("");
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [selectedGeofence, setSelectedGeofence] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [trackingOrders, setTrackingOrders] = useState<TrackingOrder[]>([]);
  const [sensors, setSensors] = useState<any[]>([]);
  const [unitEventIds, setUnitEventIds] = useState<any>({});

  // Token for immediate activation
  const WIALON_TOKEN = "c1099bc37c906fd0832d8e783b60ae0d0FFC3299205409AD690223C11B631D38FD0FE04A";

  const msg = (text: string) => {
    if (logRef.current) {
      logRef.current.innerHTML = text + "<br/>" + logRef.current.innerHTML;
    }
  };

  const initMap = () => {
    if (!mapRef.current || !window.L) return;

    // Create map centered on South Africa/Namibia region
    mapInstance.current = window.L.map(mapRef.current).setView([-22.95764, 18.49041], 6);

    // Add OpenStreetMap tile layer
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstance.current);

    msg("✅ Map initialized successfully");
  };

  const initResources = () => {
    if (!window.wialon) return;

    const sess = window.wialon.core.Session.getInstance();
    const flags =
      window.wialon.item.Item.dataFlag.base | window.wialon.item.Resource.dataFlag.zones;

    sess.loadLibrary("resourceZones");
    sess.updateDataFlags(
      [{ type: "type", data: "avl_resource", flags: flags, mode: 0 }],
      function (code: number) {
        if (code) {
          msg(`❌ Error loading resources: ${window.wialon.core.Errors.getErrorText(code)}`);
          return;
        }

        const res = sess.getItems("avl_resource");
        if (!res || !res.length) {
          msg("⚠️ No resources found");
          return;
        }

        const resourceList: Resource[] = [];
        for (let i = 0; i < res.length; i++) {
          resourceList.push({
            id: res[i].getId(),
            name: res[i].getName(),
          });
        }
        setResources(resourceList);
        msg(`✅ ${resourceList.length} resources loaded successfully`);
      }
    );
  };

  const initUnits = () => {
    if (!window.wialon) return;

    const sess = window.wialon.core.Session.getInstance();
    const flags =
      window.wialon.item.Item.dataFlag.base |
      window.wialon.item.Unit.dataFlag.lastMessage |
      window.wialon.item.Unit.dataFlag.sensors;

    sess.loadLibrary("itemIcon");
    sess.loadLibrary("unitSensors");
    sess.updateDataFlags(
      [{ type: "type", data: "avl_unit", flags: flags, mode: 0 }],
      function (code: number) {
        if (code) {
          msg(`❌ Error loading units: ${window.wialon.core.Errors.getErrorText(code)}`);
          return;
        }

        const unitsData = sess.getItems("avl_unit");
        if (!unitsData || !unitsData.length) {
          msg("⚠️ No units found");
          return;
        }

        const unitsList: Unit[] = [];
        const bounds: any[] = [];

        for (let i = 0; i < unitsData.length; i++) {
          const unit = unitsData[i];
          const pos = unit.getPosition();
          const sensors = unit.getSensors() || [];

          const unitInfo: Unit = {
            id: unit.getId(),
            name: unit.getName(),
            position: pos
              ? {
                  x: pos.x,
                  y: pos.y,
                  s: pos.s || 0,
                  t: pos.t || 0,
                }
              : undefined,
            sensors: sensors,
            status: pos ? (pos.s > 5 ? "active" : "idle") : "offline",
          };

          unitsList.push(unitInfo);

          if (pos && mapInstance.current) {
            const icon = window.L.icon({
              iconUrl: unit.getIconUrl(24),
              iconAnchor: [12, 12],
            });

            const marker = window.L.marker({ lat: pos.y, lng: pos.x }, { icon: icon })
              .bindPopup(
                `
                <div class="p-2">
                  <strong>${unit.getName()}</strong><br/>
                  <div class="text-sm">
                    Position: ${pos.x.toFixed(4)}, ${pos.y.toFixed(4)}<br/>
                    Speed: ${pos.s || 0} km/h<br/>
                    Sensors: ${sensors.length}<br/>
                    Status: ${unitInfo.status}
                  </div>
                </div>
              `
              )
              .addTo(mapInstance.current);

            unitMarkers.current[unit.getId()] = marker;
            bounds.push([pos.y, pos.x]);

            // Set up real-time tracking
            const eventId = unit.addListener("messageRegistered", (event: any) => {
              handleUnitUpdate(unit.getId(), event.getData());
            });

            setUnitEventIds((prev) => ({ ...prev, [unit.getId()]: eventId }));
          }
        }

        setUnits(unitsList);

        // Fit map to show all units
        if (bounds.length > 0 && mapInstance.current) {
          const group = new window.L.featureGroup(Object.values(unitMarkers.current));
          mapInstance.current.fitBounds(group.getBounds().pad(0.1));
        }

        msg(`✅ ${unitsList.length} units loaded and displayed on map`);

        // Generate mock tracking orders
        generateMockTrackingOrders(unitsList);
      }
    );
  };

  const handleUnitUpdate = (unitId: string, data: any) => {
    if (!data.pos || !mapInstance.current) return;

    const marker = unitMarkers.current[unitId];
    if (marker) {
      const newPos = { lat: data.pos.y, lng: data.pos.x };
      marker.setLatLng(newPos);

      // Update or create polyline for tracking
      if (!trackingPolylines.current[unitId]) {
        trackingPolylines.current[unitId] = window.L.polyline([newPos], {
          color: "#3B82F6",
          weight: 3,
          opacity: 0.8,
        }).addTo(mapInstance.current);
      } else {
        trackingPolylines.current[unitId].addLatLng(newPos);
      }

      // Update unit data
      setUnits((prev) =>
        prev.map((unit) =>
          unit.id === unitId
            ? {
                ...unit,
                position: {
                  x: data.pos.x,
                  y: data.pos.y,
                  s: data.pos.s || 0,
                  t: data.pos.t || 0,
                },
                status: (data.pos.s || 0) > 5 ? "active" : "idle",
              }
            : unit
        )
      );

      msg(
        `📍 Unit ${unitId} position updated: ${data.pos.x.toFixed(4)}, ${data.pos.y.toFixed(4)} - Speed: ${data.pos.s || 0} km/h`
      );
    }
  };

  const generateMockTrackingOrders = (unitsList: Unit[]) => {
    const mockOrders: TrackingOrder[] = unitsList.slice(0, 3).map((unit, index) => ({
      id: `ORD${index + 1}`,
      orderId: `#AD345JK75${index + 8}`,
      status: index === 0 ? "in_transit" : index === 1 ? "checking" : "delivered",
      timeline: {
        checking: `${21 + index} Jan`,
        inTransit: index === 0 ? "Current" : `${22 + index} Jan`,
        delivered: index === 2 ? `${25 + index} Jan` : "---",
      },
      currentLocation: unit.position
        ? `${unit.position.y.toFixed(2)}, ${unit.position.x.toFixed(2)}`
        : "Unknown",
      destination: "Delivery Point",
    }));

    setTrackingOrders(mockOrders);
  };

  const loadGeofences = (resourceId: string) => {
    if (!window.wialon || !resourceId) return;

    const sess = window.wialon.core.Session.getInstance();
    const resource = sess.getItem(resourceId);

    if (!resource) {
      msg("❌ Resource not found");
      return;
    }

    const flags = window.wialon.item.Resource.dataFlag.zones;

    sess.updateDataFlags(
      [{ type: "id", data: resourceId, flags: flags, mode: 1 }],
      function (code: number) {
        if (code) {
          msg(`❌ Error loading geofences: ${window.wialon.core.Errors.getErrorText(code)}`);
          return;
        }

        const zones = resource.getZones();
        if (!zones || !zones.length) {
          msg("⚠️ No geofences found for this resource");
          setGeofences([]);
          return;
        }

        const geofenceList: Geofence[] = [];
        for (let i = 0; i < zones.length; i++) {
          geofenceList.push({
            id: zones[i].getId(),
            name: zones[i].getName(),
            type: zones[i].getType(),
          });
        }

        setGeofences(geofenceList);
        msg(`✅ ${zones.length} geofences loaded for ${resource.getName()}`);
      }
    );
  };

  const showGeofence = (geofenceId: string) => {
    if (!window.wialon || !selectedResource || !geofenceId || !mapInstance.current) return;

    const sess = window.wialon.core.Session.getInstance();
    const resource = sess.getItem(selectedResource);
    const geofence = resource.getZone(geofenceId);

    if (!geofence) return;

    // Clear previous geofence layer
    if (geofenceLayer.current) {
      mapInstance.current.removeLayer(geofenceLayer.current);
    }

    const points = geofence.getPoints();
    if (!points || !points.length) return;

    // Convert points to Leaflet format
    const latLngs = points.map((point: any) => [point.y, point.x]);

    // Create polygon
    geofenceLayer.current = window.L.polygon(latLngs, {
      color: "#10B981",
      fillColor: "#10B981",
      fillOpacity: 0.2,
      weight: 2,
    }).addTo(mapInstance.current);

    // Fit map to geofence bounds
    mapInstance.current.fitBounds(geofenceLayer.current.getBounds());

    msg(`🏁 Geofence "${geofence.getName()}" displayed on map`);
  };

  const loadUnitSensors = (unitId: string) => {
    if (!window.wialon || !unitId) return;

    const sess = window.wialon.core.Session.getInstance();
    const unit = sess.getItem(unitId);

    if (!unit) {
      msg("❌ Unit not found");
      return;
    }

    const unitSensors = unit.getSensors();
    if (!unitSensors || !unitSensors.length) {
      msg("⚠️ No sensors found for this unit");
      setSensors([]);
      return;
    }

    const sensorsWithValues = unitSensors.map((sensor: any) => {
      const lastMessage = unit.getLastMessage();
      let value = unit.calculateSensorValue(sensor, lastMessage);
      if (value === -348201.3876) value = "N/A";

      return {
        ...sensor,
        value: value,
        unit: sensor.m || "",
      };
    });

    setSensors(sensorsWithValues);
    msg(`✅ ${sensorsWithValues.length} sensors loaded for ${unit.getName()}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "checking":
        return "bg-yellow-100 text-yellow-800";
      case "in_transit":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getUnitStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-600";
      case "idle":
        return "bg-yellow-100 text-yellow-600";
      case "offline":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  useEffect(() => {
    // Load external dependencies and initialize immediately
    const loadScript = (src: string) => {
      return new Promise((resolve, reject) => {
        // Check if script is already loaded
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve(true);
          return;
        }

        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const loadCSS = (href: string) => {
      // Check if CSS is already loaded
      if (document.querySelector(`link[href="${href}"]`)) {
        return;
      }

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    };

    const initializeWialon = async () => {
      try {
        msg("🔄 Starting Wialon initialization...");
        setIsLoading(true);

        // Load Leaflet CSS
        loadCSS("https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.2/leaflet.css");

        // Load dependencies in sequence for faster loading
        await loadScript("https://code.jquery.com/jquery-latest.min.js");
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.2/leaflet.js");
        await loadScript(
          "https://hosting.wialon.com/?token=c1099bc37c906fd0832d8e783b60ae0dD9D1A721B294486AC08F8AA3ACAC2D2FD45FF053&lang=en/wsdk/script/wialon.js"
        );

        msg("📡 Dependencies loaded, initializing Wialon session...");

        // Initialize Wialon session
        window.wialon.core.Session.getInstance().initSession(
          "https://hosting.wialon.com/?token=c1099bc37c906fd0832d8e783b60ae0dD9D1A721B294486AC08F8AA3ACAC2D2FD45FF053&lang=en"
        );

        // Login with token immediately
        window.wialon.core.Session.getInstance().loginToken(
          WIALON_TOKEN,
          "",
          function (code: number) {
            if (code) {
              msg(`❌ Login failed: ${window.wialon.core.Errors.getErrorText(code)}`);
              setIsLoading(false);
              return;
            }

            msg("✅ Logged in successfully!");
            setIsLoggedIn(true);
            setIsLoading(false);

            // Initialize everything immediately after login
            initMap();
            initUnits();
            initResources();
          }
        );
      } catch (error) {
        console.error("Failed to load Wialon dependencies:", error);
        msg("❌ Failed to load map dependencies");
        setIsLoading(false);
      }
    };

    // Start initialization immediately
    initializeWialon();

    // Cleanup
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }

      // Remove event listeners
      Object.entries(unitEventIds).forEach(([unitId, eventId]) => {
        const sess = window.wialon?.core?.Session?.getInstance();
        const unit = sess?.getItem(unitId);
        if (unit && eventId) {
          unit.removeListenerById(eventId);
        }
      });
    };
  }, []);

  return (
    <div className="w-full h-screen flex bg-gray-50">
      {/* Sidebar - Orders & Units */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Tracking Delivery</h1>
              {isLoading && <p className="text-sm text-blue-600">⏳ Loading Wialon data...</p>}
              {isLoggedIn && !isLoading && (
                <p className="text-sm text-green-600">✅ Connected to Wialon</p>
              )}
            </div>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex mt-3 text-sm">
            <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-l-md" onClick={onClick}>
              21 Jan - 1 Feb
            </button>
            <button className="px-3 py-1 border-t border-b border-gray-300" onClick={onClick}>
              Checking
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-r-md" onClick={onClick}>
              In Transit
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {trackingOrders.map((order) => (
              <Card key={order.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Order ID:</span>
                      <span className="text-sm text-blue-600">{order.orderId}</span>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status === "in_transit"
                        ? "In Transit"
                        : order.status === "checking"
                          ? "Checking"
                          : "Delivered"}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-600">{order.timeline.checking}</span>
                      <span className="mx-2">•</span>
                      <span className="text-gray-900">Checking</span>
                      <span className="ml-auto text-gray-500">10:23 AM</span>
                    </div>

                    <div className="flex items-center text-sm">
                      <Navigation className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-600">{order.timeline.inTransit}</span>
                      <span className="mx-2">•</span>
                      <span className="text-gray-900">In transit</span>
                      <span className="ml-auto text-gray-500">
                        {order.status === "in_transit" ? "Current" : "12:02 PM"}
                      </span>
                    </div>

                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-600">{order.timeline.delivered}</span>
                      <span className="mx-2">•</span>
                      <span className="text-gray-900">Delivered</span>
                      <span className="ml-auto text-gray-500">---</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Units List */}
        <div className="border-t border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Active Units</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {units.map((unit) => (
              <div
                key={unit.id}
                className={`flex items-center justify-between p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 ${
                  selectedUnit === unit.id ? "ring-2 ring-blue-400" : ""
                }`}
                onClick={() => {
                  setSelectedUnit(unit.id);
                  loadUnitSensors(unit.id);
                }}
              >
                <div className="flex items-center">
                  <Truck className="w-4 h-4 mr-2 text-gray-600" />
                  <span className="text-sm font-medium">{unit.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{unit.position?.s || 0} km/h</span>
                  <Badge className={getUnitStatusColor(unit.status)}>{unit.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Controls */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Resources:</label>
                <select
                  value={selectedResource}
                  onChange={(e) => {
                    setSelectedResource(e.target.value);
                    if (e.target.value) {
                      loadGeofences(e.target.value);
                    }
                  }}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                  disabled={isLoading}
                >
                  <option value="">Select resource...</option>
                  {resources.map((resource) => (
                    <option key={resource.id} value={resource.id}>
                      {resource.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Geofences:</label>
                <select
                  value={selectedGeofence}
                  onChange={(e) => {
                    setSelectedGeofence(e.target.value);
                    if (e.target.value) {
                      showGeofence(e.target.value);
                    }
                  }}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                  disabled={!geofences.length || isLoading}
                >
                  <option value="">Select geofence...</option>
                  {geofences.map((geofence) => (
                    <option key={geofence.id} value={geofence.id}>
                      {geofence.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Route className="w-4 h-4" />
                Plan Route
              </Button>
              <Button size="sm">
                <Eye className="w-4 h-4" />
                Live View
              </Button>
            </div>
          </div>
        </div>

        {/* Map and Info Panel */}
        <div className="flex-1 flex">
          {/* Map */}
          <div className="flex-1 relative">
            <div ref={mapRef} className="w-full h-full" />

            {/* Map overlay info */}
            {selectedUnit && (
              <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 w-72">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Current location</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Gauge className="w-4 h-4" />
                      <span>Speed</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Navigation className="w-4 h-4" />
                      <span>Kilometers left</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Last stop</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Yourmake 007</span>
                  <span className="font-medium">80 km/h</span>
                  <span className="font-medium">34 km</span>
                  <span className="font-medium">2 hours ago</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Activity Log & Sensor Data */}
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            {/* Vehicle Info */}
            {selectedUnit && (
              <div className="p-4 border-b border-gray-200">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-3">
                    <Truck className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    {units.find((u) => u.id === selectedUnit)?.name}
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>MODEL</span>
                      <span className="font-medium">Cargo Truck HD320</span>
                    </div>
                    <div className="flex justify-between">
                      <span>WEIGHT</span>
                      <span className="font-medium">7,260 kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SPACE</span>
                      <span className="font-medium">71% / 100%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>LOAD VOLUME</span>
                      <span className="font-medium">372.45 in³</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sensors */}
            {sensors.length > 0 && (
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <Radio className="w-4 h-4 mr-2" />
                  Sensors ({sensors.length})
                </h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {sensors.map((sensor, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{sensor.n}</span>
                      <span className="font-medium">
                        {sensor.value} {sensor.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activity Log */}
            <div className="flex-1 p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                Activity Log
              </h3>
              <div
                ref={logRef}
                className="text-xs space-y-1 max-h-64 overflow-y-auto bg-gray-50 p-3 rounded"
                style={{
                  minHeight: "200px",
                  fontFamily: "monospace",
                }}
              />
            </div>

            {/* Additional Controls */}
            <div className="p-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  Geofences
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  <Fuel className="w-3 h-3 mr-1" />
                  Fuel Data
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  <User className="w-3 h-3 mr-1" />
                  Drivers
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  <Route className="w-3 h-3 mr-1" />
                  Routes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WialonMapComponent;
