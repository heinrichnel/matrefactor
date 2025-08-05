import React, { useState } from 'react';
import WialonIntegration from '../../components/wialon/WialonIntegration';
import WialonStatus from '../../components/wialon/WialonStatus';

/**
 * WialonDashboard Component
 * 
 * This page provides direct access to the Wialon platform through either
 * an embedded iframe or a button to open Wialon in a new tab.
 */
const WialonDashboard: React.FC = () => {
  const [displayMode, setDisplayMode] = useState<'button' | 'iframe'>('button');
  const [height, setHeight] = useState<string>('600px');

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Wialon Dashboard</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Access your Wialon vehicle tracking and fleet management platform.
      </p>

      <div className="mb-4 bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="font-medium text-gray-900 dark:text-white mb-2">Display Options</h3>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex items-center">
            <input
              type="radio"
              id="button-mode"
              name="display-mode"
              value="button"
              checked={displayMode === 'button'}
              onChange={() => setDisplayMode('button')}
              className="mr-2"
            />
            <label htmlFor="button-mode">Open in new tab</label>
          </div>
          
          <div className="flex items-center">
            <input
              type="radio"
              id="iframe-mode"
              name="display-mode"
              value="iframe"
              checked={displayMode === 'iframe'}
              onChange={() => setDisplayMode('iframe')}
              className="mr-2"
            />
            <label htmlFor="iframe-mode">Embed in page (iframe)</label>
          </div>
        </div>
        
        {displayMode === 'iframe' && (
          <div className="mb-4">
            <label htmlFor="iframe-height" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Frame Height
            </label>
            <div className="flex items-center">
              <input
                id="iframe-height"
                type="text"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 mr-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                (e.g., "600px", "80vh", etc.)
              </span>
            </div>
          </div>
        )}
      </div>
      
      <div className={`mt-4 ${displayMode === 'iframe' ? 'bg-white dark:bg-gray-800 p-4 rounded shadow' : ''}`}>
        <WialonIntegration 
          displayMode={displayMode} 
          height={height}
          buttonLabel="Launch Wialon Dashboard"
        />
      </div>

      <div className="mt-6 mb-6 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 p-4 text-sm">
        <h3 className="font-medium text-blue-700 dark:text-blue-400">About Wialon Integration</h3>
        <p className="mt-1 text-blue-600 dark:text-blue-300">
          This integration uses a secure token to connect directly to your Wialon account.
          If you experience any issues with the connection, please contact your system administrator.
        </p>
      </div>
      
      <div className="mt-6">
        <h3 className="font-medium text-gray-900 dark:text-white mb-2">Connection Status</h3>
        <WialonStatus />
      </div>
    </div>
  );
};

export default WialonDashboard;
