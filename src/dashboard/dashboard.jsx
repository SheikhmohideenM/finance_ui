/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import '../dashboard/Dashboard.css'

import { React, useEffect, useState } from 'react'

import dayjs from 'dayjs'
import { NavLink, useNavigate } from 'react-router-dom'

import Tooltip from '@mui/material/Tooltip'

import ApiService from '../services/ApiService'

export default function Dashboard() {
  const [budgets, setBudgets] = useState([])
  const [pots, setPots] = useState([])
  const [transactions, setTransactions] = useState([])
  const [bills, setBills] = useState([])
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const hasBudgets =
    budgets.length > 0 && budgets.some((b) => Number(b.max || 0) > 0)

  const getColorHex = (color) => {
    const map = {
      green: '#1f7a6d',
      yellow: '#f2c94c',
      cyan: '#56ccf2',
      navy: '#1f2a44',
      red: '#eb5757',
      purple: '#9b51e0',
      turquoise: '#2dd4bf',
      brown: '#8d6e63',
      magenta: '#d63384',
      blue: '#2f80ed',
      navyGrey: '#6b7280',
      armyGreen: '#6b8e23',
      pink: '#f472b6',
      gold: '#d4af37',
      orange: '#f2994a',
    }

    return map[color] || '#ccc'
  }

  const getDonutSlices = (budgets) => {
    const total = budgets.reduce((s, b) => s + Number(b.max || 0), 0)
    let startAngle = 0

    return budgets.map((b) => {
      const value = Number(b.max || 0)
      const angle = total ? (value / total) * 360 : 0

      const slice = {
        startAngle,
        endAngle: startAngle + angle,
        color: getColorHex(b.color),
        title: b.title,
        amount: value,
        isFullCircle: angle >= 359.99,
      }

      startAngle += angle
      return slice
    })
  }

  const polarToCartesian = (cx, cy, r, angle) => {
    const rad = ((angle - 90) * Math.PI) / 180
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    }
  }

  const describeArc = (cx, cy, r, startAngle, endAngle) => {
    const start = polarToCartesian(cx, cy, r, endAngle)
    const end = polarToCartesian(cx, cy, r, startAngle)
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0

    return `
      M ${start.x} ${start.y}
      A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}
    `
  }

  const fetchBudgetLists = async () => {
    try {
      const data = await ApiService.fetchBudgetLists()
      setBudgets(data)
    } catch (error) {
      setError('Failed to load budget lists')
    }
  }

  const fetchPotLists = async () => {
    try {
      const data = await ApiService.fetchPotsLists()
      setPots(data)
    } catch (error) {
      setError('Failed to load pots lists')
    }
  }

  const fetchTransactionLists = async () => {
    try {
      const data = await ApiService.fetchTransactionLists()
      setTransactions(data)
    } catch (error) {
      setError('Failed to load budget lists')
    }
  }

  const fetchRecurringBillsLists = async () => {
    try {
      const data = await ApiService.fetchBillsLists()
      setBills(data)
    } catch (error) {
      setError('Failed to load budget lists')
    }
  }

  useEffect(() => {
    fetchBudgetLists()
    fetchPotLists()
    fetchTransactionLists()
    fetchRecurringBillsLists()
  }, [])

  const totalSpent = budgets.reduce((sum, b) => sum + Number(b.spent || 0), 0)

  const totalLimit = budgets.reduce((sum, b) => sum + Number(b.max || 0), 0)

  const totalSaved = pots.reduce((sum, p) => sum + Number(p.saved || 0), 0)

  const totalTarget = pots.reduce((sum, p) => sum + Number(p.target || 0), 0)

  const totalRemaining = totalTarget - totalSaved

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

  const sumAmount = (arr) =>
    arr.reduce((sum, b) => sum + Number(b.amount || 0), 0)

  const paidAmount = sumAmount(paidBills)
  const upcomingAmount = sumAmount(upcomingBills)
  const dueAmount = sumAmount(dueBills)

  return (
    <>
      <div className="dashboard-page">
        <h1 className="page-title">Overview</h1>

        <section className="cards">
          <div className="stat-card dark">
            <p>Current Balance</p>
            <h2>$4,836.00</h2>
          </div>
          <div className="stat-card">
            <p>Income</p>
            <h2>$3,814.25</h2>
          </div>
          <div className="stat-card">
            <p>Expenses</p>
            <h2>$1,700.50</h2>
          </div>
        </section>

        <section className="grid">
          <div className="left-col">
            <div className="card-box">
              <div className="card-header">
                <h3>Pots</h3>
                <NavLink to="/pots" className="see-details">
                  See Details <span>›</span>
                </NavLink>
              </div>

              <div className="pots-wrapper">
                <div className="pots-total">
                  <div className="pots-icon">💰</div>
                  <div>
                    <p className="pots-label">Total Saved</p>
                    <h2 className="pots-amount">
                      ${totalRemaining.toFixed(2)}
                    </h2>
                  </div>
                </div>

                <div className="pots-list">
                  {pots.slice(0, 4).map((pot) => (
                    <div className="pot-item" key={pot.id}>
                      <span className={`pot-bar ${pot.color}`}></span>
                      <div>
                        <p>{pot.title}</p>
                        <strong>${Number(pot.saved).toFixed(2)}</strong>
                      </div>
                    </div>
                  ))}

                  {/* Optional empty state */}
                  {pots.length === 0 && (
                    <p style={{ color: '#777', fontSize: '14px' }}>
                      No pots created yet
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="card-box">
              <div className="card-header">
                <h3>Transactions</h3>
                <NavLink to="/transactions" className="see-details">
                  View All <span>›</span>
                </NavLink>
              </div>

              <ul className="transactions-list">
                {transactions.slice(0, 5).map((tx) => {
                  const isPlus = tx.amount > 0
                  const firstLetter = tx.user_name?.charAt(0).toUpperCase()

                  return (
                    <li className="transaction-item" key={tx.id}>
                      <div className="tx-left">
                        {tx.avatar_url ? (
                          <img
                            src={tx.avatar_url}
                            alt={tx.user_name}
                            className="tx-avatar"
                          />
                        ) : (
                          <div className="tx-avatar circle gold">
                            {firstLetter}
                          </div>
                        )}

                        <span className="tx-name">{tx.user_name}</span>
                      </div>

                      <div className="tx-right">
                        <span
                          className={`tx-amount ${isPlus ? 'plus' : 'minus'}`}
                        >
                          {isPlus ? '+' : '-'} ${Math.abs(tx.amount).toFixed(2)}
                        </span>

                        <span className="tx-date">
                          {dayjs(tx.date).format('DD MMM YYYY')}
                        </span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>

          <div className="right-col">
            <div className="card-box">
              <div className="card-header">
                <h3>Budgets</h3>
                <NavLink to="/budgets" className="see-details">
                  See Details <span>›</span>
                </NavLink>
              </div>

              <div className="budget-content">
                <div className="donut-wrapper-dashboard">
                  <svg width="160" height="160" viewBox="0 0 160 160">
                    {hasBudgets &&
                      getDonutSlices(budgets).map((slice, i) =>
                        slice.isFullCircle ? (
                          <Tooltip
                            key={i}
                            arrow
                            title={`${slice.title}: $${slice.amount.toFixed(2)}`}
                          >
                            <circle
                              cx="80"
                              cy="80"
                              r="70"
                              stroke={slice.color}
                              strokeWidth="18"
                              fill="none"
                            />
                          </Tooltip>
                        ) : (
                          <Tooltip
                            key={i}
                            arrow
                            title={`${slice.title}: $${slice.amount.toFixed(2)}`}
                          >
                            <path
                              d={describeArc(
                                80,
                                80,
                                70,
                                slice.startAngle,
                                slice.endAngle,
                              )}
                              stroke={slice.color}
                              strokeWidth="18"
                              fill="none"
                              style={{ cursor: 'pointer' }}
                            />
                          </Tooltip>
                        ),
                      )}

                    <circle cx="80" cy="80" r="52" fill="#fff" />

                    <text
                      x="80"
                      y="75"
                      textAnchor="middle"
                      fontSize="16"
                      fontWeight="600"
                    >
                      ${totalSpent.toFixed(0)}
                    </text>
                    <text
                      x="80"
                      y="95"
                      textAnchor="middle"
                      fontSize="11"
                      fill="#777"
                    >
                      of ${totalLimit.toFixed(0)}
                    </text>
                  </svg>
                </div>

                <div className="summary-wrapper">
                  <ul className="summary-list-dashboard">
                    {budgets.slice(0, 4).map((b) => (
                      <li key={b.id}>
                        <span className={`bar ${b.color}`}></span>
                        <span className="budgetLabel">{b.title}</span>
                        <span className="value">
                          <strong>${Number(b.spent).toFixed(2)}</strong>{' '}
                          {/* <em>of ${Number(b.max).toFixed(2)}</em> */}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="card-box">
              <div className="card-header">
                <h3>Recurring Bills</h3>
                <NavLink to="/recurring_bills" className="see-details">
                  See Details <span>›</span>
                </NavLink>
              </div>

              <ul className="bills-list">
                <li className="bill-item paid">
                  <span className="bill-label">Paid Bills</span>
                  <strong className="bill-amount">
                    ${paidAmount.toFixed(2)}
                  </strong>
                </li>

                <li className="bill-item upcoming">
                  <span className="bill-label">Total Upcoming</span>
                  <strong className="bill-amount">
                    ${upcomingAmount.toFixed(2)}
                  </strong>
                </li>

                <li className="bill-item due">
                  <span className="bill-label">Due Soon</span>
                  <strong className="bill-amount">
                    ${dueAmount.toFixed(2)}
                  </strong>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
