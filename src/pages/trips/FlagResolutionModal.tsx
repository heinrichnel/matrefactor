import { AlertTriangle, Save, Upload, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Button from '../../components/ui/Button';
import { FileUpload, Input, TextArea } from '../../components/ui/FormElements';
import Modal from '../../components/ui/Modal';
import { Attachment, CostEntry, FlaggedCost } from '../../types';
import { formatCurrency, formatDate } from '../../utils/helpers';

interface FlagResolutionModalProps {
  isOpen: boolean;
  cost: FlaggedCost | null;
  onClose: () => void;
  onResolve: (updatedCost: CostEntry, resolutionComment: string) => void;
}

const FlagResolutionModal: React.FC<FlagResolutionModalProps> = ({
  isOpen,
  cost,
  onClose,
  onResolve
}) => {
  const [formData, setFormData] = useState({
    amount: '',
    notes: '',
    resolutionComment: ''
  });
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (cost) {
      setFormData({
        amount: cost.amount.toString(),
        notes: cost.notes || '',
        resolutionComment: ''
      });
      setSelectedFiles(null);
      setErrors({});
    }
  }, [cost]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || isNaN(Number(formData.amount))) {
      newErrors.amount = 'Amount must be a valid number';
    }
    if (Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    if (!formData.resolutionComment.trim()) {
      newErrors.resolutionComment = 'Resolution comment is required for audit purposes';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResolve = async () => {
    if (!cost || !validateForm()) return;

    try {
      setIsSubmitting(true);

      // Create attachments for any uploaded files
      const newAttachments: Attachment[] = selectedFiles
        ? Array.from(selectedFiles).map((file, index) => ({
            id: `A${Date.now()}-${index}`,
            costEntryId: cost.id,
            filename: file.name,
            fileUrl: URL.createObjectURL(file), // In a real app, upload to storage and get URL
            fileType: file.type,
            fileSize: file.size,
            uploadedAt: new Date().toISOString(),
            fileData: ''
          }))
        : [];

      const updatedCost: CostEntry = {
        ...cost,
        amount: Number(formData.amount),
        notes: formData.notes,
        attachments: [...(cost.attachments || []), ...newAttachments],
        investigationStatus: 'resolved',
        investigationNotes: cost.investigationNotes
          ? `${cost.investigationNotes}\n\nResolution: ${formData.resolutionComment}`
          : `Resolution: ${formData.resolutionComment}`,
        resolvedAt: new Date().toISOString(),
        resolvedBy: 'Current User' // In a real app, use the logged-in user
      };

      onResolve(updatedCost, formData.resolutionComment);
    } catch (error) {
      console.error('Error resolving flag:', error);
      alert(`Error resolving flag: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ amount: '', notes: '', resolutionComment: '' });
    setSelectedFiles(null);
    setErrors({});
    onClose();
  };

  if (!cost) return null;

  const hasAmountChange = Number(formData.amount) !== cost.amount;
  const hasNotesChange = formData.notes !== (cost.notes || '');
  const hasFileUpload = selectedFiles && selectedFiles.length > 0;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Resolve Flagged Cost Entry" maxWidth="lg">
      <div className="space-y-6">
        {/* Flagged Cost Summary */}
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-amber-800">Flagged Cost Entry</h4>
              <p className="text-sm text-amber-700 mt-1">
                This cost entry has been flagged for investigation. Please provide the necessary information to resolve the issue.
              </p>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-amber-800 font-medium">Amount:</span>{' '}
                  {formatCurrency(cost.amount, cost.currency)}
                </div>
                <div>
                  <span className="text-amber-800 font-medium">Category:</span> {cost.category}
                </div>
                <div>
                  <span className="text-amber-800 font-medium">Date:</span> {formatDate(cost.date)}
                </div>
              </div>
              {cost.flagReason && (
                <div className="mt-2">
                  <span className="text-amber-800 font-medium">Flag Reason:</span> {cost.flagReason}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Current Attachments */}
        {cost.attachments && cost.attachments.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Current Attachments</h4>
            <div className="space-y-2">
              {cost.attachments.map(attachment => (
                <div key={attachment.id} className="flex items-center space-x-2 text-sm">
                  <Upload className="w-4 h-4 text-blue-500" />
                  <span className="text-blue-600">{attachment.filename}</span>
                  <span className="text-gray-500">{attachment.fileSize ? Math.round(attachment.fileSize / 1024) : 0} KB</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resolution Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Resolution Actions</h3>

          <div>
            <Input
              label={`Corrected Amount (${cost.currency || 'ZAR'})`}
              type="number"
              step="0.01"
              min="0.01"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              error={errors.amount}
            />
            {hasAmountChange && (
              <p className="text-xs text-blue-600 mt-1">
                Changed from {formatCurrency(cost.amount, cost.currency)}
              </p>
            )}
          </div>

          <div>
            <TextArea
              label="Updated Notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Add or update notes for this cost entry..."
              rows={3}
            />
          </div>

          <div>
            <FileUpload
              label="Upload Missing Documents"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              multiple
              onFileSelect={setSelectedFiles}
            />
            {selectedFiles && selectedFiles.length > 0 && (
              <p className="text-xs text-green-600 mt-1">
                {selectedFiles.length} file(s) selected for upload
              </p>
            )}
          </div>

          <div>
            <TextArea
              label="Resolution Comment (Required) *"
              value={formData.resolutionComment}
              onChange={(e) => handleChange('resolutionComment', e.target.value)}
              placeholder="Explain what was corrected and why..."
              rows={3}
              error={errors.resolutionComment}
            />
          </div>
        </div>

        {/* Resolution Summary */}
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-green-800 mb-2">Resolution Summary</h4>
          <ul className="space-y-1 text-sm text-green-700">
            {hasAmountChange && (
              <li>• Amount corrected from {formatCurrency(cost.amount, cost.currency)} to {formatCurrency(Number(formData.amount), cost.currency)}</li>
            )}
            {hasNotesChange && <li>• Notes updated</li>}
            {hasFileUpload && <li>• {selectedFiles?.length} new document(s) attached</li>}
            <li>• Status will be changed to "Resolved"</li>
          </ul>
        </div>

        {errors.general && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{errors.general}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleClose}
            icon={<X className="w-4 h-4" />}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleResolve}
            icon={<Save className="w-4 h-4" />}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Resolving...' : 'Resolve Flag'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default FlagResolutionModal;
