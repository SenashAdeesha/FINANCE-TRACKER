# 🗄️ Database Setup Guide

## Prerequisites

1. **Install PostgreSQL**
   
   **macOS:**
   ```bash
   brew install postgresql@16
   brew services start postgresql@16
   ```
   
   **Windows:**
   - Download from [PostgreSQL Official Site](https://www.postgresql.org/download/windows/)
   - Run the installer and remember the password you set for the `postgres` user
   
   **Linux (Ubuntu/Debian):**
   ```bash
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql
   ```

## Step 1: Create Database

Open PostgreSQL command line:

**macOS/Linux:**
```bash
psql -U postgres
```

**Windows:**
- Open "SQL Shell (psql)" from Start menu

Once in psql, run:
```sql
CREATE DATABASE finance_tracker;
```

Exit psql:
```sql
\q
```

## Step 2: Configure Environment Variables

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Edit the `.env` file and update with your PostgreSQL credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=finance_tracker
   DB_USER=postgres
   DB_PASSWORD=YOUR_ACTUAL_PASSWORD
   ```

## Step 3: Initialize Database Schema

Run the SQL files in order:

```bash
# Connect to your database
psql -U postgres -d finance_tracker

# Or on Windows, use SQL Shell and connect to finance_tracker database
# Then run these commands:
```

In psql:
```sql
-- Run the main schema
\i schema.sql

-- Run migrations in order
\i add_expense_categories.sql
\i add_income_expense_tables.sql
\i add_more_income_categories.sql
\i add_password_reset_tokens.sql
\i add_profile_fields.sql
\i add_recurring_column.sql
\i create_savings_table.sql

-- Verify tables were created
\dt
```

**Alternative: Run from command line**
```bash
psql -U postgres -d finance_tracker -f schema.sql
psql -U postgres -d finance_tracker -f add_expense_categories.sql
psql -U postgres -d finance_tracker -f add_income_expense_tables.sql
psql -U postgres -d finance_tracker -f add_more_income_categories.sql
psql -U postgres -d finance_tracker -f add_password_reset_tokens.sql
psql -U postgres -d finance_tracker -f add_profile_fields.sql
psql -U postgres -d finance_tracker -f add_recurring_column.sql
psql -U postgres -d finance_tracker -f create_savings_table.sql
```

## Step 4: Test Database Connection

1. Make sure PostgreSQL is running:
   ```bash
   # macOS
   brew services list
   
   # Linux
   sudo systemctl status postgresql
   
   # Windows - check Services app
   ```

2. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

3. Test the connection:
   - Visit: http://localhost:3001/api/test-db
   - You should see a success message with timestamp

## Step 5: Email Configuration (Optional)

For password reset functionality, configure Gmail:

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. Update `.env`:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-digit-app-password
   ```

## Troubleshooting

### Connection Refused Error
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list  # macOS

# Start PostgreSQL if not running
sudo systemctl start postgresql  # Linux
brew services start postgresql@16  # macOS
```

### Authentication Failed
- Verify password in `.env` matches PostgreSQL user password
- Try connecting directly: `psql -U postgres`
- Reset password if needed:
  ```bash
  sudo -u postgres psql
  ALTER USER postgres PASSWORD 'new_password';
  ```

### Database Does Not Exist
```sql
-- Connect to postgres
psql -U postgres

-- Create database
CREATE DATABASE finance_tracker;

-- Verify it exists
\l
```

### Port Already in Use
If port 5432 is in use:
1. Find process: `lsof -i :5432`
2. Kill it: `kill -9 <PID>`
3. Or change port in `.env`

## Quick Start Script

Create a file `setup-db.sh` in the backend folder:

```bash
#!/bin/bash

echo "🚀 Setting up Finance Tracker Database..."

# Create database
createdb -U postgres finance_tracker

# Run schema
psql -U postgres -d finance_tracker -f schema.sql
psql -U postgres -d finance_tracker -f add_expense_categories.sql
psql -U postgres -d finance_tracker -f add_income_expense_tables.sql
psql -U postgres -d finance_tracker -f add_more_income_categories.sql
psql -U postgres -d finance_tracker -f add_password_reset_tokens.sql
psql -U postgres -d finance_tracker -f add_profile_fields.sql
psql -U postgres -d finance_tracker -f add_recurring_column.sql
psql -U postgres -d finance_tracker -f create_savings_table.sql

echo "✅ Database setup complete!"
echo "🧪 Testing connection..."

# Start server briefly to test
npm run dev &
SERVER_PID=$!
sleep 3
curl http://localhost:3001/api/test-db
kill $SERVER_PID

echo "🎉 All done! Start the server with: npm run dev"
```

Make it executable:
```bash
chmod +x setup-db.sh
./setup-db.sh
```

## Database Schema Overview

Your database includes:

- **users** - User accounts and profiles
- **categories** - Income/expense categories
- **transactions** - Financial transactions
- **budgets** - Spending limits
- **savings_goals** - Savings targets
- **income** - Income records
- **expenses** - Expense records
- **savings** - Savings records
- **password_reset_tokens** - Password reset functionality

## Useful PostgreSQL Commands

```sql
-- List all databases
\l

-- Connect to database
\c finance_tracker

-- List all tables
\dt

-- Describe a table
\d users

-- View all users
SELECT * FROM users;

-- Count records
SELECT COUNT(*) FROM transactions;

-- Drop database (careful!)
DROP DATABASE finance_tracker;
```

## Next Steps

After database is set up:

1. ✅ Start backend: `cd backend && npm run dev`
2. ✅ Start frontend: `npm run dev`
3. ✅ Visit http://localhost:5173
4. ✅ Sign up for an account
5. ✅ Start tracking your finances!
