import { AlertTriangle, Edit, FileText, X } from 'lucide-react';
import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { CARReport } from '../../types';
import { formatDate } from '../../utils/helpers';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

interface CARReportDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  report: CARReport;
  onEdit: () => void;
}

const CARReportDetails: React.FC<CARReportDetailsProps> = ({
  isOpen,
  onClose,
  report,
  onEdit,
}) => {
  const { driverBehaviorEvents } = useAppContext();

  // Find linked driver behavior event if it exists
  const linkedEvent = report.referenceEventId
    ? driverBehaviorEvents.find(event => event.id === report.referenceEventId)
    : undefined;

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";

    switch(status) {
      case 'open':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Open</span>;
      case 'inProgress':
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>In Progress</span>;
      case 'completed':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Completed</span>;
      case 'cancelled':
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Cancelled</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="CAR Report Details"
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Header with CAR number and status */}
        <div className="flex justify-between items-center p-4 bg-gray-50 border border-gray-200 rounded-md">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="text-lg font-semibold text-gray-800">
              CAR #{report.carNumber || report.id?.substring(0, 8)}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            {getStatusBadge(report.status)}
          </div>
        </div>

        {/* Basic Information */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white border border-gray-200 rounded-md">
            <div>
              <p className="text-sm text-gray-500">Issued Date</p>
              <p className="text-sm font-medium">{formatDate(report.issueDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Due Date</p>
              <p className="text-sm font-medium">{formatDate(report.dueDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Issued By</p>
              <p className="text-sm font-medium">{report.issuedBy}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Priority</p>
              <div className="mt-1">
                {(() => {
                  switch(report.priority) {
                    case 'high':
                      return <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 text-xs font-medium">High</span>;
                    case 'medium':
                      return <span className="px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 text-xs font-medium">Medium</span>;
                    case 'low':
                      return <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 text-xs font-medium">Low</span>;
                    default:
                      return <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-800 text-xs font-medium">{report.priority}</span>;
                  }
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Incident Details */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Incident Details</h3>
          <div className="p-4 bg-white border border-gray-200 rounded-md space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Type of Incident</p>
              <p className="text-sm font-medium">{report.incidentType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Description</p>
              <p className="text-sm bg-gray-50 p-3 rounded border border-gray-100 whitespace-pre-wrap">{report.description}</p>
            </div>

            {linkedEvent && (
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Linked Driver Behavior Event</p>
                    <p className="text-xs text-blue-700 mt-1">
                      {linkedEvent.eventType} - {linkedEvent.driverName} - {formatDate(linkedEvent.eventDate)} {linkedEvent.eventTime}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Root Cause Analysis */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Root Cause Analysis</h3>
          <div className="p-4 bg-white border border-gray-200 rounded-md space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Root Cause</p>
              <p className="text-sm bg-gray-50 p-3 rounded border border-gray-100 whitespace-pre-wrap">{report.rootCause || 'Not yet determined'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Contributing Factors</p>
                <p className="text-sm bg-gray-50 p-3 rounded border border-gray-100 whitespace-pre-wrap">{report.contributingFactors || 'None specified'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Responsible Person</p>
                <p className="text-sm font-medium">{report.responsiblePerson || 'Not assigned'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Corrective Actions */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Corrective Actions</h3>
          <div className="p-4 bg-white border border-gray-200 rounded-md space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Immediate Actions Taken</p>
              <p className="text-sm bg-gray-50 p-3 rounded border border-gray-100 whitespace-pre-wrap">{report.immediateActions || 'No immediate actions recorded'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Corrective Action Plan</p>
              <p className="text-sm bg-gray-50 p-3 rounded border border-gray-100 whitespace-pre-wrap">{report.correctiveActions || 'No corrective actions planned'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Preventative Measures</p>
              <p className="text-sm bg-gray-50 p-3 rounded border border-gray-100 whitespace-pre-wrap">{report.preventativeMeasures || 'No preventative measures identified'}</p>
            </div>
          </div>
        </div>

        {/* Completion Details */}
        {report.status === 'completed' && (
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Completion Details</h3>
            <div className="p-4 bg-white border border-gray-200 rounded-md space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Resolution Date</p>
                <p className="text-sm font-medium">{report.resolutionDate ? formatDate(report.resolutionDate) : 'Not resolved'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Resolution Comments</p>
                <p className="text-sm bg-gray-50 p-3 rounded border border-gray-100 whitespace-pre-wrap">{report.resolutionComments || 'No resolution comments provided'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Verified By</p>
                <p className="text-sm font-medium">{report.verifiedBy || 'Not verified'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            icon={<X className="w-4 h-4" />}
          >
            Close
          </Button>
          <Button
            onClick={onEdit}
            icon={<Edit className="w-4 h-4" />}
          >
            Edit Report
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CARReportDetails;
