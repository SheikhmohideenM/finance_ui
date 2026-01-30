/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import '../transactions/Transactions.css'

import { React, useEffect, useRef, useState } from 'react'

import dayjs from 'dayjs'
// import { CiEdit } from 'react-icons/ci'
import { FaUndo } from 'react-icons/fa'
import { MdOutlineAutoDelete } from 'react-icons/md'
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
  const sortRef = useRef(null)

  const [sortOpen, setSortOpen] = useState(false)
  const [sortValue, setSortValue] = useState('Latest')
  const [sortCategoryOpen, setSortCategoryOpen] = useState(false)
  const [sortCategoryValue, setSortCategoryValue] = useState('All Transactions')

  const [selectedTx, setSelectedTx] = useState(null)

  const [selectedCategory, setSelectedCategory] = useState('All Transactions')
  const [selectedTransaction, setSelectedTransaction] = useState('null')

  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [undoOpen, setUndoOpen] = useState(false)

  const fetchTransactions = async () => {
    const data = await ApiService.fetchTransactionLists()
    setTransactions(data)
  }

  const fetchBudgets = async () => {
    const data = await ApiService.fetchBudgetLists()
    setBudgets(data)
  }

  useEffect(() => {
    fetchTransactions()
    fetchBudgets()
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

  const categoryOptions = [
    'All Transactions',
    ...new Set(budgets.map((b) => b.category)),
  ]

  const filteredTransactions =
    selectedCategory === 'All Transactions'
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
  const itemsPerPage = 5
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

  const canModify = (tx) => dayjs().diff(dayjs(tx.created_at), 'hour') <= 24

  useEffect(() => {
    if (selectedBudget) {
      setForm((prev) => ({
        ...prev,
        amount: selectedBudget.remaining,
      }))
    }
  }, [form.budget_id])

  const [errors, setErrors] = useState([])

  useEffect(() => {
    if (editOpen && selectedTx) {
      setForm({
        amount: selectedTx.amount,
        description: selectedTx.description,
        date: selectedTx.date,
        budget_id: selectedTx.budget_id || '',
      })
    }
  }, [editOpen])

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
      fetchTransactions()

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
  const handleUpdate = async () => {
    try {
      await ApiService.updateTransaction(selectedTx.id, {
        ...form,
        amount: Number(form.amount),
      })

      setEditOpen(false)
      fetchTransactions()

      Swal.fire({
        icon: 'success',
        title: 'Transaction Updated',
        confirmButtonColor: '#111318',
      })
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Edit not allowed',
        text: 'Editing allowed only within 24 hours',
      })
    }
  }
  const handleDelete = async () => {
    try {
      await ApiService.deleteTransaction(selectedTx.id)
      setDeleteOpen(false)
      fetchTransactions()

      Swal.fire({
        icon: 'success',
        title: 'Transaction Deleted',
        confirmButtonColor: '#111318',
      })
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Delete not allowed',
        text: 'Delete allowed only within 24 hours',
      })
    }
  }

  const handleUndo = async () => {
    try {
      await ApiService.undoTransaction(selectedTx.id)
      setUndoOpen(false)
      fetchTransactions()

      Swal.fire({
        icon: 'success',
        title: 'Transaction Undone',
        confirmButtonColor: '#111318',
      })
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Undo not allowed',
        text: 'Undo allowed only within 24 hours',
      })
    }
  }

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
          <input className="search-input" placeholder="Search transaction" />

          <div className="filters-actions">
            <div className="sort-wrapper" ref={sortRef}>
              <span className="sort-label">Sort by</span>
              <button
                className="sort-btn"
                onClick={() => setSortOpen((o) => !o)}
              >
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

            <div className="sort-wrapper">
              <span className="sort-label">Category</span>

              <button
                className="sort-btn"
                onClick={() => setSortCategoryOpen((o) => !o)}
              >
                {sortCategoryValue} ▾
              </button>

              {sortCategoryOpen && (
                <div className="sort-menu">
                  {categoryOptions.map((c) => (
                    <div
                      key={c}
                      className={`sort-item ${
                        c === sortCategoryValue ? 'active' : ''
                      }`}
                      onClick={() => {
                        setSortCategoryValue(c)
                        setSelectedCategory(c)
                        setCurrentPage(1)
                        setSortCategoryOpen(false)
                      }}
                    >
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="table-header">
          <span>Recipient / Sender</span>
          <span>Category</span>
          <span>Transaction Date</span>
          <span className="amount-col">Amount</span>
          <span className="amount-col-action">Actions</span>
        </div>

        {currentData.map((tx) => {
          const isDisabled = tx.undone === true

          return (
            <div
              className={`table-row ${isDisabled ? 'row-disabled' : ''}`}
              key={tx.id}
            >
              <span className="name">
                <span className="avatar">{tx.user_name?.charAt(0)}</span>
                {tx.user_name}
              </span>
              <span>{tx.category || 'Uncategorized'}</span>
              <span>{dayjs(tx.date).format('DD MMM YYYY')}</span>

              <span className={`amount ${tx.amount > 0 ? 'plus' : 'minus'}`}>
                {tx.amount > 0 ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                {tx.undone && <small className="undone-badge">UNDONE</small>}
              </span>

              <div className="tx-actions">
                {/* <a
                disabled={!canModify(tx)}
                onClick={() => {
                  setSelectedTx(tx)
                  setEditOpen(true)
                }}
              >
                <CiEdit />
              </a> */}

                <a
                  disabled={isDisabled || !canModify(tx)}
                  onClick={() => {
                    setSelectedTx(tx)
                    setDeleteOpen(true)
                  }}
                >
                  <MdOutlineAutoDelete />
                </a>

                <a
                  disabled={isDisabled || !canModify(tx)}
                  onClick={() => {
                    setSelectedTx(tx)
                    setUndoOpen(true)
                  }}
                >
                  <FaUndo />
                </a>
              </div>
            </div>
          )
        })}

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
            width: { xs: '90%', sm: '580px' },
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

      {/* ===== DELETE BUDGET MODAL ===== */}
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
        <div className="transaction-modal">
          <div className="transaction-delete-modal-header">
            <h2>Delete ‘{selectedTransaction?.title}’?</h2>
            <IconButton onClick={() => setDeleteOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>

          <p className="transaction-delete-modal-desc">
            Are you sure you want to delete this Transaction? This action cannot
            be reversed, and all the data inside it will be removed forever.
          </p>

          <DialogContent>
            <div className="transaction-delete-form">
              <Button
                fullWidth
                onClick={handleDelete}
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

      {/* ===== UNDO TRANSACTION MODAL ===== */}
      <Dialog
        open={undoOpen}
        onClose={(event, reason) => {
          if (reason === 'backdropClick') return
          setUndoOpen(false)
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
        <div className="transaction-modal">
          <div className="transaction-delete-modal-header">
            <h2>Undo ‘{selectedTransaction?.category}’?</h2>
            <IconButton onClick={() => setUndoOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>

          <p className="transaction-delete-modal-desc">
            This will revert account and budget amounts.
          </p>

          <DialogContent>
            <div className="transaction-delete-form">
              <Button
                fullWidth
                onClick={handleUndo}
                sx={{
                  background: '#c0392b',
                  color: '#fff',
                  '&:hover': { background: '#a93226' },
                  mt: 2,
                  textTransform: 'none',
                }}
              >
                Yes, Confirm Undo
              </Button>

              <Button
                fullWidth
                variant="text"
                onClick={() => setUndoOpen(false)}
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

      {/* <Dialog open={undoOpen} onClose={() => setUndoOpen(false)}>
        <DialogContent>
          <h3>Undo Transaction</h3>
          <p>This will revert account and budget amounts.</p>

          <Button
            variant="contained"
            onClick={async () => {
              try {
                await ApiService.undoTransaction(selectedTx.id)
                fetchTransactions()
                setUndoOpen(false)

                Swal.fire({
                  icon: 'success',
                  title: 'Transaction Undone',
                  confirmButtonColor: '#111318',
                })
              } catch {
                Swal.fire({
                  icon: 'error',
                  title: 'Undo not allowed',
                  text: 'Undo allowed only within 24 hours',
                })
              }
            }}
          >
            Confirm Undo
          </Button>
        </DialogContent>
      </Dialog> */}
    </div>
  )
}
