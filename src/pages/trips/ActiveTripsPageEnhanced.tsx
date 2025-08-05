import {
  Activity,
  CheckCircle,
  Clock,
  Eye,
  Filter,
  Globe,
  MapPin,
  PackageCheck,
  Pencil,
  RefreshCw,
  Trash2,
  Truck as TruckIcon,
} from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import { useRealtimeTrips } from "../../hooks/useRealtimeTrips";
import { formatCurrency, SupportedCurrency } from "../../lib/currency";

// Firestore (pas aan as jou paaie anders is)
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

// -------------------- Types --------------------
type ImportSource = "web_book" | "manual" | "webhook" | "csv";

interface CostBreakdown {
  fuel?: number;
  maintenance?: number;
  driver?: number;
  tolls?: number;
  other?: number;
}

interface UITrip {
  id: string;
  loadRef: string;
  customer?: string;
  origin?: string;
  destination?: string;
  status?: string;
  shippedStatus?: boolean;
  deliveredStatus?: boolean;
  importSource: ImportSource;
  startTime?: string;
  endTime?: string;
  driver?: string;
  vehicle?: string;
  distance?: number;
  totalCost?: number;
  costBreakdown?: CostBreakdown;

  // webhook / csv extras
  externalId?: string;
  lastUpdated?: string;
}

