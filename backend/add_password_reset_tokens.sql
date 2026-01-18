-- Migration: Add password reset tokens to users table
-- This adds support for password reset functionality

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMP;

-- Add comment for documentation
COMMENT ON COLUMN users.reset_token IS 'Token for password reset';
COMMENT ON COLUMN users.reset_token_expires IS 'Expiration time for reset token';
