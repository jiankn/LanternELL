import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import { GoogleAuth } from 'google-auth-library';
import dotenv from 'dotenv';

// Load environment variables (e.g. GOOGLE_APPLICATION_CREDENTIALS)
dotenv.config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data', 'packs');
const OUT_DIR = path.join(ROOT, 'data', 'pdfs');
const LOCAL_DEV_URL = 'http://127.0.0.1:3001/api/internal/render-pdf-html'; // Must have dev server running

fs.mkdirSync(OUT_DIR, { recursive: true });

let _authClient = null;
let _projectId = null;
let _accessTokenInfo = { token: null, expiresAt: 0 };

/**
 * Generate an image using Google Cloud Vertex AI (Imagen 3 Model).
 */
async function generateWithVertexAI(prompt) {
    if (!_authClient) {
        const auth = new GoogleAuth({ scopes: 'https://www.googleapis.com/auth/cloud-platform' });
        _authClient = await auth.getClient();
        _projectId = await auth.getProjectId();
    }

    // Refresh token if needed
    if (Date.now() > _accessTokenInfo.expiresAt - 5 * 60 * 1000) {
        const info = await _authClient.getAccessToken();
        _accessTokenInfo.token = info.token;
        _accessTokenInfo.expiresAt = Date.now() + 60 * 60 * 1000; // Assume 1 hour
    }

    const location = process.env.GCP_LOCATION || 'us-central1';
    const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${_projectId}/locations/${location}/publishers/google/models/imagegeneration@006:predict`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${_accessTokenInfo.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            instances: [{ prompt: prompt }],
            parameters: { sampleCount: 1, aspectRatio: "1:1" }
        })
    });

    if (!response.ok) throw new Error(await response.text());

    const data = await response.json();
    if (data.predictions && data.predictions[0] && data.predictions[0].bytesBase64Encoded) {
        return data.predictions[0].bytesBase64Encoded;
    }
    throw new Error('No image returned from Vertex AI');
}

async function enrichPackWithAIImages(packContent) {
    // If NO GCP credentials, return original
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && !process.env.GOOGLE_AUTH_SUPPRESS) {
        return packContent;
    }

    if (packContent.vocabulary) {
        for (const item of packContent.vocabulary) {
            // Only generate if we haven't already saved image_data to the JSON
            if (!item.image_data && item.image_prompt) {
                const prompt = `Studio Ghibli style anime illustration of a ${item.en}, isolated on a pure white background, colorful, cell shaded, high quality, masterpiece`;
                console.log(`     🤖 Requesting Vertex AI for: ${item.en}...`);
                try {
                    const b64 = await generateWithVertexAI(prompt);
                    item.image_data = `data:image/jpeg;base64,${b64}`;
                    console.log(`     ✅ AI Image Generated.`);
                    // Rate limiting: sleep for 2 seconds to avoid quota issues
                    await new Promise(r => setTimeout(r, 2000));
                } catch (e) {
                    console.error(`     ❌ AI Generation Failed:`, e.message);
                }
            }
        }
    }
    return packContent;
}

async function renderPdf(browser, filename, packContent, isSample) {
    const page = await browser.newPage();
    try {
        const res = await fetch(LOCAL_DEV_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ packContent, mode: isSample ? 'sample' : 'final' })
        });

        if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);

        const html = await res.text();
        await page.setContent(html, { waitUntil: ['load', 'networkidle0'] });
        await new Promise(r => setTimeout(r, 1000));

        const outName = isSample ? filename.replace('.json', '-sample.pdf') : filename.replace('.json', '.pdf');
        const outPath = path.join(OUT_DIR, outName);

        await page.pdf({
            path: outPath, format: 'Letter', printBackground: true,
            margin: { top: '0', right: '0', bottom: '0', left: '0' }
        });

        console.log(`   ✅ Saved -> ${outName}`);
        return true;
    } catch (err) {
        console.error(`   ❌ Failed rendering: ${err.message}`);
        return false;
    } finally {
        await page.close();
    }
}

async function main() {
    console.log('🚀 Starting Intelligent PDF Renderer...');

    const hasGCPAuth = !!process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (hasGCPAuth) {
        console.log('  🛡️ Vertex AI Auth DETECTED. Real AI images will be generated inline!');
    } else {
        console.log('  ⚠️ No GOOGLE_APPLICATION_CREDENTIALS detected. Skipping AI image generation.');
        console.log('     Please set the environment variable and run again to generate AI illustrations.');
    }

    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    if (files.length === 0) return console.log('No packs found in data/packs/');

    console.log(`\nLaunching Puppeteer to process ${files.length} packs...`);
    const browser = await puppeteer.launch({ headless: 'new' });

    let success = 0;

    for (const [idx, filename] of files.entries()) {
        console.log(`\n📦 [${idx + 1}/${files.length}] Processing ${filename}...`);

        let content = JSON.parse(fs.readFileSync(path.join(DATA_DIR, filename), 'utf8'));

        if (hasGCPAuth) {
            console.log(`   🤖 Requesting Vertex AI image enrichments...`);
            content = await enrichPackWithAIImages(content);
            // Optional: Save the enriched json back so we don't regenerate images constantly
            // fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(content, null, 2));
        }

        const finalOk = await renderPdf(browser, filename, content, false);
        const sampleOk = await renderPdf(browser, filename, content, true);

        if (finalOk && sampleOk) success++;
    }

    await browser.close();
    console.log(`\n📊 Results: ${success}/${files.length} pack sets rendered successfully.`);
    console.log(`📁 Output: ${OUT_DIR}\n`);
}

main().catch(console.error);
