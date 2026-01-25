/* eslint-disable no-unused-vars */
import '../dashboard/Dashboard.css'

import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [accounts, setAccounts] = useState([])

  useEffect(() => {
    fetch('http://localhost:3000/accounts', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then(setAccounts)
  }, [])

  return (
    <>
      <h1 className="page-title">Overview</h1>

      {/* TOP STATS */}
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

      {/* GRID AREA */}
      <section className="grid">
        {/* LEFT COLUMN */}
        <div className="left-col">
          {/* POTS */}
          {/* POTS */}
          <div className="card-box">
            <div className="card-header">
              <h3>Pots</h3>
              <span className="see-details">
                See Details <span>›</span>
              </span>
            </div>

            <div className="pots-wrapper">
              {/* TOTAL SAVED */}
              <div className="pots-total">
                <div className="pots-icon">💰</div>
                <div>
                  <p className="pots-label">Total Saved</p>
                  <h2 className="pots-amount">$850</h2>
                </div>
              </div>

              {/* POTS LIST */}
              <div className="pots-list">
                <div className="pot-item">
                  <span className="pot-bar green"></span>
                  <div>
                    <p>Savings</p>
                    <strong>$159</strong>
                  </div>
                </div>

                <div className="pot-item">
                  <span className="pot-bar blue"></span>
                  <div>
                    <p>Gift</p>
                    <strong>$40</strong>
                  </div>
                </div>

                <div className="pot-item">
                  <span className="pot-bar purple"></span>
                  <div>
                    <p>Concert Ticket</p>
                    <strong>$110</strong>
                  </div>
                </div>

                <div className="pot-item">
                  <span className="pot-bar orange"></span>
                  <div>
                    <p>New Laptop</p>
                    <strong>$10</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TRANSACTIONS */}
          <div className="card-box">
            <div className="card-header">
              <h3>Transactions</h3>
              <span>View All →</span>
            </div>

            <ul className="transactions">
              <li>
                <span>Emma Richardson</span>
                <strong className="plus">+ $75.50</strong>
              </li>
              <li>
                <span>Savory Bites Bistro</span>
                <strong className="minus">- $55.50</strong>
              </li>
              <li>
                <span>Daniel Carter</span>
                <strong className="minus">- $42.30</strong>
              </li>
              <li>
                <span>Sun Park</span>
                <strong className="plus">+ $120.00</strong>
              </li>
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="right-col">
          {/* BUDGETS */}
          <div className="card-box">
            <div className="card-header">
              <h3>Budgets</h3>
              <span className="see-details">See Details →</span>
            </div>

            <div className="budget-chart-wrapper">
              <svg
                className="budget-chart"
                viewBox="0 0 120 120"
                width="220"
                height="220"
              >
                {/* Background ring */}
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  fill="none"
                  stroke="#f1ede8"
                  strokeWidth="12"
                />

                {/* Entertainment */}
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  fill="none"
                  stroke="#1f7a6d"
                  strokeWidth="12"
                  strokeDasharray="28 255"
                  strokeDashoffset="0"
                />

                {/* Bills */}
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  fill="none"
                  stroke="#7ccad6"
                  strokeWidth="12"
                  strokeDasharray="140 255"
                  strokeDashoffset="-28"
                />

                {/* Dining Out */}
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  fill="none"
                  stroke="#f2b880"
                  strokeWidth="12"
                  strokeDasharray="30 255"
                  strokeDashoffset="-168"
                />

                {/* Personal Care */}
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  fill="none"
                  stroke="#6b7280"
                  strokeWidth="12"
                  strokeDasharray="40 255"
                  strokeDashoffset="-198"
                />
              </svg>

              {/* CENTER TEXT */}
              <div className="budget-center">
                <h2>$338</h2>
                <p>of $975 limit</p>
              </div>
            </div>

            <ul className="budget-list">
              <li>
                <span className="dot green"></span>
                <span>Entertainment</span>
                <strong>$50.00</strong>
              </li>
              <li>
                <span className="dot blue"></span>
                <span>Bills</span>
                <strong>$750.00</strong>
              </li>
              <li>
                <span className="dot orange"></span>
                <span>Dining Out</span>
                <strong>$75.00</strong>
              </li>
              <li>
                <span className="dot purple"></span>
                <span>Personal Care</span>
                <strong>$100.00</strong>
              </li>
            </ul>
          </div>

          {/* RECURRING BILLS */}
          <div className="card-box">
            <div className="card-header">
              <h3>Recurring Bills</h3>
              <span>See Details →</span>
            </div>

            <ul className="bills">
              <li>
                <span>Paid Bills</span>
                <strong>$190.00</strong>
              </li>
              <li>
                <span>Total Upcoming</span>
                <strong>$194.98</strong>
              </li>
              <li>
                <span>Due Soon</span>
                <strong>$59.98</strong>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
