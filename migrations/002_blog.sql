-- Blog Posts Table
-- Version: 1.0.1
-- Date: 2026-03-07

CREATE TABLE IF NOT EXISTS blog_posts (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    content_md TEXT NOT NULL,
    cover_image_url TEXT,
    author TEXT DEFAULT 'LanternELL Team',
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'archived')),
    seo_title TEXT,
    seo_description TEXT,
    tags TEXT, -- JSON array
    published_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status, published_at DESC);
