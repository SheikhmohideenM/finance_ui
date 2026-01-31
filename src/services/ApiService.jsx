import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL

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
    // const csrfToken = document.cookie
    //   .split('; ')
    //   .find((row) => row.startsWith('CSRF-TOKEN='))
    //   ?.split('=')[1]
    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute('content')

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
  /* ================= Budget ================= */
  fetchBudgetLists: async () => {
    try {
      const response = await apiClient.get('/api/v1/budgets')
      return response.data
    } catch (error) {
      handleError(error, 'Failed to load budgets')
    }
  },

  createBudget: async (budgetData) => {
    try {
      const response = await apiClient.post('/api/v1/budgets', {
        budget: budgetData,
      })
      return response.data
    } catch (error) {
      handleError(error, 'Failed to create budget')
    }
  },

  updateBudget: async (id, budget) => {
    try {
      const res = await apiClient.put(`/api/v1/budgets/${id}`, { budget })
      return res.data
    } catch (e) {
      handleError(e, 'Failed to update budget')
    }
  },

  deleteBudget: async (id) => {
    try {
      await apiClient.delete(`/api/v1/budgets/${id}`)
      return true
    } catch (e) {
      handleError(e, 'Failed to delete budget')
    }
  },

  /* ================= Pot ================= */
  fetchPotsLists: async () => {
    try {
      const response = await apiClient.get('/api/v1/pots')
      return response.data
    } catch (error) {
      handleError(error, 'Failed to load pots')
    }
  },

  createPot: async (potData) => {
    try {
      const response = await apiClient.post('/api/v1/pots', potData)
      return response.data
    } catch (error) {
      handleError(error, 'Failed to create pot')
    }
  },

  updatePot: async (id, pot) => {
    try {
      const res = await apiClient.put(`/api/v1/pots/${id}`, { pot })
      return res.data
    } catch (e) {
      handleError(e, 'Failed to update pot')
    }
  },

  deletePot: async (id) => {
    try {
      await apiClient.delete(`/api/v1/pots/${id}`)
      return true
    } catch (e) {
      handleError(e, 'Failed to delete pot')
    }
  },

  addMoney: async (id, amount) => {
    try {
      const res = await apiClient.post(`/api/v1/pots/${id}/add_money`, {
        amount,
      })
      return res.data
    } catch (e) {
      handleError(e, 'Failed to add amount')
    }
  },

  withdrawMoney: async (id, amount) => {
    try {
      const res = await apiClient.post(`/api/v1/pots/${id}/withdraw`, {
        amount,
      })
      return res.data
    } catch (e) {
      handleError(e, 'Failed to withdraw amount')
    }
  },

  /* ================= Recurring Bills ================= */
  fetchBillsLists: async () => {
    try {
      const response = await apiClient.get('/api/v1/recurring_bills')
      return response.data
    } catch (error) {
      handleError(error, 'Failed to load bills')
    }
  },

  createBill: async (billData) => {
    try {
      const response = await apiClient.post('/api/v1/recurring_bills', {
        recurring_bill: billData,
      })
      return response.data
    } catch (error) {
      handleError(error, 'Failed to create bill')
    }
  },

  /* ================= Transaction Bills ================= */
  fetchTransactionLists: async () => {
    try {
      const response = await apiClient.get('/api/v1/transactions')
      return response.data
    } catch (error) {
      handleError(error, 'Failed to load bills')
    }
  },

  createTransaction: async (transactionData) => {
    try {
      const response = await apiClient.post('/api/v1/transactions', {
        transaction: transactionData,
      })
      return response.data
    } catch (error) {
      handleError(error, 'Failed to Create Transaction')
    }
  },

  updateTransaction: async (id, transactionData) => {
    try {
      const res = await apiClient.put(`/api/v1/transactions/${id}`, {
        transaction: transactionData,
      })
      return res.data
    } catch (e) {
      handleError(e, 'Failed to update transactions')
    }
  },

  deleteTransaction: async (id) => {
    try {
      await apiClient.delete(`/api/v1/transactions/${id}`)
      return true
    } catch (e) {
      handleError(e, 'Failed to delete transactions')
    }
  },

  undoTransaction: async (id) => {
    try {
      await apiClient.post(`/api/v1/transactions/${id}/undo`)
      return true
    } catch (e) {
      handleError(e, 'Failed to undo transactions')
    }
  },
}
export default ApiService
