import '../shared/SideNav.css'

import { BiLogOutCircle } from 'react-icons/bi'
import {
  FiDollarSign,
  FiFileText,
  FiHome,
  FiPieChart,
  FiRepeat,
} from 'react-icons/fi'
import { NavLink } from 'react-router-dom'

export default function SideNav({ onLogout }) {
  return (
    <aside className="sidenav">
      <div className="logo">finance</div>

      <nav className="menu">
        <NavLink to="/dashboard" className="item">
          <FiHome />
          <span>Overview</span>
        </NavLink>

        <NavLink to="/transactions" className="item">
          <FiRepeat />
          <span className="label">Transactions</span>
        </NavLink>

        <NavLink to="/budgets" className="item">
          <FiPieChart />
          <span className="label">Budgets</span>
        </NavLink>

        <NavLink to="/pots" className="item">
          <FiDollarSign />
          <span className="label">Pots</span>
        </NavLink>

        <NavLink to="/recurringBills" className="item">
          <FiFileText />
          <span className="label">Recurring Bills</span>
        </NavLink>

        <button className="logout-btn item" onClick={onLogout}>
          <BiLogOutCircle className="logout" />
          Logout
        </button>
      </nav>
    </aside>
  )
}
