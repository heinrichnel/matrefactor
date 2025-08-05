import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import DieselDashboard from './DieselDashboardComponent';
import { formatCurrency } from '../../utils/helpers';
import Button from '../../components/ui/Button';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import FuelEntryForm, { FuelEntryData } from '../../components/forms/diesel/FuelEntryForm';
import {
  Fuel,
  TrendingUp,
  AlertCircle,
  BarChart2,
  FileText,
  Settings,
  ChevronRight,
  CreditCard,
  Truck,
  Plus
} from 'lucide-react';

interface DieselManagementPageProps {
  className?: string;
}

const DieselManagementPage: React.FC<DieselManagementPageProps> = ({ className = '' }) => {
  const { dieselRecords, dieselNorms, isLoading } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddFuelEntry = async (data: FuelEntryData) => {
    console.log('Form data:', data);
    // Here you would submit to Firebase/Firestore
    await new Promise(resolve => setTimeout(resolve, 1000));
    setShowAddForm(false);
  };

  // Calculate summary statistics
  const totalLiters = dieselRecords.reduce((total, record) => total + record.liters, 0);
  const totalCost = dieselRecords.reduce((total, record) => total + record.cost, 0);

  // Filter records from the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentRecords = dieselRecords.filter(
    record => new Date(record.timestamp) >= thirtyDaysAgo
  );

  const recentLiters = recentRecords.reduce((total, record) => total + record.liters, 0);
  const recentCost = recentRecords.reduce((total, record) => total + record.cost, 0);

  // Calculate flagged records
  const flaggedRecords = dieselRecords.filter(record => record.flagged);
  const flaggedPercentage = dieselRecords.length > 0
    ? (flaggedRecords.length / dieselRecords.length) * 100
    : 0;

  // Get top 5 vehicles by consumption
  const vehicleConsumption: Record<string, { liters: number, cost: number }> = {};
  dieselRecords.forEach(record => {
    if (!vehicleConsumption[record.vehicleId]) {
      vehicleConsumption[record.vehicleId] = { liters: 0, cost: 0 };
    }
    vehicleConsumption[record.vehicleId].liters += record.liters;
    vehicleConsumption[record.vehicleId].cost += record.cost;
  });

  const topVehicles = Object.entries(vehicleConsumption)
    .sort((a, b) => b[1].liters - a[1].liters)
    .slice(0, 5);

  return (
          <div className={`space-y-6 ${className}`}>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Diesel Management</h1>
          <Button
            className="flex items-center gap-2"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="h-4 w-4" />
            Add Fuel Entry
          </Button>
        </div>

        {showAddForm && (
          <Card className="mb-4">
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Add New Fuel Entry</h2>
                <Button
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                >
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <FuelEntryForm
                onSubmit={async (data: FuelEntryData) => {
                  console.log('Form data:', data);
                  // Here you would submit to Firebase/Firestore
                  await new Promise(resolve => setTimeout(resolve, 1000));
                  setShowAddForm(false);
                }}
                onCancel={() => setShowAddForm(false)}
              />
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Consumption Card */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Diesel Management</h1>
          <p className="text-gray-600">Track and manage diesel consumption across your fleet</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate('/diesel-reports')}
            className="flex items-center"
          >
            <FileText className="mr-1 h-4 w-4" />
            Reports
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/diesel-settings')}
            className="flex items-center"
          >
            <Settings className="mr-1 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-4 py-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                    <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            {/* Total Consumption Card */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Consumption</p>
                    <p className="text-2xl font-bold">{totalLiters.toFixed(2)} L</p>
                    <p className="text-sm text-gray-500">{formatCurrency(totalCost)}</p>
                  </div>
                  <div className="rounded-full p-2 bg-blue-100">
                    <Fuel className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-xs text-gray-500">All time</div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Consumption Card */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last 30 Days</p>
                    <p className="text-2xl font-bold">{recentLiters.toFixed(2)} L</p>
                    <p className="text-sm text-gray-500">{formatCurrency(recentCost)}</p>
                  </div>
                  <div className="rounded-full p-2 bg-green-100">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-xs">
                    <span className="text-green-600">↑ 12%</span>
                    <span className="text-gray-500 ml-1">vs previous period</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Flagged Transactions Card */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Flagged Records</p>
                    <p className="text-2xl font-bold">{flaggedRecords.length}</p>
                    <p className="text-sm text-gray-500">{flaggedPercentage.toFixed(1)}% of total</p>
                  </div>
                  <div className="rounded-full p-2 bg-amber-100">
                    <AlertCircle className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <Button variant="link" className="p-0 text-xs flex items-center text-amber-600" onClick={() => navigate('/diesel-alerts')}>
                    View all alerts <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Cost per KM Card */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Avg. Cost/KM</p>
                    <p className="text-2xl font-bold">R 0.47</p>
                    <p className="text-sm text-gray-500">Last 30 days</p>
                  </div>
                  <div className="rounded-full p-2 bg-purple-100">
                    <CreditCard className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-xs">
                    {dieselNorms && dieselNorms.targetCostPerKm ? (
                      <>
                        <span className={dieselNorms.targetCostPerKm < 0.47 ? "text-red-600" : "text-green-600"}>
                          {dieselNorms.targetCostPerKm < 0.47 ? "↑" : "↓"} {Math.abs((0.47 / dieselNorms.targetCostPerKm - 1) * 100).toFixed(1)}%
                        </span>
                        <span className="text-gray-500 ml-1">vs target ({dieselNorms.targetCostPerKm.toFixed(2)})</span>
                      </>
                    ) : (
                      <>
                        <span className="text-red-600">↑ 3.2%</span>
                        <span className="text-gray-500 ml-1">vs target</span>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="dashboard">
            <Fuel className="mr-1 h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart2 className="mr-1 h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="vehicles">
            <Truck className="mr-1 h-4 w-4" />
            Vehicles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <DieselDashboard />
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Diesel Consumption Analytics</h3>
              <p className="text-sm text-gray-600">View trends and patterns in your diesel usage</p>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border border-dashed rounded-md">
                <div className="text-center">
                  <BarChart2 className="h-12 w-12 mx-auto text-gray-400" />
                  <p className="mt-2 text-sm font-medium text-gray-900">Analytics Dashboard</p>
                  <p className="mt-1 text-sm text-gray-500">Coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicles">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Vehicle Consumption</h3>
              <p className="text-sm text-gray-600">Top vehicles by diesel consumption</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topVehicles.map(([vehicleId, data]) => (
                  <div key={vehicleId} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="rounded-full p-2 bg-blue-100 mr-3">
                        <Truck className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{vehicleId}</p>
                        <p className="text-sm text-gray-600">{data.liters.toFixed(2)} L total</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(data.cost)}</p>
                      <Button variant="ghost" size="sm" className="text-xs">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}

                {topVehicles.length === 0 && (
                  <div className="text-center py-8">
                    <Truck className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No Vehicle Data</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      No vehicle consumption data is available
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DieselManagementPage;
