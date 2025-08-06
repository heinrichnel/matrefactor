import React, { useState } from 'react';
import Card, { CardContent, CardHeader } from '../../components/ui/Card';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAppContext } from '../../context/AppContext';

const TripCalendarPage: React.FC = () => {
  const { isLoading } = useAppContext();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Mock trip data for demonstration
  const mockTrips = [
    { id: 'trip-1', date: '2025-07-10', title: 'Windhoek to Walvis Bay', status: 'active' },
    { id: 'trip-2', date: '2025-07-15', title: 'Gobabis to Windhoek', status: 'scheduled' },
    { id: 'trip-3', date: '2025-07-15', title: 'Windhoek to Swakopmund', status: 'scheduled' },
    { id: 'trip-4', date: '2025-07-18', title: 'Okahandja to Windhoek', status: 'scheduled' },
    { id: 'trip-5', date: '2025-07-25', title: 'Windhoek to Lüderitz', status: 'scheduled' },
  ];

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  };
  const getMonthName = (date: Date) => date.toLocaleString('default', { month: 'long', year: 'numeric' });
  const getTripsForDate = (date: Date) => {
    if (!date) return [];
    const dateString = date.toISOString().split('T')[0];
    return mockTrips.filter(trip => trip.date === dateString);
  };
  const handleDayClick = (day: Date) => setSelectedDate(day);

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trip Calendar</h1>
          <p className="text-gray-600">View and manage trips by date</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            icon={<Plus className="w-4 h-4" />}
            disabled={isLoading?.addTrip}
          >
            Add Trip
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{getMonthName(currentMonth)}</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={prevMonth} icon={<ChevronLeft className="w-4 h-4" />} />
              <Button variant="outline" size="sm" onClick={nextMonth} icon={<ChevronRight className="w-4 h-4" />} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
              <div key={i} className="text-center font-medium py-2">{day}</div>
            ))}
            {days.map((day, i) => (
              <div
                key={i}
                className={`min-h-[100px] border rounded-md p-1 ${!day ? 'bg-gray-50' : selectedDate && day?.toDateString() === selectedDate?.toDateString() ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50 cursor-pointer'}`}
                onClick={() => day && handleDayClick(day)}
              >
                {day && (
                  <>
                    <div className="text-right text-sm font-medium mb-1">{day.getDate()}</div>
                    <div className="space-y-1">
                      {getTripsForDate(day).map((trip) => (
                        <div
                          key={trip.id}
                          className={`text-xs p-1 rounded truncate ${
                            trip.status === 'active'
                              ? 'bg-blue-100 text-blue-800'
                              : trip.status === 'scheduled'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {trip.title}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {selectedDate && (
        <Card>
          <CardHeader title={`Trips on ${selectedDate.toLocaleDateString()}`} />
          <CardContent>
            {getTripsForDate(selectedDate).length > 0 ? (
              <div className="space-y-4">
                {getTripsForDate(selectedDate).map((trip) => (
                  <div key={trip.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{trip.title}</h3>
                      <p className="text-sm text-gray-500">Status: {trip.status}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" icon={<Eye className="w-4 h-4" />}>View</Button>
                      <Button size="sm" variant="outline" icon={<Edit className="w-4 h-4" />}>Edit</Button>
                      <Button size="sm" variant="outline" icon={<Trash2 className="w-4 h-4" />}>Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No trips scheduled</h3>
                <p>There are no trips scheduled for this date.</p>
                <Button variant="outline" className="mt-4" icon={<Plus className="w-4 h-4" />}>
                  Schedule Trip
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TripCalendarPage;
