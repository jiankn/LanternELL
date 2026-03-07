/**
 * seed-stripe-products.cjs
 * 
 * Batch-creates Stripe products + prices, then writes stripe_product_id / stripe_price_id
 * back into the Cloudflare D1 products table.
 *
 * Usage:
 *   node scripts/seed-stripe-products.cjs
 *
 * Requires env vars (set in .env.local or pass inline):
 *   STRIPE_SECRET_KEY=sk_test_xxx   (or sk_live_xxx)
 *   D1_DATABASE=lanternell-prod     (default)
 *
 * What it does:
 *   1. For each SKU defined below, calls Stripe REST API to create Product + Price
 *   2. Runs `wrangler d1 execute` to INSERT/UPDATE the products table in remote D1
 */

const { execSync } = require('child_process');

// ─── Config ───────────────────────────────────────────────────────
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
if (!STRIPE_KEY) {
  console.error('❌ Set STRIPE_SECRET_KEY env var first.\n   Example: STRIPE_SECRET_KEY=sk_test_xxx node scripts/seed-stripe-products.cjs');
  process.exit(1);
}

const D1_DB = process.env.D1_DATABASE || 'lanternell-prod';
const STRIPE_API = 'https://api.stripe.com/v1';

// ─── SKU Definitions ──────────────────────────────────────────────
const SKUS = [
  // ── Singles ($3.99 – $7.99) ──
  { slug: 'classroom-objects-vocab-es', type: 'single', name: 'Classroom Objects Vocabulary Pack (English-Spanish, K-2)', desc: 'Bilingual vocabulary cards, matching activities, and mini-book for classroom objects. 20+ pages, print-ready.', cents: 499, packType: 'vocabulary_pack', topic: 'classroom objects', ageBand: 'K-2', lang: 'en-es' },
  { slug: 'school-routines-vocab-es', type: 'single', name: 'School Routines Vocabulary Pack (English-Spanish, K-2)', desc: 'Daily routine cards, sequencing strips, and visual schedule for newcomers. 18+ pages.', cents: 499, packType: 'vocabulary_pack', topic: 'school routines', ageBand: 'K-2', lang: 'en-es' },
  { slug: 'feelings-emotions-pack-es', type: 'single', name: 'Feelings & Emotions Pack (English-Spanish, K-2)', desc: 'Emotion cards, feelings check-in sheets, and sentence frames for social-emotional learning.', cents: 399, packType: 'vocabulary_pack', topic: 'feelings', ageBand: 'K-2', lang: 'en-es' },
  { slug: 'numbers-colors-pack-es', type: 'single', name: 'Numbers & Colors Pack (English-Spanish, Pre-K–1)', desc: 'Number cards 1-20, color vocabulary, tracing worksheets, and matching games.', cents: 399, packType: 'vocabulary_pack', topic: 'numbers and colors', ageBand: 'Pre-K-1', lang: 'en-es' },
  { slug: 'food-vocabulary-pack-es', type: 'single', name: 'Food Vocabulary Pack (English-Spanish, K-3)', desc: 'Food group cards, menu reading activity, and bilingual grocery list worksheet.', cents: 499, packType: 'vocabulary_pack', topic: 'food', ageBand: 'K-3', lang: 'en-es' },
  { slug: 'family-members-pack-es', type: 'single', name: 'Family Members Pack (English-Spanish, K-2)', desc: 'Family tree template, vocabulary cards, and "About My Family" writing frames.', cents: 499, packType: 'vocabulary_pack', topic: 'family', ageBand: 'K-2', lang: 'en-es' },
  { slug: 'classroom-labels-set-es', type: 'single', name: 'Classroom Labels Set (English-Spanish)', desc: '60+ bilingual labels for classroom objects, areas, and supplies. Print, cut, and post.', cents: 599, packType: 'classroom_labels', topic: 'classroom labels', ageBand: 'K-5', lang: 'en-es' },
  { slug: 'sentence-frames-starter-es', type: 'single', name: 'Sentence Frames Starter Pack (English-Spanish, K-3)', desc: '30+ sentence frame cards for classroom participation, questions, and daily conversation.', cents: 599, packType: 'sentence_frames', topic: 'sentence frames', ageBand: 'K-3', lang: 'en-es' },
  { slug: 'parent-communication-es', type: 'single', name: 'Parent Communication Sheets (English-Spanish)', desc: 'Bilingual parent letters, conference forms, homework notes, and permission slips.', cents: 799, packType: 'parent_communication', topic: 'parent communication', ageBand: 'K-5', lang: 'en-es' },
  { slug: 'newcomer-survival-minibook-es', type: 'single', name: 'Newcomer Survival Mini-Book (English-Spanish, K-2)', desc: 'Fold-and-staple mini-book with essential school phrases, bathroom pass, and help cards.', cents: 599, packType: 'vocabulary_pack', topic: 'newcomer survival', ageBand: 'K-2', lang: 'en-es' },

  // ── Bundles ──
  { slug: 'k2-newcomer-starter-bundle', type: 'bundle', name: 'K-2 Newcomer Starter Bundle (10 Packs)', desc: 'Everything a newcomer needs for their first month: vocabulary, labels, sentence frames, parent letters, and survival mini-book. Save 40%.', cents: 2900 },
  { slug: 'classroom-essentials-bundle', type: 'bundle', name: 'Classroom Essentials Bundle (6 Packs)', desc: 'Core classroom resources: labels, routines, feelings, sentence frames, and parent communication. Save 30%.', cents: 1900 },

  // ── Memberships ──
  { slug: 'all-access-monthly', type: 'membership', name: 'LanternELL All Access (Monthly)', desc: 'Unlimited downloads of every pack in the library. New packs added weekly. Cancel anytime.', cents: 900, interval: 'month' },
  { slug: 'all-access-annual', type: 'membership', name: 'LanternELL All Access (Annual)', desc: 'Unlimited downloads for a full year. Save vs monthly. New packs added weekly.', cents: 9900, interval: 'year' },
];

