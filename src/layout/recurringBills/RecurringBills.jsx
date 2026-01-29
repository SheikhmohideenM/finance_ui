/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */

import '../recurringBills/RecurringBills.css'

import { React, useEffect, useRef, useState } from 'react'

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

export default function RecurringBills() {
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [error, setError] = useState(null)
  const [selectedBill, setSelectedBill] = useState(null)
  const navigate = useNavigate()

  const [sortOpen, setSortOpen] = useState(false)
  const [sortValue, setSortValue] = useState('Latest')
  const sortRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const getSortedBills = () => {
    const sorted = [...bills]

    switch (sortValue) {
      case 'Latest':
        return sorted.sort((a, b) => dayjs(b.created_at) - dayjs(a.created_at))

      case 'Oldest':
        return sorted.sort((a, b) => dayjs(a.created_at) - dayjs(b.created_at))

      case 'A to Z':
        return sorted.sort((a, b) => a.name.localeCompare(b.name))

      case 'Z to A':
        return sorted.sort((a, b) => b.name.localeCompare(a.name))

      case 'Highest':
        return sorted.sort((a, b) => b.amount - a.amount)

      case 'Lowest':
        return sorted.sort((a, b) => a.amount - b.amount)

      default:
        return sorted
    }
  }

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

  const today = dayjs()

  const paidBills = bills.filter((b) =>
    dayjs(b.next_run_on).isBefore(today, 'day'),
  )

  const dueBills = bills.filter((b) =>
    dayjs(b.next_run_on).isSame(today, 'day'),
  )

  const upcomingBills = bills.filter((b) =>
    dayjs(b.next_run_on).isAfter(today, 'day'),
  )

  // totals
  const sumAmount = (arr) =>
    arr.reduce((sum, b) => sum + Number(b.amount || 0), 0)

  const totalBillsAmount = sumAmount(bills)
  const paidAmount = sumAmount(paidBills)
  const upcomingAmount = sumAmount(upcomingBills)
  const dueAmount = sumAmount(dueBills)

  const daysUntil = (date) => {
    return dayjs(date).startOf('day').diff(dayjs().startOf('day'), 'day')
  }

  const STATUS_ICON = {
    paid: '✅',
    due: '❗',
    upcoming: '⏳',
  }

  const getBillStatus = (bill) => {
    const days = daysUntil(bill.next_run_on)

    if (days < 0) return 'paid'
    if (days <= 10) return 'due'
    return 'upcoming'
  }

  const getCycleText = (bill) => {
    const date = dayjs(bill.next_run_on)
    const day = date.format('D')

    switch (bill.frequency) {
      case 'weekly':
        return `Weekly · ${date.format('ddd')}`
      case 'monthly':
        return `Monthly · ${day}${getDaySuffix(day)}`
      case 'yearly':
        return `Yearly · ${date.format('MMM D')}`
      default:
        return ''
    }
  }

  const getDaySuffix = (day) => {
    if (day > 3 && day < 21) return 'th'
    switch (day % 10) {
      case 1:
        return 'st'
      case 2:
        return 'nd'
      case 3:
        return 'rd'
      default:
        return 'th'
    }
  }

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
            <h2>${totalBillsAmount.toFixed(2)}</h2>
          </div>

          <div className="summary-box">
            <h3>Summary</h3>

            <div className="summary-row">
              <span>Paid Bills</span>
              <strong>
                {paidBills.length} (${paidAmount.toFixed(2)})
              </strong>
            </div>

            <div className="divider" />

            <div className="summary-row">
              <span>Total Upcoming</span>
              <strong>
                {upcomingBills.length} (${upcomingAmount.toFixed(2)})
              </strong>
            </div>

            <div className="divider" />

            <div className="summary-row danger">
              <span>Due Soon</span>
              {dueBills.length} (${dueAmount.toFixed(2)})
            </div>
          </div>
        </div>

        <div className="bills-table-card">
          <div className="bills-filters">
            <input placeholder="Search bills" />
            <div className="sort-wrapper" ref={sortRef}>
              <span className="sort-label">Sort by</span>

              <button
                className="sort-btn"
                onClick={() => setSortOpen((o) => !o)}
              >
                {sortValue}
                <span className="caret">▾</span>
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
                        setSortOpen(false)
                      }}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bills-header">
            <span>Bill Title</span>
            <span>Due Date</span>
            <span className="amount-col">Amount</span>
          </div>

          {bills.length === 0 && (
            <div style={{ padding: '20px', color: '#777' }}>
              No recurring bills found
            </div>
          )}

          {getSortedBills().map((bill) => {
            const status = getBillStatus(bill)
            const cycleText = getCycleText(bill)

            return (
              <div className="bill-row" key={bill.id}>
                <div className="bill-left">
                  <div className={`bill-icon ${status}`}>
                    {STATUS_ICON[status]}
                  </div>

                  <div>
                    <div className="bill-name">{bill.name}</div>
                  </div>
                </div>

                <div className={`bill-status ${status}`}>{cycleText}</div>

                <div className={`bill-amount ${status}`}>
                  ${Number(bill.amount).toFixed(2)}
                </div>
              </div>
            )
          })}
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
