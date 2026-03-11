import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@libsql/client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PACKS_DIR = path.join(ROOT, 'data', 'packs');

const db = createClient({ url: 'file:local.db' });

// Simple ID generator matching the app's db.ts
function generateId(prefix) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 10);
    return `${prefix}_${timestamp}${random}`;
}

const BUNDLE_MAPPINGS = {
    'newcomer-starter-kit-bundle-en-es': [
        'classroom-objects-vocabulary-pack-k-2-en-es',
        'colors-vocabulary-pack-k-2-en-es',
        'numbers-1-20-vocabulary-pack-k-2-en-es',
        'basic-greetings-sentence-frames-k-2-en-es',
        'asking-for-help-sentence-frames-k-2-en-es'
    ],
    'classroom-essentials-labels-bundle-en-es': [
        'classroom-furniture-classroom-labels-k-2-en-es',
        'school-supplies-classroom-labels-k-2-en-es',
        'classroom-areas-classroom-labels-k-2-en-es',
        'days-and-months-classroom-labels-k-2-en-es',
        'time-and-clock-classroom-labels-k-2-en-es'
    ],
    'grade-3-5-academic-pack-bundle-en-es': [
        'science-vocabulary-vocabulary-pack-3-5-en-es',
        'math-vocabulary-vocabulary-pack-3-5-en-es',
        'social-studies-vocabulary-pack-3-5-en-es',
        'reading-and-writing-vocabulary-pack-3-5-en-es',
        'health-and-safety-vocabulary-pack-3-5-en-es',
        'geography-and-maps-vocabulary-pack-3-5-en-es',
        'technology-and-computers-vocabulary-pack-3-5-en-es',
        'arts-and-music-vocabulary-pack-3-5-en-es',
        'academic-discussion-sentence-frames-3-5-en-es',
        'writing-prompts-and-responses-sentence-frames-3-5-en-es',
        'book-reports-and-reading-logs-sentence-frames-3-5-en-es',
        'science-lab-labels-classroom-labels-3-5-en-es'
    ],
    'middle-school-newcomer-pack-bundle-en-es': [
        'academic-vocabulary-vocabulary-pack-6-8-en-es',
        'lab-reports-and-scientific-method-vocabulary-pack-6-8-en-es',
        'career-and-life-skills-vocabulary-pack-6-8-en-es',
        'literary-analysis-sentence-frames-6-8-en-es',
        'research-and-citation-sentence-frames-6-8-en-es'
    ]
};

async function main() {
    console.log('🌱 Seeding missing resources & mappings...');

    // 1. Fetch products mapping
    const productsRes = await db.execute('SELECT id, slug, type FROM products');
    const productsBySlug = new Map(productsRes.rows.map(r => [r.slug, r]));

    const files = fs.readdirSync(PACKS_DIR).filter(f => f.endsWith('.json'));

    // Insert/Update Resources
    let resCount = 0;
    const resourceIdBySlug = new Map();

    for (const file of files) {
        const content = JSON.parse(fs.readFileSync(path.join(PACKS_DIR, file), 'utf8'));
        // The slug in JSON might use underscores instead of hyphens for pack_id
        // Try to match the product slug by converting underscores to hyphens
        let slug = content.pack_id.replace(/_/g, '-');

        // Edge cases manual fix based on file names
        if (!productsBySlug.has(slug)) {
            // Find closest match or keep as is if it's correct
            const matchingProduct = Array.from(productsBySlug.values()).find(p => p.slug.includes(slug) || slug.includes(p.slug));
            if (matchingProduct) {
                slug = matchingProduct.slug;
            }
        }

        const existingRes = await db.execute({
            sql: 'SELECT id FROM resources WHERE slug = ?',
            args: [slug]
        });

        let resId = existingRes.rows[0]?.id;

        if (!resId) {
            resId = generateId('res');
            await db.execute({
                sql: `INSERT INTO resources 
                      (id, slug, title, description, pack_type, topic, age_band, language_pair, created_at)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
                args: [
                    resId,
                    slug,
                    content.title || slug,
                    `Printable bilingual content for ${slug}`,
                    content.type || 'vocabulary_pack', // pack_type
                    content.topic || 'General',
                    content.age_band || 'K-2',
                    content.language_pair || 'en-es'
                ]
            });

            // Also link the single product if it exists
            const product = productsBySlug.get(slug);
            if (product && product.type === 'single') {
                // Check if mapping exists
                const existingMap = await db.execute({
                    sql: 'SELECT id FROM product_resources WHERE product_id = ? AND resource_id = ?',
                    args: [product.id, resId]
                });
                if (existingMap.rows.length === 0) {
                    await db.execute({
                        sql: `INSERT INTO product_resources (id, product_id, resource_id) VALUES (?, ?, ?)`,
                        args: [generateId('pr'), product.id, resId]
                    });
                }
            }

            resCount++;
        }
        resourceIdBySlug.set(slug, resId);
    }
    console.log(`✅ Seeded ${resCount} new resources.`);

    // 2. Map bundles
    let mapCount = 0;
    for (const [bundleSlug, packSlugs] of Object.entries(BUNDLE_MAPPINGS)) {
        const bundleProduct = productsBySlug.get(bundleSlug);
        if (!bundleProduct) {
            console.warn(`Bundle product not found for slug: ${bundleSlug}`);
            continue;
        }

        for (const packSlug of packSlugs) {
            const resId = resourceIdBySlug.get(packSlug);
            if (!resId) {
                console.warn(`Resource not found for pack: ${packSlug}`);
                continue;
            }

            const existingMap = await db.execute({
                sql: 'SELECT id FROM product_resources WHERE product_id = ? AND resource_id = ?',
                args: [bundleProduct.id, resId]
            });
            if (existingMap.rows.length === 0) {
                await db.execute({
                    sql: `INSERT INTO product_resources (id, product_id, resource_id) VALUES (?, ?, ?)`,
                    args: [generateId('pr'), bundleProduct.id, resId]
                });
                mapCount++;
            }
        }
    }

    // "complete-k8-ell-pack-bundle-en-es" gets ALL resources
    const allBundle = productsBySlug.get('complete-k8-ell-pack-bundle-en-es');
    if (allBundle) {
        for (const resId of resourceIdBySlug.values()) {
            const existingMap = await db.execute({
                sql: 'SELECT id FROM product_resources WHERE product_id = ? AND resource_id = ?',
                args: [allBundle.id, resId]
            });
            if (existingMap.rows.length === 0) {
                await db.execute({
                    sql: `INSERT INTO product_resources (id, product_id, resource_id) VALUES (?, ?, ?)`,
                    args: [generateId('pr'), allBundle.id, resId]
                });
                mapCount++;
            }
        }
    }

    console.log(`✅ Seeded ${mapCount} new bundle resource mappings.`);
    console.log('🎉 DB Seeding complete.');
}

main().catch(console.error);
