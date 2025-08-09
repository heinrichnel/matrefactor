import React from "react";
import { useWialonContext } from "../../context/WialonContext";
import { ExtendedWialonUnit } from "../../hooks/useWialon";

interface WialonUnitDetailsProps {
  unit?: ExtendedWialonUnit | null; // Optional override for selected unit
  className?: string;
  showHeader?: boolean;
  showActions?: boolean;
}

const WialonUnitDetails: React.FC<WialonUnitDetailsProps> = ({
  unit,
  className = "",
  showHeader = true,
  showActions = true,
}) => {
  const { selectedUnit, setSelectedUnit } = useWialonContext();
  const unitToDisplay = unit || selectedUnit;

  if (!unitToDisplay) {
    return (
      <div className={`wialon-unit-details empty ${className}`}>
        <p>No vehicle selected</p>
      </div>
    );
  }

  // Format timestamp to readable date/time
  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp * 1000).toLocaleString();
  };

  // Determine connection status
  const getConnectionStatus = () => {
    if (!unitToDisplay.connection_state) return "Offline";
    return "Online";
  };

  // Format speed
  const formatSpeed = (speed?: number) => {
    if (speed === undefined || speed === null) return "N/A";
    return `${speed} km/h`;
  };

  return (
    <div className={`wialon-unit-details ${className}`}>
      {showHeader && (
        <div className="wialon-unit-header">
          <h3>{unitToDisplay.name}</h3>
          <div className={`status-indicator ${getConnectionStatus().toLowerCase()}`}>
            {getConnectionStatus()}
          </div>
        </div>
      )}

      <div className="wialon-unit-body">
        {unitToDisplay.registration && (
          <div className="detail-row">
            <span className="label">Registration:</span>
            <span className="value">{unitToDisplay.registration}</span>
          </div>
        )}

        {unitToDisplay.type && (
          <div className="detail-row">
            <span className="label">Type:</span>
            <span className="value">{unitToDisplay.type}</span>
          </div>
        )}

        {unitToDisplay.uniqueId && (
          <div className="detail-row">
            <span className="label">Unit ID:</span>
            <span className="value">{unitToDisplay.uniqueId}</span>
          </div>
        )}

        {unitToDisplay.position && (
          <>
            <div className="detail-row">
              <span className="label">Position:</span>
              <span className="value">
                {unitToDisplay.position.latitude.toFixed(6)},{" "}
                {unitToDisplay.position.longitude.toFixed(6)}
              </span>
            </div>

            <div className="detail-row">
              <span className="label">Speed:</span>
              <span className="value">{formatSpeed(unitToDisplay.position.speed)}</span>
            </div>

            <div className="detail-row">
              <span className="label">Last update:</span>
              <span className="value">{formatTimestamp(unitToDisplay.position.timestamp)}</span>
            </div>
          </>
        )}
      </div>

      {showActions && (
        <div className="wialon-unit-actions">
          <button className="center-map-btn" onClick={() => setSelectedUnit(unitToDisplay)}>
            Center on map
          </button>

          <button
            className="view-history-btn"
            onClick={() => {
              // Navigate to history view or open modal
              // Implementation depends on your application structure
              console.log("View history for unit:", unitToDisplay.id);
            }}
          >
            View history
          </button>
        </div>
      )}

      <style>{`
        .wialon-unit-details {
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          padding: 16px;
        }

        .wialon-unit-details.empty {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 150px;
          color: #666;
        }

        .wialon-unit-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #eee;
          padding-bottom: 12px;
          margin-bottom: 12px;
        }

        .wialon-unit-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        .status-indicator {
          padding: 4px 8px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-indicator.online {
          background-color: #e6f7e6;
          color: #2e7d32;
        }

        .status-indicator.offline {
          background-color: #ffeaeb;
          color: #d32f2f;
        }

        .wialon-unit-body {
          margin-bottom: 16px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .label {
          color: #666;
          font-size: 14px;
        }

        .value {
          font-size: 14px;
          font-weight: 500;
          text-align: right;
        }

        .wialon-unit-actions {
          display: flex;
          gap: 8px;
        }

        .wialon-unit-actions button {
          flex: 1;
          padding: 8px 12px;
          border: none;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .center-map-btn {
          background-color: #1976d2;
          color: white;
        }

        .center-map-btn:hover {
          background-color: #1565c0;
        }

        .view-history-btn {
          background-color: #f5f5f5;
          color: #333;
        }

        .view-history-btn:hover {
          background-color: #e0e0e0;
        }
      `}</style>
    </div>
  );
};

export default WialonUnitDetails;
