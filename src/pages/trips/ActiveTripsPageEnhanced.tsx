import { saveAs } from 'file-saver';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  CheckCircle, Clock,
  Download,
  Eye, Filter, Globe, MapPin,
  PackageCheck, Pencil, RefreshCw,
  Save,
  Shield,
  Trash2,
  Truck as TruckIcon,
  Upload,
  WifiOff,
  X
} from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

// Mock Firebase Firestore (replace with actual Firebase config and imports)
const db = {}; // Placeholder for Firestore db instance

// Mock currency helper
const formatCurrency = (amount: number, currency: SupportedCurrency) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  });
  return formatter.format(amount);
};

// Mock date/time helpers
const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const formatDateTime = (dateTimeString: string) => {
  if (!dateTimeString) return '-';
  return new Date(dateTimeString).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

// Mock download functions (for PDF/Excel)
const downloadTripPDF = (trip: Trip) => {
  alert(`Downloading PDF for trip: ${trip.loadRef}`);
  // Implement actual PDF generation logic here (e.g., using jspdf)
  const content = `Trip Report for ${trip.loadRef}\n\nClient: ${trip.clientName}\nRoute: ${trip.route}\nRevenue: ${formatCurrency(trip.baseRevenue, trip.revenueCurrency)}`;
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, `trip_${trip.loadRef}.pdf`);
};

const downloadTripExcel = (trip: Trip) => {
  alert(`Downloading Excel for trip: ${trip.loadRef}`);
  // Implement actual Excel generation logic here (e.g., using SheetJS)
  const content = `LoadRef,Client,Route,Revenue\n${trip.loadRef},${trip.clientName},${trip.route},${trip.baseRevenue}`;
  const blob = new Blob([content], { type: 'text/csv' });
  saveAs(blob, `trip_${trip.loadRef}.csv`);
};

// -------------------- Types (Consolidated from all snippets) --------------------

import { Attachment } from '../../types/index';
import { ImportSource, SupportedCurrency, UITrip } from '../../types/trip';

interface CostBreakdown {
  fuel?: number;
  maintenance?: number;
  driver?: number;
  tolls?: number;
  other?: number;
}

interface CostEntry {
  id: string;
  tripId: string;
  category: string;
  subCategory: string;
  amount: number;
  currency: SupportedCurrency;
  referenceNumber?: string;
  notes?: string;
  attachments: Attachment[];
  isFlagged: boolean;
  flagReason?: string;
  isResolved: boolean;
  isSystemGenerated?: boolean;
}

// Using imported Attachment interface from '../../types/index'

interface AdditionalCost {
  id: string;
  tripId: string;
  description: string;
  amount: number;
  currency: SupportedCurrency;
  attachments: Attachment[];
}

interface DelayReason {
  id: string;
  reason: string;
  notes?: string;
  timestamp: string;
}

interface TripEditRecord {
  id: string;
  tripId: string;
  editedBy: string;
  editedAt: string;
  reason: string;
  fieldChanged: string;
  oldValue: string;
  newValue: string;
  changeType: 'update' | 'delete';
}

interface TripDeletionRecord {
  id: string;
  tripId: string;
  deletedBy: string;
  deletedAt: string;
  reason: string;
  tripData: string; // JSON string of the deleted trip
  totalRevenue: number;
  totalCosts: number;
  costEntriesCount: number;
  flaggedItemsCount: number;
}


// Using the Trip type from our types file but extending it here for local use
interface LocalTrip {
  id: string;
  loadRef: string;
  fleetNumber: string;
  driverName: string;
  clientName: string;
  clientType: 'internal' | 'external';
  startDate: string;
  endDate: string;
  route: string;
  description?: string;
  baseRevenue: number;
  revenueCurrency: SupportedCurrency;
  distanceKm?: number;
  costs: CostEntry[]; // All cost entries for the trip
  paymentStatus: 'unpaid' | 'paid' | 'partially_paid';
  additionalCosts: AdditionalCost[];
  delayReasons: DelayReason[];
  followUpHistory: any[]; // Placeholder for follow-up history
  status: 'active' | 'completed' | 'invoiced' | 'scheduled' | 'shipped' | 'delivered'; // Extended status
  completedAt?: string;
  completedBy?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  invoiceDueDate?: string;
  invoiceSubmittedAt?: string;
  invoiceSubmittedBy?: string;
  invoiceValidationNotes?: string;
  finalArrivalDateTime?: string;
  finalOffloadDateTime?: string;
  finalDepartureDateTime?: string;
  plannedArrivalDateTime?: string; // Added this field
  actualArrivalDateTime?: string; // Added this field
  timelineValidated?: boolean;
  timelineValidatedBy?: string;
  timelineValidatedAt?: string;
  proofOfDelivery?: Attachment[];
  signedInvoice?: Attachment[];
  autoCompletedAt?: string;
  autoCompletedReason?: string;
  editHistory?: TripEditRecord[]; // History of edits after completion
  importSource?: ImportSource;
  externalId?: string;
  lastUpdated?: string;
  // Additional properties for UI convenience
  origin?: string;
  destination?: string;
  shippedStatus?: boolean;
  deliveredStatus?: boolean;
  startTime?: string;
  endTime?: string;
  driver?: string;
  vehicle?: string;
  distance?: number;
  totalCost?: number;
  costBreakdown?: CostBreakdown;
}

// Use LocalTrip as our Trip interface for this component
type Trip = LocalTrip;

// Interfaces for Driver Data (from EditDriver.tsx)
interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

interface BankDetails {
  bankName: string;
  accountNumber: string;
  branch: string;
}

interface DriverFormData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  licenseNumber: string;
  licenseExpiry: string;
  licenseClass: string;
  status: 'active' | 'inactive' | 'suspended';
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  nationality: string;
  nationalId: string;
  bankName: string;
  accountNumber: string;
  branch: string;
}

interface LicenseCategory {
  id: string;
  code: string;
  description: string;
}

interface Country {
  code: string;
  name: string;
}

// -------------------- Mock Data / Hooks / Helpers (Consolidated) --------------------

// Mock data generator functions
const generateMockTrips = () => {
  // This will only be used as a fallback if the app context doesn't provide trips
  return [];
};

// Helper for connection status display
const getConnectionStatusInfo = (isOnline: boolean) => {
  return {
    connected: isOnline,
    status: isOnline ? 'connected' : 'disconnected'
  };
};


// Mock useOfflineForm hook
const useOfflineForm = ({ collectionPath, showOfflineWarning, onSuccess }: { collectionPath: string, showOfflineWarning: boolean, onSuccess: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOfflineOperation, setIsOfflineOperation] = useState(false); // Simplified mock

  const submit = async (data: any, id?: string) => {
    setIsSubmitting(true);
    setIsOfflineOperation(false); // Assume online for mock submission
    try {
      console.log(`Submitting to ${collectionPath}:`, data, `ID: ${id || 'new'}`);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      onSuccess();
    } catch (error) {
      console.error('Offline form submission failed:', error);
      setIsOfflineOperation(true); // Simulate going offline on failure
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submit, isSubmitting, isOfflineOperation };
};

// Mock useRealtimeTrips hook (from original ActiveTrips)
// In a real app, this would fetch from Firestore based on filters
const useRealtimeTrips = ({ status, onlyWebBook }: { status?: string; onlyWebBook?: boolean }) => {
  const { trips: allContextTrips } = useAppContext(); // Use trips from AppContext
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filteredTrips = useMemo(() => {
    setLoading(true); // Indicate loading when filters change
    let filtered = allContextTrips;

    if (status) {
      filtered = filtered.filter(trip => trip.status === status);
    }
    if (onlyWebBook) {
      filtered = filtered.filter(trip => trip.importSource === 'web_book');
    }
    setLoading(false); // Done loading
    return filtered;
  }, [allContextTrips, status, onlyWebBook]);

  return { trips: filteredTrips, loading, error };
};

// Mock driver data (from EditDriver.tsx)
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

// Mock useDriverFormData hooks
const useDriverLicenseCategories = () => {
  const categories: LicenseCategory[] = [
    { id: '1', code: 'B', description: 'Light Motor Vehicle' },
    { id: '2', code: 'C1', description: 'Medium Motor Vehicle' },
    { id: '3', code: 'EC', description: 'Heavy Motor Vehicle' },
  ];
  return { categories, loading: false };
};

const useCountries = () => {
  const countries: Country[] = [
    { code: 'ZA', name: 'South Africa' },
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
  ];
  return { countries, loading: false };
};

const useDriverStatusOptions = () => {
  return [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'on_leave', label: 'On Leave' },
    { value: 'terminated', label: 'Terminated' },
  ];
};

