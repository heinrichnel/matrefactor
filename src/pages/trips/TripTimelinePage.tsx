import React, { useEffect, useState, useMemo } from "react";
import Timeline, { TimelineHeaders, SidebarHeader, DateHeader, TimelineMarkers } from "react-calendar-timeline";
import 'react-calendar-timeline/dist/style.css';
import { format, addWeeks, subWeeks, parseISO, isValid, startOfWeek, endOfWeek } from 'date-fns';
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase"; // Adjust to your path
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import {
  ChevronLeft,
  ChevronRight, // Ensure this is imported
  Truck,
  Flag,
  AlertTriangle,
  CheckCircle,
  Search,
  Download,
  DollarSign,
  Calendar as CalendarIcon
} from 'lucide-react';


interface Vehicle {
  id: string;
  title: string;
  fleetNumber?: string;
  registration?: string;
  group?: string;
}

interface Trip {
  id: string;
  group: string; // vehicleId or fleetNo
  title: string;
  start_time: number;
  end_time: number;
  color?: string;
  type?: string;
  status?: string;
  fleetNumber?: string;
  clientName?: string;
  route?: string;
  driverName?: string;
  background?: string;
  fromFirestore?: boolean;
  origin?: string;
  destination?: string;
  driver?: string;
  itemProps?: {
    className?: string;
    style?: Record<string, string | number>;
  };
}

interface MissedLoad {
  id: string;
  customerName: string;
  estimatedRevenue: number;
  currency: string;
  route: string;
}

// Custom color mapping for the soft style
const SOFT_TYPE_COLORS: Record<string, string> = {
  Retail: "#fcd34d", // Soft yellow
  Vendor: "#6ee7b7", // Soft teal/green
  Maintenance: "#fda4af", // Soft red
  Empty: "#d4d4d4", // Soft gray
  Lime: "#a7f3d0", // Soft lime
  active: "#a5b4fc", // Soft indigo
  in_progress: "#a5b4fc", // Soft indigo
  completed: "#6ee7b7", // Soft green
  invoiced: "#fcd34d", // Soft amber
  paid: "#c4b5fd", // Soft purple
  delayed: "#fda4af", // Soft red
  cancelled: "#fca5a5" // Soft red
};

// Function to get the background color for timeline items based on status/type
function getTripBackgroundColor(statusOrType: string): string {
  return SOFT_TYPE_COLORS[statusOrType] || "#dbeafe"; // Default soft blue if not found
}

// Function to get the border color for timeline items based on status/type (using the same soft palette)
function getTripBorderColor(statusOrType: string): string {
  return SOFT_TYPE_COLORS[statusOrType] || "#a5b4fc"; // Default soft indigo if not found
}

