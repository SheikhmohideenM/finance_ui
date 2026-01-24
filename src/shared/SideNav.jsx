import '../shared/SideNav.css';

import { NavLink } from 'react-router-dom';

export default function SideNav({ onLogout }) {
  return (
    <aside className="sidenav">
      <div className="logo">finance</div>

      <nav className="menu">
        <NavLink to="/dashboard" className="item">
          Overview
        </NavLink>

        <NavLink to="/transactions" className="item">
          Transactions
        </NavLink>

        <NavLink to="/budgets" className="item">
          Budgets
        </NavLink>

        <NavLink to="/pots" className="item">
          Pots
        </NavLink>

        <NavLink to="/recurring" className="item">
          Recurring Bills
        </NavLink>
      </nav>

      <button className="logout-btn" onClick={onLogout}>
        Logout
      </button>
    </aside>
  );
}
