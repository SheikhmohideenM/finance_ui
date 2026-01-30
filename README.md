
                💰 Personal Finance Management App

    A full-stack personal finance application that helps users **track transactions, manage budgets, save using pots, and automate recurring bills**.

    Built with **React (Frontend)** and **Ruby on Rails (API Backend)**, with **Sidekiq + Redis** for background automation.



                🚀 Tech Stack

### Frontend

* React (Vite)
* Axios
* Material UI
* SweetAlert2
* CSS (Custom responsive UI)

### Backend

* Ruby on Rails (API mode)
* PostgreSQL
* Sidekiq 8
* Redis 7
* Sidekiq-Cron
* Session-based Authentication


                🔐 Authentication Flow

### 1. Signup

* User registers with email & password
* Passwords are securely hashed
* User record created

### 2. Login

* Session-based login
* `session[:user_id]` stored
* CSRF-safe cookies enabled for React

### 3. Logout

* Session cleared
* User redirected to login


                🧭 Application Navigation (Frontend)

### Pages

* Login
* Signup
* Dashboard
* Transactions
* Budgets
* Pots
* Recurring Bills

### Side Navigation

* Dashboard
* Transactions
* Budgets
* Pots
* Recurring Bills
* Logout


                📊 Dashboard (Overview)

The dashboard gives a **quick financial snapshot**:

### Displays:

* Current balance
* Total income
* Total expenses
* Budget usage donut chart
* Pots summary
* Recent transactions
* Upcoming recurring bills

📌 **All data is user-specific**


                💸 Transactions (CRUD)

### Use Case

Users record **income and expenses** linked to accounts and budgets.

### Features

* Create transaction (income or expense)
* Update transaction
* Delete transaction
* Filter by:

  * Date range
  * Category
  * Budget

### Business Logic

* Account balance updates automatically
* Expense transactions:

  * Reduce account balance
  * Increase budget `spent`
* Budget overspending is prevented


                📁 Budgets (CRUD)

### Use Case

Users create budgets per spending category.

### Budget Fields

* Category (Entertainment, Bills, Food, etc.)
* Max limit
* Color theme

### Features

* Create / Update / Delete budgets
* Remaining amount auto-calculated
* Prevent duplicate category budgets per user
* Prevent color reuse

### Logic

```
remaining = max - spent
```


                Pots (Savings Goals)

### Use Case

Users create savings pots separate from their main balance.

### Features

* Create pots with target amount
* Add money to pot
* Withdraw money from pot
* Edit / Delete pots

### Business Rules

* Adding money:

  * Deducts from main account
  * Increases pot saved amount
* Withdrawing money:

  * Adds back to main account
  * Decreases pot saved amount



                🔁 Recurring Bills (Auto Transactions)

### Use Case

Automate recurring expenses like:

* Electricity bill
* Rent
* Internet
* Subscriptions

### Fields

* Name
* Amount
* Frequency (weekly / monthly / yearly)
* Next run date
* Auto-pay flag
* Linked account
* Optional linked budget


                ⚙️ Recurring Bill Automation

### How It Works

* Sidekiq-Cron runs a job daily
* Finds due recurring bills
* Auto-creates transactions
* Updates:

  * Account balance
  * Budget spent
* Advances next run date

### Example Flow

```
Electricity Bill
₹250
Monthly
Next run: Feb 1

→ Auto transaction created
→ Account balance -250
→ Budget spent +250
→ Next run → Mar 1
```

                🧵 Background Jobs (Sidekiq)

### Job: `RecurringBillRunner`

* Runs via cron
* Idempotent & transactional
* Prevents partial updates

### Why Sidekiq?

* Non-blocking
* Scalable
* Reliable background execution


                🔐 Security & Data Isolation

* All records scoped to `current_user`
* Users **cannot access other users’ data (hard enforced)**
* CSRF protection enabled
* Cookies used safely for React


                🧪 Error Handling

### Backend

* Validation errors returned as JSON
* Database transactions used everywhere money changes

### Frontend

* Centralized API service
* SweetAlert success & error feedback
* Optimistic UI updates (where safe)


                📂 Project Structure

### Frontend

```
src/
 ├─ components/
 │   ├─ login
 │   ├─ protected
 │   ├─ signup
 ├─ layout/
 │   ├─ Budgets
 │   ├─ Pots
 │   ├─ RecurringBills 
 ├─ dashboard
 ├─ transactions
 ├─ shared/
 │   ├─ SideNav
 ├─ services/
 │   └─ ApiService.jsx
 └─ pages/
```

### Backend

```
app/
 ├─ controllers/api/v1/
 ├─ models/
 ├─ jobs/
 └─ services/
```

                 ▶️ Running the App

### Backend

```bash
bundle install
rails db:create db:migrate
redis-server
bundle exec sidekiq
rails s
```

### Frontend

```bash
npm install
npm run dev
```

