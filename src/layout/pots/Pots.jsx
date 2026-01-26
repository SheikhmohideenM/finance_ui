/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import '../pots/Pots.css'

import { React, useEffect, useRef, useState } from 'react'

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

export default function Pots() {
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const [selectedPot, setSelectedPot] = useState(null)

  const [form, setForm] = useState({
    name: '',
    limit: '',
    theme: 'green',
  })

  const handleClickOpen = () => {
    setOpen(true)
  }

  const pots = [
    {
      title: 'Savings',
      color: 'green',
      saved: 159,
      target: 2000,
      percent: 7.95,
    },
    {
      title: 'Concert Ticket',
      color: 'gray',
      saved: 110,
      target: 150,
      percent: 73.3,
    },
    {
      title: 'Gift',
      color: 'blue',
      saved: 40,
      target: 60,
      percent: 66.6,
    },
    {
      title: 'New Laptop',
      color: 'orange',
      saved: 10,
      target: 1000,
      percent: 1,
    },
    {
      title: 'Holiday',
      color: 'purple',
      saved: 531,
      target: 1440,
      percent: 36.8,
    },
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

  return (
    <div className="pots-page">
      {/* HEADER */}
      <div className="pots-header">
        <h1>Pots</h1>
        <button className="add-pot-btn" onClick={handleClickOpen}>
          + Add New Pot
        </button>
      </div>

      {/* GRID */}
      <div className="pots-grid">
        {pots.map((pot, i) => (
          <PotCard
            key={i}
            {...pot}
            onEdit={() => {
              setSelectedPot(pot)
              setEditOpen(true)
            }}
            onDelete={() => {
              setSelectedPot(pot)
              setDeleteOpen(true)
            }}
          />
        ))}
      </div>

      {/* ===== ADD POT MODAL ===== */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
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
        <div className="pot-modal">
          <div className="pot-modal-header">
            <h3>Add New Pot</h3>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>

          <p className="pot-modal-desc">
            Create a pot to set savings targets. These can help keep you on
            track as you save for special purchases.
          </p>

          <DialogContent>
            <div className="pot-form">
              <label>Pot Name</label>
              <TextField
                fullWidth
                size="small"
                type="text"
                placeholder="Rainy Days"
              />
              <span>0 of 30 Characters Left</span>

              <label>Target</label>
              <TextField
                fullWidth
                size="small"
                type="number"
                placeholder="2000"
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
                className="submit-pot-btn"
                fullWidth
                sx={{
                  textTransform: 'none',
                }}
              >
                Add Pot
              </Button>
            </div>
          </DialogContent>
        </div>
      </Dialog>

      {/* ===== EDIT POT MODAL ===== */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
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
        <div className="pot-modal">
          <div className="pot-modal-header">
            <h3>Edit Pot</h3>
            <IconButton onClick={() => setEditOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>

          <p className="pot-modal-desc">
            If your saving targets change, feel free to update your pots.
          </p>

          <DialogContent>
            <div className="pot-form">
              <label>Pot Name</label>
              <TextField
                fullWidth
                size="small"
                type="text"
                value={form?.name || ''}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              ></TextField>
              <span>0 of 30 Characters Left</span>

              <label>Target</label>
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

              <label>Theme</label>
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
                className="submit-pot-btn"
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

      {/* ===== DELETE POT MODAL ===== */}
      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
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
        <div className="pot-modal">
          <div className="pot-delete-modal-header">
            <h2>Delete ‘{selectedPot?.title}’?</h2>
            <IconButton onClick={() => setDeleteOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>

          <p className="pot-delete-modal-desc">
            Are you sure you want to delete this pot? This action cannot be
            reversed, and all the data inside it will be removed forever.
          </p>

          <DialogContent>
            <div className="pot-delete-form">
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

function PotCard({ title, color, saved, target, percent, onEdit, onDelete }) {
  const [openMenu, setOpenMenu] = useState(false)
  const menuRef = useRef(null)

  const [addMoney, setAddMoney] = useState(false)
  const [withdraw, setWithdraw] = useState(false)

  const handleClickOpenAddMoney = () => {
    setAddMoney(true)
  }

  const handleClickOpenWithdraw = () => {
    setWithdraw(true)
  }

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
    <div className="pot-card">
      {/* CARD HEADER */}
      <div className="pot-card-header">
        <div className="title">
          <span className={`dot ${color}`} />
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
                ✏️ Edit Pots
              </div>
              <div className="menu-item danger" onClick={onDelete}>
                🗑 Delete Pots
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TOTAL */}
      <p className="label">Total Saved</p>
      <h2 className="amount">${saved.toFixed(2)}</h2>

      {/* PROGRESS */}
      <div className="progress-wrapper">
        <div className="progress-bar">
          <div
            className={`progress-fill ${color}`}
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="progress-info">
          <span>{percent}%</span>
          <span>Target of ${target.toLocaleString()}</span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="pot-actions">
        <button className="secondary" onClick={handleClickOpenAddMoney}>
          + Add Money
        </button>
        <button className="secondary" onClick={handleClickOpenWithdraw}>
          Withdraw
        </button>
      </div>

      {/* ===== ADD POT MONEY MODAL ===== */}
      <Dialog
        open={addMoney}
        onClose={() => setAddMoney(false)}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(2px)',
          },
        }}
        PaperProps={{
          sx: {
            width: { xs: '90%', sm: '520px' },
            maxWidth: '520px',
            borderRadius: '14px',
            padding: '10px',
          },
        }}
      >
        <div className="pot-modal">
          {/* HEADER */}
          <div className="pot-modal-header">
            <h3>Add to ‘{title}’</h3>
            <IconButton onClick={() => setAddMoney(false)}>
              <CloseIcon />
            </IconButton>
          </div>

          <p className="pot-modal-desc">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            hendrerit. Pellentesque aliquet nibh nec urna. In nisi neque,
            aliquet.
          </p>

          {/* ===== CURRENT STATUS ===== */}
          <div className="pot-add-summary">
            <div className="pot-add-top">
              <span className="label">New Amount</span>
              <span className="amount">${(saved + 400).toFixed(2)}</span>
            </div>

            <div className="progress-bar">
              <div
                className={`progress-fill ${color}`}
                style={{ width: `${percent}%` }}
              />
            </div>

            <div className="progress-info">
              <span>{percent}%</span>
              <span>Target of ${target.toLocaleString()}</span>
            </div>
          </div>

          <DialogContent>
            {/* ===== ADD AMOUNT ===== */}
            <div className="pot-form">
              <label>Amount to Add</label>
              <TextField
                fullWidth
                size="small"
                type="number"
                placeholder="400"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />

              <Button
                fullWidth
                className="submit-pot-btn"
                sx={{
                  mt: 2,
                  textTransform: 'none',
                }}
                variant="contained"
              >
                Confirm Addition
              </Button>
            </div>
          </DialogContent>
        </div>
      </Dialog>

      {/* ===== WITHDRAW MONEY MODAL ===== */}
      <Dialog
        open={withdraw}
        onClose={() => setWithdraw(false)}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(2px)',
          },
        }}
        PaperProps={{
          sx: {
            width: { xs: '90%', sm: '520px' },
            maxWidth: '520px',
            borderRadius: '14px',
            padding: '10px',
          },
        }}
      >
        <div className="pot-modal">
          {/* HEADER */}
          <div className="pot-modal-header">
            <h3>Withdraw from ‘{title}’</h3>
            <IconButton onClick={() => setWithdraw(false)}>
              <CloseIcon />
            </IconButton>
          </div>

          <p className="pot-modal-desc">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            hendrerit. Pellentesque aliquet nibh nec urna. In nisi neque,
            aliquet.
          </p>

          {/* ===== CURRENT STATUS ===== */}
          <div className="pot-add-summary">
            <div className="pot-add-top">
              <span className="label">New Amount</span>
              <span className="amount">${(saved - 20).toFixed(2)}</span>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill danger"
                style={{ width: `${percent}%` }}
              />
            </div>

            <div className="progress-info">
              <span className="danger-text">{percent}%</span>
              <span>Target of ${target.toLocaleString()}</span>
            </div>
          </div>

          <DialogContent>
            <div className="pot-form">
              <label>Amount to Withdraw</label>
              <TextField
                fullWidth
                size="small"
                type="number"
                placeholder="20"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />

              <Button
                fullWidth
                className="submit-pot-btn danger"
                sx={{ mt: 2, textTransform: 'none' }}
                variant="contained"
              >
                Confirm Withdrawal
              </Button>
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  )
}
