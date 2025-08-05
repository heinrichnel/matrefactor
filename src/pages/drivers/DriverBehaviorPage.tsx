import React, { useState, useEffect } from 'react';
import { DriverBehaviorEvent } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { useDriverBehavior } from '../../context/DriverBehaviorContext';
import Button from '../../components/ui/Button';
import DriverPerformanceOverview from '../../components/DriverManagement/PerformanceAnalytics';
import DriverBehaviorEventForm from '../../components/forms/DriverBehaviorEventForm';
import DriverBehaviorEventDetails from '../../components/DriverManagement/DriverBehaviorEventDetails';
import CARReportForm from '../../components/forms/CARReportForm';
import CARReportList from '../../components/lists/CARReportList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { 
  User, 
  FileText, 
  Plus, 
  RefreshCw, 
  AlertTriangle, 
  Filter, 
  Search, 
  Download, 
  BookOpen 
} from 'lucide-react';
import SyncIndicator from '../../components/ui/SyncIndicator';

/**
 * Driver Behavior Events Page Component
 * 
 * This component displays driver behavior events with filtering capabilities
 * and allows users to:
 * - View detailed driver performance metrics
 * - Record new behavior events
 * - View and edit existing behavior events
 * - Initiate Corrective Action Reports (CAR) from events
 * - View existing CAR reports
 * - Sync with external systems
 */