// ─── Stripe API helpers ───────────────────────────────────────────
function encode(obj, prefix = '') {
  const parts = [];
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    const key = prefix ? `${prefix}[${k}]` : k;
    if (typeof v === 'object' && !Array.isArray(v)) {
      parts.push(encode(v, key));
    } else {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`);
    }
  }
  return parts.filter(Boolean).join('&');
}

async function stripePost(path, data) {
  const res = await fetch(`${STRIPE_API}${path}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${STRIPE_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: encode(data),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Stripe ${path} failed (${res.status}): ${text}`);
  }
  return res.json();
}

function d1Execute(sql) {
  // Escape single quotes for shell
  const escaped = sql.replace(/'/g, "''");
  const cmd = `npx wrangler d1 execute ${D1_DB} --remote --command="${sql}"`;
  console.log(`  D1> ${sql.substring(0, 120)}...`);
  execSync(cmd, { stdio: 'inherit' });
}

function genId(prefix) {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 10);
  return `${prefix}_${ts}${rand}`;
}

// ─── Main ─────────────────────────────────────────────────────────
async function main() {
  console.log(`\n🚀 Seeding ${SKUS.length} products to Stripe + D1...\n`);
  console.log(`   Stripe key: ${STRIPE_KEY.substring(0, 12)}...`);
  console.log(`   D1 database: ${D1_DB}\n`);

  let created = 0;
  let failed = 0;

  for (const sku of SKUS) {
    try {
      console.log(`── ${sku.name}`);

      // 1. Create Stripe Product
      const product = await stripePost('/products', {
        name: sku.name,
        description: sku.desc,
        metadata: { app_slug: sku.slug, app_type: sku.type },
      });
      console.log(`   ✅ Product: ${product.id}`);

      // 2. Create Stripe Price
      const priceData = {
        product: product.id,
        currency: 'usd',
        unit_amount: sku.cents,
      };
      if (sku.interval) {
        priceData.recurring = { interval: sku.interval };
      }
      const price = await stripePost('/prices', priceData);
      console.log(`   ✅ Price: ${price.id} ($${(sku.cents / 100).toFixed(2)}${sku.interval ? '/' + sku.interval : ''})`);

      // 3. Upsert into D1 products table
      const productId = genId('prod');
      const sql = `INSERT INTO products (id, slug, type, name, description, stripe_product_id, stripe_price_id, price_cents, active) VALUES ('${productId}', '${sku.slug}', '${sku.type}', '${sku.name.replace(/'/g, "''")}', '${sku.desc.replace(/'/g, "''")}', '${product.id}', '${price.id}', ${sku.cents}, 1) ON CONFLICT(slug) DO UPDATE SET stripe_product_id='${product.id}', stripe_price_id='${price.id}', price_cents=${sku.cents}, name='${sku.name.replace(/'/g, "''")}', active=1`;
      d1Execute(sql);

      // 4. If it's a single pack, also create a resource entry
      if (sku.packType) {
        const resId = genId('res');
        const resSql = `INSERT OR IGNORE INTO resources (id, slug, title, description, pack_type, topic, age_band, language_pair, free_or_paid) VALUES ('${resId}', '${sku.slug}', '${sku.name.replace(/'/g, "''")}', '${sku.desc.replace(/'/g, "''")}', '${sku.packType}', '${sku.topic}', '${sku.ageBand}', '${sku.lang}', 'paid')`;
        d1Execute(resSql);

        // Link resource to product
        const prId = genId('pr');
        const linkSql = `INSERT OR IGNORE INTO product_resources (id, product_id, resource_id) SELECT '${prId}', p.id, r.id FROM products p, resources r WHERE p.slug='${sku.slug}' AND r.slug='${sku.slug}'`;
        d1Execute(linkSql);
      }

      created++;
      console.log('');
    } catch (err) {
      console.error(`   ❌ Failed: ${err.message}\n`);
      failed++;
    }
  }

  console.log(`\n${'═'.repeat(50)}`);
  console.log(`✅ Created: ${created}  ❌ Failed: ${failed}`);
  console.log(`${'═'.repeat(50)}\n`);

  if (created > 0) {
    console.log('Next steps:');
    console.log('  1. Register webhook in Stripe Dashboard → Developers → Webhooks');
    console.log('     URL: https://lanternell-web.jiankn.workers.dev/api/stripe/webhook');
    console.log('  2. npx wrangler secret put STRIPE_WEBHOOK_SECRET');
    console.log('  3. Redeploy: node scripts/build-cf.cjs');
    console.log('');
  }
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
