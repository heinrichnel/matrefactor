import React from "react";
import { Button, Card, CardContent, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { FileWarning, CheckCircle, AlertTriangle, XCircle, FileText, ArrowRight, Wrench } from "lucide-react";

interface InspectionDetailsModalProps {
  inspection: {
    report: string;
    date: string;
    vehicle: string;
    vehicleName?: string;
    vin?: string;
    meterReading?: string;
    location: string;
    inspector: string;
    form: string;
    notes: string;
    faultCount: number;
    correctiveAction: string;
    workOrder: string;
    defects?: {
      repair: string[];
      replace: string[];
    };
    status?: {
      inspection: string;
      workOrder: string | null;
      completion: string | null;
    };
  };
  onClose: () => void;
}

export default function InspectionDetailsModal({ inspection, onClose }: InspectionDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="border-b p-4 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold">Inspection Details: {inspection.report}</h2>
          <Button variant="outline" onClick={onClick}>Close</Button>
        </div>
        
        <div className="p-6">
          {/* Inspection Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <FileText className="mr-2 h-5 w-5" /> Basic Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-3 gap-1">
                    <span className="font-medium">Inspection Date:</span>
                    <span className="col-span-2">{inspection.date}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <span className="font-medium">Vehicle:</span>
                    <span className="col-span-2">{inspection.vehicle}</span>
                  </div>
                  {inspection.vehicleName && (
                    <div className="grid grid-cols-3 gap-1">
                      <span className="font-medium">Vehicle Name:</span>
                      <span className="col-span-2">{inspection.vehicleName}</span>
                    </div>
                  )}
                  {inspection.vin && (
                    <div className="grid grid-cols-3 gap-1">
                      <span className="font-medium">VIN:</span>
                      <span className="col-span-2">{inspection.vin}</span>
                    </div>
                  )}
                  {inspection.meterReading && (
                    <div className="grid grid-cols-3 gap-1">
                      <span className="font-medium">Meter Reading:</span>
                      <span className="col-span-2">{inspection.meterReading}</span>
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-1">
                    <span className="font-medium">Location:</span>
                    <span className="col-span-2">{inspection.location}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <span className="font-medium">Inspector:</span>
                    <span className="col-span-2">{inspection.inspector}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" /> Status Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-3 gap-1">
                    <span className="font-medium">Form Type:</span>
                    <span className="col-span-2">{inspection.form}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <span className="font-medium">Fault Count:</span>
                    <span className="col-span-2 font-semibold text-red-600">{inspection.faultCount}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <span className="font-medium">Work Order:</span>
                    <span className="col-span-2 text-blue-600 font-semibold">{inspection.workOrder}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <span className="font-medium">Corrective Action:</span>
                    <span className={`col-span-2 font-semibold ${
                      inspection.correctiveAction === "TAKEN" 
                        ? "text-green-600" 
                        : "text-amber-600"
                    }`}>
                      {inspection.correctiveAction}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Workflow Status */}
          {inspection.status && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-3">Workflow Status</h3>
                <div className="flex items-center justify-between px-2 py-4 overflow-x-auto">
                  <div className="flex flex-col items-center">
                    <div className={`rounded-full p-2 ${inspection.status.inspection === "COMPLETED" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                      <FileWarning className="h-6 w-6" />
                    </div>
                    <span className="text-sm mt-1">Inspection</span>
                    <span className="text-xs text-gray-500">COMPLETED</span>
                  </div>
                  
                  <ArrowRight className="h-4 w-4 text-gray-400 mx-2" />
                  
                  <div className="flex flex-col items-center">
                    <div className={`rounded-full p-2 ${inspection.status.workOrder ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}`}>
                      <FileText className="h-6 w-6" />
                    </div>
                    <span className="text-sm mt-1">Work Order</span>
                    <span className="text-xs text-gray-500">{inspection.status.workOrder || "PENDING"}</span>
                  </div>
                  
                  <ArrowRight className="h-4 w-4 text-gray-400 mx-2" />
                  
                  <div className="flex flex-col items-center">
                    <div className={`rounded-full p-2 ${inspection.correctiveAction === "TAKEN" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                      <Wrench className="h-6 w-6" />
                    </div>
                    <span className="text-sm mt-1">Repair</span>
                    <span className="text-xs text-gray-500">{inspection.correctiveAction === "TAKEN" ? "COMPLETED" : "PENDING"}</span>
                  </div>
                  
                  <ArrowRight className="h-4 w-4 text-gray-400 mx-2" />
                  
                  <div className="flex flex-col items-center">
                    <div className={`rounded-full p-2 ${inspection.status.completion ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <span className="text-sm mt-1">Closed</span>
                    <span className="text-xs text-gray-500">{inspection.status.completion || "PENDING"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Notes */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2">Inspector Notes</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{inspection.notes}</p>
            </CardContent>
          </Card>
          
          {/* Defect Items */}
          {inspection.defects && (
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-red-500" /> Defect Items ({inspection.faultCount})
                </h3>
                
                {inspection.defects.repair.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-800 mb-2">Repair Required:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {inspection.defects.repair.map((item, index) => (
                        <li key={`repair-${index}`} className="text-gray-700">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {inspection.defects.replace.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Replacements Required:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {inspection.defects.replace.map((item, index) => (
                        <li key={`replace-${index}`} className="text-gray-700">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {inspection.defects.repair.length === 0 && inspection.defects.replace.length === 0 && (
                  <p className="text-gray-500 italic">No detailed defect information available</p>
                )}
              </CardContent>
            </Card>
          )}
          
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={onClick}>Close</Button>
            <Button onClick={onClick}>
              View Work Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
