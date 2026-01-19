import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import crypto from "crypto";

dotenv.config();

const { Pool } = pg;

// Create database pool
const pool = new Pool(
    process.env.DATABASE_URL
        ? { connectionString: process.env.DATABASE_URL }
        : {
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || "5432"),
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        }
);

// Test pool connection
pool.on("connect", () => {
    console.log("✅ New client connected to the pool");
});

// Pool level error handling
pool.on("error", (err) => {
    console.error("❌ Unexpected database error:", err);
});

// Check initial connection
(async () => {
    try {
        const client = await pool.connect();
        console.log("✅ Successfully connected to the database pool");
        const res = await client.query('SELECT NOW()');
        console.log("🕒 Database Time:", res.rows[0].now);
        client.release();
    } catch (err) {
        console.error("❌ Failed to connect to the database on startup:", err);
    }
})();

// Email transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
    }
});

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for profile pictures
app.use(express.urlencoded({ limit: '10mb', extended: true }));

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

// ============= AUTHENTICATION API =============
// User registration
app.post("/api/auth/signup", async (req, res) => {
    try {
        const {
            email,
            password,
            firstName,
            lastName,
            phone,
            dateOfBirth,
            occupation,
            city,
            country,
            profile_picture
        } = req.body;

        // Validate required fields
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ error: "Email, password, first name, and last name are required" });
        }

        // Check if user already exists
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: "User with this email already exists" });
        }

        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Generate username from email
        const username = email.split('@')[0];

        // Insert new user
        const result = await pool.query(
            `INSERT INTO users (
                username, email, password_hash, first_name, last_name, 
                phone, date_of_birth, occupation, city, country, profile_picture
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING id, username, email, first_name, last_name, phone, 
                      date_of_birth, occupation, city, country, profile_picture, created_at`,
            [username, email, passwordHash, firstName, lastName, phone || null,
                dateOfBirth || null, occupation || null, city || null, country || null, profile_picture || null]
        );

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: result.rows[0]
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Failed to register user" });
    }
});

// User login
app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Find user
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const user = result.rows[0];

        // Compare password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Remove password hash from response
        const { password_hash, ...userWithoutPassword } = user;

        res.json({
            success: true,
            message: "Login successful",
            user: userWithoutPassword
        });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "Failed to login" });
    }
});

// ============= USER PROFILE API =============
// Get user profile
app.get("/api/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "SELECT id, username, email, first_name, last_name, phone, address, city, country, postal_code, date_of_birth, occupation, bio, profile_picture, created_at FROM users WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ error: "Failed to fetch user profile" });
    }
});

// Update user profile
app.put("/api/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const {
            first_name,
            last_name,
            phone,
            address,
            city,
            country,
            postal_code,
            date_of_birth,
            occupation,
            bio,
            profile_picture
        } = req.body;

        const result = await pool.query(
            `UPDATE users 
             SET first_name = $1, last_name = $2, phone = $3, address = $4, 
                 city = $5, country = $6, postal_code = $7, date_of_birth = $8, 
                 occupation = $9, bio = $10, profile_picture = $11, updated_at = CURRENT_TIMESTAMP
             WHERE id = $12
             RETURNING id, username, email, first_name, last_name, phone, address, 
                       city, country, postal_code, date_of_birth, occupation, bio, profile_picture, updated_at`,
            [first_name, last_name, phone, address, city, country, postal_code,
                date_of_birth, occupation, bio, profile_picture, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({
            success: true,
            message: "Profile updated successfully",
            user: result.rows[0]
        });
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ error: "Failed to update user profile" });
    }
});

// Update user password
app.put("/api/users/:id/password", async (req, res) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;

        // Validate required fields
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: "Current password and new password are required" });
        }

        // Validate new password length
        if (newPassword.length < 6) {
            return res.status(400).json({ error: "New password must be at least 6 characters long" });
        }

        // Get user with current password hash
        const userResult = await pool.query(
            "SELECT password_hash FROM users WHERE id = $1",
            [id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = userResult.rows[0];

        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: "Current password is incorrect" });
        }

        // Hash new password
        const saltRounds = 10;
        const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

        // Update password
        await pool.query(
            "UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
            [newPasswordHash, id]
        );

        res.json({
            success: true,
            message: "Password updated successfully"
        });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ error: "Failed to update password" });
    }
});

