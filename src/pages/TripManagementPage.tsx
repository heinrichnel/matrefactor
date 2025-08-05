import React from 'react';

const TripManagementPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Trip Management</h1>
      
      <div className="mb-8">
        <p className="text-lg text-gray-600">
          Manage your fleet trips, monitor active trips, and optimize routes for maximum efficiency.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Active Trips</h2>
          <p className="text-gray-600">View and manage currently active trips</p>
          <div className="mt-4">
            <button className="text-blue-600 hover:text-blue-800">View Active Trips →</button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Trip Timeline</h2>
          <p className="text-gray-600">Review trip schedules and timelines</p>
          <div className="mt-4">
            <button className="text-blue-600 hover:text-blue-800">View Timeline →</button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Route Planning</h2>
          <p className="text-gray-600">Plan optimal routes for your fleet</p>
          <div className="mt-4">
            <button className="text-blue-600 hover:text-blue-800">Plan Routes →</button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Route Optimization</h2>
          <p className="text-gray-600">Optimize existing routes for fuel efficiency</p>
          <div className="mt-4">
            <button className="text-blue-600 hover:text-blue-800">Optimize Routes →</button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Load Planning</h2>
          <p className="text-gray-600">Plan and manage cargo loads</p>
          <div className="mt-4">
            <button className="text-blue-600 hover:text-blue-800">Plan Loads →</button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Add New Trip</h2>
          <p className="text-gray-600">Create and schedule a new trip</p>
          <div className="mt-4">
            <button className="text-blue-600 hover:text-blue-800">Add Trip →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripManagementPage;
