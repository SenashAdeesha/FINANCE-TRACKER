import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;

// Create database pool
const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

// Test pool connection
pool.on("connect", () => {
    console.log("✅ Connected to PostgreSQL database");
});

pool.on("error", (err) => {
    console.error("❌ Database error:", err);
});

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json()); // Parses JSON body

// Test route
app.get("/", (req, res) => {
    res.send("Finance Tracker Backend Running");
});

// Database test route
app.get("/api/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({
            success: true,
            message: "Database connected successfully!",
            timestamp: result.rows[0].now,
        });
    } catch (error) {
        console.error("Database connection error:", error);
        res.status(500).json({
            success: false,
            message: "Database connection failed",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

// ============= CATEGORIES API =============
// Get all categories
app.get("/api/categories", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM categories ORDER BY type, name"
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ error: "Failed to fetch categories" });
    }
});

// Get categories by type (income/expense)
app.get("/api/categories/:type", async (req, res) => {
    try {
        const { type } = req.params;
        const result = await pool.query(
            "SELECT * FROM categories WHERE type = $1 ORDER BY name",
            [type]
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ error: "Failed to fetch categories" });
    }
});

// ============= TRANSACTIONS API =============
// Get all transactions
app.get("/api/transactions", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT t.*, c.name as category_name, c.color as category_color, c.icon as category_icon
            FROM transactions t
            LEFT JOIN categories c ON t.category_id = c.id
            ORDER BY t.date DESC, t.created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
});

// Get transactions by date range
app.get("/api/transactions/range", async (req, res) => {
    try {
        const { start, end } = req.query;
        const result = await pool.query(`
            SELECT t.*, c.name as category_name, c.color as category_color, c.icon as category_icon
            FROM transactions t
            LEFT JOIN categories c ON t.category_id = c.id
            WHERE t.date BETWEEN $1 AND $2
            ORDER BY t.date DESC
        `, [start, end]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
});

// Create a new transaction
app.post("/api/transactions", async (req, res) => {
    try {
        const { category_id, amount, type, description, date } = req.body;
        const result = await pool.query(
            `INSERT INTO transactions (user_id, category_id, amount, type, description, date)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [1, category_id, amount, type, description, date] // Using user_id = 1 for now
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).json({ error: "Failed to create transaction" });
    }
});

// Update a transaction
app.put("/api/transactions/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { category_id, amount, type, description, date } = req.body;
        const result = await pool.query(
            `UPDATE transactions 
             SET category_id = $1, amount = $2, type = $3, description = $4, date = $5, updated_at = CURRENT_TIMESTAMP
             WHERE id = $6
             RETURNING *`,
            [category_id, amount, type, description, date, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error updating transaction:", error);
        res.status(500).json({ error: "Failed to update transaction" });
    }
});

// Delete a transaction
app.delete("/api/transactions/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM transactions WHERE id = $1", [id]);
        res.json({ message: "Transaction deleted successfully" });
    } catch (error) {
        console.error("Error deleting transaction:", error);
        res.status(500).json({ error: "Failed to delete transaction" });
    }
});

// Get transaction summary (total income, expenses, balance)
app.get("/api/transactions/summary", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
                COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expenses,
                COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) as balance
            FROM transactions
        `);
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching summary:", error);
        res.status(500).json({ error: "Failed to fetch summary" });
    }
});

// ============= INCOME API =============
// Get all income
app.get("/api/income", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT i.*, c.name as category_name, c.color as category_color, c.icon as category_icon
            FROM income i
            LEFT JOIN categories c ON i.category_id = c.id
            ORDER BY i.date DESC, i.created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching income:", error);
        res.status(500).json({ error: "Failed to fetch income" });
    }
});

