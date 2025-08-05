import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddNewTyreForm from '../../components/forms/AddNewTyreForm';
import { Card, CardContent, Button } from '../../components/ui';
import { Package, Check } from 'lucide-react';

interface TyreData {
  id?: string;
  tyreNumber: string;
  tyreSize: string;
  type: string;
  pattern: string;
  manufacturer: string;
  year: string;
  cost: number;
  condition: 'New' | 'Used' | 'Retreaded' | 'Scrap';
  status: 'In-Service' | 'In-Stock' | 'Repair' | 'Scrap';
  vehicleAssigned: string;
  axlePosition: string;
  mountStatus: 'Mounted' | 'Not Mounted' | 'Removed';
  kmRun: number;
  kmLimit: number;
  treadDepth: number;
  notes: string;
  datePurchased?: string;
  lastInspection?: string;
}

/**
 * Page for adding new tyres to the inventory
 */
const AddNewTyrePage: React.FC = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  // Sample initial data with some defaults
  const initialData: Partial<TyreData> = {
    tyreNumber: 'TY-' + Math.floor(1000 + Math.random() * 9000),
    condition: 'New',
    status: 'In-Stock',
    mountStatus: 'Not Mounted',
    kmRun: 0,
    kmLimit: 60000,
    treadDepth: 14,
    datePurchased: new Date().toISOString().split('T')[0]
  };

  const handleSubmit = async (data: TyreData) => {
    console.log('Submitting tyre data:', data);
    
    try {
      // Save the data to Firestore
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
      const { db } = await import('../../firebase');
      
      await addDoc(collection(db, 'tyres'), {
        ...data,
        createdAt: serverTimestamp()
      });
      
      // Show success message
      setSubmitted(true);
      
      // And redirect after a delay
      setTimeout(() => {
        navigate('/tyres');
      }, 2000);
      
    } catch (error) {
      console.error('Error saving tyre data:', error);
      alert('Failed to save tyre data. Please try again.');
    }
  };

  const handleCancel = () => {
    // Navigate back to the tyres page
    navigate('/tyres');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {submitted ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="bg-green-100 rounded-full p-3">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">Tyre Added Successfully!</h2>
              <p className="mt-2 text-gray-600">The tyre has been added to your inventory.</p>
              <div className="mt-6 flex space-x-4">
                <Button onClick={() => navigate('/tyres')}>
                  View Tyres Inventory
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSubmitted(false);
                  }}
                >
                  Add Another Tyre
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Add New Tyre</h1>
              <p className="text-gray-600">Register a new tyre to your inventory</p>
            </div>
          </div>
          
          <AddNewTyreForm
            initialData={initialData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
          
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start">
              <Package className="h-6 w-6 text-blue-600 mr-3 mt-0.5" />
              <div>
                <h3 className="text-lg font-medium text-blue-800">Tyre Management Guidelines</h3>
                <ul className="mt-2 space-y-1 text-sm text-blue-700">
                  <li>• All new tyres should be inspected for defects before adding to inventory</li>
                  <li>• Record the exact tyre size, type, and pattern to ensure proper vehicle assignment</li>
                  <li>• Tyre numbers should follow the standard format (TY-XXXX) for consistent tracking</li>
                  <li>• For mounted tyres, always record the vehicle ID and axle position</li>
                  <li>• Maintain accurate tread depth measurements for future wear comparison</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AddNewTyrePage;
