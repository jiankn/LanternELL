import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@libsql/client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PDF_DIR = path.join(ROOT, 'data', 'pdfs');

const db = createClient({ url: 'file:local.db' });

async function main() {
    // Get all resources and products for matching
    const resources = await db.execute('SELECT id, slug FROM resources');
    const products = await db.execute('SELECT id, slug FROM products');
    const productsBySlug = new Map(products.rows.map(r => [r.slug, r]));

    const files = fs.readdirSync(PDF_DIR).filter(f => f.endsWith('.pdf'));

    // Group PDF files
    const packs = new Map();
    for (const file of files) {
        if (file.endsWith('-sample.pdf')) {
            const key = file.replace('-sample.pdf', '');
            if (!packs.has(key)) packs.set(key, {});
            packs.get(key).sample = file;
        } else {
            const key = file.replace('.pdf', '');
            if (!packs.has(key)) packs.set(key, {});
            packs.get(key).full = file;
        }
    }

    let localUpdates = 0;
    let d1Sql = '-- Update pdf_url in D1 resources\n';

    for (const [rawKey, { full, sample }] of packs.entries()) {
        const hyphenated = rawKey.replace(/_/g, '-');

        // Find matching product slug
        let productSlug = null;
        if (productsBySlug.has(hyphenated)) {
            productSlug = hyphenated;
        } else {
            // Fuzzy match
            for (const [pSlug] of productsBySlug) {
                if (pSlug.includes(hyphenated) || hyphenated.includes(pSlug)) {
                    productSlug = pSlug;
                    break;
                }
            }
        }

        if (!productSlug) {
            console.log(`⚠️  No product match for: ${hyphenated}`);
            continue;
        }

        // Find the resource that's linked to this product
        const productId = productsBySlug.get(productSlug).id;
        const prResult = await db.execute({
            sql: 'SELECT resource_id FROM product_resources WHERE product_id = ? LIMIT 1',
            args: [productId]
        });

        if (prResult.rows.length === 0) {
            console.log(`⚠️  No resource linked to product: ${productSlug}`);
            continue;
        }

        const resourceId = prResult.rows[0].resource_id;
        const pdfUrl = full ? `pdfs/${full}` : null;
        const sampleUrl = sample ? `samples/${sample}` : null;

        // Update local DB
        await db.execute({
            sql: `UPDATE resources SET pdf_url = ?, sample_pdf_url = ? WHERE id = ?`,
            args: [pdfUrl, sampleUrl, resourceId]
        });
        localUpdates++;

        // Generate D1 SQL 
        const pdfVal = pdfUrl ? `'${pdfUrl}'` : 'NULL';
        const sampleVal = sampleUrl ? `'${sampleUrl}'` : 'NULL';
        d1Sql += `UPDATE resources SET pdf_url = ${pdfVal}, sample_pdf_url = ${sampleVal} WHERE id = '${resourceId}';\n`;

        console.log(`✅ ${productSlug} -> pdf_url=${pdfUrl}`);
    }

    fs.writeFileSync(path.join(ROOT, 'migrations', 'sync_d1_pdf_urls.sql'), d1Sql);
    console.log(`\n✅ Updated ${localUpdates} resources locally.`);
    console.log(`📄 Generated migrations/sync_d1_pdf_urls.sql for D1.`);
}

main().catch(console.error);
