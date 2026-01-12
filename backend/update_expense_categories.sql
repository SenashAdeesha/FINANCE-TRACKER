-- Update existing expenses with proper category IDs
UPDATE expenses 
SET category_id = (SELECT id FROM categories WHERE name = 'Food & Dining' AND type = 'expense' LIMIT 1)
WHERE description LIKE '%Restaurant%' OR description LIKE '%Food%' OR description LIKE '%Dining%';

UPDATE expenses 
SET category_id = (SELECT id FROM categories WHERE name = 'Bills & Utilities' AND type = 'expense' LIMIT 1)
WHERE description LIKE '%Bill%' OR description LIKE '%Electricity%' OR description LIKE '%Water%' OR description LIKE '%Utilities%';

UPDATE expenses 
SET category_id = (SELECT id FROM categories WHERE name = 'Subscriptions' AND type = 'expense' LIMIT 1)
WHERE description LIKE '%Subscription%' OR description LIKE '%Netflix%' OR description LIKE '%Spotify%';

UPDATE expenses 
SET category_id = (SELECT id FROM categories WHERE name = 'Transportation' AND type = 'expense' LIMIT 1)
WHERE description LIKE '%Fuel%' OR description LIKE '%Transport%' OR description LIKE '%Gas%' OR description LIKE '%Uber%';

UPDATE expenses 
SET category_id = (SELECT id FROM categories WHERE name = 'Groceries' AND type = 'expense' LIMIT 1)
WHERE description LIKE '%Groceries%' OR description LIKE '%Grocery%' OR description LIKE '%Supermarket%';

UPDATE expenses 
SET category_id = (SELECT id FROM categories WHERE name = 'Shopping' AND type = 'expense' LIMIT 1)
WHERE description LIKE '%Shopping%' OR description LIKE '%Purchase%';

UPDATE expenses 
SET category_id = (SELECT id FROM categories WHERE name = 'Entertainment' AND type = 'expense' LIMIT 1)
WHERE description LIKE '%Movie%' OR description LIKE '%Entertainment%' OR description LIKE '%Game%';

UPDATE expenses 
SET category_id = (SELECT id FROM categories WHERE name = 'Housing' AND type = 'expense' LIMIT 1)
WHERE description LIKE '%Rent%' OR description LIKE '%Mortgage%' OR description LIKE '%Housing%';

UPDATE expenses 
SET category_id = (SELECT id FROM categories WHERE name = 'Healthcare' AND type = 'expense' LIMIT 1)
WHERE description LIKE '%Doctor%' OR description LIKE '%Medical%' OR description LIKE '%Health%' OR description LIKE '%Medicine%';

UPDATE expenses 
SET category_id = (SELECT id FROM categories WHERE name = 'Education' AND type = 'expense' LIMIT 1)
WHERE description LIKE '%Course%' OR description LIKE '%Education%' OR description LIKE '%Class%' OR description LIKE '%School%';

UPDATE expenses 
SET category_id = (SELECT id FROM categories WHERE name = 'Personal Care' AND type = 'expense' LIMIT 1)
WHERE description LIKE '%Haircut%' OR description LIKE '%Grooming%' OR description LIKE '%Salon%' OR description LIKE '%Personal%';

UPDATE expenses 
SET category_id = (SELECT id FROM categories WHERE name = 'Travel' AND type = 'expense' LIMIT 1)
WHERE description LIKE '%Trip%' OR description LIKE '%Travel%' OR description LIKE '%Hotel%' OR description LIKE '%Flight%';

UPDATE expenses 
SET category_id = (SELECT id FROM categories WHERE name = 'Insurance' AND type = 'expense' LIMIT 1)
WHERE description LIKE '%Insurance%';

UPDATE expenses 
SET category_id = (SELECT id FROM categories WHERE name = 'Pet Care' AND type = 'expense' LIMIT 1)
WHERE description LIKE '%Pet%';

UPDATE expenses 
SET category_id = (SELECT id FROM categories WHERE name = 'Repairs & Maintenance' AND type = 'expense' LIMIT 1)
WHERE description LIKE '%Repair%' OR description LIKE '%Servicing%' OR description LIKE '%Maintenance%' OR description LIKE '%Fix%';

UPDATE expenses 
SET category_id = (SELECT id FROM categories WHERE name = 'Gifts & Donations' AND type = 'expense' LIMIT 1)
WHERE description LIKE '%Gift%' OR description LIKE '%Donation%';

-- For any remaining expenses without category, set to "Other Expenses"
UPDATE expenses 
SET category_id = (SELECT id FROM categories WHERE name = 'Other Expenses' AND type = 'expense' LIMIT 1)
WHERE category_id IS NULL;

SELECT 'Updated ' || COUNT(*) || ' expenses with category IDs' as message FROM expenses WHERE category_id IS NOT NULL;
