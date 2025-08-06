import { Download, Filter, Search, UserPlus } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Driver Profiles Page
 * Shows a list of all drivers with filtering and search capabilities
 */
const DriverProfiles: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock driver data
  const drivers = [
    { id: 'DR-1001', firstName: 'John', lastName: 'Smith', status: 'Active', licenseExpiry: '2024-05-15', phone: '(555) 123-4567', safetyScore: 95, location: 'Phoenix, AZ' },
    { id: 'DR-1002', firstName: 'Michael', lastName: 'Johnson', status: 'Active', licenseExpiry: '2023-11-20', phone: '(555) 234-5678', safetyScore: 98, location: 'Dallas, TX' },
    { id: 'DR-1003', firstName: 'Robert', lastName: 'Williams', status: 'On Leave', licenseExpiry: '2024-02-10', phone: '(555) 345-6789', safetyScore: 88, location: 'Denver, CO' },
    { id: 'DR-1004', firstName: 'David', lastName: 'Brown', status: 'Active', licenseExpiry: '2024-07-22', phone: '(555) 456-7890', safetyScore: 94, location: 'Seattle, WA' },
    { id: 'DR-1005', firstName: 'Sarah', lastName: 'Davis', status: 'Active', licenseExpiry: '2023-12-05', phone: '(555) 567-8901', safetyScore: 97, location: 'Atlanta, GA' },
    { id: 'DR-1006', firstName: 'James', lastName: 'Miller', status: 'Inactive', licenseExpiry: '2023-10-30', phone: '(555) 678-9012', safetyScore: 82, location: 'Miami, FL' },
    { id: 'DR-1007', firstName: 'Patricia', lastName: 'Wilson', status: 'Active', licenseExpiry: '2024-04-18', phone: '(555) 789-0123', safetyScore: 91, location: 'Chicago, IL' },
    { id: 'DR-1008', firstName: 'Jennifer', lastName: 'Moore', status: 'Active', licenseExpiry: '2024-03-12', phone: '(555) 890-1234', safetyScore: 93, location: 'Boston, MA' },
  ];

  // Filter drivers based on search term and status filter
  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch =
      driver.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || driver.status.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Driver Profiles</h2>
        <Link
          to="/drivers/add"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Driver
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
          {/* Search Bar */}
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search drivers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            {/* Status Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Filter className="w-5 h-5 text-gray-400" />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on leave">On Leave</option>
              </select>
            </div>

            {/* Export Button */}
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50" onClick={() => {}}>
              <Download className="w-5 h-5 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Drivers Table */}
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Expiry</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Safety Score</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDrivers.map((driver) => {
                // Calculate days until license expiry
                const today = new Date();
                const expiryDate = new Date(driver.licenseExpiry);
                const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                return (
                  <tr key={driver.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {driver.firstName} {driver.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{driver.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        driver.status === 'Active' ? 'bg-green-100 text-green-800' :
                        driver.status === 'Inactive' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {driver.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{new Date(driver.licenseExpiry).toLocaleDateString()}</div>
                      <div className={`text-xs ${
                        daysUntilExpiry < 30 ? 'text-red-600 font-medium' :
                        daysUntilExpiry < 60 ? 'text-amber-600' : 'text-gray-500'
                      }`}>
                        {daysUntilExpiry < 0 ? 'Expired' :
                         daysUntilExpiry === 0 ? 'Expires today' :
                         `${daysUntilExpiry} days left`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {driver.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${
                              driver.safetyScore >= 90 ? 'bg-green-500' :
                              driver.safetyScore >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${driver.safetyScore}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-700">{driver.safetyScore}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {driver.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/drivers/profiles/${driver.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                        View
                      </Link>
                      <Link to={`/drivers/edit/${driver.id}`} className="text-blue-600 hover:text-blue-900">
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
          <div className="flex-1 flex justify-between sm:hidden">
            <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </a>
            <a href="#" className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </a>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredDrivers.length}</span> of{" "}
                <span className="font-medium">{filteredDrivers.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" aria-current="page" className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  1
                </a>
                <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverProfiles;
