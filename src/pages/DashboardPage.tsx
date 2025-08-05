import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Fleet Overview</h2>
          <p className="text-gray-600">View your fleet status and performance metrics</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Active Trips</h2>
          <p className="text-gray-600">Monitor ongoing trips and delivery status</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Driver Status</h2>
          <p className="text-gray-600">Check driver availability and performance</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Maintenance Alerts</h2>
          <p className="text-gray-600">View upcoming and overdue maintenance tasks</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Fuel Analytics</h2>
          <p className="text-gray-600">Track fuel consumption and efficiency</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Compliance Status</h2>
          <p className="text-gray-600">Monitor regulatory compliance and documentation</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
