-- Migration 003: Expand pack_type CHECK constraint for visual_supports and assessment_tools
-- SQLite doesn't support ALTER TABLE ... ALTER COLUMN, so we recreate the table

CREATE TABLE IF NOT EXISTS resources_new (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    pack_type TEXT NOT NULL CHECK(pack_type IN ('vocabulary_pack', 'sentence_frames', 'classroom_labels', 'parent_communication', 'visual_supports', 'assessment_tools')),
    topic TEXT,
    age_band TEXT DEFAULT 'K-2',
    language_pair TEXT DEFAULT 'en-es',
    free_or_paid TEXT DEFAULT 'paid' CHECK(free_or_paid IN ('free', 'paid')),
    seo_title TEXT,
    seo_description TEXT,
    preview_images TEXT,
    pdf_url TEXT,
    sample_pdf_url TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO resources_new SELECT * FROM resources;

DROP TABLE IF EXISTS resources;
ALTER TABLE resources_new RENAME TO resources;

CREATE INDEX IF NOT EXISTS idx_resources_slug ON resources(slug);
CREATE INDEX IF NOT EXISTS idx_resources_pack_type ON resources(pack_type);
CREATE INDEX IF NOT EXISTS idx_resources_topic ON resources(topic);
