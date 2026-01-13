-- Create savings table for both savings and investments
CREATE TABLE IF NOT EXISTS savings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL DEFAULT 1,
    type VARCHAR(20) CHECK (type IN ('savings', 'investment')) NOT NULL,
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    recurring BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_savings_user_id ON savings(user_id);
CREATE INDEX IF NOT EXISTS idx_savings_type ON savings(type);
CREATE INDEX IF NOT EXISTS idx_savings_date ON savings(date);
CREATE INDEX IF NOT EXISTS idx_savings_created_at ON savings(created_at);

-- Insert sample data
INSERT INTO savings (user_id, type, category, amount, description, date, recurring) VALUES
(1, 'savings', 'Emergency Fund', 20000, 'Emergency Fund Deposit', '2026-01-08', true),
(1, 'savings', 'Vacation', 15000, 'Vacation Savings', '2026-01-05', false),
(1, 'investment', 'Mutual Funds', 10000, 'Mutual Fund SIP', '2026-01-01', true),
(1, 'investment', 'Stocks', 25000, 'Stock Purchase', '2026-01-03', false),
(1, 'investment', 'Gold', 30000, 'Gold Investment', '2026-01-07', false),
(1, 'savings', 'Retirement', 50000, 'Retirement Fund', '2026-01-01', true);
