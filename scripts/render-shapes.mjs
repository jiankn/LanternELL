import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'data', 'pdfs');
const IMG_CACHE_DIR = path.join(OUT_DIR, 'img-cache-shapes');
const LOCAL_DEV_URL = 'http://127.0.0.1:3001/api/internal/render-pdf-html';

const packFile = path.join(ROOT, 'data', 'packs', 'shapes_vocabulary_pack_k-2_en-es.json');

// Map vocabulary en names to generated image files
const BRAIN_DIR = 'C:\\Users\\JKN\\.gemini\\antigravity\\brain\\728436a5-ac28-4eb7-8a83-02c84350dd86';
const IMAGE_MAP = {
    'Circle': 'shape_circle',
    'Square': 'shape_square',
    'Triangle': 'shape_triangle',
    'Rectangle': 'shape_rectangle',
    'Star': 'shape_star',
    'Heart': 'shape_heart',
    'Oval': 'shape_oval',
    'Diamond': 'shape_diamond',
    'Hexagon': 'shape_hexagon',
    'Semicircle': 'shape_semicircle',
};

fs.mkdirSync(IMG_CACHE_DIR, { recursive: true });

// Phase 1: Convert PNG images to compressed JPEG and cache
async function phase1_convertImages(content) {
    const vocab = content.vocabulary || [];
    console.log('Phase 1: Converting ' + vocab.length + ' PNG images to JPEG...');

    for (const item of vocab) {
        const mapKey = item.en;
        const prefix = IMAGE_MAP[mapKey];
        if (!prefix) {
            console.log('  SKIP: No image mapped for "' + mapKey + '"');
            continue;
        }

        // Find the generated PNG file (has timestamp suffix)
        const files = fs.readdirSync(BRAIN_DIR).filter(f => f.startsWith(prefix) && f.endsWith('.png'));
        if (files.length === 0) {
            console.log('  SKIP: No PNG found for "' + mapKey + '"');
            continue;
        }

        const srcFile = path.join(BRAIN_DIR, files[0]);
        const dstFile = path.join(IMG_CACHE_DIR, item.en + '.jpg');

        // Convert PNG -> compressed JPEG 512x512
        const compressed = await sharp(srcFile)
            .resize(512, 512, { fit: 'inside', background: { r: 255, g: 255, b: 255, alpha: 1 } })
            .flatten({ background: { r: 255, g: 255, b: 255 } })
            .jpeg({ quality: 80 })
            .toBuffer();

        fs.writeFileSync(dstFile, compressed);
        const sizeKB = Math.round(compressed.length / 1024);
        console.log('  ' + item.en + ' -> ' + sizeKB + 'KB');
    }
    console.log('  Done!');
}

// Phase 2: Build enriched content and render PDF
async function phase2_renderPDF(content) {
    console.log('');
    console.log('Phase 2: Rendering PDF...');

    // Inject image_data from cached JPEG files
    const enriched = JSON.parse(JSON.stringify(content));
    for (const item of enriched.vocabulary || []) {
        const cacheFile = path.join(IMG_CACHE_DIR, item.en + '.jpg');
        if (fs.existsSync(cacheFile)) {
            const b64 = fs.readFileSync(cacheFile).toString('base64');
            item.image_data = 'data:image/jpeg;base64,' + b64;
        }
    }

    const imageCount = enriched.vocabulary.filter(v => v.image_data).length;
    console.log('  Images loaded: ' + imageCount + '/' + enriched.vocabulary.length);

    // Call the Next.js API to get HTML
    console.log('  Requesting HTML from dev server...');
    const res = await fetch(LOCAL_DEV_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packContent: enriched, mode: 'final' })
    });

    if (!res.ok) {
        const errText = await res.text();
        console.error('API error:', errText.substring(0, 500));
        process.exit(1);
    }

    const html = await res.text();
    console.log('  HTML size: ' + (html.length / 1024).toFixed(1) + ' KB');

    // Save HTML
    const slug = 'shapes-k2';
    const htmlPath = path.join(OUT_DIR, 'FINAL-' + slug + '.html');
    fs.writeFileSync(htmlPath, html);

    // Launch Puppeteer and render PDF
    console.log('  Rendering with Puppeteer...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), {
        waitUntil: 'networkidle2',
        timeout: 120000
    });
    await new Promise(r => setTimeout(r, 3000));

    // Generate PDF - US Letter format
    const pdfPath = path.join(OUT_DIR, 'FINAL-' + slug + '.pdf');
    await page.pdf({
        path: pdfPath,
        format: 'Letter',
        printBackground: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });

    const pdfSizeMB = (fs.statSync(pdfPath).size / 1024 / 1024).toFixed(1);
    console.log('  PDF saved: ' + pdfPath + ' (' + pdfSizeMB + ' MB)');

    await browser.close();
    return pdfPath;
}

async function main() {
    console.log('========================================');
    console.log('  Shapes Vocabulary Pack (K-2)');
    console.log('  10 Kawaii Images + Full PDF');
    console.log('========================================');
    console.log('');

    const content = JSON.parse(fs.readFileSync(packFile, 'utf8'));

    await phase1_convertImages(content);
    const pdfPath = await phase2_renderPDF(content);

    console.log('');
    console.log('========================================');
    console.log('  DONE! ' + pdfPath);
    console.log('========================================');
}

main().catch(e => { console.error('FATAL:', e.message, e.stack); process.exit(1); });