const useLicenseStatusOptions = () => {
  return [
    { value: 'valid', label: 'Valid' },
    { value: 'expired', label: 'Expired' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'revoked', label: 'Revoked' },
  ];
};

const useBloodTypes = () => {
  return ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
};

// Mock UI components
interface CardProps { children: React.ReactNode; className?: string; }
const Card: React.FC<CardProps> = ({ children, className = '' }) => <div className={`bg-white shadow rounded-lg ${className}`}>{children}</div>;

interface CardHeaderProps { children: React.ReactNode; title?: string; subtitle?: React.ReactNode; action?: React.ReactNode; }
const CardHeader: React.FC<CardHeaderProps> = ({ children, title, subtitle, action }) => (
  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
    <div>
      {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
      {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      {children}
    </div>
    {action && <div>{action}</div>}
  </div>
);

interface CardContentProps { children: React.ReactNode; className?: string; }
const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => <div className={`p-6 ${className}`}>{children}</div>;

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "outline" | "danger";
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  isLoading?: boolean;
  title?: string;
}
const Button: React.FC<ButtonProps> = ({ children, onClick, type = "button", variant = "primary", disabled = false, className = "", size = 'md', icon, isLoading, title }) => {
  let baseStyle = "inline-flex items-center justify-center font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200";
  let sizeStyle = '';
  let variantStyle = '';

  switch (size) {
    case 'sm': sizeStyle = 'px-3 py-1.5 text-sm'; break;
    case 'lg': sizeStyle = 'px-6 py-3 text-lg'; break;
    default: sizeStyle = 'px-4 py-2 text-base'; // md
  }

  switch (variant) {
    case "outline": variantStyle = "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-indigo-500"; break;
    case "danger": variantStyle = "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"; break;
    default: variantStyle = "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500"; break;
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyle} ${sizeStyle} ${variantStyle} ${className}`}
      title={title}
    >
      {isLoading ? (
        <span className="animate-spin mr-2">⟳</span>
      ) : (
        icon && <span className="mr-2">{icon}</span>
      )}
      {children}
    </button>
  );
};

type MaxWidth = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  maxWidth?: MaxWidth;
  children: React.ReactNode;
}
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, maxWidth = 'lg', children }) => {
  if (!isOpen) return null;

  const maxWidthClass = {
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
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
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { label?: string; error?: string; }
const Input: React.FC<InputProps> = ({ label, error, id, name, ...props }) => (
  <div>
    {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>}
    <input id={id} name={name} {...props} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { label?: string; options: { value: string; label: string }[]; error?: string; }
const Select: React.FC<SelectProps> = ({ label, options, error, id, name, ...props }) => (
  <div>
    {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>}
    <select id={id} name={name} {...props} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
      {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> { label?: string; }
const Checkbox: React.FC<CheckboxProps> = ({ label, id, name, ...props }) => (
  <input id={id} name={name} type="checkbox" {...props} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
);

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { label?: string; error?: string; }
const TextArea: React.FC<TextAreaProps> = ({ label, error, id, name, ...props }) => (
  <div>
    {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>}
    <textarea id={id} name={name} {...props} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> { children: React.ReactNode; }
const Label: React.FC<LabelProps> = ({ children, htmlFor, className = '' }) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 ${className}`}>
    {children}
  </label>
);

