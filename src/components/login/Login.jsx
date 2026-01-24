import '../../styles/auth.css';

import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import illustration from '../../assets/finance.svg';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // 🔥 ADD THIS

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (res.ok) {
      onLogin && onLogin();
      navigate("/dashboard"); // 🔥 THIS WAS MISSING
    } else {
      const data = await res.json();
      setError(data.error || "Login failed");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <img src={illustration} alt="Finance Illustration" className="auth-left-img" />
        </div>

        <div className="auth-right">
          <form className="auth-card" onSubmit={handleSubmit}>
            <h2>Login</h2>

            {error && <p className="error">{error}</p>}

            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />

            <button type="submit">Login</button>

            <div className="auth-footer">
              Don’t have an account?{" "}
              <a href="/signup">Sign Up</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
