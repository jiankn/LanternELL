-- Add price_tier column to products table
-- Maps each product to a fixed pricing tier for simplified Stripe integration

ALTER TABLE products ADD COLUMN price_tier TEXT
  CHECK(price_tier IN ('standard', 'plus', 'premium', 'mini_bundle', 'full_bundle', 'monthly', 'annual'));
