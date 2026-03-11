import { createClient } from '@libsql/client';
import fs from 'fs';

const db = createClient({ url: 'file:local.db' });

async function main() {
    const resources = await db.execute('SELECT slug, pdf_url, sample_pdf_url FROM resources WHERE pdf_url IS NOT NULL OR sample_pdf_url IS NOT NULL');

    let sql = '-- Update pdf_url and sample_pdf_url for resources\n';
    for (const r of resources.rows) {
        const pdfUrl = r.pdf_url ? `'${String(r.pdf_url).replace(/'/g, "''")}'` : 'NULL';
        const sampleUrl = r.sample_pdf_url ? `'${String(r.sample_pdf_url).replace(/'/g, "''")}'` : 'NULL';
        const slug = String(r.slug).replace(/'/g, "''");
        sql += `UPDATE resources SET pdf_url = ${pdfUrl}, sample_pdf_url = ${sampleUrl} WHERE slug = '${slug}';\n`;
    }

    fs.writeFileSync('migrations/sync_d1_pdf_urls.sql', sql);
    console.log(`Generated ${resources.rows.length} UPDATE statements`);
}

main().catch(console.error);
