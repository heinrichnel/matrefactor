import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Trip, CostEntry } from '../../types';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  ArrowLeft,
  FileText,
  Plus,
  AlertTriangle,
  CheckCircle,
  TruckIcon,
  PackageCheck
} from 'lucide-react';
import CostList from '../../components/lists/CostList';
// Import removed: TripDetails
import TripCostEntryModal from '../../components/Models/Trips/TripCostEntryModal';
import SystemCostsModal from '../../components/Models/Trips/SystemCostsModal';

// Utility imports
import { formatCurrency } from '../../utils/formatters';

const TripDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTrip, addCostEntry, updateCostEntry, deleteCostEntry, completeTrip, updateTripStatus } = useAppContext();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddCostModal, setShowAddCostModal] = useState(false);
  const [showSystemCostsModal, setShowSystemCostsModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'costs' | 'documents'>('details');
  const [editingCost, setEditingCost] = useState<CostEntry | null>(null);

  useEffect(() => {
    if (!id) return;
    
    try {
      const tripData = getTrip(id);
      if (tripData) {
        setTrip(tripData);
      } else {
        setError('Trip not found');
      }
    } catch (err) {
      setError('Error loading trip details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id, getTrip]);

  const handleAddCost = async (costData: Omit<CostEntry, 'id' | 'attachments'>, files?: FileList) => {
    if (!trip) return;
    
    try {
      await addCostEntry({
        ...costData,
        tripId: trip.id
      }, files);
      
      // Refresh trip data
      const updatedTrip = getTrip(trip.id);
      if (updatedTrip) {
        setTrip(updatedTrip);
      }
      
      setShowAddCostModal(false);
    } catch (err) {
      console.error('Error adding cost:', err);
    }
  };

  const handleUpdateCost = async (costData: CostEntry) => {
    try {
      await updateCostEntry(costData);
      
      // Refresh trip data
      if (trip) {
        const updatedTrip = getTrip(trip.id);
        if (updatedTrip) {
          setTrip(updatedTrip);
        }
      }
      
      setEditingCost(null);
    } catch (err) {
      console.error('Error updating cost:', err);
    }
  };

  const handleDeleteCost = async (costId: string) => {
    try {
      await deleteCostEntry(costId);
      
      // Refresh trip data
      if (trip) {
        const updatedTrip = getTrip(trip.id);
        if (updatedTrip) {
          setTrip(updatedTrip);
        }
      }
    } catch (err) {
      console.error('Error deleting cost:', err);
    }
  };

  const handleCompleteTrip = async () => {
    if (!trip) return;
    
    try {
      await completeTrip(trip.id);
      navigate('/completed-trips');
    } catch (err) {
      console.error('Error completing trip:', err);
    }
  };

  const handleShipTrip = async () => {
    if (!trip) return;
    try {
      await updateTripStatus(trip.id, 'shipped', 'Marked as shipped');
      // Refresh trip data
      const updatedTrip = getTrip(trip.id);
      if (updatedTrip) {
        setTrip(updatedTrip);
      }
    } catch (err) {
      console.error('Error marking trip as shipped:', err);
    }
  };

  const handleDeliverTrip = async () => {
    if (!trip) return;
    try {
      await updateTripStatus(trip.id, 'delivered', 'Marked as delivered');
      // Refresh trip data
      const updatedTrip = getTrip(trip.id);
      if (updatedTrip) {
        setTrip(updatedTrip);
      }
    } catch (err) {
      console.error('Error marking trip as delivered:', err);
    }
  };

  const calculateTotalCosts = (costs: CostEntry[]) => {
    return costs.reduce((sum, cost) => sum + Number(cost.amount), 0);
  };

  const calculateProfitMargin = (revenue: number, costs: number) => {
    if (revenue === 0) return 0;
    return ((revenue - costs) / revenue) * 100;
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading trip</h3>
              <div className="mt-2 text-sm text-red-700">{error || 'Trip not found'}</div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Button onClick={() => navigate('/trips')} variant="outline" icon={<ArrowLeft className="h-4 w-4" />}>
            Back to Trips
          </Button>
        </div>
      </div>
    );
  }

  // Calculate financial data
  const totalCosts = calculateTotalCosts(trip.costs || []);
  const profitMargin = calculateProfitMargin(trip.baseRevenue || 0, totalCosts);
  const netProfit = (trip.baseRevenue || 0) - totalCosts;

  return (
    <div className="p-6 space-y-6">
      {/* Back button and trip header */}
      <div className="flex justify-between items-center">
        <Button onClick={() => navigate('/trips')} variant="outline" icon={<ArrowLeft className="h-4 w-4" />}>
          Back to Trips
        </Button>
        <div className="flex space-x-2">
          {!trip.shippedAt && (
            <Button onClick={handleShipTrip} variant="outline" icon={<TruckIcon className="h-4 w-4" />}>
              Ship
            </Button>
          )}
          {trip.shippedAt && !trip.deliveredAt && (
            <Button onClick={handleDeliverTrip} variant="outline" icon={<PackageCheck className="h-4 w-4" />}>
              Deliver
            </Button>
          )}
          <Button onClick={handleCompleteTrip} variant="default" icon={<CheckCircle className="h-4 w-4" />}>
            Complete Trip
          </Button>
        </div>
      </div>

      {/* Trip summary card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">
                {trip.fleetNumber} - {trip.route || trip.plannedRoute?.destination}
              </h1>
              <p className="text-sm text-gray-500">
                {new Date(trip.startDate).toLocaleDateString()} to {new Date(trip.endDate).toLocaleDateString()}
                {trip.distance && ` • ${trip.distance} km`}
              </p>
            </div>
            <div className="flex space-x-2">
              {trip.clientType === 'internal' && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  Internal
                </span>
              )}
              {trip.status === 'active' && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Active
                </span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <div className="text-sm text-blue-800">Driver</div>
              <div className="text-lg font-medium">{trip.driverName || 'Not assigned'}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-md">
              <div className="text-sm text-green-800">Base Revenue</div>
              <div className="text-lg font-medium">{formatCurrency(trip.baseRevenue || 0)}</div>
            </div>
            <div className="bg-red-50 p-4 rounded-md">
              <div className="text-sm text-red-800">Total Costs</div>
              <div className="text-lg font-medium">{formatCurrency(totalCosts)}</div>
            </div>
            <div className={`p-4 rounded-md ${netProfit >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
              <div className={`text-sm ${netProfit >= 0 ? 'text-emerald-800' : 'text-red-800'}`}>Net Profit/Loss</div>
              <div className="text-lg font-medium flex items-center justify-between">
                <span>{formatCurrency(netProfit)}</span>
                <span className={`text-sm ${netProfit >= 0 ? 'text-emerald-800' : 'text-red-800'}`}>
                  {profitMargin.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System costs banner */}
      {(trip.costs?.length === 0 || !trip.systemCostsGenerated) && (
        <Card className="border-yellow-300 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
              <div>
                <h3 className="font-medium text-yellow-800">System Costs Not Generated</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Generate system costs for accurate profitability assessment, including per-kilometer and per-day fixed costs.
                </p>
                <Button 
                  className="mt-2" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowSystemCostsModal(true)}
                >
                  Generate System Costs
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'details'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('details')}
          >
            Trip Details
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'costs'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('costs')}
          >
            Costs & Expenses
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'documents'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('documents')}
          >
            Documents & Notes
          </button>
        </nav>
      </div>

      {/* Tab content */}
      <div className="mt-6">
        {activeTab === 'details' && (
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium">Trip Information</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Route</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {trip.route || `${trip.plannedRoute?.origin || 'N/A'} to ${trip.plannedRoute?.destination || 'N/A'}`}
                  </p>
                  
                  <h3 className="text-sm font-medium text-gray-500 mt-4">Distance</h3>
                  <p className="mt-1 text-sm text-gray-900">{trip.distanceKm || '0'} km</p>
                  
                  <h3 className="text-sm font-medium text-gray-500 mt-4">Client</h3>
                  <p className="mt-1 text-sm text-gray-900">{trip.clientName || 'N/A'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Start Date</h3>
                  <p className="mt-1 text-sm text-gray-900">{new Date(trip.startDate).toLocaleDateString()}</p>
                  
                  <h3 className="text-sm font-medium text-gray-500 mt-4">End Date</h3>
                  <p className="mt-1 text-sm text-gray-900">{new Date(trip.endDate).toLocaleDateString()}</p>
                  
                  <h3 className="text-sm font-medium text-gray-500 mt-4">Description</h3>
                  <p className="mt-1 text-sm text-gray-900">{trip.description || 'No description provided'}</p>
                </div>
              </div>
              
              {trip.plannedRoute?.waypoints && trip.plannedRoute.waypoints.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500">Waypoints</h3>
                  <ul className="mt-1 text-sm text-gray-900 list-disc pl-5">
                    {trip.plannedRoute.waypoints.map((waypoint, index) => (
                      <li key={index}>{waypoint}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'costs' && (
          <div className="space-y-6">
            <div className="flex justify-between">
              <h2 className="text-lg font-medium">Trip Costs</h2>
              <Button 
                onClick={() => setShowAddCostModal(true)}
                icon={<Plus className="h-4 w-4" />}
              >
                Add Cost Entry
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <CostList 
                  costs={trip.costs || []} 
                  onEdit={setEditingCost} 
                  onDelete={handleDeleteCost}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'documents' && (
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium">Documents & Notes</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Notes */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Trip Notes</h3>
                  <p className="mt-1 text-sm text-gray-900 p-4 bg-gray-50 rounded-md">
                    {trip.notes || 'No notes added'}
                  </p>
                </div>
                
                {/* Attachments */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Attachments</h3>
                  {trip.attachments && trip.attachments.length > 0 ? (
                    <ul className="mt-2 divide-y divide-gray-200">
                      {trip.attachments.map((attachment, index) => (
                        <li key={index} className="py-3 flex items-center justify-between">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-gray-400" />
                            <span className="ml-2 text-sm text-gray-900">{attachment.name}</span>
                          </div>
                          <Button size="sm" variant="ghost">View</Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1 text-sm text-gray-500">No attachments added</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Cost Modal */}
      {showAddCostModal && (
        <TripCostEntryModal 
          isOpen={showAddCostModal}
          onClose={() => setShowAddCostModal(false)}
          onSubmit={handleAddCost}
        />
      )}

      {/* Edit Cost Modal */}
      {editingCost && (
        <TripCostEntryModal
          isOpen={!!editingCost}
          onClose={() => setEditingCost(null)}
          onSubmit={(data) => handleUpdateCost({ ...editingCost, ...data })}
          initialData={editingCost}
        />
      )}

      {/* System Costs Modal */}
      {showSystemCostsModal && (
        <SystemCostsModal
          isOpen={showSystemCostsModal}
          onClose={() => setShowSystemCostsModal(false)}
          tripData={trip}
        />
      )}
    </div>
  );
};

export default TripDetailsPage;
