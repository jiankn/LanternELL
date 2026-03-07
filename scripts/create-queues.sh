#!/bin/bash
# Create Cloudflare Queues for LanternELL
# Run this once before first deploy

set -e

echo "Creating Cloudflare Queues..."

npx wrangler queues create lanternell-content 2>/dev/null || echo "lanternell-content already exists"
npx wrangler queues create lanternell-render  2>/dev/null || echo "lanternell-render already exists"
npx wrangler queues create lanternell-email   2>/dev/null || echo "lanternell-email already exists"
npx wrangler queues create lanternell-webhook 2>/dev/null || echo "lanternell-webhook already exists"

echo "Done! All queues created."
