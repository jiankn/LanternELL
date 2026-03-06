ALTER TABLE packs_json ADD COLUMN created_at TEXT;

UPDATE packs_json
SET created_at = COALESCE(created_at, updated_at, datetime('now'))
WHERE created_at IS NULL;

CREATE TABLE IF NOT EXISTS preview_assets (
    id TEXT PRIMARY KEY,
    resource_id TEXT NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    asset_type TEXT NOT NULL CHECK(asset_type IN ('cover', 'preview_image', 'sample_pdf', 'final_pdf', 'html_document')),
    object_key TEXT,
    mime_type TEXT,
    page_number INTEGER,
    metadata_json TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_preview_assets_resource_type
ON preview_assets(resource_id, asset_type, page_number);
