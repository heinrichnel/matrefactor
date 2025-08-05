import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import Input from '../../components/ui/Input';

interface TripFormProps {
  onSubmit: (trip: any) => void;
  onCancel: () => void;
}

const TripForm: React.FC<TripFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    route: '',
    startLocation: '',
    endLocation: '',
    driverId: '',
    driverName: '',
    vehicleId: '',
    vehiclePlate: '',
    distance: 0,
    estimatedDuration: 0,
    loadType: '',
    priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent',
    scheduledDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clientId || !formData.route || !formData.driverId) {
      alert('Please fill in all required fields');
      return;
    }

    const trip = {
      ...formData,
      id: Date.now().toString(),
      status: 'created',
      createdAt: new Date().toISOString(),
    };

    onSubmit(trip);
  };

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-gray-600' },
    { value: 'normal', label: 'Normal', color: 'text-blue-600' },
    { value: 'high', label: 'High', color: 'text-orange-600' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-600' },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Create New Trip</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Client Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Client ID *
            </label>
            <Input
              type="text"
              value={formData.clientId}
              onChange={(e) => handleChange('clientId', e.target.value)}
              placeholder="Enter client ID"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Client Name
            </label>
            <Input
              type="text"
              value={formData.clientName}
              onChange={(e) => handleChange('clientName', e.target.value)}
              placeholder="Enter client name"
            />
          </div>
        </div>

        {/* Route Information */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Route Description *
          </label>
          <Input
            type="text"
            value={formData.route}
            onChange={(e) => handleChange('route', e.target.value)}
            placeholder="e.g., Johannesburg to Cape Town"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Start Location
            </label>
            <Input
              type="text"
              value={formData.startLocation}
              onChange={(e) => handleChange('startLocation', e.target.value)}
              placeholder="Starting point"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              End Location
            </label>
            <Input
              type="text"
              value={formData.endLocation}
              onChange={(e) => handleChange('endLocation', e.target.value)}
              placeholder="Destination"
            />
          </div>
        </div>

        {/* Driver and Vehicle */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Driver ID *
            </label>
            <Input
              type="text"
              value={formData.driverId}
              onChange={(e) => handleChange('driverId', e.target.value)}
              placeholder="Enter driver ID"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Driver Name
            </label>
            <Input
              type="text"
              value={formData.driverName}
              onChange={(e) => handleChange('driverName', e.target.value)}
              placeholder="Driver full name"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Vehicle ID
            </label>
            <Input
              type="text"
              value={formData.vehicleId}
              onChange={(e) => handleChange('vehicleId', e.target.value)}
              placeholder="Vehicle ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Vehicle Plate
            </label>
            <Input
              type="text"
              value={formData.vehiclePlate}
              onChange={(e) => handleChange('vehiclePlate', e.target.value)}
              placeholder="License plate"
            />
          </div>
        </div>

        {/* Trip Details */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Distance (km)
            </label>
            <Input
              type="number"
              min="0"
              value={formData.distance}
              onChange={(e) => handleChange('distance', parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Est. Duration (hours)
            </label>
            <Input
              type="number"
              min="0"
              step="0.5"
              value={formData.estimatedDuration}
              onChange={(e) => handleChange('estimatedDuration', parseFloat(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {priorities.map((priority) => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Load Type
            </label>
            <Input
              type="text"
              value={formData.loadType}
              onChange={(e) => handleChange('loadType', e.target.value)}
              placeholder="Type of cargo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Scheduled Date
            </label>
            <Input
              type="date"
              value={formData.scheduledDate}
              onChange={(e) => handleChange('scheduledDate', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Additional trip notes..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Create Trip
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default TripForm;
