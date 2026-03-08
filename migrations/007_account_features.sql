-- Account Features Migration
-- Version: 007
-- Date: 2026-03-09

-- ============================================
-- FAVORITES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS favorites (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resource_id TEXT NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(user_id, resource_id)
);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);

-- ============================================
-- USER PREFERENCES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS user_preferences (
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    email_notifications INTEGER DEFAULT 1,
    marketing_emails INTEGER DEFAULT 0,
    language TEXT DEFAULT 'en',
    timezone TEXT DEFAULT 'America/New_York',
    download_format TEXT DEFAULT 'pdf',
    updated_at TEXT DEFAULT (datetime('now'))
);
