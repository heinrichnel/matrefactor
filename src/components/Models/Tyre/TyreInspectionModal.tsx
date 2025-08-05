import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Input } from '../ui/FormElements';
import { CheckCircle, X } from 'lucide-react';

type TyreInspection = {
  fleetNumber: string;
  tyrePosition: string;
  treadDepth: number;
  pressure: number;
  visualCondition: string;
  comments?: string;
  inspectedAt: string;
}

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (inspection: TyreInspection) => void;
  tyrePosition: string;
  fleetNumber: string;
};

const TyreInspectionModal: React.FC<Props> = ({ 
  open, 
  onClose, 
  onSubmit, 
  tyrePosition, 
  fleetNumber 
}) => {
  const [treadDepth, setTreadDepth] = useState('');
  const [pressure, setPressure] = useState('');
  const [visualCondition, setVisualCondition] = useState('');
  const [comments, setComments] = useState('');

  const handleSubmit = () => {
    if (!treadDepth || !pressure || !visualCondition) return alert("All fields are required");

    const inspection: TyreInspection = {
      fleetNumber,
      tyrePosition,
      treadDepth: parseFloat(treadDepth),
      pressure: parseInt(pressure),
      visualCondition,
      comments,
      inspectedAt: new Date().toISOString(),
    };

    onSubmit(inspection);
    onClose();
  };

  return (
    <Modal isOpen={open} onClose={onClose} title={`Inspect Tyre: ${tyrePosition} on ${fleetNumber}`} maxWidth="md">
      <div className="space-y-6">
        <Input
          label="Tread Depth (mm)"
          value={treadDepth}
          onChange={(e) => setTreadDepth(e.target.value)}
          type="number"
          placeholder="e.g. 8.5"
        />
        
        <Input
          label="Pressure (kPa)"
          value={pressure}
          onChange={(e) => setPressure(e.target.value)}
          type="number"
          placeholder="e.g. 850"
        />
        
        <Input
          label="Visual Condition"
          value={visualCondition}
          onChange={(e) => setVisualCondition(e.target.value)}
          placeholder="e.g. Good, Worn, Cracked"
        />
        
        <Input
          label="Comments"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Optional notes"
        />
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose} icon={<X className="w-4 h-4" />}>
            Cancel
          </Button>
          
          <Button onClick={handleSubmit} icon={<CheckCircle className="w-4 h-4" />}>
            Submit Inspection
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TyreInspectionModal;