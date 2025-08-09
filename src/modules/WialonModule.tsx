/**
 * Main Wialon integration module
 * This file exports all Wialon-related components and hooks for use in the application
 */

import { useWialon } from '../hooks/useWialon';
import { WialonProvider } from '../context/WialonContext';
import WialonUnitList from '../components/wialon/WialonUnitList';
import WialonUnitDetails from '../components/wialon/WialonUnitDetails';
import WialonMap from '../components/wialon/WialonMap';
import WialonTrackingPage from '../pages/WialonTrackingPage';

// Re-export all Wialon components and hooks
export {
  useWialon,
  WialonProvider,
  WialonUnitList,
  WialonUnitDetails,
  WialonMap,
  WialonTrackingPage
};
