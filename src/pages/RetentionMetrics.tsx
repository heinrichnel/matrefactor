import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Filter, Download, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import SyncIndicator from '../components/ui/SyncIndicator';

interface RetentionData {
  period: string;
  retentionRate: number;
  churnRate: number;
  newCustomers: number;
  recurringCustomers: number;
}

interface RetentionFilter {
  timeframe: string;
  customerCategory: string;
  region: string;
}

const RetentionMetrics: React.FC = () => {
  const [filter, setFilter] = useState<RetentionFilter>({
    timeframe: 'year',
    customerCategory: 'all',
    region: 'all'
  });

  const [metrics, setMetrics] = useState({
    currentRetention: 87.5,
    previousRetention: 85.2,
    targetRetention: 90,
    churnRate: 12.5,
    atRiskCustomers: 8,
    lifetimeValue: 125000,
    avgCustomerAge: 3.2, // years
    reactivationRate: 15.3
  });

  // Mock data for retention over time
  const [retentionData, setRetentionData] = useState<RetentionData[]>([
    { period: 'Jan', retentionRate: 82, churnRate: 18, newCustomers: 5, recurringCustomers: 95 },
    { period: 'Feb', retentionRate: 84, churnRate: 16, newCustomers: 7, recurringCustomers: 98 },
    { period: 'Mar', retentionRate: 83, churnRate: 17, newCustomers: 4, recurringCustomers: 96 },
    { period: 'Apr', retentionRate: 85, churnRate: 15, newCustomers: 6, recurringCustomers: 99 },
    { period: 'May', retentionRate: 86, churnRate: 14, newCustomers: 5, recurringCustomers: 102 },
    { period: 'Jun', retentionRate: 85, churnRate: 15, newCustomers: 3, recurringCustomers: 100 },
    { period: 'Jul', retentionRate: 88, churnRate: 12, newCustomers: 6, recurringCustomers: 103 },
    { period: 'Aug', retentionRate: 87, churnRate: 13, newCustomers: 4, recurringCustomers: 101 },
    { period: 'Sep', retentionRate: 85, churnRate: 15, newCustomers: 5, recurringCustomers: 100 },
    { period: 'Oct', retentionRate: 86, churnRate: 14, newCustomers: 7, recurringCustomers: 102 },
    { period: 'Nov', retentionRate: 88, churnRate: 12, newCustomers: 8, recurringCustomers: 105 },
    { period: 'Dec', retentionRate: 87.5, churnRate: 12.5, newCustomers: 6, recurringCustomers: 104 }
  ]);

  // Mock at-risk customers
  const atRiskCustomers = [
    { id: 'CL-1023', name: 'Logistics Inc.', value: 85000, lastOrder: '45 days ago', riskScore: 'High', indicator: 'Decreased order frequency' },
    { id: 'CL-1045', name: 'FastTruck Services', value: 62000, lastOrder: '60 days ago', riskScore: 'High', indicator: 'Support tickets increasing' },
    { id: 'CL-1078', name: 'Global Transit Co', value: 112000, lastOrder: '30 days ago', riskScore: 'Medium', indicator: 'Price sensitivity' },
    { id: 'CL-1103', name: 'Mountain Movers', value: 48000, lastOrder: '90 days ago', riskScore: 'Very High', indicator: 'Competitor interaction' }
  ];

  const handleFilterChange = (field: keyof RetentionFilter, value: string) => {
    setFilter(prev => ({ ...prev, [field]: value }));
    
    // In a real application, this would fetch new data based on the filter
    // For now, we'll just simulate a data change
    if (field === 'timeframe') {
      if (value === 'quarter') {
        setRetentionData(retentionData.slice(9, 12));
      } else if (value === 'month') {
        setRetentionData(retentionData.slice(11, 12));
      } else if (value === 'week') {
        // Create weekly data
        setRetentionData([
          { period: 'Week 1', retentionRate: 87, churnRate: 13, newCustomers: 2, recurringCustomers: 104 },
          { period: 'Week 2', retentionRate: 88, churnRate: 12, newCustomers: 1, recurringCustomers: 105 },
          { period: 'Week 3', retentionRate: 87.5, churnRate: 12.5, newCustomers: 3, recurringCustomers: 104 },
          { period: 'Week 4', retentionRate: 87.5, churnRate: 12.5, newCustomers: 0, recurringCustomers: 104 }
        ]);
      } else {
        // Restore full year data
        setRetentionData([
          { period: 'Jan', retentionRate: 82, churnRate: 18, newCustomers: 5, recurringCustomers: 95 },
          { period: 'Feb', retentionRate: 84, churnRate: 16, newCustomers: 7, recurringCustomers: 98 },
          { period: 'Mar', retentionRate: 83, churnRate: 17, newCustomers: 4, recurringCustomers: 96 },
          { period: 'Apr', retentionRate: 85, churnRate: 15, newCustomers: 6, recurringCustomers: 99 },
          { period: 'May', retentionRate: 86, churnRate: 14, newCustomers: 5, recurringCustomers: 102 },
          { period: 'Jun', retentionRate: 85, churnRate: 15, newCustomers: 3, recurringCustomers: 100 },
          { period: 'Jul', retentionRate: 88, churnRate: 12, newCustomers: 6, recurringCustomers: 103 },
          { period: 'Aug', retentionRate: 87, churnRate: 13, newCustomers: 4, recurringCustomers: 101 },
          { period: 'Sep', retentionRate: 85, churnRate: 15, newCustomers: 5, recurringCustomers: 100 },
          { period: 'Oct', retentionRate: 86, churnRate: 14, newCustomers: 7, recurringCustomers: 102 },
          { period: 'Nov', retentionRate: 88, churnRate: 12, newCustomers: 8, recurringCustomers: 105 },
          { period: 'Dec', retentionRate: 87.5, churnRate: 12.5, newCustomers: 6, recurringCustomers: 104 }
        ]);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Customer Retention Metrics</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            icon={<Download className="w-4 h-4" />}
          >
            Export Report
          </Button>
          <SyncIndicator />
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <select
            value={filter.timeframe}
            onChange={(e) => handleFilterChange('timeframe', e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Filter className="w-5 h-5 text-gray-400" />
          </div>
          <select
            value={filter.customerCategory}
            onChange={(e) => handleFilterChange('customerCategory', e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Customer Categories</option>
            <option value="vip">VIP Customers</option>
            <option value="regular">Regular Customers</option>
            <option value="new">New Customers (&lt; 1 year)</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Filter className="w-5 h-5 text-gray-400" />
          </div>
          <select
            value={filter.region}
            onChange={(e) => handleFilterChange('region', e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Regions</option>
            <option value="north">Northern Region</option>
            <option value="south">Southern Region</option>
            <option value="east">Eastern Region</option>
            <option value="west">Western Region</option>
            <option value="central">Central Region</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-gray-500">Retention Rate</div>
            <div className="flex items-end mt-1">
              <div className="text-2xl font-bold text-green-600">{metrics.currentRetention}%</div>
              <div className="flex items-center ml-2 text-sm">
                {metrics.currentRetention > metrics.previousRetention ? (
                  <span className="text-green-600 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +{(metrics.currentRetention - metrics.previousRetention).toFixed(1)}%
                  </span>
                ) : (
                  <span className="text-red-600 flex items-center">
                    <TrendingDown className="w-4 h-4 mr-1" />
                    {(metrics.currentRetention - metrics.previousRetention).toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">vs previous period</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-gray-500">Churn Rate</div>
            <div className="flex items-end mt-1">
              <div className="text-2xl font-bold text-blue-600">{metrics.churnRate}%</div>
              <div className="flex items-center ml-2 text-sm">
                {metrics.churnRate < 100 - metrics.previousRetention ? (
                  <span className="text-green-600 flex items-center">
                    <TrendingDown className="w-4 h-4 mr-1" />
                    {((100 - metrics.previousRetention) - metrics.churnRate).toFixed(1)}%
                  </span>
                ) : (
                  <span className="text-red-600 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +{(metrics.churnRate - (100 - metrics.previousRetention)).toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">vs previous period</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-gray-500">At-Risk Customers</div>
            <div className="flex items-end mt-1">
              <div className="text-2xl font-bold text-amber-600">{metrics.atRiskCustomers}</div>
              <div className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">
                Needs Attention
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">Based on engagement patterns</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-gray-500">Avg. Customer Lifetime (Years)</div>
            <div className="flex items-end mt-1">
              <div className="text-2xl font-bold text-indigo-600">{metrics.avgCustomerAge}</div>
              <div className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                Good
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">Target: 4+ years</div>
          </CardContent>
        </Card>
      </div>

      {/* Retention Chart */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-medium mb-4">Retention Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={retentionData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="retentionRate" name="Retention Rate %" fill="#10B981" />
              <Bar dataKey="churnRate" name="Churn Rate %" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* At-Risk Customers */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">At-Risk Customers</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Annual Value
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Order
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Level
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Indicator
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {atRiskCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${customer.value.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.lastOrder}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        customer.riskScore === 'Very High' ? 'bg-red-100 text-red-800' :
                        customer.riskScore === 'High' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {customer.riskScore}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <AlertCircle className="w-4 h-4 mr-1 text-amber-500" />
                        {customer.indicator}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button variant="outline" size="sm">Contact</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-medium mb-2">Retention Recommendations</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-600">1</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Schedule follow-up calls with at-risk customers</p>
                <p className="text-sm text-gray-500">Contact all customers who haven't ordered in more than 45 days to address concerns</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-600">2</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Implement loyalty program for regular customers</p>
                <p className="text-sm text-gray-500">Offer exclusive benefits to incentivize continued business</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-600">3</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Review pricing strategy for price-sensitive clients</p>
                <p className="text-sm text-gray-500">Consider volume discounts or long-term contract options</p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default RetentionMetrics;
