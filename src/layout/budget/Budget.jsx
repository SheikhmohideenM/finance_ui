import '../budget/Budget.css'

/* eslint-disable react-hooks/set-state-in-effect */
import React from 'react'

import CloseIcon from '@mui/icons-material/Close'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// Styled Dialog
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}))

export default function Budgets() {
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div className="budgets-page">
      {/* HEADER */}
      <div className="budgets-header">
        <h1>Budgets</h1>
        <button className="add-budget-btn" onClick={handleClickOpen}>
          + Add New Budget
        </button>
      </div>

      <div className="budgets-grid">
        {/* LEFT SUMMARY */}
        <div className="budget-summary-card">
          <div className="donut-wrapper">
            <div className="donut">
              <div className="donut-center">
                <h2>$338</h2>
                <p>of $975 limit</p>
              </div>
            </div>
          </div>

          <h3>Spending Summary</h3>

          <ul className="summary-list">
            <li>
              <span className="bar green"></span>
              <span className="label">Entertainment</span>
              <span className="value">
                <strong>$15.00</strong> <em>of $50.00</em>
              </span>
            </li>
            <li>
              <span className="bar blue"></span>
              <span className="label">Bills</span>
              <span className="value">
                <strong>$150.00</strong> <em>of $750.00</em>
              </span>
            </li>
            <li>
              <span className="bar orange"></span>
              <span className="label">Dining Out</span>
              <span className="value">
                <strong>$133.00</strong> <em>of $75.00</em>
              </span>
            </li>
            <li>
              <span className="bar purple"></span>
              <span className="label">Personal Care</span>
              <span className="value">
                <strong>$40.00</strong> <em>of $100.00</em>
              </span>
            </li>
          </ul>
        </div>

        {/* RIGHT COLUMN – Budget Cards */}
        <div className="budget-categories">
          <BudgetCard
            title="Entertainment"
            color="green"
            max="$50.00"
            spent="$15.00"
            remaining="$35.00"
          />
          <BudgetCard
            title="Bills"
            color="blue"
            max="$750.00"
            spent="$150.00"
            remaining="$600.00"
          />
          <BudgetCard
            title="Dining Out"
            color="orange"
            max="$150.00"
            spent="$138.00"
            remaining="$12.00"
          />
          <BudgetCard
            title="Personal Care"
            color="purple"
            max="$50.00"
            spent="$40.00"
            remaining="$10.00"
          />
        </div>
      </div>

      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Add New Budget
        </DialogTitle>

        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent dividers>
          <Typography gutterBottom>
            Create a new budget category with spending limits.
          </Typography>
          <Typography gutterBottom>
            Enter category name, maximum spending limit, and optional
            description.
          </Typography>
          {/* ← Put your form fields (TextField, etc.) here later */}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleClose}>
            Create Budget
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  )
}

function BudgetCard({ title, color, max, spent, remaining }) {
  return (
    <div className="budget-card">
      {/* HEADER */}
      <div className="budget-card-header">
        <div className="title">
          <span className={`dot ${color}`}></span>
          {title}
        </div>
        <span className="menu-bar">•••</span>
      </div>

      <p className="max-text">Maximum of {max}</p>

      {/* PROGRESS */}
      <div className="progress-bar">
        <div className={`progress-fill ${color}`} />
      </div>

      {/* STATS */}
      <div className="budget-stats">
        <div className="stat">
          {/* <span className="stat-bar green" /> */}
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

      {/* LATEST SPENDING */}
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