// Mock helpers for TripDetails
const calculateKPIs = (trip: Trip) => {
  const totalRevenue = trip.baseRevenue || 0;
  const totalExpenses = trip.costs.reduce((sum, cost) => sum + cost.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
  const costPerKm = trip.distanceKm && trip.distanceKm > 0 ? totalExpenses / trip.distanceKm : 0;

  return {
    totalRevenue,
    totalExpenses,
    netProfit,
    profitMargin,
    costPerKm,
    currency: trip.revenueCurrency,
  };
};

const getFlaggedCostsCount = (costs: CostEntry[]) => costs.filter(c => c.isFlagged).length;
const getUnresolvedFlagsCount = (costs: CostEntry[]) => costs.filter(c => c.isFlagged && !c.isResolved).length;
const canCompleteTrip = (trip: Trip) => getUnresolvedFlagsCount(trip.costs) === 0;
const calculateTotalCosts = (costs: CostEntry[]) => costs.reduce((sum, cost) => sum + cost.amount, 0);


// Mock data for TripForm
const CLIENTS = ['Client A', 'Client B', 'Client C'];
const DRIVERS = ['Driver 1', 'Driver 2', 'Driver 3'];
const FLEET_NUMBERS = ['FL001', 'FL002', 'FL003'];
const CLIENT_TYPES = [
  { label: 'External Client', value: 'external' },
  { label: 'Internal Client', value: 'internal' }
];

// Mock data for CompletedTripEditModal
const TRIP_EDIT_REASONS = [
  'Data Entry Error',
  'Cost Adjustment',
  'Timeline Correction',
  'Client Request',
  'Audit Finding',
  'Other (specify in comments)'
];

// Mock data for TripDeletionModal
const TRIP_DELETION_REASONS = [
  'Duplicate Entry',
  'Incorrectly Created',
  'Test Data',
  'Client Cancellation (Post-Completion)',
  'Other (specify in comments)'
];


// -------------------- Individual Components (Integrated as sub-components) --------------------

// LoadImportModal (from provided snippet)
interface LoadImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoadImportModal: React.FC<LoadImportModalProps> = ({ isOpen, onClose }) => {
  const { addTrip, isOnline: connectionStatus } = useAppContext();
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      setCsvFile(file);

      // Generate preview
      try {
        const text = await file.text();
        const data = parseCSV(text);
        setPreviewData(data.slice(0, 3)); // Show first 3 rows
      } catch (error) {
        console.error('Failed to parse CSV for preview:', error);
      }
    }
  };

  const parseCSV = (text: string) => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',').map(v => v.trim());
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        data.push(row);
      }
    }

    return data;
  };

  const handleImport = async () => {
    if (!csvFile) return;

    setIsProcessing(true);

    try {
      const text = await csvFile.text();
      const data = parseCSV(text);

      const trips = data.map((row: any) => ({
        fleetNumber: row.fleetNumber || row.fleet || '',
        route: row.route || '',
        clientName: row.clientName || row.client || '',
        baseRevenue: parseFloat(row.baseRevenue || row.revenue || '0'),
        revenueCurrency: row.revenueCurrency || row.currency || 'ZAR',
        startDate: row.startDate || '',
        endDate: row.endDate || '',
        driverName: row.driverName || row.driver || '',
        distanceKm: parseFloat(row.distanceKm || row.distance || '0'),
        clientType: row.clientType || 'external',
        description: row.description || '',
        // Add required fields from Trip type
        additionalCosts: [],
        paymentStatus: 'unpaid' as const,
        followUpHistory: []
      }));

      // Add each trip individually using the context
      for (const trip of trips) {
        await addTrip(trip);
      }
      alert(`Successfully imported ${trips.length} trips from CSV file.${!connectionStatus ? '\n\nData will be synced when your connection is restored.' : ''}`);
      onClose();
    } catch (error) {
      console.error('Failed to import CSV:', error);
      alert('Failed to import CSV file. Please check the file format and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setCsvFile(null);
    setIsProcessing(false);
    setPreviewData([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Import Trips from CSV" maxWidth="md">
      <div className="space-y-6">
        {/* Connection Status Warning */}
        {!connectionStatus && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
            <div className="flex items-start space-x-3">
              <WifiOff className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-amber-800">
                  Working Offline
                </h4>
                <p className="text-sm text-amber-700 mt-1">
                  You can still import trips while offline. Your data will be stored locally and synced with the server when your connection is restored.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">CSV Format Requirements</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>Your CSV file should include the following columns:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>fleetNumber</strong> - Fleet identifier (e.g., "6H", "26H")</li>
              <li><strong>driverName</strong> - Driver name</li>
              <li><strong>clientName</strong> - Client/customer name</li>
              <li><strong>route</strong> - Trip route description</li>
              <li><strong>baseRevenue</strong> - Revenue amount (numeric)</li>
              <li><strong>revenueCurrency</strong> - Currency (USD or ZAR)</li>
              <li><strong>startDate</strong> - Start date (YYYY-MM-DD)</li>
              <li><strong>endDate</strong> - End date (YYYY-MM-DD)</li>
              <li><strong>distanceKm</strong> - Distance in kilometers (optional)</li>
              <li><strong>clientType</strong> - "internal" or "external" (optional)</li>
              <li><strong>description</strong> - Optional description</li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select CSV File
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0 file:text-sm file:font-medium
                file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100
                file:cursor-pointer cursor-pointer"
            />
          </div>

          {csvFile && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <div className="flex items-center space-x-2">
                <Upload className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Selected: {csvFile.name}
                </span>
                <span className="text-sm text-green-600">
                  ({(csvFile.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            </div>
          )}

          {/* Data Preview */}
          {previewData.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Data Preview (First 3 rows):</h4>
              <div className="bg-gray-50 p-3 rounded border overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr className="border-b">
                      {Object.keys(previewData[0]).slice(0, 5).map((header) => (
                        <th key={header} className="px-2 py-1 text-left font-medium text-gray-700">
                          {header}
                        </th>
                      ))}
                      {Object.keys(previewData[0]).length > 5 && (
                        <th className="px-2 py-1 text-left font-medium text-gray-700">...</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b">
                        {Object.entries(row).slice(0, 5).map(([key, value], colIndex) => (
                          <td key={`${rowIndex}-${colIndex}`} className="px-2 py-1 text-gray-600">
                            {String(value)}
                          </td>
                        ))}
                        {Object.keys(row).length > 5 && (
                          <td className="px-2 py-1 text-gray-600">...</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isProcessing}
            icon={<X className="w-4 h-4" />}
          >
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!csvFile || isProcessing}
            isLoading={isProcessing}
            icon={<Upload className="w-4 h-4" />}
          >
            {isProcessing ? 'Importing...' : 'Import Trips'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};


// CostForm (mocked as it's an external component)
interface CostFormProps {
  tripId: string;
  cost?: CostEntry;
  onSubmit: (costData: Omit<CostEntry, 'id' | 'attachments'>, files?: FileList) => void;
  onCancel: () => void;
}
const CostForm: React.FC<CostFormProps> = ({ tripId, cost, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    category: cost?.category || '',
    subCategory: cost?.subCategory || '',
    amount: cost?.amount.toString() || '',
    currency: cost?.currency || 'ZAR',
    referenceNumber: cost?.referenceNumber || '',
    notes: cost?.notes || '',
    isFlagged: cost?.isFlagged || false,
    flagReason: cost?.flagReason || '',
  });
  const [files, setFiles] = useState<FileList | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.subCategory) newErrors.subCategory = 'Sub-category is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Valid amount is required';
    if (formData.isFlagged && !formData.flagReason) newErrors.flagReason = 'Flag reason is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      tripId,
      category: formData.category,
      subCategory: formData.subCategory,
      amount: parseFloat(formData.amount),
      currency: formData.currency as SupportedCurrency,
      referenceNumber: formData.referenceNumber || undefined,
      notes: formData.notes || undefined,
      isFlagged: formData.isFlagged,
      flagReason: formData.isFlagged ? formData.flagReason : undefined,
      isResolved: formData.isFlagged ? false : true, // Mark as resolved if not flagged
    }, files || undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Select label="Category *" name="category" value={formData.category} onChange={handleChange} error={errors.category} options={[{ value: '', label: 'Select category' }, { value: 'Fuel', label: 'Fuel' }, { value: 'Maintenance', label: 'Maintenance' }, { value: 'Tolls', label: 'Tolls' }, { value: 'Other', label: 'Other' }]} />
        <Input label="Sub-Category *" name="subCategory" value={formData.subCategory} onChange={handleChange} error={errors.subCategory} />
        <Input label="Amount *" name="amount" type="number" step="0.01" value={formData.amount} onChange={handleChange} error={errors.amount} />
        <Select label="Currency *" name="currency" value={formData.currency} onChange={handleChange} options={[{ value: 'ZAR', label: 'ZAR (R)' }, { value: 'USD', label: 'USD ($)' }]} />
        <Input label="Reference Number" name="referenceNumber" value={formData.referenceNumber} onChange={handleChange} />
      </div>
      <TextArea label="Notes" name="notes" value={formData.notes} onChange={handleChange} rows={3} />
      <div className="flex items-center space-x-2">
        <Checkbox id="isFlagged" name="isFlagged" checked={formData.isFlagged} onChange={handleChange} />
        <label htmlFor="isFlagged" className="text-sm text-gray-700">Flag for Investigation</label>
      </div>
      {formData.isFlagged && (
        <Input label="Flag Reason *" name="flagReason" value={formData.flagReason} onChange={handleChange} error={errors.flagReason} />
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
        <input type="file" multiple onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Cost</Button>
      </div>
    </form>
  );
};

// CostList (mocked as it's an external component)
interface CostListProps {
  costs: CostEntry[];
  onEdit?: (cost: CostEntry) => void;
  onDelete?: (costId: string) => void;
}
const CostList: React.FC<CostListProps> = ({ costs, onEdit, onDelete }) => {
  if (costs.length === 0) {
    return <p className="text-center text-gray-500 py-4">No cost entries yet.</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flags</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {costs.map(cost => (
            <tr key={cost.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cost.category} - {cost.subCategory}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(cost.amount, cost.currency)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cost.referenceNumber || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {cost.isFlagged ? (
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${cost.isResolved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {cost.flagReason} ({cost.isResolved ? 'Resolved' : 'Unresolved'})
                  </span>
                ) : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {onEdit && <button onClick={() => onEdit(cost)} className="text-indigo-600 hover:text-indigo-900 mr-2">Edit</button>}
                {onDelete && <button onClick={() => onDelete(cost.id)} className="text-red-600 hover:text-red-900">Delete</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// TripReport (mocked as it's an external component)
interface TripReportProps { trip: Trip; }
const TripReport: React.FC<TripReportProps> = ({ trip }) => (
  <div className="p-4 bg-gray-50 rounded-md">
    <h3 className="text-lg font-semibold mb-2">Report for {trip.loadRef}</h3>
    <p>Revenue: {formatCurrency(trip.baseRevenue, trip.revenueCurrency)}</p>
    <p>Total Costs: {formatCurrency(calculateTotalCosts(trip.costs), trip.revenueCurrency)}</p>
    {/* More report details */}
  </div>
);

// SystemCostGenerator (mocked as it's an external component)
interface SystemCostGeneratorProps {
  trip: Trip;
  onGenerateSystemCosts: (systemCosts: Omit<CostEntry, 'id' | 'attachments'>[]) => void;
}
const SystemCostGenerator: React.FC<SystemCostGeneratorProps> = ({ trip, onGenerateSystemCosts }) => {
  const [perKmCost, setPerKmCost] = useState(0.5); // Mock cost per km
  const [perDayCost, setPerDayCost] = useState(50); // Mock fixed cost per day

  const handleGenerate = () => {
    const distance = trip.distanceKm || 0;
    const durationDays = (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24);

    const systemCosts: Omit<CostEntry, 'id' | 'attachments'>[] = [];

    if (distance > 0) {
      systemCosts.push({
        tripId: trip.id,
        category: 'Operational',
        subCategory: 'Per-Kilometer Cost',
        amount: distance * perKmCost,
        currency: trip.revenueCurrency,
        isFlagged: false,
        isResolved: true,
        isSystemGenerated: true,
        notes: `Calculated from ${distance} km @ ${perKmCost}/${trip.revenueCurrency}/km`
      });
    }

    if (durationDays > 0) {
      systemCosts.push({
        tripId: trip.id,
        category: 'Operational',
        subCategory: 'Fixed Daily Cost',
        amount: durationDays * perDayCost,
        currency: trip.revenueCurrency,
        isFlagged: false,
        isResolved: true,
        isSystemGenerated: true,
        notes: `Calculated from ${durationDays.toFixed(1)} days @ ${perDayCost}/${trip.revenueCurrency}/day`
      });
    }

    if (systemCosts.length > 0) {
      onGenerateSystemCosts(systemCosts);
    } else {
      alert('No system costs generated. Ensure distance or duration is valid.');
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-700">Generate system-calculated operational costs for this trip based on distance and duration.</p>
      <Input label="Cost per Kilometer" type="number" step="0.01" value={perKmCost} onChange={(e) => setPerKmCost(parseFloat(e.target.value))} />
      <Input label="Fixed Cost per Day" type="number" step="0.01" value={perDayCost} onChange={(e) => setPerDayCost(parseFloat(e.target.value))} />
      <div className="flex justify-end">
        <Button onClick={handleGenerate}>Generate Costs</Button>
      </div>
    </div>
  );
};

// InvoiceSubmissionModal (mocked as it's an external component)
interface InvoiceSubmissionModalProps {
  isOpen: boolean;
  trip: Trip;
  onClose: () => void;
  onSubmit: (invoiceData: {
    invoiceNumber: string;
    invoiceDate: string;
    invoiceDueDate: string;
    finalTimeline: {
      finalArrivalDateTime: string;
      finalOffloadDateTime: string;
      finalDepartureDateTime: string;
    };
    validationNotes: string;
    proofOfDelivery: FileList | null;
    signedInvoice: FileList | null;
  }) => void;
  onAddAdditionalCost: (cost: Omit<AdditionalCost, 'id'>, files?: FileList) => void;
  onRemoveAdditionalCost: (costId: string) => void;
}
const InvoiceSubmissionModal: React.FC<InvoiceSubmissionModalProps> = ({ isOpen, trip, onClose, onSubmit, onAddAdditionalCost, onRemoveAdditionalCost }) => {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [invoiceDueDate, setInvoiceDueDate] = useState('');
  const [finalArrivalDateTime, setFinalArrivalDateTime] = useState(trip.startTime || '');
  const [finalOffloadDateTime, setFinalOffloadDateTime] = useState(trip.endTime || '');
  const [finalDepartureDateTime, setFinalDepartureDateTime] = useState(trip.endTime || '');
  const [validationNotes, setValidationNotes] = useState('');
  const [proofOfDelivery, setProofOfDelivery] = useState<FileList | null>(null);
  const [signedInvoice, setSignedInvoice] = useState<FileList | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      invoiceNumber, invoiceDate, invoiceDueDate, validationNotes, proofOfDelivery, signedInvoice,
      finalTimeline: { finalArrivalDateTime, finalOffloadDateTime, finalDepartureDateTime }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Submit Trip for Invoicing" maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Invoice Details</h3>
        <Input label="Invoice Number *" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} required />
        <Input label="Invoice Date *" type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} required />
        <Input label="Invoice Due Date *" type="date" value={invoiceDueDate} onChange={(e) => setInvoiceDueDate(e.target.value)} required />

        <h3 className="text-lg font-medium text-gray-900 mt-6">Final Timeline Validation</h3>
        <Input label="Final Arrival Date/Time" type="datetime-local" value={finalArrivalDateTime} onChange={(e) => setFinalArrivalDateTime(e.target.value)} />
        <Input label="Final Offload Date/Time" type="datetime-local" value={finalOffloadDateTime} onChange={(e) => setFinalOffloadDateTime(e.target.value)} />
        <Input label="Final Departure Date/Time" type="datetime-local" value={finalDepartureDateTime} onChange={(e) => setFinalDepartureDateTime(e.target.value)} />
        <TextArea label="Validation Notes" value={validationNotes} onChange={(e) => setValidationNotes(e.target.value)} rows={3} />

        <h3 className="text-lg font-medium text-gray-900 mt-6">Attachments</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Proof of Delivery</label>
          <input type="file" multiple onChange={(e) => setProofOfDelivery(e.target.files)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Signed Invoice</label>
          <input type="file" multiple onChange={(e) => setSignedInvoice(e.target.files)} />
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">Submit Invoice</Button>
        </div>
      </form>
    </Modal>
  );
};

// TripPlanningForm (mocked as it's an external component)
interface TripPlanningFormProps {
  trip: Trip;
  onUpdate: (trip: Trip) => void;
  onAddDelay: (delay: Omit<DelayReason, 'id' | 'timestamp'>) => void;
}
const TripPlanningForm: React.FC<TripPlanningFormProps> = ({ trip, onUpdate, onAddDelay }) => {
  const [plannedArrival, setPlannedArrival] = useState(trip.startTime || '');
  const [actualArrival, setActualArrival] = useState(trip.endTime || '');
  const [delayReason, setDelayReason] = useState('');

  const handleSavePlanning = () => {
    onUpdate({
      ...trip,
      plannedArrivalDateTime: plannedArrival,
      actualArrivalDateTime: actualArrival,
    });
    alert('Trip planning updated!');
  };

  const handleAddDelay = () => {
    if (delayReason) {
      onAddDelay({ reason: delayReason });
      setDelayReason('');
      alert('Delay reason added!');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Trip Timeline</h3>
      <Input label="Planned Arrival" type="datetime-local" value={plannedArrival} onChange={(e) => setPlannedArrival(e.target.value)} />
      <Input label="Actual Arrival" type="datetime-local" value={actualArrival} onChange={(e) => setActualArrival(e.target.value)} />
      <Button onClick={handleSavePlanning}>Save Planning</Button>

      <h3 className="text-lg font-medium text-gray-900 mt-6">Delay Reasons</h3>
      <TextArea label="Add Delay Reason" value={delayReason} onChange={(e) => setDelayReason(e.target.value)} rows={2} />
      <Button onClick={handleAddDelay}>Add Delay</Button>
      <ul className="list-disc list-inside">
        {trip.delayReasons.map(delay => (
          <li key={delay.id}>{delay.reason} ({formatDateTime(delay.timestamp)})</li>
        ))}
      </ul>
    </div>
  );
};

// CompletedTripEditModal (from provided snippet)
interface CompletedTripEditModalProps {
  isOpen: boolean;
  trip: Trip;
  onClose: () => void;
  onSave: (updatedTrip: Trip, editRecord: Omit<TripEditRecord, 'id'>) => void;
}

const CompletedTripEditModal: React.FC<CompletedTripEditModalProps> = ({
  isOpen,
  trip,
  onClose,
  onSave
}) => {
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
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!editReason) {
      newErrors.editReason = 'Edit reason is required for completed trips';
    }

    if (editReason === 'Other (specify in comments)' && !customReason.trim()) {
      newErrors.customReason = 'Please specify the reason for editing';
    }

    // Check if any changes were made
    const hasChanges = Object.keys(formData).some(key => {
      const originalValue = (trip as any)[key]?.toString() || ''; // Cast to any to access dynamic key
      const newValue = (formData as any)[key] || ''; // Cast to any
      return originalValue !== newValue;
    });

    if (!hasChanges) {
      newErrors.general = 'No changes detected. Please make changes before saving.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    // Identify changed fields
    const changes: Array<{ field: string, oldValue: string, newValue: string }> = [];

    Object.keys(formData).forEach(key => {
      const originalValue = (trip as any)[key]?.toString() || '';
      const newValue = (formData as any)[key] || '';
      if (originalValue !== newValue) {
        changes.push({
          field: key,
          oldValue: originalValue,
          newValue: newValue
        });
      }
    });

    const finalReason = editReason === 'Other (specify in comments)' ? customReason : editReason;

    // Create edit records for each change
    changes.forEach(change => {
      const editRecord: Omit<TripEditRecord, 'id'> = {
        tripId: trip.id,
        editedBy: 'Current User', // In real app, use actual user
        editedAt: new Date().toISOString(),
        reason: finalReason,
        fieldChanged: change.field,
        oldValue: change.oldValue,
        newValue: change.newValue,
        changeType: 'update'
      };

      // Update trip with new data and edit history
      const updatedTrip: Trip = {
        ...trip,
        ...formData,
        baseRevenue: Number(formData.baseRevenue),
        distanceKm: formData.distanceKm ? Number(formData.distanceKm) : undefined,
        editHistory: [...(trip.editHistory || []), { ...editRecord, id: `edit-${Date.now()}-${Math.random()}` }] // Add unique ID to edit record
      };

      onSave(updatedTrip, editRecord);
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Completed Trip"
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Warning Alert */}
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-amber-800">Editing Completed Trip</h4>
              <p className="text-sm text-amber-700 mt-1">
                This trip has been completed. All changes will be logged with timestamps and reasons for audit purposes.
                The edit history will be included in all future reports and exports.
              </p>
            </div>
          </div>
        </div>

        {/* Edit Reason - Required */}
        <div className="space-y-4 border-t pt-4">
          <h3 className="text-lg font-medium text-gray-900">Edit Justification (Required)</h3>

          <Select
            label="Reason for Edit *"
            value={editReason}
            onChange={(e) => setEditReason(e.target.value)}
            options={[
              { label: 'Select reason for editing...', value: '' },
              ...TRIP_EDIT_REASONS.map(reason => ({ label: reason, value: reason }))
            ]}
            error={errors.editReason}
          />

          {editReason === 'Other (specify in comments)' && (
            <TextArea
              label="Specify Reason *"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Please provide a detailed reason for editing this completed trip..."
              rows={3}
              error={errors.customReason}
            />
          )}
        </div>

        {/* Trip Data Form */}
        <div className="space-y-4 border-t pt-4">
          <h3 className="text-lg font-medium text-gray-900">Trip Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Fleet Number"
              value={formData.fleetNumber}
              onChange={(e) => handleChange('fleetNumber', e.target.value)}
            />

            <Input
              label="Driver Name"
              value={formData.driverName}
              onChange={(e) => handleChange('driverName', e.target.value)}
            />

            <Input
              label="Client Name"
              value={formData.clientName}
              onChange={(e) => handleChange('clientName', e.target.value)}
            />

            <Input
              label="Route"
              value={formData.route}
              onChange={(e) => handleChange('route', e.target.value)}
            />

            <Input
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
            />

            <Input
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
            />

            <Select
              label="Currency"
              value={formData.revenueCurrency}
              onChange={(e) => handleChange('revenueCurrency', e.target.value)}
              options={[
                { label: 'ZAR (R)', value: 'ZAR' },
                { label: 'USD ($)', value: 'USD' }
              ]}
            />

            <Input
              label="Base Revenue"
              type="number"
              step="0.01"
              value={formData.baseRevenue}
              onChange={(e) => handleChange('baseRevenue', e.target.value)}
            />

            <Input
              label="Distance (km)"
              type="number"
              step="0.1"
              value={formData.distanceKm}
              onChange={(e) => handleChange('distanceKm', e.target.value)}
            />
          </div>

          <TextArea
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={3}
          />
        </div>

        {/* Existing Edit History */}
        {trip.editHistory && trip.editHistory.length > 0 && (
          <div className="space-y-4 border-t pt-4">
            <h3 className="text-lg font-medium text-gray-900">Previous Edit History</h3>
            <div className="bg-gray-50 rounded-md p-4 max-h-40 overflow-y-auto">
              {trip.editHistory.map((edit, index) => (
                <div key={index} className="text-sm border-b border-gray-200 pb-2 mb-2 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{edit.fieldChanged}: {edit.oldValue} → {edit.newValue}</p>
                      <p className="text-gray-600">Reason: {edit.reason}</p>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      <p>{edit.editedBy}</p>
                      <p>{formatDateTime(edit.editedAt)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {errors.general && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
            {errors.general}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            icon={<X className="w-4 h-4" />}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            icon={<Save className="w-4 h-4" />}
          >
            Save Changes & Log Edit
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// TripDeletionModal (from provided snippet)
interface TripDeletionModalProps {
  isOpen: boolean;
  trip: Trip;
  onClose: () => void;
  onDelete: (trip: Trip, deletionRecord: Omit<TripDeletionRecord, 'id'>) => void;
  userRole: 'admin' | 'manager' | 'operator';
}

const TripDeletionModal: React.FC<TripDeletionModalProps> = ({
  isOpen,
  trip,
  onClose,
  onDelete,
  userRole
}) => {
  const [deletionReason, setDeletionReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalCosts = calculateTotalCosts(trip.costs);
  const flaggedItems = trip.costs.filter(c => c.isFlagged).length;
  const confirmationText = `DELETE ${trip.fleetNumber}`;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!deletionReason) {
      newErrors.deletionReason = 'Deletion reason is required';
    }

    if (deletionReason === 'Other (specify in comments)' && !customReason.trim()) {
      newErrors.customReason = 'Please specify the reason for deletion';
    }

    if (confirmText !== confirmationText) {
      newErrors.confirmText = `Please type "${confirmationText}" to confirm deletion`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDelete = () => {
    if (!validateForm()) return;

    const finalReason = deletionReason === 'Other (specify in comments)' ? customReason : deletionReason;

    const deletionRecord: Omit<TripDeletionRecord, 'id'> = {
      tripId: trip.id,
      deletedBy: 'Current User', // In real app, use actual user
      deletedAt: new Date().toISOString(),
      reason: finalReason,
      tripData: JSON.stringify(trip),
      totalRevenue: trip.baseRevenue,
      totalCosts: totalCosts,
      costEntriesCount: trip.costs.length,
      flaggedItemsCount: flaggedItems
    };

    onDelete(trip, deletionRecord);
    onClose();
  };

  // Check if user has permission to delete
  if (userRole !== 'admin') {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Access Denied" maxWidth="md">
        <div className="text-center space-y-4">
          <Shield className="w-16 h-16 text-red-500 mx-auto" />
          <h3 className="text-lg font-medium text-gray-900">Insufficient Permissions</h3>
          <p className="text-gray-600">
            Only administrators can delete completed trips. This restriction ensures data integrity and audit compliance.
          </p>
          <Button onClick={onClose}>Close</Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Completed Trip"
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Critical Warning */}
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-red-800">CRITICAL: Permanent Deletion</h4>
              <p className="text-sm text-red-700 mt-1">
                This action will permanently delete the completed trip and all associated data.
                This operation cannot be undone. All deletion details will be logged for governance and audit purposes.
              </p>
            </div>
          </div>
        </div>

        {/* Trip Summary */}
        <div className="bg-gray-50 rounded-md p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Trip to be Deleted</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Fleet:</strong> {trip.fleetNumber}</p>
              <p><strong>Driver:</strong> {trip.driverName}</p>
              <p><strong>Route:</strong> {trip.route}</p>
              <p><strong>Client:</strong> {trip.clientName}</p>
            </div>
            <div>
              <p><strong>Period:</strong> {trip.startDate} to {trip.endDate}</p>
              <p><strong>Revenue:</strong> {formatCurrency(trip.baseRevenue, trip.revenueCurrency)}</p>
              <p><strong>Total Costs:</strong> {formatCurrency(totalCosts, trip.revenueCurrency)}</p>
              <p><strong>Status:</strong> {trip.status.toUpperCase()}</p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span>Cost Entries: <strong>{trip.costs.length}</strong></span>
              <span>Flagged Items: <strong className="text-red-600">{flaggedItems}</strong></span>
              <span>Attachments: <strong>{trip.costs.reduce((sum, cost) => sum + cost.attachments.length, 0)}</strong></span>
            </div>
          </div>
        </div>

        {/* Deletion Reason */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Deletion Justification (Required)</h3>

          <Select
            label="Reason for Deletion *"
            value={deletionReason}
            onChange={(e) => setDeletionReason(e.target.value)}
            options={[
              { label: 'Select reason for deletion...', value: '' },
              ...TRIP_DELETION_REASONS.map(reason => ({ label: reason, value: reason }))
            ]}
            error={errors.deletionReason}
          />

          {deletionReason === 'Other (specify in comments)' && (
            <TextArea
              label="Specify Reason *"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Please provide a detailed reason for deleting this completed trip..."
              rows={3}
              error={errors.customReason}
            />
          )}
        </div>

        {/* Confirmation */}
        <div className="space-y-4 border-t pt-4">
          <h3 className="text-lg font-medium text-gray-900">Confirmation Required</h3>
          <p className="text-sm text-gray-600">
            To confirm deletion, please type <strong>{confirmationText}</strong> in the field below:
          </p>

          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={confirmationText}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
          />
          {errors.confirmText && (
            <p className="text-sm text-red-600">{errors.confirmText}</p>
          )}
        </div>

        {/* Data Retention Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-blue-800">Data Retention & Audit Trail</h4>
          <p className="text-sm text-blue-700 mt-1">
            Upon deletion, the following information will be permanently archived in the deletion log:
          </p>
          <ul className="text-sm text-blue-700 mt-2 list-disc list-inside">
            <li>Complete trip data snapshot</li>
            <li>All cost entries and attachments metadata</li>
            <li>Deletion timestamp and administrator details</li>
            <li>Justification reason and comments</li>
            <li>Financial summary (revenue, costs, profit/loss)</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            icon={<X className="w-4 h-4" />}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={confirmText !== confirmationText}
            icon={<Trash2 className="w-4 h-4" />}
          >
            Permanently Delete Trip
          </Button>
        </div>
      </div>
    </Modal>
  );
};


// -------------------- Main Combined Component --------------------
const ActiveTripsPageEnhanced: React.FC<{ displayCurrency?: SupportedCurrency }> = ({
  displayCurrency = "ZAR",
}) => {
  const navigate = useNavigate();
  const { trips: allContextTrips, updateTrip, deleteTrip } = useAppContext(); // Get trips and update functions from context

  // Filters
  const [filterWebBookOnly, setFilterWebBookOnly] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Real-time trips from Firestore (now using the context data)
  const {
    trips: rtTrips, // These are the filtered trips from context
    loading,
    error,
  } = useRealtimeTrips({
    onlyWebBook: filterWebBookOnly || undefined,
    status: statusFilter || undefined,
  });

  // Webhook + CSV imported (local only)
  const [webhookTrips, setWebhookTrips] = useState<UITrip[]>([]);
  const [csvTrips, setCsvTrips] = useState<UITrip[]>([]);

  // UI state for modals and loading actions
  const [confirm, setConfirm] = useState<{ open: boolean; tripId?: string; action?: string }>({
    open: false,
  });
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Edit costs modal state
  const [editingTrip, setEditingTrip] = useState<UITrip | null>(null);
  const [editForm, setEditForm] = useState<Required<CostBreakdown> & { cost: number }>({
    cost: 0,
    fuel: 0,
    maintenance: 0,
    driver: 0,
    tolls: 0,
    other: 0,
  });

  // Driver Edit Modal State
  const [showDriverEditModal, setShowDriverEditModal] = useState(false);
  const [editingDriverId, setEditingDriverId] = useState<string | null>(null);
  const [driverFormData, setDriverFormData] = useState<DriverFormData>({ // State for driver form
    id: '', name: '', email: '', phone: '', address: '', dateOfBirth: '',
    licenseNumber: '', licenseExpiry: '', licenseClass: '', status: 'active',
    emergencyContactName: '', emergencyContactRelationship: '', emergencyContactPhone: '',
    nationality: '', nationalId: '', bankName: '', accountNumber: '', branch: ''
  });
  const [driverSaving, setDriverSaving] = useState<boolean>(false);
  const [driverLoading, setDriverLoading] = useState<boolean>(true);


  // CSV upload for main dashboard
  const [showLoadImportModal, setShowLoadImportModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null); // Still used for template download

  // -------------------- Helpers --------------------
  const normalizeRtTrip = (trip: any): UITrip => ({
    id: trip.id,
    loadRef: trip.loadRef || `TR-${trip.id.substring(0, 8)}`,
    customer: trip.clientName, // Use clientName from Trip type
    origin: trip.route?.split(' - ')[0] || 'Unknown', // Derive from route
    destination: trip.route?.split(' - ')[1] || 'Unknown', // Derive from route
    status: trip.status,
    shippedStatus: trip.status === 'shipped' || trip.status === 'delivered',
    deliveredStatus: trip.status === 'delivered',
    importSource: (trip.importSource as ImportSource) || "manual",
    startTime: trip.startDate,
    endTime: trip.endDate,
    driver: trip.driverName || "Unassigned",
    vehicle: trip.fleetNumber || "Unassigned",
    distance: trip.distanceKm || 0,
    totalCost: trip.baseRevenue, // Use baseRevenue as totalCost initially
    costBreakdown: trip.costBreakdown || {}, // Assume costBreakdown can come from Trip
    externalId: trip.externalId,
    lastUpdated: trip.lastUpdated,
  });

  const fetchWebhookTrips = async () => {
    // Replace with a real API call
    const mock: UITrip[] = [
      {
        id: "wh-1",
        loadRef: "WH-2023-001",
        customer: "WebhookCustomer1",
        origin: "Miami, FL",
        destination: "Orlando, FL",
        status: "active",
        shippedStatus: false,
        deliveredStatus: false,
        importSource: "webhook",
        startTime: "2025-07-14T10:00:00",
        endTime: "2025-07-15T16:00:00",
        driver: "Alex Thompson",
        vehicle: "Truck WH-123",
        distance: 235,
        totalCost: 0,
        externalId: "ext-12345",
        lastUpdated: new Date().toISOString(),
      },
      {
        id: "wh-2",
        loadRef: "WH-2023-002",
        customer: "WebhookCustomer2",
        origin: "Austin, TX",
        destination: "Houston, TX",
        status: "active",
        shippedStatus: false,
        deliveredStatus: false,
        importSource: "webhook",
        startTime: "2025-07-16T08:30:00",
        endTime: "2025-07-17T12:00:00",
        driver: "Jamie Rodriguez",
        vehicle: "Truck WH-456",
        distance: 162,
        totalCost: 0,
        externalId: "ext-67890",
        lastUpdated: new Date().toISOString(),
      },
    ];
    setWebhookTrips(mock);
  };

  useEffect(() => {
    fetchWebhookTrips();
  }, []);

  // Combine real-time (from context), webhook, and CSV trips
  const allTrips: UITrip[] = useMemo(
    () => [...rtTrips.map(normalizeRtTrip), ...webhookTrips, ...csvTrips],
    [rtTrips, webhookTrips, csvTrips]
  );

  const webBookTrips = allTrips.filter((trip) => trip.importSource === "web_book");
  const manualTrips = allTrips.filter((trip) => trip.importSource !== "web_book");

  // -------------------- Trip Actions --------------------
  const handleEditTripCosts = (trip: UITrip) => {
    setEditingTrip(trip);
    const cb = trip.costBreakdown || {};
    const cost =
      (cb.fuel || 0) +
      (cb.maintenance || 0) +
      (cb.driver || 0) +
      (cb.tolls || 0) +
      (cb.other || 0) ||
      trip.totalCost ||
      0;

    setEditForm({
      cost,
      fuel: cb.fuel || 0,
      maintenance: cb.maintenance || 0,
      driver: cb.driver || 0,
      tolls: cb.tolls || 0,
      other: cb.other || 0,
    });
  };

  const handleEditCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value || "0") || 0;

    setEditForm(prev => {
      const updatedValues = { ...prev, [name]: numValue };
      const totalCost = (updatedValues.fuel || 0) +
                        (updatedValues.maintenance || 0) +
                        (updatedValues.driver || 0) +
                        (updatedValues.tolls || 0) +
                        (updatedValues.other || 0);
      return {
        ...updatedValues,
        cost: totalCost
      };
    });
  };

  const handleSaveCosts = async () => {
    if (!editingTrip) return;

    const updatedTrip: UITrip = {
      ...editingTrip,
      totalCost: editForm.cost,
      costBreakdown: {
        fuel: editForm.fuel,
        maintenance: editForm.maintenance,
        driver: editForm.driver,
        tolls: editForm.tolls,
        other: editForm.other,
      },
      lastUpdated: new Date().toISOString(),
    };

    // If trip came from Firestore (via AppContext), update there. Otherwise, update local.
    const tripInContext = allContextTrips.find(t => t.id === editingTrip.id);
    if (tripInContext && tripInContext.importSource !== "webhook" && tripInContext.importSource !== "csv") {
      try {
        // Mock Firestore update
        // await updateDoc(doc(db, "trips", editingTrip.id), {
        //   totalCost: updatedTrip.totalCost,
        //   costBreakdown: updatedTrip.costBreakdown,
        //   updatedAt: Date.now(),
        // });
        updateTrip({ // Update via AppContext
          ...tripInContext,
          baseRevenue: updatedTrip.totalCost, // Map back to baseRevenue for Trip type
          // costBreakdown is not in the Trip type, so we'll store it as a custom field
          // We'll need to extend the Trip type or use metadata
          updatedAt: new Date().toISOString(), // Use updatedAt instead of lastUpdated
        });
      } catch (err) {
        console.error("Failed to update Firestore trip cost", err);
      }
    } else if (editingTrip.importSource === "webhook") {
      setWebhookTrips((prev) => prev.map((t) => (t.id === editingTrip.id ? updatedTrip : t)));
    } else if (editingTrip.importSource === "csv") {
      setCsvTrips((prev) => prev.map((t) => (t.id === editingTrip.id ? updatedTrip : t)));
    }

    setEditingTrip(null);
  };

  const handleDeleteTrip = (tripId: string) => {
    setConfirm({ open: true, tripId, action: "delete" });
  };

  const handleShipTrip = async (trip: UITrip) => {
    setActionLoading(trip.id + ":ship");
    try {
      const tripInContext = allContextTrips.find(t => t.id === trip.id);
      if (tripInContext && tripInContext.importSource !== "webhook" && tripInContext.importSource !== "csv") {
        updateTrip({ ...tripInContext, status: "active", // using allowed status
                    shippedAt: new Date().toISOString(), // track shipping in allowed properties
                    statusNotes: "Marked as shipped on " + new Date().toLocaleString() });
      }
    } catch (err) {
      console.error("ship error", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeliverTrip = async (trip: UITrip) => {
    setActionLoading(trip.id + ":deliver");
    try {
      const tripInContext = allContextTrips.find(t => t.id === trip.id);
      if (tripInContext && tripInContext.importSource !== "webhook" && tripInContext.importSource !== "csv") {
        updateTrip({ ...tripInContext, status: "completed", // using allowed status
                    deliveredAt: new Date().toISOString(), // track delivery in allowed properties
                    statusNotes: "Marked as delivered on " + new Date().toLocaleString() });
      }
    } catch (err) {
      console.error("deliver error", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCompleteTrip = async (trip: UITrip) => {
    setActionLoading(trip.id + ":complete");
    try {
      const tripInContext = allContextTrips.find(t => t.id === trip.id);
      if (tripInContext && tripInContext.importSource !== "webhook" && tripInContext.importSource !== "csv") {
        // Check flags before completing - using a simplified check since types might differ
        // Using optional chaining to safely access potential properties
        const unresolvedCount = tripInContext.costs.filter(c =>
          c.isFlagged && !(c as any).isResolved
        ).length;

        if (unresolvedCount > 0) {
          alert(`Cannot complete trip: ${unresolvedCount} unresolved flagged items.`);
          return;
        }

        updateTrip({ ...tripInContext, status: "completed", completedAt: new Date().toISOString() });
      }
    } catch (err) {
      console.error("complete error", err);
    } finally {
      setActionLoading(null);
    }
  };

  const confirmYes = async () => {
    if (!confirm.tripId || !confirm.action) return;
    const { tripId, action } = confirm;
    setActionLoading(tripId + ":" + action);

    try {
      if (action === "delete") {
        const tripToDelete = allContextTrips.find((t) => t.id === tripId);
        if (tripToDelete && tripToDelete.importSource !== "webhook" && tripToDelete.importSource !== "csv") {
          deleteTrip(tripId); // Delete via AppContext
        } else {
          setWebhookTrips((prev) => prev.filter((t) => t.id !== tripId));
          setCsvTrips((prev) => prev.filter((t) => t.id !== tripId));
        }
      }
    } catch (err) {
      console.error("confirmYes error", err);
    } finally {
      setActionLoading(null);
      setConfirm({ open: false });
    }
  };

  // -------------------- CSV Import (Main Dashboard Button) --------------------
  // The actual CSV parsing and import logic is now in LoadImportModal
  const handleDownloadTemplate = () => {
    const headers = [
      "Trip Number", "Origin", "Destination", "Start Date", "End Date",
      "Driver", "Vehicle", "Distance", "Cost",
      "Fuel Cost", "Maintenance Cost", "Driver Cost", "Tolls", "Other Costs",
    ];
    const sample =
      "TR-2025-0001,New York NY,Boston MA,2025-07-20,2025-07-22,John Doe,Truck 101,215,1200,600,200,300,75,25";
    const csv = [headers.join(","), sample].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "trips-import-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // -------------------- Driver Edit Logic --------------------

  useEffect(() => {
    if (editingDriverId) {
      setDriverLoading(true);
      setTimeout(() => { // Simulate API call
        const driver = mockDrivers.find(d => d.id === editingDriverId);
        if (driver) {
          setDriverFormData(driver);
        } else {
          console.error(`Driver with ID ${editingDriverId} not found.`);
          setDriverFormData({ // Reset to default if not found
            id: '', name: '', email: '', phone: '', address: '', dateOfBirth: '',
            licenseNumber: '', licenseExpiry: '', licenseClass: '', status: 'active',
            emergencyContactName: '', emergencyContactRelationship: '', emergencyContactPhone: '',
            nationality: '', nationalId: '', bankName: '', accountNumber: '', branch: ''
          });
        }
        setDriverLoading(false);
      }, 300);
    }
  }, [editingDriverId]);

  const handleDriverFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDriverFormData((prev: DriverFormData) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveDriver = (e: React.FormEvent) => {
    e.preventDefault();
    setDriverSaving(true);
    setTimeout(() => {
      console.log('Saving driver data:', driverFormData);
      setDriverSaving(false);
      setShowDriverEditModal(false);
      setEditingDriverId(null);
      alert('Driver data saved!');
    }, 500);
  };

  const handleCancelDriverEdit = () => {
    setShowDriverEditModal(false);
    setEditingDriverId(null);
  };

  const handleDownloadDriverProfile = (driver: DriverFormData) => {
    const content = `
      Driver Profile
      ================
      Personal Information
      --------------------
      Name: ${driver.name}
      Email: ${driver.email || 'Not provided'}
      Phone: ${driver.phone}
      Date of Birth: ${driver.dateOfBirth || 'Not provided'}
      Address: ${driver.address || 'Not provided'}
      Nationality: ${driver.nationality || 'Not provided'}
      National ID: ${driver.nationalId || 'Not provided'}
      Status: ${driver.status}

      License Information
      ------------------
      License Number: ${driver.licenseNumber}
      License Expiry: ${driver.licenseExpiry}
      License Class: ${driver.licenseClass}

      Emergency Contact
      ---------------
      Name: ${driver.emergencyContactName || 'Not provided'}
      Relationship: ${driver.emergencyContactRelationship || 'Not provided'}
      Phone: ${driver.emergencyContactPhone || 'Not provided'}

      Banking Details
      ---------------
      Bank Name: ${driver.bankName || 'Not provided'}
      Account Number: ${driver.accountNumber || 'Not provided'}
      Branch: ${driver.branch || 'Not provided'}
    `;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `driver_profile_${driver.name.replace(/\s/g, '_')}.pdf`);
  };


  // -------------------- Render --------------------
  const StatusBadge: React.FC<{ status?: string; shipped?: boolean; delivered?: boolean }> = ({
    status,
    shipped,
    delivered,
  }) => {
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
        {status || "Pending"}
      </span>
    );
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

  return (
    <div className="p-6 space-y-6 bg-neutral-50 font-sans text-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Active Trips</h1>
          <p className="text-gray-600">
            Real-time trip monitoring, webhook/CSV ingest and cost allocation
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-600">Real-time updates enabled</span>
          </div>
        </div>
      </div>

      {/* Filters & Actions */}
      <Card className="rounded-xl shadow-sm border border-gray-100">
        <CardHeader>
          <div className="flex items-center space-x-2 text-gray-800 font-semibold">
            <Filter className="h-5 w-5" />
            <h3>Filters & Actions</h3>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 items-center">
            <label className="flex items-center text-sm text-gray-700">
              <input
                type="checkbox"
                checked={filterWebBookOnly}
                onChange={(e) => setFilterWebBookOnly(e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2">Web Book Trips Only</span>
            </label>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>

            <Button
              onClick={() => setShowLoadImportModal(true)} // Open LoadImportModal
              className="bg-purple-500 text-white hover:bg-purple-600"
            >
              <Upload className="w-4 h-4 mr-1" />
              Import CSV
            </Button>

            <Button
              onClick={handleDownloadTemplate}
              className="bg-gray-600 text-white hover:bg-gray-700"
            >
              <Download className="w-4 h-4 mr-1" />
              Template
            </Button>

            <Button
              onClick={fetchWebhookTrips}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh Webhook Trips
            </Button>

            <Link
              to="/trips/add"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              + New Trip
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
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
                <dt className="text-sm text-gray-500">Manual/CSV</dt>
                <dd className="text-lg font-medium text-gray-900">{manualTrips.length}</dd>
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
                <dd className="text-lg font-medium text-gray-900">
                  {allTrips.filter((t) => t.deliveredStatus).length}
                </dd>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Trips Table */}
      <Card className="rounded-xl shadow-sm border border-gray-100">
        <CardHeader>
          <h3 className="text-lg font-medium text-gray-900">
            Live Active Trips ({allTrips.length})
          </h3>
          <p className="text-sm text-gray-600">Combined real-time + webhook + CSV</p>
        </CardHeader>
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
                    <tr
                      key={trip.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/trips/${trip.id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        <Link to={`/trips/${trip.id}`} onClick={(e) => e.stopPropagation()}>
                          {trip.loadRef}
                        </Link>
                        {trip.importSource === "webhook" && (
                          <span className="ml-2 px-2 inline-flex text-xs leading-5 font-medium rounded-full bg-blue-100 text-blue-800">
                            Webhook
                          </span>
                        )}
                        {trip.importSource === "csv" && (
                          <span className="ml-2 px-2 inline-flex text-xs leading-5 font-medium rounded-full bg-gray-100 text-gray-800">
                            CSV
                          </span>
                        )}
                        {trip.externalId && (
                          <div className="text-xs text-gray-500 mt-1">
                            Ext ID: {trip.externalId}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {trip.customer || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <span>{trip.origin || "-"}</span>
                          <span>→</span>
                          <span>{trip.destination || "-"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge
                          status={trip.status}
                          shipped={!!trip.shippedStatus}
                          delivered={!!trip.deliveredStatus}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          {trip.importSource === "web_book" ? (
                            <>
                              <Globe className="h-4 w-4 text-green-600" />
                              <span className="text-green-600 font-medium">Web Book</span>
                            </>
                          ) : trip.importSource === "webhook" ? (
                            <>
                              <TruckIcon className="h-4 w-4 text-blue-600" />
                              <span className="text-blue-600 font-medium">Webhook</span>
                            </>
                          ) : trip.importSource === "csv" ? (
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {trip.startTime ? new Date(trip.startTime).toLocaleString() : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {trip.endTime ? new Date(trip.endTime).toLocaleString() : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {trip.totalCost != null
                          ? formatCurrency(trip.totalCost, displayCurrency)
                          : "-"}
                        {trip.costBreakdown && (
                          <button
                            className="text-xs text-blue-600 hover:underline ml-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditTripCosts(trip);
                            }}
                          >
                            View / Edit
                          </button>
                        )}
                      </td>

                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex flex-wrap gap-2">
                          <Link
                            to={`/trips/${trip.id}`}
                            className="inline-flex items-center text-blue-600 hover:underline"
                          >
                            <Eye className="w-4 h-4 mr-1" /> View
                          </Link>

                          <button
                            className="inline-flex items-center text-indigo-600 hover:underline"
                            onClick={() => handleEditTripCosts(trip)}
                          >
                            <Pencil className="w-4 h-4 mr-1" /> Edit Costs
                          </button>

                          {/* NEW: Edit Driver Button */}
                          {trip.driver && ( // Only show if a driver is assigned
                            <button
                              className="inline-flex items-center text-gray-600 hover:underline"
                              onClick={() => {
                                const driver = mockDrivers.find(d => d.name === trip.driver);
                                if (driver) {
                                  setEditingDriverId(driver.id);
                                  setShowDriverEditModal(true);
                                } else {
                                  alert(`Driver '${trip.driver}' not found in mock data for editing.`);
                                }
                              }}
                            >
                              <Pencil className="w-4 h-4 mr-1" /> Edit Driver
                            </button>
                          )}

                          <button
                            className="inline-flex items-center text-red-600 hover:underline"
                            disabled={actionLoading === trip.id + ":delete"}
                            onClick={() => handleDeleteTrip(trip.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            {actionLoading === trip.id + ":delete" ? "Deleting..." : "Delete"}
                          </button>

                          {!trip.shippedStatus && (
                            <button
                              className="inline-flex items-center text-blue-600 hover:underline"
                              disabled={actionLoading === trip.id + ":ship"}
                              onClick={() => handleShipTrip(trip)}
                            >
                              <TruckIcon className="w-4 h-4 mr-1" />
                              {actionLoading === trip.id + ":ship" ? "Shipping..." : "Ship"}
                            </button>
                          )}

                          {!trip.deliveredStatus && (
                            <button
                              className="inline-flex items-center text-green-600 hover:underline"
                              disabled={actionLoading === trip.id + ":deliver"}
                              onClick={() => handleDeliverTrip(trip)}
                            >
                              <PackageCheck className="w-4 h-4 mr-1" />
                              {actionLoading === trip.id + ":deliver" ? "Delivering..." : "Deliver"}
                            </button>
                          )}

                          {trip.status !== "completed" && (
                            <button
                              className="inline-flex items-center text-emerald-600 hover:underline"
                              disabled={actionLoading === trip.id + ":complete"}
                              onClick={() => handleCompleteTrip(trip)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              {actionLoading === trip.id + ":complete"
                                ? "Completing..."
                                : "Complete"}
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

      {/* Confirm modal */}
      <Modal
        isOpen={confirm.open}
        onClose={() => setConfirm({ open: false })}
        title="Confirm action"
      >
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

      {/* Edit costs modal */}
      <Modal
        isOpen={!!editingTrip}
        onClose={() => setEditingTrip(null)}
        title={`Edit Trip Costs${editingTrip?.importSource === "webhook" ? " (Webhook)" : ""}`}
        maxWidth="2xl"
      >
        {editingTrip && (
          <>
            <div className="mb-4 text-sm">
              <p>
                <span className="font-medium">Trip:</span> {editingTrip.loadRef}
              </p>
              <p>
                <span className="font-medium">Route:</span> {editingTrip.origin} →{" "}
                {editingTrip.destination}
              </p>
              {editingTrip.externalId && (
                <p>
                  <span className="font-medium">External ID:</span> {editingTrip.externalId}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {["fuel", "maintenance", "driver", "tolls", "other"].map((k) => (
                <div key={k}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {k} Cost
                  </label>
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
                  <input
                    type="number"
                    name="cost"
                    value={editForm.cost}
                    readOnly
                    className="bg-gray-50 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Total is calculated automatically</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setEditingTrip(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCosts}
                className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </>
        )}
      </Modal>

      {/* Driver Edit Modal (from EditDriver.tsx) */}
      <Modal
        isOpen={showDriverEditModal}
        onClose={handleCancelDriverEdit}
        title={editingDriverId ? "Edit Driver Profile" : "Add New Driver"}
        maxWidth="4xl" // Now correctly typed
      >
        {driverLoading ? (
          <div className="p-6 flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <form onSubmit={handleSaveDriver} className="space-y-6 p-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={driverFormData.name}
                    onChange={handleDriverFormChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={driverFormData.email}
                    onChange={handleDriverFormChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={driverFormData.phone}
                    onChange={handleDriverFormChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={driverFormData.dateOfBirth}
                    onChange={handleDriverFormChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  name="address"
                  value={driverFormData.address}
                  onChange={handleDriverFormChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  rows={3}
                  required
                ></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                  <input
                    type="text"
                    name="nationality"
                    value={driverFormData.nationality}
                    onChange={handleDriverFormChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">National ID</label>
                  <input
                    type="text"
                    name="nationalId"
                    value={driverFormData.nationalId}
                    onChange={handleDriverFormChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={driverFormData.status}
                  onChange={handleDriverFormChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            {/* License & Emergency Contact */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">License & Emergency Contact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={driverFormData.licenseNumber}
                    onChange={handleDriverFormChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">License Class</label>
                  <input
                    type="text"
                    name="licenseClass"
                    value={driverFormData.licenseClass}
                    onChange={handleDriverFormChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">License Expiry Date</label>
                <input
                  type="date"
                  name="licenseExpiry"
                  value={driverFormData.licenseExpiry}
                  onChange={handleDriverFormChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload License Document</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="driver-license-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload a file</span>
                        <input id="driver-license-upload" name="driver-license-upload" type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Emergency Contact</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="emergencyContactName"
                    value={driverFormData.emergencyContactName}
                    onChange={handleDriverFormChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                    <input
                      type="text"
                      name="emergencyContactRelationship"
                      value={driverFormData.emergencyContactRelationship}
                      onChange={handleDriverFormChange}
                      className="w-full border border-gray-300 rounded-md p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="emergencyContactPhone"
                      value={driverFormData.emergencyContactPhone}
                      onChange={handleDriverFormChange}
                      className="w-full border border-gray-300 rounded-md p-2"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Banking Details */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Banking Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                  <input
                    type="text"
                    name="bankName"
                    value={driverFormData.bankName}
                    onChange={handleDriverFormChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={driverFormData.accountNumber}
                    onChange={handleDriverFormChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                  <input
                    type="text"
                    name="branch"
                    value={driverFormData.branch}
                    onChange={handleDriverFormChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDownloadDriverProfile(driverFormData)}
                className="flex items-center gap-2"
                disabled={driverSaving}
              >
                <Download className="w-4 h-4" />
                Download Profile
              </Button>

              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelDriverEdit}
                  disabled={driverSaving}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex items-center gap-2"
                  disabled={driverSaving}
                >
                  <Save className="w-4 h-4" />
                  {driverSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default ActiveTripsPageEnhanced;
