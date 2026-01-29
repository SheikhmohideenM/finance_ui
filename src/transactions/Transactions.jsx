/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import '../transactions/Transactions.css'

import { React, useEffect, useRef, useState } from 'react'

import dayjs from 'dayjs'
import Swal from 'sweetalert2'

import CloseIcon from '@mui/icons-material/Close'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  MenuItem,
  TextField,
} from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

import ApiService from '../services/ApiService'

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [budgets, setBudgets] = useState([])
  const [error, setError] = useState(null)

  const [sortOpen, setSortOpen] = useState(false)
  const [sortValue, setSortValue] = useState('Latest')
  const sortRef = useRef(null)

  const [selectedCategory, setSelectedCategory] = useState('All')

  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  useEffect(() => {
    ApiService.fetchTransactionLists()
      .then(setTransactions)
      .catch(() => setError('Failed to load transactions'))

    ApiService.fetchBudgetLists()
      .then(setBudgets)
      .catch(() => setError('Failed to load budgets'))
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const categoryOptions = ['All', ...new Set(budgets.map((b) => b.category))]

  const filteredTransactions =
    selectedCategory === 'All'
      ? transactions
      : transactions.filter((t) => t.category === selectedCategory)

  const getSortedTransactions = () => {
    const sorted = [...filteredTransactions]

    switch (sortValue) {
      case 'Latest':
        return sorted.sort((a, b) => dayjs(b.created_at) - dayjs(a.created_at))
      case 'Oldest':
        return sorted.sort((a, b) => dayjs(a.created_at) - dayjs(b.created_at))
      case 'A to Z':
        return sorted.sort((a, b) =>
          (a.description || '').localeCompare(b.description || ''),
        )
      case 'Z to A':
        return sorted.sort((a, b) =>
          (b.description || '').localeCompare(a.description || ''),
        )
      case 'Highest':
        return sorted.sort((a, b) => b.amount - a.amount)
      case 'Lowest':
        return sorted.sort((a, b) => a.amount - b.amount)
      default:
        return sorted
    }
  }

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const sortedTransactions = getSortedTransactions()

  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage)
  const start = (currentPage - 1) * itemsPerPage
  const currentData = sortedTransactions.slice(start, start + itemsPerPage)

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  const getPages = () => {
    const pages = []
    for (let i = 1; i <= totalPages; i++) pages.push(i)
    return pages
  }

  const [form, setForm] = useState({
    name: '',
    amount: '',
    date: '',
    budget_id: '',
    description: '',
  })

  const handleClickOpen = () => {
    setOpen(true)
  }

  const selectedBudget = budgets.find((b) => b.id === Number(form.budget_id))
  const isBudgetExhausted = selectedBudget && selectedBudget.remaining <= 0

  useEffect(() => {
    if (selectedBudget) {
      setForm((prev) => ({
        ...prev,
        amount: selectedBudget.remaining,
      }))
    }
  }, [form.budget_id])

  const [errors, setErrors] = useState([])

  const handleCreate = async (e) => {
    e.preventDefault()
    setError([])

    try {
      const data = await ApiService.createTransaction({
        amount: Number(form.amount),
        description: form.description,
        date: form.date,
        account_id: 1,
        budget_id: form.budget_id,
      })

      setTransactions((prev) => [...prev, data])
      setOpen(false)

      setForm({
        amount: '',
        description: '',
        date: '',
        account_id: 1,
        budget_id: '',
      })

      Swal.fire({
        icon: 'success',
        title: 'Transaction Done',
        text: 'Your Transaction done Successfully!',
        confirmButtonColor: '#111318',
      })
    } catch (err) {
      setError(err.errors || ['Transaction failed'])
    }
  }
  const handleUpdate = async () => {}
  const handleDelete = async () => {}

  return (
    <div className="transactions-page">
      <div className="transactions-headers">
        <h1>Transactions</h1>
        <button className="add-transactions-btn" onClick={handleClickOpen}>
          + New Transactions
        </button>
      </div>

      <div className="table-card">
        <div className="table-filters">
          <input placeholder="Search transaction" />

          <div className="sort-wrapper" ref={sortRef}>
            <span>Sort by</span>
            <button className="sort-btn" onClick={() => setSortOpen((o) => !o)}>
              {sortValue} ▾
            </button>

            {sortOpen && (
              <div className="sort-menu">
                {[
                  'Latest',
                  'Oldest',
                  'A to Z',
                  'Z to A',
                  'Highest',
                  'Lowest',
                ].map((opt) => (
                  <div
                    key={opt}
                    className={`sort-item ${opt === sortValue ? 'active' : ''}`}
                    onClick={() => {
                      setSortValue(opt)
                      setCurrentPage(1)
                      setSortOpen(false)
                    }}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="filters-right">
            <span>Category</span>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value)
                setCurrentPage(1)
              }}
            >
              {categoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-header">
          <span>Recipient / Sender</span>
          <span>Category</span>
          <span>Transaction Date</span>
          <span className="amount-col">Amount</span>
        </div>

        {currentData.map((tx) => (
          <div className="table-row" key={tx.id}>
            <span className="name">
              <span className="avatar">{tx.user_name?.charAt(0)}</span>
              {tx.user_name}
            </span>

            <span>{tx.category || 'Uncategorized'}</span>

            <span>{dayjs(tx.date).format('DD MMM YYYY')}</span>

            <span className={`amount ${tx.amount > 0 ? 'plus' : 'minus'}`}>
              {tx.amount > 0 ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
            </span>
          </div>
        ))}

        <div className="pagination">
          <div>
            <button
              className="paginationBtn"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ◀ Prev
            </button>
          </div>

          <div className="pages">
            {getPages().map((p) => (
              <span
                key={p}
                className={p === currentPage ? 'active' : ''}
                onClick={() => goToPage(p)}
              >
                {p}
              </span>
            ))}
          </div>

          <div>
            <button
              className="paginationBtn"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next ▶
            </button>
          </div>
        </div>
      </div>

      {/* ===== ADD TRANSACTION MODAL ===== */}
      <Dialog
        open={open}
        onClose={(event, reason) => {
          if (reason === 'backdropClick') return
          setOpen(false)
        }}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(2px)',
          },
        }}
        PaperProps={{
          sx: {
            width: { xs: '90%', sm: '480px' },
            maxWidth: '480px',
            maxHeight: '480px',
            borderRadius: '14px',
          },
        }}
      >
        <div className="transaction-modal">
          <div className="transaction-modal-header">
            <h3>New Transaction</h3>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>

          <p className="transaction-modal-desc">
            Choose a category to set a spending transaction. These categories
            can help you monitor spending.
          </p>

          {Array.isArray(errors) && errors.length > 0 && (
            <Box
              sx={{
                color: '#c0392b',
                fontSize: '15px',
                marginLeft: '25px',
              }}
            >
              {errors.map((err, index) => (
                <div key={index}>• {err}</div>
              ))}
            </Box>
          )}

          <DialogContent>
            <form
              className="transaction-form"
              onSubmit={handleCreate}
              noValidate
            >
              <label>Budget Category</label>
              <TextField
                select
                fullWidth
                size="small"
                value={form.budget_id}
                displayEmpty
                renderValue={(selected) => {
                  if (!selected) {
                    return (
                      <span style={{ color: '#999' }}>Select Category</span>
                    )
                  }
                  const budget = budgets.find((b) => b.id === selected)
                  return budget ? budget.title : ''
                }}
                onChange={(e) =>
                  setForm({ ...form, budget_id: e.target.value })
                }
              >
                <MenuItem value="" disabled>
                  Select Category
                </MenuItem>

                {budgets.map((b) => (
                  <MenuItem key={b.id} value={b.id}>
                    {b.title}
                  </MenuItem>
                ))}
              </TextField>

              <label>Amount</label>
              <TextField
                fullWidth
                size="small"
                type="number"
                placeholder="2000"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />

              <label>Description</label>
              <TextField
                fullWidth
                size="small"
                multiline
                minRows={3}
                maxRows={6}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              ></TextField>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <label>Date</label>
                <DatePicker
                  minDate={dayjs()}
                  value={form.date ? dayjs(form.date) : null}
                  onChange={(newValue) => {
                    setForm({
                      ...form,
                      date: newValue ? newValue.format('YYYY-MM-DD') : '',
                    })
                  }}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                    },
                  }}
                />
              </LocalizationProvider>

              <Button
                type="submit"
                variant="contained"
                className="submit-transaction-btn"
                fullWidth
                sx={{
                  textTransform: 'none',
                }}
              >
                Add transaction
              </Button>
            </form>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  )
}
