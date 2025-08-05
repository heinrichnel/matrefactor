import { PlusCircle, Truck } from "lucide-react";
import React, { useState } from "react";
import TripForm, { TripFormData } from "../../components/forms/trips/TripForm";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";

const TripManagementPage: React.FC = () => {
  const [showTripForm, setShowTripForm] = useState(false);
  const [tripData, setTripData] = useState<TripFormData[]>([]);

  const handleAddTrip = (data: TripFormData) => {
    // In a real app, this would send data to Firestore
    setTripData((prev) => [...prev, data]);
    setShowTripForm(false);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Truck className="h-6 w-6" /> Trip Management
        </h1>

        <Button onClick={() => setShowTripForm(true)} className="flex items-center gap-1">
          <PlusCircle size={16} />
          Add New Trip
        </Button>
      </div>

      {/* Modal for trip form */}
      <Modal
        isOpen={showTripForm}
        onClose={() => setShowTripForm(false)}
        title="Add New Trip"
        size="full"
      >
        <TripForm onSubmit={handleAddTrip} onCancel={() => setShowTripForm(false)} />
      </Modal>

      {/* Trip list */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Active Trips</h2>

        {tripData.length === 0 ? (
          <p className="text-gray-500">No trips have been created yet.</p>
        ) : (
          <div className="space-y-4">
            {tripData.map((trip, index) => (
              <Card key={index} className="p-4 border border-gray-200 rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{trip.tripName}</h3>
                    <p className="text-sm text-gray-500">
                      {trip.origin} to {trip.destination}
                    </p>
                    <p className="text-sm text-gray-500">
                      {trip.startDate} - {trip.endDate}
                    </p>
                  </div>
                  <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {trip.tripType}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripManagementPage;
