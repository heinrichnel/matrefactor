import { Button } from "@/components/ui/Button";
import { FileText, Save, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../context/AppContext";
import { CARReport, DriverBehaviorEvent, RESPONSIBLE_PERSONS } from "../../../types";
import { formatDate } from "../../../utils/helpers";
import { Input, Select, TextArea } from "../../ui/FormElements";
import Modal from "../../ui/Modal";

interface CARReportFormProps {
  isOpen: boolean;
  onClose: () => void;
  linkedEvent?: DriverBehaviorEvent;
  existingReport?: CARReport;
}

const CARReportForm: React.FC<CARReportFormProps> = ({
  isOpen,
  onClose,
  linkedEvent,
  existingReport,
}) => {
  const { addCARReport, updateCARReport } = useAppContext();

  const [formData, setFormData] = useState({
    responsibleReporter: "",
    responsiblePerson: "",
    dateOfIncident: new Date().toISOString().split("T")[0],
    dateDue: "",
    clientReport: "",
    severity: "medium" as "high" | "medium" | "low",

    // New fields based on CARReport type
    incidentType: "",
    description: "",
    dueDate: new Date().toISOString().split("T")[0],
    issueDate: new Date().toISOString().split("T")[0],
    issuedBy: "Current User", // In a real app, use the logged-in user
    priority: "medium" as "high" | "medium" | "low",
    rootCause: "",
    contributingFactors: "",
    immediateActions: "",
    preventativeMeasures: "",

    // Problem identification
    problemIdentification: "",

    // Root cause analysis (fishbone)
    causeAnalysisPeople: "",
    causeAnalysisMaterials: "",
    causeAnalysisEquipment: "",
    causeAnalysisMethods: "",
    causeAnalysisMetrics: "",
    causeAnalysisEnvironment: "",

    // Root cause summary
    rootCauseAnalysis: "",

    // Actions
    correctiveActions: "",
    preventativeActionsImmediate: "",
    preventativeActionsLongTerm: "",

    // Impact and comments
    financialImpact: "",
    generalComments: "",

    // Status
    status: "draft" as "draft" | "submitted" | "in_progress" | "completed",
  });

  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Generate a unique CAR report number
  const [reportNumber, setReportNumber] = useState("");

  // Initialize form with data if editing or linked to an event
  useEffect(() => {
    // Generate a unique report number if new report
    if (!existingReport) {
      const timestamp = new Date().getTime().toString().slice(-6);
      const randomChars = Math.random().toString(36).substring(2, 5).toUpperCase();
      setReportNumber(`CAR-${timestamp}-${randomChars}`);
    }

    if (existingReport) {
      // Edit mode - populate form with existing report data
      setFormData({
        responsibleReporter: existingReport.responsibleReporter,
        responsiblePerson: existingReport.responsiblePerson,
        dateOfIncident: existingReport.dateOfIncident,
        dateDue: existingReport.dateDue,
        clientReport: existingReport.clientReport,
        severity: existingReport.severity,

        // New fields
        incidentType: existingReport.incidentType || "general",
        description: existingReport.description || existingReport.problemIdentification,
        dueDate: existingReport.dueDate || existingReport.dateDue,
        issueDate: existingReport.issueDate || new Date().toISOString().split("T")[0],
        issuedBy: existingReport.issuedBy || "Current User",
        priority: existingReport.priority || existingReport.severity,
        rootCause: existingReport.rootCause || existingReport.rootCauseAnalysis,
        contributingFactors: existingReport.contributingFactors || "",
        immediateActions:
          existingReport.immediateActions || existingReport.preventativeActionsImmediate,
        preventativeMeasures:
          existingReport.preventativeMeasures || existingReport.preventativeActionsLongTerm,

        // Legacy fields
        problemIdentification: existingReport.problemIdentification,
        causeAnalysisPeople: existingReport.causeAnalysisPeople,
        causeAnalysisMaterials: existingReport.causeAnalysisMaterials,
        causeAnalysisEquipment: existingReport.causeAnalysisEquipment,
        causeAnalysisMethods: existingReport.causeAnalysisMethods,
        causeAnalysisMetrics: existingReport.causeAnalysisMetrics,
        causeAnalysisEnvironment: existingReport.causeAnalysisEnvironment,
        rootCauseAnalysis: existingReport.rootCauseAnalysis,
        correctiveActions: existingReport.correctiveActions || "", // Handle possible undefined
        preventativeActionsImmediate: existingReport.preventativeActionsImmediate,
        preventativeActionsLongTerm: existingReport.preventativeActionsLongTerm,
        financialImpact: existingReport.financialImpact,
        generalComments: existingReport.generalComments,

        // Status - handle status conversion
        status:
          existingReport.status === "open" ||
          existingReport.status === "inProgress" ||
          existingReport.status === "cancelled"
            ? "in_progress"
            : existingReport.status,
      });
      setReportNumber(existingReport.reportNumber);
    } else if (linkedEvent) {
      // Populate form with linked event data
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14); // Due in 14 days

      setFormData((prev) => ({
        ...prev,
        responsiblePerson: linkedEvent.driverName,
        dateOfIncident: linkedEvent.eventDate,
        dateDue: dueDate.toISOString().split("T")[0],
        severity:
          linkedEvent.severity === "critical"
            ? "high"
            : linkedEvent.severity === "high"
              ? "medium"
              : "low",
        problemIdentification: linkedEvent.description,
      }));
    }
  }, [existingReport, linkedEvent, isOpen]);

  // Handle form changes
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.responsibleReporter)
      newErrors.responsibleReporter = "Responsible reporter is required";
    if (!formData.responsiblePerson) newErrors.responsiblePerson = "Responsible person is required";
    if (!formData.dateOfIncident) newErrors.dateOfIncident = "Date of incident is required";
    if (!formData.dateDue) newErrors.dateDue = "Due date is required";
    if (!formData.clientReport) newErrors.clientReport = "Client report is required";
    if (!formData.problemIdentification)
      newErrors.problemIdentification = "Problem identification is required";

    // Validate due date is after incident date
    if (formData.dateOfIncident && formData.dateDue) {
      const incidentDate = new Date(formData.dateOfIncident);
      const dueDate = new Date(formData.dateDue);

      if (dueDate <= incidentDate) {
        newErrors.dateDue = "Due date must be after the incident date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) return;

    const reportData: Omit<CARReport, "id"> = {
      // Core fields
      reportNumber,
      responsibleReporter: formData.responsibleReporter,
      responsiblePerson: formData.responsiblePerson,
      referenceEventId: linkedEvent?.id,

      // New fields
      description: formData.description || formData.problemIdentification, // Use problem identification if description not provided
      incidentType: formData.incidentType || "general",
      issuedBy: formData.issuedBy,
      issueDate: formData.issueDate,
      dueDate: formData.dueDate || formData.dateDue,
      priority: formData.priority,

      // Root cause and actions
      rootCause: formData.rootCause || formData.rootCauseAnalysis,
      contributingFactors: formData.contributingFactors || "",
      immediateActions: formData.immediateActions || formData.preventativeActionsImmediate,
      correctiveActions: formData.correctiveActions || "",
      preventativeMeasures: formData.preventativeMeasures || formData.preventativeActionsLongTerm,

      // Legacy fields
      dateOfIncident: formData.dateOfIncident,
      dateDue: formData.dateDue,
      clientReport: formData.clientReport,
      severity: formData.severity,
      problemIdentification: formData.problemIdentification,
      causeAnalysisPeople: formData.causeAnalysisPeople,
      causeAnalysisMaterials: formData.causeAnalysisMaterials,
      causeAnalysisEquipment: formData.causeAnalysisEquipment,
      causeAnalysisMethods: formData.causeAnalysisMethods,
      causeAnalysisMetrics: formData.causeAnalysisMetrics,
      causeAnalysisEnvironment: formData.causeAnalysisEnvironment,
      rootCauseAnalysis: formData.rootCauseAnalysis,
      preventativeActionsImmediate: formData.preventativeActionsImmediate,
      preventativeActionsLongTerm: formData.preventativeActionsLongTerm,
      financialImpact: formData.financialImpact,
      generalComments: formData.generalComments,

      // Status - convert legacy status to new format if needed
      status: formData.status === "in_progress" ? "inProgress" : formData.status,
    };

    if (existingReport) {
      // Update existing report
      updateCARReport(
        {
          ...existingReport,
          ...reportData,
        },
        selectedFiles || undefined
      );
      alert("CAR report updated successfully");
    } else {
      // Add new report
      addCARReport(reportData, selectedFiles || undefined);
      alert("CAR report created successfully");
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={existingReport ? "Edit CAR Report" : "Create CAR Report"}
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-start space-x-3">
            <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Corrective Action Report (CAR)</h4>
              <p className="text-sm text-blue-700 mt-1">
                Complete this form to document non-conformances, analyze root causes, and implement
                corrective actions.
              </p>
              {linkedEvent && (
                <p className="text-sm text-blue-700 mt-1">
                  This CAR is linked to a {linkedEvent.severity} severity driver behavior event.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Report Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 p-3 bg-gray-50 rounded-md">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">CAR REPORT</h3>
              <div className="text-sm font-medium text-gray-700">
                Report Number: <span className="text-blue-600">{reportNumber}</span>
              </div>
            </div>
          </div>

          <Select
            label="Responsible Reporter *"
            value={formData.responsibleReporter}
            onChange={(e) => handleChange("responsibleReporter", e.target.value)}
            options={[
              { label: "Select reporter...", value: "" },
              ...RESPONSIBLE_PERSONS.map((person) => ({ label: person, value: person })),
            ]}
            error={errors.responsibleReporter}
          />

          <Select
            label="Responsible Person *"
            value={formData.responsiblePerson}
            onChange={(e) => handleChange("responsiblePerson", e.target.value)}
            options={[
              { label: "Select responsible person...", value: "" },
              ...RESPONSIBLE_PERSONS.map((person) => ({ label: person, value: person })),
            ]}
            error={errors.responsiblePerson}
          />

          {linkedEvent && (
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-md">
              <p className="text-sm font-medium text-purple-800">Reference:</p>
              <p className="text-sm text-purple-700">
                Driver Event: {linkedEvent.eventType} - {formatDate(linkedEvent.eventDate)}
              </p>
            </div>
          )}

          <Input
            label="Date of Incident *"
            type="date"
            value={formData.dateOfIncident}
            onChange={(e) => handleChange("dateOfIncident", e.target.value)}
            error={errors.dateOfIncident}
          />

          <Input
            label="Date Due *"
            type="date"
            value={formData.dateDue}
            onChange={(e) => handleChange("dateDue", e.target.value)}
            error={errors.dateDue}
          />

          <Select
            label="Severity *"
            value={formData.severity}
            onChange={(e) => handleChange("severity", e.target.value)}
            options={[
              { label: "High", value: "high" },
              { label: "Medium", value: "medium" },
              { label: "Low", value: "low" },
            ]}
          />
        </div>

        {/* Client Report */}
        <div>
          <TextArea
            label="CLIENT'S REPORT OF NON-CONFORMANCE *"
            value={formData.clientReport}
            onChange={(e) => handleChange("clientReport", e.target.value)}
            placeholder="Describe the non-conformance from the client's perspective..."
            rows={4}
            error={errors.clientReport}
          />
        </div>

        {/* Problem Identification */}
        <div>
          <TextArea
            label="PROBLEM IDENTIFICATION *"
            value={formData.problemIdentification}
            onChange={(e) => handleChange("problemIdentification", e.target.value)}
            placeholder="Describe the problem in detail..."
            rows={4}
            error={errors.problemIdentification}
          />
        </div>

        {/* Primary Cause Analysis */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            PRIMARY CAUSE ANALYSIS OF NON-CONFORMANCE (FISHBONE FRAMEWORK)
          </h3>

          <div className="space-y-4">
            <TextArea
              label="1. People (Manpower)"
              value={formData.causeAnalysisPeople}
              onChange={(e) => handleChange("causeAnalysisPeople", e.target.value)}
              placeholder="Analyze people-related causes..."
              rows={2}
            />

            <TextArea
              label="2. Materials"
              value={formData.causeAnalysisMaterials}
              onChange={(e) => handleChange("causeAnalysisMaterials", e.target.value)}
              placeholder="Analyze material-related causes..."
              rows={2}
            />

            <TextArea
              label="3. Equipment"
              value={formData.causeAnalysisEquipment}
              onChange={(e) => handleChange("causeAnalysisEquipment", e.target.value)}
              placeholder="Analyze equipment-related causes..."
              rows={2}
            />

            <TextArea
              label="4. Methods / Systems / Processes / Procedures"
              value={formData.causeAnalysisMethods}
              onChange={(e) => handleChange("causeAnalysisMethods", e.target.value)}
              placeholder="Analyze method-related causes..."
              rows={2}
            />

            <TextArea
              label="5. Metrics / Measurement (KPIs)"
              value={formData.causeAnalysisMetrics}
              onChange={(e) => handleChange("causeAnalysisMetrics", e.target.value)}
              placeholder="Analyze measurement-related causes..."
              rows={2}
            />

            <TextArea
              label="6. Operating Environment"
              value={formData.causeAnalysisEnvironment}
              onChange={(e) => handleChange("causeAnalysisEnvironment", e.target.value)}
              placeholder="Analyze environment-related causes..."
              rows={2}
            />
          </div>
        </div>

        {/* Root Cause Analysis */}
        <div>
          <TextArea
            label="ROOT CAUSE ANALYSIS OF NON-CONFORMANCE (5 WHY'S)"
            value={formData.rootCauseAnalysis}
            onChange={(e) => handleChange("rootCauseAnalysis", e.target.value)}
            placeholder="Apply the 5 Why's technique to identify the root cause..."
            rows={4}
          />
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <TextArea
            label="CORRECTIVE ACTIONS"
            value={formData.correctiveActions}
            onChange={(e) => handleChange("correctiveActions", e.target.value)}
            placeholder="List corrective actions to address the immediate issue..."
            rows={3}
          />

          <TextArea
            label="PREVENTATIVE ACTIONS (Immediate Actions)"
            value={formData.preventativeActionsImmediate}
            onChange={(e) => handleChange("preventativeActionsImmediate", e.target.value)}
            placeholder="List immediate preventative actions..."
            rows={3}
          />

          <TextArea
            label="PREVENTATIVE ACTIONS (Medium / Long Term)"
            value={formData.preventativeActionsLongTerm}
            onChange={(e) => handleChange("preventativeActionsLongTerm", e.target.value)}
            placeholder="List medium and long-term preventative actions..."
            rows={3}
          />
        </div>

        {/* Financial Impact and Comments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextArea
            label="FINANCIAL IMPACT"
            value={formData.financialImpact}
            onChange={(e) => handleChange("financialImpact", e.target.value)}
            placeholder="Describe the financial impact of the non-conformance..."
            rows={3}
          />

          <TextArea
            label="GENERAL COMMENTS"
            value={formData.generalComments}
            onChange={(e) => handleChange("generalComments", e.target.value)}
            placeholder="Add any additional comments or notes..."
            rows={3}
          />
        </div>

        {/* Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Report Status"
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
            options={[
              { label: "Draft", value: "draft" },
              { label: "Submitted", value: "submitted" },
              { label: "In Progress", value: "in_progress" },
              { label: "Completed", value: "completed" },
            ]}
          />

          {/* Supporting Documents */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supporting Documents (Optional)
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => setSelectedFiles(e.target.files)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0 file:text-sm file:font-medium
                file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100
                file:cursor-pointer cursor-pointer"
            />
            {selectedFiles && selectedFiles.length > 0 && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                <p className="font-medium text-blue-800">Selected {selectedFiles.length} file(s)</p>
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} icon={<X className="w-4 h-4" />}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} icon={<Save className="w-4 h-4" />}>
            {formData.status === "draft" ? "Save Draft" : "Submit Report"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CARReportForm;
