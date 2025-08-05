import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWorkshop } from '../../context/WorkshopContext';
import {
  Tool,
  Truck,
  ShoppingCart,
  Clipboard,
  FileText,
  AlertTriangle,
  BarChart3,
  Package,
  Calendar,
  Search,
  UserCheck,
  Gauge
} from 'lucide-react';

// UI Components
import { Card, CardContent } from '../../components/ui';

const WorkshopPage: React.FC = () => {
  const { stockItems, vendors, purchaseOrders, isLoading, errors } = useWorkshop();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter for low stock items
  const lowStockItems = stockItems.filter(item => item.quantity <= item.reorderLevel);
  
  // Calculate total inventory value
  const totalInventoryValue = stockItems.reduce(
    (total, item) => total + item.quantity * item.cost, 
    0
  );
  
  // Filter for recent purchase orders
  const recentPOs = purchaseOrders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
    
  // Workshop modules
  const modules = [
    {
      title: 'Fleet Setup',
      description: 'Manage your fleet inventory',
      icon: Truck,
      link: '/workshop/fleet-setup',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Inspections',
      description: 'Vehicle inspections and reports',
      icon: Clipboard,
      link: '/workshop/inspections',
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Job Cards',
      description: 'Manage maintenance job cards',
      icon: FileText,
      link: '/workshop/job-cards',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Fault Tracking',
      description: 'Track and manage vehicle faults',
      icon: AlertTriangle,
      link: '/workshop/faults',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      title: 'Tyre Management',
      description: 'Track tyre inventory and usage',
      icon: Gauge,
      link: '/workshop/tyres',
      color: 'bg-red-100 text-red-600'
    },
    {
      title: 'Purchase Orders',
      description: 'Create and manage purchase orders',
      icon: ShoppingCart,
      link: '/workshop/purchase-orders',
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      title: 'Vendors',
      description: 'Manage supplier information',
      icon: UserCheck,
      link: '/workshop/vendors',
      color: 'bg-pink-100 text-pink-600'
    },
    {
      title: 'Stock Inventory',
      description: 'Manage parts and inventory',
      icon: Package,
      link: '/workshop/stock-inventory',
      color: 'bg-yellow-100 text-yellow-600'
    }
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Workshop Management Dashboard</h1>
        
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <Link 
            to="/workshop/vehicle-inspection"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center"
          >
            <Clipboard className="mr-2 h-4 w-4" />
            New Inspection
          </Link>
        </div>
      </div>

      {/* Dashboard Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Stock Items</p>
              <p className="text-2xl font-semibold text-gray-900">
                {isLoading.stockItems ? 'Loading...' : stockItems.length}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-semibold text-gray-900">
                {isLoading.stockItems ? 'Loading...' : lowStockItems.length}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Inventory Value</p>
              <p className="text-2xl font-semibold text-gray-900">
                {isLoading.stockItems 
                  ? 'Loading...' 
                  : `$${totalInventoryValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Workshop Modules */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Workshop Modules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {modules.map((module, index) => (
          <Link 
            key={index} 
            to={module.link}
            className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors duration-200"
          >
            <div className={`rounded-full p-3 w-12 h-12 flex items-center justify-center ${module.color} mb-4`}>
              <module.icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">{module.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{module.description}</p>
          </Link>
        ))}
      </div>
      
      {/* Recent Purchase Orders */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Recent Purchase Orders</h2>
          <Link 
            to="/workshop/purchase-orders"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View All
          </Link>
        </div>
        
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PO Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading.purchaseOrders ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : recentPOs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No purchase orders found
                    </td>
                  </tr>
                ) : (
                  recentPOs.map((po) => (
                    <tr key={po.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {po.poNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {po.vendor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(po.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          po.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          po.status === 'Ordered' ? 'bg-blue-100 text-blue-800' :
                          po.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {po.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${po.grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
      
      {/* Low Stock Items */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Low Stock Items</h2>
          <Link 
            to="/workshop/parts-ordering"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View All
          </Link>
        </div>
        
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reorder Level
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading.stockItems ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : lowStockItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No low stock items found
                    </td>
                  </tr>
                ) : (
                  lowStockItems.slice(0, 5).map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.itemCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.itemName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.quantity <= item.reorderLevel * 0.5 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.quantity} {item.unit}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.reorderLevel} {item.unit}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WorkshopPage;
