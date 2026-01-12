-- Add recurring column to income and expenses tables

ALTER TABLE income 
ADD COLUMN IF NOT EXISTS recurring BOOLEAN DEFAULT FALSE;

ALTER TABLE expenses 
ADD COLUMN IF NOT EXISTS recurring BOOLEAN DEFAULT FALSE;

-- Update comment
COMMENT ON COLUMN income.recurring IS 'Indicates if this is a recurring income';
COMMENT ON COLUMN expenses.recurring IS 'Indicates if this is a recurring expense';
