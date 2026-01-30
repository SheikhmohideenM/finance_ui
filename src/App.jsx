import {
  useEffect,
  useState,
} from 'react';

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import Login from './components/login/Login';
import ProtectedRoute from './components/protected/ProtectedRoute';
import SignUp from './components/signup/SignUp';
import Dashboard from './dashboard/dashboard';
import DashboardLayout from './dashboard/DashboardLayout';
import Budget from './layout/budget/Budget';
import Pots from './layout/pots/Pots';
import RecurringBills from './layout/recurringBills/RecurringBills';
import Transactions from './transactions/Transactions';

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:3000/dashboard', { credentials: 'include' })
      .then((res) => {
        if (res.ok) setLoggedIn(true)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route
          path="/login"
          element={<Login onLogin={() => setLoggedIn(true)} />}
        />
        <Route
          path="/signup"
          element={<SignUp onSignup={() => setLoggedIn(true)} />}
        />

        <Route
          element={
            <ProtectedRoute loggedIn={loggedIn}>
              <DashboardLayout onLogout={() => setLoggedIn(false)} />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budgets" element={<Budget />} />
          <Route path="/pots" element={<Pots />} />
          <Route path="/recurringBills" element={<RecurringBills />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
