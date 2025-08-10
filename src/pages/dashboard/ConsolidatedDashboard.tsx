import Card, { CardContent, CardHeader } from "@/components/ui/Card";
import { Box, Building2, Clipboard, FileText, Fuel, Truck, User } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

// Dashboard statistics interface
interface DashboardStats {
  drivers: {
    total: number;
    active: number;
    inactive: number;
    expiredLicenses: number;
  };
  vehicles: {
    total: number;
    active: number;
    maintenance: number;
    expiredDocuments: number;
  };
  clients: {
    total: number;
    active: number;
    pendingPayments: number;
  };
  trips: {
    completed: number;
    inProgress: number;
    scheduled: number;
    cancelled: number;
    revenue: number;
  };
  fuel: {
    monthlyConsumption: number;
    averageCost: number;
    totalCost: number;
  };
  maintenance: {
    scheduledServices: number;
    pendingRepairs: number;
    totalCost: number;
  };
}

// Recent activity interface
interface ActivityItem {
  id: string;
  type: "trip" | "driver" | "vehicle" | "client" | "fuel" | "maintenance";
  title: string;
  description: string;
  date: string;
  user: string;
  status?: "completed" | "pending" | "cancelled" | "urgent";
}

// Mock data
const mockStats: DashboardStats = {
  drivers: {
    total: 14,
    active: 11,
    inactive: 3,
    expiredLicenses: 2,
  },
  vehicles: {
    total: 23,
    active: 19,
    maintenance: 3,
    expiredDocuments: 1,
  },
  clients: {
    total: 32,
    active: 28,
    pendingPayments: 5,
  },
  trips: {
    completed: 148,
    inProgress: 7,
    scheduled: 12,
    cancelled: 3,
    revenue: 345680,
  },
  fuel: {
    monthlyConsumption: 4350,
    averageCost: 23.56,
    totalCost: 102486,
  },
  maintenance: {
    scheduledServices: 5,
    pendingRepairs: 2,
    totalCost: 42780,
  },
};

const mockActivity: ActivityItem[] = [
  {
    id: "1",
    type: "trip",
    title: "Trip #TR-2023-089 Completed",
    description: "Johannesburg to Durban delivery completed successfully",
    date: "2023-06-12T14:30:00",
    user: "John Smith",
    status: "completed",
  },
  {
    id: "2",
    type: "driver",
    title: "New Driver Added",
    description: "Michael Johnson has been added to the system",
    date: "2023-06-12T11:15:00",
    user: "Admin User",
  },
  {
    id: "3",
    type: "maintenance",
    title: "Vehicle Service Due",
    description: "Truck ABC123GP is due for service in 3 days",
    date: "2023-06-12T09:45:00",
    user: "System",
    status: "urgent",
  },
  {
    id: "4",
    type: "client",
    title: "Client Payment Received",
    description: "XYZ Manufacturing has cleared invoice #INV-2023-045",
    date: "2023-06-11T16:20:00",
    user: "Finance Dept",
  },
  {
    id: "5",
    type: "fuel",
    title: "Fuel Purchase",
    description: "Refueling for truck DEF456GP - 250 liters",
    date: "2023-06-11T14:10:00",
    user: "Sarah Smith",
  },
  {
    id: "6",
    type: "vehicle",
    title: "New Vehicle Added",
    description: "New truck GHI789GP has been added to the fleet",
    date: "2023-06-11T10:30:00",
    user: "Admin User",
  },
];

const ConsolidatedDashboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState<"day" | "week" | "month" | "quarter">("week");

  // Get icon for activity item
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "trip":
        return <Truck className="h-5 w-5 text-blue-500" />;
      case "driver":
        return <User className="h-5 w-5 text-green-500" />;
      case "vehicle":
        return <Truck className="h-5 w-5 text-purple-500" />;
      case "client":
        return <Building2 className="h-5 w-5 text-orange-500" />;
      case "fuel":
        return <Fuel className="h-5 w-5 text-red-500" />;
      case "maintenance":
        return <Box className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clipboard className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get status badge for activity item
  const getStatusBadge = (status?: string) => {
    if (!status) return null;

    const badgeClasses = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-red-100 text-red-800",
      urgent: "bg-red-100 text-red-800 animate-pulse",
    };

    return (
      <span
        className={`text-xs px-2 py-1 rounded ${badgeClasses[status as keyof typeof badgeClasses]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Format date to relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
    }
  };

  // Format number as currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Clipboard className="h-6 w-6" /> Dashboard
        </h1>

        <div className="flex gap-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="border border-gray-300 rounded p-2 text-sm"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Drivers</h3>
                <p className="text-2xl font-bold">{mockStats.drivers.total}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <User className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 text-sm">
              <span className="text-green-600 font-medium">{mockStats.drivers.active} active</span>
              <span className="mx-1">•</span>
              <span className="text-red-600">
                {mockStats.drivers.expiredLicenses} expired licenses
              </span>
            </div>
            <Link to="/drivers" className="text-blue-600 hover:underline text-xs block mt-1">
              View Drivers →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Vehicles</h3>
                <p className="text-2xl font-bold">{mockStats.vehicles.total}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <Truck className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2 text-sm">
              <span className="text-green-600 font-medium">{mockStats.vehicles.active} active</span>
              <span className="mx-1">•</span>
              <span className="text-yellow-600">
                {mockStats.vehicles.maintenance} in maintenance
              </span>
            </div>
            <Link to="/vehicles" className="text-blue-600 hover:underline text-xs block mt-1">
              View Vehicles →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Clients</h3>
                <p className="text-2xl font-bold">{mockStats.clients.total}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2 text-sm">
              <span className="text-green-600 font-medium">{mockStats.clients.active} active</span>
              <span className="mx-1">•</span>
              <span className="text-red-600">
                {mockStats.clients.pendingPayments} pending payments
              </span>
            </div>
            <Link to="/clients" className="text-blue-600 hover:underline text-xs block mt-1">
              View Clients →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Trips</h3>
                <p className="text-2xl font-bold">
                  {mockStats.trips.completed + mockStats.trips.inProgress}
                </p>
              </div>
              <div className="p-2 bg-orange-100 rounded-full">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-2 text-sm">
              <span className="text-blue-600 font-medium">
                {mockStats.trips.inProgress} in progress
              </span>
              <span className="mx-1">•</span>
              <span className="text-green-600">{mockStats.trips.scheduled} scheduled</span>
            </div>
            <Link to="/trips" className="text-blue-600 hover:underline text-xs block mt-1">
              View Trips →
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Fuel Stats */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Fuel className="h-5 w-5 text-red-600" /> Fuel Summary
              </h2>
              <Link to="/fuel" className="text-blue-600 hover:underline text-sm">
                View All
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Monthly Consumption</p>
                <p className="text-xl font-semibold">{mockStats.fuel.monthlyConsumption} L</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Average Cost</p>
                <p className="text-xl font-semibold">R {mockStats.fuel.averageCost.toFixed(2)}/L</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg col-span-2">
                <p className="text-sm text-gray-500">Total Fuel Costs</p>
                <p className="text-xl font-semibold">{formatCurrency(mockStats.fuel.totalCost)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trip Stats */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Truck className="h-5 w-5 text-blue-600" /> Trip Summary
              </h2>
              <Link to="/trips" className="text-blue-600 hover:underline text-sm">
                View All
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-xl font-semibold text-green-600">{mockStats.trips.completed}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">In Progress</p>
                <p className="text-xl font-semibold text-blue-600">{mockStats.trips.inProgress}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Scheduled</p>
                <p className="text-xl font-semibold text-yellow-600">{mockStats.trips.scheduled}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Revenue</p>
                <p className="text-xl font-semibold">{formatCurrency(mockStats.trips.revenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Stats */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Box className="h-5 w-5 text-yellow-600" /> Maintenance
              </h2>
              <Link to="/maintenance" className="text-blue-600 hover:underline text-sm">
                View All
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Scheduled Services</p>
                <p className="text-xl font-semibold">{mockStats.maintenance.scheduledServices}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Pending Repairs</p>
                <p className="text-xl font-semibold text-yellow-600">
                  {mockStats.maintenance.pendingRepairs}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg col-span-2">
                <p className="text-sm text-gray-500">Total Maintenance Costs</p>
                <p className="text-xl font-semibold">
                  {formatCurrency(mockStats.maintenance.totalCost)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Recent Activity</h2>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-gray-200">
            {mockActivity.map((activity) => (
              <div key={activity.id} className="py-3 flex items-start gap-3">
                <div className="mt-1">{getActivityIcon(activity.type)}</div>
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{activity.title}</h3>
                    <span className="text-sm text-gray-500">
                      {formatRelativeTime(activity.date)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">By: {activity.user}</span>
                    {getStatusBadge(activity.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-center">
            <Link
              to="/activity"
              className="inline-block px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
            >
              View All Activity
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/drivers/add"
            className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 flex flex-col items-center text-center"
          >
            <User className="h-8 w-8 text-blue-600 mb-2" />
            <span className="font-medium">Add Driver</span>
          </Link>
          <Link
            to="/vehicles/add"
            className="p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 flex flex-col items-center text-center"
          >
            <Truck className="h-8 w-8 text-green-600 mb-2" />
            <span className="font-medium">Add Vehicle</span>
          </Link>
          <Link
            to="/clients/add"
            className="p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-200 flex flex-col items-center text-center"
          >
            <Building2 className="h-8 w-8 text-purple-600 mb-2" />
            <span className="font-medium">Add Client</span>
          </Link>
          <Link
            to="/trips/add"
            className="p-4 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-200 flex flex-col items-center text-center"
          >
            <FileText className="h-8 w-8 text-orange-600 mb-2" />
            <span className="font-medium">Create Trip</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ConsolidatedDashboard;
