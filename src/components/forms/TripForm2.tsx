import React, { useState, useEffect } from "react";
import { Input, Select, Textarea } from '../../ui/FormElements';
import Button from '../../ui/Button';

import { Trip, CLIENTS, DRIVERS } from '../../../types/index';
import { useWialonUnits } from "../../../hooks/useWialonUnits";

interface TripFormProps {
  trip?: Trip;
  onSubmit: (tripData: Omit<Trip, 'id' | 'costs' | 'status' | 'additionalCosts'>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const TripForm: React.FC<TripFormProps> = ({ trip, onSubmit, onCancel, isSubmitting = false }) => {
  const { units: wialonUnits, loading: unitsLoading, error: unitsError } = useWialonUnits(true);

  const [fleetNumber, setFleetNumber] = useState('');
  const [fleetUnitId, setFleetUnitId] = useState<number | "">("");
  const [clientName, setClientName] = useState('');
  const [driverName, setDriverName] = useState('');
  const [route, setRoute] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [distanceKm, setDistanceKm] = useState(0);
  const [baseRevenue, setBaseRevenue] = useState(0);
  const [revenueCurrency, setRevenueCurrency] = useState<'USD' | 'ZAR'>('ZAR');
  const [clientType, setClientType] = useState<'internal' | 'external'>('external');
  const [plannedRoute, setPlannedRoute] = useState<{ origin: string; destination: string; waypoints: string[]; }>({
    origin: '',
    destination: '',
    waypoints: []
  });
  const [waypoint, setWaypoint] = useState('');
  const [waypoints, setWaypoints] = useState<string[]>([]);

  // Initialize form if trip is provided (edit mode)
  useEffect(() => {
    if (trip) {
      setFleetNumber(trip.fleetNumber || '');
      setFleetUnitId(trip.fleetUnitId !== undefined ? trip.fleetUnitId : "");
      setClientName(trip.clientName || '');
      setDriverName(trip.driverName || '');
      setRoute(trip.route || '');
      setStartDate(trip.startDate || new Date().toISOString().split('T')[0]);
      setEndDate(trip.endDate || new Date().toISOString().split('T')[0]);
      setDescription(trip.description || '');
      setDistanceKm(trip.distanceKm || 0);
      setBaseRevenue(trip.baseRevenue || 0);
      setRevenueCurrency(trip.revenueCurrency || 'ZAR');
      setClientType(trip.clientType || 'external');
      
      if (trip.plannedRoute) {
        setPlannedRoute(trip.plannedRoute);
        setWaypoints(trip.plannedRoute.waypoints || []);
      }
    }
  }, [trip]);

  const handleAddWaypoint = () => {
    if (waypoint.trim()) {
      setWaypoints([...waypoints, waypoint.trim()]);
      setWaypoint('');
    }
  };

  const handleRemoveWaypoint = (index: number) => {
    const newWaypoints = [...waypoints];
    newWaypoints.splice(index, 1);
    setWaypoints(newWaypoints);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedPlannedRoute = {
      origin: plannedRoute.origin,
      destination: plannedRoute.destination,
      waypoints
    };
    
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
      plannedRoute: updatedPlannedRoute
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Trip Details</h3>
          
          <Select
            label="Fleet Number"
            value={fleetNumber}
            onChange={(e) => {
              const selectedFleet = e.target.value;
              setFleetNumber(selectedFleet);
              
              // Find the corresponding wialon unit ID
              const unit = wialonUnits.find(u => u.name === selectedFleet);
              setFleetUnitId(unit ? unit.id : "");
            }}
            options={[
              { value: "", label: "Select fleet number..." },
              ...wialonUnits.map(unit => ({
                value: unit.name,
                label: `${unit.name} (${unit.registration || 'No reg'})`
              }))
            ]}
          />
          
          <Select
            label="Client"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            options={[
              { value: "", label: "Select client..." },
              ...CLIENTS.map(client => ({
                value: client.name,
                label: client.name
              }))
            ]}
          />
          
          <Select
            label="Client Type"
            value={clientType}
            onChange={(e) => setClientType(e.target.value as 'internal' | 'external')}
            options={[
              { value: "external", label: "External" },
              { value: "internal", label: "Internal" }
            ]}
          />
          
          <Select
            label="Driver"
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
            options={[
              { value: "", label: "Select driver..." },
              ...DRIVERS.map(driver => ({
                value: driver.name,
                label: driver.name
              }))
            ]}
          />
          
          <Input
            label="Route Name"
            value={route}
            onChange={(e) => setRoute(e.target.value)}
            placeholder="e.g., JHB to CPT"
          />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Schedule & Financials</h3>
          
          <Input
            type="date"
            label="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          
          <Input
            type="date"
            label="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          
          <Input
            type="number"
            label="Distance (km)"
            value={distanceKm.toString()}
            onChange={(e) => setDistanceKm(parseFloat(e.target.value) || 0)}
            min="0"
            step="0.1"
          />
          
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                type="number"
                label="Base Revenue"
                value={baseRevenue.toString()}
                onChange={(e) => setBaseRevenue(parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
              />
            </div>
            <div className="w-24 mt-auto">
              <Select
                label="Currency"
                value={revenueCurrency}
                onChange={(e) => setRevenueCurrency(e.target.value as 'USD' | 'ZAR')}
                options={[
                  { value: "ZAR", label: "ZAR" },
                  { value: "USD", label: "USD" }
                ]}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Route Planning</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Origin"
            value={plannedRoute.origin}
            onChange={(e) => setPlannedRoute({...plannedRoute, origin: e.target.value})}
            placeholder="Starting point"
          />
          
          <Input
            label="Destination"
            value={plannedRoute.destination}
            onChange={(e) => setPlannedRoute({...plannedRoute, destination: e.target.value})}
            placeholder="Final destination"
          />
        </div>
        
        <div>
          <label className="block font-medium mb-1">Waypoints</label>
          <div className="flex space-x-2">
            <Input
              value={waypoint}
              onChange={(e) => setWaypoint(e.target.value)}
              placeholder="Add waypoint"
              className="flex-1"
            />
            <Button 
              type="button" 
              onClick={handleAddWaypoint}
              variant="outline"
            >
              Add
            </Button>
          </div>
          
          {waypoints.length > 0 && (
            <div className="mt-2 space-y-1">
              {waypoints.map((wp, index) => (
                <div key={index} className="flex items-center bg-gray-50 p-2 rounded">
                  <span className="flex-1">{wp}</span>
                  <Button 
                    type="button" 
                    onClick={() => handleRemoveWaypoint(index)}
                    variant="outline"
                    className="p-1 h-auto"
                  >
                    &times;
                  </Button>
                </div>
              ))}
            </div>
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
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button 
          type="button" 
          onClick={onCancel} 
          variant="outline"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          {trip ? 'Update Trip' : 'Create Trip'}
        </Button>
      </div>
    </form>
  );
};

export default TripForm;
