import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000' //for local
// const API_BASE_URL = import.meta.env.VITE_API_URL

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

const AuthenticationApiService = {
  login: async (data) => {
    try {
      const response = await apiClient.post(`${API_BASE_URL}/login`, data)
      return response.data
    } catch (error) {
      console.error('Login error:', error)
      if (error.response) {
        throw error.response.data
      }
      throw { error: 'Network error. Please try again.' }
    }
  },

  signup: async (data) => {
    try {
      const response = await apiClient.post(`${API_BASE_URL}/signup`, data)
      return response.data
    } catch (error) {
      console.error('Signup error:', error)
      if (error.response) {
        throw error.response.data
      }
      throw { error: 'Network error. Please try again.' }
    }
  },
}

export default AuthenticationApiService
