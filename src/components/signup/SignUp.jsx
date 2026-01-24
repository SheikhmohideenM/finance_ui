import '../../styles/auth.css';

import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import illustration from '../../assets/finance.svg';

export default function SignUp({ onSignup }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors([]);

    const res = await fetch("http://localhost:3000/signup", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (res.ok) {
        Swal.fire({
            icon: 'success',
            title: 'Registration Successful',
            text: 'Your account has been created successfully!',
            confirmButtonColor: '#111318'
        }).then(() =>{
            onSignup && onSignup();
            navigate("/login")
        });
    } else {
      setErrors(data.errors || "Signup failed");
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
            <h2>Sign Up</h2>

            {errors.length > 0 && (
                <ul className="error-list">
                    {errors.map((err, index) => (
                        <li key={index}>{err}</li>
                    ))}
                </ul>
            )}

            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />

            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />

            <label>Create Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <small>Password must be at least 8 characters</small>

            <button type="submit">Create Account</button>

            <div className="auth-footer">
              Already have an account? <a href="/login">Login</a>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
