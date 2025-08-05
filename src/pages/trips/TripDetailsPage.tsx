import React, { useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  Calculator,
  Calendar,
  CheckCircle,
  Clock,
  Flag,
  Plus,
  Send,
} from "lucide-react";

import { Trip, CostEntry, AdditionalCost } from "../../types";
import { useAppContext } from "../../context/AppContext";

import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";

import CostForm from "../../components/forms/cost/CostForm";
import TripPlanningForm from "../../components/forms/trips/TripPlanningForm";
import CostList from "../../components/lists/CostList";
import InvoiceSubmissionModal from "../../components/Models/Invoice/InvoiceSubmissionModal";
import TripReport from "../../components/TripManagement/TripReport";
import SystemCostGenerator from "./SystemCostGenerator";

import {
  calculateKPIs,
  canCompleteTrip,
  formatCurrency,
  formatDateTime,
  getFlaggedCostsCount,
  getUnresolvedFlagsCount,
} from "../../utils/helpers";

interface TripDetailsProps {
  trip: Trip;
  onBack: () => void;
}

const TripDetailsPage: React.FC<TripDetailsProps> = ({ trip, onBack }) => {
  const {
    addCostEntry,
    updateCostEntry,
    deleteCostEntry,
    updateTrip,
    addAdditionalCost,
    removeAdditionalCost,
    addDelayReason,
  } = useAppContext();

  const [showCostForm, setShowCostForm] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showSystemCostGenerator, setShowSystemCostGenerator] = useState(false);
  const [showInvoiceSubmission, setShowInvoiceSubmission] = useState(false);
  const [showTripPlanning, setShowTripPlanning] = useState(false);
  const [editingCost, setEditingCost] = useState<CostEntry | undefined>();

  const handleAddCost = (costData: Omit<CostEntry, "id" | "attachments">, files?: FileList) => {
    try {
      addCostEntry(costData, files);
      setShowCostForm(false);
      alert(
        `Cost entry added successfully!\n\nCategory: ${costData.category}\nAmount: ${formatCurrency(
          costData.amount,
          costData.currency
        )}\nReference: ${costData.referenceNumber}`
      );
    } catch (error) {
      console.error("Error adding cost entry:", error);
      alert("Error adding cost entry. Please try again.");
    }
  };

  const handleUpdateCost = (costData: Omit<CostEntry, "id" | "attachments">, files?: FileList) => {
    if (editingCost) {
      try {
        const newAttachments = files
          ? Array.from(files).map((file, index) => ({
              id: `A${Date.now()}-${index}`,
              costEntryId: editingCost.id,
              filename: file.name,
              fileUrl: URL.createObjectURL(file),
              fileType: file.type,
              fileSize: file.size,
              uploadedAt: new Date().toISOString(),
              fileData: "",
            }))
          : [];

        const updatedCost: CostEntry = {
          ...editingCost,
          ...costData,
          attachments: [...editingCost.attachments, ...newAttachments],
        };

        updateCostEntry(updatedCost);
        setEditingCost(undefined);
        setShowCostForm(false);
        alert("Cost entry updated successfully!");
      } catch (error) {
        console.error("Error updating cost entry:", error);
        alert("Error updating cost entry. Please try again.");
      }
    }
  };

  const handleEditCost = (cost: CostEntry) => {
    setEditingCost(cost);
    setShowCostForm(true);
  };

  const handleDeleteCost = (id: string) => {
    if (confirm("Are you sure you want to delete this cost entry? This action cannot be undone.")) {
      try {
        deleteCostEntry(id);
        alert("Cost entry deleted successfully!");
      } catch (error) {
        console.error("Error deleting cost entry:", error);
        alert("Error deleting cost entry. Please try again.");
      }
    }
  };

  const handleGenerateSystemCosts = (systemCosts: Omit<CostEntry, "id" | "attachments">[]) => {
    try {
      for (const costData of systemCosts) {
        addCostEntry(costData);
      }
      setShowSystemCostGenerator(false);
      alert(
        `System costs generated successfully!\n\n${systemCosts.length} cost entries have been added:\n\n${systemCosts
          .map((cost) => `• ${cost.subCategory}: ${formatCurrency(cost.amount, cost.currency)}`)
          .join("\n")}\n\nTotal system costs: ${formatCurrency(
          systemCosts.reduce((sum, cost) => sum + cost.amount, 0),
          trip.revenueCurrency
        )}`
      );
    } catch (error) {
      console.error("Error generating system costs:", error);
      alert("Error generating system costs. Please try again.");
    }
  };

  const handleCompleteTrip = () => {
    const unresolvedFlags = getUnresolvedFlagsCount(trip.costs);
    if (unresolvedFlags > 0) {
      alert(
        `Cannot complete trip: ${unresolvedFlags} unresolved flagged items must be resolved before completing the trip.\n\nPlease go to the Flags & Investigations section to resolve all outstanding issues.`
      );
      return;
    }
    if (
      confirm(
        `Are you sure you want to mark this trip as COMPLETED?\n\nThis will:\n• Lock the trip from further editing\n• Move it to the Completed Trips section\n• Make it available for invoicing\n\nThis action cannot be undone.`
      )
    ) {
      try {
        updateTrip({
          ...trip,
          status: "completed",
          completedAt: new Date().toISOString().split("T")[0],
          completedBy: "Current User",
        });
        alert("Trip has been successfully completed and is now ready for invoicing.");
        onBack();
      } catch (error) {
        console.error("Error completing trip:", error);
        alert("Error completing trip. Please try again.");
      }
    }
  };

  const handleInvoiceSubmission = (invoiceData: {
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
  }) => {
    try {
      const podAttachments = invoiceData.proofOfDelivery
        ? Array.from(invoiceData.proofOfDelivery).map((file, index) => ({
            id: `POD${Date.now()}-${index}`,
            tripId: trip.id,
            filename: file.name,
            fileUrl: URL.createObjectURL(file),
            fileType: file.type,
            fileSize: file.size,
            uploadedAt: new Date().toISOString(),
            fileData: "",
          }))
        : [];

      const invoiceAttachments = invoiceData.signedInvoice
        ? Array.from(invoiceData.signedInvoice).map((file, index) => ({
            id: `INV${Date.now()}-${index}`,
            tripId: trip.id,
            filename: file.name,
            fileUrl: URL.createObjectURL(file),
            fileType: file.type,
            fileSize: file.size,
            uploadedAt: new Date().toISOString(),
            fileData: "",
          }))
        : [];

      const updatedTrip: Trip = {
        ...trip,
        status: "invoiced",
        invoiceNumber: invoiceData.invoiceNumber,
        invoiceDate: invoiceData.invoiceDate,
        invoiceDueDate: invoiceData.invoiceDueDate,
        invoiceSubmittedAt: new Date().toISOString(),
        invoiceSubmittedBy: "Current User",
        invoiceValidationNotes: invoiceData.validationNotes,
        finalArrivalDateTime: invoiceData.finalTimeline.finalArrivalDateTime,
        finalOffloadDateTime: invoiceData.finalTimeline.finalOffloadDateTime,
        finalDepartureDateTime: invoiceData.finalTimeline.finalDepartureDateTime,
        timelineValidated: true,
        timelineValidatedBy: "Current User",
        timelineValidatedAt: new Date().toISOString(),
        proofOfDelivery: podAttachments,
        signedInvoice: invoiceAttachments,
        paymentStatus: "unpaid",
      };

      updateTrip(updatedTrip);
      setShowInvoiceSubmission(false);
      alert(
        `Trip successfully submitted for invoicing!\n\nInvoice Number: ${invoiceData.invoiceNumber}\nDue Date: ${invoiceData.invoiceDueDate}\n\nThe trip is now in the invoicing workflow and payment tracking has begun.`
      );
      onBack();
    } catch (error) {
      console.error("Error submitting invoice:", error);
      alert("Error submitting invoice. Please try again.");
    }
  };

  const handleAddAdditionalCost = (cost: Omit<AdditionalCost, "id">, files?: FileList) => {
    try {
      addAdditionalCost(trip.id, cost, files);
    } catch (error) {
      console.error("Error adding additional cost:", error);
      alert("Error adding additional cost. Please try again.");
    }
  };

  const handleRemoveAdditionalCost = (costId: string) => {
    try {
      removeAdditionalCost(trip.id, costId);
    } catch (error) {
      console.error("Error removing additional cost:", error);
      alert("Error removing additional cost. Please try again.");
    }
  };

  const closeCostForm = () => {
    setShowCostForm(false);
    setEditingCost(undefined);
  };

  const kpis = calculateKPIs(trip);
  const flaggedCount = getFlaggedCostsCount(trip.costs);
  const unresolvedFlags = getUnresolvedFlagsCount(trip.costs);
  const canComplete = canCompleteTrip(trip);

  const hasSystemCosts = trip.costs.some((cost) => cost.isSystemGenerated);
  const systemCosts = trip.costs.filter((cost) => cost.isSystemGenerated);
  const manualCosts = trip.costs.filter((cost) => !cost.isSystemGenerated);

  const hasTimelineDiscrepancies = () => {
    if (!trip.plannedArrivalDateTime || !trip.actualArrivalDateTime) return false;
    const planned = new Date(trip.plannedArrivalDateTime);
    const actual = new Date(trip.actualArrivalDateTime);
    const diffHours = Math.abs(actual.getTime() - planned.getTime()) / (1000 * 60 * 60);
    return diffHours > 1;
  };

  // ... JSX stays exactly the same as in your provided working logic
};

export default TripDetailsPage;