// Create new income
app.post("/api/income", async (req, res) => {
    try {
        const { category_id, amount, description, date, recurring } = req.body;
        const result = await pool.query(
            `INSERT INTO income (user_id, category_id, amount, description, date, recurring)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [1, category_id, amount, description, date, recurring || false]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating income:", error);
        res.status(500).json({ error: "Failed to create income" });
    }
});

// Update income
app.put("/api/income/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { category_id, amount, description, date, recurring } = req.body;
        const result = await pool.query(
            `UPDATE income 
             SET category_id = $1, amount = $2, description = $3, date = $4, recurring = $5, updated_at = CURRENT_TIMESTAMP
             WHERE id = $6
             RETURNING *`,
            [category_id, amount, description, date, recurring !== undefined ? recurring : false, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error updating income:", error);
        res.status(500).json({ error: "Failed to update income" });
    }
});

// Delete income
app.delete("/api/income/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM income WHERE id = $1", [id]);
        res.json({ message: "Income deleted successfully" });
    } catch (error) {
        console.error("Error deleting income:", error);
        res.status(500).json({ error: "Failed to delete income" });
    }
});

// Get income summary
app.get("/api/income/summary", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                COALESCE(SUM(amount), 0) as total_income,
                COUNT(*) as income_count
            FROM income
        `);
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching income summary:", error);
        res.status(500).json({ error: "Failed to fetch income summary" });
    }
});

// ============= EXPENSES API =============
// Get all expenses
app.get("/api/expenses", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT e.*, c.name as category_name, c.color as category_color, c.icon as category_icon
            FROM expenses e
            LEFT JOIN categories c ON e.category_id = c.id
            ORDER BY e.date DESC, e.created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({ error: "Failed to fetch expenses" });
    }
});

// Create new expense
app.post("/api/expenses", async (req, res) => {
    try {
        const { category_id, amount, description, date } = req.body;
        const result = await pool.query(
            `INSERT INTO expenses (user_id, category_id, amount, description, date)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [1, category_id, amount, description, date]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating expense:", error);
        res.status(500).json({ error: "Failed to create expense" });
    }
});

// Update expense
app.put("/api/expenses/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { category_id, amount, description, date } = req.body;
        const result = await pool.query(
            `UPDATE expenses 
             SET category_id = $1, amount = $2, description = $3, date = $4, updated_at = CURRENT_TIMESTAMP
             WHERE id = $5
             RETURNING *`,
            [category_id, amount, description, date, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error updating expense:", error);
        res.status(500).json({ error: "Failed to update expense" });
    }
});

// Delete expense
app.delete("/api/expenses/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM expenses WHERE id = $1", [id]);
        res.json({ message: "Expense deleted successfully" });
    } catch (error) {
        console.error("Error deleting expense:", error);
        res.status(500).json({ error: "Failed to delete expense" });
    }
});

// Get expenses summary
app.get("/api/expenses/summary", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                COALESCE(SUM(amount), 0) as total_expenses,
                COUNT(*) as expense_count
            FROM expenses
        `);
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching expenses summary:", error);
        res.status(500).json({ error: "Failed to fetch expenses summary" });
    }
});

// Get overall financial summary (from separate tables)
app.get("/api/summary", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                (SELECT COALESCE(SUM(amount), 0) FROM income) as total_income,
                (SELECT COALESCE(SUM(amount), 0) FROM expenses) as total_expenses,
                (SELECT COALESCE(SUM(amount), 0) FROM income) - (SELECT COALESCE(SUM(amount), 0) FROM expenses) as balance
        `);
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching summary:", error);
        res.status(500).json({ error: "Failed to fetch summary" });
    }
});

// ============= BUDGETS API =============
// Get all budgets
app.get("/api/budgets", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT b.*, c.name as category_name, c.color as category_color
            FROM budgets b
            LEFT JOIN categories c ON b.category_id = c.id
            ORDER BY b.created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching budgets:", error);
        res.status(500).json({ error: "Failed to fetch budgets" });
    }
});

// Create a new budget
app.post("/api/budgets", async (req, res) => {
    try {
        const { category_id, amount, period, start_date, end_date } = req.body;
        const result = await pool.query(
            `INSERT INTO budgets (user_id, category_id, amount, period, start_date, end_date)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [1, category_id, amount, period, start_date, end_date]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating budget:", error);
        res.status(500).json({ error: "Failed to create budget" });
    }
});

// ============= SAVINGS GOALS API =============
// Get all savings goals
app.get("/api/savings", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM savings_goals ORDER BY created_at DESC"
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching savings goals:", error);
        res.status(500).json({ error: "Failed to fetch savings goals" });
    }
});

// Create a new savings goal
app.post("/api/savings", async (req, res) => {
    try {
        const { name, target_amount, current_amount, deadline } = req.body;
        const result = await pool.query(
            `INSERT INTO savings_goals (user_id, name, target_amount, current_amount, deadline)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [1, name, target_amount, current_amount || 0, deadline]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating savings goal:", error);
        res.status(500).json({ error: "Failed to create savings goal" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
