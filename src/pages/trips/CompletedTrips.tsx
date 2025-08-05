import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SupportedCurrency, formatCurrency } from "../../lib/currency";

interface Trip {
  id: string;
  tripNumber: string;
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "scheduled";
  driver: string;
  vehicle: string;
  distance: number;
  cost: number;
  revenue: number;
}

interface CompletedTripsProps {
  displayCurrency: SupportedCurrency;
}

const mockCompletedTrips: Trip[] = [
  {
    id: "101",
    tripNumber: "TR-2023-097",
    origin: "New York, NY",
    destination: "Boston, MA",
    startDate: "2025-07-01T08:00:00",
    endDate: "2025-07-02T14:00:00",
    status: "completed",
    driver: "Alex Johnson",
    vehicle: "Truck 234",
    distance: 215,
    cost: 950.25,
    revenue: 1450.5,
  },
  {
    id: "102",
    tripNumber: "TR-2023-098",
    origin: "Philadelphia, PA",
    destination: "Pittsburgh, PA",
    startDate: "2025-07-03T09:30:00",
    endDate: "2025-07-05T11:00:00",
    status: "completed",
    driver: "Chris Wilson",
    vehicle: "Truck 567",
    distance: 305,
    cost: 1320.75,
    revenue: 2100.0,
  },
  {
    id: "103",
    tripNumber: "TR-2023-099",
    origin: "Chicago, IL",
    destination: "Milwaukee, WI",
    startDate: "2025-07-05T07:00:00",
    endDate: "2025-07-05T14:30:00",
    status: "completed",
    driver: "Emily Roberts",
    vehicle: "Truck 789",
    distance: 92,
    cost: 425.5,
    revenue: 750.25,
  },
  {
    id: "104",
    tripNumber: "TR-2023-100",
    origin: "Dallas, TX",
    destination: "Houston, TX",
    startDate: "2025-07-07T08:00:00",
    endDate: "2025-07-07T16:00:00",
    status: "completed",
    driver: "Mark Thompson",
    vehicle: "Truck 345",
    distance: 239,
    cost: 875.25,
    revenue: 1325.5,
  },
  {
    id: "105",
    tripNumber: "TR-2023-101",
    origin: "Seattle, WA",
    destination: "Portland, OR",
    startDate: "2025-07-10T09:00:00",
    endDate: "2025-07-10T15:00:00",
    status: "completed",
    driver: "Lisa Brown",
    vehicle: "Truck 678",
    distance: 174,
    cost: 795.0,
    revenue: 1250.75,
  },
];

const CompletedTrips: React.FC<CompletedTripsProps> = ({ displayCurrency }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Trip>("endDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Filter trips based on search term
  const filteredTrips = mockCompletedTrips.filter(
    (trip) =>
      trip.tripNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.driver.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort trips
  const sortedTrips = [...filteredTrips].sort((a, b) => {
    if (sortField === "endDate" || sortField === "startDate") {
      const dateA = new Date(a[sortField]).getTime();
      const dateB = new Date(b[sortField]).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }

    if (typeof a[sortField] === "number" && typeof b[sortField] === "number") {
      return sortDirection === "asc"
        ? (a[sortField] as number) - (b[sortField] as number)
        : (b[sortField] as number) - (a[sortField] as number);
    }

    const valueA = String(a[sortField]).toLowerCase();
    const valueB = String(b[sortField]).toLowerCase();
    return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
  });

  const handleSort = (field: keyof Trip) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Calculate total profit
  const totalRevenue = sortedTrips.reduce((sum, trip) => sum + trip.revenue, 0);
  const totalCost = sortedTrips.reduce((sum, trip) => sum + trip.cost, 0);
  const totalProfit = totalRevenue - totalCost;
  const averageMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Completed Trips</h1>
          <p className="text-gray-600">Showing {sortedTrips.length} completed trips</p>
        </div>
        <div>
          <Link
            to="/trips"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Trip Management
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="text-sm text-gray-500 mb-1">Total Revenue</div>
          <div className="text-xl font-bold">{formatCurrency(totalRevenue, displayCurrency)}</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <div className="text-sm text-gray-500 mb-1">Total Costs</div>
          <div className="text-xl font-bold">{formatCurrency(totalCost, displayCurrency)}</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="text-sm text-gray-500 mb-1">Total Profit</div>
          <div className="text-xl font-bold">{formatCurrency(totalProfit, displayCurrency)}</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <div className="text-sm text-gray-500 mb-1">Average Margin</div>
          <div className="text-xl font-bold">{averageMargin.toFixed(2)}%</div>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by trip number, origin, destination or driver..."
          className="w-full px-4 py-2 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("tripNumber")}
                >
                  Trip Number {sortField === "tripNumber" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Route
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Driver / Vehicle
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("endDate")}
                >
                  Completion Date {sortField === "endDate" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("cost")}
                >
                  Cost {sortField === "cost" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("revenue")}
                >
                  Revenue {sortField === "revenue" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Profit
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedTrips.map((trip) => (
                <tr key={trip.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {trip.tripNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col">
                      <span className="font-medium">From: {trip.origin}</span>
                      <span>To: {trip.destination}</span>
                      <span className="text-xs text-gray-400">{trip.distance} miles</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col">
                      <span className="font-medium">{trip.driver}</span>
                      <span className="text-xs">{trip.vehicle}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(trip.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(trip.cost, displayCurrency)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(trip.revenue, displayCurrency)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span
                      className={trip.revenue - trip.cost > 0 ? "text-green-600" : "text-red-600"}
                    >
                      {formatCurrency(trip.revenue - trip.cost, displayCurrency)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900" onClick={() => {}}>
                        Details
                      </button>
                      <button className="text-blue-600 hover:text-blue-900" onClick={() => {}}>
                        Report
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompletedTrips;
