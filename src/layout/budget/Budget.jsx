/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */

import '../budget/Budget.css'

import { React, useEffect, useRef, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment'

import ApiService from '../../services/ApiService'

export default function Budgets() {
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [error, setError] = useState(null)
  const [selectedBudget, setSelectedBudget] = useState(null)

  const [form, setForm] = useState({
    category: 'entertainment',
    limit: '',
    theme: 'green',
  })

  const [budgets, setBudgets] = useState([])

  const fetchBudgetLists = async () => {
    try {
      const data = await ApiService.fetchBudgetLists()
      setBudgets(data)
    } catch (error) {
      setError('Failed to load budget lists')
    }
  }

  useEffect(() => {
    fetchBudgetLists()
  }, [])

  const handleClickOpen = () => {
    setOpen(true)
  }

  const CATEGORY_OPTIONS = [
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'bills', label: 'Bills' },
    { value: 'groceries', label: 'Groceries' },
    { value: 'diningOut', label: 'Dining Out' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'personalCare', label: 'Personal Care' },
    { value: 'education', label: 'Education' },
  ]

  const COLOR_OPTIONS = [
    { value: 'green', label: 'Green', color: '#1f7a6d' },
    { value: 'yellow', label: 'Yellow', color: '#f2c94c' },
    { value: 'cyan', label: 'Cyan', color: '#56ccf2' },
    { value: 'navy', label: 'Navy', color: '#1f2a44' },
    { value: 'red', label: 'Red', color: '#eb5757' },
    { value: 'purple', label: 'Purple', color: '#9b51e0' },
    { value: 'turquoise', label: 'Turquoise', color: '#2dd4bf' },
    { value: 'brown', label: 'Brown', color: '#8d6e63' },
    { value: 'magenta', label: 'Magenta', color: '#d63384' },
    { value: 'blue', label: 'Blue', color: '#2f80ed' },
    { value: 'navyGrey', label: 'Navy Grey', color: '#6b7280' },
    { value: 'armyGreen', label: 'Army Green', color: '#6b8e23' },
    { value: 'pink', label: 'Pink', color: '#f472b6' },
    { value: 'gold', label: 'Gold', color: '#d4af37' },
    { value: 'orange', label: 'Orange', color: '#f2994a' },
  ]

  const [errors, setErrors] = useState([])

  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setErrors([])

    const res = await fetch('http://localhost:3000/api/v1/budgets', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        budget: {
          category: form.category,
          color: form.theme,
          max: form.limit,
        },
      }),
    })

    const data = await res.json()

    if (res.ok) {
      setBudgets((prev) => [...prev, data])
      setOpen(false)
      setForm({
        category: 'entertainment',
        limit: '',
        theme: 'green',
      })

      Swal.fire({
        icon: 'success',
        title: 'Budget Created',
        text: 'Your budget has been created successfully!',
        confirmButtonColor: '#111318',
      })
    } else {
      setErrors(data.errors || 'Budget Creation failed')
    }
  }

  const usedColors = [
    ...new Set(budgets.map((b) => b.color?.trim().toLowerCase())),
  ]

  const totalSpent = budgets.reduce((sum, b) => sum + Number(b.spent || 0), 0)

  const totalLimit = budgets.reduce((sum, b) => sum + Number(b.max || 0), 0)

  return (
    <div className="budgets-page">
      <div className="budgets-header">
        <h1>Budgets</h1>
        <button className="add-budget-btn" onClick={handleClickOpen}>
          + Add New Budget
        </button>
      </div>

      <div className="budgets-grid">
        <div className="budget-summary-card">
          <div className="donut-wrapper">
            <div className="donut">
              <div className="donut-center">
                <h2>${totalSpent.toFixed(2)}</h2>
                <p>of ${totalLimit.toFixed(2)} limit</p>
              </div>
            </div>
          </div>

          <h3>Spending Summary</h3>

          <ul className="summary-list">
            {budgets.map((b) => (
              <li key={b.id}>
                <span className={`bar ${b.color}`}></span>
                <span className="label">{b.title}</span>
                <span className="value">
                  <strong>${Number(b.spent).toFixed(2)}</strong>{' '}
                  <em>of ${Number(b.max).toFixed(2)}</em>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="budget-categories">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              title={budget.title}
              color={budget.color}
              max={`$${Number(budget.max).toFixed(2)}`}
              spent={`$${Number(budget.spent).toFixed(2)}`}
              remaining={`$${(Number(budget.max) - Number(budget.spent)).toFixed(2)}`}
              onEdit={() => {
                setSelectedBudget(budget)
                setEditOpen(true)
              }}
              onDelete={() => {
                setSelectedBudget(budget)
                setDeleteOpen(true)
              }}
            />
          ))}
        </div>
      </div>

      {/* ===== ADD BUDGET MODAL ===== */}
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
        <div className="budget-modal">
          <div className="budget-modal-header">
            <h3>Add New Budget</h3>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>

          <p className="budget-modal-desc">
            Choose a category to set a spending budget. These categories can
            help you monitor spending.
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
            <form className="budget-form" onSubmit={handleSubmit} noValidate>
              <label>Budget Category</label>
              <TextField
                select
                fullWidth
                size="small"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORY_OPTIONS.map((o) => (
                  <MenuItem key={o.value} value={o.value}>
                    {o.label}
                  </MenuItem>
                ))}
              </TextField>

              <label>Maximum Spending</label>
              <TextField
                fullWidth
                size="small"
                type="number"
                placeholder="2000"
                value={form.limit}
                onChange={(e) => setForm({ ...form, limit: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />

              <label>Theme</label>
              <TextField
                select
                fullWidth
                size="small"
                value={form.theme}
                onChange={(e) => setForm({ ...form, theme: e.target.value })}
              >
                {COLOR_OPTIONS.map((option) => {
                  const isUsed = usedColors.includes(option.value.toLowerCase())

                  return (
                    <MenuItem
                      key={option.value}
                      value={option.value}
                      disabled={isUsed}
                      sx={{
                        opacity: isUsed ? 0.5 : 1,
                        cursor: isUsed ? 'not-allowed' : 'pointer',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                          }}
                        >
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              backgroundColor: option.color,
                            }}
                          />
                          <Typography fontSize={14}>{option.label}</Typography>
                        </Box>

                        {isUsed ? (
                          <Typography fontSize={12} color="text.secondary">
                            Already used
                          </Typography>
                        ) : (
                          form.theme === option.value && (
                            <CheckIcon
                              fontSize="small"
                              sx={{ color: '#1f7a6d' }}
                            />
                          )
                        )}
                      </Box>
                    </MenuItem>
                  )
                })}
              </TextField>

              <Button
                type="submit"
                variant="contained"
                className="submit-budget-btn"
                fullWidth
                sx={{
                  textTransform: 'none',
                }}
              >
                Add Budget
              </Button>
            </form>
          </DialogContent>
        </div>
      </Dialog>

      {/* ===== EDIT BUDGET MODAL ===== */}
      <Dialog
        open={editOpen}
        onClose={(event, reason) => {
          if (reason === 'backdropClick') return
          setEditOpen(false)
        }}
        maxWidth="sm"
        fullWidth
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(2px)',
          },
        }}
        PaperProps={{
          sx: {
            borderRadius: '14px',
            padding: '10px',
          },
        }}
      >
        <div className="budget-modal">
          <div className="budget-modal-header">
            <h3>Edit Budget</h3>
            <IconButton onClick={() => setEditOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>

          <p className="budget-modal-desc">
            As your budgets change, feel free to update your spending limits.
          </p>

          <DialogContent>
            <div className="budget-form">
              <label>Budget Category</label>
              <TextField
                select
                fullWidth
                size="small"
                value={form?.category || ''}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORY_OPTIONS.map((o) => (
                  <MenuItem key={o.value} value={o.value}>
                    {o.label}
                  </MenuItem>
                ))}
              </TextField>

              <label>Maximum Spending</label>
              <TextField
                fullWidth
                size="small"
                type="number"
                value={form?.limit || ''}
                onChange={(e) => setForm({ ...form, limit: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />

              <label>Color Tag</label>
              <TextField
                select
                fullWidth
                size="small"
                value={form?.theme || ''}
                onChange={(e) => setForm({ ...form, theme: e.target.value })}
              >
                {COLOR_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
                      >
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: option.color,
                          }}
                        />
                        <Typography fontSize={14}>{option.label}</Typography>
                      </Box>

                      {form.theme === option.value && (
                        <CheckIcon fontSize="small" sx={{ color: '#1f7a6d' }} />
                      )}
                    </Box>
                  </MenuItem>
                ))}
              </TextField>

              <Button
                variant="contained"
                className="submit-budget-btn"
                fullWidth
                sx={{
                  textTransform: 'none',
                }}
              >
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </div>
      </Dialog>

      {/* ================= DELETE MODAL ================= */}
      <Dialog
        open={deleteOpen}
        onClose={(event, reason) => {
          if (reason === 'backdropClick') return
          setDeleteOpen(false)
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
            borderRadius: '14px',
          },
        }}
      >
        <div className="budget-modal">
          <div className="budget-delete-modal-header">
            <h2>Delete ‘{selectedBudget?.title}’?</h2>
            <IconButton onClick={() => setDeleteOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>

          <p className="budget-delete-modal-desc">
            Are you sure you want to delete this budget? This action cannot be
            reversed, and all the data inside it will be removed forever. Yes,
            Confirm Deletion
          </p>

          <DialogContent>
            <div className="budget-delete-form">
              <Button
                fullWidth
                sx={{
                  background: '#c0392b',
                  color: '#fff',
                  '&:hover': { background: '#a93226' },
                  mt: 2,
                  textTransform: 'none',
                }}
              >
                Yes, Confirm Deletion
              </Button>

              <Button
                fullWidth
                variant="text"
                onClick={() => setDeleteOpen(false)}
                sx={{
                  textTransform: 'none',
                }}
              >
                No, Go Back
              </Button>
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  )
}

