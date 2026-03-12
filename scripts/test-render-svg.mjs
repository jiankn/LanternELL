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

// Cell-shaded "Anime/Ghibli style" SVG Illustrations
// Characterized by: warm nostalgic palettes, dark brown/charcoal distinct outlines, 
// crisp cell-shaded shadows and highlights, slightly organic shapes.
const SVG_ICONS = {
    'pencil': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <g transform="translate(15, 15) rotate(45, 35, 35)">
      <!-- Drop shadow -->
      <path d="M14 6 L44 6 L55 65 L44 80 L29 80 L14 65 Z" fill="#E2E8F0" opacity="0.6" transform="translate(5, 5)" />
      <!-- Eraser -->
      <path d="M15 10 Q 30 5 45 10 L43 20 L17 20 Z" fill="#E88880" stroke="#3A2A22" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M17 12 Q 30 8 43 12 L40 18 L20 18 Z" fill="#F49C95" stroke="none" />
      <path d="M38 10 Q 43 10 43 18 L35 15 Z" fill="#FFF" opacity="0.5" />
      <!-- Ferrule (metal part) -->
      <rect x="17" y="20" width="26" height="12" fill="#BCC6CC" stroke="#3A2A22" stroke-width="2.5" stroke-linejoin="round" />
      <rect x="25" y="20" width="8" height="12" fill="#D5DFE5" stroke="none" />
      <rect x="33" y="20" width="4" height="12" fill="#9CA8B0" stroke="none" />
      <line x1="17" y1="24" x2="43" y2="24" stroke="#3A2A22" stroke-width="1.5" />
      <line x1="17" y1="28" x2="43" y2="28" stroke="#3A2A22" stroke-width="1.5" />
      <!-- Pencil Body -->
      <polygon points="17,32 43,32 43,65 17,65" fill="#EBB95F" stroke="#3A2A22" stroke-width="2.5" stroke-linejoin="round" />
      <polygon points="25,32 35,32 35,65 25,65" fill="#F8CD77" stroke="none" />
      <!-- Orange core reflection -->
      <polygon points="35,32 43,32 43,65 35,65" fill="#D49940" stroke="none" />
      <line x1="25" y1="32" x2="25" y2="65" stroke="#3A2A22" stroke-width="1.5" />
      <line x1="35" y1="32" x2="35" y2="65" stroke="#3A2A22" stroke-width="1.5" />
      <!-- Wooden tip -->
      <polygon points="17,65 43,65 30,85" fill="#E7CDB0" stroke="#3A2A22" stroke-width="2.5" stroke-linejoin="round" />
      <polygon points="25,65 35,65 30,85" fill="#F1DCC5" stroke="none" />
      <polygon points="35,65 43,65 30,85" fill="#D3B491" stroke="none" />
      <!-- Graphite tip -->
      <polygon points="26,79 34,79 30,85" fill="#4B4B4B" stroke="#3A2A22" stroke-width="2.5" stroke-linejoin="round" />
      <polygon points="30,79 32,79 30,85" fill="#6B6B6B" stroke="none" />
      <!-- Little sparkle -->
      <text x="50" y="25" font-family="Arial" font-size="12" fill="#FACC15">✨</text>
    </g>
  </svg>`,

    'book': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <g transform="translate(10, 15)">
      <!-- Drop shadow -->
      <path d="M 5 5 L 80 15 L 75 75 L 0 65 Z" fill="#E2E8F0" opacity="0.6" transform="translate(10, 10)" />
      
      <!-- Back pages -->
      <path d="M 12 8 L 82 18 L 82 72 L 12 62 Z" fill="#FDFBF7" stroke="#3A2A22" stroke-width="2.5" stroke-linejoin="round"/>
      <line x1="82" y1="20" x2="12" y2="10" stroke="#E6E0D4" stroke-width="1.5"/>
      <line x1="82" y1="24" x2="12" y2="14" stroke="#E6E0D4" stroke-width="1.5"/>
      <line x1="82" y1="28" x2="12" y2="18" stroke="#E6E0D4" stroke-width="1.5"/>
      <line x1="82" y1="32" x2="12" y2="22" stroke="#E6E0D4" stroke-width="1.5"/>
      
      <!-- Front cover -->
      <path d="M 5 5 L 75 15 L 75 75 L 5 65 Z" fill="#4CAC9B" stroke="#3A2A22" stroke-width="2.5" stroke-linejoin="round"/>
      
      <!-- Anime highlights & shadows -->
      <path d="M 10 7 L 35 11 L 35 70 L 10 66 Z" fill="#69C9B7" />
      <path d="M 65 14 L 73 15 L 73 74 L 65 73 Z" fill="#3A8A7A" />
      
      <!-- Spine -->
      <path d="M 5 5 L 15 6 L 15 66 L 5 65 Z" fill="#3A8A7A" stroke="#3A2A22" stroke-width="2.5" stroke-linejoin="round"/>
      
      <!-- Bookmark ribbon -->
      <path d="M 45 10 L 52 11 L 52 45 L 48 40 L 45 45 Z" fill="#DC635C" stroke="#3A2A22" stroke-width="2" stroke-linejoin="round"/>
      <path d="M 46 12 L 48 12 L 48 41 L 46 39 Z" fill="#F08F8A" />

      <!-- Label -->
      <path d="M 25 25 L 60 30 L 60 45 L 25 40 Z" fill="#FDFBF7" stroke="#3A2A22" stroke-width="2" stroke-linejoin="round"/>
      <line x1="30" y1="32" x2="55" y2="35" stroke="#3A2A22" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="30" y1="38" x2="45" y2="40" stroke="#3A2A22" stroke-width="2.5" stroke-linecap="round"/>
      
      <!-- Tiny leaf emblem (Ghibli vibe) -->
      <path d="M 65 60 Q 55 50 60 55 Q 70 65 65 60" fill="#BEE89A" stroke="#3A2A22" stroke-width="1.5"/>
      <text x="65" y="20" font-family="Arial" font-size="14" fill="#FACC15">✨</text>
    </g>
  </svg>`,

    'chair': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <g transform="translate(15, 10)">
      <!-- Shadow -->
      <ellipse cx="35" cy="80" rx="30" ry="8" fill="#E2E8F0" opacity="0.8" />
      
      <!-- Back legs -->
      <rect x="20" y="45" width="8" height="30" rx="4" fill="#916E5A" stroke="#3A2A22" stroke-width="2.5" />
      <rect x="55" y="45" width="8" height="30" rx="4" fill="#755745" stroke="#3A2A22" stroke-width="2.5" />
      
      <!-- Seat shadow -->
      <path d="M 12 40 L 65 40 L 75 52 L 20 52 Z" fill="#5F9DA5" stroke="#3A2A22" stroke-width="2.5" stroke-linejoin="round"/>
      <!-- Seat surface -->
      <path d="M 10 35 L 63 35 L 75 45 L 20 45 Z" fill="#7CBCC5" stroke="#3A2A22" stroke-width="2.5" stroke-linejoin="round"/>
      <!-- Seat highlight -->
      <path d="M 15 37 L 55 37 L 60 41 L 22 41 Z" fill="#9FD6DE" />
      
      <!-- Front legs -->
      <rect x="22" y="45" width="8" height="35" rx="4" fill="#D3A581" stroke="#3A2A22" stroke-width="2.5" />
      <rect x="65" y="45" width="8" height="35" rx="4" fill="#AD8465" stroke="#3A2A22" stroke-width="2.5" />
      <!-- Leg highlights -->
      <rect x="24" y="48" width="2" height="28" fill="#F1CDB3" />
      
      <!-- Backrest supports -->
      <rect x="18" y="5" width="6" height="35" fill="#D3A581" stroke="#3A2A22" stroke-width="2.5" />
      <rect x="58" y="5" width="6" height="35" fill="#AD8465" stroke="#3A2A22" stroke-width="2.5" />
      
      <!-- Backrest boards -->
      <path d="M 14 10 L 66 10 C 68 10 68 22 66 22 L 14 22 C 12 22 12 10 14 10 Z" fill="#7CBCC5" stroke="#3A2A22" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M 16 26 L 64 26 C 66 26 66 33 64 33 L 16 33 C 14 33 14 26 16 26 Z" fill="#7CBCC5" stroke="#3A2A22" stroke-width="2.5" stroke-linejoin="round"/>
      
      <!-- Backrest highlights -->
      <rect x="18" y="12" width="44" height="4" rx="2" fill="#9FD6DE" />
      <rect x="20" y="28" width="40" height="2" rx="1" fill="#9FD6DE" />
    </g>
  </svg>`,

    'table': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <g transform="translate(5, 20)">
      <!-- Shadow -->
      <ellipse cx="45" cy="70" rx="40" ry="10" fill="#E2E8F0" opacity="0.8" />
      
      <!-- Back legs -->
      <rect x="15" y="35" width="8" height="30" rx="3" fill="#916E5A" stroke="#3A2A22" stroke-width="2.5" />
      <rect x="75" y="35" width="8" height="30" rx="3" fill="#755745" stroke="#3A2A22" stroke-width="2.5" />
      
      <!-- Table thickness -->
      <path d="M 5 35 L 85 35 L 95 45 L 8 45 Z" fill="#C58552" stroke="#3A2A22" stroke-width="2.5" stroke-linejoin="round"/>
      <!-- Table top -->
      <path d="M 15 15 L 90 15 L 95 35 L 5 35 Z" fill="#F1CDB3" stroke="#3A2A22" stroke-width="2.5" stroke-linejoin="round"/>
      <!-- Table top highlight / grain -->
      <path d="M 20 18 L 85 18 L 88 30 L 12 30 Z" fill="#FDF3E8" />
      <path d="M 30 22 C 40 20 60 25 70 22" fill="none" stroke="#E6B898" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M 25 28 C 45 27 50 32 80 28" fill="none" stroke="#E6B898" stroke-width="1.5" stroke-linecap="round"/>
      
      <!-- Front legs -->
      <rect x="8" y="45" width="10" height="30" rx="3" fill="#E8AE82" stroke="#3A2A22" stroke-width="2.5" />
      <rect x="78" y="45" width="10" height="30" rx="3" fill="#C58552" stroke="#3A2A22" stroke-width="2.5" />
      
      <!-- Front leg highlights -->
      <rect x="10" y="48" width="3" height="24" rx="1.5" fill="#FDF3E8" />
      <rect x="80" y="48" width="3" height="24" rx="1.5" fill="#E8AE82" />
    </g>
  </svg>`,

    'crayon': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <g transform="translate(25, 10)">
      <!-- Drop shadow -->
      <path d="M 15 8 L 45 8 L 45 75 L 15 75 Z" fill="#E2E8F0" opacity="0.6" transform="translate(10, 10) rotate(-10, 25, 40)" />
      <g transform="rotate(-15, 25, 40)">
        <!-- Paper Wrapper -->
        <rect x="10" y="25" width="30" height="45" fill="#DC635C" stroke="#3A2A22" stroke-width="2.5" stroke-linejoin="round"/>
        <!-- Wrapper design pattern -->
        <path d="M 10 32 Q 25 38 40 32 L 40 36 Q 25 42 10 36 Z" fill="#FFF" />
        <path d="M 10 60 Q 25 66 40 60 L 40 64 Q 25 70 10 64 Z" fill="#FFF" />
        
        <circle cx="25" cy="46" r="8" fill="#FFF" stroke="#3A2A22" stroke-width="1.5" />
        <circle cx="25" cy="46" r="4" fill="#DC635C" />
        
        <!-- Wax body top / bottom -->
        <rect x="12" y="70" width="26" height="12" fill="#E6827D" stroke="#3A2A22" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M 12 82 C 12 86 38 86 38 82 Z" fill="#DC635C" stroke="#3A2A22" stroke-width="2.5" stroke-linejoin="round"/>
        
        <!-- Tip -->
        <polygon points="12,25 38,25 25,5" fill="#E6827D" stroke="#3A2A22" stroke-width="2.5" stroke-linejoin="round"/>
        <polygon points="15,25 25,25 25,12" fill="#F2A5A2" stroke="none" />
        
        <!-- Tube highlights -->
        <rect x="15" y="25" width="4" height="45" fill="#F08F8A" />
        <rect x="16" y="70" width="3" height="12" fill="#F2A5A2" />
        
        <!-- Tiny star -->
        <text x="35" y="15" font-family="Arial" font-size="16" fill="#FACC15">✨</text>
      </g>
    </g>
  </svg>`,

    'paper': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <g transform="translate(15, 10)">
      <!-- Shadow -->
      <path d="M 15 10 L 65 20 L 60 85 L 10 75 Z" fill="#E2E8F0" opacity="0.8" transform="translate(5, 5)" />
      
      <!-- Back paper -->
      <path d="M 15 10 L 65 20 L 55 85 L 5 75 Z" fill="#E8EBED" stroke="#3A2A22" stroke-width="2" stroke-linejoin="round"/>
      
      <!-- Middle paper -->
      <path d="M 18 15 L 68 12 L 68 78 L 18 80 Z" fill="#F3F5F7" stroke="#3A2A22" stroke-width="2.5" stroke-linejoin="round"/>
      
      <!-- Top Front paper -->
      <path d="M 10 20 L 65 15 L 75 80 L 20 85 Z" fill="#FFFFFF" stroke="#3A2A22" stroke-width="2.5" stroke-linejoin="round"/>
      
      <!-- Blue lined paper pattern -->
      <line x1="15" y1="35" x2="67" y2="30" stroke="#8BD3E6" stroke-width="1.5" />
      <line x1="16" y1="45" x2="68" y2="40" stroke="#8BD3E6" stroke-width="1.5" />
      <line x1="17" y1="55" x2="69" y2="50" stroke="#8BD3E6" stroke-width="1.5" />
      <line x1="18" y1="65" x2="70" y2="60" stroke="#8BD3E6" stroke-width="1.5" />
      <line x1="19" y1="75" x2="71" y2="70" stroke="#8BD3E6" stroke-width="1.5" />
      
      <!-- Red margin down the side -->
      <line x1="25" y1="18" x2="35" y2="83" stroke="#F49C95" stroke-width="2" />
      
      <!-- Fold/Dog-ear corner -->
      <polygon points="65,15 63,28 75,26" fill="#E8EBED" stroke="#3A2A22" stroke-width="2.5" stroke-linejoin="round"/>
      
      <!-- Paper texture/highlight -->
      <path d="M 28 20 L 60 17 L 62 45 L 30 48 Z" fill="#FDFDFF" opacity="0.6" />
    </g>
  </svg>`,

    'scissors': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <g transform="translate(15, 10)">
      <!-- Drop shadow -->
      <g transform="translate(6, 6) rotate(20, 35, 35)" opacity="0.3">
        <path d="M 25 5 L 32 45 L 5 70 C 0 85 20 90 28 75 L 35 50 Z" fill="#334155" />
        <path d="M 45 5 L 38 45 L 65 70 C 70 85 50 90 42 75 L 35 50 Z" fill="#334155" />
      </g>
      
      <g transform="rotate(20, 35, 35)">
        <!-- Inside Blade 1 -->
        <polygon points="45,5 38,45 33,40" fill="#BCC6CC" stroke="#3A2A22" stroke-width="2" stroke-linejoin="round"/>
        <polygon points="42,5 38,45 35,40" fill="#E2E8F0" /> <!-- Highlight -->
        
        <!-- Handle 1 (Bottom Left) -->
        <path d="M 33 45 L 8 72 C -3 83 15 95 24 82 L 35 48 Z" fill="#E87B5B" stroke="#3A2A22" stroke-width="2.5" stroke-linejoin="round"/>
        <!-- Handle 1 hole -->
        <ellipse cx="18" cy="74" rx="6" ry="12" fill="#E2E8F0" stroke="#3A2A22" stroke-width="2.5" transform="rotate(-30, 18, 74)"/>
        <!-- Handle 1 Highlight -->
        <path d="M 28 50 L 12 68 C 5 75 14 85 22 76" fill="none" stroke="#F2A48D" stroke-width="3" stroke-linecap="round" />

        <!-- Outside Blade 2 -->
        <polygon points="25,5 32,45 37,40" fill="#9CA8B0" stroke="#3A2A22" stroke-width="2.5" stroke-linejoin="round"/>
        <polygon points="25,5 28,5 33,45 32,45 Z" fill="#F1F5F9" /> <!-- Super sharp edge highlight -->

        <!-- Handle 2 (Bottom Right) -->
        <path d="M 37 45 L 62 72 C 73 83 55 95 46 82 L 35 48 Z" fill="#DC5A45" stroke="#3A2A22" stroke-width="2.5" stroke-linejoin="round"/>
        <!-- Handle 2 hole -->
        <ellipse cx="52" cy="74" rx="6" ry="12" fill="#E2E8F0" stroke="#3A2A22" stroke-width="2.5" transform="rotate(30, 52, 74)"/>
        <!-- Handle 2 Highlight -->
        <path d="M 42 50 L 58 68 C 65 75 56 85 48 76" fill="none" stroke="#E87B5B" stroke-width="3" stroke-linecap="round" />

        <!-- Center Screw -->
        <circle cx="35" cy="45" r="4" fill="#E2E8F0" stroke="#3A2A22" stroke-width="2" />
        <circle cx="34" cy="44" r="1.5" fill="#FFF" />
      </g>
    </g>
  </svg>`,

    'glue': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <g transform="translate(25, 10)">
      <!-- Drop shadow -->
      <ellipse cx="25" cy="85" rx="15" ry="5" fill="#E2E8F0" opacity="0.8" />
      
      <!-- Bottle Body -->
      <rect x="10" y="35" width="30" height="48" rx="6" fill="#F8CD77" stroke="#3A2A22" stroke-width="2.5" stroke-linejoin="round"/>
      <rect x="13" y="38" width="6" height="42" rx="3" fill="#FCEAC1" stroke="none" /> <!-- Highlight -->
      <rect x="33" y="38" width="4" height="42" rx="2" fill="#D49940" stroke="none" /> <!-- Shadow -->
      
      <!-- Label -->
      <rect x="10" y="45" width="30" height="25" fill="#5F9DA5" stroke="#3A2A22" stroke-width="2.5" stroke-linejoin="round"/>
      <!-- Label stripe & highlight -->
      <rect x="10" y="45" width="30" height="4" fill="#9FD6DE" />
      <rect x="10" y="66" width="30" height="4" fill="#3A8A7A" />
      
      <!-- Label Circle -->
      <circle cx="25" cy="57" r="8" fill="#FDFBF7" stroke="#3A2A22" stroke-width="2" />
      <circle cx="25" cy="57" r="4" fill="#DC635C" stroke="none" />
      
      <!-- Neck base -->
      <rect x="15" y="30" width="20" height="5" rx="2" fill="#E2E8F0" stroke="#3A2A22" stroke-width="2.5" stroke-linejoin="round"/>
      <rect x="15" y="27" width="20" height="4" fill="#CBD5E1" stroke="#3A2A22" stroke-width="2.5" stroke-linejoin="round"/>
      
      <!-- Cap nozzle -->
      <path d="M 18 27 L 32 27 L 27 5 L 23 5 Z" fill="#DC635C" stroke="#3A2A22" stroke-width="2.5" stroke-linejoin="round"/>
      <polygon points="18,27 23,27 24.5,5 23,5" fill="#F08F8A" /> <!-- Highlight -->
      <path d="M 23 5 C 23 2 27 2 27 5" fill="#E87B5B" stroke="#3A2A22" stroke-width="2.5" />
      
      <!-- Droplet -->
      <path d="M 25 1 Q 23 3 25 6 Q 27 3 25 1 Z" fill="#FFF" stroke="#FFF" stroke-width="1"/>
      <text x="35" y="15" font-family="Arial" font-size="14" fill="#FACC15">✨</text>
    </g>
  </svg>`,

    'backpack': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g transform="translate(10,10)"><rect x="20" y="20" width="60" height="70" rx="15" fill="#E37C64" stroke="#3A2A22" stroke-width="3" /><rect x="25" y="25" width="10" height="60" rx="5" fill="#F0A693"/><rect x="30" y="50" width="40" height="30" rx="10" fill="#AF5542" stroke="#3A2A22" stroke-width="3"/><path d="M30 20 C 30 5 70 5 70 20" fill="none" stroke="#D3B491" stroke-width="6" stroke-linecap="round"/></g></svg>`,

    // Default fallback for any word not explicitly defined
    'default': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect x="15" y="15" width="70" height="70" rx="15" fill="#FDFBF7" stroke="#3A2A22" stroke-width="2.5" />
    <circle cx="50" cy="40" r="15" fill="#FDE68A" stroke="#3A2A22" stroke-width="2" />
    <path d="M20 85 Q 50 50 80 85 Z" fill="#BEE89A" stroke="#3A2A22" stroke-width="2.5" />
    <circle cx="70" cy="30" r="4" fill="#DC635C" />
    <text x="75" y="25" font-family="Arial" font-size="20" fill="#FACC15">✨</text>
  </svg>`
};

