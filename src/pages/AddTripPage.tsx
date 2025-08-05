import { Truck } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TripForm } from "../../forms/trip/TripForm";
import Card, { CardContent, CardHeader } from "../components/ui/Card";

/**
 * @deprecated Use TripManagementPage with modal form instead
 * This standalone page is being phased out in favor of an integrated modal approach
 *
 * Redirect to TripManagementPage after a short delay for better user experience
 */
const AddTripPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to trip management page after a delay
    const redirectTimer = setTimeout(() => {
      navigate("/trips");
    }, 5000);

    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  const handleSubmit = (data: any) => {
    console.log("Trip data:", data);
    navigate("/trips");
  };

  const handleCancel = () => {
    navigate("/trips");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div>
            <p className="text-sm text-yellow-700">
              This page is deprecated. Please use the Add Trip button on the Trip Management page
              instead. You will be redirected in 5 seconds...
            </p>
          </div>
        </div>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Truck size={20} className="text-blue-500" />
            <h2 className="text-xl font-semibold">Add New Trip</h2>
          </div>
        </CardHeader>
        <CardContent>
          <TripForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTripPage;
