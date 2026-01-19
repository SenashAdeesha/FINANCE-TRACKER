#!/bin/bash

echo "🚀 Setting up Finance Tracker Database..."
echo ""

# Database credentials from .env
DB_USER="postgres"
DB_PASSWORD="Postgre@1266"
DB_NAME="finance_tracker"
DB_HOST="localhost"
DB_PORT="5432"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed!"
    echo "Please install PostgreSQL first:"
    echo "  macOS: brew install postgresql@16"
    echo "  Ubuntu: sudo apt install postgresql"
    exit 1
fi

echo "✅ PostgreSQL is installed"
echo ""

# Check if PostgreSQL is running
if ! pg_isready -h $DB_HOST -p $DB_PORT > /dev/null 2>&1; then
    echo "❌ PostgreSQL is not running!"
    echo "Start it with:"
    echo "  macOS: brew services start postgresql@16"
    echo "  Linux: sudo systemctl start postgresql"
    exit 1
fi

echo "✅ PostgreSQL is running"
echo ""

# Check if database exists
if psql -U $DB_USER -h $DB_HOST -p $DB_PORT -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    echo "⚠️  Database '$DB_NAME' already exists"
    read -p "Do you want to drop and recreate it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🗑️  Dropping existing database..."
        PGPASSWORD=$DB_PASSWORD dropdb -U $DB_USER -h $DB_HOST -p $DB_PORT $DB_NAME
    else
        echo "Skipping database creation..."
        DB_EXISTS=true
    fi
fi

# Create database if it doesn't exist
if [ -z "$DB_EXISTS" ]; then
    echo "📦 Creating database '$DB_NAME'..."
    PGPASSWORD=$DB_PASSWORD createdb -U $DB_USER -h $DB_HOST -p $DB_PORT $DB_NAME
    if [ $? -eq 0 ]; then
        echo "✅ Database created successfully"
    else
        echo "❌ Failed to create database"
        exit 1
    fi
fi

echo ""
echo "📋 Running SQL migrations..."
echo ""

# Array of SQL files in order
SQL_FILES=(
    "schema.sql"
    "add_expense_categories.sql"
    "add_income_expense_tables.sql"
    "add_more_income_categories.sql"
    "add_password_reset_tokens.sql"
    "add_profile_fields.sql"
    "add_recurring_column.sql"
    "create_savings_table.sql"
)

# Run each SQL file
for sql_file in "${SQL_FILES[@]}"; do
    if [ -f "$sql_file" ]; then
        echo "  ▶ Running $sql_file..."
        PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -h $DB_HOST -p $DB_PORT -d $DB_NAME -f $sql_file -q
        if [ $? -eq 0 ]; then
            echo "  ✅ $sql_file completed"
        else
            echo "  ⚠️  Warning: $sql_file may have had errors (this might be okay if tables already exist)"
        fi
    else
        echo "  ⚠️  File not found: $sql_file"
    fi
done

echo ""
echo "🔍 Verifying database setup..."
echo ""

# List all tables
PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -h $DB_HOST -p $DB_PORT -d $DB_NAME -c "\dt" -q

echo ""
echo "🎉 Database setup complete!"
echo ""
echo "📊 Database Info:"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo ""
echo "🚀 Next steps:"
echo "  1. Start backend: npm run dev"
echo "  2. Test connection: curl http://localhost:3001/api/test-db"
echo ""
