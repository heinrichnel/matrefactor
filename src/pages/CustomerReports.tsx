import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import SyncIndicator from '../components/ui/SyncIndicator';
import { Search, Download, Calendar, Filter, BarChart2, PieChart, TrendingUp, TrendingDown } from 'lucide-react';

interface ReportFilter {
  dateRange: string;
  customerType: string;
  region: string;
}

const CustomerReports: React.FC = () => {
  const [filter, setFilter] = useState<ReportFilter>({
    dateRange: 'month',
    customerType: 'all',
    region: 'all'
  });
  
  const [activeReport, setActiveReport] = useState('revenue');
  
  const handleFilterChange = (field: string, value: string) => {
    setFilter(prev => ({ ...prev, [field]: value }));
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Customer Reports</h2>
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
            value={filter.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Filter className="w-5 h-5 text-gray-400" />
          </div>
          <select
            value={filter.customerType}
            onChange={(e) => handleFilterChange('customerType', e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Customer Types</option>
            <option value="enterprise">Enterprise</option>
            <option value="sme">SME</option>
            <option value="government">Government</option>
            <option value="individual">Individual</option>
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
      
      {/* Report Type Selector */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <Button
          variant={activeReport === 'revenue' ? 'primary' : 'outline'}
          onClick={onClick}
          icon={<BarChart2 className="w-4 h-4" />}
        >
          Revenue
        </Button>
        <Button
          variant={activeReport === 'trips' ? 'primary' : 'outline'}
          onClick={onClick}
          icon={<TrendingUp className="w-4 h-4" />}
        >
          Trip Volume
        </Button>
        <Button
          variant={activeReport === 'services' ? 'primary' : 'outline'}
          onClick={onClick}
          icon={<PieChart className="w-4 h-4" />}
        >
          Service Mix
        </Button>
        <Button
          variant={activeReport === 'satisfaction' ? 'primary' : 'outline'}
          onClick={onClick}
          icon={<TrendingDown className="w-4 h-4" />}
        >
          Satisfaction
        </Button>
        <Button
          variant={activeReport === 'growth' ? 'primary' : 'outline'}
          onClick={onClick}
          icon={<TrendingUp className="w-4 h-4" />}
        >
          Growth
        </Button>
      </div>
      
      {/* Revenue Report */}
      {activeReport === 'revenue' && (
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">Revenue Report</h3>
            
            {/* Chart placeholder */}
            <div className="bg-gray-100 p-6 rounded-lg flex flex-col items-center justify-center h-64">
              <BarChart2 className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-gray-500">Revenue chart by customer would appear here</p>
              <p className="text-sm text-gray-400 mt-2">Using real data from Firestore in the actual implementation</p>
            </div>
            
            {/* Summary stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-700">Total Revenue</h4>
                <p className="text-2xl font-bold">$1,254,350</p>
                <p className="text-sm flex items-center mt-1 text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" /> +12% vs previous period
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-green-700">Average Per Customer</h4>
                <p className="text-2xl font-bold">$42,850</p>
                <p className="text-sm flex items-center mt-1 text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" /> +5% vs previous period
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-purple-700">Top Customer Revenue</h4>
                <p className="text-2xl font-bold">$215,420</p>
                <p className="text-sm mt-1 text-purple-600">Matanuska Farms Ltd.</p>
              </div>
            </div>
            
            {/* Top customers table */}
            <div className="mt-6">
              <h4 className="text-md font-medium mb-2">Top Customers by Revenue</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">YoY Change</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Matanuska Farms Ltd.</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Enterprise</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Northern</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">$215,420</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+18%</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Central Distribution Co.</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Enterprise</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Central</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">$185,740</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+7%</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Government Logistics Dept.</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Government</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Southern</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">$142,530</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+22%</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Eastern Supplies Inc.</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">SME</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Eastern</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">$98,450</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">-5%</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Coastal Freight Ltd.</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">SME</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Western</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">$87,620</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+11%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Trip Volume Report */}
      {activeReport === 'trips' && (
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">Trip Volume Report</h3>
            
            <div className="bg-gray-100 p-6 rounded-lg flex flex-col items-center justify-center h-64">
              <TrendingUp className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-gray-500">Trip volume chart would appear here</p>
              <p className="text-sm text-gray-400 mt-2">Using real data from Firestore in the actual implementation</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-700">Total Trips</h4>
                <p className="text-2xl font-bold">1,845</p>
                <p className="text-sm flex items-center mt-1 text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" /> +8% vs previous period
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-green-700">Avg. Load Factor</h4>
                <p className="text-2xl font-bold">87%</p>
                <p className="text-sm flex items-center mt-1 text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" /> +3% vs previous period
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-purple-700">On-time Delivery</h4>
                <p className="text-2xl font-bold">94.3%</p>
                <p className="text-sm flex items-center mt-1 text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" /> +1.2% vs previous period
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Service Mix Report */}
      {activeReport === 'services' && (
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">Service Mix Report</h3>
            
            <div className="bg-gray-100 p-6 rounded-lg flex flex-col items-center justify-center h-64">
              <PieChart className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-gray-500">Service mix pie chart would appear here</p>
              <p className="text-sm text-gray-400 mt-2">Using real data from Firestore in the actual implementation</p>
            </div>
            
            <div className="mt-6">
              <h4 className="text-md font-medium mb-4">Service Breakdown</h4>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Full Truckload</span>
                    <span className="text-sm font-medium">65%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Less than Truckload</span>
                    <span className="text-sm font-medium">22%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '22%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Express Delivery</span>
                    <span className="text-sm font-medium">8%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '8%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Special Handling</span>
                    <span className="text-sm font-medium">5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '5%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Customer Satisfaction Report */}
      {activeReport === 'satisfaction' && (
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">Customer Satisfaction Report</h3>
            
            <div className="bg-gray-100 p-6 rounded-lg flex flex-col items-center justify-center h-64">
              <TrendingUp className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-gray-500">Satisfaction trend chart would appear here</p>
              <p className="text-sm text-gray-400 mt-2">Using real data from Firestore in the actual implementation</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-700">Overall CSAT</h4>
                <p className="text-2xl font-bold">4.7/5.0</p>
                <p className="text-sm flex items-center mt-1 text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" /> +0.2 vs previous period
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-green-700">Net Promoter Score</h4>
                <p className="text-2xl font-bold">+72</p>
                <p className="text-sm flex items-center mt-1 text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" /> +4 vs previous period
                </p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-yellow-700">Service Issues</h4>
                <p className="text-2xl font-bold">3.2%</p>
                <p className="text-sm flex items-center mt-1 text-green-600">
                  <TrendingDown className="h-4 w-4 mr-1" /> -0.5% vs previous period
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-md font-medium mb-2">Customer Feedback Highlights</h4>
              
              <div className="space-y-3">
                <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
                  <p className="text-sm text-green-700">"Excellent service and always on time. The drivers are professional and courteous."</p>
                  <p className="text-xs text-gray-500 mt-1">Matanuska Farms Ltd., July 5</p>
                </div>
                
                <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
                  <p className="text-sm text-green-700">"The online tracking system is incredibly useful. We can always see where our shipments are."</p>
                  <p className="text-xs text-gray-500 mt-1">Central Distribution Co., July 3</p>
                </div>
                
                <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-500">
                  <p className="text-sm text-yellow-700">"Good service overall but had some issues with delivery time windows. Would appreciate more precise ETAs."</p>
                  <p className="text-xs text-gray-500 mt-1">Eastern Supplies Inc., July 2</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Growth Report */}
      {activeReport === 'growth' && (
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">Customer Growth Report</h3>
            
            <div className="bg-gray-100 p-6 rounded-lg flex flex-col items-center justify-center h-64">
              <BarChart2 className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-gray-500">Customer growth chart would appear here</p>
              <p className="text-sm text-gray-400 mt-2">Using real data from Firestore in the actual implementation</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-700">New Customers</h4>
                <p className="text-2xl font-bold">14</p>
                <p className="text-sm flex items-center mt-1 text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" /> +40% vs previous period
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-green-700">Customer Retention</h4>
                <p className="text-2xl font-bold">95.8%</p>
                <p className="text-sm flex items-center mt-1 text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" /> +1.2% vs previous period
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-purple-700">Avg. Revenue Growth</h4>
                <p className="text-2xl font-bold">+12.5%</p>
                <p className="text-sm mt-1 text-purple-600">Per existing customer</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-md font-medium mb-2">Growth Opportunities</h4>
              
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Service Expansion</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      5 existing customers have shown interest in additional service offerings.
                    </p>
                    <Button size="sm">View Details</Button>
                  </div>
                  
                  <div className="flex-1 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium mb-2">New Market Segment</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Potential for 20% growth by expanding to the pharmaceutical transport segment.
                    </p>
                    <Button size="sm">View Analysis</Button>
                  </div>
                  
                  <div className="flex-1 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Customer Upselling</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      8 customers identified for potential service level upgrades.
                    </p>
                    <Button size="sm">View Customers</Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CustomerReports;
