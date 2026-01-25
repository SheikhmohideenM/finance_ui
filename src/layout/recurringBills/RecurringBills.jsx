import '../recurringBills/RecurringBills.css'

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
  return (
    <div className="bills-page">
      <h1 className="page-title">Recurring Bills</h1>

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

              {/* <div className="bill-cycle">{bill.cycle}</div> */}
              <div className={`bill-status ${bill.status}`}>{bill.cycle}</div>

              <div className={`bill-amount ${bill.status}`}>
                ${bill.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
