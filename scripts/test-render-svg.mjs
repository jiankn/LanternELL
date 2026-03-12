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

// High-quality, vibrant, multi-layered SVG illustrations
const SVG_ICONS = {
    'pencil': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <g transform="rotate(45, 50, 50)">
      <!-- Eraser -->
      <rect x="35" y="10" width="30" height="15" rx="5" fill="#FF8A80" />
      <rect x="35" y="10" width="15" height="15" rx="5" fill="#FF5252" />
      <!-- Metal band -->
      <rect x="35" y="25" width="30" height="10" fill="#B0BEC5" />
      <rect x="35" y="25" width="15" height="10" fill="#90A4AE" />
      <line x1="45" y1="25" x2="45" y2="35" stroke="#78909C" stroke-width="2"/>
      <line x1="55" y1="25" x2="55" y2="35" stroke="#CFD8DC" stroke-width="2"/>
      <!-- Body -->
      <rect x="35" y="35" width="30" height="40" fill="#FFCA28" />
      <rect x="35" y="35" width="15" height="40" fill="#FFB300" />
      <line x1="45" y1="35" x2="45" y2="75" stroke="#FFA000" stroke-width="2"/>
      <line x1="55" y1="35" x2="55" y2="75" stroke="#FFE082" stroke-width="2"/>
      <!-- Wood tip -->
      <polygon points="35,75 65,75 50,90" fill="#FFE082" />
      <polygon points="35,75 50,75 50,90" fill="#FFCA28" />
      <!-- Lead -->
      <polygon points="46,86 54,86 50,90" fill="#455A64" />
      <polygon points="46,86 50,86 50,90" fill="#263238" />
    </g>
  </svg>`,

    'book': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <g transform="translate(0, 5) rotate(-5, 50, 50)">
      <!-- Back cover / pages -->
      <rect x="25" y="20" width="50" height="65" rx="3" fill="#E0E0E0" />
      <rect x="22" y="22" width="50" height="65" rx="3" fill="#F5F5F5" />
      <!-- Front cover -->
      <rect x="18" y="25" width="48" height="62" rx="2" fill="#29B6F6" />
      <path d="M18 25 Q 25 25 25 87 L 18 87 Z" fill="#039BE5" />
      <!-- Bookmark -->
      <rect x="45" y="22" width="8" height="20" fill="#EF5350" />
      <polygon points="45,42 53,42 49,46" fill="#EF5350" />
      <rect x="45" y="22" width="4" height="20" fill="#E53935" />
      <polygon points="45,42 49,42 49,46" fill="#E53935" />
      <!-- Title lines -->
      <rect x="30" y="35" width="25" height="6" rx="3" fill="#B3E5FC" />
      <rect x="30" y="45" width="15" height="4" rx="2" fill="#B3E5FC" />
      <!-- Logo/Graphic -->
      <circle cx="42" cy="65" r="10" fill="#FFF176" />
      <circle cx="42" cy="65" r="5" fill="#FFD54F" />
    </g>
  </svg>`,

    'chair': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <!-- Back legs -->
    <rect x="35" y="50" width="6" height="40" rx="3" fill="#8D6E63" />
    <rect x="65" y="50" width="6" height="40" rx="3" fill="#5D4037" />
    <!-- Backrest -->
    <rect x="32" y="15" width="42" height="30" rx="5" fill="#26A69A" />
    <rect x="38" y="22" width="30" height="6" rx="3" fill="#80CBC4" />
    <rect x="38" y="32" width="30" height="6" rx="3" fill="#80CBC4" />
    <!-- Seat Depth -->
    <polygon points="30,45 76,45 80,55 26,55" fill="#00796B" />
    <!-- Seat Surface -->
    <polygon points="30,45 76,45 72,52 26,52" fill="#00897B" />
    <path d="M26 52 A 2 2 0 0 0 26 55 L80 55 A 2 2 0 0 0 72 52 Z" fill="#00695C" />
    <!-- Front legs -->
    <rect x="30" y="55" width="6" height="35" rx="3" fill="#795548" />
    <rect x="70" y="55" width="6" height="35" rx="3" fill="#4E342E" />
    <!-- Highlights -->
    <rect x="34" y="17" width="3" height="15" fill="#4DB6AC" rx="1" />
  </svg>`,

    'table': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <!-- Back legs -->
    <rect x="25" y="45" width="6" height="35" rx="2" fill="#8D6E63" />
    <rect x="75" y="45" width="6" height="35" rx="2" fill="#5D4037" />
    <!-- Table top shadow / thickness -->
    <polygon points="12,45 88,45 92,50 8,50" fill="#FF9800" />
    <!-- Table top surface -->
    <polygon points="20,30 80,30 92,45 8,45" fill="#FFB74D" />
    <!-- Highlight -->
    <polygon points="22,32 78,32 88,43 12,43" fill="#FFCC80" />
    <!-- Front legs -->
    <rect x="15" y="50" width="8" height="40" rx="3" fill="#795548" />
    <rect x="80" y="50" width="8" height="40" rx="3" fill="#4E342E" />
    <rect x="15" y="50" width="3" height="35" rx="1" fill="#8D6E63" />
  </svg>`,

    'crayon': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <g transform="rotate(-45, 50, 50)">
      <!-- Crayon body base -->
      <rect x="35" y="30" width="30" height="50" fill="#EC407A" />
      <rect x="35" y="30" width="10" height="50" fill="#D81B60" />
      <rect x="55" y="30" width="10" height="50" fill="#F48FB1" />
      <!-- Wrapper design -->
      <path d="M35 40 Q 50 45 65 40 L65 45 Q 50 50 35 45 Z" fill="#212121" />
      <path d="M35 70 Q 50 75 65 70 L65 75 Q 50 80 35 75 Z" fill="#212121" />
      <ellipse cx="50" cy="57" rx="8" ry="12" fill="#212121" />
      <ellipse cx="50" cy="57" rx="6" ry="10" fill="#EC407A" />
      <!-- Tip -->
      <polygon points="35,30 65,30 50,10" fill="#D81B60" />
      <polygon points="35,30 50,30 50,10" fill="#C2185B" />
      <polygon points="65,30 50,30 50,10" fill="#F06292" />
      <!-- Flat bottom -->
      <path d="M 35 80 Q 50 85 65 80 L65 82 C 60 88 40 88 35 82 Z" fill="#D81B60" />
    </g>
  </svg>`,

    'paper': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <!-- Stack paper 2 -->
    <rect x="35" y="15" width="45" height="60" rx="2" fill="#ECEFF1" transform="rotate(10, 50, 50)" />
    <!-- Stack paper 1 -->
    <rect x="25" y="20" width="45" height="60" rx="2" fill="#FAFAFA" transform="rotate(-5, 50, 50)" />
    <!-- Main paper -->
    <rect x="30" y="25" width="45" height="60" rx="2" fill="#FFFFFF" stroke="#E0E0E0" stroke-width="1" />
    <rect x="30" y="25" width="6" height="60" fill="#F8BBD0" /> <!-- Red margin line margin -->
    <line x1="36" y1="25" x2="36" y2="85" stroke="#F48FB1" stroke-width="2" />
    <!-- Lines -->
    <rect x="42" y="40" width="25" height="2" fill="#81D4FA" />
    <rect x="42" y="50" width="25" height="2" fill="#81D4FA" />
    <rect x="42" y="60" width="25" height="2" fill="#81D4FA" />
    <rect x="42" y="70" width="15" height="2" fill="#81D4FA" />
    <!-- Fold -->
    <polygon points="75,25 75,35 65,25" fill="#E0E0E0" />
    <polyline points="65,25 65,35 75,35" fill="none" stroke="#BDBDBD" stroke-width="1" />
  </svg>`,

    'scissors': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <g transform="rotate(30, 50, 50)">
      <!-- Blades Base -->
      <polygon points="45,40 45,10 50,5 50,40" fill="#B0BEC5" />
      <polygon points="55,40 55,10 50,5 50,40" fill="#CFD8DC" />
      <polygon points="50,40 60,80 55,85 45,40" fill="#CFD8DC" />
      <!-- Cutting edge -->
      <polygon points="45,40 45,10 47,8 47,40" fill="#ECEFF1" />
      <polygon points="55,40 55,10 53,8 53,40" fill="#ECEFF1" />
      <!-- Handles -->
      <path d="M48 40 C 30 35, 15 50, 20 75 C 25 85, 45 80, 48 70 L48 40" fill="#E53935" />
      <path d="M48 40 C 35 38, 25 50, 28 68 C 30 75, 40 72, 43 65 L43 40" fill="#B71C1C" />
      
      <path d="M52 40 C 70 35, 85 50, 80 75 C 75 85, 55 80, 52 70 L52 40" fill="#EF5350" />
      <path d="M52 40 C 65 38, 75 50, 72 68 C 70 75, 60 72, 57 65 L57 40" fill="#C62828" />

      <!-- Center shadow for intersection -->
      <polygon points="50,40 40,80 45,85 55,40" fill="#90A4AE" />
      <!-- Screw -->
      <circle cx="50" cy="40" r="3" fill="#FFF" />
      <circle cx="50" cy="40" r="2" fill="#546E7A" />
    </g>
  </svg>`,

    'glue': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <!-- Bottle body shadow -->
    <rect x="35" y="45" width="15" height="45" rx="5" fill="#FFB300" />
    <rect x="50" y="45" width="15" height="45" rx="5" fill="#FFCA28" />
    <!-- Bottle body base -->
    <rect x="35" y="45" width="30" height="45" rx="5" fill="#FFCA28" />
    <rect x="37" y="45" width="6" height="40" rx="3" fill="#FFE082" />
    <!-- Label -->
    <rect x="35" y="55" width="30" height="25" fill="#03A9F4" />
    <rect x="35" y="55" width="15" height="25" fill="#0288D1" />
    <circle cx="50" cy="67" r="8" fill="#FFF" />
    <circle cx="50" cy="67" r="5" fill="#4DB6AC" />
    <!-- Cap base -->
    <rect x="40" y="38" width="20" height="7" rx="1" fill="#E0E0E0" />
    <rect x="40" y="38" width="10" height="7" rx="1" fill="#BDBDBD" />
    <!-- Cap tip -->
    <polygon points="40,38 60,38 53,15 47,15" fill="#FF7043" />
    <polygon points="40,38 50,38 50,15 47,15" fill="#F4511E" />
    <rect x="47" y="10" width="6" height="5" fill="#FF5722" />
    <path d="M47 10 Q 50 2 53 10 Z" fill="#F4511E" />
  </svg>`,

    'backpack': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="45" fill="#E1F5FE" />
    <path d="M 30,50 A 20,20 0 0,1 70,50 L 75,85 A 5,5 0 0,1 70,90 L 30,90 A 5,5 0 0,1 25,85 Z" fill="#5C6BC0" />
    <path d="M 30,50 A 20,20 0 0,1 50,30 L 50,90 L 30,90 A 5,5 0 0,1 25,85 Z" fill="#3F51B5" />
    <path d="M 35,60 A 15,15 0 0,1 65,60 L 68,80 L 32,80 Z" fill="#42A5F5" />
    <path d="M 35,60 A 15,15 0 0,1 50,45 L 50,80 L 32,80 Z" fill="#1E88E5" />
    <rect x="45" y="65" width="10" height="5" fill="#FFCA28" rx="2" />
    <path d="M 45,30 L 45,20 A 5,5 0 0,1 55,20 L 55,30" fill="none" stroke="#283593" stroke-width="4" stroke-linecap="round" />
  </svg>`,

    // Default fallback for any word not explicitly defined
    'default': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect x="10" y="10" width="80" height="80" rx="15" fill="#F3F4F6" />
    <circle cx="50" cy="40" r="15" fill="#E5E7EB" />
    <path d="M20 90 Q 50 60 80 90 Z" fill="#D1D5DB" />
    <circle cx="70" cy="30" r="5" fill="#9CA3AF" />
  </svg>`
};

