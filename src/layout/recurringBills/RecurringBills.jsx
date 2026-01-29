/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */

import '../recurringBills/RecurringBills.css'

import { React, useEffect, useState } from 'react'

import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

import CloseIcon from '@mui/icons-material/Close'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  FormControlLabel,
  IconButton,
  MenuItem,
  Switch,
  TextField,
} from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

import ApiService from '../../services/ApiService'

const BILLS = [
  {
    name: 'Elevate Education',
    cycle: 'Monthly · 1st',
    amount: 250,
    status: 'paid',
    icon: '🎓',
  },
  {
    name: 'Bravo Zen Spa',
    cycle: 'Monthly · 5th',
    amount: 70,
    status: 'paid',
    icon: '💆',
  },
  {
    name: 'Charlie Electric Company',
    cycle: 'Monthly · 7th',
    amount: 100,
    status: 'due',
    icon: '⚡',
  },
  {
    name: 'Delta Taxi',
    cycle: 'Monthly · 9th',
    amount: 30,
    status: 'paid',
    icon: '🚕',
  },
  {
    name: 'Echo Game Store',
    cycle: 'Monthly · 10th',
    amount: 5,
    status: 'paid',
    icon: '🎮',
  },
  {
    name: 'Tango Gas Company',
    cycle: 'Monthly · 23rd',
    amount: 225,
    status: 'paid',
    icon: '⛽',
  },
  {
    name: 'Juliet Restaurant',
    cycle: 'Monthly · 28th',
    amount: 90,
    status: 'paid',
    icon: '🍽️',
  },
]

