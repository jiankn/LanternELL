/**
 * LanternELL — Product Catalog Seed Script
 *
 * Seeds 30 single packs + 3 bundles + 1 membership into the products table.
 * Uses the SEED_TOPICS from lib/seed-topics.ts as the source of truth.
 *
 * Usage:
 *   npx tsx scripts/seed-products.ts
 *
 * Prerequisites:
 *   - D1 database with products table (including price_tier column)
 *   - Run migration 006_price_tiers.sql first
 */

import { SEED_TOPICS, type SeedTopic } from '../lib/seed-topics';
import { PRICE_TIERS, type PriceTier } from '../lib/pricing-tiers';

// -------------------------------------------------------
// Slug generation
// -------------------------------------------------------

function slugify(topic: string, packType: string, ageBand: string): string {
    const topicSlug = topic
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    const typeSlug = packType.replace(/_/g, '-');
    const bandSlug = ageBand.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `${topicSlug}-${typeSlug}-${bandSlug}-en-es`;
}

function generateId(prefix: string): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}_${timestamp}${random}`;
}

// -------------------------------------------------------
// Product name / description generation
// -------------------------------------------------------

const packTypeLabels: Record<string, string> = {
    vocabulary_pack: 'Vocabulary Pack',
    sentence_frames: 'Sentence Frames',
    classroom_labels: 'Classroom Labels',
    parent_communication: 'Parent Communication',
};

const packTypeDescriptions: Record<string, (topic: string, ageBand: string) => string> = {
    vocabulary_pack: (topic, ageBand) =>
        `Print-ready bilingual vocabulary cards, matching worksheets, tracing activities, and a mini-book for "${topic}" — designed for ${ageBand} ELL newcomers and bilingual classrooms. English-Spanish.`,
    sentence_frames: (topic, ageBand) =>
        `Bilingual sentence frame cards, dialogue strips, speaking prompts, and writing practice for "${topic}" — designed for ${ageBand} ELL newcomers. English-Spanish.`,
    classroom_labels: (topic, ageBand) =>
        `Bilingual classroom labels in full-size and small formats for "${topic}" — print, cut, and display in your ${ageBand} classroom. English-Spanish.`,
    parent_communication: (topic, ageBand) =>
        `Bilingual parent communication templates for "${topic}" — ready to print and send home. Covers English and Spanish for ${ageBand} classrooms.`,
};

function productName(t: SeedTopic): string {
    return `${t.topic} — ${packTypeLabels[t.pack_type]} (${t.age_band}, EN-ES)`;
}

function productDescription(t: SeedTopic): string {
    const fn = packTypeDescriptions[t.pack_type];
    return fn ? fn(t.topic, t.age_band) : `Printable ELL teaching pack for ${t.topic}.`;
}

// -------------------------------------------------------
// Bundle definitions
// -------------------------------------------------------

interface BundleDef {
    name: string;
    slug: string;
    description: string;
    price_tier: PriceTier;
    /** Indices into SEED_TOPICS that belong to this bundle */
    topicIndices: number[];
}

const BUNDLES: BundleDef[] = [
    {
        name: 'Newcomer Starter Kit',
        slug: 'newcomer-starter-kit-bundle-en-es',
        description:
            'Everything a newcomer student needs in their first weeks: classroom objects, colors, numbers, basic greetings, and asking for help. 5 printable packs, English-Spanish.',
        price_tier: 'mini_bundle',
        // Classroom Objects, Colors, Numbers, Basic Greetings, Asking for Help
        topicIndices: [0, 1, 2, 15, 16],
    },
    {
        name: 'Classroom Essentials — Labels & Signs',
        slug: 'classroom-essentials-labels-bundle-en-es',
        description:
            'Set up your bilingual classroom with all 5 label packs: furniture, supplies, areas, days & months, and time. Print, cut, and display. English-Spanish.',
        price_tier: 'mini_bundle',
        // All 5 classroom labels
        topicIndices: [10, 11, 12, 13, 14],
    },
    {
        name: 'Complete K-5 ELL Teaching Pack',
        slug: 'complete-k5-ell-pack-bundle-en-es',
        description:
            'All 30 printable teaching packs in one bundle — vocabulary, labels, sentence frames, and parent communication for K-5 ELL and bilingual classrooms. English-Spanish. Best value.',
        price_tier: 'full_bundle',
        // All 30 packs
        topicIndices: Array.from({ length: SEED_TOPICS.length }, (_, i) => i),
    },
];

// -------------------------------------------------------
// SQL output
// -------------------------------------------------------

function escapeSQL(str: string): string {
    return str.replace(/'/g, "''");
}

function toISOString(): string {
    return new Date().toISOString().replace('T', ' ').replace('Z', '');
}

function main() {
    const now = toISOString();
    const lines: string[] = [];

    lines.push('-- ============================================');
    lines.push('-- LanternELL Product Catalog Seed');
    lines.push('-- 30 single packs + 3 bundles + 1 membership');
    lines.push(`-- Generated: ${now}`);
    lines.push('-- ============================================');
    lines.push('');
    lines.push('BEGIN TRANSACTION;');
    lines.push('');

    // --- Single packs ---
    lines.push('-- === Single Packs (30) ===');
    const productIds: string[] = [];

    for (let i = 0; i < SEED_TOPICS.length; i++) {
        const t = SEED_TOPICS[i];
        const id = generateId('prod');
        productIds.push(id);
        const slug = slugify(t.topic, t.pack_type, t.age_band);
        const name = escapeSQL(productName(t));
        const desc = escapeSQL(productDescription(t));
        const tierInfo = PRICE_TIERS[t.price_tier];

        lines.push(
            `INSERT INTO products (id, slug, name, description, type, price_cents, price_tier, active, created_at, updated_at)` +
            ` VALUES ('${id}', '${slug}', '${name}', '${desc}', 'single', ${tierInfo.priceCents}, '${t.price_tier}', 1, '${now}', '${now}');`
        );
    }

    lines.push('');

    // --- Bundles ---
    lines.push('-- === Bundles (3) ===');
    const bundleIds: string[] = [];

    for (const b of BUNDLES) {
        const id = generateId('prod');
        bundleIds.push(id);
        const tierInfo = PRICE_TIERS[b.price_tier];
        const name = escapeSQL(b.name);
        const desc = escapeSQL(b.description);

        lines.push(
            `INSERT INTO products (id, slug, name, description, type, price_cents, price_tier, active, created_at, updated_at)` +
            ` VALUES ('${id}', '${b.slug}', '${name}', '${desc}', 'bundle', ${tierInfo.priceCents}, '${b.price_tier}', 1, '${now}', '${now}');`
        );
    }

    lines.push('');

    // --- Membership ---
    lines.push('-- === Membership (1) ===');
    const membershipId = generateId('prod');
    lines.push(
        `INSERT INTO products (id, slug, name, description, type, price_cents, price_tier, active, created_at, updated_at)` +
        ` VALUES ('${membershipId}', 'all-access-membership', 'LanternELL All Access', ` +
        `'Unlimited downloads of every pack in the LanternELL library. New packs added regularly. Cancel anytime.', ` +
        `'membership', 900, 'monthly', 1, '${now}', '${now}');`
    );

    lines.push('');

    // --- Bundle <-> Product resources (for entitlement tracking) ---
    lines.push('-- === Bundle Resource Links ===');
    for (let bi = 0; bi < BUNDLES.length; bi++) {
        const bundle = BUNDLES[bi];
        const bundleId = bundleIds[bi];
        lines.push(`-- Bundle: ${bundle.name}`);
        for (const ti of bundle.topicIndices) {
            const resourceId = generateId('pr');
            lines.push(
                `-- product_resources link: bundle ${bundleId} -> single pack ${productIds[ti]} (${SEED_TOPICS[ti].topic})`
            );
        }
    }

    lines.push('');
    lines.push('COMMIT;');
    lines.push('');

    // --- Summary ---
    lines.push('-- ============================================');
    lines.push('-- Summary:');
    lines.push(`--   Single packs: ${SEED_TOPICS.length}`);
    lines.push(`--   Bundles: ${BUNDLES.length}`);
    lines.push('--   Membership: 1');
    lines.push(`--   Total products: ${SEED_TOPICS.length + BUNDLES.length + 1}`);
    lines.push('-- ============================================');

    // --- Price tier distribution ---
    const tierCounts: Record<string, number> = {};
    for (const t of SEED_TOPICS) {
        tierCounts[t.price_tier] = (tierCounts[t.price_tier] || 0) + 1;
    }
    lines.push('--');
    lines.push('-- Price tier distribution (single packs):');
    for (const [tier, count] of Object.entries(tierCounts)) {
        const info = PRICE_TIERS[tier as PriceTier];
        lines.push(`--   ${tier}: ${count} packs × ${info.priceDisplay} = ${(count * info.priceCents / 100).toFixed(2)} total value`);
    }

    // Output
    const sql = lines.join('\n');
    console.log(sql);

    // Also write to file
    const fs = require('fs');
    const path = require('path');
    const outPath = path.resolve(__dirname, '..', 'migrations', 'seed_products.sql');
    fs.writeFileSync(outPath, sql, 'utf-8');
    console.log(`\n✅ SQL written to: ${outPath}`);
}

main();
