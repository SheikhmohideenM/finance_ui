import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api/v1'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

/* ================= JWT (optional) ================= */
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token')
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => Promise.reject(error),
// )

/* ================= CSRF-TOKEN ================= */
apiClient.interceptors.request.use(
  (config) => {
    const csrfToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('CSRF-TOKEN='))
      ?.split('=')[1]

    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken
    }

    return config
  },
  (error) => Promise.reject(error),
)

/* ================= Central error handler ================= */
const handleError = (error, defaultMsg) => {
  if (error.response?.data) {
    throw error.response.data
  }
  throw { errors: [defaultMsg] }
}

const ApiService = {
  fetchBudgetLists: async () => {
    try {
      const response = await apiClient.get('/budgets')
      return response.data
    } catch (error) {
      handleError(error, 'Failed to load budgets')
    }
  },

  createBudget: async (budgetData) => {
    try {
      const response = await apiClient.post('/budgets', budgetData)
      return response.data
    } catch (error) {
      handleError(error, 'Failed to create budget')
    }
  },

  updateBudget: async (id, budget) => {
    try {
      const res = await apiClient.put(`/budgets/${id}`, { budget })
      return res.data
    } catch (e) {
      handleError(e, 'Failed to update budget')
    }
  },

  deleteBudget: async (id) => {
    try {
      await apiClient.delete(`/budgets/${id}`)
      return true
    } catch (e) {
      handleError(e, 'Failed to delete budget')
    }
  },
}
export default ApiService
