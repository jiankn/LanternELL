import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// Note: To render TSX components in Node, we need a bundler or ts-node.
// Since we want to use the existing Next.js components cleanly,
// the easiest robust way is to start a temporary local Next.js server,
// or use a direct script if transpilation is complex.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data', 'packs');
const OUT_DIR = path.join(ROOT, 'data', 'pdfs');
const LOCAL_DEV_URL = 'http://127.0.0.1:3001/api/internal/render-pdf-html'; // Must have dev server running

fs.mkdirSync(OUT_DIR, { recursive: true });

async function renderPdf(browser, filename, packContent, isSample) {
    const page = await browser.newPage();
    try {
        // Fetch HTML directly from our Next.js API route
        const res = await fetch(LOCAL_DEV_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ packContent, mode: isSample ? 'sample' : 'final' })
        });

        if (!res.ok) {
            const err = await res.text();
            throw new Error(`API error ${res.status}: ${err}`);
        }

        const html = await res.text();

        // Use setContent and wait for tailwind CDN & fonts
        await page.setContent(html, { waitUntil: ['load', 'networkidle0'] });

        // Slight delay to ensure CDN scripts apply fully
        await new Promise(r => setTimeout(r, 1000));

        const outName = isSample ? filename.replace('.json', '-sample.pdf') : filename.replace('.json', '.pdf');
        const outPath = path.join(OUT_DIR, outName);

        await page.pdf({
            path: outPath,
            format: 'Letter',
            printBackground: true,
            margin: { top: '0', right: '0', bottom: '0', left: '0' }
        });

        console.log(`   ✅ Saved -> ${outName}`);
        return true;
    } catch (err) {
        console.error(`   ❌ Failed: ${err.message}`);
        return false;
    } finally {
        await page.close();
    }
}

async function main() {
    console.log('🚀 Starting PDF Renderer...');

    // Health check removed.

    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    if (files.length === 0) {
        console.log('No packs found in data/packs/');
        return;
    }

    console.log(`Launching Puppeteer to render ${files.length} packs...`);
    const browser = await puppeteer.launch({ headless: 'new' });

    let success = 0;

    for (const [idx, filename] of files.entries()) {
        console.log(`\n📦 [${idx + 1}/${files.length}] Rendering ${filename}...`);

        const content = JSON.parse(fs.readFileSync(path.join(DATA_DIR, filename), 'utf8'));

        // Render Final
        const finalOk = await renderPdf(browser, filename, content, false);
        // Render Sample
        const sampleOk = await renderPdf(browser, filename, content, true);

        if (finalOk && sampleOk) success++;
    }

    await browser.close();
    console.log(`\n📊 Results: ${success}/${files.length} pack sets rendered successfully.`);
    console.log(`📁 Output: ${OUT_DIR}\n`);
}

main().catch(console.error);