function injectSvgImages(packContent) {
    if (packContent.vocabulary) {
        for (const item of packContent.vocabulary) {
            const key = Object.keys(SVG_ICONS).find(k => item.en.toLowerCase().includes(k)) || 'default';
            const svgString = SVG_ICONS[key];

            // Allow SVG to fill the container perfectly
            const stylizedSvg = svgString.replace('<svg ', '<svg width="100%" height="90%" style="object-fit: contain;" ');

            const b64 = Buffer.from(stylizedSvg).toString('base64');
            item.image_data = `data:image/svg+xml;base64,${b64}`;
            console.log(`  🖍️ Injected Multi-Layer SVG for: ${item.en}`);
        }
    }
    return packContent;
}

async function main() {
    console.log('🎨 Rendering test PDF with Premium Multi-Layer SVG illustrations...');
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
    await page.setContent(html, { waitUntil: ['load', 'networkidle0'] });
    await new Promise(r => setTimeout(r, 1000));

    const outPath = path.join(OUT_DIR, 'TEST-v4-premium-svg.pdf');
    await page.pdf({ path: outPath, format: 'Letter', printBackground: true, margin: { top: '0', right: '0', bottom: '0', left: '0' } });
    console.log(`✅ PDF saved -> ${outPath}`);

    fs.writeFileSync(path.join(OUT_DIR, 'TEST-premium-svg-template.html'), html);
    console.log(`✅ HTML saved for inspection`);

    await browser.close();
    process.exit(0);
}

main().catch(e => { console.error('FATAL:', e.message, e.stack); process.exit(1); });
