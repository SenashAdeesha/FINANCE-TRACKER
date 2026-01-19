@echo off
echo 🚀 Setting up Finance Tracker Database...
echo.

REM Database credentials from .env
set DB_USER=postgres
set DB_PASSWORD=Postgre@1266
set DB_NAME=finance_tracker
set DB_HOST=localhost
set DB_PORT=5432

REM Set PostgreSQL password for commands
set PGPASSWORD=%DB_PASSWORD%

echo ✅ Checking PostgreSQL installation...
where psql >nul 2>&1
if errorlevel 1 (
    echo ❌ PostgreSQL is not installed or not in PATH!
    echo Please install PostgreSQL from: https://www.postgresql.org/download/windows/
    pause
    exit /b 1
)

echo ✅ PostgreSQL is installed
echo.

echo 📦 Creating database '%DB_NAME%'...
createdb -U %DB_USER% -h %DB_HOST% -p %DB_PORT% %DB_NAME% 2>nul
if errorlevel 1 (
    echo ⚠️  Database may already exist - continuing...
)
echo.

echo 📋 Running SQL migrations...
echo.

REM Run each SQL file
for %%f in (
    schema.sql
    add_expense_categories.sql
    add_income_expense_tables.sql
    add_more_income_categories.sql
    add_password_reset_tokens.sql
    add_profile_fields.sql
    add_recurring_column.sql
    create_savings_table.sql
) do (
    if exist %%f (
        echo   ▶ Running %%f...
        psql -U %DB_USER% -h %DB_HOST% -p %DB_PORT% -d %DB_NAME% -f %%f -q
        echo   ✅ %%f completed
    ) else (
        echo   ⚠️  File not found: %%f
    )
)

echo.
echo 🔍 Verifying database setup...
echo.

REM List all tables
psql -U %DB_USER% -h %DB_HOST% -p %DB_PORT% -d %DB_NAME% -c "\dt"

echo.
echo 🎉 Database setup complete!
echo.
echo 📊 Database Info:
echo   Host: %DB_HOST%
echo   Port: %DB_PORT%
echo   Database: %DB_NAME%
echo   User: %DB_USER%
echo.
echo 🚀 Next steps:
echo   1. Start backend: npm run dev
echo   2. Test connection: http://localhost:3001/api/test-db
echo.

pause
