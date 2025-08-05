import { addDoc, collection } from "firebase/firestore";
import { PlusCircle, Truck } from "lucide-react";
import React, { useState } from "react";
import TripForm, { TripFormData } from "../components/forms/trips/TripForm";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import { db } from "../firebase/config";

const TripManagementPage: React.FC = () => {
  const [showTripForm, setShowTripForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAddTrip = async (tripData: TripFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Add the trip to Firestore
      await addDoc(collection(db, "trips"), {
        ...tripData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      setSubmitSuccess(true);
      setShowTripForm(false);

      // Reset success message after delay
      setTimeout(() => {
        setSubmitSuccess(null);
      }, 5000);
    } catch (error) {
      console.error("Error adding trip:", error);
      setErrorMessage("Failed to add trip. Please try again.");
      setSubmitSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Truck className="h-6 w-6" /> Trip Management
        </h1>

        <Button
          onClick={() => setShowTripForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-1"
        >
          <PlusCircle size={16} />
          Add New Trip
        </Button>
      </div>

      {/* Success message */}
      {submitSuccess && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
          <div className="flex">
            <div>
              <p className="text-sm text-green-700">Trip was added successfully!</p>
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div>
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Trip form modal */}
      <Modal
        isOpen={showTripForm}
        onClose={() => setShowTripForm(false)}
        title="Add New Trip"
        size="full"
      >
        <TripForm onSubmit={handleAddTrip} onCancel={() => setShowTripForm(false)} isModal={true} />
      </Modal>

      {/* Trip list would go here */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Active Trips</h2>
        {/* Trip list component would go here */}
        <p className="text-gray-500 italic">Trip list component to be implemented</p>
      </div>
    </div>
  );
};

export default TripManagementPage;