// Forgot password - Send reset token
app.post("/api/auth/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        // Find user by email
        const result = await pool.query(
            "SELECT id, email, first_name FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            // Don't reveal if email exists or not for security
            return res.json({
                success: true,
                message: "If an account exists with this email, you will receive a password reset link."
            });
        }

        const user = result.rows[0];

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour from now

        // Save reset token to database
        await pool.query(
            "UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3",
            [resetToken, resetTokenExpires, user.id]
        );

        // Send email with reset link
        const resetLink = `http://localhost:5177/reset-password?token=${resetToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USER || 'noreply@financetracker.com',
            to: user.email,
            subject: 'Password Reset Request - Finance Tracker',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #6366f1;">Password Reset Request</h2>
                    <p>Hi ${user.first_name || 'there'},</p>
                    <p>You requested to reset your password for your Finance Tracker account.</p>
                    <p>Click the button below to reset your password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetLink}" 
                           style="background: linear-gradient(to right, #3b82f6, #8b5cf6); 
                                  color: white; 
                                  padding: 12px 30px; 
                                  text-decoration: none; 
                                  border-radius: 8px;
                                  display: inline-block;
                                  font-weight: bold;">
                            Reset Password
                        </a>
                    </div>
                    <p>Or copy and paste this link into your browser:</p>
                    <p style="color: #6366f1; word-break: break-all;">${resetLink}</p>
                    <p style="color: #666; font-size: 14px;">
                        This link will expire in 1 hour for security reasons.
                    </p>
                    <p style="color: #666; font-size: 14px;">
                        If you didn't request this password reset, please ignore this email.
                    </p>
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                    <p style="color: #999; font-size: 12px; text-align: center;">
                        Finance Tracker &copy; 2026
                    </p>
                </div>
            `
        };

        // Check if email is configured
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || 
            process.env.EMAIL_USER === 'your-email@gmail.com' || 
            process.env.EMAIL_PASS === 'your-app-specific-password') {
            console.error("Email credentials not configured in .env file");
            return res.status(500).json({ 
                error: "Email service not configured. Please contact administrator." 
            });
        }

        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: "If an account exists with this email, you will receive a password reset link."
        });
    } catch (error) {
        console.error("Error sending password reset email:", error);
        res.status(500).json({ error: "Failed to process password reset request" });
    }
});

// Reset password with token
app.post("/api/auth/reset-password", async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ error: "Token and new password are required" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        // Find user by reset token and check if token is still valid
        const result = await pool.query(
            "SELECT id FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()",
            [token]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ error: "Invalid or expired reset token" });
        }

        const user = result.rows[0];

        // Hash new password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(newPassword, saltRounds);

        // Update password and clear reset token
        await pool.query(
            "UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
            [passwordHash, user.id]
        );

        res.json({
            success: true,
            message: "Password reset successfully"
        });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ error: "Failed to reset password" });
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
            WHERE i.deleted_at IS NULL
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
        await pool.query("UPDATE income SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1", [id]);
        res.json({ message: "Income moved to recycle bin" });
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
            WHERE deleted_at IS NULL
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
            WHERE e.deleted_at IS NULL
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
        const { category_id, amount, description, date, recurring } = req.body;
        const result = await pool.query(
            `INSERT INTO expenses (user_id, category_id, amount, description, date, recurring)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [1, category_id, amount, description, date, recurring || false]
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
        const { category_id, amount, description, date, recurring } = req.body;
        const result = await pool.query(
            `UPDATE expenses 
             SET category_id = $1, amount = $2, description = $3, date = $4, recurring = $5, updated_at = CURRENT_TIMESTAMP
             WHERE id = $6
             RETURNING *`,
            [category_id, amount, description, date, recurring !== undefined ? recurring : false, id]
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
        await pool.query("UPDATE expenses SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1", [id]);
        res.json({ message: "Expense moved to recycle bin" });
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
            WHERE deleted_at IS NULL
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
                (SELECT COALESCE(SUM(amount), 0) FROM income WHERE deleted_at IS NULL) as total_income,
                (SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE deleted_at IS NULL) as total_expenses,
                (SELECT COALESCE(SUM(amount), 0) FROM income WHERE deleted_at IS NULL) - (SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE deleted_at IS NULL) as balance
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

// ============= SAVINGS & INVESTMENTS API =============
// Get all savings and investments
app.get("/api/savings-investments", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT * FROM savings
            WHERE deleted_at IS NULL
            ORDER BY date DESC, created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching savings/investments:", error);
        res.status(500).json({ error: "Failed to fetch savings/investments" });
    }
});

// Create new savings or investment
app.post("/api/savings-investments", async (req, res) => {
    try {
        const { type, category, amount, description, date, recurring } = req.body;
        const result = await pool.query(
            `INSERT INTO savings (user_id, type, category, amount, description, date, recurring)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [1, type, category, amount, description, date, recurring || false]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating savings/investment:", error);
        res.status(500).json({ error: "Failed to create savings/investment" });
    }
});

