-- Add more income categories

INSERT INTO categories (name, type, color, icon) VALUES
('Bonus', 'income', '#f59e0b', '🎁'),
('Rental', 'income', '#8b5cf6', '🏠'),
('Business', 'income', '#ec4899', '💼'),
('Dividends', 'income', '#14b8a6', '📊'),
('Interest', 'income', '#6366f1', '💵'),
('Gift', 'income', '#f43f5e', '🎉'),
('Royalty', 'income', '#a855f7', '👑'),
('Side Hustle', 'income', '#06b6d4', '🚀'),
('Commission', 'income', '#eab308', '💰'),
('Pension', 'income', '#84cc16', '🏦'),
('Refund', 'income', '#22c55e', '↩️'),
('Grant', 'income', '#0ea5e9', '🏆'),
('Cashback', 'income', '#fb923c', '💳')
ON CONFLICT DO NOTHING;

-- Display all income categories
SELECT id, name, type, icon, color FROM categories WHERE type = 'income' ORDER BY name;
