import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@libsql/client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const db = createClient({ url: 'file:local.db' });

async function main() {
    // 1. Export resources
    const resources = await db.execute('SELECT * FROM resources');
    const productResources = await db.execute('SELECT * FROM product_resources');

    let sql = '-- Auto-generated D1 sync script\n';
    sql += '-- Generated: ' + new Date().toISOString() + '\n\n';

    // Resources
    for (const r of resources.rows) {
        const vals = [
            esc(r.id), esc(r.slug), esc(r.title), esc(r.description),
            esc(r.pack_type), esc(r.topic), esc(r.age_band), esc(r.language_pair),
            esc(r.free_or_paid), esc(r.seo_title), esc(r.seo_description),
            esc(r.preview_images), esc(r.pdf_url), esc(r.sample_pdf_url),
            esc(r.created_at), esc(r.updated_at)
        ].join(', ');
        sql += `INSERT OR REPLACE INTO resources (id, slug, title, description, pack_type, topic, age_band, language_pair, free_or_paid, seo_title, seo_description, preview_images, pdf_url, sample_pdf_url, created_at, updated_at) VALUES (${vals});\n`;
    }

    sql += '\n';

    // Product resources mapping
    for (const pr of productResources.rows) {
        const vals = [esc(pr.id), esc(pr.product_id), esc(pr.resource_id), esc(pr.created_at)].join(', ');
        sql += `INSERT OR REPLACE INTO product_resources (id, product_id, resource_id, created_at) VALUES (${vals});\n`;
    }

    const outPath = path.join(ROOT, 'migrations', 'sync_d1_resources.sql');
    fs.writeFileSync(outPath, sql);
    console.log(`✅ Generated ${outPath}`);
    console.log(`   Resources: ${resources.rows.length}`);
    console.log(`   Product-Resource mappings: ${productResources.rows.length}`);
}

function esc(v) {
    if (v === null || v === undefined) return 'NULL';
    return "'" + String(v).replace(/'/g, "''") + "'";
}

main().catch(console.error);
