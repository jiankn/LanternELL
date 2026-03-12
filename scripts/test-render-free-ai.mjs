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

// We will only generate the first 4 items for this test to save time
async function generateImagesWithFreeAPI(packContent) {
    if (!packContent.vocabulary) return packContent;

    // Process only the first 4 items for the demo preview
    const itemsToProcess = packContent.vocabulary.slice(0, 4);

    for (const item of itemsToProcess) {
        // Create a highly detailed prompt for Studio Ghibli style
        const prompt = `Studio Ghibli style anime illustration of a ${item.en}, isolated on a pure white background, colorful, cell shaded, high quality, masterpiece`;

        console.log(`  🤖 Requesting Free AI Image for: ${item.en}...`);

        // Use Pollinations.ai - a completely free, no-key API that wraps models like Flux
        const encodedPrompt = encodeURIComponent(prompt);
        // Using seed to avoid caching if we need to regenerate
        const seed = Math.floor(Math.random() * 1000000);
        const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=800&nologo=true&seed=${seed}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const b64 = buffer.toString('base64');

            item.image_data = `data:image/jpeg;base64,${b64}`;
            console.log(`  ✅ Successfully generated AI image for: ${item.en}`);
        } catch (e) {
            console.error(`  ❌ Failed for ${item.en}:`, e.message);
        }
    }

    return packContent;
}

async function main() {
    console.log('🎨 Rendering test PDF with FREE AI API (Pollinations.ai)...');

    const enriched = await generateImagesWithFreeAPI({ ...content });

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    console.log('  Verifying enriched data...', enriched.vocabulary[0].image_data?.substring(0, 50));

    console.log('  Fetching from local dev server...');
    const res = await fetch(LOCAL_DEV_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packContent: enriched, mode: 'sample' })
    });

    if (!res.ok) { console.error('API error:', await res.text()); process.exit(1); }
    const html = await res.text();

    console.log('  Loading HTML & AI Image assets into Puppeteer...');
    await page.setContent(html, { waitUntil: ['load', 'networkidle0'] });
    await new Promise(r => setTimeout(r, 1000));

    const outPath = path.join(OUT_DIR, 'TEST-v6-free-ai.pdf');
    await page.pdf({ path: outPath, format: 'Letter', printBackground: true, margin: { top: '0', right: '0', bottom: '0', left: '0' } });
    console.log(`✅ PDF saved -> ${outPath}`);

    fs.writeFileSync(path.join(OUT_DIR, 'TEST-free-ai-template.html'), html);
    console.log(`✅ HTML saved for inspection`);

    await browser.close();
    process.exit(0);
}

main().catch(e => { console.error('FATAL:', e.message, e.stack); process.exit(1); });
