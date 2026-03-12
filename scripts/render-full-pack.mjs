import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'data', 'pdfs');
const IMG_CACHE_DIR = path.join(OUT_DIR, 'img-cache');
const LOCAL_DEV_URL = 'http://127.0.0.1:3001/api/internal/render-pdf-html';

const packFile = path.join(ROOT, 'data', 'packs', 'classroom-objects_vocabulary_pack_k-2_en-es.json');

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) { console.error("No GEMINI_API_KEY in .env.local"); process.exit(1); }

const baseUrl = process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta';
const MODEL = 'imagen-4.0-fast-generate-001';

const STYLE_PROMPTS = {
    'K-2': 'kawaii style, cute round character, soft pastel colors, simple clean illustration, white background, adorable, child friendly',
    '3-5': 'flat vector illustration, modern clean design, vibrant colors, geometric shapes, white background, educational style',
    '6-8': 'anime style illustration, cell shaded, vibrant colors, detailed, Japanese animation style, white background',
};

fs.mkdirSync(IMG_CACHE_DIR, { recursive: true });

async function generateImage(prompt) {
    const url = baseUrl + '/models/' + MODEL + ':predict?key=' + apiKey;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            instances: [{ prompt: prompt }],
            parameters: { sampleCount: 1, aspectRatio: "1:1" }
        }),
        signal: AbortSignal.timeout(60000)
    });

    if (!response.ok) {
        throw new Error('API ' + response.status + ': ' + (await response.text()).substring(0, 200));
    }

    const data = await response.json();
    if (data.predictions && data.predictions[0] && data.predictions[0].bytesBase64Encoded) {
        return data.predictions[0].bytesBase64Encoded;
    }
    throw new Error('No image in response');
}

// ======== PHASE 1: Generate images and cache to disk ========
async function phase1_generateImages(content) {
    const ageBand = content.age_band || 'K-2';
    const stylePrompt = STYLE_PROMPTS[ageBand] || STYLE_PROMPTS['K-2'];
    const vocab = content.vocabulary || [];
    const total = vocab.length;

    console.log('Phase 1: Generating AI images (' + total + ' items)...');

    let generated = 0;
    let skipped = 0;

    for (let i = 0; i < total; i++) {
        const item = vocab[i];
        const cacheFile = path.join(IMG_CACHE_DIR, item.en + '.png');

        // Skip if already cached on disk
        if (fs.existsSync(cacheFile)) {
            skipped++;
            console.log('  [' + (i+1) + '/' + total + '] ' + item.en + ' -> cached, skipping');
            continue;
        }

        const objectDesc = item.image_prompt || ('a ' + item.en);
        const fullPrompt = objectDesc + ', ' + stylePrompt;

        console.log('  [' + (i+1) + '/' + total + '] Generating: ' + item.en + '...');

        try {
            const b64 = await generateImage(fullPrompt);
            fs.writeFileSync(cacheFile, Buffer.from(b64, 'base64'));
            generated++;
            console.log('    -> OK (saved to cache)');

            if (i < total - 1) await new Promise(r => setTimeout(r, 2000));
        } catch (e) {
            console.error('    -> FAILED: ' + e.message);
        }
    }

    console.log('  Result: ' + generated + ' new, ' + skipped + ' cached, ' + (total - generated - skipped) + ' failed');
    return vocab;
}

// ======== PHASE 2: Build enriched content from cache and render PDF ========
async function phase2_renderPDF(content) {
    console.log('');
    console.log('Phase 2: Rendering PDF...');

    // Inject image_data from cached files
    const enriched = JSON.parse(JSON.stringify(content)); // deep clone
    for (const item of enriched.vocabulary || []) {
        const cacheFile = path.join(IMG_CACHE_DIR, item.en + '.png');
        if (fs.existsSync(cacheFile)) {
            const b64 = fs.readFileSync(cacheFile).toString('base64');
            item.image_data = 'data:image/png;base64,' + b64;
        }
    }

    const imageCount = enriched.vocabulary.filter(v => v.image_data).length;
    console.log('  Images loaded from cache: ' + imageCount + '/' + enriched.vocabulary.length);

    // Call the Next.js API to get HTML
    console.log('  Requesting HTML from dev server...');
    const res = await fetch(LOCAL_DEV_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packContent: enriched, mode: 'sample' })
    });

    if (!res.ok) {
        console.error('API error:', await res.text());
        process.exit(1);
    }

    const html = await res.text();
    console.log('  HTML received (' + (html.length / 1024 / 1024).toFixed(1) + ' MB)');

    // Save HTML to file first
    const htmlPath = path.join(OUT_DIR, 'FINAL-classroom-objects-k2-kawaii.html');
    fs.writeFileSync(htmlPath, html);
    console.log('  HTML saved: ' + htmlPath);

    // Launch Puppeteer and load HTML from file (avoids setContent timeout)
    console.log('  Loading into Puppeteer...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), {
        waitUntil: 'networkidle2',
        timeout: 120000
    });
    await new Promise(r => setTimeout(r, 3000));

    // Generate PDF
    const pdfPath = path.join(OUT_DIR, 'FINAL-classroom-objects-k2-kawaii.pdf');
    await page.pdf({
        path: pdfPath,
        format: 'Letter',
        printBackground: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });
    console.log('  PDF saved: ' + pdfPath);

    await browser.close();
    return pdfPath;
}

async function main() {
    console.log('========================================');
    console.log('  Imagen 4 Fast + Kawaii Style PDF');
    console.log('  Pack: classroom-objects (K-2)');
    console.log('========================================');
    console.log('');

    const content = JSON.parse(fs.readFileSync(packFile, 'utf8'));

    await phase1_generateImages(content);
    const pdfPath = await phase2_renderPDF(content);

    console.log('');
    console.log('========================================');
    console.log('  DONE! Open the PDF:');
    console.log('  ' + pdfPath);
    console.log('========================================');
}

main().catch(e => { console.error('FATAL:', e.message, e.stack); process.exit(1); });
