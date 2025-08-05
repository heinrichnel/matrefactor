import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useSyncContext } from '../context/SyncContext';
import { DieselConsumptionRecord } from '../../types';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
// Removed unused Select import
import { 
  Fuel, 
  Plus, 
  Search,
  Upload, 
  Download, 
  Settings, 
  FileText, 
  // AlertTriangle removed as unused
  CheckCircle,
  Link,
  Trash2,
  RefreshCw,
  Edit
} from 'lucide-react';
import FleetSelector from '../components/common/FleetSelector';
import { formatCurrency, formatDate } from '../utils/helpers';
import SyncIndicator from '../components/ui/SyncIndicator';
import ManualDieselEntryModal from '../components/Models/Diesel/ManualDieselEntryModal';
import DieselImportModal from '../components/Models/Diesel/DieselImportModal';
import DieselNormsModal from '../components/Models/Diesel/DieselNormsModal';
import EnhancedDieselDebriefModal from '../components/Models/Diesel/EnhancedDieselDebriefModal';
import EnhancedProbeVerificationModal from '../components/Models/Diesel/EnhancedProbeVerificationModal';
import TripLinkageModal from '../components/Models/Trips/TripLinkageModal';
import DieselEditModal from '../components/Models/Diesel/DieselEditModal';

interface DieselDashboardProps {
  className?: string;
}

