-- Add expense categories
INSERT INTO categories (name, type, color, icon) VALUES
    ('Food & Dining', 'expense', '#EF4444', 'utensils'),
    ('Utilities', 'expense', '#F59E0B', 'bolt'),
    ('Transportation', 'expense', '#3B82F6', 'car'),
    ('Entertainment', 'expense', '#8B5CF6', 'film'),
    ('Healthcare', 'expense', '#EC4899', 'heartbeat'),
    ('Shopping', 'expense', '#10B981', 'shopping-bag'),
    ('Education', 'expense', '#6366F1', 'graduation-cap'),
    ('Housing', 'expense', '#14B8A6', 'home'),
    ('Insurance', 'expense', '#F97316', 'shield-alt'),
    ('Groceries', 'expense', '#22C55E', 'shopping-cart'),
    ('Personal Care', 'expense', '#A855F7', 'spa'),
    ('Travel', 'expense', '#06B6D4', 'plane'),
    ('Subscriptions', 'expense', '#8B5CF6', 'credit-card'),
    ('Gifts & Donations', 'expense', '#F43F5E', 'gift'),
    ('Pet Care', 'expense', '#84CC16', 'paw'),
    ('Repairs & Maintenance', 'expense', '#78716C', 'tools'),
    ('Other Expenses', 'expense', '#6B7280', 'ellipsis-h')
ON CONFLICT (name) DO NOTHING;

-- Add sample expense data
-- Get category IDs
DO $$
DECLARE
    food_cat_id INT;
    util_cat_id INT;
    trans_cat_id INT;
    ent_cat_id INT;
    health_cat_id INT;
    shop_cat_id INT;
    edu_cat_id INT;
    house_cat_id INT;
    ins_cat_id INT;
    groc_cat_id INT;
    pers_cat_id INT;
    trav_cat_id INT;
    subs_cat_id INT;
    gift_cat_id INT;
    pet_cat_id INT;
    repair_cat_id INT;
    other_cat_id INT;
BEGIN
    -- Get category IDs
    SELECT id INTO food_cat_id FROM categories WHERE name = 'Food & Dining' LIMIT 1;
    SELECT id INTO util_cat_id FROM categories WHERE name = 'Utilities' LIMIT 1;
    SELECT id INTO trans_cat_id FROM categories WHERE name = 'Transportation' LIMIT 1;
    SELECT id INTO ent_cat_id FROM categories WHERE name = 'Entertainment' LIMIT 1;
    SELECT id INTO health_cat_id FROM categories WHERE name = 'Healthcare' LIMIT 1;
    SELECT id INTO shop_cat_id FROM categories WHERE name = 'Shopping' LIMIT 1;
    SELECT id INTO edu_cat_id FROM categories WHERE name = 'Education' LIMIT 1;
    SELECT id INTO house_cat_id FROM categories WHERE name = 'Housing' LIMIT 1;
    SELECT id INTO ins_cat_id FROM categories WHERE name = 'Insurance' LIMIT 1;
    SELECT id INTO groc_cat_id FROM categories WHERE name = 'Groceries' LIMIT 1;
    SELECT id INTO pers_cat_id FROM categories WHERE name = 'Personal Care' LIMIT 1;
    SELECT id INTO trav_cat_id FROM categories WHERE name = 'Travel' LIMIT 1;
    SELECT id INTO subs_cat_id FROM categories WHERE name = 'Subscriptions' LIMIT 1;
    SELECT id INTO gift_cat_id FROM categories WHERE name = 'Gifts & Donations' LIMIT 1;
    SELECT id INTO pet_cat_id FROM categories WHERE name = 'Pet Care' LIMIT 1;
    SELECT id INTO repair_cat_id FROM categories WHERE name = 'Repairs & Maintenance' LIMIT 1;
    SELECT id INTO other_cat_id FROM categories WHERE name = 'Other Expenses' LIMIT 1;

    -- January 2026 expenses (6 expenses)
    INSERT INTO expenses (user_id, category_id, amount, description, date, recurring) VALUES
        (1, house_cat_id, 35000, 'Monthly Rent', '2026-01-05', true),
        (1, util_cat_id, 4500, 'Electricity Bill', '2026-01-08', true),
        (1, groc_cat_id, 15000, 'Weekly Groceries', '2026-01-10', false),
        (1, food_cat_id, 3500, 'Restaurant Lunch', '2026-01-12', false),
        (1, trans_cat_id, 2000, 'Fuel', '2026-01-15', false),
        (1, subs_cat_id, 1500, 'Netflix Subscription', '2026-01-20', true);

    -- December 2025 expenses (3 expenses)
    INSERT INTO expenses (user_id, category_id, amount, description, date, recurring) VALUES
        (1, shop_cat_id, 8000, 'Christmas Shopping', '2025-12-20', false),
        (1, ent_cat_id, 5000, 'Movie and Dinner', '2025-12-15', false),
        (1, gift_cat_id, 3000, 'Holiday Gifts', '2025-12-25', false);

    -- November 2025 expenses (4 expenses)
    INSERT INTO expenses (user_id, category_id, amount, description, date, recurring) VALUES
        (1, health_cat_id, 2500, 'Doctor Checkup', '2025-11-10', false),
        (1, edu_cat_id, 12000, 'Online Course', '2025-11-05', false),
        (1, pet_cat_id, 1500, 'Pet Food', '2025-11-12', false),
        (1, pers_cat_id, 2000, 'Haircut & Grooming', '2025-11-18', false);

    -- October 2025 expenses (4 expenses)
    INSERT INTO expenses (user_id, category_id, amount, description, date, recurring) VALUES
        (1, ins_cat_id, 8000, 'Car Insurance', '2025-10-01', true),
        (1, repair_cat_id, 5500, 'Car Servicing', '2025-10-15', false),
        (1, trav_cat_id, 25000, 'Weekend Trip', '2025-10-20', false),
        (1, other_cat_id, 3000, 'Miscellaneous', '2025-10-25', false);

    -- September 2025 expenses (3 expenses)
    INSERT INTO expenses (user_id, category_id, amount, description, date, recurring) VALUES
        (1, groc_cat_id, 18000, 'Monthly Groceries', '2025-09-05', false),
        (1, util_cat_id, 3500, 'Water Bill', '2025-09-10', true),
        (1, food_cat_id, 4500, 'Food Delivery', '2025-09-15', false);

    RAISE NOTICE 'Sample expense data added successfully!';
END $$;
