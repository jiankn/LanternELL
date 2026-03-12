import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'data', 'pdfs');

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("No GEMINI_API_KEY found in .env.local");
    process.exit(1);
}

// Use GEMINI_BASE_URL from env, fallback to default
const baseUrl = process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta';

// Imagen 4 Fast model
const MODEL = 'imagen-4.0-fast-generate-001';

const testWords = [
    { en: 'pencil', prompt: 'A bright yellow wooden pencil with a pink eraser on top, lying on a white background' },
    { en: 'book', prompt: 'A colorful open children book with illustrations visible on the pages, on a white background' },
    { en: 'chair', prompt: 'A small colorful wooden school chair for children, on a white background' },
    { en: 'table', prompt: 'A simple wooden school desk table for children, on a white background' },
];

async function generateImage(word, prompt) {
    // Try the predict endpoint first (Vertex-style via Gemini API)
    const url = baseUrl + '/models/' + MODEL + ':predict?key=' + apiKey;

    console.log('  URL: ' + url.replace(apiKey, '***'));

    const body = {
        instances: [
            { prompt: 'Studio Ghibli anime style illustration of ' + prompt + ', colorful, cell shaded, high quality, masterpiece, isolated object, no text' }
        ],
        parameters: {
            sampleCount: 1,
            aspectRatio: "1:1"
        }
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    const text = await response.text();

    if (!response.ok) {
        // If predict endpoint fails, try generateImages endpoint
        console.log('  predict endpoint failed (' + response.status + '), trying generateImages...');

        const url2 = baseUrl + '/models/' + MODEL + ':generateImages?key=' + apiKey;
        const body2 = {
            prompt: 'Studio Ghibli anime style illustration of ' + prompt + ', colorful, cell shaded, high quality, masterpiece, isolated object, no text',
            config: {
                numberOfImages: 1,
                aspectRatio: "1:1",
                outputOptions: { mimeType: "image/png" }
            }
        };

        const response2 = await fetch(url2, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body2)
        });

        const text2 = await response2.text();

        if (!response2.ok) {
            throw new Error('Both endpoints failed. Last error: ' + text2.substring(0, 500));
        }

        const data2 = JSON.parse(text2);
        if (data2.generatedImages && data2.generatedImages[0]) {
            return data2.generatedImages[0].image.imageBytes;
        }
        throw new Error('No image in generateImages response: ' + text2.substring(0, 300));
    }

    const data = JSON.parse(text);
    if (data.predictions && data.predictions[0] && data.predictions[0].bytesBase64Encoded) {
        return data.predictions[0].bytesBase64Encoded;
    }
    throw new Error('No image in predict response: ' + text.substring(0, 300));
}

async function main() {
    console.log('=== Imagen 4 Fast Test (via Gemini API Key) ===');
    console.log('Model: ' + MODEL);
    console.log('');

    for (const word of testWords) {
        console.log('Generating: ' + word.en + '...');
        try {
            const b64 = await generateImage(word.en, word.prompt);

            // Save as PNG file
            const outPath = path.join(OUT_DIR, 'test-imagen4-' + word.en + '.png');
            fs.writeFileSync(outPath, Buffer.from(b64, 'base64'));
            console.log('  Saved: ' + outPath);

            // Small delay between requests
            await new Promise(r => setTimeout(r, 1000));
        } catch (e) {
            console.error('  FAILED: ' + e.message);
        }
        console.log('');
    }

    console.log('Done!');
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