const DieselDashboard: React.FC<DieselDashboardProps> = ({ className = '' }) => {
  const { 
    dieselRecords, 
    loadDieselRecords, 
    deleteDieselRecord, 
    isLoading, 
    syncDieselFromWialon 
  } = useAppContext();
  // Access the sync context for sync status indicator
  const { syncStatus } = useSyncContext();
  
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [showManualEntryModal, setShowManualEntryModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDieselNormsModal, setShowDieselNormsModal] = useState(false);
  const [showDebriefModal, setShowDebriefModal] = useState(false);
  const [showProbeModal, setShowProbeModal] = useState(false);
  const [showLinkageModal, setShowLinkageModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DieselConsumptionRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});
  const [isSyncing, setIsSyncing] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table');
  const [sortConfig, setSortConfig] = useState<{ key: keyof DieselConsumptionRecord; direction: 'ascending' | 'descending' }>({
    key: 'timestamp',
    direction: 'descending'
  });
  
  // Load diesel records on mount
  useEffect(() => {
    if (loadDieselRecords) {
      loadDieselRecords();
    }
  }, [loadDieselRecords]);
  
  // Filter and sort records
  const getFilteredRecords = () => {
    return dieselRecords
      .filter(record => {
        // Filter by selected vehicles
        if (selectedVehicles.length > 0 && !selectedVehicles.includes(record.vehicleId)) {
          return false;
        }
        
        // Filter by search term
        if (searchTerm && !record.vehicleId.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
        
        // Filter by date range
        if (dateRange.from && new Date(record.timestamp) < new Date(dateRange.from)) {
          return false;
        }
        
        if (dateRange.to && new Date(record.timestamp) > new Date(dateRange.to + 'T23:59:59')) {
          return false;
        }
        
        return true;
      })
      .sort((a, b) => {
        if (sortConfig.key === 'timestamp') {
          // Special case for dates
          const dateA = new Date(a[sortConfig.key]).getTime();
          const dateB = new Date(b[sortConfig.key]).getTime();
          return sortConfig.direction === 'ascending' ? dateA - dateB : dateB - dateA;
        } else {
          // General case for other fields
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        }
      });
  };
  
  const filteredRecords = getFilteredRecords();
  
  // Handle sorting
  const requestSort = (key: keyof DieselConsumptionRecord) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIndicator = (key: keyof DieselConsumptionRecord) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
    }
    return '';
  };
  
  // Calculate total fuel and costs
  const totalLiters = filteredRecords.reduce((sum, record) => sum + record.liters, 0);
  const totalCost = filteredRecords.reduce((sum, record) => sum + record.cost, 0);
  
  // Get unique vehicles for filtering
  const uniqueVehicles = Array.from(new Set(dieselRecords.map(record => record.vehicleId)));
  
  // Handle vehicle selection
  const handleVehicleSelection = (vehicles: string[]) => {
    setSelectedVehicles(vehicles);
  };
  
  // Handle record deletion
  const handleDeleteRecord = async (recordId: string) => {
    if (window.confirm('Are you sure you want to delete this diesel record? This action cannot be undone.')) {
      setIsDeleting(prev => ({ ...prev, [recordId]: true }));
      try {
        await deleteDieselRecord(recordId);
      } catch (error) {
        console.error('Failed to delete record:', error);
        alert('Failed to delete record. Please try again.');
      } finally {
        setIsDeleting(prev => ({ ...prev, [recordId]: false }));
      }
    }
  };
  
  // Handle Wialon sync
  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncDieselFromWialon();
    } catch (error) {
      console.error('Failed to sync with Wialon:', error);
      alert('Failed to sync diesel data from Wialon. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };
  
  // Handle record edit
  const handleEditRecord = (record: DieselConsumptionRecord) => {
    setSelectedRecord(record);
    setShowEditModal(true);
  };
  
  // Handle trip linkage
  const handleLinkToTrip = (record: DieselConsumptionRecord) => {
    setSelectedRecord(record);
    setShowLinkageModal(true);
  };
  
  // Handle debrief
  const handleDebrief = (record: DieselConsumptionRecord) => {
    setSelectedRecord(record);
    setShowDebriefModal(true);
  };
  
  // Handle probe verification
  const handleProbeVerification = (record: DieselConsumptionRecord) => {
    setSelectedRecord(record);
    setShowProbeModal(true);
  };
  
  // Format numbers for display
  const formatNumber = (num: number, decimals = 2) => {
    return num.toFixed(decimals);
  };
  
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Diesel Consumption</h2>
          <p className="text-sm text-gray-600">
            Track and manage diesel usage across your fleet
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => setShowManualEntryModal(true)}
            className="flex items-center"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Record
          </Button>
          <Button
            onClick={() => setShowImportModal(true)}
            variant="outline"
            className="flex items-center"
          >
            <Upload className="mr-1 h-4 w-4" />
            Import
          </Button>
          <Button
            onClick={handleSync}
            variant="outline"
            disabled={isSyncing}
            className="flex items-center"
          >
            <RefreshCw className={`mr-1 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Wialon'}
          </Button>
          <SyncIndicator status={syncStatus} />
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-1 flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by fleet number..."
                  className="pl-9 w-full p-2 border rounded"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 min-w-[200px]">
                <input
                  type="date"
                  className="flex-1 p-2 border rounded"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                />
                <span className="self-center">to</span>
                <input
                  type="date"
                  className="flex-1 p-2 border rounded"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowDieselNormsModal(true)}
                className="flex items-center text-sm"
              >
                <Settings className="mr-1 h-4 w-4" />
                Norms
              </Button>
              <div className="flex border rounded overflow-hidden">
                <button
                  onClick={() => setViewMode('card')}
                  className={`px-3 py-1 ${viewMode === 'card' ? 'bg-blue-100 text-blue-700' : 'bg-white'}`}
                >
                  Cards
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1 ${viewMode === 'table' ? 'bg-blue-100 text-blue-700' : 'bg-white'}`}
                >
                  Table
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <FleetSelector 
              onSelectionChange={handleVehicleSelection}
              selectedVehicles={selectedVehicles}
              availableVehicles={uniqueVehicles}
              label="Filter by fleet:"
            />
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="mb-4 flex justify-between items-center">
            <div className="space-x-4">
              <span className="font-medium">
                Total Records: <span className="text-blue-600">{filteredRecords.length}</span>
              </span>
              <span className="font-medium">
                Total Liters: <span className="text-blue-600">{formatNumber(totalLiters)}</span>
              </span>
              <span className="font-medium">
                Total Cost: <span className="text-blue-600">{formatCurrency(totalCost)}</span>
              </span>
            </div>
            <Button variant="outline" className="flex items-center text-sm">
              <Download className="mr-1 h-4 w-4" />
              Export
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center p-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center p-10">
              <Fuel className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No Diesel Records</h3>
              <p className="mt-1 text-sm text-gray-500">
                No records match your current filters or no records have been added yet.
              </p>
              <div className="mt-6">
                <Button onClick={() => setShowManualEntryModal(true)}>
                  Add New Record
                </Button>
              </div>
            </div>
          ) : viewMode === 'table' ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('vehicleId')}
                    >
                      Fleet Number {getSortIndicator('vehicleId')}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('timestamp')}
                    >
                      Date {getSortIndicator('timestamp')}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('liters')}
                    >
                      Liters {getSortIndicator('liters')}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('cost')}
                    >
                      Cost {getSortIndicator('cost')}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('odometer')}
                    >
                      Odometer {getSortIndicator('odometer')}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.map(record => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{record.vehicleId}</div>
                        <div className="text-xs text-gray-500">
                          {record.location || 'Location not available'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(record.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatNumber(record.liters)} L
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(record.cost)}
                        <div className="text-xs text-gray-500">
                          {formatCurrency(record.cost / record.liters)}/L
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatNumber(record.odometer, 0)} km
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            record.verified
                              ? 'bg-green-100 text-green-800'
                              : record.flagged
                              ? 'bg-red-100 text-red-800'
                              : record.tripId
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {record.verified
                            ? 'Verified'
                            : record.flagged
                            ? 'Flagged'
                            : record.tripId
                            ? 'Linked'
                            : 'Unprocessed'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEditRecord(record)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDebrief(record)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Debrief
                          </button>
                          <button
                            onClick={() => handleProbeVerification(record)}
                            className={`${
                              record.verified ? 'text-green-600 hover:text-green-900' : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            {record.verified ? 'Verified' : 'Verify'}
                          </button>
                          <button
                            onClick={() => handleLinkToTrip(record)}
                            className={`${
                              record.tripId ? 'text-blue-600 hover:text-blue-900' : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            {record.tripId ? 'Trip' : 'Link'}
                          </button>
                          <button
                            onClick={() => handleDeleteRecord(record.id)}
                            disabled={isDeleting[record.id]}
                            className="text-red-600 hover:text-red-900"
                          >
                            {isDeleting[record.id] ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecords.map(record => (
                <div
                  key={record.id}
                  className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-lg">{record.vehicleId}</div>
                        <div className="text-sm text-gray-600">{formatDate(record.timestamp)}</div>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          record.verified
                            ? 'bg-green-100 text-green-800'
                            : record.flagged
                            ? 'bg-red-100 text-red-800'
                            : record.tripId
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {record.verified
                          ? 'Verified'
                          : record.flagged
                          ? 'Flagged'
                          : record.tripId
                          ? 'Linked'
                          : 'Unprocessed'}
                      </span>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Liters</div>
                        <div className="text-lg font-medium">{formatNumber(record.liters)} L</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Cost</div>
                        <div className="text-lg font-medium">{formatCurrency(record.cost)}</div>
                        <div className="text-xs text-gray-500">
                          {formatCurrency(record.cost / record.liters)}/L
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Odometer</div>
                        <div className="text-lg font-medium">{formatNumber(record.odometer, 0)} km</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Location</div>
                        <div className="text-base truncate">{record.location || 'N/A'}</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-between">
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEditRecord(record)}
                          className="p-1 text-gray-600 hover:text-indigo-600"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDebrief(record)}
                          className="p-1 text-gray-600 hover:text-blue-600"
                          title="Debrief"
                        >
                          <FileText size={18} />
                        </button>
                        <button
                          onClick={() => handleProbeVerification(record)}
                          className={`p-1 ${
                            record.verified ? 'text-green-600' : 'text-gray-600 hover:text-green-600'
                          }`}
                          title="Verify with Probe"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => handleLinkToTrip(record)}
                          className={`p-1 ${
                            record.tripId ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
                          }`}
                          title={record.tripId ? 'View Linked Trip' : 'Link to Trip'}
                        >
                          <Link size={18} />
                        </button>
                      </div>
                      <button
                        onClick={() => handleDeleteRecord(record.id)}
                        disabled={isDeleting[record.id]}
                        className="p-1 text-gray-600 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 size={18} className={isDeleting[record.id] ? 'animate-pulse' : ''} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination could be added here */}
        </CardContent>
      </Card>
      
      {/* Modals */}
      {showManualEntryModal && (
        <ManualDieselEntryModal 
          isOpen={showManualEntryModal}
          onClose={() => setShowManualEntryModal(false)}
        />
      )}
      
      {showImportModal && (
        <DieselImportModal 
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
        />
      )}
      
      {showDieselNormsModal && (
        <DieselNormsModal 
          isOpen={showDieselNormsModal}
          onClose={() => setShowDieselNormsModal(false)}
        />
      )}
      
      {showDebriefModal && selectedRecord && (
        <EnhancedDieselDebriefModal 
          isOpen={showDebriefModal}
          onClose={() => {
            setShowDebriefModal(false);
            setSelectedRecord(null);
          }}
          record={selectedRecord}
        />
      )}
      
      {showProbeModal && selectedRecord && (
        <EnhancedProbeVerificationModal 
          isOpen={showProbeModal}
          onClose={() => {
            setShowProbeModal(false);
            setSelectedRecord(null);
          }}
          record={selectedRecord}
        />
      )}
      
      {showLinkageModal && selectedRecord && (
        <TripLinkageModal 
          isOpen={showLinkageModal}
          onClose={() => {
            setShowLinkageModal(false);
            setSelectedRecord(null);
          }}
          dieselRecord={selectedRecord}
        />
      )}
      
      {showEditModal && selectedRecord && (
        <DieselEditModal 
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedRecord(null);
          }}
          record={selectedRecord}
        />
      )}
    </div>
  );
};

export default DieselDashboard;
