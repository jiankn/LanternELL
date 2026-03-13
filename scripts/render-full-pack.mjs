import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import sharp from 'sharp';
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

const baseUrl = 'https://aiplatform.googleapis.com/v1/publishers/google/models';
const MODEL = 'imagen-4.0-fast-generate-001';

// American kids love these styles:
// K-2: Pixar/Disney Junior/PBS Kids style - bright, friendly, slightly 3D, warm colors
// 3-5: Duolingo/Khan Academy flat vector - clean, modern, educational
// 6-8: Anime/manga style - detailed, dynamic
const STYLE_PROMPTS = {
    'K-2': 'friendly children cartoon illustration, bright cheerful colors, clean simple design, rounded shapes, Pixar style 3D rendering, warm lighting, educational material for young children, white background, no text',
    '3-5': 'flat vector illustration, modern clean design, vibrant colors, geometric shapes, educational style, Duolingo style, white background, no text',
    '6-8': 'anime style illustration, cell shaded, vibrant colors, detailed, Japanese animation style, white background, no text',
};

fs.mkdirSync(IMG_CACHE_DIR, { recursive: true });

async function generateImageOnce(prompt) {
    const url = baseUrl + '/' + MODEL + ':predict?key=' + apiKey;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            instances: [{ prompt: prompt }],
            parameters: { sampleCount: 1, aspectRatio: "1:1" }
        }),
        signal: AbortSignal.timeout(60000)
    });

    if (response.status === 429) {
        return { retry: true, msg: '429 rate limited' };
    }

    if (!response.ok) {
        throw new Error('API ' + response.status + ': ' + (await response.text()).substring(0, 200));
    }

    const data = await response.json();
    if (data.predictions && data.predictions[0] && data.predictions[0].bytesBase64Encoded) {
        return { retry: false, data: data.predictions[0].bytesBase64Encoded };
    }
    throw new Error('No image in response');
}

async function generateImage(prompt) {
    const delays = [30, 60, 120]; // seconds to wait on 429
    for (let attempt = 0; attempt <= delays.length; attempt++) {
        const result = await generateImageOnce(prompt);
        if (!result.retry) return result.data;
        
        if (attempt < delays.length) {
            const wait = delays[attempt];
            console.log('    -> 429 rate limited, waiting ' + wait + 's before retry...');
            await new Promise(r => setTimeout(r, wait * 1000));
        } else {
            throw new Error('429 rate limited after ' + (delays.length + 1) + ' attempts');
        }
    }
}

// Compress image to ~100KB JPEG using sharp
async function compressImage(inputBuffer) {
    return await sharp(inputBuffer)
        .resize(512, 512, { fit: 'inside' })
        .jpeg({ quality: 75 })
        .toBuffer();
}

// ======== PHASE 1: Generate images and cache to disk ========
async function phase1_generateImages(content) {
    const ageBand = content.age_band || 'K-2';
    const stylePrompt = STYLE_PROMPTS[ageBand] || STYLE_PROMPTS['K-2'];
    const vocab = content.vocabulary || [];
    const total = vocab.length;

    console.log('Phase 1: Generating AI images (' + total + ' items, style: ' + ageBand + ')...');

    let generated = 0;
    let skipped = 0;

    for (let i = 0; i < total; i++) {
        const item = vocab[i];
        const cacheFile = path.join(IMG_CACHE_DIR, item.en + '.jpg');

        // Skip if already cached on disk
        if (fs.existsSync(cacheFile)) {
            skipped++;
            const sizeKB = Math.round(fs.statSync(cacheFile).size / 1024);
            console.log('  [' + (i+1) + '/' + total + '] ' + item.en + ' -> cached (' + sizeKB + 'KB), skip');
            continue;
        }

        const objectDesc = item.image_prompt || ('a ' + item.en);
        const fullPrompt = objectDesc + ', ' + stylePrompt;

        console.log('  [' + (i+1) + '/' + total + '] Generating: ' + item.en + '...');

        try {
            const b64 = await generateImage(fullPrompt);
            const rawBuffer = Buffer.from(b64, 'base64');
            
            // Compress with sharp
            const compressed = await compressImage(rawBuffer);
            fs.writeFileSync(cacheFile, compressed);
            
            const sizeKB = Math.round(compressed.length / 1024);
            generated++;
            console.log('    -> OK (' + sizeKB + 'KB)');

            if (i < total - 1) {
                console.log('    (waiting 30s for rate limit...)');
                await new Promise(r => setTimeout(r, 30000));
            }
        } catch (e) {
            console.error('    -> FAILED: ' + e.message);
        }
    }

    console.log('  Result: ' + generated + ' new, ' + skipped + ' cached');
}

// ======== PHASE 2: Build enriched content from cache and render PDF ========
async function phase2_renderPDF(content) {
    console.log('');
    console.log('Phase 2: Rendering PDF...');

    // Inject image_data from cached compressed JPEG files
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
        body: JSON.stringify({ packContent: enriched, mode: 'sample' })
    });

    if (!res.ok) {
        console.error('API error:', await res.text());
        process.exit(1);
    }

    const html = await res.text();
    console.log('  HTML size: ' + (html.length / 1024 / 1024).toFixed(1) + ' MB');

    // Save HTML to file first
    const htmlPath = path.join(OUT_DIR, 'FINAL-classroom-objects-k2.html');
    fs.writeFileSync(htmlPath, html);

    // Launch Puppeteer and load HTML from file
    console.log('  Rendering with Puppeteer...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), {
        waitUntil: 'networkidle2',
        timeout: 120000
    });
    await new Promise(r => setTimeout(r, 3000));

    // Generate PDF
    const pdfPath = path.join(OUT_DIR, 'FINAL-classroom-objects-k2.pdf');
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
    console.log('  Imagen 4 Fast - American Cartoon Style');
    console.log('  Pack: classroom-objects (K-2)');
    console.log('========================================');
    console.log('');

    const content = JSON.parse(fs.readFileSync(packFile, 'utf8'));

    await phase1_generateImages(content);
    const pdfPath = await phase2_renderPDF(content);

    console.log('');
    console.log('========================================');
    console.log('  DONE! ' + pdfPath);
    console.log('========================================');
}

main().catch(e => { console.error('FATAL:', e.message, e.stack); process.exit(1); });
