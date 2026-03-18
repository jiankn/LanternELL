-- Add password_hash to users for email+password auth
-- Version: 1.0.2
-- Date: 2026-03-19

ALTER TABLE users ADD COLUMN password_hash TEXT;
