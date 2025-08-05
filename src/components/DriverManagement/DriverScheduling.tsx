import React, { useState } from 'react';
import Card, { CardHeader, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Calendar, Clock, AlertCircle, Search, UserPlus, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

// Mock schedule data
const mockSchedules = [
  {
    id: 'sch-001',
    driverId: 'drv-001',
    driverName: 'John Doe',
    startTime: '2023-10-16T08:00:00',
    endTime: '2023-10-16T16:00:00',
    route: 'Accra - Kumasi',
    vehicleId: 'veh-002',
    vehiclePlate: 'GH-2345-21',
    status: 'assigned'
  },
  {
    id: 'sch-002',
    driverId: 'drv-002',
    driverName: 'Jane Smith',
    startTime: '2023-10-16T07:30:00',
    endTime: '2023-10-16T15:30:00',
    route: 'Tema - Takoradi',
    vehicleId: 'veh-005',
    vehiclePlate: 'GH-8901-21',
    status: 'assigned'
  },
  {
    id: 'sch-003',
    driverId: 'drv-003',
    driverName: 'Michael Johnson',
    startTime: '2023-10-16T09:00:00',
    endTime: '2023-10-16T17:00:00',
    route: 'Accra - Cape Coast',
    vehicleId: 'veh-008',
    vehiclePlate: 'GH-4567-22',
    status: 'in-progress'
  },
  {
    id: 'sch-004',
    driverId: 'drv-004',
    driverName: 'Sarah Williams',
    startTime: '2023-10-17T06:00:00',
    endTime: '2023-10-17T14:00:00',
    route: 'Kumasi - Tamale',
    vehicleId: 'veh-003',
    vehiclePlate: 'GH-7890-21',
    status: 'assigned'
  },
  {
    id: 'sch-005',
    driverId: 'drv-005',
    driverName: 'Robert Brown',
    startTime: '2023-10-17T08:00:00',
    endTime: '2023-10-17T16:00:00',
    route: 'Accra - Ho',
    vehicleId: 'veh-010',
    vehiclePlate: 'GH-1234-22',
    status: 'assigned'
  },
  {
    id: 'sch-006',
    driverId: 'drv-001',
    driverName: 'John Doe',
    startTime: '2023-10-18T07:00:00',
    endTime: '2023-10-18T15:00:00',
    route: 'Accra - Koforidua',
    vehicleId: 'veh-002',
    vehiclePlate: 'GH-2345-21',
    status: 'assigned'
  },
  {
    id: 'sch-007',
    driverId: 'drv-002',
    driverName: 'Jane Smith',
    startTime: '2023-10-18T09:30:00',
    endTime: '2023-10-18T17:30:00',
    route: 'Tema - Ada',
    vehicleId: 'veh-005',
    vehiclePlate: 'GH-8901-21',
    status: 'assigned'
  },
  {
    id: 'sch-008',
    driverId: 'drv-003',
    driverName: 'Michael Johnson',
    startTime: '2023-10-19T08:00:00',
    endTime: '2023-10-19T16:00:00',
    route: 'Accra - Takoradi',
    vehicleId: 'veh-008',
    vehiclePlate: 'GH-4567-22',
    status: 'assigned'
  }
];

// Function to format time from date string
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Function to format date from date string
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

const DriverScheduling: React.FC = () => {
  const [schedules, setSchedules] = useState(mockSchedules);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');

  // Function to navigate to previous period
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  // Function to navigate to next period
  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  // Function to get period label
  const getPeriodLabel = () => {
    if (viewMode === 'day') {
      return currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    } else if (viewMode === 'week') {
      const startOfWeek = new Date(currentDate);
      const endOfWeek = new Date(currentDate);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      endOfWeek.setDate(endOfWeek.getDate() + (6 - endOfWeek.getDay()));

      return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else if (viewMode === 'month') {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }

    return '';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Driver Scheduling</h1>

        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => alert('Create new schedule')}>
            <UserPlus className="h-4 w-4 mr-2" />
            <span>New Schedule</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader title="Schedule Management" />
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2">
              <Button
                variant={viewMode === 'day' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('day')}
              >
                Day
              </Button>
              <Button
                variant={viewMode === 'week' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('week')}
              >
                Week
              </Button>
              <Button
                variant={viewMode === 'month' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('month')}
              >
                Month
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={goToPrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="text-md font-medium px-3">
                {getPeriodLabel()}
              </div>

              <Button variant="outline" size="sm" onClick={goToNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
            </div>

            <div className="flex space-x-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search schedules..."
                  className="pl-8 pr-4 py-2 border border-gray-300 rounded-md"
                />
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              </div>

              <Button variant="outline" size="xs">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Weekly Schedule View */}
          {viewMode === 'week' && (
            <div className="border rounded-md">
              {/* Day Headers */}
              <div className="grid grid-cols-7 bg-gray-50 border-b">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                  <div key={day} className="px-2 py-3 text-center text-sm font-medium text-gray-900 border-r last:border-r-0">
                    {day}
                  </div>
                ))}
              </div>

              {/* Schedules Grid */}
              <div className="grid grid-cols-7 divide-x h-[500px]">
                {[0, 1, 2, 3, 4, 5, 6].map((dayOffset) => {
                  const currentDayDate = new Date(currentDate);
                  // Adjust to start of week (Sunday)
                  const startOfWeek = new Date(currentDayDate);
                  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

                  // Get date for this column
                  const columnDate = new Date(startOfWeek);
                  columnDate.setDate(columnDate.getDate() + dayOffset);

                  // Format as YYYY-MM-DD for comparison
                  const columnDateStr = columnDate.toISOString().split('T')[0];

                  // Filter schedules for this day
                  const daySchedules = schedules.filter(schedule => {
                    const scheduleDate = new Date(schedule.startTime).toISOString().split('T')[0];
                    return scheduleDate === columnDateStr;
                  });

                  return (
                    <div key={dayOffset} className="p-2 relative overflow-y-auto">
                      <div className="text-xs text-gray-500 mb-1 text-center">
                        {columnDate.getDate()}
                      </div>

                      {daySchedules.length === 0 ? (
                        <div className="text-xs text-center text-gray-400 mt-4">No schedules</div>
                      ) : (
                        daySchedules.map(schedule => (
                          <div
                            key={schedule.id}
                            className={`mb-2 p-2 rounded text-xs border-l-4 ${
                              schedule.status === 'in-progress'
                                ? 'border-l-green-500 bg-green-50'
                                : 'border-l-blue-500 bg-blue-50'
                            }`}
                          >
                            <div className="font-medium">{schedule.driverName}</div>
                            <div>{formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}</div>
                            <div className="truncate">{schedule.route}</div>
                            <div className="text-gray-500">{schedule.vehiclePlate}</div>
                          </div>
                        ))
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Monthly View */}
          {viewMode === 'month' && (
            <div className="text-center p-6 text-gray-500">
              Monthly view would show a traditional calendar with all driver schedules.
              <div className="mt-2 text-sm">
                This is a placeholder. In a real implementation, this would show a full monthly calendar with all scheduled trips.
              </div>
            </div>
          )}

          {/* Daily View */}
          {viewMode === 'day' && (
            <div className="text-center p-6 text-gray-500">
              Daily view would show detailed hour-by-hour schedules for all drivers.
              <div className="mt-2 text-sm">
                This is a placeholder. In a real implementation, this would show a detailed daily schedule with time slots.
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Schedules */}
      <Card>
        <CardHeader title="Upcoming Schedules" />
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {schedules.map((schedule) => (
                  <tr key={schedule.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{schedule.driverName}</div>
                      <div className="text-xs text-gray-500">ID: {schedule.driverId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(schedule.startTime)}</div>
                      <div className="text-xs text-gray-500">
                        {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {schedule.vehiclePlate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {schedule.route}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {schedule.status === 'assigned' ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Assigned</span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">In Progress</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => alert(`View schedule: ${schedule.id}`)}
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => alert(`Edit schedule: ${schedule.id}`)}
                        >
                          Edit
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Conflicts Alert */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <div>
              <h3 className="text-sm font-medium text-gray-900">Schedule Conflicts Alert</h3>
              <p className="text-sm text-gray-600 mt-1">
                Some drivers may have potential HOS (Hours of Service) violations based on their current schedules.
                Review the Hours of Service page for detailed analysis.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => alert('Navigate to Hours of Service page')}
              >
                View HOS Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverScheduling;

