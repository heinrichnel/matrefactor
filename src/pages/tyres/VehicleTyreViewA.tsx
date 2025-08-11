import { VehicleSelector } from "@/components/common/VehicleSelector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  getTyreConditionColor,
  getTyresByVehicle,
  getTyreStatusColor,
  getVehicleTyreConfiguration,
  Tyre,
} from "@/data/tyreData";
import { FLEET_VEHICLES } from "@/data/vehicles";
import type { FleetTyreMapping, TyreAllocation } from "@/types/tyre";
import { CircleDot, Eye, Wrench } from "lucide-react";
import React, { useState } from "react";

interface VehicleTyreViewProps {
  selectedVehicle: string;
  onVehicleSelect: (vehicleId: string) => void;
}

export const VehicleTyreView: React.FC<VehicleTyreViewProps> = ({
  selectedVehicle,
  onVehicleSelect,
}) => {
  const [selectedTyre, setSelectedTyre] = useState<Tyre | null>(null);

  const vehicle = FLEET_VEHICLES.find((v) => v.fleetNo === selectedVehicle);
  const vehicleTyres = selectedVehicle ? getTyresByVehicle(selectedVehicle) : [];
  // derive mapping of permitted positions for this vehicle
  // getVehicleTyreConfiguration currently returns a simple structure without fleetNumber/vehicleType.
  // We adapt it to FleetTyreMapping shape for this view.
  const rawConfig = getVehicleTyreConfiguration(selectedVehicle);
  const tyreConfig: FleetTyreMapping | null = rawConfig
    ? {
        fleetNumber: selectedVehicle,
        vehicleType: vehicle?.type || "unknown",
        positions: (rawConfig.positions as any[]).map((p) => ({
          position: p.id || p.position || "SP",
          // additional fields left undefined
        })),
      }
    : null;

  // const getTyreAtPosition = (position: string) => {
  //   return getTyreByPosition(selectedVehicle, position);
  // };

  const getVehicleTypeLabel = (type: string) => {
    switch (type) {
      case "horse":
        return "Horse (Truck Tractor)";
      case "interlink":
        return "Interlink";
      case "reefer":
        return "Reefer";
      case "lmv":
        return "LMV";
      case "special":
        return "Special Configuration";
      default:
        return "Unknown Type";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <VehicleSelector
            value={selectedVehicle}
            onChange={onVehicleSelect}
            label="Select Vehicle for Tyre View"
            placeholder="Choose a vehicle to view tyre details..."
            activeOnly={false}
            showDetails={true}
          />
        </div>
      </div>

      {selectedVehicle && tyreConfig && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visual Vehicle Diagram */}
          <Card>
            <CardHeader title="Tyre Layout"></CardHeader>
            <CardContent>
              <table className="w-full text-sm text-left">
                <thead>
                  <tr>
                    <th className="px-2 py-1">Position</th>
                    <th className="px-2 py-1">Tyre Code</th>
                    <th className="px-2 py-1">Brand</th>
                    <th className="px-2 py-1">Pattern</th>
                    <th className="px-2 py-1">Size</th>
                    <th className="px-2 py-1">Tread (mm)</th>
                    <th className="px-2 py-1">Odometer (km)</th>
                  </tr>
                </thead>
                <tbody>
                  {tyreConfig.positions.map((pos: TyreAllocation) => (
                    <tr key={pos.position} className="border-t">
                      <td className="px-2 py-1">{pos.position}</td>
                      <td className="px-2 py-1">{pos.tyreCode || "Empty"}</td>
                      <td className="px-2 py-1">{pos.brand || "-"}</td>
                      <td className="px-2 py-1">{pos.pattern || "-"}</td>
                      <td className="px-2 py-1">{pos.size || "-"}</td>
                      <td className="px-2 py-1">{pos.treadDepth ?? "-"}</td>
                      <td className="px-2 py-1">{pos.odometerAtFitment ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Tyre Details Panel */}
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedTyre
                  ? `Tyre Details - ${selectedTyre.installation.position}`
                  : "Tyre Information"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedTyre ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {selectedTyre.brand} {selectedTyre.model}
                      </h3>
                      <p className="text-gray-600">{selectedTyre.pattern} Pattern</p>
                    </div>
                    <Badge className={getTyreConditionColor(selectedTyre.condition.status)}>
                      {selectedTyre.condition.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium mb-2">Specifications</h4>
                      <div className="space-y-1">
                        <p>
                          <span className="text-gray-500">Size:</span> {selectedTyre.size.width}/
                          {selectedTyre.size.aspectRatio}R{selectedTyre.size.rimDiameter}
                        </p>
                        <p>
                          <span className="text-gray-500">Load Index:</span>{" "}
                          {selectedTyre.loadIndex}
                        </p>
                        <p>
                          <span className="text-gray-500">Speed Rating:</span>{" "}
                          {selectedTyre.speedRating}
                        </p>
                        <p>
                          <span className="text-gray-500">Type:</span> {selectedTyre.type}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Current Condition</h4>
                      <div className="space-y-1">
                        <p>
                          <span className="text-gray-500">Tread Depth:</span>{" "}
                          {selectedTyre.condition.treadDepth}mm
                        </p>
                        <p>
                          <span className="text-gray-500">Pressure:</span>{" "}
                          {selectedTyre.condition.pressure} PSI
                        </p>
                        <p>
                          <span className="text-gray-500">Temperature:</span>{" "}
                          {selectedTyre.condition.temperature}°C
                        </p>
                        <p>
                          <span className="text-gray-500">Last Inspection:</span>{" "}
                          {selectedTyre.condition.lastInspectionDate}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Installation Details</h4>
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="text-gray-500">Installed:</span>{" "}
                        {selectedTyre.installation.installationDate}
                      </p>
                      <p>
                        <span className="text-gray-500">Mileage at Install:</span>{" "}
                        {selectedTyre.installation.mileageAtInstallation.toLocaleString()} km
                      </p>
                      <p>
                        <span className="text-gray-500">Distance Run:</span>{" "}
                        {(selectedTyre.kmRun ?? (selectedTyre as any).kmRun ?? 0).toLocaleString()}{" "}
                        km
                      </p>
                      <p>
                        <span className="text-gray-500">Serial Number:</span>{" "}
                        {selectedTyre.serialNumber}
                      </p>
                      <p>
                        <span className="text-gray-500">DOT Code:</span> {selectedTyre.dotCode}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Purchase Information</h4>
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="text-gray-500">Cost:</span> R
                        {selectedTyre.purchaseDetails.cost.toLocaleString()}
                      </p>
                      <p>
                        <span className="text-gray-500">Supplier:</span>{" "}
                        {selectedTyre.purchaseDetails.supplier}
                      </p>
                      <p>
                        <span className="text-gray-500">Purchase Date:</span>{" "}
                        {selectedTyre.purchaseDetails.date}
                      </p>
                      <p>
                        <span className="text-gray-500">Warranty:</span>{" "}
                        {selectedTyre.purchaseDetails.warranty}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      Inspect
                    </Button>
                    <Button size="sm" variant="outline">
                      <Wrench className="w-4 h-4 mr-1" />
                      Service
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <CircleDot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Click on a tyre position above to view details</p>
                  {tyreConfig && (
                    <div className="mt-4 text-sm">
                      <p>
                        <strong>{getVehicleTypeLabel(tyreConfig.vehicleType)}</strong>
                      </p>
                      <p>{tyreConfig.positions.length} tyre positions</p>
                      <p>
                        {tyreConfig.positions.filter((p) => p.position === "SP").length} spare
                        tyre(s)
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {selectedVehicle && tyreConfig && (
        <Card>
          <CardHeader>
            <CardTitle>All Tyres for {vehicle?.fleetNo}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {vehicleTyres.map((tyre) => (
                <div
                  key={tyre.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedTyre(tyre)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">
                        {tyre.brand} {tyre.model}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Position: {tyre.installation.position} | Pattern: {tyre.pattern}
                      </p>
                      <p className="text-xs text-gray-500">
                        Tread: {tyre.condition.treadDepth}mm | Pressure: {tyre.condition.pressure}{" "}
                        PSI | Distance: {(tyre.kmRun ?? (tyre as any).kmRun ?? 0).toLocaleString()}{" "}
                        km
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge className={getTyreConditionColor(tyre.condition.status)}>
                        {tyre.condition.status.replace("_", " ").toUpperCase()}
                      </Badge>
                      <Badge className={getTyreStatusColor(tyre.status)}>
                        {tyre.status.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
              {vehicleTyres.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  No tyre data available for this vehicle
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VehicleTyreView;
