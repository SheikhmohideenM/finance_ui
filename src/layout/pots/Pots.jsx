/* eslint-disable react-hooks/set-state-in-effect */
import '../pots/Pots.css'

const POTS = [
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

export default function Pots() {
  return (
    <div className="pots-page">
      {/* HEADER */}
      <div className="pots-header">
        <h1>Pots</h1>
        <button className="add-pot-btn">+ Add New Pot</button>
      </div>

      {/* GRID */}
      <div className="pots-grid">
        {POTS.map((pot, i) => (
          <PotCard key={i} {...pot} />
        ))}
      </div>
    </div>
  )
}

function PotCard({ title, color, saved, target, percent }) {
  return (
    <div className="pot-card">
      {/* CARD HEADER */}
      <div className="pot-card-header">
        <div className="title">
          <span className={`dot ${color}`} />
          {title}
        </div>
        <span className="menu-bar">•••</span>
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
        <button className="secondary">+ Add Money</button>
        <button className="secondary">Withdraw</button>
      </div>
    </div>
  )
}
