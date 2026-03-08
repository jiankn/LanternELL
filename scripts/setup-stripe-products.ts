/**
 * LanternELL — Stripe Product & Price Setup Script
 *
 * Usage:
 *   npx tsx scripts/setup-stripe-products.ts
 *
 * Required env:
 *   STRIPE_SECRET_KEY  (sk_test_... for test mode)
 *
 * This script will:
 *   1. Archive (deactivate) ALL existing products in the Stripe account
 *   2. Create 6 new Products + 7 new Prices (standard/plus/premium/mini_bundle/full_bundle + all_access monthly & annual)
 *   3. Print the Price IDs for .env.local configuration
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const STRIPE_API = 'https://api.stripe.com/v1';
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_KEY) {
    console.error('❌ STRIPE_SECRET_KEY not found. Set it in .env.local');
    process.exit(1);
}

function headers(): Record<string, string> {
    return {
        Authorization: `Bearer ${STRIPE_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
    };
}

function encode(data: Record<string, string>): string {
    return Object.entries(data)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&');
}

// -------------------------------------------------------
// Helpers
// -------------------------------------------------------

async function listAllProducts(): Promise<any[]> {
    const all: any[] = [];
    let startingAfter: string | undefined;

    while (true) {
        const params = new URLSearchParams({ limit: '100' });
        if (startingAfter) params.set('starting_after', startingAfter);

        const res = await fetch(`${STRIPE_API}/products?${params}`, { headers: headers() });
        const data = await res.json();

        if (!res.ok) {
            console.error('Failed to list products:', data);
            break;
        }

        all.push(...data.data);
        if (!data.has_more) break;
        startingAfter = data.data[data.data.length - 1].id;
    }

    return all;
}

async function archiveProduct(id: string): Promise<void> {
    const res = await fetch(`${STRIPE_API}/products/${id}`, {
        method: 'POST',
        headers: headers(),
        body: encode({ active: 'false' }),
    });
    if (!res.ok) {
        const err = await res.text();
        console.warn(`  ⚠️  Could not archive ${id}: ${err}`);
    }
}

async function deactivatePrice(id: string): Promise<void> {
    const res = await fetch(`${STRIPE_API}/prices/${id}`, {
        method: 'POST',
        headers: headers(),
        body: encode({ active: 'false' }),
    });
    if (!res.ok) {
        const err = await res.text();
        console.warn(`  ⚠️  Could not deactivate price ${id}: ${err}`);
    }
}

async function listPricesForProduct(productId: string): Promise<any[]> {
    const res = await fetch(`${STRIPE_API}/prices?product=${productId}&limit=100`, {
        headers: headers(),
    });
    const data = await res.json();
    return res.ok ? data.data : [];
}

async function createProduct(name: string, description: string): Promise<string> {
    const res = await fetch(`${STRIPE_API}/products`, {
        method: 'POST',
        headers: headers(),
        body: encode({ name, description }),
    });
    const data = await res.json();
    if (!res.ok) {
        console.error('Failed to create product:', data);
        throw new Error(`Product creation failed: ${name}`);
    }
    return data.id;
}

async function createOneTimePrice(productId: string, amountCents: number, nickname: string): Promise<string> {
    const res = await fetch(`${STRIPE_API}/prices`, {
        method: 'POST',
        headers: headers(),
        body: encode({
            product: productId,
            unit_amount: String(amountCents),
            currency: 'usd',
            nickname,
        }),
    });
    const data = await res.json();
    if (!res.ok) {
        console.error('Failed to create price:', data);
        throw new Error(`Price creation failed: ${nickname}`);
    }
    return data.id;
}

async function createRecurringPrice(
    productId: string,
    amountCents: number,
    interval: 'month' | 'year',
    nickname: string
): Promise<string> {
    const res = await fetch(`${STRIPE_API}/prices`, {
        method: 'POST',
        headers: headers(),
        body: encode({
            product: productId,
            unit_amount: String(amountCents),
            currency: 'usd',
            nickname,
            'recurring[interval]': interval,
        }),
    });
    const data = await res.json();
    if (!res.ok) {
        console.error('Failed to create recurring price:', data);
        throw new Error(`Recurring price creation failed: ${nickname}`);
    }
    return data.id;
}

// -------------------------------------------------------
// Main
// -------------------------------------------------------

async function main() {
    console.log('🚀 LanternELL Stripe Product Setup\n');

    // --- Step 1: Archive existing products ---
    console.log('📦 Step 1: Archiving existing products...');
    const existing = await listAllProducts();
    console.log(`   Found ${existing.length} product(s)`);

    for (const prod of existing) {
        // First deactivate all prices for this product
        const prices = await listPricesForProduct(prod.id);
        for (const price of prices) {
            if (price.active) {
                await deactivatePrice(price.id);
            }
        }
        // Then archive the product
        if (prod.active) {
            await archiveProduct(prod.id);
            console.log(`   ✅ Archived: ${prod.name} (${prod.id})`);
        }
    }

    console.log('');

    // --- Step 2: Create new products & prices ---
    console.log('✨ Step 2: Creating new products & prices...\n');

    const results: Record<string, string> = {};

    // Standard Pack — $3.99
    const standardProd = await createProduct(
        'LanternELL Standard Pack',
        'Basic vocabulary or single-skill printable teaching pack for ELL/bilingual classrooms.'
    );
    results.STRIPE_PRICE_STANDARD = await createOneTimePrice(standardProd, 399, 'Standard Pack $3.99');
    console.log(`   ✅ Standard Pack  → ${results.STRIPE_PRICE_STANDARD}`);

    // Plus Pack — $5.99
    const plusProd = await createProduct(
        'LanternELL Plus Pack',
        'Comprehensive multi-page printable teaching pack for ELL/bilingual classrooms.'
    );
    results.STRIPE_PRICE_PLUS = await createOneTimePrice(plusProd, 599, 'Plus Pack $5.99');
    console.log(`   ✅ Plus Pack      → ${results.STRIPE_PRICE_PLUS}`);

    // Premium Pack — $8.99
    const premiumProd = await createProduct(
        'LanternELL Premium Pack',
        'Large printable teaching pack covering multiple scenarios for ELL/bilingual classrooms.'
    );
    results.STRIPE_PRICE_PREMIUM = await createOneTimePrice(premiumProd, 899, 'Premium Pack $8.99');
    console.log(`   ✅ Premium Pack   → ${results.STRIPE_PRICE_PREMIUM}`);

    // Mini Bundle — $14.99
    const miniBundleProd = await createProduct(
        'LanternELL Mini Bundle',
        'Curated set of 3-4 printable teaching packs grouped by theme or grade.'
    );
    results.STRIPE_PRICE_MINI_BUNDLE = await createOneTimePrice(miniBundleProd, 1499, 'Mini Bundle $14.99');
    console.log(`   ✅ Mini Bundle    → ${results.STRIPE_PRICE_MINI_BUNDLE}`);

    // Full Bundle — $29.99
    const fullBundleProd = await createProduct(
        'LanternELL Full Bundle',
        'Comprehensive set of 8-10 printable teaching packs for ELL/bilingual classrooms.'
    );
    results.STRIPE_PRICE_FULL_BUNDLE = await createOneTimePrice(fullBundleProd, 2999, 'Full Bundle $29.99');
    console.log(`   ✅ Full Bundle    → ${results.STRIPE_PRICE_FULL_BUNDLE}`);

    // All Access — Monthly $9 + Annual $79
    const allAccessProd = await createProduct(
        'LanternELL All Access',
        'Unlimited downloads of every pack in the LanternELL library. New packs added weekly.'
    );
    results.STRIPE_PRICE_MONTHLY = await createRecurringPrice(allAccessProd, 900, 'month', 'All Access Monthly $9');
    console.log(`   ✅ Monthly        → ${results.STRIPE_PRICE_MONTHLY}`);

    results.STRIPE_PRICE_ANNUAL = await createRecurringPrice(allAccessProd, 7900, 'year', 'All Access Annual $79');
    console.log(`   ✅ Annual         → ${results.STRIPE_PRICE_ANNUAL}`);

    // --- Step 3: Output for .env.local ---
    console.log('\n' + '='.repeat(60));
    console.log('📋 Add the following to your .env.local:\n');
    console.log('# --- LanternELL Stripe Price IDs (Three-Tier System) ---');
    for (const [key, value] of Object.entries(results)) {
        console.log(`${key}=${value}`);
    }
    console.log('='.repeat(60));
    console.log('\n✅ Done! All products and prices created successfully.');
}

main().catch((err) => {
    console.error('💥 Script failed:', err);
    process.exit(1);
});
