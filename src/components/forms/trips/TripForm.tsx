import React, { useEffect, useState } from "react";
import { useWialonUnits } from "../../../hooks/useWialonUnits";
import { CLIENTS, DRIVERS, Trip } from "../../../types/index";
import Button from "../../ui/Button";
import { Input, Select, Textarea } from "../../ui/FormElements";

// Using the TripFormData type from types directory
import { TripFormData } from "../../../types/TripTypes";

interface TripFormProps {
  trip?: Trip;
  onSubmit: (tripData: TripFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

interface PlannedRoute {
  origin: string;
  destination: string;
  waypoints: string[];
  coordinates?: { lat: number; lng: number }[];
  estimatedDistance?: number;
  estimatedDuration?: number;
}

export const TripForm: React.FC<TripFormProps> = ({
  trip,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const { units: wialonUnits, loading: unitsLoading, error: unitsError } = useWialonUnits(true);

  const [fleetNumber, setFleetNumber] = useState("");
  const [fleetUnitId, setFleetUnitId] = useState<number | "">("");
  const [clientName, setClientName] = useState("");
  const [driverName, setDriverName] = useState("");
  const [route, setRoute] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [distanceKm, setDistanceKm] = useState(0);
  const [baseRevenue, setBaseRevenue] = useState(0);
  const [revenueCurrency, setRevenueCurrency] = useState<"USD" | "ZAR">("ZAR");
  const [clientType, setClientType] = useState<"internal" | "external">("external");
  const [plannedRoute, setPlannedRoute] = useState<PlannedRoute>({
    origin: "",
    destination: "",
    waypoints: [],
  });
  const [waypoint, setWaypoint] = useState("");
  const [waypoints, setWaypoints] = useState<string[]>([]);

  useEffect(() => {
    if (trip) {
      setFleetNumber(trip.fleetNumber || "");
      setFleetUnitId(
        trip.fleetUnitId !== undefined
          ? typeof trip.fleetUnitId === "string"
            ? Number(trip.fleetUnitId) || ""
            : trip.fleetUnitId
          : ""
      );
      setClientName(trip.clientName || "");
      setDriverName(trip.driverName || "");
      setRoute(trip.route || "");
      setStartDate(trip.startDate || new Date().toISOString().split("T")[0]);
      setEndDate(trip.endDate || new Date().toISOString().split("T")[0]);
      setDescription(trip.description || "");
      setDistanceKm(trip.distanceKm || 0);
      setBaseRevenue(trip.baseRevenue || 0);
      setRevenueCurrency(trip.revenueCurrency || "ZAR");
      setClientType(trip.clientType || "external");
      setPlannedRoute(trip.plannedRoute ?? { origin: "", destination: "", waypoints: [] });
      setWaypoints(trip.plannedRoute?.waypoints || []);
    }
  }, [trip]);

  const handleAddWaypoint = () => {
    if (waypoint.trim()) {
      setWaypoints([...waypoints, waypoint.trim()]);
      setWaypoint("");
    }
  };

  const handleRemoveWaypoint = (index: number) => {
    const updated = [...waypoints];
    updated.splice(index, 1);
    setWaypoints(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      fleetNumber,
      fleetUnitId: fleetUnitId === "" ? undefined : Number(fleetUnitId),
      clientName,
      driverName,
      route,
      startDate,
      endDate,
      description,
      distanceKm,
      baseRevenue,
      revenueCurrency,
      clientType,
      plannedRoute: { ...plannedRoute, waypoints },
      paymentStatus: trip?.paymentStatus ?? "unpaid",
      followUpHistory: trip?.followUpHistory ?? [],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {unitsLoading && <p>Loading fleet units...</p>}
      {unitsError && <p className="text-red-500">Error loading units.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Fleet Number"
          value={fleetNumber}
          onChange={(e) => {
            const selected = e.target.value;
            setFleetNumber(selected);
            const unit = wialonUnits.find((u: any) => u.name === selected);
            setFleetUnitId(unit?.id ?? "");
          }}
          options={[
            { value: "", label: "Select fleet number..." },
            ...wialonUnits.map((unit: any) => ({
              value: unit.name,
              label: `${unit.name} (${unit.registration || "No reg"})`,
            })),
          ]}
        />

        <Select
          label="Client"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          options={CLIENTS.map((client: any) => ({ value: client.name, label: client.name }))}
        />

        <Select
          label="Client Type"
          value={clientType}
          onChange={(e) => setClientType(e.target.value as "internal" | "external")}
          options={[
            { value: "external", label: "External" },
            { value: "internal", label: "Internal" },
          ]}
        />

        <Select
          label="Driver"
          value={driverName}
          onChange={(e) => setDriverName(e.target.value)}
          options={DRIVERS.map((driver: any) => ({ value: driver.name, label: driver.name }))}
        />

        <Input
          label="Route Name"
          value={route}
          onChange={(e) => setRoute(e.target.value)}
          placeholder="e.g., JHB to CPT"
        />

        <Input
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <Input
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <Input
          label="Distance (km)"
          type="number"
          value={distanceKm.toString()}
          onChange={(e) => setDistanceKm(parseFloat(e.target.value) || 0)}
        />

        <Input
          label="Base Revenue"
          type="number"
          value={baseRevenue.toString()}
          onChange={(e) => setBaseRevenue(parseFloat(e.target.value) || 0)}
        />

        <Select
          label="Currency"
          value={revenueCurrency}
          onChange={(e) => setRevenueCurrency(e.target.value as "USD" | "ZAR")}
          options={[
            { value: "ZAR", label: "ZAR" },
            { value: "USD", label: "USD" },
          ]}
        />
      </div>

      <div>
        <h3 className="text-md font-medium">Route Planning</h3>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Origin"
            value={plannedRoute.origin}
            onChange={(e) => setPlannedRoute({ ...plannedRoute, origin: e.target.value })}
          />
          <Input
            label="Destination"
            value={plannedRoute.destination}
            onChange={(e) => setPlannedRoute({ ...plannedRoute, destination: e.target.value })}
          />
        </div>

        <div className="mt-4">
          <label className="block font-medium mb-1">Waypoints</label>
          <div className="flex space-x-2">
            <Input
              label="Waypoint"
              value={waypoint}
              onChange={(e) => setWaypoint(e.target.value)}
              className="flex-1"
              placeholder="Add waypoint"
            />
            <Button type="button" onClick={handleAddWaypoint} variant="outline">
              Add
            </Button>
          </div>

          {waypoints.length > 0 && (
            <ul className="mt-2 space-y-1">
              {waypoints.map((wp, i) => (
                <li key={i} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span>{wp}</span>
                  <Button type="button" onClick={() => handleRemoveWaypoint(i)} variant="outline">
                    &times;
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Textarea
        label="Description / Notes"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Additional details about this trip"
        rows={3}
      />

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" onClick={onCancel} variant="outline" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
          {trip ? "Update Trip" : "Create Trip"}
        </Button>
      </div>
    </form>
  );
};

export default TripForm;
