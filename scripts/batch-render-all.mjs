
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import sharp from 'sharp';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PACKS_DIR = path.join(ROOT, 'data', 'packs');
const OUT_DIR = path.join(ROOT, 'data', 'pdfs');
const IMG_CACHE_DIR = path.join(OUT_DIR, 'img-cache');
const LOCAL_DEV_URL = 'http://127.0.0.1:3001/api/internal/render-pdf-html';
const LOG_FILE = path.join(OUT_DIR, 'batch-render-log.txt');

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) { console.error("No GEMINI_API_KEY in .env.local"); process.exit(1); }

const baseUrl = 'https://aiplatform.googleapis.com/v1/publishers/google/models';
const MODEL = 'imagen-4.0-fast-generate-001';

const STYLE_PROMPTS = {
    'K-2': 'friendly children cartoon illustration, bright cheerful colors, clean simple design, rounded shapes, Pixar style 3D rendering, warm lighting, educational material for young children, white background, no text',
    '3-5': 'flat vector illustration, modern clean design, vibrant colors, geometric shapes, educational style, Duolingo style, white background, no text',
    '6-8': 'anime style illustration, cell shaded, vibrant colors, detailed, Japanese animation style, white background, no text',
};

fs.mkdirSync(IMG_CACHE_DIR, { recursive: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

function log(message) {
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] ${message}\n`;
    console.log(message);
    fs.appendFileSync(LOG_FILE, logLine, 'utf8');
}

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
    const delays = [30, 60, 120];
    for (let attempt = 0; attempt <= delays.length; attempt++) {
        const result = await generateImageOnce(prompt);
        if (!result.retry) return result.data;
        
        if (attempt < delays.length) {
            const wait = delays[attempt];
            log('    -> 429 rate limited, waiting ' + wait + 's before retry...');
            await new Promise(r => setTimeout(r, wait * 1000));
        } else {
            throw new Error('429 rate limited after ' + (delays.length + 1) + ' attempts');
        }
    }
}

async function compressImage(inputBuffer) {
    return await sharp(inputBuffer)
        .resize(512, 512, { fit: 'inside' })
        .jpeg({ quality: 75 })
        .toBuffer();
}

async function phase1_generateImages(content, packName) {
    const ageBand = content.age_band || 'K-2';
    const stylePrompt = STYLE_PROMPTS[ageBand] || STYLE_PROMPTS['K-2'];
    const vocab = content.vocabulary || [];
    const total = vocab.length;

    log(`[${packName}] Phase 1: Generating AI images (${total} items, style: ${ageBand})...`);

    let generated = 0;
    let skipped = 0;

    for (let i = 0; i < total; i++) {
        const item = vocab[i];
        const cacheFile = path.join(IMG_CACHE_DIR, item.en + '.jpg');

        if (fs.existsSync(cacheFile)) {
            skipped++;
            const sizeKB = Math.round(fs.statSync(cacheFile).size / 1024);
            log(`  [${i+1}/${total}] ${item.en} -> cached (${sizeKB}KB), skip`);
            continue;
        }

        const objectDesc = item.image_prompt || ('a ' + item.en);
        const fullPrompt = objectDesc + ', ' + stylePrompt;

        log(`  [${i+1}/${total}] Generating: ${item.en}...`);

        try {
            const b64 = await generateImage(fullPrompt);
            const rawBuffer = Buffer.from(b64, 'base64');
            
            const compressed = await compressImage(rawBuffer);
            fs.writeFileSync(cacheFile, compressed);
            
            const sizeKB = Math.round(compressed.length / 1024);
            generated++;
            log(`    -> OK (${sizeKB}KB)`);

            if (i < total - 1) {
                log('    (waiting 30s for rate limit...)');
                await new Promise(r => setTimeout(r, 30000));
            }
        } catch (e) {
            log(`    -> FAILED: ${e.message}`);
        }
    }

    log(`  Result: ${generated} new, ${skipped} cached`);
}

async function phase2_renderPDF(content, packName, outputPdfPath) {
    log('');
    log(`[${packName}] Phase 2: Rendering PDF...`);

    const enriched = JSON.parse(JSON.stringify(content));
    for (const item of enriched.vocabulary || []) {
        const cacheFile = path.join(IMG_CACHE_DIR, item.en + '.jpg');
        if (fs.existsSync(cacheFile)) {
            const b64 = fs.readFileSync(cacheFile).toString('base64');
            item.image_data = 'data:image/jpeg;base64,' + b64;
        }
    }

    const imageCount = enriched.vocabulary.filter(v => v.image_data).length;
    log(`  Images loaded: ${imageCount}/${enriched.vocabulary.length}`);

    log('  Requesting HTML from dev server...');
    const res = await fetch(LOCAL_DEV_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packContent: enriched, mode: 'sample' })
    });

    if (!res.ok) {
        const errorText = await res.text();
        log('  API error: ' + errorText);
        throw new Error('API error: ' + res.status);
    }

    const html = await res.text();
    log('  HTML size: ' + (html.length / 1024 / 1024).toFixed(1) + ' MB');

    const htmlPath = path.join(OUT_DIR, 'FINAL-' + packName + '.html');
    fs.writeFileSync(htmlPath, html);

    log('  Rendering with Puppeteer...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), {
        waitUntil: 'networkidle2',
        timeout: 120000
    });
    await new Promise(r => setTimeout(r, 3000));

    await page.pdf({
        path: outputPdfPath,
        format: 'Letter',
        printBackground: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });

    const pdfSizeMB = (fs.statSync(outputPdfPath).size / 1024 / 1024).toFixed(1);
    log('  PDF saved: ' + outputPdfPath + ' (' + pdfSizeMB + ' MB)');

    await browser.close();
    return outputPdfPath;
}

async function renderSinglePack(packFile) {
    const packFileName = path.basename(packFile, '.json');
    const outputPdfPath = path.join(OUT_DIR, 'FINAL-' + packFileName + '.pdf');

    if (fs.existsSync(outputPdfPath)) {
        log(`[${packFileName}] PDF already exists, skipping...`);
        return { status: 'skipped', pack: packFileName, path: outputPdfPath };
    }

    log('');
    log('========================================');
    log('  Processing: ' + packFileName);
    log('========================================');
    log('');

    const content = JSON.parse(fs.readFileSync(packFile, 'utf8'));

    await phase1_generateImages(content, packFileName);
    const pdfPath = await phase2_renderPDF(content, packFileName, outputPdfPath);

    return { status: 'success', pack: packFileName, path: pdfPath };
}

async function main() {
    log('========================================');
    log('  BATCH RENDER ALL PACKS');
    log('========================================');
    log('');

    const packFiles = fs.readdirSync(PACKS_DIR)
        .filter(f => f.endsWith('.json'))
        .sort();

    log(`Found ${packFiles.length} packs in ${PACKS_DIR}`);

    const results = {
        success: [],
        skipped: [],
        failed: []
    };

    for (const packFileName of packFiles) {
        const packFile = path.join(PACKS_DIR, packFileName);
        try {
            const result = await renderSinglePack(packFile);
            if (result.status === 'success') {
                results.success.push(result);
            } else if (result.status === 'skipped') {
                results.skipped.push(result);
            }
        } catch (e) {
            log(`[${packFileName}] ERROR: ${e.message}`);
            log(e.stack);
            results.failed.push({ pack: packFileName, error: e.message });
        }
    }

    log('');
    log('========================================');
    log('  SUMMARY');
    log('========================================');
    log(`Total: ${packFiles.length}`);
    log(`Success: ${results.success.length}`);
    log(`Skipped: ${results.skipped.length}`);
    log(`Failed: ${results.failed.length}`);
    
    if (results.failed.length > 0) {
        log('');
        log('Failed packs:');
        for (const f of results.failed) {
            log(`  - ${f.pack}: ${f.error}`);
        }
    }

    log('');
    log('Done! Log saved to: ' + LOG_FILE);
}

async function renderOnePack(packFileName) {
    const packFile = path.join(PACKS_DIR, packFileName + '.json');
    if (!fs.existsSync(packFile)) {
        console.error('Pack not found:', packFile);
        process.exit(1);
    }
    await renderSinglePack(packFile);
}

const args = process.argv.slice(2);
if (args.length > 0 && args[0] === '--one') {
    const packName = args[1];
    if (!packName) {
        console.error('Usage: node scripts/batch-render-all.mjs --one <pack-name>');
        console.error('Example: node scripts/batch-render-all.mjs --one colors_vocabulary_pack_k-2_en-es');
        process.exit(1);
    }
    renderOnePack(packName).catch(e => {
        console.error('FATAL:', e.message, e.stack);
        process.exit(1);
    });
} else {
    main().catch(e => {
        console.error('FATAL:', e.message, e.stack);
        process.exit(1);
    });
}

