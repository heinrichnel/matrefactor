import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Globe,
  MapPin,
  PackageCheck,
  Pencil,
  RefreshCw,
  Save,
  Shield,
  Trash2,
  Truck as TruckIcon,
  Upload,
  X
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AddTripModal from '../../components/Models/Trips/AddTripModal';
import { useAppContext } from '../../context/AppContext';
import {
  CostBreakdown,
  DriverFormData,
  ImportSource,
  SupportedCurrency,
  UITrip
} from '../../types/index'; // Assuming these types are correctly imported

// Mock data and helper functions
const db = {}; // Placeholder for Firestore db instance
const displayCurrency: SupportedCurrency = 'USD'; // Default currency
const formatCurrency = (amount: number, currency: SupportedCurrency) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  });
  return formatter.format(amount);
};
const formatDate = (dateString: string) => (dateString ? new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '-');
const formatDateTime = (dateTimeString: string) =>
  dateTimeString ? new Date(dateTimeString).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';
const mockDrivers: DriverFormData[] = [
  {
    id: 'drv-001',
    name: 'John Doe',
    email: 'john.doe@matanuska.com',
    phone: '+233 20 123 4567',
    address: '123 Accra Road, Tema, Ghana',
    dateOfBirth: '1985-05-15',
    licenseNumber: 'GH-DL-123456',
    licenseExpiry: '2026-03-14',
    licenseClass: 'Commercial',
    status: 'active',
    emergencyContactName: 'Sarah Doe',
    emergencyContactRelationship: 'Spouse',
    emergencyContactPhone: '+233 20 123 9876',
    nationality: 'Ghanaian',
    nationalId: 'GHA-98765432',
    bankName: 'Ghana Commercial Bank',
    accountNumber: '1234567890',
    branch: 'Accra Main',
  },
  {
    id: 'drv-002',
    name: 'Jane Smith',
    email: 'jane.smith@matanuska.com',
    phone: '+233 20 987 6543',
    address: '456 Kumasi Road, Accra, Ghana',
    dateOfBirth: '1990-08-22',
    licenseNumber: 'GH-DL-789012',
    licenseExpiry: '2025-05-19',
    licenseClass: 'Commercial',
    status: 'active',
    emergencyContactName: 'Robert Smith',
    emergencyContactRelationship: 'Father',
    emergencyContactPhone: '+233 20 876 5432',
    nationality: 'Ghanaian',
    nationalId: 'GHA-12345678',
    bankName: 'Ecobank Ghana',
    accountNumber: '0987654321',
    branch: 'Kumasi Branch',
  },
];
const useRealtimeTrips = ({ status, onlyWebBook }: { status?: string; onlyWebBook?: boolean }) => {
  const { trips: allContextTrips } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const filteredTrips = useMemo(() => {
    setLoading(true);
    let filtered = allContextTrips;
    if (status) {
      filtered = filtered.filter((trip) => trip.status === status);
    }
    if (onlyWebBook) {
      filtered = filtered.filter((trip) => trip.importSource === 'web_book');
    }
    setLoading(false);
    return filtered;
  }, [allContextTrips, status, onlyWebBook]);
  return { trips: filteredTrips, loading, error };
};
// Re-usable UI components (Card, Button, Modal, etc.) would be defined here or imported.
const Card = ({ children, className = '' }: any) => <div className={`bg-white shadow rounded-lg ${className}`}>{children}</div>;
const CardHeader = ({ title, subtitle, action }: any) => (
  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
    <div>
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);
const CardContent = ({ children, className = '' }: any) => <div className={`p-6 ${className}`}>{children}</div>;
const Button = ({ children, onClick, type = 'button', variant = 'primary', disabled = false, className = '', icon, isLoading, title }: any) => {
  let baseStyle = 'inline-flex items-center justify-center font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200';
  let variantStyle = '';
  switch (variant) {
    case 'outline':
      variantStyle = 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-indigo-500';
      break;
    case 'danger':
      variantStyle = 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500';
      break;
    default:
      variantStyle = 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500';
      break;
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyle} px-4 py-2 text-base ${variantStyle} ${className}`}
      title={title}>
      {isLoading ? <span className="animate-spin mr-2">⟳</span> : icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};
const Modal = ({ isOpen, onClose, title, maxWidth = 'lg', children }: any) => {
  if (!isOpen) return null;
  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
  }[maxWidth];
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg shadow-xl w-full ${maxWidthClass} max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};
const Input = ({ label, error, ...props }: any) => (
  <div>
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <input {...props} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);
const Select = ({ label, options, error, ...props }: any) => (
  <div>
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <select {...props} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
      {options.map((option: any) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);
const TextArea = ({ label, error, ...props }: any) => (
  <div>
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <textarea {...props} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);
const Checkbox = ({ label, ...props }: any) => (
  <div className="flex items-center">
    <input {...props} type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
    {label && <label className="ml-2 text-sm text-gray-700">{label}</label>}
  </div>
);
// Mock components for modals
const CompletedTripEditModal = ({ isOpen, onClose, trip, onSave }: any) => {
  const [formData, setFormData] = useState({
    fleetNumber: trip.fleetNumber,
    driverName: trip.driverName,
    clientName: trip.clientName,
    startDate: trip.startDate,
    endDate: trip.endDate,
    route: trip.route,
    description: trip.description || '',
    baseRevenue: trip.baseRevenue.toString(),
    revenueCurrency: trip.revenueCurrency,
    distanceKm: trip.distanceKm?.toString() || '',
  });
  const [editReason, setEditReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!editReason) newErrors.editReason = 'Edit reason is required for completed trips';
    if (editReason === 'Other (specify in comments)' && !customReason.trim()) newErrors.customReason = 'Please specify the reason for editing';
    const hasChanges = Object.keys(formData).some((key) => {
      const originalValue = (trip as any)[key]?.toString() || '';
      const newValue = (formData as any)[key] || '';
      return originalValue !== newValue;
    });
    if (!hasChanges) newErrors.general = 'No changes detected. Please make changes before saving.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSave = () => {
    if (!validateForm()) return;
    const changes: Array<{ field: string; oldValue: string; newValue: string }> = [];
    Object.keys(formData).forEach((key) => {
      const originalValue = (trip as any)[key]?.toString() || '';
      const newValue = (formData as any)[key] || '';
      if (originalValue !== newValue) {
        changes.push({ field: key, oldValue: originalValue, newValue: newValue });
      }
    });
    const finalReason = editReason === 'Other (specify in comments)' ? customReason : editReason;
    changes.forEach((change) => {
      const editRecord = {
        tripId: trip.id,
        editedBy: 'Current User',
        editedAt: new Date().toISOString(),
        reason: finalReason,
        fieldChanged: change.field,
        oldValue: change.oldValue,
        newValue: change.newValue,
        changeType: 'update',
      };
      const updatedTrip = {
        ...trip,
        ...formData,
        baseRevenue: Number(formData.baseRevenue),
        distanceKm: formData.distanceKm ? Number(formData.distanceKm) : undefined,
        editHistory: [...(trip.editHistory || []), { ...editRecord, id: `edit-${Date.now()}-${Math.random()}` }],
      };
      onSave(updatedTrip, editRecord);
    });
    onClose();
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Completed Trip" maxWidth="lg">
      <div className="space-y-6">
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-amber-800">Editing Completed Trip</h4>
              <p className="text-sm text-amber-700 mt-1">
                This trip has been completed. All changes will be logged with timestamps and reasons for audit purposes. The edit history will be included in all future reports and exports.
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-4 border-t pt-4">
          <h3 className="text-lg font-medium text-gray-900">Edit Justification (Required)</h3>
          <Select
            label="Reason for Edit *"
            value={editReason}
            onChange={(e) => setEditReason(e.target.value)}
            options={[{ label: 'Select reason for editing...', value: '' }, { label: 'Data Entry Error', value: 'Data Entry Error' }, { label: 'Other (specify in comments)', value: 'Other (specify in comments)' }]}
            error={errors.editReason}
          />
          {editReason === 'Other (specify in comments)' && (
            <TextArea label="Specify Reason *" value={customReason} onChange={(e) => setCustomReason(e.target.value)} placeholder="Please provide a detailed reason for editing this completed trip..." rows={3} error={errors.customReason} />
          )}
        </div>
        <div className="space-y-4 border-t pt-4">
          <h3 className="text-lg font-medium text-gray-900">Trip Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Fleet Number" value={formData.fleetNumber} onChange={(e) => handleChange('fleetNumber', e.target.value)} />
            <Input label="Driver Name" value={formData.driverName} onChange={(e) => handleChange('driverName', e.target.value)} />
            <Input label="Client Name" value={formData.clientName} onChange={(e) => handleChange('clientName', e.target.value)} />
            <Input label="Route" value={formData.route} onChange={(e) => handleChange('route', e.target.value)} />
            <Input label="Start Date" type="date" value={formData.startDate} onChange={(e) => handleChange('startDate', e.target.value)} />
            <Input label="End Date" type="date" value={formData.endDate} onChange={(e) => handleChange('endDate', e.target.value)} />
            <Select label="Currency" value={formData.revenueCurrency} onChange={(e) => handleChange('revenueCurrency', e.target.value)} options={[{ label: 'ZAR (R)', value: 'ZAR' }, { label: 'USD ($)', value: 'USD' }]} />
            <Input label="Base Revenue" type="number" step="0.01" value={formData.baseRevenue} onChange={(e) => handleChange('baseRevenue', e.target.value)} />
            <Input label="Distance (km)" type="number" step="0.1" value={formData.distanceKm} onChange={(e) => handleChange('distanceKm', e.target.value)} />
          </div>
          <TextArea label="Description" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} rows={3} />
        </div>
        {errors.general && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
            {errors.general}
          </div>
        )}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} icon={<X className="w-4 h-4" />}>
            Cancel
          </Button>
          <Button onClick={handleSave} icon={<Save className="w-4 h-4" />}>
            Save Changes & Log Edit
          </Button>
        </div>
      </div>
    </Modal>
  );
};
const TripDeletionModal = ({ isOpen, onClose, trip, onDelete, userRole }: any) => {
  const [deletionReason, setDeletionReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const confirmationText = `DELETE ${trip.fleetNumber}`;
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!deletionReason) newErrors.deletionReason = 'Deletion reason is required';
    if (deletionReason === 'Other (specify in comments)' && !customReason.trim()) newErrors.customReason = 'Please specify the reason for deletion';
    if (confirmText !== confirmationText) newErrors.confirmText = `Please type "${confirmationText}" to confirm deletion`;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleDelete = () => {
    if (!validateForm()) return;
    const finalReason = deletionReason === 'Other (specify in comments)' ? customReason : deletionReason;
    const deletionRecord = {
      tripId: trip.id,
      deletedBy: 'Current User',
      deletedAt: new Date().toISOString(),
      reason: finalReason,
      tripData: JSON.stringify(trip),
      totalRevenue: trip.baseRevenue,
      totalCosts: 0,
      costEntriesCount: 0,
      flaggedItemsCount: 0,
    };
    onDelete(trip, deletionRecord);
    onClose();
  };
  if (userRole !== 'admin') {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Access Denied" maxWidth="md">
        <div className="text-center space-y-4">
          <Shield className="w-16 h-16 text-red-500 mx-auto" />
          <h3 className="text-lg font-medium text-gray-900">Insufficient Permissions</h3>
          <p className="text-gray-600">Only administrators can delete completed trips. This restriction ensures data integrity and audit compliance.</p>
          <Button onClick={onClose}>Close</Button>
        </div>
      </Modal>
    );
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Completed Trip" maxWidth="lg">
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-red-800">CRITICAL: Permanent Deletion</h4>
              <p className="text-sm text-red-700 mt-1">This action will permanently delete the completed trip and all associated data. This operation cannot be undone. All deletion details will be logged for governance and audit purposes.</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-md p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Trip to be Deleted</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p>
                <strong>Fleet:</strong> {trip.fleetNumber}
              </p>
              <p>
                <strong>Driver:</strong> {trip.driverName}
              </p>
              <p>
                <strong>Route:</strong> {trip.route}
              </p>
              <p>
                <strong>Client:</strong> {trip.clientName}
              </p>
            </div>
            <div>
              <p>
                <strong>Period:</strong> {trip.startDate} to {trip.endDate}
              </p>
              <p>
                <strong>Revenue:</strong> {formatCurrency(trip.baseRevenue, trip.revenueCurrency)}
              </p>
              <p>
                <strong>Total Costs:</strong> 0
              </p>
              <p>
                <strong>Status:</strong> {trip.status.toUpperCase()}
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Deletion Justification (Required)</h3>
          <Select
            label="Reason for Deletion *"
            value={deletionReason}
            onChange={(e) => setDeletionReason(e.target.value)}
            options={[{ label: 'Select reason for deletion...', value: '' }, { label: 'Duplicate Entry', value: 'Duplicate Entry' }, { label: 'Other (specify in comments)', value: 'Other (specify in comments)' }]}
            error={errors.deletionReason}
          />
          {deletionReason === 'Other (specify in comments)' && <TextArea label="Specify Reason *" value={customReason} onChange={(e) => setCustomReason(e.target.value)} placeholder="Please provide a detailed reason for deleting this completed trip..." rows={3} error={errors.customReason} />}
        </div>
        <div className="space-y-4 border-t pt-4">
          <h3 className="text-lg font-medium text-gray-900">Confirmation Required</h3>
          <p className="text-sm text-gray-600">
            To confirm deletion, please type <strong>{confirmationText}</strong> in the field below:
          </p>
          <input type="text" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder={confirmationText} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500" />
          {errors.confirmText && <p className="text-sm text-red-600">{errors.confirmText}</p>}
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-blue-800">Data Retention & Audit Trail</h4>
          <p className="text-sm text-blue-700 mt-1">Upon deletion, the following information will be permanently archived in the deletion log:</p>
          <ul className="text-sm text-blue-700 mt-2 list-disc list-inside">
            <li>Complete trip data snapshot</li>
            <li>All cost entries and attachments metadata</li>
            <li>Deletion timestamp and administrator details</li>
            <li>Justification reason and comments</li>
            <li>Financial summary (revenue, costs, profit/loss)</li>
          </ul>
        </div>
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} icon={<X className="w-4 h-4" />}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={confirmText !== confirmationText} icon={<Trash2 className="w-4 h-4" />}>
            Permanently Delete Trip
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Main Component
const ActiveTripsPage: React.FC = () => {
  const navigate = useNavigate();
  const { trips: allContextTrips, updateTrip, deleteTrip, addTrip } = useAppContext();
  const [filterWebBookOnly, setFilterWebBookOnly] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const { trips: rtTrips, loading, error } = useRealtimeTrips({ onlyWebBook: filterWebBookOnly || undefined, status: statusFilter || undefined });
  const [webhookTrips, setWebhookTrips] = useState<UITrip[]>([]);
  const [csvTrips, setCsvTrips] = useState<UITrip[]>([]);
  const [confirm, setConfirm] = useState<{ open: boolean; tripId?: string; action?: string }>({ open: false });
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [editingTrip, setEditingTrip] = useState<UITrip | null>(null);
  const [editForm, setEditForm] = useState<Required<CostBreakdown> & { cost: number }>({ cost: 0, fuel: 0, maintenance: 0, driver: 0, tolls: 0, other: 0 });
  const [showLoadImportModal, setShowLoadImportModal] = useState(false);

  const normalizeRtTrip = (trip: any): UITrip => ({
    id: trip.id,
    loadRef: trip.loadRef || `TR-${trip.id.substring(0, 8)}`,
    customer: trip.clientName,
    origin: trip.route?.split(' - ')[0] || 'Unknown',
    destination: trip.route?.split(' - ')[1] || 'Unknown',
    status: trip.status,
    shippedStatus: trip.status === 'shipped' || trip.status === 'delivered',
    deliveredStatus: trip.status === 'delivered',
    importSource: (trip.importSource as ImportSource) || 'manual',
    startTime: trip.startDate,
    endTime: trip.endDate,
    driver: trip.driverName || 'Unassigned',
    vehicle: trip.fleetNumber || 'Unassigned',
    distance: trip.distanceKm || 0,
    totalCost: trip.baseRevenue,
    costBreakdown: trip.costBreakdown || {},
    externalId: trip.externalId,
    lastUpdated: trip.lastUpdated,
  });

  const fetchWebhookTrips = async () => {
    const mock: UITrip[] = [
      {
        id: 'wh-1',
        loadRef: 'WH-2023-001',
        customer: 'WebhookCustomer1',
        origin: 'Miami, FL',
        destination: 'Orlando, FL',
        status: 'active',
        shippedStatus: false,
        deliveredStatus: false,
        importSource: 'webhook',
        startTime: '2025-07-14T10:00:00',
        endTime: '2025-07-15T16:00:00',
        driver: 'Alex Thompson',
        vehicle: 'Truck WH-123',
        distance: 235,
        totalCost: 0,
        costBreakdown: { fuel: 0, maintenance: 0, driver: 0, tolls: 0, other: 0 },
        externalId: 'ext-12345',
        lastUpdated: '2025-07-14T10:00:00.000Z',
      },
      {
        id: 'wh-2',
        loadRef: 'WH-2023-002',
        customer: 'WebhookCustomer2',
        origin: 'Austin, TX',
        destination: 'Houston, TX',
        status: 'active',
        shippedStatus: false,
        deliveredStatus: false,
        importSource: 'webhook',
        startTime: '2025-07-16T08:30:00',
        endTime: '2025-07-17T12:00:00',
        driver: 'Jamie Rodriguez',
        vehicle: 'Truck WH-456',
        distance: 162,
        totalCost: 0,
        costBreakdown: { fuel: 0, maintenance: 0, driver: 0, tolls: 0, other: 0 },
        externalId: 'ext-67890',
        lastUpdated: '2025-07-16T08:30:00.000Z',
      },
    ];
    setWebhookTrips(mock);
  };

  useEffect(() => {
    fetchWebhookTrips();
  }, []);

  const allTrips: UITrip[] = useMemo(() => [...rtTrips.map(normalizeRtTrip), ...webhookTrips, ...csvTrips], [rtTrips, webhookTrips, csvTrips]);
  const webBookTrips = allTrips.filter((trip) => trip.importSource === 'web_book');
  const manualAndOtherTrips = allTrips.filter((trip) => trip.importSource !== 'web_book');

  const handleEditTripCosts = (trip: UITrip) => {
    setEditingTrip(trip);
    const cb = trip.costBreakdown || {};
    const cost = (cb.fuel || 0) + (cb.maintenance || 0) + (cb.driver || 0) + (cb.tolls || 0) + (cb.other || 0) || trip.totalCost || 0;
    setEditForm({ cost, fuel: cb.fuel || 0, maintenance: cb.maintenance || 0, driver: cb.driver || 0, tolls: cb.tolls || 0, other: cb.other || 0 });
  };
  const handleEditCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value || '0') || 0;
    setEditForm((prev) => {
      const updatedValues = { ...prev, [name]: numValue };
      const totalCost = (updatedValues.fuel || 0) + (updatedValues.maintenance || 0) + (updatedValues.driver || 0) + (updatedValues.tolls || 0) + (updatedValues.other || 0);
      return { ...updatedValues, cost: totalCost };
    });
  };
  const handleSaveCosts = async () => {
    if (!editingTrip) return;
    const updatedTrip: UITrip = {
      ...editingTrip,
      totalCost: editForm.cost,
      costBreakdown: { fuel: editForm.fuel, maintenance: editForm.maintenance, driver: editForm.driver, tolls: editForm.tolls, other: editForm.other },
      lastUpdated: new Date().toISOString(),
    };
    if (updatedTrip.importSource === 'webhook') {
      setWebhookTrips((prev) => prev.map((t) => (t.id === updatedTrip.id ? updatedTrip : t)));
    } else if (updatedTrip.importSource === 'csv') {
      setCsvTrips((prev) => prev.map((t) => (t.id === updatedTrip.id ? updatedTrip : t)));
    } else {
      const tripInContext = allContextTrips.find((t) => t.id === updatedTrip.id);
      if (tripInContext) {
        updateTrip({ ...tripInContext, baseRevenue: updatedTrip.totalCost, updatedAt: new Date().toISOString() });
      }
    }
    setEditingTrip(null);
  };
  const handleDeleteTrip = (tripId: string) => setConfirm({ open: true, tripId, action: 'delete' });
  const handleShipTrip = async (trip: UITrip) => {
    setActionLoading(trip.id + ':ship');
    try {
      const tripInContext = allContextTrips.find((t) => t.id === trip.id);
      if (tripInContext) {
        updateTrip({ ...tripInContext, status: 'shipped', shippedAt: new Date().toISOString(), statusNotes: 'Marked as shipped on ' + new Date().toLocaleString() });
      }
    } finally {
      setActionLoading(null);
    }
  };
  const handleDeliverTrip = async (trip: UITrip) => {
    setActionLoading(trip.id + ':deliver');
    try {
      const tripInContext = allContextTrips.find((t) => t.id === trip.id);
      if (tripInContext) {
        updateTrip({ ...tripInContext, status: 'delivered', deliveredAt: new Date().toISOString(), statusNotes: 'Marked as delivered on ' + new Date().toLocaleString() });
      }
    } finally {
      setActionLoading(null);
    }
  };
  const handleCompleteTrip = async (trip: UITrip) => {
    setActionLoading(trip.id + ':complete');
    try {
      const tripInContext = allContextTrips.find((t) => t.id === trip.id);
      if (tripInContext) {
        const unresolvedCount = tripInContext.costs.filter((c) => c.isFlagged && !(c as any).isResolved).length;
        if (unresolvedCount > 0) {
          alert(`Cannot complete trip: ${unresolvedCount} unresolved flagged items.`);
          return;
        }
        updateTrip({ ...tripInContext, status: 'completed', completedAt: new Date().toISOString() });
      }
    } finally {
      setActionLoading(null);
    }
  };
  const confirmYes = async () => {
    if (!confirm.tripId || !confirm.action) return;
    const { tripId, action } = confirm;
    setActionLoading(tripId + ':' + action);
    try {
      if (action === 'delete') {
        const tripToDelete = allContextTrips.find((t) => t.id === tripId);
        if (tripToDelete) {
          deleteTrip(tripId);
        } else {
          setWebhookTrips((prev) => prev.filter((t) => t.id !== tripId));
          setCsvTrips((prev) => prev.filter((t) => t.id !== tripId));
        }
      }
    } finally {
      setActionLoading(null);
      setConfirm({ open: false });
    }
  };
  const handleDownloadTemplate = () => {
    const headers = ['Trip Number', 'Origin', 'Destination', 'Start Date', 'End Date', 'Driver', 'Vehicle', 'Distance', 'Cost', 'Fuel Cost', 'Maintenance Cost', 'Driver Cost', 'Tolls', 'Other Costs'];
    const sample = 'TR-2025-0001,New York NY,Boston MA,2025-07-20,2025-07-22,John Doe,Truck 101,215,1200,600,200,300,75,25';
    const csv = [headers.join(','), sample].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trips-import-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleAddTripSubmit = (tripData: any) => {
    addTrip({
      ...tripData,
      id: `manual-${Date.now()}`,
      importSource: 'manual',
      status: 'active',
      costs: [],
      additionalCosts: [],
      delayReasons: [],
      followUpHistory: [],
      baseRevenue: tripData.baseRevenue,
      revenueCurrency: tripData.revenueCurrency,
      clientName: tripData.clientName,
      route: tripData.route,
      fleetNumber: tripData.fleetNumber,
      driverName: tripData.driver,
      startDate: tripData.startDate,
      endDate: tripData.endDate,
    });
  };
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading active trips...</span>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-red-800">Error loading trips</h3>
          <p className="mt-2 text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }
  const StatusBadge: React.FC<{ status?: string; shipped?: boolean; delivered?: boolean }> = ({ status, shipped, delivered }) => {
    if (delivered) {
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          Delivered
        </span>
      );
    }
    if (shipped) {
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
          Shipped
        </span>
      );
    }
    return (
      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
        {status || 'Pending'}
      </span>
    );
  };
  return (
    <div className="p-6 space-y-6 bg-neutral-50 font-sans text-gray-800">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Active Trips</h1>
          <p className="text-gray-600">Real-time trip monitoring, webhook/CSV ingest and cost allocation</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-600">Real-time updates enabled</span>
          </div>
        </div>
      </div>
      <Card className="rounded-xl shadow-sm border border-gray-100">
        <CardHeader
          title="Filters & Actions"
          action={
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setShowLoadImportModal(true)} className="bg-purple-500 text-white hover:bg-purple-600" icon={<Upload className="w-4 h-4" />}>
                Import CSV
              </Button>
              <Button onClick={handleDownloadTemplate} className="bg-gray-600 text-white hover:bg-gray-700" icon={<Download className="w-4 h-4" />}>
                Template
              </Button>
              <Button onClick={fetchWebhookTrips} className="bg-green-600 text-white hover:bg-green-700" icon={<RefreshCw className="w-4 h-4" />}>
                Refresh Webhook Trips
              </Button>
              <Link to="/trips/add" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                + New Trip
              </Link>
            </div>
          }
        />
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 items-center">
            <Checkbox label="Web Book Trips Only" checked={filterWebBookOnly} onChange={(e) => setFilterWebBookOnly(e.target.checked)} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-xl shadow-sm border border-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-600" />
              <div className="ml-5">
                <dt className="text-sm text-gray-500">Total Active</dt>
                <dd className="text-lg font-medium text-gray-900">{allTrips.length}</dd>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm border border-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-green-600" />
              <div className="ml-5">
                <dt className="text-sm text-gray-500">Web Book</dt>
                <dd className="text-lg font-medium text-gray-900">{webBookTrips.length}</dd>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm border border-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-5">
                <dt className="text-sm text-gray-500">Manual/Other</dt>
                <dd className="text-lg font-medium text-gray-900">{manualAndOtherTrips.length}</dd>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm border border-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-purple-600" />
              <div className="ml-5">
                <dt className="text-sm text-gray-500">Delivered</dt>
                <dd className="text-lg font-medium text-gray-900">{allTrips.filter((t) => t.deliveredStatus).length}</dd>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="rounded-xl shadow-sm border border-gray-100">
        <CardHeader title={`Live Active Trips (${allTrips.length})`} subtitle="Combined real-time + webhook + CSV" />
        <CardContent className="p-0">
          {allTrips.length === 0 ? (
            <div className="text-center py-12">
              <TruckIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No active trips</h3>
              <p className="mt-1 text-sm text-gray-500">No trips match the current filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Load Ref</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allTrips.map((trip) => (
                    <tr key={trip.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/trips/${trip.id}`)}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        <Link to={`/trips/${trip.id}`} onClick={(e) => e.stopPropagation()}>{trip.loadRef}</Link>
                        {trip.importSource === 'webhook' && <span className="ml-2 px-2 inline-flex text-xs leading-5 font-medium rounded-full bg-blue-100 text-blue-800">Webhook</span>}
                        {trip.importSource === 'csv' && <span className="ml-2 px-2 inline-flex text-xs leading-5 font-medium rounded-full bg-gray-100 text-gray-800">CSV</span>}
                        {trip.externalId && <div className="text-xs text-gray-500 mt-1">Ext ID: {trip.externalId}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.customer || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <span>{trip.origin || '-'}</span>
                          <span>→</span>
                          <span>{trip.destination || '-'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={trip.status} shipped={!!trip.shippedStatus} delivered={!!trip.deliveredStatus} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          {trip.importSource === 'web_book' ? (
                            <>
                              <Globe className="h-4 w-4 text-green-600" />
                              <span className="text-green-600 font-medium">Web Book</span>
                            </>
                          ) : trip.importSource === 'webhook' ? (
                            <>
                              <TruckIcon className="h-4 w-4 text-blue-600" />
                              <span className="text-blue-600 font-medium">Webhook</span>
                            </>
                          ) : trip.importSource === 'csv' ? (
                            <>
                              <TruckIcon className="h-4 w-4 text-gray-600" />
                              <span className="text-gray-600 font-medium">CSV</span>
                            </>
                          ) : (
                            <>
                              <TruckIcon className="h-4 w-4 text-blue-600" />
                              <span className="text-blue-600 font-medium">Manual</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trip.startTime ? new Date(trip.startTime).toLocaleString() : '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trip.endTime ? new Date(trip.endTime).toLocaleString() : '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {trip.totalCost != null ? formatCurrency(trip.totalCost, displayCurrency) : '-'}
                        {trip.costBreakdown && (
                          <button
                            className="text-xs text-blue-600 hover:underline ml-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditTripCosts(trip);
                            }}>
                            View / Edit
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-wrap gap-2">
                          <Link to={`/trips/${trip.id}`} className="inline-flex items-center text-blue-600 hover:underline">
                            <Eye className="w-4 h-4 mr-1" /> View
                          </Link>
                          <button className="inline-flex items-center text-indigo-600 hover:underline" onClick={() => handleEditTripCosts(trip)}>
                            <Pencil className="w-4 h-4 mr-1" /> Edit Costs
                          </button>
                          <button className="inline-flex items-center text-red-600 hover:underline" disabled={actionLoading === trip.id + ':delete'} onClick={() => handleDeleteTrip(trip.id)}>
                            <Trash2 className="w-4 h-4 mr-1" /> {actionLoading === trip.id + ':delete' ? 'Deleting...' : 'Delete'}
                          </button>
                          {!trip.shippedStatus && (
                            <button className="inline-flex items-center text-blue-600 hover:underline" disabled={actionLoading === trip.id + ':ship'} onClick={() => handleShipTrip(trip)}>
                              <TruckIcon className="w-4 h-4 mr-1" /> {actionLoading === trip.id + ':ship' ? 'Shipping...' : 'Ship'}
                            </button>
                          )}
                          {!trip.deliveredStatus && (
                            <button className="inline-flex items-center text-green-600 hover:underline" disabled={actionLoading === trip.id + ':deliver'} onClick={() => handleDeliverTrip(trip)}>
                              <PackageCheck className="w-4 h-4 mr-1" /> {actionLoading === trip.id + ':deliver' ? 'Delivering...' : 'Deliver'}
                            </button>
                          )}
                          {trip.status !== 'completed' && (
                            <button className="inline-flex items-center text-emerald-600 hover:underline" disabled={actionLoading === trip.id + ':complete'} onClick={() => handleCompleteTrip(trip)}>
                              <CheckCircle className="w-4 h-4 mr-1" /> {actionLoading === trip.id + ':complete' ? 'Completing...' : 'Complete'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Modals */}
      <Modal isOpen={confirm.open} onClose={() => setConfirm({ open: false })} title="Confirm action">
        <p className="mb-4">Are you sure you want to {confirm.action} this trip?</p>
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 border rounded" onClick={() => setConfirm({ open: false })}>
            Cancel
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={confirmYes}>
            Yes, {confirm.action}
          </button>
        </div>
      </Modal>
      <Modal isOpen={!!editingTrip} onClose={() => setEditingTrip(null)} title={`Edit Trip Costs${editingTrip?.importSource === 'webhook' ? ' (Webhook)' : ''}`} maxWidth="2xl">
        {editingTrip && (
          <>
            <div className="mb-4 text-sm">
              <p>
                <span className="font-medium">Trip:</span> {editingTrip.loadRef}
              </p>
              <p>
                <span className="font-medium">Route:</span> {editingTrip.origin} → {editingTrip.destination}
              </p>
              {editingTrip.externalId && (
                <p>
                  <span className="font-medium">External ID:</span> {editingTrip.externalId}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {['fuel', 'maintenance', 'driver', 'tolls', 'other'].map((k) => (
                <div key={k}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{k} Cost</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">R</span>
                    </div>
                    <input
                      type="number"
                      name={k as keyof CostBreakdown}
                      value={(editForm as any)[k]}
                      onChange={handleEditCostChange}
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              ))}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Cost</label>
                <div className="mt-1 relative rounded-md shadow-sm bg-gray-50">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">R</span>
                  </div>
                  <input type="number" name="cost" value={editForm.cost} readOnly className="bg-gray-50 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md" />
                </div>
                <p className="mt-1 text-xs text-gray-500">Total is calculated automatically</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setEditingTrip(null)} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleSaveCosts} className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700">
                Save Changes
              </button>
            </div>
          </>
        )}
      </Modal>
      <AddTripModal isOpen={showLoadImportModal} onClose={() => setShowLoadImportModal(false)} onSubmit={handleAddTripSubmit} />
    </div>
  );
};
export default ActiveTripsPage;
