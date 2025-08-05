import React, { useState, useRef } from 'react';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import { Input, Select, Textarea } from '../../ui/FormElements';
import { Trip } from '../../../types';
import { formatCurrency, formatDate } from '../../../utils/helpers';
import { 
  ArrowRight, 
  Calendar, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  File, 
  FileText, 
  Plus, 
  Upload, 
  X, 
  AlertTriangle 
} from 'lucide-react';
import FileUpload from '../ui/FileUpload';

interface InvoiceSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
  onSubmit: (data: {
    invoiceNumber: string;
    invoiceDate: string;
    invoiceDueDate: string;
    finalTimeline: {
      finalArrivalDateTime?: string;
      finalOffloadDateTime?: string;
      finalDepartureDateTime?: string;
    };
    validationNotes: string;
    proofOfDelivery: FileList | null;
    signedInvoice: FileList | null;
  }) => void;
  isSubmitting?: boolean;
}

const InvoiceSubmissionModal: React.FC<InvoiceSubmissionModalProps> = ({
  isOpen,
  onClose,
  trip,
  onSubmit,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    invoiceDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    finalArrivalDateTime: trip.actualArrivalDateTime || trip.plannedArrivalDateTime || '',
    finalOffloadDateTime: trip.actualOffloadDateTime || trip.plannedOffloadDateTime || '',
    finalDepartureDateTime: trip.actualDepartureDateTime || trip.plannedDepartureDateTime || '',
    validationNotes: ''
  });
  
  const [proofOfDeliveryFiles, setProofOfDeliveryFiles] = useState<FileList | null>(null);
  const [signedInvoiceFiles, setSignedInvoiceFiles] = useState<FileList | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.invoiceNumber.trim()) {
      newErrors.invoiceNumber = 'Invoice number is required';
    }
    
    if (!formData.invoiceDate) {
      newErrors.invoiceDate = 'Invoice date is required';
    }
    
    if (!formData.invoiceDueDate) {
      newErrors.invoiceDueDate = 'Invoice due date is required';
    }
    
    if (new Date(formData.invoiceDueDate) <= new Date(formData.invoiceDate)) {
      newErrors.invoiceDueDate = 'Due date must be after invoice date';
    }
    
    // Validate that we have at least one file for proof of delivery
    if (!proofOfDeliveryFiles || proofOfDeliveryFiles.length === 0) {
      newErrors.proofOfDelivery = 'Proof of delivery document is required';
    }
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (!validateForm()) return;

    setError(null);

    try {
      onSubmit({
        invoiceNumber: formData.invoiceNumber,
        invoiceDate: formData.invoiceDate,
        invoiceDueDate: formData.invoiceDueDate,
        finalTimeline: {
          finalArrivalDateTime: formData.finalArrivalDateTime,
          finalOffloadDateTime: formData.finalOffloadDateTime,
          finalDepartureDateTime: formData.finalDepartureDateTime
        },
        validationNotes: formData.validationNotes,
        proofOfDelivery: proofOfDeliveryFiles,
        signedInvoice: signedInvoiceFiles
      });
    } catch (error: any) {
      console.error('Error submitting invoice:', error);
      setError(error.message || 'Failed to submit invoice. Please try again.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Trip for Invoicing"
      maxWidth="2xl"
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}
      
      <div className="space-y-6">
        {/* Trip Summary */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-medium text-blue-800 mb-3">Trip Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-blue-600 font-medium">Trip Period</p>
                <p className="text-blue-800">{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-blue-600 font-medium">Base Revenue</p>
                <p className="text-blue-800">{formatCurrency(trip.baseRevenue, trip.revenueCurrency)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <File className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-blue-600 font-medium">Fleet & Driver</p>
                <p className="text-blue-800">{trip.fleetNumber} - {trip.driverName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ArrowRight className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-blue-600 font-medium">Client</p>
                <p className="text-blue-800">{trip.clientName} ({trip.clientType})</p>
              </div>
            </div>
            <div className="col-span-2">
              <p className="text-blue-600 font-medium">Route</p>
              <p className="text-blue-800">{trip.route}</p>
            </div>
          </div>
        </div>
        
        {/* Invoice Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Invoice Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Invoice Number *"
              value={formData.invoiceNumber}
              onChange={(e) => handleChange('invoiceNumber', e.target.value)}
              placeholder="e.g., INV-2023-001"
              error={formErrors.invoiceNumber}
              disabled={isSubmitting}
            />
            
            <Input
              label="Invoice Date *"
              type="date"
              value={formData.invoiceDate}
              onChange={(e) => handleChange('invoiceDate', e.target.value)}
              error={formErrors.invoiceDate}
              disabled={isSubmitting}
            />
            
            <Input
              label="Due Date *"
              type="date"
              value={formData.invoiceDueDate}
              onChange={(e) => handleChange('invoiceDueDate', e.target.value)}
              error={formErrors.invoiceDueDate}
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        {/* Trip Timeline */}
        <div className="space-y-4 border-t pt-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">Final Timeline for Invoicing</h3>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <p className="text-sm text-gray-600 mb-4">
              These dates will be used for final invoicing. Adjust if necessary to match the agreed timeline with the client.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Final Arrival Date/Time"
                type="datetime-local"
                value={formData.finalArrivalDateTime?.slice(0, 16) || ''}
                onChange={(e) => handleChange('finalArrivalDateTime', e.target.value)}
                disabled={isSubmitting}
              />
              
              <Input
                label="Final Offload Date/Time"
                type="datetime-local"
                value={formData.finalOffloadDateTime?.slice(0, 16) || ''}
                onChange={(e) => handleChange('finalOffloadDateTime', e.target.value)}
                disabled={isSubmitting}
              />
              
              <Input
                label="Final Departure Date/Time"
                type="datetime-local"
                value={formData.finalDepartureDateTime?.slice(0, 16) || ''}
                onChange={(e) => handleChange('finalDepartureDateTime', e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="mt-3 flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <p className="text-sm text-gray-700 font-medium mb-1">Planned Timeline:</p>
                <div className="text-sm text-gray-600">
                  <p>Planned Arrival: {trip.plannedArrivalDateTime ? new Date(trip.plannedArrivalDateTime).toLocaleString() : 'Not specified'}</p>
                  <p>Planned Offload: {trip.plannedOffloadDateTime ? new Date(trip.plannedOffloadDateTime).toLocaleString() : 'Not specified'}</p>
                  <p>Planned Departure: {trip.plannedDepartureDateTime ? new Date(trip.plannedDepartureDateTime).toLocaleString() : 'Not specified'}</p>
                </div>
              </div>
              
              <div className="flex-1">
                <p className="text-sm text-gray-700 font-medium mb-1">Actual Timeline:</p>
                <div className="text-sm text-gray-600">
                  <p>Actual Arrival: {trip.actualArrivalDateTime ? new Date(trip.actualArrivalDateTime).toLocaleString() : 'Not recorded'}</p>
                  <p>Actual Offload: {trip.actualOffloadDateTime ? new Date(trip.actualOffloadDateTime).toLocaleString() : 'Not recorded'}</p>
                  <p>Actual Departure: {trip.actualDepartureDateTime ? new Date(trip.actualDepartureDateTime).toLocaleString() : 'Not recorded'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Required Documents */}
        <div className="space-y-4 border-t pt-4">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">Required Documents</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <FileUpload
                label="Proof of Delivery (POD) *"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                onFileSelect={setProofOfDeliveryFiles}
                error={formErrors.proofOfDelivery}
                disabled={isSubmitting}
              />
              {proofOfDeliveryFiles && proofOfDeliveryFiles.length > 0 && (
                <div className="mt-2 bg-green-50 border border-green-200 rounded p-2">
                  <p className="text-sm text-green-800 font-medium">Selected {proofOfDeliveryFiles.length} file(s):</p>
                  <ul className="mt-1 text-sm text-green-700 list-inside list-disc">
                    {Array.from(proofOfDeliveryFiles).map((file, i) => (
                      <li key={i}>{file.name} ({(file.size / 1024).toFixed(1)} KB)</li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Upload signed delivery note, gate pass, or other proof of delivery document.
              </p>
            </div>
            
            <div>
              <FileUpload
                label="Signed Invoice (Optional)"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                onFileSelect={setSignedInvoiceFiles}
                disabled={isSubmitting}
              />
              {signedInvoiceFiles && signedInvoiceFiles.length > 0 && (
                <div className="mt-2 bg-green-50 border border-green-200 rounded p-2">
                  <p className="text-sm text-green-800 font-medium">Selected {signedInvoiceFiles.length} file(s):</p>
                  <ul className="mt-1 text-sm text-green-700 list-inside list-disc">
                    {Array.from(signedInvoiceFiles).map((file, i) => (
                      <li key={i}>{file.name} ({(file.size / 1024).toFixed(1)} KB)</li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                If available, upload the signed invoice document or client order confirmation.
              </p>
            </div>
          </div>
        </div>
        
        {/* Validation Notes */}
        <div className="space-y-3 border-t pt-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">Invoice Validation</h3>
          </div>
          
          <Textarea
            label="Validation Notes (Optional)"
            value={formData.validationNotes}
            onChange={(e) => handleChange('validationNotes', e.target.value)}
            placeholder="Add any notes about this invoice submission (e.g., special billing terms, discounts applied, payment instructions)..."
            rows={3}
            disabled={isSubmitting}
          />
          
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> Submitting for invoicing will mark this trip as ready for billing. The invoice data will be available for processing in the Invoice Management section.
            </p>
          </div>
        </div>
        
        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            onClick={onClick}
            icon={<X className="w-4 h-4" />}
            disabled={isSubmitting}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            onClick={onClick}
            icon={<FileText className="w-4 h-4" />}
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit for Invoicing'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default InvoiceSubmissionModal;