# Finance Tracker Backend API

Backend server for the Finance Tracker application built with Node.js, Express, TypeScript, and PostgreSQL.

## 🚀 Server Running

- **Base URL:** `http://localhost:3001`
- **Database:** PostgreSQL (finance_tracker)
- **Status:** ✅ Running

## 📊 Database Schema

### Tables Created:
- **users** - User authentication and profiles
- **categories** - Transaction categories (income/expense)
- **income** - All income records (separate table)
- **expenses** - All expense records (separate table)
- **transactions** - Legacy combined table (still available)
- **budgets** - Budget limits per category
- **savings_goals** - Savings targets and progress

## 🔌 API Endpoints

### Health Check
```
GET /
Response: "Finance Tracker Backend Running"

GET /api/test-db
Response: Database connection status with timestamp
```

### 📁 Categories

```
GET /api/categories
Description: Get all categories
Response: Array of category objects

GET /api/categories/:type
Description: Get categories by type (income or expense)
Params: type = 'income' | 'expense'
Response: Filtered array of categories
```

### � Income

```
GET /api/income
Description: Get all income records with category details
Response: Array of income records ordered by date (newest first)

POST /api/income
Description: Create a new income record
Body: {
  "category_id": number,
  "amount": number,
  "description": string (optional),
  "date": "YYYY-MM-DD"
}
Response: Created income object

PUT /api/income/:id
Description: Update an existing income record
Params: id (income ID)
Body: Same as POST
Response: Updated income object

DELETE /api/income/:id
Description: Delete an income record
Params: id (income ID)
Response: Success message

GET /api/income/summary
Description: Get income summary
Response: {
  "total_income": string,
  "income_count": string
}
```

### 💸 Expenses

```
GET /api/expenses
Description: Get all expense records with category details
Response: Array of expense records ordered by date (newest first)

POST /api/expenses
Description: Create a new expense record
Body: {
  "category_id": number,
  "amount": number,
  "description": string (optional),
  "date": "YYYY-MM-DD"
}
Response: Created expense object

PUT /api/expenses/:id
Description: Update an existing expense record
Params: id (expense ID)
Body: Same as POST
Response: Updated expense object

DELETE /api/expenses/:id
Description: Delete an expense record
Params: id (expense ID)
Response: Success message

GET /api/expenses/summary
Description: Get expenses summary
Response: {
  "total_expenses": string,
  "expense_count": string
}
```

### 📊 Overall Summary

```
GET /api/summary
Description: Get overall financial summary (from income and expenses tables)
Response: {
  "total_income": string,
  "total_expenses": string,
  "balance": string
}
```

### 💰 Transactions (Legacy)

```
GET /api/transactions
Description: Get all transactions with category details
Response: Array of transactions ordered by date (newest first)

GET /api/transactions/range?start=YYYY-MM-DD&end=YYYY-MM-DD
Description: Get transactions within date range
Query Params: start, end (date format)
Response: Filtered array of transactions

POST /api/transactions
Description: Create a new transaction
Body: {
  "category_id": number,
  "amount": number,
  "type": "income" | "expense",
  "description": string (optional),
  "date": "YYYY-MM-DD"
}
Response: Created transaction object

PUT /api/transactions/:id
Description: Update an existing transaction
Params: id (transaction ID)
Body: Same as POST
Response: Updated transaction object

DELETE /api/transactions/:id
Description: Delete a transaction
Params: id (transaction ID)
Response: Success message

GET /api/transactions/summary
Description: Get financial summary
Response: {
  "total_income": string,
  "total_expenses": string,
  "balance": string
}
```

### 📈 Budgets

```
GET /api/budgets
Description: Get all budgets with category details
Response: Array of budget objects

POST /api/budgets
Description: Create a new budget
Body: {
  "category_id": number,
  "amount": number,
  "period": "daily" | "weekly" | "monthly" | "yearly",
  "start_date": "YYYY-MM-DD",
  "end_date": "YYYY-MM-DD" (optional)
}
Response: Created budget object
```

### 🎯 Savings Goals

```
GET /api/savings
Description: Get all savings goals
Response: Array of savings goal objects

POST /api/savings
Description: Create a new savings goal
Body: {
  "name": string,
  "target_amount": number,
  "current_amount": number (optional, default: 0),
  "deadline": "YYYY-MM-DD" (optional)
}
Response: Created savings goal object
```

## 📦 Default Categories

The database comes pre-populated with 12 default categories:

**Income Categories:**
- 💰 Salary
- 💼 Freelance
- 📈 Investment
- 📌 Other

**Expense Categories:**
- 🍔 Food & Dining
- 🚗 Transportation
- 🛍️ Shopping
- 🎮 Entertainment
- 💡 Bills & Utilities
- 🏥 Healthcare
- 📚 Education
- 📌 Other

## 🛠️ Testing Examples

### Create a Transaction
```bash
curl -X POST http://localhost:3001/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "category_id": 1,
    "amount": 5000,
    "type": "income",
    "description": "Monthly salary",
    "date": "2026-01-12"
  }'
```

### Get All Transactions
```bash
curl http://localhost:3001/api/transactions
```

### Get Financial Summary
```bash
curl http://localhost:3001/api/transactions/summary
```

## 🔄 Auto-Restart

The server uses nodemon and automatically restarts when you make code changes.

## 📝 Environment Variables

Located in `.env` file:
```
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=finance_tracker
DB_USER=postgres
DB_PASSWORD=Postgre@1266
```

## 🎯 Next Steps

- [ ] Add user authentication (JWT)
- [ ] Add user-specific data filtering
- [ ] Add data validation middleware
- [ ] Add pagination for transactions
- [ ] Add filtering and sorting options
- [ ] Add expense analytics endpoints
