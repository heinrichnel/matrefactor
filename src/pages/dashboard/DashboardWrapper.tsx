import React from "react";
import { BrowserRouter } from "react-router-dom";
import ConsolidatedDashboard from "./ConsolidatedDashboard";

const DashboardWrapper: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="bg-gray-100 min-h-screen py-8">
        <ConsolidatedDashboard />
      </div>
    </BrowserRouter>
  );
};

export default DashboardWrapper;
