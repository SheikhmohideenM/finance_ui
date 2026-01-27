// src/services/apiClient.js
import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api/v1'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // needed for Rails cookies / CSRF
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// OPTIONAL: JWT support
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

const ApiService = {
  fetchBudgetLists: async () => {
    try {
      const response = await apiClient.get('/budgets')
      return response.data
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error('Failed to load Budget Lists')
    }
  },
}
export default ApiService
