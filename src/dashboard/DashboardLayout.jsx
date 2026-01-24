import { Outlet } from 'react-router-dom';

import SideNav from '../shared/SideNav';

export default function DashboardLayout({ onLogout }) {
  return (
    <div className="dashboard-layout">
      <SideNav onLogout={onLogout} />
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}
