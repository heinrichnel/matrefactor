import React from "react";
import { useAppContext } from "../context/AppContext";
import Card, { CardContent, CardHeader } from "../components/ui/Card";
import { BarChart, TrendingUp, Truck, Calendar } from "lucide-react";

const TripDashboard: React.FC = () => {
  const { isLoading } = useAppContext();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Trip Dashboard</h1>
        <div className="text-sm text-gray-500">Overview of all trip activities</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-600">Total Trips</h3>
              <Truck className="w-5 h-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">0</div>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-600">This Month</h3>
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">0</div>
            <p className="text-xs text-gray-500 mt-1">Trips completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-600">Revenue</h3>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">$0.00</div>
            <p className="text-xs text-gray-500 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-600">Efficiency</h3>
              <BarChart className="w-5 h-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">--%</div>
            <p className="text-xs text-gray-500 mt-1">Average</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Trip Analytics</h2>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <BarChart className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No trip data available</p>
            <p className="text-sm mt-2">
              Trip analytics and charts will appear here once you have trip data
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TripDashboard;
