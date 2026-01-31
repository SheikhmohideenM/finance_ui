import '../../styles/SignUp.css'

import { useState } from 'react'

import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

import illustration from '../../assets/finance.svg'
import AuthenticationApiService from '../../services/AuthenticationApiService'

export default function SignUp({ onSignup }) {
  const [errors, setErrors] = useState([])

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
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
    setErrors([])

    try {
      await AuthenticationApiService.signup(formData)

      Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
        text: 'Your account has been created successfully!',
        confirmButtonColor: '#111318',
      }).then(() => {
        onSignup && onSignup()
        navigate('/login')
      })
    } catch (err) {
      if (Array.isArray(err.errors)) {
        setErrors(err.errors)
      } else if (err.error) {
        setErrors([err.error])
      } else {
        setErrors(['Signup failed'])
      }
    }
  }

  return (
    <div className="signup-auth-page">
      <div className="signup-mobile-header">
        <span className="signup-mobile-logo">finance</span>
      </div>

      <div className="signup-auth-container">
        <div className="signup-auth-left">
          <img
            src={illustration}
            alt="Finance Illustration"
            className="signup-auth-left-img"
          />
        </div>

        <div className="signup-auth-right">
          <form className="signup-auth-card" onSubmit={handleSubmit}>
            <h2>Sign Up</h2>

            {errors.length > 0 && (
              <ul className="signup-error-list">
                {errors.map((err, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            )}

            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Create Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <small>Password must be at least 8 characters</small>

            <button type="submit">Create Account</button>

            <div className="signup-auth-footer">
              Already have an account? <a href="/login">Login</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
