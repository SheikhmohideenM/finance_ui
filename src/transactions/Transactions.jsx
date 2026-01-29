/* eslint-disable no-unused-vars */
import '../transactions/Transactions.css'

import { useEffect, useRef, useState } from 'react'

import dayjs from 'dayjs'

import ApiService from '../services/ApiService'

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [budgets, setBudgets] = useState([])
  const [error, setError] = useState(null)

  const [sortOpen, setSortOpen] = useState(false)
  const [sortValue, setSortValue] = useState('Latest')
  const sortRef = useRef(null)

  const [selectedCategory, setSelectedCategory] = useState('All')

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

  return (
    <div className="transactions-page">
      <h1 className="page-title">Transactions</h1>

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
          <span>Recipient</span>
          <span>Category</span>
          <span>Date</span>
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
    </div>
  )
}
