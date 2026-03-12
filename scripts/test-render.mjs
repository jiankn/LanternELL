import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'data', 'pdfs');
const LOCAL_DEV_URL = 'http://127.0.0.1:3001/api/internal/render-pdf-html';

const packFile = path.join(ROOT, 'data', 'packs', 'classroom-objects_vocabulary_pack_k-2_en-es.json');
const content = JSON.parse(fs.readFileSync(packFile, 'utf8'));

async function main() {
    console.log('🎨 Rendering test PDF with new template...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    // Render sample version
    const res = await fetch(LOCAL_DEV_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packContent: content, mode: 'sample' })
    });
    if (!res.ok) { console.error('API error:', await res.text()); process.exit(1); }
    const html = await res.text();

    await page.setContent(html, { waitUntil: ['load', 'networkidle0'] });
    await new Promise(r => setTimeout(r, 2000));

    const outPath = path.join(OUT_DIR, 'TEST-new-template-sample.pdf');
    await page.pdf({ path: outPath, format: 'Letter', printBackground: true, margin: { top: '0', right: '0', bottom: '0', left: '0' } });
    console.log(`✅ Saved -> ${outPath}`);

    // Also save HTML for quick inspection
    fs.writeFileSync(path.join(OUT_DIR, 'TEST-new-template.html'), html);
    console.log(`✅ HTML saved for inspection`);

    await browser.close();
}
main().catch(console.error);