function injectSvgImages(packContent) {
    if (packContent.vocabulary) {
        for (const item of packContent.vocabulary) {
            const key = Object.keys(SVG_ICONS).find(k => item.en.toLowerCase().includes(k)) || 'default';
            const svgString = SVG_ICONS[key];

            // Allow SVG to fill the container perfectly without zooming in too much
            const stylizedSvg = svgString.replace('<svg ', '<svg width="100%" height="100%" style="object-fit: contain; filter: drop-shadow(0px 8px 10px rgba(0,0,0,0.06));" ');

            const b64 = Buffer.from(stylizedSvg).toString('base64');
            item.image_data = `data:image/svg+xml;base64,${b64}`;
            console.log(`  🖍️ Injected Ghibli-Style SVG for: ${item.en}`);
        }
    }
    return packContent;
}

async function main() {
    console.log('🎨 Rendering test PDF with Ghibli-style SVG illustrations...');
    const enriched = injectSvgImages({ ...content });

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

    console.log('  Loading HTML & SVG assets into Puppeteer...');
    // Increase viewport to ensure everything renders smoothly
    await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: ['load', 'networkidle0'] });
    await new Promise(r => setTimeout(r, 1000));

    const outPath = path.join(OUT_DIR, 'TEST-v5-ghibli-svg.pdf');
    await page.pdf({ path: outPath, format: 'Letter', printBackground: true, margin: { top: '0', right: '0', bottom: '0', left: '0' } });
    console.log(`✅ PDF saved -> ${outPath}`);

    fs.writeFileSync(path.join(OUT_DIR, 'TEST-ghibli-svg-template.html'), html);
    console.log(`✅ HTML saved for inspection`);

    await browser.close();
    process.exit(0);
}

main().catch(e => { console.error('FATAL:', e.message, e.stack); process.exit(1); });
