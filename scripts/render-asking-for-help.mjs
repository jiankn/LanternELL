import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'data', 'pdfs');
const LOCAL_DEV_URL = 'http://127.0.0.1:3001/api/internal/render-pdf-html';

const packFile = path.join(ROOT, 'data', 'packs', 'asking-for-help_sentence_frames_k-2_en-es.json');

fs.mkdirSync(OUT_DIR, { recursive: true });

async function renderPDF(content) {
    console.log('Rendering PDF for: ' + content.title);

    // Call the Next.js API to get HTML
    console.log('  Requesting HTML from dev server...');
    const res = await fetch(LOCAL_DEV_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packContent: content, mode: 'final' })
    });

    if (!res.ok) {
        const errText = await res.text();
        console.error('API error:', errText.substring(0, 500));
        process.exit(1);
    }

    const html = await res.text();
    console.log('  HTML size: ' + (html.length / 1024).toFixed(1) + ' KB');

    // Save HTML
    const slug = 'asking-for-help-k2';
    const htmlPath = path.join(OUT_DIR, 'FINAL-' + slug + '.html');
    fs.writeFileSync(htmlPath, html);

    // Launch Puppeteer and render PDF
    console.log('  Rendering with Puppeteer...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), {
        waitUntil: 'networkidle2',
        timeout: 60000
    });
    await new Promise(r => setTimeout(r, 2000));

    // Generate PDF - US Letter format
    const pdfPath = path.join(OUT_DIR, 'FINAL-' + slug + '.pdf');
    await page.pdf({
        path: pdfPath,
        format: 'Letter',
        printBackground: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });

    const pdfSizeKB = (fs.statSync(pdfPath).size / 1024).toFixed(0);
    console.log('  PDF saved: ' + pdfPath + ' (' + pdfSizeKB + ' KB)');

    await browser.close();
    return pdfPath;
}

async function main() {
    console.log('========================================');
    console.log('  Render: Asking for Help (K-2)');
    console.log('  Pack Type: Sentence Frames');
    console.log('  No AI images needed');
    console.log('========================================');
    console.log('');

    const content = JSON.parse(fs.readFileSync(packFile, 'utf8'));
    const pdfPath = await renderPDF(content);

    console.log('');
    console.log('========================================');
    console.log('  DONE! ' + pdfPath);
    console.log('========================================');
}

main().catch(e => { console.error('FATAL:', e.message, e.stack); process.exit(1); });
