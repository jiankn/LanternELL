import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { createClient } from '@libsql/client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PDF_DIR = path.join(ROOT, 'data', 'pdfs');
const BUCKET_NAME = 'lanternell-files-prod';

// Local dev database
const db = createClient({ url: 'file:local.db' });

async function uploadFile(localPath, remoteKey) {
    console.log(`Uploading ${remoteKey}...`);
    try {
        // Use wrangler CLI to upload
        execSync(`npx wrangler r2 object put ${BUCKET_NAME}/${remoteKey} --file="${localPath}"`, {
            stdio: 'pipe',
            cwd: ROOT
        });
        return `https://files.lanternell.com/${remoteKey}`; // Assuming custom domain is set up, or just store the path
    } catch (err) {
        console.error(`Failed to upload ${remoteKey}:`, err.message);
        throw err;
    }
}

async function main() {
    console.log('🚀 Starting R2 Upload & DB Update...');

    if (!fs.existsSync(PDF_DIR)) {
        console.error(`PDF directory not found: ${PDF_DIR}`);
        return;
    }

    const files = fs.readdirSync(PDF_DIR).filter(f => f.endsWith('.pdf'));

    // Group by pack slug (assuming filename is slug.pdf or slug-sample.pdf)
    const packs = new Map();
    for (const file of files) {
        if (file.endsWith('-sample.pdf')) {
            const slug = file.replace('-sample.pdf', '');
            if (!packs.has(slug)) packs.set(slug, {});
            packs.get(slug).sample = file;
        } else {
            const slug = file.replace('.pdf', '');
            if (!packs.has(slug)) packs.set(slug, {});
            packs.get(slug).final = file;
        }
    }

    console.log(`Found ${packs.size} packs to process.`);

    const productsRes = await db.execute('SELECT id, slug, type FROM products');
    const productsBySlug = new Map(productsRes.rows.map(r => [r.slug, r]));

    for (const [rawSlug, { final, sample }] of packs.entries()) {
        let slug = rawSlug.replace(/_/g, '-');

        // Fallback matched logic
        if (!productsBySlug.has(slug)) {
            const matchingProduct = Array.from(productsBySlug.values()).find(p => p.slug.includes(slug) || slug.includes(p.slug));
            if (matchingProduct) {
                slug = matchingProduct.slug;
            }
        }

        console.log(`\n📦 Processing pack: ${slug}`);
        try {
            let finalUrl = null;
            let sampleUrl = null;

            if (final) {
                const finalPath = path.join(PDF_DIR, final);
                const remoteKey = `pdfs/${final}`;
                await uploadFile(finalPath, remoteKey);
                // Store relative path or absolute URL. Let's store relative for R2 or absolute if needed.
                // The download API uses the pdf_url to fetch. Let's store just the key or full URL? 
                // Usually we store the key or a path. We'll store: pdfs/filename.pdf
                finalUrl = remoteKey;
            }

            if (sample) {
                const samplePath = path.join(PDF_DIR, sample);
                const remoteKey = `samples/${sample}`;
                await uploadFile(samplePath, remoteKey);
                sampleUrl = remoteKey;
            }

            // Update database
            const result = await db.execute({
                sql: `UPDATE resources SET pdf_url = ?, sample_pdf_url = ?, updated_at = datetime('now') WHERE slug = ?`,
                args: [finalUrl, sampleUrl, slug]
            });

            if (result.rowsAffected > 0) {
                console.log(`✅ Updated DB for ${slug}`);
            } else {
                console.log(`⚠️  Warning: No resource found in DB with slug ${slug}`);
            }

        } catch (e) {
            console.error(`❌ Error processing ${slug}:`, e);
        }
    }

    console.log('\n🎉 Finished R2 uploads.');
}

main().catch(console.error);