// Update savings or investment
app.put("/api/savings-investments/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { type, category, amount, description, date, recurring } = req.body;
        const result = await pool.query(
            `UPDATE savings 
             SET type = $1, category = $2, amount = $3, description = $4, 
                 date = $5, recurring = $6, updated_at = CURRENT_TIMESTAMP
             WHERE id = $7
             RETURNING *`,
            [type, category, amount, description, date, recurring, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Savings/Investment not found" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error updating savings/investment:", error);
        res.status(500).json({ error: "Failed to update savings/investment" });
    }
});

// Delete savings or investment
app.delete("/api/savings-investments/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("UPDATE savings SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Savings/Investment not found" });
        }
        res.json({ message: "Savings moved to recycle bin" });
    } catch (error) {
        console.error("Error deleting savings/investment:", error);
        res.status(500).json({ error: "Failed to delete savings/investment" });
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

// ============= RECYCLE BIN API =============
// Get all items in the recycle bin
app.get("/api/recycle-bin", async (req, res) => {
    try {
        const incomeResult = await pool.query(`
            SELECT i.*, c.name as category_name, c.color as category_color, c.icon as category_icon, 'income' as item_type
            FROM income i
            LEFT JOIN categories c ON i.category_id = c.id
            WHERE i.deleted_at IS NOT NULL
        `);

        const expenseResult = await pool.query(`
            SELECT e.*, c.name as category_name, c.color as category_color, c.icon as category_icon, 'expense' as item_type
            FROM expenses e
            LEFT JOIN categories c ON e.category_id = c.id
            WHERE e.deleted_at IS NOT NULL
        `);

        const savingsResult = await pool.query(`
            SELECT *, 'savings' as item_type
            FROM savings
            WHERE deleted_at IS NOT NULL
        `);

        const allDeletedItems = [
            ...incomeResult.rows,
            ...expenseResult.rows,
            ...savingsResult.rows
        ].sort((a, b) => new Date(b.deleted_at).getTime() - new Date(a.deleted_at).getTime());

        res.json(allDeletedItems);
    } catch (error) {
        console.error("Error fetching recycle bin:", error);
        res.status(500).json({ error: "Failed to fetch recycle bin" });
    }
});

// Restore an item from the recycle bin
app.post("/api/recycle-bin/restore/:type/:id", async (req, res) => {
    try {
        const { type, id } = req.params;
        let query = "";

        if (type === 'income') {
            query = "UPDATE income SET deleted_at = NULL WHERE id = $1";
        } else if (type === 'expense') {
            query = "UPDATE expenses SET deleted_at = NULL WHERE id = $1";
        } else if (type === 'savings') {
            query = "UPDATE savings SET deleted_at = NULL WHERE id = $1";
        } else {
            return res.status(400).json({ error: "Invalid item type" });
        }

        await pool.query(query, [id]);
        res.json({ message: "Item restored successfully" });
    } catch (error) {
        console.error("Error restoring item:", error);
        res.status(500).json({ error: "Failed to restore item" });
    }
});

// Permanently delete an item
app.delete("/api/recycle-bin/purge/:type/:id", async (req, res) => {
    try {
        const { type, id } = req.params;
        let query = "";

        if (type === 'income') {
            query = "DELETE FROM income WHERE id = $1";
        } else if (type === 'expense') {
            query = "DELETE FROM expenses WHERE id = $1";
        } else if (type === 'savings') {
            query = "DELETE FROM savings WHERE id = $1";
        } else {
            return res.status(400).json({ error: "Invalid item type" });
        }

        await pool.query(query, [id]);
        res.json({ message: "Item permanently deleted" });
    } catch (error) {
        console.error("Error purging item:", error);
        res.status(500).json({ error: "Failed to purge item" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
