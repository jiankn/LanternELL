-- LanternELL Database Migration
-- Version: 1.0.0
-- Date: 2026-03-06

-- ============================================
-- CORE ACCOUNT TABLES
-- ============================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'customer' CHECK(role IN ('customer', 'admin')),
    stripe_customer_id TEXT UNIQUE,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token_hash TEXT UNIQUE NOT NULL,
    expires_at TEXT NOT NULL,
    revoked_at TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_sessions_user_expires ON sessions(user_id, expires_at);

-- Magic links table
CREATE TABLE IF NOT EXISTS auth_magic_links (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    token_hash TEXT UNIQUE NOT NULL,
    redirect_to TEXT,
    expires_at TEXT NOT NULL,
    used_at TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- ============================================
-- CONTENT & PRODUCTS TABLES
-- ============================================

-- Resources (printable packs)
CREATE TABLE IF NOT EXISTS resources (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    pack_type TEXT NOT NULL CHECK(pack_type IN ('vocabulary_pack', 'sentence_frames', 'classroom_labels', 'parent_communication')),
    topic TEXT,
    age_band TEXT DEFAULT 'K-2',
    language_pair TEXT DEFAULT 'en-es',
    free_or_paid TEXT DEFAULT 'paid' CHECK(free_or_paid IN ('free', 'paid')),
    seo_title TEXT,
    seo_description TEXT,
    preview_images TEXT, -- JSON array
    pdf_url TEXT,
    sample_pdf_url TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_resources_slug ON resources(slug);
CREATE INDEX IF NOT EXISTS idx_resources_pack_type ON resources(pack_type);
CREATE INDEX IF NOT EXISTS idx_resources_topic ON resources(topic);

-- Packs JSON (content schema)
CREATE TABLE IF NOT EXISTS packs_json (
    id TEXT PRIMARY KEY,
    resource_id TEXT NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    content_json TEXT NOT NULL, -- Full pack content as JSON
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'review', 'published', 'archived')),
    reviewed_by TEXT,
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Products (for sale)
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('single', 'bundle', 'membership', 'license')),
    name TEXT NOT NULL,
    description TEXT,
    stripe_product_id TEXT UNIQUE,
    stripe_price_id TEXT UNIQUE,
    price_cents INTEGER NOT NULL DEFAULT 0,
    active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_stripe_price ON products(stripe_price_id);

-- Product-Resource mapping (for bundles)
CREATE TABLE IF NOT EXISTS product_resources (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    resource_id TEXT NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    created_at TEXT DEFAULT (datetime('now'))
);

-- ============================================
-- ORDERS & PAYMENTS TABLES
-- ============================================

-- Orders
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    stripe_checkout_session_id TEXT UNIQUE,
    stripe_payment_intent_id TEXT,
    stripe_customer_id TEXT,
    order_type TEXT DEFAULT 'single' CHECK(order_type IN ('single', 'bundle', 'membership', 'license')),
    status TEXT DEFAULT 'checkout_created' CHECK(status IN ('checkout_created', 'payment_pending', 'paid', 'fulfilled', 'failed', 'refunded', 'canceled')),
    currency TEXT DEFAULT 'usd',
    amount_subtotal_cents INTEGER DEFAULT 0,
    amount_tax_cents INTEGER DEFAULT 0,
    amount_total_cents INTEGER DEFAULT 0,
    customer_email TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON orders(stripe_checkout_session_id);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES products(id),
    resource_id TEXT REFERENCES resources(id),
    quantity INTEGER DEFAULT 1,
    price_cents INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES products(id),
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT UNIQUE,
    stripe_price_id TEXT,
    status TEXT DEFAULT 'incomplete' CHECK(status IN ('incomplete', 'active', 'past_due', 'canceled', 'unpaid', 'expired')),
    current_period_start TEXT,
    current_period_end TEXT,
    cancel_at_period_end INTEGER DEFAULT 0,
    canceled_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);

-- Entitlements (access permissions)
CREATE TABLE IF NOT EXISTS entitlements (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES products(id),
    resource_id TEXT REFERENCES resources(id),
    source_type TEXT NOT NULL CHECK(source_type IN ('purchase', 'subscription', 'manual', 'license')),
    source_id TEXT,
    access_level TEXT DEFAULT 'full' CHECK(access_level IN ('full', 'limited', 'sample')),
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'revoked', 'expired')),
    starts_at TEXT DEFAULT (datetime('now')),
    ends_at TEXT,
    revoked_at TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_entitlements_user_status ON entitlements(user_id, status, ends_at);

-- ============================================
-- DOWNLOADS & FILES TABLES
-- ============================================

-- Download tokens
CREATE TABLE IF NOT EXISTS download_tokens (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resource_id TEXT NOT NULL REFERENCES resources(id),
    token TEXT UNIQUE NOT NULL,
    expires_at TEXT NOT NULL,
    used_at TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_download_tokens_expires ON download_tokens(expires_at);

-- Download history
CREATE TABLE IF NOT EXISTS downloads (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resource_id TEXT NOT NULL REFERENCES resources(id),
    created_at TEXT DEFAULT (datetime('now'))
);

-- ============================================
-- WEBHOOKS & EVENTS TABLES
-- ============================================

-- Webhook events (for idempotency)
CREATE TABLE IF NOT EXISTS webhook_events (
    id TEXT PRIMARY KEY,
    provider TEXT DEFAULT 'stripe' CHECK(provider IN ('stripe', 'resend')),
    event_id TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    payload_json TEXT,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'processing', 'processed', 'failed')),
    processed_at TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_id ON webhook_events(event_id);

-- ============================================
-- MARKETING & LEADS TABLES
-- ============================================

-- Email leads
CREATE TABLE IF NOT EXISTS email_leads (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    source_page TEXT,
    lead_magnet TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_email_leads_email ON email_leads(email);

-- ============================================
-- JOBS & TASKS TABLES
-- ============================================

-- Content generation jobs
CREATE TABLE IF NOT EXISTS content_jobs (
    id TEXT PRIMARY KEY,
    job_id TEXT UNIQUE NOT NULL,
    topic TEXT NOT NULL,
    pack_type TEXT NOT NULL,
    language_pair TEXT DEFAULT 'en-es',
    age_band TEXT DEFAULT 'K-2',
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'processing', 'completed', 'failed')),
    result_json TEXT,
    error_message TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Render jobs (PDF/preview generation)
CREATE TABLE IF NOT EXISTS render_jobs (
    id TEXT PRIMARY KEY,
    job_id TEXT UNIQUE NOT NULL,
    resource_id TEXT NOT NULL REFERENCES resources(id),
    render_targets TEXT NOT NULL, -- JSON array: ["final_pdf", "sample_pdf", "preview_images"]
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'processing', 'completed', 'failed')),
    result_json TEXT,
    error_message TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);
