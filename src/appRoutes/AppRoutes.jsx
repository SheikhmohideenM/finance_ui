/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */

import { useEffect, useState } from 'react'

import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import Login from '../components/login/Login'
import ProtectedRoute from '../components/protected/ProtectedRoute'
import SignUp from '../components/signup/SignUp'
import Dashboard from '../dashboard/dashboard'
import DashboardLayout from '../dashboard/DashboardLayout'
import Budget from '../layout/budget/Budget'
import Pots from '../layout/pots/Pots'
import RecurringBills from '../layout/recurringBills/RecurringBills'
import LoadingSpinner from '../spinner/LoadingSpinner'
import Transactions from '../transactions/Transactions'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    let timer

    setLoading(true)
    const startTime = Date.now()
    const minLoadingTime = 2000

    timer = setTimeout(() => {
      const elapsedTime = Date.now() - startTime
      const remainingTime = minLoadingTime - elapsedTime

      if (remainingTime > 0) {
        setTimeout(() => setLoading(false), remainingTime)
      } else {
        setLoading(false)
      }
    }, 0)

    return () => clearTimeout(timer)
  }, [location.pathname])

  return (
    <>
      {loading && <LoadingSpinner />}
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
    </>
  )
}

export default App
