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
const OUT_DIR = path.join(ROOT, 'data', 'pdfs');
const LOCAL_DEV_URL = 'http://127.0.0.1:3001/api/internal/render-pdf-html';

const packFile = path.join(ROOT, 'data', 'packs', 'classroom-objects_vocabulary_pack_k-2_en-es.json');
const content = JSON.parse(fs.readFileSync(packFile, 'utf8'));

/**
 * Generate an image using Google Cloud Vertex AI (Imagen 3 Model).
 * Documentation: https://cloud.google.com/vertex-ai/docs/generative-ai/image/generate-images
 */
async function generateWithVertexAI(prompt) {
    // 1. Initialize Google Auth. This automatically looks for credentials in:
    //    a) GOOGLE_APPLICATION_CREDENTIALS environment variable (Path to your service account JSON file)
    //    b) Or credentials set via 'gcloud auth application-default login' on your local machine.
    const auth = new GoogleAuth({
        scopes: 'https://www.googleapis.com/auth/cloud-platform'
    });

    const client = await auth.getClient();
    const projectId = await auth.getProjectId();

    // Get a fresh OAuth 2.0 access token
    const accessToken = (await client.getAccessToken()).token;

    // The region where you are running the Vertex AI model. 
    // Usually 'us-central1' is the primary region for Imagen.
    const location = process.env.GCP_LOCATION || 'us-central1';

    // We use imagegeneration@006 which is the Imagen 3 model.
    const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/imagegeneration@006:predict`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            instances: [
                { prompt: prompt }
            ],
            parameters: {
                sampleCount: 1,
                aspectRatio: "1:1",
                // Optional: negative prompt, style overrides, etc.
            }
        })
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    const data = await response.json();
    if (data.predictions && data.predictions[0] && data.predictions[0].bytesBase64Encoded) {
        return data.predictions[0].bytesBase64Encoded;
    }

    throw new Error('No image returned from Vertex AI');
}

// We will only generate the first 4 items for this test to save time and cost
async function generateImagesWithVertexAPI(packContent) {
    if (!packContent.vocabulary) return packContent;

    const itemsToProcess = packContent.vocabulary.slice(0, 4);

    for (const item of itemsToProcess) {
        const prompt = `Studio Ghibli style anime illustration of a ${item.en}, isolated on a pure white background, colorful, cell shaded, high quality, masterpiece`;

        console.log(`  🤖 Requesting Vertex AI Imagen 3 for: ${item.en}...`);

        try {
            // Call our secure Vertex AI function
            const b64 = await generateWithVertexAI(prompt);

            // Embed directly into HTML
            item.image_data = `data:image/jpeg;base64,${b64}`;
            console.log(`  ✅ Successfully generated Vertex AI image for: ${item.en}`);

            // Respect API Rate limits (e.g. Vertex AI might have Quota limits per minute)
            // Optional: await new Promise(r => setTimeout(r, 2000));
        } catch (e) {
            console.error(`  ❌ Failed for ${item.en}:`, e.message);
        }
    }

    return packContent;
}

async function main() {
    console.log('🎨 Rendering test PDF with Vertex AI (Imagen 3)...');

    try {
        // Simple test to check if auth can be initialized before making 20 requests
        const auth = new GoogleAuth();
        await auth.getProjectId();
        console.log('  🔒 Google Auth locally resolved. Proceeding...');
    } catch (e) {
        console.error('\n🚨 AUTHENTICATION REQUIRED:\n');
        console.error('You need to provide Google Cloud Credentials. Two ways to do this:');
        console.error('  1. (Recommended) Run: gcloud auth application-default login');
        console.error('  2. OR Set GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/service-account-key.json in your .env.local file\n');
        console.error('Original Error:', e.message);
        process.exit(1);
    }

    const enriched = await generateImagesWithVertexAPI({ ...content });

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

    console.log('  Loading HTML & Vertex AI Image assets into Puppeteer...');
    await page.setContent(html, { waitUntil: ['load', 'networkidle0'] });
    await new Promise(r => setTimeout(r, 1000));

    const outPath = path.join(OUT_DIR, 'TEST-v7-vertex-ai.pdf');
    await page.pdf({ path: outPath, format: 'Letter', printBackground: true, margin: { top: '0', right: '0', bottom: '0', left: '0' } });
    console.log(`✅ PDF saved -> ${outPath}`);

    fs.writeFileSync(path.join(OUT_DIR, 'TEST-vertex-ai-template.html'), html);
    console.log(`✅ HTML saved for inspection`);

    await browser.close();
    process.exit(0);
}

main().catch(e => { console.error('FATAL:', e.message, e.stack); process.exit(1); });
