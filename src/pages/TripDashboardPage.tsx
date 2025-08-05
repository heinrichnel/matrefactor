import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TripDashboard from "../components/TripManagement/TripDashboard";

/**
 * @deprecated Use the new /trips route instead
 * This page is being redirected to the updated trip management section
 */
const TripDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Show the old dashboard for a moment then redirect to new page
    const redirectTimer = setTimeout(() => {
      navigate("/trips");
    }, 3000);

    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  return (
    <div>
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 mx-6 mt-6">
        <div className="flex">
          <div>
            <p className="text-sm text-yellow-700">
              This page has moved to the new trip management section. You will be redirected in 3
              seconds...
            </p>
          </div>
        </div>
      </div>
      <TripDashboard />
    </div>
  );
};

export default TripDashboardPage;
