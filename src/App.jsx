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

import Login from './components/login/login';
import ProtectedRoute from './components/protected/ProtectedRoute';
import SignUp from './components/signup/Signup';
import Dashboard from './dashboard/dashboard';
import DashboardLayout from './dashboard/DashboardLayout';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/accounts", { credentials: "include" })
      .then(res => {
        if (res.ok) setLoggedIn(true);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth */}
        <Route
          path="/login"
          element={<Login onLogin={() => setLoggedIn(true)} />}
        />
        <Route
          path="/signup"
          element={<SignUp onSignup={() => setLoggedIn(true)} />}
        />

        {/* 🔐 PROTECTED APP LAYOUT */}
        <Route
          element={
            <ProtectedRoute loggedIn={loggedIn}>
              <DashboardLayout onLogout={() => setLoggedIn(false)} />
            </ProtectedRoute>
          }
        >
          {/* 🔥 ALL THESE SHARE THE SAME SIDENAV */}
          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route path="/transactions" element={<Transactions />} /> */}
          {/* <Route path="/budgets" element={<Budgets />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
