import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@libsql/client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PDF_DIR = path.join(ROOT, 'data', 'pdfs');
const PACKS_DIR = path.join(ROOT, 'data', 'packs');

const db = createClient({ url: 'file:local.db' });

async function main() {
    console.log('🔧 Fixing all data issues...\n');

    // Step 1: Load products
    const products = await db.execute('SELECT id, slug, type FROM products WHERE type = \'single\'');
    console.log(`Products (single): ${products.rows.length}`);

    // Step 2: Load JSON packs
    const jsonFiles = fs.readdirSync(PACKS_DIR).filter(f => f.endsWith('.json'));
    console.log(`JSON packs: ${jsonFiles.length}`);

    // Step 3: Load PDF files
    const pdfFiles = fs.readdirSync(PDF_DIR).filter(f => f.endsWith('.pdf'));
    console.log(`PDF files: ${pdfFiles.length}`);

    // Step 4: Build PDF map (rawSlug -> {full, sample})
    const pdfMap = new Map();
    for (const f of pdfFiles) {
        if (f.endsWith('-sample.pdf')) {
            const key = f.replace('-sample.pdf', '');
            if (!pdfMap.has(key)) pdfMap.set(key, {});
            pdfMap.get(key).sample = f;
        } else {
            const key = f.replace('.pdf', '');
            if (!pdfMap.has(key)) pdfMap.set(key, {});
            pdfMap.get(key).full = f;
        }
    }

    // Step 5: Build JSON pack map (title -> pack_id from file)
    const jsonMap = new Map();
    for (const f of jsonFiles) {
        const content = JSON.parse(fs.readFileSync(path.join(PACKS_DIR, f), 'utf8'));
        const rawSlug = f.replace('.json', '');
        jsonMap.set(rawSlug, content);
    }

    // Step 6: For each product, find matching JSON & PDF
    let d1Sql = '-- Fix all resources, product_resources, and pdf_urls\n';
    let updated = 0;

    for (const product of products.rows) {
        const productSlug = product.slug;

        // Find matching JSON file by trying to match product slug to JSON filename (with _ -> -)
        let matchedJsonKey = null;
        let bestScore = 0;

        for (const [jsonKey] of jsonMap) {
            const normalized = jsonKey.replace(/_/g, '-');
            // Check if product slug contains normalized key or vice versa
            if (productSlug === normalized) {
                matchedJsonKey = jsonKey;
                break;
            }
            // Fuzzy: count common segments
            const pParts = productSlug.split('-');
            const jParts = normalized.split('-');
            let common = 0;
            for (const p of pParts) {
                if (jParts.includes(p)) common++;
            }
            const score = common / Math.max(pParts.length, jParts.length);
            if (score > bestScore && score > 0.6) {
                bestScore = score;
                matchedJsonKey = jsonKey;
            }
        }

        if (!matchedJsonKey) {
            console.log(`⚠️  No JSON match for product: ${productSlug}`);
            continue;
        }

        // Find matching PDF
        const pdfs = pdfMap.get(matchedJsonKey);
        if (!pdfs) {
            console.log(`⚠️  No PDFs for: ${matchedJsonKey}`);
            continue;
        }

        const pdfUrl = pdfs.full ? `pdfs/${pdfs.full}` : null;
        const sampleUrl = pdfs.sample ? `samples/${pdfs.sample}` : null;

        // Ensure resource exists with product's slug  
        const existingRes = await db.execute({
            sql: 'SELECT id FROM resources WHERE slug = ?',
            args: [productSlug]
        });

        let resourceId;
        const content = jsonMap.get(matchedJsonKey);

        if (existingRes.rows.length > 0) {
            resourceId = existingRes.rows[0].id;
            // Update
            await db.execute({
                sql: `UPDATE resources SET pdf_url = ?, sample_pdf_url = ?, title = ? WHERE id = ?`,
                args: [pdfUrl, sampleUrl, content.title || productSlug, resourceId]
            });
        } else {
            resourceId = `res_${Date.now().toString(36)}${Math.random().toString(36).substring(2, 8)}`;
            await db.execute({
                sql: `INSERT INTO resources (id, slug, title, description, pack_type, topic, age_band, language_pair, pdf_url, sample_pdf_url) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                args: [
                    resourceId, productSlug,
                    content.title || productSlug,
                    `Bilingual teaching pack: ${productSlug}`,
                    content.type || 'vocabulary_pack',
                    content.topic || 'General',
                    content.age_band || 'K-2',
                    content.language_pair || 'en-es',
                    pdfUrl, sampleUrl
                ]
            });
        }

        // Ensure product_resources link
        const existingPr = await db.execute({
            sql: 'SELECT id FROM product_resources WHERE product_id = ? AND resource_id = ?',
            args: [product.id, resourceId]
        });
        if (existingPr.rows.length === 0) {
            const prId = `pr_${Date.now().toString(36)}${Math.random().toString(36).substring(2, 8)}`;
            await db.execute({
                sql: 'INSERT INTO product_resources (id, product_id, resource_id) VALUES (?, ?, ?)',
                args: [prId, product.id, resourceId]
            });
        }

        // D1 SQL  
        const esc = v => v === null ? 'NULL' : `'${String(v).replace(/'/g, "''")}'`;
        d1Sql += `INSERT OR REPLACE INTO resources (id, slug, title, description, pack_type, topic, age_band, language_pair, pdf_url, sample_pdf_url) VALUES (${esc(resourceId)}, ${esc(productSlug)}, ${esc(content.title || productSlug)}, ${esc('Bilingual teaching pack: ' + productSlug)}, ${esc(content.type || 'vocabulary_pack')}, ${esc(content.topic || 'General')}, ${esc(content.age_band || 'K-2')}, ${esc(content.language_pair || 'en-es')}, ${esc(pdfUrl)}, ${esc(sampleUrl)});\n`;

        // Also ensure product_resources in D1
        const prIds = (await db.execute({
            sql: 'SELECT id FROM product_resources WHERE product_id = ? AND resource_id = ?',
            args: [product.id, resourceId]
        })).rows;
        if (prIds.length > 0) {
            d1Sql += `INSERT OR REPLACE INTO product_resources (id, product_id, resource_id) VALUES (${esc(prIds[0].id)}, ${esc(product.id)}, ${esc(resourceId)});\n`;
        }

        updated++;
        console.log(`✅ ${productSlug} -> pdf=${pdfUrl ? '✓' : '✗'} sample=${sampleUrl ? '✓' : '✗'}`);
    }

    const outPath = path.join(ROOT, 'migrations', 'sync_d1_complete.sql');
    fs.writeFileSync(outPath, d1Sql);
    console.log(`\n🎉 Fixed ${updated} products. SQL saved to ${outPath}`);
}

main().catch(console.error);
