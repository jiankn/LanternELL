import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'data', 'pdfs');
const IMG_DIR = path.join(ROOT, 'data', 'images');
const LOCAL_DEV_URL = 'http://127.0.0.1:3001/api/internal/render-pdf-html';

const packFile = path.join(ROOT, 'data', 'packs', 'classroom-objects_vocabulary_pack_k-2_en-es.json');
const content = JSON.parse(fs.readFileSync(packFile, 'utf8'));

// Inject base64 images into vocabulary items
function injectImages(packContent) {
    const packSlug = packFile.replace(/.*[\\\/]/, '').replace('.json', '');
    const imgFolder = path.join(IMG_DIR, packSlug);

    if (fs.existsSync(imgFolder) && packContent.vocabulary) {
        for (const item of packContent.vocabulary) {
            // Try to find matching image by english word (lowercase)
            const imgName = item.en.toLowerCase().replace(/\s+/g, '-') + '.png';
            const imgPath = path.join(imgFolder, imgName);
            if (fs.existsSync(imgPath)) {
                const b64 = fs.readFileSync(imgPath).toString('base64');
                item.image_data = `data:image/png;base64,${b64}`;
                console.log(`  🖼️ Injected image for: ${item.en}`);
            }
        }
    }
    return packContent;
}

async function main() {
    console.log('🎨 Rendering test PDF with new template + images...');
    const enriched = injectImages({ ...content });

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    const res = await fetch(LOCAL_DEV_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packContent: enriched, mode: 'sample' })
    });
    if (!res.ok) { console.error('API error:', await res.text()); process.exit(1); }
    const html = await res.text();

    await page.setContent(html, { waitUntil: ['load', 'networkidle0'] });
    await new Promise(r => setTimeout(r, 2000));

    const outPath = path.join(OUT_DIR, 'TEST-v2-with-images.pdf');
    await page.pdf({ path: outPath, format: 'Letter', printBackground: true, margin: { top: '0', right: '0', bottom: '0', left: '0' } });
    console.log(`✅ PDF saved -> ${outPath}`);

    fs.writeFileSync(path.join(OUT_DIR, 'TEST-new-template.html'), html);
    console.log(`✅ HTML saved for inspection`);

    await browser.close();
}
main().catch(e => { console.error('FATAL:', e.message, e.stack); process.exit(1); });
