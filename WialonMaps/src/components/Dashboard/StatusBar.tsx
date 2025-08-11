// src/components/dashboard/StatusBar.tsx
import { useEffect, useState } from 'react';
import { useWialon } from '../../hooks/useWialon';
import type { WialonUnit } from '../../types/wialon';

interface StatusBarProps {
  selectedUnit?: WialonUnit | null;
  connectionStatus?: 'connected' | 'disconnected' | 'connecting';
  lastUpdate?: Date;
}

export const StatusBar = ({
  selectedUnit,
  connectionStatus = 'connected',
  lastUpdate
}: StatusBarProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { units } = useWialon();

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate status counts
  const statusCounts = units.reduce((acc, unit) => {
    acc[unit.status] = (acc[unit.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const formatTime = (date?: Date) => {
    if (!date) return 'Never';
    return date.toLocaleTimeString();
  };

  const formatDate = (date?: Date) => {
    if (!date) return '';
    return date.toLocaleDateString();
  };

  return (
    <footer className="bg-gray-800 text-white text-sm px-4 py-2 flex items-center justify-between border-t border-gray-700">
      {/* Left section - Selected unit info */}
      <div className="flex items-center space-x-4">
        {selectedUnit ? (
          <>
            <span className="font-medium">{selectedUnit.name}</span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
              selectedUnit.status === 'online' ? 'bg-green-500' :
              selectedUnit.status === 'parked' ? 'bg-yellow-500' :
              'bg-red-500'
            }`}>
              {selectedUnit.status}
            </span>
            {selectedUnit.driver && (
              <span className="text-gray-300">Driver: {selectedUnit.driver.name}</span>
            )}
          </>
        ) : (
          <span className="text-gray-400">No unit selected</span>
        )}
      </div>

      {/* Middle section - Fleet status summary */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <span>Online: {statusCounts['online'] || 0}</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
          <span>Parked: {statusCounts['parked'] || 0}</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          <span>Offline: {statusCounts['offline'] || 0}</span>
        </div>
        <span className="text-gray-400 ml-2">Total: {units.length}</span>
      </div>

      {/* Right section - Connection status and timestamps */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <span className={`w-2 h-2 rounded-full ${
            connectionStatus === 'connected' ? 'bg-green-500' :
            connectionStatus === 'connecting' ? 'bg-yellow-500' :
            'bg-red-500'
          }`}></span>
          <span className="capitalize">{connectionStatus}</span>
        </div>

        {lastUpdate && (
          <div className="hidden md:block text-gray-300">
            Updated: {formatDate(lastUpdate)} {formatTime(lastUpdate)}
          </div>
        )}

        <div className="hidden sm:block text-gray-300">
          Current: {formatTime(currentTime)}
        </div>
      </div>
    </footer>
  );
};

export default StatusBar;
