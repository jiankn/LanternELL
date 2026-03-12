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

// A dictionary of premium-looking SVG icons for common classroom objects
const SVG_ICONS = {
    'pencil': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>`,
    'book': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#4ECDC4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>`,
    'chair': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 10V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v5"/><path d="M3 10h18v4H3v-4z"/><path d="M5 14v7"/><path d="M19 14v7"/></svg>`,
    'table': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#34D399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h18"/><path d="M5 8v12"/><path d="M19 8v12"/><path d="M3 8v-2a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2"/></svg>`,
    'crayon': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#F472B6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 3.5a2.828 2.828 0 0 1 4 4L9.5 19.5 4 21l1.5-5.5L17.5 3.5Z"/><path d="m15 5 4 4"/><path d="M7 13l4 4"/><path d="M11 17l4-4"/></svg>`,
    'paper': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
    'scissors': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><line x1="20" y1="4" x2="8.12" y2="15.88"></line><line x1="14.47" y1="14.48" x2="20" y2="20"></line><line x1="8.12" y1="8.12" x2="12" y2="12"></line></svg>`,
    'glue': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#EAB308" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="8" width="12" height="14" rx="2"/><path d="M9 8V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4"/><line x1="9" y1="14" x2="15" y2="14"/></svg>`,
    // Fallback for any other word
    'default': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`
};

function injectSvgImages(packContent) {
    if (packContent.vocabulary) {
        for (const item of packContent.vocabulary) {
            const key = Object.keys(SVG_ICONS).find(k => item.en.toLowerCase().includes(k)) || 'default';
            const svgString = SVG_ICONS[key];

            // Fix stroke width and add some padding to make it look nicer in the card
            const stylizedSvg = svgString
                .replace('stroke-width="2"', 'stroke-width="1.5"')
                .replace('<svg ', '<svg width="100%" height="80%" ');

            const b64 = Buffer.from(stylizedSvg).toString('base64');
            item.image_data = `data:image/svg+xml;base64,${b64}`;
            console.log(`  🖍️ Injected SVG for: ${item.en}`);
        }
    }
    return packContent;
}

async function main() {
    console.log('🎨 Rendering test PDF with SVG images...');
    const enriched = injectSvgImages({ ...content });

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    console.log('  Fetching from local dev server...');
    const res = await fetch(LOCAL_DEV_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packContent: enriched, mode: 'sample' })
    });

    if (!res.ok) { console.error('API error:', await res.text()); process.exit(1); }
    const html = await res.text();

    console.log('  Loading into Puppeteer...');
    await page.setContent(html, { waitUntil: ['load', 'networkidle0'] });
    await new Promise(r => setTimeout(r, 1000));

    const outPath = path.join(OUT_DIR, 'TEST-v3-with-svg.pdf');
    await page.pdf({ path: outPath, format: 'Letter', printBackground: true, margin: { top: '0', right: '0', bottom: '0', left: '0' } });
    console.log(`✅ PDF saved -> ${outPath}`);

    fs.writeFileSync(path.join(OUT_DIR, 'TEST-svg-template.html'), html);
    console.log(`✅ HTML saved for inspection`);

    await browser.close();
    process.exit(0);
}

main().catch(e => { console.error('FATAL:', e.message, e.stack); process.exit(1); });
