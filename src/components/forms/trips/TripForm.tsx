import React, { useState } from 'react';

interface FormData {
  tripNumber: string;
  origin: string;
  destination: string;
  driver: string;
  vehicle: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  distance: string;
  estimatedCost: string;
  notes: string;
  priority: string;
}

interface TripFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<FormData>;
}

const TripForm: React.FC<TripFormProps> = ({ onSubmit, onCancel, initialData = {} }) => {
  const [formData, setFormData] = useState<FormData>({
    tripNumber: initialData.tripNumber || `TR-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    origin: initialData.origin || '',
    destination: initialData.destination || '',
    driver: initialData.driver || '',
    vehicle: initialData.vehicle || '',
    startDate: initialData.startDate || '',
    startTime: initialData.startTime || '08:00',
    endDate: initialData.endDate || '',
    endTime: initialData.endTime || '17:00',
    distance: initialData.distance || '',
    estimatedCost: initialData.estimatedCost || '',
    notes: initialData.notes || '',
    priority: initialData.priority || 'normal'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await onSubmit(formData);
      // Success - let parent component handle redirection
    } catch (err) {
      setError('Failed to save trip data. Please try again.');
      console.error('Error saving trip:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="tripNumber" className="block text-sm font-medium mb-1">Trip Number</label>
            <input
              id="tripNumber"
              name="tripNumber"
              value={formData.tripNumber}
              onChange={handleChange}
              disabled
              className="w-full px-3 py-2 border rounded-md bg-gray-100 focus:outline-none"
            />
            <p className="text-sm text-gray-500 mt-1">Auto-generated trip number</p>
          </div>
          
          <div>
            <label htmlFor="priority" className="block text-sm font-medium mb-1">Priority</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="origin" className="block text-sm font-medium mb-1">Origin</label>
            <input
              id="origin"
              name="origin"
              placeholder="Starting location"
              value={formData.origin}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="destination" className="block text-sm font-medium mb-1">Destination</label>
            <input
              id="destination"
              name="destination"
              placeholder="End location"
              value={formData.destination}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="driver" className="block text-sm font-medium mb-1">Driver</label>
            <input
              id="driver"
              name="driver"
              placeholder="Assigned driver"
              value={formData.driver}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="vehicle" className="block text-sm font-medium mb-1">Vehicle</label>
            <input
              id="vehicle"
              name="vehicle"
              placeholder="Assigned vehicle"
              value={formData.vehicle}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium mb-1">Start Date</label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium mb-1">Start Time</label>
            <input
              id="startTime"
              name="startTime"
              type="time"
              value={formData.startTime}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium mb-1">End Date</label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="endTime" className="block text-sm font-medium mb-1">End Time</label>
            <input
              id="endTime"
              name="endTime"
              type="time"
              value={formData.endTime}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="distance" className="block text-sm font-medium mb-1">Distance (miles)</label>
            <input
              id="distance"
              name="distance"
              type="number"
              min="0"
              step="0.1"
              placeholder="Total distance"
              value={formData.distance}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="estimatedCost" className="block text-sm font-medium mb-1">Estimated Cost ($)</label>
            <input
              id="estimatedCost"
              name="estimatedCost"
              type="number"
              min="0"
              step="0.01"
              placeholder="Estimated cost"
              value={formData.estimatedCost}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="notes" className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              id="notes"
              name="notes"
              placeholder="Additional trip details or instructions"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 mt-6">
          <button 
            type="button" 
            onClick={onClick} 
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? 'Saving...' : 'Save Trip'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TripForm;
