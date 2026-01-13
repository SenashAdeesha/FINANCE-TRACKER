-- Migration: Add profile fields to users table
-- This adds the profile information columns to support user registration with complete details

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS first_name VARCHAR(50),
ADD COLUMN IF NOT EXISTS last_name VARCHAR(50),
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS address VARCHAR(255),
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS country VARCHAR(100),
ADD COLUMN IF NOT EXISTS postal_code VARCHAR(20),
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS occupation VARCHAR(100),
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Add comment for documentation
COMMENT ON TABLE users IS 'Users table with authentication credentials and profile information';
COMMENT ON COLUMN users.first_name IS 'User first name';
COMMENT ON COLUMN users.last_name IS 'User last name';
COMMENT ON COLUMN users.phone IS 'User phone number';
COMMENT ON COLUMN users.address IS 'User street address';
COMMENT ON COLUMN users.city IS 'User city';
COMMENT ON COLUMN users.country IS 'User country';
COMMENT ON COLUMN users.postal_code IS 'User postal/zip code';
COMMENT ON COLUMN users.date_of_birth IS 'User date of birth';
COMMENT ON COLUMN users.occupation IS 'User occupation/job title';
COMMENT ON COLUMN users.bio IS 'User biography/description';
