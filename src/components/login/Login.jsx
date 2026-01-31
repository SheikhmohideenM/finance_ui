import '../../styles/Login.css'

import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import illustration from '../../assets/finance.svg'
import AuthenticationApiService from '../../services/AuthenticationApiService'

export default function Login({ onLogin }) {
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    if (!name) return
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      await AuthenticationApiService.login(formData)
      onLogin && onLogin()
      navigate('/dashboard')
    } catch (err) {
      setError(err?.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div className="login-auth-page">
      <div className="login-mobile-header">
        <span className="login-mobile-logo">finance</span>
      </div>

      <div className="login-auth-container">
        <div className="login-auth-left">
          <img
            src={illustration}
            alt="Finance Illustration"
            className="login-auth-left-img"
          />
        </div>

        <div className="login-auth-right">
          <form className="login-auth-card" onSubmit={handleSubmit}>
            <h2>Login</h2>

            {error && <p className="login-error">{error}</p>}

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="submit">Login</button>

            <div className="login-auth-footer">
              Need to create an account? <a href="/signup">Sign Up</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
