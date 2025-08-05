import React, { useState, useEffect } from 'react';
import Card, { CardContent, CardHeader } from '../../../components/ui/Card';
import { MapPin, Filter, Layers, Navigation, Truck, RefreshCw } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { useAppContext } from '../../../context/AppContext';
import SyncIndicator from '../../../components/ui/SyncIndicator';
import FleetMapComponent from '../FleetMapComponent';
import { wialonFleetData } from '../../../utils/fleetGeoJson';

// Create vehicle mapping from Wialon fleet data
const vehicleMapping = wialonFleetData.map(unit => ({
  id: unit.general.uid,
  name: unit.general.n,
  brand: unit.profile?.find(p => p.n === 'brand')?.v || 'Unknown',
  model: unit.profile?.find(p => p.n === 'model')?.v || 'Unknown',
  vehicleType: unit.profile?.find(p => p.n === 'vehicle_class')?.v || 'Unknown',
  // Default coordinates for Namibia (will be updated with real positions in production)
  position: { lat: -22.5597 + (Math.random() * 2 - 1), lng: 17.0832 + (Math.random() * 2 - 1) }
}));

const Maps: React.FC = () => {
  const { isLoading } = useAppContext();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | undefined>(undefined);
  const [mapZoom, setMapZoom] = useState(6);

  // Handle vehicle selection from table
  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
  };

  // Handle vehicle change from dropdown
  const handleVehicleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVehicleId(e.target.value || undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fleet Tracking</h1>
          <p className="text-gray-600">Real-time vehicle tracking and route visualization</p>
        </div>
        <div className="flex space-x-2 items-center">
          <SyncIndicator />
          <Button
            variant="outline"
            icon={<Filter className="w-4 h-4" />}
          >
            Filter View
          </Button>
          <Button
            variant="outline"
            icon={<Layers className="w-4 h-4" />}
          >
            Map Layers
          </Button>
        </div>
      </div>

      {/* Map Controls Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-grow">
              <label htmlFor="vehicle-select" className="block text-sm font-medium text-gray-700 mb-1">
                Select Vehicle
              </label>
              <select
                id="vehicle-select"
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={selectedVehicleId || ''}
                onChange={handleVehicleChange}
              >
                <option value="">All Vehicles</option>
                {vehicleMapping.map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex space-x-2 items-center">
              <Button 
                size="sm" 
                variant="outline" 
                icon={<Truck className="w-4 h-4" />}
              >
                All Vehicles
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                icon={<Navigation className="w-4 h-4" />}
              >
                Active Routes
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                disabled={isLoading?.trips}
                icon={<RefreshCw className="w-4 h-4" />}
                onClick={() => setSelectedVehicleId(undefined)}
              >
                Reset View
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Map Card */}
      <Card>
        <CardContent className="p-0">
          <div className="w-full h-[600px] relative">
            <FleetMapComponent
              centerOn={selectedVehicleId}
              initialZoom={mapZoom}
              initialCenter={{ lat: -22.5597, lng: 17.0832 }} // Default to Windhoek
              className="rounded-md"
              onVehicleSelect={handleVehicleSelect}
            />
          </div>
        </CardContent>
      </Card>

      {/* Active Vehicles Card */}
      <Card>
        <CardHeader title="Active Vehicles" />
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heading</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Speed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trip ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vehicleMapping.map((vehicle, i) => (
                  <tr 
                    key={vehicle.id} 
                    className={`hover:bg-gray-50 cursor-pointer ${selectedVehicleId === vehicle.id ? 'bg-blue-50' : ''}`}
                    onClick={() => setSelectedVehicleId(vehicle.id)}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-blue-600">{vehicle.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Driver {i + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {['Windhoek Central', 'Walvis Bay Port', 'Keetmanshoop', 'Ondangwa Town', 'B1 Highway KM 145'][i % 5]}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {['North', 'East', 'South', 'West', 'North-East'][i % 5]}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {[0, 65, 80, 45, 72][i % 5]} km/h
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      TRP-2025{(100 + i).toString().padStart(3, '0')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVehicleId(vehicle.id);
                          setMapZoom(16);
                        }}
                      >
                        Locate
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Maps;