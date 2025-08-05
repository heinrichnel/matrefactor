import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";

/**
 * LoadConfirmation Page Component
 *
 * This page redirects to the CreateLoadConfirmationPage for generating
 * load confirmation documents for both South Africa and Zimbabwe entities.
 */
const LoadConfirmationPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Load Confirmation Generator</h2>
          <p className="text-gray-600">
            Generate load confirmation documents for customers and transporters
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="mb-4">
              Create a new load confirmation document to generate official load confirmation for
              customers and transporters.
            </p>
            <Button onClick={() => navigate("/trips/create-load-confirmation")}>
              Create New Load Confirmation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoadConfirmationPage;