function BudgetCard({ title, color, max, spent, remaining, onEdit, onDelete }) {
  const [openMenu, setOpenMenu] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="budget-card">
      <div className="budget-card-header">
        <div className="title">
          <span className={`dot ${color}`}></span>
          {title}
        </div>
        {/* MENU */}
        <div className="menu-wrapper" ref={menuRef}>
          <span className="menu-bar" onClick={() => setOpenMenu(!openMenu)}>
            •••
          </span>

          {openMenu && (
            <div className="menu-dropdown">
              <div className="menu-item" onClick={onEdit}>
                ✏️ Edit Budget
              </div>
              <div className="menu-item danger" onClick={onDelete}>
                🗑 Delete Budget
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="max-text">Maximum of {max}</p>

      <div className="progress-bar">
        <div className={`progress-fill ${color}`} />
      </div>

      <div className="budget-stats">
        <div className="stat">
          <span className={`stat-bar ${color}`} />
          <div>
            <p>Spent</p>
            <strong>{spent}</strong>
          </div>
        </div>

        <div className="stat">
          <span className="stat-bar light" />
          <div>
            <p>Remaining</p>
            <strong>{remaining}</strong>
          </div>
        </div>
      </div>

      <div className="latest">
        <div className="latest-header">
          <h4>Latest Spending</h4>
          <span className="see-all">See All ▶</span>
        </div>

        <ul>
          <li>
            <div className="user">
              <img src="https://i.pravatar.cc/40?img=12" alt="" />
              <span>James Thompson</span>
            </div>

            <div className="amount-date">
              <strong>- $5.00</strong>
              <small>11 Aug 2024</small>
            </div>
          </li>

          <li>
            <div className="user">
              <div className="icon purple">✈</div>
              <span>Pixel Playground</span>
            </div>

            <div className="amount-date">
              <strong>- $10.00</strong>
              <small>11 Aug 2024</small>
            </div>
          </li>

          <li>
            <div className="user">
              <img src="https://i.pravatar.cc/40?img=32" alt="" />
              <span>Rina Sato</span>
            </div>

            <div className="amount-date">
              <strong>- $10.00</strong>
              <small>13 Jul 2024</small>
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}
