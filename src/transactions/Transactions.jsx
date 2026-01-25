/* eslint-disable react-hooks/set-state-in-effect */
import '../transactions/Transactions.css'

import { useEffect, useState } from 'react'

const MOCK_TRANSACTIONS = [
  {
    name: 'Emma Richardson',
    category: 'General',
    date: '19 Aug 2024',
    amount: 75.5,
  },
  {
    name: 'Savory Bites Bistro',
    category: 'Dining Out',
    date: '19 Aug 2024',
    amount: -55.5,
  },
  {
    name: 'Daniel Carter',
    category: 'General',
    date: '18 Aug 2024',
    amount: -42.3,
  },
  { name: 'Sun Park', category: 'General', date: '17 Aug 2024', amount: 120 },
  {
    name: 'Urban Services Hub',
    category: 'General',
    date: '17 Aug 2024',
    amount: -65,
  },
  {
    name: 'Liam Hughes',
    category: 'Groceries',
    date: '15 Aug 2024',
    amount: 65.75,
  },
  {
    name: 'Lily Ramirez',
    category: 'General',
    date: '14 Aug 2024',
    amount: 50,
  },
  {
    name: 'Ethan Clark',
    category: 'Dining Out',
    date: '13 Aug 2024',
    amount: -32.5,
  },
  {
    name: 'James Thompson',
    category: 'Entertainment',
    date: '11 Aug 2024',
    amount: -5,
  },
  {
    name: 'Pixel Playground',
    category: 'Entertainment',
    date: '11 Aug 2024',
    amount: -10,
  },
]

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 5
  const totalPages = Math.ceil(transactions.length / itemsPerPage)

  useEffect(() => {
    // Replace later with Rails API
    setTransactions(MOCK_TRANSACTIONS)
  }, [])

  const start = (currentPage - 1) * itemsPerPage
  const currentData = transactions.slice(start, start + itemsPerPage)

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  const getPages = () => {
    const pages = []
    for (let i = 1; i <= totalPages; i++) pages.push(i)
    return pages
  }

  return (
    <>
      <div className="transactions-page">
        <h1 className="page-title">Transactions</h1>

        <div className="table-card">
          {/* FILTER BAR */}
          <div className="table-filters">
            <input placeholder="Search transaction" />

            <div className="filters-right">
              <span className="dropdownStyle">Sort by</span>
              <select>
                <option>Latest</option>
                <option>Oldest</option>
              </select>
              <span className="dropdownStyle">Category</span>
              <select>
                <option>All Transactions</option>
                <option>Income</option>
                <option>Expense</option>
              </select>
            </div>
          </div>

          {/* TABLE HEADER */}
          <div className="table-header">
            <span>Recipient / Sender</span>
            <span>Category</span>
            <span>Transaction Date</span>
            <span className="amount-col">Amount</span>
          </div>

          {/* TABLE ROWS */}
          {currentData.map((tx, i) => (
            <div className="table-row" key={i}>
              <span className="name" data-label="Recipient">
                <span className="avatar">{tx.name[0]}</span>
                {tx.name}
              </span>

              <span data-label="Category">{tx.category}</span>
              <span data-label="Date">{tx.date}</span>

              <span
                data-label="Amount"
                className={`amount ${tx.amount > 0 ? 'plus' : 'minus'}`}
              >
                {tx.amount > 0 ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
              </span>
            </div>
          ))}

          {/* PAGINATION */}
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
      </div>
    </>
  )
}