const DriverBehaviorPage: React.FC = () => {
  // Local UI state
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState('performance');
  const [showEventForm, setShowEventForm] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showCARForm, setShowCARForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<DriverBehaviorEvent | null>(null);
  
  // Search and filtering state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterEventType, setFilterEventType] = useState('all');
  const [showWebBookOnly, setShowWebBookOnly] = useState(false);
  const [dateRange] = useState<{start: Date | null, end: Date | null}>({
    start: null,
    end: null
  });
  
  // Get application context for data and operations
  const { 
    importDriverBehaviorEventsFromWebhook,
    isLoading, 
    driverBehaviorEvents 
  } = useAppContext();
  
  // Get driver behavior specific context with real-time updates from Firestore
  const { events, webBookEvents, loading, error } = useDriverBehavior();
  
  // Subscribe to driver behavior events when the component mounts
  useEffect(() => {
    console.log("Subscribing to driver behavior events");
    
    // Real-time updates are now handled by the DriverBehaviorContext provider
    // The useDriverBehavior hook already provides real-time data from Firestore
    
    // Check if we have any events, if not and we're online, trigger a sync
    if ((driverBehaviorEvents.length === 0 && events.length === 0) && navigator.onLine) {
      handleSyncNow();
    }
    
    // Log the number of events coming from the context
    console.log(`Real-time driver behavior events loaded: ${events.length}`);
    console.log(`Web book events loaded: ${webBookEvents.length}`);
    
    // Cleanup function is not needed as the subscription is managed by the DriverBehaviorContext
  }, [driverBehaviorEvents.length, events.length, webBookEvents.length]);

  // Handle initiating CAR from event
  const handleInitiateCAR = (event: DriverBehaviorEvent) => {
    setSelectedEvent(event);
    setShowCARForm(true);
  };

  // Manual sync handler with enhanced error handling and feedback
  const handleSyncNow = async () => {
    try {
      setIsSyncing(true);
      const result = await importDriverBehaviorEventsFromWebhook();
      if (result) {
        alert(`Manual sync complete. Imported: ${result.imported}, Skipped: ${result.skipped}`);
      } else {
        alert('Manual sync completed but no data was returned.');
      }
    } catch (error) {
      console.error('Error during manual sync:', error);
      alert(`Manual sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // View event details
  const handleViewEvent = (event: DriverBehaviorEvent) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };
  
  // Export data handler
  const handleExportData = () => {
    try {
      // Get the data to export (filtered or all)
      const dataToExport = getFilteredEvents();
      
      // Convert to CSV
      const headers = ['Date', 'Driver', 'Event Type', 'Severity', 'Fleet No', 'Location', 'Description'];
      const csvContent = [
        headers.join(','),
        ...dataToExport.map(event => [
          event.eventDate || '',
          event.driverName || '',
          event.eventType || '',
          event.severity || '',
          event.fleetNumber || '',
          event.location || '',
          `"${(event.description || '').replace(/"/g, '""')}"`
        ].join(','))
      ].join('\n');
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `driver-behavior-events-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  // Get unique event types for filtering
  const getUniqueEventTypes = () => {
    const displayEvents = showWebBookOnly ? webBookEvents : events;
    return [...new Set(displayEvents.map(event => event.eventType))];
  };

  // Filter events based on search term and filters
  const getFilteredEvents = () => {
    const displayEvents = showWebBookOnly ? webBookEvents : driverBehaviorEvents;
    
    return displayEvents.filter(event => {
      // Search term filter
      const matchesSearch =
        !searchTerm ||
        (event.fleetNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (event.eventType?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (event.driverName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      
      // Severity filter
      const matchesSeverity = 
        filterSeverity === 'all' || 
        event.severity === filterSeverity;
      
      // Event type filter
      const matchesEventType = 
        filterEventType === 'all' || 
        event.eventType === filterEventType;
      
      // Date range filter
      const matchesDateRange = 
        !dateRange.start || !dateRange.end ||
        (event.eventDate && 
          new Date(event.eventDate) >= dateRange.start &&
          new Date(event.eventDate) <= dateRange.end);
      
      return matchesSearch && matchesSeverity && matchesEventType && matchesDateRange;
    });
  };

  // Get filtered events
  const filteredEvents = getFilteredEvents();
  
  // Get unique event types
  const eventTypes = getUniqueEventTypes();

  return (
    <div className="space-y-6">
      {/* Header with title and action buttons */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Driver Behavior Management</h1>
          <div className="flex items-center mt-1">
            <p className="text-lg text-gray-600 mr-3">Monitor driver behavior and manage corrective actions</p>
            <SyncIndicator />
          </div>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={() => {
              setSelectedEvent(null);
              setShowEventForm(true);
            }}
            icon={<Plus className="w-4 h-4" />}
          >
            Record Behavior Event
          </Button>
          <Button
            onClick={handleSyncNow}
            icon={<RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />}
            variant="outline"
            disabled={isSyncing || isLoading.importDriverBehavior}
            isLoading={isLoading.importDriverBehavior}
          >
            {isSyncing || isLoading.importDriverBehavior ? 'Syncing...' : 'Sync Now'}
          </Button>
        </div>
      </div>

      {/* Error display if needed */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
          <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Error loading driver behavior data</p>
            <p className="text-sm">{error.toString()}</p>
          </div>
        </div>
      )}

      {/* Main tabs for different sections */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-[600px]">
          <TabsTrigger value="performance" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>Driver Performance</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <span>Behavior Events</span>
          </TabsTrigger>
          <TabsTrigger value="car-reports" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>CAR Reports</span>
          </TabsTrigger>
        </TabsList>

        {/* Driver Performance Overview Tab */}
        <TabsContent value="performance" className="mt-6">
          <DriverPerformanceOverview
            onAddEvent={() => {
              setSelectedEvent(null);
              setShowEventForm(true);
            }}
            onViewEvent={handleViewEvent}
            onEditEvent={(event: DriverBehaviorEvent) => {
              setSelectedEvent(event);
              setShowEventForm(true);
            }}
            onSyncNow={handleSyncNow}
          />
        </TabsContent>

        {/* Behavior Events Tab */}
        <TabsContent value="events" className="mt-6">
          <div className="space-y-4">
            {/* Filters Section */}
            <div className="bg-white p-4 rounded-md border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Search by driver, fleet #, etc."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Filter className="h-4 w-4 text-gray-400" />
                    </div>
                    <select
                      className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={filterEventType}
                      onChange={e => setFilterEventType(e.target.value)}
                    >
                      <option value="all">All Event Types</option>
                      {eventTypes.map(type => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <AlertTriangle className="h-4 w-4 text-gray-400" />
                    </div>
                    <select
                      className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={filterSeverity}
                      onChange={e => setFilterSeverity(e.target.value)}
                    >
                      <option value="all">All Severities</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="webBookOnly"
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={showWebBookOnly}
                    onChange={e => setShowWebBookOnly(e.target.checked)}
                  />
                  <label htmlFor="webBookOnly" className="text-sm text-gray-700">
                    Show Web-Book Events Only
                  </label>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportData}
                  icon={<Download className="w-4 h-4" />}
                >
                  Export Data
                </Button>
              </div>
            </div>
            
            {/* Events Table */}
            <div className="bg-white shadow overflow-hidden border-b border-gray-200 rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fleet #</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                      </td>
                    </tr>
                  ) : filteredEvents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        No behavior events found matching the current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredEvents.map(event => (
                      <tr key={event.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {event.eventDate ? new Date(event.eventDate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.driverName || 'Unknown'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.eventType || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.fleetNumber || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${event.severity === 'critical' ? 'bg-red-100 text-red-800' :
                              event.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                                event.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'}`}>
                            {event.severity || 'low'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => handleViewEvent(event)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              setSelectedEvent(event);
                              setShowEventForm(true);
                            }}
                            className="text-green-600 hover:text-green-900 mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleInitiateCAR(event)}
                            className="text-purple-600 hover:text-purple-900"
                          >
                            CAR
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* CAR Reports Tab */}
        <TabsContent value="car-reports" className="mt-6">
          <CARReportList />
        </TabsContent>
      </Tabs>

      {/* Event Form Modal */}
      <DriverBehaviorEventForm
        isOpen={showEventForm}
        onClose={() => {
          setSelectedEvent(null);
          setShowEventForm(false);
        }}
        event={selectedEvent ?? undefined}
        onInitiateCAR={handleInitiateCAR}
      />

      {/* Event Details Modal */}
      {selectedEvent && (
        <DriverBehaviorEventDetails
          isOpen={showEventDetails}
          onClose={() => {
            setSelectedEvent(null);
            setShowEventDetails(false);
          }}
          event={selectedEvent}
          onEdit={() => {
            setShowEventDetails(false);
            setShowEventForm(true);
          }}
          onInitiateCAR={() => {
            setShowEventDetails(false);
            handleInitiateCAR(selectedEvent);
          }}
        />
      )}

      {/* CAR Form Modal */}
      <CARReportForm
        isOpen={showCARForm}
        onClose={() => {
          setSelectedEvent(null);
          setShowCARForm(false);
        }}
        linkedEvent={selectedEvent ?? undefined}
      />
    </div>
  );
};

export default DriverBehaviorPage;
