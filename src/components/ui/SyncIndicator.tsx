import React from 'react';
import { useSyncContext } from '../../context/SyncContext';
import { RefreshCw } from 'lucide-react';
import ConnectionStatusIndicator from './ConnectionStatusIndicator';

interface SyncIndicatorProps {
  className?: string;
  showText?: boolean;
}

const SyncIndicator: React.FC<SyncIndicatorProps> = ({
  className = '',
  showText = true 
}) => {
  const { syncStatus, lastSynced, pendingChangesCount } = useSyncContext();

  // Format time since last sync
  const getTimeSinceSync = () => {
    if (!lastSynced) return 'Never';

    const seconds = Math.floor((new Date().getTime() - lastSynced.getTime()) / 1000);

    if (seconds < 5) return 'Just now';
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className={`flex items-center space-x-2 text-xs ${className}`}>
      <ConnectionStatusIndicator showText={false} />
      
      <div className="flex items-center space-x-2">
        {syncStatus === 'syncing' ? (
          <>
            <RefreshCw className="w-3 h-3 animate-spin text-blue-500" />
            {showText && <span className="text-blue-600">Syncing data...</span>} 
          </>
        ) : (
          <>
            <div className={`w-3 h-3 rounded-full ${
              syncStatus === 'error' ? 'bg-red-500' : 'bg-green-500'
            }`} />

            {showText && (
              <span className={syncStatus === 'error' ? 'text-red-500' : 'text-gray-500'}>
                {syncStatus === 'error'
                  ? 'Sync error'
                  : `Synced ${getTimeSinceSync()}`} 
                {pendingChangesCount > 0 && ` (${pendingChangesCount} pending)`}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SyncIndicator;