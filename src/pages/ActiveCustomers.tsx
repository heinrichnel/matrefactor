import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Component for displaying and managing active customers
 */
const ActiveCustomers: React.FC = () => {
  // Mock data
  const customers = Array.from({ length: 15 }, (_, i) => ({
    id: `CL-${1001 + i}`,
    name: [
      'Logistics Pro Ltd.',
      'Fast Transport Inc.',
      'Global Shipping Co.',
      'Local Movers LLC',
      'Premium Freight Services',
      'Express Cargo Solutions',
      'Urban Delivery Networks',
      'Continental Carriers',
      'National Logistics',
      'Regional Transport Co.',
      'Elite Freight Systems',
      'Sunshine Distributors',
      'Metro Shipping Alliance',
      'Pacific Route Logistics',
      'Alpine Cargo Express'
    ][i],
    industry: i % 3 === 0 ? 'Logistics' : i % 3 === 1 ? 'Manufacturing' : 'Retail',
    contactPerson: [
      'John Smith',
      'Maria Garcia',
      'Robert Johnson',
      'Lisa Chen',
      'David Williams',
      'Sarah Brown',
      'Michael Jones',
      'Emily Wilson',
      'James Taylor',
      'Jennifer Lee',
      'Daniel Martinez',
      'Rachel Anderson',
      'Thomas Jackson',
      'Olivia White',
      'Christopher Harris'
    ][i],
    email: `contact${1001 + i}@example.com`,
    phone: `+1 (555) ${100 + i}-${2000 + i}`,
    lastOrder: new Date(2023, 6, 21 - (i % 30)).toISOString().split('T')[0],
    revenue: Math.round((75000 + i * 10000) / 1000) * 1000,
    orders: 5 + (i % 10),
    status: 'Active'
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Active Customers</h1>
        <div className="flex space-x-2">
          <Link to="/clients?action=new" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Add New Customer
          </Link>
          <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200" onClick={() => {}}>
            Export List
          </button>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <input 
                type="text"
                className="w-full border border-gray-300 rounded-md p-2 pl-10"
                placeholder="Search customers..."
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Industry
            </label>
            <select className="w-full border border-gray-300 rounded-md p-2">
              <option value="">All Industries</option>
              <option>Logistics</option>
              <option>Manufacturing</option>
              <option>Retail</option>
              <option>Distribution</option>
              <option>Construction</option>
              <option>Agriculture</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select className="w-full border border-gray-300 rounded-md p-2">
              <option value="name">Company Name</option>
              <option value="recent">Recent Orders</option>
              <option value="revenue-high">Revenue (High to Low)</option>
              <option value="revenue-low">Revenue (Low to High)</option>
              <option value="orders">Number of Orders</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700" onClick={() => {}}>
              Apply
            </button>
          </div>
        </div>
      </div>
      
      {/* Customer list */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="mr-2" />
                  Customer
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Person</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Order</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center">
                      <input type="checkbox" className="mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">{customer.name}</div>
                        <div className="text-xs text-gray-500">{customer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{customer.industry}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{customer.contactPerson}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{customer.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{customer.phone}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{customer.lastOrder}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">${customer.revenue.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{customer.orders}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex space-x-2">
                      <Link to={`/clients/${customer.id}`} className="text-blue-600 hover:text-blue-800">View</Link>
                      <Link to={`/clients/${customer.id}/edit`} className="text-gray-600 hover:text-gray-800">Edit</Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
          <div className="flex flex-1 justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50" onClick={() => {}}>
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50" onClick={() => {}}>
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">15</span> of{' '}
                <span className="font-medium">98</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50" onClick={() => {}}>
                  Previous
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-gray-50" onClick={() => {}}>
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => {}}>
                  2
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => {}}>
                  3
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => {}}>
                  4
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => {}}>
                  5
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50" onClick={() => {}}>
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bulk Actions */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">Bulk Actions</h2>
        <div className="flex flex-wrap gap-2">
          <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200" onClick={() => {}}>
            Send Email
          </button>
          <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200" onClick={() => {}}>
            Export Selected
          </button>
          <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200" onClick={() => {}}>
            Add Tags
          </button>
          <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200" onClick={() => {}}>
            Update Status
          </button>
          <button className="bg-red-50 text-red-600 px-4 py-2 rounded-md hover:bg-red-100" onClick={() => {}}>
            Delete Selected
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveCustomers;