export default function RecurringBills() {
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [error, setError] = useState(null)
  const [selectedBill, setSelectedBill] = useState(null)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    amount: '',
    frequency: 'monthly',
    next_run_on: '',
    auto_pay: true,
    budget_id: '',
  })

  const [bills, setBills] = useState([])
  const [budgets, setBudgets] = useState([])
  const [errors, setErrors] = useState([])

  const handleClickOpen = () => {
    setOpen(true)
  }

  const fetchBillsLists = async () => {
    try {
      const data = await ApiService.fetchBillsLists()
      setBills(data)
    } catch (error) {
      setError('Failed to load bills lists')
    }
  }

  const fetchBudgetLists = async () => {
    try {
      const data = await ApiService.fetchBudgetLists()
      setBudgets(data)
    } catch (error) {
      setError('Failed to load budget lists')
    }
  }

  useEffect(() => {
    fetchBillsLists()
    fetchBudgetLists()
  }, [])

  const selectedBudget = budgets.find((b) => b.id === Number(form.budget_id))

  const isBudgetExhausted = selectedBudget && selectedBudget.remaining <= 0

  const calculateNextRunDate = (frequency) => {
    const today = dayjs()
    switch (frequency) {
      case 'weekly':
        return today.add(1, 'week')
      case 'monthly':
        return today.add(1, 'month')
      case 'yearly':
        return today.add(1, 'year')
      default:
        return null
    }
  }

  useEffect(() => {
    const date = calculateNextRunDate(form.frequency)
    if (date) {
      setForm((prev) => ({
        ...prev,
        next_run_on: date.format('YYYY-MM-DD'),
      }))
    }
  }, [form.frequency])

  useEffect(() => {
    if (form.auto_pay && selectedBudget) {
      setForm((prev) => ({
        ...prev,
        amount: selectedBudget.remaining,
      }))
    }
  }, [form.auto_pay, form.budget_id])

  useEffect(() => {
    if (isBudgetExhausted && form.auto_pay) {
      setForm((prev) => ({ ...prev, auto_pay: false }))
    }
  }, [isBudgetExhausted])

  const handleCreate = async (e) => {
    e.preventDefault()
    setErrors([])

    try {
      const data = await ApiService.createBill({
        name: form.name,
        amount: Number(form.amount),
        frequency: form.frequency,
        next_run_on: form.next_run_on,
        auto_pay: form.auto_pay,
        account_id: 1,
        budget_id: form.budget_id,
      })

      setBills((prev) => [...prev, data])
      setOpen(false)

      setForm({
        name: '',
        amount: '',
        frequency: 'monthly',
        next_run_on: '',
        auto_pay: false,
        account_id: 1,
        budget_id: '',
      })

      Swal.fire({
        icon: 'success',
        title: 'Recurring Bill Created',
        text: 'Your Recurring Bill has been created successfully!',
        confirmButtonColor: '#111318',
      })
    } catch (err) {
      setErrors(err.errors || ['Recurring Bill Creation failed'])
    }
  }
  const handleUpdate = async () => {}
  const handleDelete = async () => {}

  return (
    <div className="bills-page">
      <div className="bills-headers">
        <h1>Recurring Bills</h1>
        <button className="add-bills-btn" onClick={handleClickOpen}>
          + Add New Bill
        </button>
      </div>

      <div className="bills-layout">
        <div className="bills-summary">
          <div className="total-bills-card">
            <div className="bill-icon-box">🧾</div>
            <p>Total Bills</p>
            <h2>$384.98</h2>
          </div>

          <div className="summary-box">
            <h3>Summary</h3>

            <div className="summary-row">
              <span>Paid Bills</span>
              <strong>4 ($190.00)</strong>
            </div>

            <div className="divider" />

            <div className="summary-row">
              <span>Total Upcoming</span>
              <strong>4 ($194.98)</strong>
            </div>

            <div className="divider" />

            <div className="summary-row danger">
              <span>Due Soon</span>
              <strong>2 ($59.98)</strong>
            </div>
          </div>
        </div>

        <div className="bills-table-card">
          <div className="bills-filters">
            <input placeholder="Search bills" />
            <div>
              <span>Sort by</span>
              <select>
                <option>Latest</option>
                <option>Oldest</option>
              </select>
            </div>
          </div>

          <div className="bills-header">
            <span>Bill Title</span>
            <span>Due Date</span>
            <span className="amount-col">Amount</span>
          </div>

          {BILLS.map((bill, i) => (
            <div className="bill-row" key={i}>
              <div className="bill-left">
                <div className={`bill-icon ${bill.status}`}>{bill.icon}</div>

                <div>
                  <div className="bill-name">{bill.name}</div>
                </div>
              </div>

              <div className={`bill-status ${bill.status}`}>{bill.cycle}</div>

              <div className={`bill-amount ${bill.status}`}>
                ${bill.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== ADD bill MODAL ===== */}
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
        <div className="bill-modal">
          <div className="bill-modal-header">
            <h3>Add New Recurring Bill</h3>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>

          <p className="bill-modal-desc">
            Choose a category to set a spending bill. These categories can help
            you monitor spending.
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
            <form className="bill-form" onSubmit={handleCreate} noValidate>
              <label>Bill Name</label>
              <TextField
                fullWidth
                size="small"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              ></TextField>

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

              <label>Frequency</label>
              <TextField
                select
                fullWidth
                size="small"
                value={form.frequency}
                onChange={(e) =>
                  setForm({ ...form, frequency: e.target.value })
                }
              >
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </TextField>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <label>Next Run On</label>
                <DatePicker
                  minDate={dayjs()}
                  value={form.next_run_on ? dayjs(form.next_run_on) : null}
                  onChange={(newValue) => {
                    setForm({
                      ...form,
                      next_run_on: newValue
                        ? newValue.format('YYYY-MM-DD')
                        : '',
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

              <FormControlLabel
                control={
                  <Switch
                    checked={form.auto_pay}
                    disabled={isBudgetExhausted}
                    onChange={(e) =>
                      setForm({ ...form, auto_pay: e.target.checked })
                    }
                    color="success"
                  />
                }
                label="Enable Auto Pay"
              />

              <Button
                type="submit"
                variant="contained"
                className="submit-bill-btn"
                fullWidth
                sx={{
                  textTransform: 'none',
                }}
              >
                Add Bill
              </Button>
            </form>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  )
}
