import React from 'react';
import OpsNavbar from './OpsNavbar';
import Sidebar from './Sidebar';
import ScanResultToast from '../scanner/ScanResultToast';

export default function PageWrapper({ children }) {
  return (
    <div className="app-container">
      <div className="main-content">
        <OpsNavbar />
        <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - var(--navbar-height))' }}>
          <Sidebar />
          <main className="page-body">
            {children}
          </main>
        </div>
      </div>
      <ScanResultToast />
    </div>
  );
}
