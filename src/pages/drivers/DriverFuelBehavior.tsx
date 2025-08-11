import React from "react";

type DriverFuelData = {
  driver_id: number;
  date: string;
  distance: number;
  fuel_consumed: number;
};

type FuelAnalysis = {
  averageFuelEfficiency: number;
  driverFuelEfficiency: Record<number, number>;
  fuelEfficiencyOverTime: Record<string, number>;
  outlierDrivers: number[];
};

const sampleData: DriverFuelData[] = [
  { driver_id: 1, date: "2023-01-01", distance: 100, fuel_consumed: 10 },
  { driver_id: 1, date: "2023-01-02", distance: 120, fuel_consumed: 12 },
  { driver_id: 2, date: "2023-01-01", distance: 150, fuel_consumed: 15 },
  { driver_id: 2, date: "2023-01-02", distance: 130, fuel_consumed: 13 },
  { driver_id: 3, date: "2023-01-01", distance: 80, fuel_consumed: 8 },
  { driver_id: 3, date: "2023-01-02", distance: 90, fuel_consumed: 9 },
  { driver_id: 4, date: "2023-01-01", distance: 200, fuel_consumed: 20 },
  { driver_id: 4, date: "2023-01-02", distance: 180, fuel_consumed: 18 },
  { driver_id: 5, date: "2023-01-01", distance: 50, fuel_consumed: 10 },
  { driver_id: 5, date: "2023-01-02", distance: 60, fuel_consumed: 30 },
];

function analyzeFuelBehavior(data: DriverFuelData[]): FuelAnalysis {
  // Filter out invalid data
  const validData = data.filter((d) => d.distance > 0 && d.fuel_consumed > 0 && !!d.date);

  // Calculate fuel efficiency for each entry
  const withEfficiency = validData.map((d) => ({
    ...d,
    fuel_efficiency: d.distance / d.fuel_consumed,
  }));

  // Overall average fuel efficiency
  const averageFuelEfficiency =
    withEfficiency.reduce((sum, d) => sum + d.fuel_efficiency, 0) / withEfficiency.length;

  // Fuel efficiency per driver
  const driverGroups: Record<number, number[]> = {};
  withEfficiency.forEach((d) => {
    if (!driverGroups[d.driver_id]) driverGroups[d.driver_id] = [];
    driverGroups[d.driver_id].push(d.fuel_efficiency);
  });
  const driverFuelEfficiency: Record<number, number> = {};
  Object.entries(driverGroups).forEach(([driverId, effs]) => {
    driverFuelEfficiency[Number(driverId)] = effs.reduce((sum, e) => sum + e, 0) / effs.length;
  });

  // Fuel efficiency over time
  const dateGroups: Record<string, number[]> = {};
  withEfficiency.forEach((d) => {
    if (!dateGroups[d.date]) dateGroups[d.date] = [];
    dateGroups[d.date].push(d.fuel_efficiency);
  });
  const fuelEfficiencyOverTime: Record<string, number> = {};
  Object.entries(dateGroups).forEach(([date, effs]) => {
    fuelEfficiencyOverTime[date] = effs.reduce((sum, e) => sum + e, 0) / effs.length;
  });

  // Outlier drivers (using IQR)
  const effValues = Object.values(driverFuelEfficiency);
  const sortedEff = [...effValues].sort((a, b) => a - b);
  const q1 = sortedEff[Math.floor(sortedEff.length / 4)];
  const q3 = sortedEff[Math.floor((sortedEff.length * 3) / 4)];
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const outlierDrivers = Object.entries(driverFuelEfficiency)
    .filter(([, eff]) => eff < lowerBound)
    .map(([driverId]) => Number(driverId));

  return {
    averageFuelEfficiency,
    driverFuelEfficiency,
    fuelEfficiencyOverTime,
    outlierDrivers,
  };
}

const DriverFuelBehavior: React.FC = () => {
  const analysis = analyzeFuelBehavior(sampleData);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Driver Fuel Behavior Analysis</h2>
      <div className="mb-2">
        <strong>Average Fuel Efficiency:</strong> {analysis.averageFuelEfficiency.toFixed(2)}
      </div>
      <div className="mb-4">
        <strong>Fuel Efficiency per Driver:</strong>
        <ul className="list-disc ml-6">
          {Object.entries(analysis.driverFuelEfficiency).map(([driverId, eff]) => (
            <li key={driverId}>
              Driver {driverId}: {eff.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <strong>Fuel Efficiency Over Time:</strong>
        <ul className="list-disc ml-6">
          {Object.entries(analysis.fuelEfficiencyOverTime).map(([date, eff]) => (
            <li key={date}>
              {date}: {eff.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <strong>Outlier Drivers (Low Fuel Efficiency):</strong>
        {analysis.outlierDrivers.length > 0 ? (
          <ul className="list-disc ml-6">
            {analysis.outlierDrivers.map((driverId) => (
              <li key={driverId}>Driver {driverId}</li>
            ))}
          </ul>
        ) : (
          <span> None</span>
        )}
      </div>
    </div>
  );
};

export default DriverFuelBehavior;
