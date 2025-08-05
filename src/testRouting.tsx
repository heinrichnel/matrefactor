import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import SidebarTester from './SidebarTester';

// For testing our routing and sidebar system
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SidebarTester />
  </React.StrictMode>
);