const TripTimelinePage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [missedLoads, setMissedLoads] = useState<MissedLoad[]>([]);
  const [startDate, setStartDate] = useState<Date>(startOfWeek(new Date()));
  const [endDate, setEndDate] = useState<Date>(endOfWeek(addWeeks(new Date(), 1)));
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timelineMode, setTimelineMode] = useState<"week" | "month">("week");
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  // Computed time values for the timeline
  const visibleTimeStart = startDate.getTime();
  const visibleTimeEnd = endDate.getTime();

  // Fetch data from Firestore
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Get trips from Firestore, with proper filtering and ordering
        const tripsQuery = query(
          collection(db, "trips"),
          orderBy("startDate", "desc"),
          limit(100) // Limit for performance
        );
        const tripsSnap = await getDocs(tripsQuery);
        console.log(`Found ${tripsSnap.size} trips in Firestore`);
        const tripDocs = tripsSnap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));

        // NEW: Fetch missed loads
        const missedLoadsQuery = query(collection(db, "missedLoads"));
        const missedLoadsSnap = await getDocs(missedLoadsQuery);
        const missedLoadsDocs = missedLoadsSnap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
        setMissedLoads(missedLoadsDocs);

        // Extract unique vehicles from trips
        const vehicleMap: Record<string, Vehicle> = {};

        // Create timeline items from trips
        const tripItems: Trip[] = tripDocs.map(trip => {
          // Use fleetNumber as the group identifier
          const groupId = trip.fleetNumber || trip.vehicleId || 'unknown';

          // Store vehicle info
          if (!vehicleMap[groupId]) {
            vehicleMap[groupId] = {
              id: groupId,
              title: trip.fleetNumber || trip.vehicleName || groupId,
              fleetNumber: groupId,
              registration: trip.registration
            };
          }

          // Parse dates, checking if they're valid
          let startTime: number, endTime: number;

          // Try to parse startDate or startTime
          if (trip.startDate && isValid(parseISO(trip.startDate))) {
            startTime = parseISO(trip.startDate).getTime();
          } else if (trip.startTime && isValid(parseISO(trip.startTime))) {
            startTime = parseISO(trip.startTime).getTime();
          } else {
            startTime = Date.now(); // Fallback
          }

          // Try to parse endDate or endTime
          if (trip.endDate && isValid(parseISO(trip.endDate))) {
            endTime = parseISO(trip.endDate).getTime();
          } else if (trip.endTime && isValid(parseISO(trip.endTime))) {
            endTime = parseISO(trip.endTime).getTime();
          } else {
            endTime = startTime + (24 * 60 * 60 * 1000); // Default to 1 day duration
          }

          // Format title based on available data
          const title = trip.route ||
                       (trip.clientName ? `Trip to ${trip.clientName}` :
                       trip.label || 'Untitled Trip');

          return {
            id: trip.id,
            group: groupId,
            title: title,
            start_time: startTime,
            end_time: endTime,
            color: getTripBorderColor(trip.status || trip.type || 'active'), // Using the soft palette
            type: trip.type,
            status: trip.status,
            fleetNumber: trip.fleetNumber,
            clientName: trip.clientName,
            route: trip.route,
            driverName: trip.driverName || trip.driver,
            background: getTripBackgroundColor(trip.status || trip.type || 'active'), // Using the soft palette
            fromFirestore: true,
            origin: trip.origin,
            destination: trip.destination,
            driver: trip.driver || trip.driverName
          };
        });

        // Convert vehicle map to array
        const vehiclesArray = Object.values(vehicleMap);

        console.log(`Processed ${tripItems.length} trips for timeline`);
        console.log(`Found ${vehiclesArray.length} unique vehicles`);

        setTrips(tripItems);
        setVehicles(vehiclesArray);
        setError(null);
      } catch (error) {
        console.error('Error fetching data for timeline:', error);
        setError("Failed to load timeline data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [timelineMode]);

  // Navigation functions
  const goToNextPeriod = () => {
    if (timelineMode === 'week') {
      setStartDate(addWeeks(startDate, 1));
      setEndDate(addWeeks(endDate, 1));
    } else {
      setStartDate(addWeeks(startDate, 4));
      setEndDate(addWeeks(endDate, 4));
    }
  };

  const goToPreviousPeriod = () => {
    if (timelineMode === 'week') {
      setStartDate(subWeeks(startDate, 1));
      setEndDate(subWeeks(endDate, 1));
    } else {
      setStartDate(subWeeks(startDate, 4));
      setEndDate(subWeeks(endDate, 4));
    }
  };

  const goToToday = () => {
    if (timelineMode === 'week') {
      setStartDate(startOfWeek(new Date()));
      setEndDate(endOfWeek(addWeeks(new Date(), 1)));
    } else {
      setStartDate(startOfWeek(new Date()));
      setEndDate(endOfWeek(addWeeks(new Date(), 4)));
    }
  };

  const toggleTimelineMode = () => {
    if (timelineMode === 'week') {
      setTimelineMode('month');
      // Expand to a month view
      setEndDate(endOfWeek(addWeeks(startDate, 3)));
    } else {
      setTimelineMode('week');
      // Contract to a week view
      setEndDate(endOfWeek(addWeeks(startDate, 1)));
    }
  };

  // Handle item selection
  const handleItemSelect = (itemId: number) => {
    const selectedItem = trips.find(item => item.id === itemId.toString());
    setSelectedTrip(selectedItem || null);
  };

  // Handle time change in timeline
  const handleTimeChange = (visibleTimeStart: number, visibleTimeEnd: number) => {
    setStartDate(new Date(visibleTimeStart));
    setEndDate(new Date(visibleTimeEnd));
  };

  // Filter trips by type/status
  const filteredTrips = trips.filter(trip => {
    if (filterType === 'all') return true;
    return trip.status === filterType || trip.type === filterType;
  });

  // Filter vehicles for search and only show vehicles with trips
  const vehiclesWithTrips = new Set(filteredTrips.map(t => t.group));
  const filteredVehicles = vehicles
    .filter(v => vehiclesWithTrips.has(v.id))
    .filter(v => search
      ? v.title.toLowerCase().includes(search.toLowerCase())
      : true
    );

  // NEW: Memoize the missed loads count per client
  const missedLoadsByClient = useMemo(() => {
    return missedLoads.reduce((acc, load) => {
      acc[load.customerName] = (acc[load.customerName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [missedLoads]);

  // Custom item renderer for trip bars
  const itemRenderer = ({ item, getItemProps }: any) => {
    const backgroundColor = item.background;
    const borderColor = item.color; // This is now the border color from getTripBorderColor

    const baseStyle = {
      ...getItemProps({}),
      background: backgroundColor,
      border: `1px solid ${borderColor}`,
      borderLeft: `4px solid ${borderColor}`,
      borderRadius: '4px',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', // Softer shadow
      color: '#333', // Default text color for items
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingLeft: '8px',
      paddingRight: '8px',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      fontSize: '0.75rem', // text-xs
      cursor: 'pointer',
    };

    return (
      <div {...baseStyle}>
        {item.status === 'completed' && <CheckCircle size={12} className="mr-1 text-emerald-600" />}
        {item.status === 'invoiced' && <Flag size={12} className="mr-1 text-amber-600" />}
        {item.status === 'paid' && <DollarSign size={12} className="mr-1 text-purple-600" />}
        {item.status === 'delayed' && <AlertTriangle size={12} className="mr-1 text-rose-600" />}
        <span className="truncate">{item.title}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-inter text-gray-800 p-4 sm:p-6 lg:p-8 rounded-lg shadow-lg">
      {/* Top Section: Title and Action Buttons */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trip Timeline</h1>
          <p className="text-gray-600">Schedule and view upcoming trips</p>
        </div>
        <div className="flex space-x-2 items-center">
          <Button
            variant="outline"
            onClick={() => console.log('Export feature to be implemented')}
            className="bg-white text-gray-700 hover:bg-neutral-100 border-gray-200" // Apply soft styles
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            className="bg-indigo-500 text-white hover:bg-indigo-600" // Apply soft styles
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            Add Trip
          </Button>
        </div>
      </div>

      {/* Calendar Controls and View Modes */}
      <Card className="bg-white rounded-lg shadow-md mb-4"> {/* Apply soft styles to Card */}
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left side: Timeline controls */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPeriod}
                className="bg-neutral-100 hover:bg-neutral-200 text-gray-600 border-gray-200" // Apply soft styles
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
                className="bg-neutral-100 hover:bg-neutral-200 text-gray-700 border-gray-200" // Apply soft styles
              >
                Today
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPeriod}
                className="bg-neutral-100 hover:bg-neutral-200 text-gray-600 border-gray-200" // Apply soft styles
              >
                {/* FIX: Correctly render ChevronRight component */}
                <ChevronRight className="w-4 h-4" />
              </Button>

              <span className="text-sm font-medium px-2">
                {format(startDate, 'MMM d, yyyy')} - {format(endDate, 'MMM d, yyyy')}
              </span>

              <div className="flex rounded-md shadow-sm">
                {['Month', 'Week'].map((mode) => (
                  <button
                    key={mode}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      timelineMode === mode.toLowerCase()
                        ? 'bg-indigo-500 text-white shadow-md'
                        : 'bg-neutral-100 text-gray-700 hover:bg-neutral-200'
                    } ${mode === 'Month' ? 'rounded-r-none' : ''} ${mode === 'Week' ? 'rounded-none rounded-r-md' : ''}`}
                    onClick={() => setTimelineMode(mode.toLowerCase() as 'week' | 'month')}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Right side: Search and filter */}
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search vehicles..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-10 block w-full rounded-md border-gray-200 shadow-sm focus:ring-indigo-300 focus:border-indigo-300 sm:text-sm py-2" // Apply soft styles
                />
              </div>

              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="block w-full rounded-md border-gray-200 shadow-sm focus:ring-indigo-300 focus:border-indigo-300 sm:text-sm py-2" // Apply soft styles
              >
                <option value="all">All Trips</option>
                <option value="active">Active Trips</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed Trips</option>
                <option value="invoiced">Invoiced Trips</option>
                <option value="paid">Paid Trips</option>
                <option value="delayed">Delayed Trips</option>
                <option value="cancelled">Cancelled Trips</option>
                <option value="Retail">Retail</option>
                <option value="Vendor">Vendor</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Empty">Empty</option>
                <option value="Lime">Lime</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error display */}
      {error && (
        <div className="p-4 bg-rose-50 text-rose-700 rounded-lg flex items-center mb-4 shadow-sm">
          <AlertTriangle size={20} className="mr-2" />
          {error}
        </div>
      )}

      {/* Timeline Component */}
      <Card className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            <span className="ml-3 text-gray-700">Loading timeline data...</span>
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 bg-neutral-50 rounded-lg border border-gray-200">
            <Truck className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No vehicles found</h3>
            <p className="text-gray-500 mt-2">
              {search ? 'Try adjusting your search criteria.' : 'No trips available for the selected period.'}
            </p>
          </div>
        ) : (
          <div className="h-[600px] font-inter">
            <Timeline
              groups={filteredVehicles}
              items={filteredTrips}
              defaultTimeStart={startDate}
              defaultTimeEnd={endDate}
              visibleTimeStart={visibleTimeStart}
              visibleTimeEnd={visibleTimeEnd}
              onTimeChange={handleTimeChange}
              onItemSelect={handleItemSelect}
              canMove={false}
              canResize={false}
              stackItems
              itemRenderer={itemRenderer}
              lineHeight={50}
              itemHeightRatio={0.65}
              sidebarWidth={200}
            >
              <TimelineHeaders>
                <SidebarHeader>
                  {(props: { getRootProps: () => React.HTMLAttributes<HTMLDivElement> }) => (
                    <div {...props.getRootProps()} className="bg-neutral-100 p-4 text-sm font-semibold text-gray-700 border-b border-gray-200">
                      <div className="flex items-center">
                        <Truck size={16} className="mr-2 text-gray-500" />
                        Fleet Vehicles
                      </div>
                    </div>
                  )}
                </SidebarHeader>
                <DateHeader unit="primaryHeader" />
                <DateHeader unit="day" height={40} />
              </TimelineHeaders>
              <TimelineMarkers>
                {/* Current time marker */}
                <div
                  className="current-time-marker"
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: `calc(((${Date.now()} - ${visibleTimeStart}) / (${visibleTimeEnd} - ${visibleTimeStart})) * 100%)`,
                    width: '2px',
                    backgroundColor: '#ef4444', // Soft red
                    zIndex: 999
                  }}
                />
              </TimelineMarkers>
            </Timeline>
          </div>
        )}
      </Card>

      {/* NEW: Missed Loads per Client Section */}
      <Card className="mt-4 border border-gray-200 rounded-lg bg-neutral-50 shadow-sm">
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 text-gray-900">Missed Loads by Client</h3>
          {Object.keys(missedLoadsByClient).length === 0 ? (
            <p className="text-gray-500">No missed loads recorded.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {Object.entries(missedLoadsByClient).map(([client, count]) => (
                <li key={client} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle size={16} className="text-red-500" />
                    <span className="text-sm font-medium text-gray-700">{client}</span>
                  </div>
                  <span className="text-sm font-semibold text-red-600">{count} missed loads</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Selected Trip Details */}
      {selectedTrip && (
        <Card className="mt-4 border border-gray-200 rounded-lg bg-neutral-50 shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-2 text-gray-900">{selectedTrip.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              <div>
                <span className="text-gray-500 font-medium">From:</span> {selectedTrip.origin || 'Not specified'}
              </div>
              <div>
                <span className="text-gray-500 font-medium">To:</span> {selectedTrip.destination || 'Not specified'}
              </div>
              <div>
                <span className="text-gray-500 font-medium">Driver:</span> {selectedTrip.driver || selectedTrip.driverName || 'Not assigned'}
              </div>
              <div>
                <span className="text-gray-500 font-medium">Start:</span> {format(new Date(selectedTrip.start_time), 'PPpp')}
              </div>
              <div>
                <span className="text-gray-500 font-medium">End:</span> {format(new Date(selectedTrip.end_time), 'PPpp')}
              </div>
              <div>
                <span className="text-gray-500 font-medium">Status:</span>{' '}
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold
                  ${selectedTrip.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                    selectedTrip.status === 'in_progress' || selectedTrip.status === 'active' ? 'bg-indigo-100 text-indigo-800' :
                    selectedTrip.status === 'delayed' ? 'bg-rose-100 text-rose-800' :
                    selectedTrip.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    selectedTrip.status === 'invoiced' ? 'bg-amber-100 text-amber-800' :
                    selectedTrip.status === 'paid' ? 'bg-purple-100 text-purple-800' :
                    'bg-neutral-100 text-neutral-800'}`}>
                  {selectedTrip.status ? selectedTrip.status.charAt(0).toUpperCase() + selectedTrip.status.slice(1) : 'Planned'}
                </span>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 rounded-md bg-white text-gray-700 font-semibold text-sm shadow-sm hover:bg-neutral-100 transition-colors border border-gray-200"
                onClick={() => setSelectedTrip(null)}
              >
                Close Details
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-200">
        <div className="text-sm font-medium text-gray-700">Trip Status Legend:</div>
        {Object.entries(SOFT_TYPE_COLORS)
          .map(([type, color]) => (
            <div key={type} className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-sm shadow-sm" style={{ background: color }}></span>
              <span className="ml-2 text-sm text-gray-600">{type.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default TripTimelinePage;