// -------------------- Component --------------------
const ActiveTripsPageEnhanced: React.FC<{ displayCurrency?: SupportedCurrency }> = ({
  displayCurrency = "ZAR",
}) => {
  const navigate = useNavigate();

  // Filters
  const [filterWebBookOnly, setFilterWebBookOnly] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Real-time trips from Firestore
  const {
    trips: rtTrips,
    loading,
    error,
  } = useRealtimeTrips({
    onlyWebBook: filterWebBookOnly || undefined,
    status: statusFilter || undefined,
  });

  // Webhook + CSV imported (local only)
  const [webhookTrips, setWebhookTrips] = useState<UITrip[]>([]);
  const [csvTrips, setCsvTrips] = useState<UITrip[]>([]);

  // UI state
  const [confirm, setConfirm] = useState<{ open: boolean; tripId?: string; action?: string }>({
    open: false,
  });
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Edit costs modal state
  const [editingTrip, setEditingTrip] = useState<UITrip | null>(null);
  const [editForm, setEditForm] = useState<Required<CostBreakdown> & { cost: number }>({
    cost: 0,
    fuel: 0,
    maintenance: 0,
    driver: 0,
    tolls: 0,
    other: 0,
  });

  // CSV upload
  const [isUploading, setIsUploading] = useState(false);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [csvSuccess, setCsvSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // -------------------- Helpers --------------------
  const normalizeRtTrip = (trip: any): UITrip => ({
    id: trip.id,
    loadRef: trip.loadRef || `TR-${trip.id.substring(0, 8)}`,
    customer: trip.customer || trip.clientName,
    origin: trip.origin,
    destination: trip.destination,
    status: trip.status,
    shippedStatus: !!trip.shippedStatus,
    deliveredStatus: !!trip.deliveredStatus,
    importSource: (trip.importSource as ImportSource) || "manual",
    startTime: trip.startTime,
    endTime: trip.endTime,
    driver: trip.driver || "Unassigned",
    vehicle: trip.vehicle || "Unassigned",
    distance: trip.distance || 0,
    totalCost: trip.totalCost || 0,
    costBreakdown: trip.costBreakdown,
  });

  const fetchWebhookTrips = async () => {
    // Replace with a real API call
    const mock: UITrip[] = [
      {
        id: "wh-1",
        loadRef: "WH-2023-001",
        origin: "Miami, FL",
        destination: "Orlando, FL",
        status: "active",
        shippedStatus: false,
        deliveredStatus: false,
        importSource: "webhook",
        startTime: "2025-07-14T10:00:00",
        endTime: "2025-07-15T16:00:00",
        driver: "Alex Thompson",
        vehicle: "Truck WH-123",
        distance: 235,
        totalCost: 0,
        externalId: "ext-12345",
        lastUpdated: new Date().toISOString(),
      },
      {
        id: "wh-2",
        loadRef: "WH-2023-002",
        origin: "Austin, TX",
        destination: "Houston, TX",
        status: "active",
        shippedStatus: false,
        deliveredStatus: false,
        importSource: "webhook",
        startTime: "2025-07-16T08:30:00",
        endTime: "2025-07-17T12:00:00",
        driver: "Jamie Rodriguez",
        vehicle: "Truck WH-456",
        distance: 162,
        totalCost: 0,
        externalId: "ext-67890",
        lastUpdated: new Date().toISOString(),
      },
    ];
    setWebhookTrips(mock);
  };

  useEffect(() => {
    fetchWebhookTrips();
  }, []);

  const rtUITrips: UITrip[] = useMemo(() => rtTrips.map(normalizeRtTrip), [rtTrips]);
  const allTrips: UITrip[] = useMemo(
    () => [...rtUITrips, ...webhookTrips, ...csvTrips],
    [rtUITrips, webhookTrips, csvTrips]
  );

  const webBookTrips = allTrips.filter((trip) => trip.importSource === "web_book");
  const manualTrips = allTrips.filter((trip) => trip.importSource !== "web_book");

  // -------------------- Actions --------------------
  const handleEdit = (trip: UITrip) => {
    setEditingTrip(trip);
    const cb = trip.costBreakdown || {};
    const cost =
      (cb.fuel || 0) +
        (cb.maintenance || 0) +
        (cb.driver || 0) +
        (cb.tolls || 0) +
        (cb.other || 0) ||
      trip.totalCost ||
      0;

    setEditForm({
      cost,
      fuel: cb.fuel || 0,
      maintenance: cb.maintenance || 0,
      driver: cb.driver || 0,
      tolls: cb.tolls || 0,
      other: cb.other || 0,
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const nv = parseFloat(value || "0") || 0;
    const updated = { ...editForm, [name]: nv };

    // recalc total
    const total =
      (updated.fuel || 0) +
      (updated.maintenance || 0) +
      (updated.driver || 0) +
      (updated.tolls || 0) +
      (updated.other || 0);

    setEditForm({ ...updated, cost: total });
  };

  const handleSaveCosts = async () => {
    if (!editingTrip) return;

    const updatedTrip: UITrip = {
      ...editingTrip,
      totalCost: editForm.cost,
      costBreakdown: {
        fuel: editForm.fuel,
        maintenance: editForm.maintenance,
        driver: editForm.driver,
        tolls: editForm.tolls,
        other: editForm.other,
      },
      lastUpdated: new Date().toISOString(),
    };

    // If trip came from Firestore (not webhook/csv), update there
    if (editingTrip.importSource !== "webhook" && editingTrip.importSource !== "csv") {
      try {
        await updateDoc(doc(db, "trips", editingTrip.id), {
          totalCost: updatedTrip.totalCost,
          costBreakdown: updatedTrip.costBreakdown,
          updatedAt: Date.now(),
        });
      } catch (err) {
        console.error("Failed to update Firestore trip cost", err);
      }
    }

    // Update local mirror (webhook/csv arrays)
    if (editingTrip.importSource === "webhook") {
      setWebhookTrips((prev) => prev.map((t) => (t.id === editingTrip.id ? updatedTrip : t)));
    } else if (editingTrip.importSource === "csv") {
      setCsvTrips((prev) => prev.map((t) => (t.id === editingTrip.id ? updatedTrip : t)));
    }

    setEditingTrip(null);
  };

  const handleDelete = (tripId: string) => {
    setConfirm({ open: true, tripId, action: "delete" });
  };

  const handleShip = async (trip: UITrip) => {
    setActionLoading(trip.id + ":ship");
    try {
      if (trip.importSource !== "webhook" && trip.importSource !== "csv") {
        await updateDoc(doc(db, "trips", trip.id), {
          shippedStatus: true,
          status: "shipped",
          updatedAt: Date.now(),
        });
      }
    } catch (err) {
      console.error("ship error", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeliver = async (trip: UITrip) => {
    setActionLoading(trip.id + ":deliver");
    try {
      if (trip.importSource !== "webhook" && trip.importSource !== "csv") {
        await updateDoc(doc(db, "trips", trip.id), {
          deliveredStatus: true,
          status: "delivered",
          updatedAt: Date.now(),
        });
      }
    } catch (err) {
      console.error("deliver error", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = async (trip: UITrip) => {
    setActionLoading(trip.id + ":complete");
    try {
      if (trip.importSource !== "webhook" && trip.importSource !== "csv") {
        await updateDoc(doc(db, "trips", trip.id), {
          status: "completed",
          completedAt: Date.now(),
        });
      }
    } catch (err) {
      console.error("complete error", err);
    } finally {
      setActionLoading(null);
    }
  };

  const confirmYes = async () => {
    if (!confirm.tripId || !confirm.action) return;
    const { tripId, action } = confirm;
    setActionLoading(tripId + ":" + action);

    try {
      if (action === "delete") {
        // If it's a Firestore trip, delete there. Otherwise, remove local.
        const rtTrip = rtUITrips.find((t) => t.id === tripId);
        if (rtTrip && rtTrip.importSource !== "webhook" && rtTrip.importSource !== "csv") {
          await deleteDoc(doc(db, "trips", tripId));
        } else {
          setWebhookTrips((prev) => prev.filter((t) => t.id !== tripId));
          setCsvTrips((prev) => prev.filter((t) => t.id !== tripId));
        }
      }
    } catch (err) {
      console.error("confirmYes error", err);
    } finally {
      setActionLoading(null);
      setConfirm({ open: false });
    }
  };

  // -------------------- CSV Import --------------------
  const handleFileUploadClick = () => fileInputRef.current?.click();

  const parseCSV = (text: string): UITrip[] => {
    const trips: UITrip[] = [];
    try {
      const lines = text.split("\n").filter((l) => l.trim() !== "");
      const headers = lines[0].split(",").map((h) => h.trim());

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim());
        if (values.length < headers.length) continue;

        const row: any = {};
        headers.forEach((h, idx) => (row[h] = values[idx]));

        trips.push({
          id: `csv-${Date.now()}-${i}`,
          loadRef: row["Trip Number"] || `CSV-${Date.now()}-${i}`,
          origin: row["Origin"] || "Unknown",
          destination: row["Destination"] || "Unknown",
          startTime: row["Start Date"] || new Date().toISOString(),
          endTime: row["End Date"] || new Date().toISOString(),
          status: "active",
          shippedStatus: false,
          deliveredStatus: false,
          importSource: "csv",
          driver: row["Driver"] || "Unknown",
          vehicle: row["Vehicle"] || "Unknown",
          distance: parseFloat(row["Distance"]) || 0,
          totalCost: parseFloat(row["Cost"]) || 0,
          costBreakdown: {
            fuel: parseFloat(row["Fuel Cost"]) || 0,
            maintenance: parseFloat(row["Maintenance Cost"]) || 0,
            driver: parseFloat(row["Driver Cost"]) || 0,
            tolls: parseFloat(row["Tolls"]) || 0,
            other: parseFloat(row["Other Costs"]) || 0,
          },
          lastUpdated: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error("parseCSV error", err);
      setCsvError("Failed to parse CSV. Check format.");
    }
    return trips;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setCsvError(null);
    setCsvSuccess(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const content = ev.target?.result as string;
        const imported = parseCSV(content);
        if (imported.length > 0) {
          setCsvTrips((prev) => [...prev, ...imported]);
          setCsvSuccess(`Successfully imported ${imported.length} trips.`);
        } else {
          setCsvError("No valid trips found in CSV.");
        }
      } catch (err) {
        console.error("import trips error", err);
        setCsvError("Failed to import trips.");
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.onerror = () => {
      setCsvError("Error reading the file.");
      setIsUploading(false);
    };
    reader.readAsText(file);
  };

  const handleDownloadTemplate = () => {
    const headers = [
      "Trip Number",
      "Origin",
      "Destination",
      "Start Date",
      "End Date",
      "Driver",
      "Vehicle",
      "Distance",
      "Cost",
      "Fuel Cost",
      "Maintenance Cost",
      "Driver Cost",
      "Tolls",
      "Other Costs",
    ];
    const sample =
      "TR-2025-0001,New York NY,Boston MA,2025-07-20,2025-07-22,John Doe,Truck 101,215,1200,600,200,300,75,25";
    const csv = [headers.join(","), sample].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "trips-import-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // -------------------- Render --------------------
  const StatusBadge: React.FC<{ status?: string; shipped?: boolean; delivered?: boolean }> = ({
    status,
    shipped,
    delivered,
  }) => {
    if (delivered) {
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          Delivered
        </span>
      );
    }
    if (shipped) {
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
          Shipped
        </span>
      );
    }
    return (
      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
        {status || "Pending"}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading active trips...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-red-800">Error loading trips</h3>
          <p className="mt-2 text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Active Trips</h1>
          <p className="text-gray-600">
            Real-time trip monitoring, webhook/CSV ingest en kostetoewysing
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-600">Real-time updates enabled</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <h3 className="text-lg font-medium">Filters</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filterWebBookOnly}
                onChange={(e) => setFilterWebBookOnly(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm">Web Book Trips Only</span>
            </label>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>

            {/* CSV & Webhook controls */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              className="hidden"
              onChange={handleFileUpload}
            />

            <button
              onClick={handleFileUploadClick}
              className="bg-purple-600 text-white px-3 py-1.5 rounded hover:bg-purple-700 text-sm"
              disabled={isUploading}
            >
              {isUploading ? "Importing..." : "Import CSV"}
            </button>

            <button
              onClick={handleDownloadTemplate}
              className="bg-gray-600 text-white px-3 py-1.5 rounded hover:bg-gray-700 text-sm"
            >
              Template
            </button>

            <button
              onClick={fetchWebhookTrips}
              className="bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 text-sm"
            >
              Refresh Webhook Trips
            </button>

            <Link
              to="/trips/add"
              className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 text-sm"
            >
              + New Trip
            </Link>
          </div>

          {(csvSuccess || csvError) && (
            <div className="mt-3">
              {csvSuccess && (
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded text-sm">
                  {csvSuccess}
                </div>
              )}
              {csvError && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm">{csvError}</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-600" />
              <div className="ml-5">
                <dt className="text-sm text-gray-500">Total Active</dt>
                <dd className="text-lg font-medium text-gray-900">{allTrips.length}</dd>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-green-600" />
              <div className="ml-5">
                <dt className="text-sm text-gray-500">Web Book</dt>
                <dd className="text-lg font-medium text-gray-900">{webBookTrips.length}</dd>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-5">
                <dt className="text-sm text-gray-500">Manual/CSV</dt>
                <dd className="text-lg font-medium text-gray-900">{manualTrips.length}</dd>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-purple-600" />
              <div className="ml-5">
                <dt className="text-sm text-gray-500">Delivered</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {allTrips.filter((t) => t.deliveredStatus).length}
                </dd>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Trips Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium text-gray-900">
            Live Active Trips ({allTrips.length})
          </h3>
          <p className="text-sm text-gray-600">Combined real-time + webhook + CSV</p>
        </CardHeader>
        <CardContent>
          {allTrips.length === 0 ? (
            <div className="text-center py-12">
              <TruckIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No active trips</h3>
              <p className="mt-1 text-sm text-gray-500">No trips match the current filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Load Ref
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Route
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allTrips.map((trip) => (
                    <tr
                      key={trip.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/trips/${trip.id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        <Link to={`/trips/${trip.id}`} onClick={(e) => e.stopPropagation()}>
                          {trip.loadRef}
                        </Link>
                        {trip.importSource === "webhook" && (
                          <span className="ml-2 px-2 inline-flex text-xs leading-5 font-medium rounded-full bg-blue-100 text-blue-800">
                            Webhook
                          </span>
                        )}
                        {trip.importSource === "csv" && (
                          <span className="ml-2 px-2 inline-flex text-xs leading-5 font-medium rounded-full bg-gray-100 text-gray-800">
                            CSV
                          </span>
                        )}
                        {trip.externalId && (
                          <div className="text-xs text-gray-500 mt-1">
                            Ext ID: {trip.externalId}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {trip.customer || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <span>{trip.origin || "-"}</span>
                          <span>→</span>
                          <span>{trip.destination || "-"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge
                          status={trip.status}
                          shipped={!!trip.shippedStatus}
                          delivered={!!trip.deliveredStatus}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          {trip.importSource === "web_book" ? (
                            <>
                              <Globe className="h-4 w-4 text-green-600" />
                              <span className="text-green-600 font-medium">Web Book</span>
                            </>
                          ) : trip.importSource === "webhook" ? (
                            <>
                              <TruckIcon className="h-4 w-4 text-blue-600" />
                              <span className="text-blue-600 font-medium">Webhook</span>
                            </>
                          ) : trip.importSource === "csv" ? (
                            <>
                              <TruckIcon className="h-4 w-4 text-gray-600" />
                              <span className="text-gray-600 font-medium">CSV</span>
                            </>
                          ) : (
                            <>
                              <TruckIcon className="h-4 w-4 text-blue-600" />
                              <span className="text-blue-600 font-medium">Manual</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {trip.startTime ? new Date(trip.startTime).toLocaleString() : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {trip.endTime ? new Date(trip.endTime).toLocaleString() : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {trip.totalCost != null
                          ? formatCurrency(trip.totalCost, displayCurrency)
                          : "-"}
                        {trip.costBreakdown && (
                          <button
                            className="text-xs text-blue-600 hover:underline ml-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(trip);
                            }}
                          >
                            View / Edit
                          </button>
                        )}
                      </td>

                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex flex-wrap gap-2">
                          <Link
                            to={`/trips/${trip.id}`}
                            className="inline-flex items-center text-blue-600 hover:underline"
                          >
                            <Eye className="w-4 h-4 mr-1" /> View
                          </Link>

                          <button
                            className="inline-flex items-center text-indigo-600 hover:underline"
                            onClick={() => handleEdit(trip)}
                          >
                            <Pencil className="w-4 h-4 mr-1" /> Edit Costs
                          </button>

                          <button
                            className="inline-flex items-center text-red-600 hover:underline"
                            disabled={actionLoading === trip.id + ":delete"}
                            onClick={() => handleDelete(trip.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            {actionLoading === trip.id + ":delete" ? "Deleting..." : "Delete"}
                          </button>

                          {!trip.shippedStatus && (
                            <button
                              className="inline-flex items-center text-blue-600 hover:underline"
                              disabled={actionLoading === trip.id + ":ship"}
                              onClick={() => handleShip(trip)}
                            >
                              <TruckIcon className="w-4 h-4 mr-1" />
                              {actionLoading === trip.id + ":ship" ? "Shipping..." : "Ship"}
                            </button>
                          )}

                          {!trip.deliveredStatus && (
                            <button
                              className="inline-flex items-center text-green-600 hover:underline"
                              disabled={actionLoading === trip.id + ":deliver"}
                              onClick={() => handleDeliver(trip)}
                            >
                              <PackageCheck className="w-4 h-4 mr-1" />
                              {actionLoading === trip.id + ":deliver" ? "Delivering..." : "Deliver"}
                            </button>
                          )}

                          {trip.status !== "completed" && (
                            <button
                              className="inline-flex items-center text-emerald-600 hover:underline"
                              disabled={actionLoading === trip.id + ":complete"}
                              onClick={() => handleComplete(trip)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              {actionLoading === trip.id + ":complete"
                                ? "Completing..."
                                : "Complete"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirm modal */}
      <Modal
        isOpen={confirm.open}
        onClose={() => setConfirm({ open: false })}
        title="Confirm action"
      >
        <p className="mb-4">Are you sure you want to {confirm.action} this trip?</p>
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 border rounded" onClick={() => setConfirm({ open: false })}>
            Cancel
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={confirmYes}>
            Yes, {confirm.action}
          </button>
        </div>
      </Modal>

      {/* Edit costs modal */}
      <Modal
        isOpen={!!editingTrip}
        onClose={() => setEditingTrip(null)}
        title={`Edit Trip Costs${editingTrip?.importSource === "webhook" ? " (Webhook)" : ""}`}
        maxWidth="2xl"
      >
        {editingTrip && (
          <>
            <div className="mb-4 text-sm">
              <p>
                <span className="font-medium">Trip:</span> {editingTrip.loadRef}
              </p>
              <p>
                <span className="font-medium">Route:</span> {editingTrip.origin} →{" "}
                {editingTrip.destination}
              </p>
              {editingTrip.externalId && (
                <p>
                  <span className="font-medium">External ID:</span> {editingTrip.externalId}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {["fuel", "maintenance", "driver", "tolls", "other"].map((k) => (
                <div key={k}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {k} Cost
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">R</span>
                    </div>
                    <input
                      type="number"
                      name={k as keyof CostBreakdown}
                      value={(editForm as any)[k]}
                      onChange={handleEditChange}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              ))}

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Cost</label>
                <div className="mt-1 relative rounded-md shadow-sm bg-gray-50">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">R</span>
                  </div>
                  <input
                    type="number"
                    name="cost"
                    value={editForm.cost}
                    readOnly
                    className="bg-gray-50 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Total word out-out bereken</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setEditingTrip(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCosts}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default ActiveTripsPageEnhanced;
