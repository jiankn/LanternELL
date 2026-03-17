/**
 * 批量 PDF 渲染脚本
 * 
 * 读取 data/packs/ 下所有 JSON，逐一渲染为 PDF，保存到 data/pdfs/。
 * 断点续传：已存在的 PDF 自动跳过。
 * 
 * 用法:
 *   node scripts/render-all-pdfs.mjs              # 渲染全部
 *   node scripts/render-all-pdfs.mjs --force       # 强制重新渲染所有
 *   node scripts/render-all-pdfs.mjs --pack colors # 只渲染包含 "colors" 的 pack
 * 
 * 前提: 需要先启动 dev server (npx next dev -p 3001)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PACKS_DIR = path.join(ROOT, 'data', 'packs');
const IMAGES_DIR = path.join(ROOT, 'data', 'images');
const OUT_DIR = path.join(ROOT, 'data', 'pdfs');
const DEV_URL = 'http://127.0.0.1:3001/api/internal/render-pdf-html';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

fs.mkdirSync(OUT_DIR, { recursive: true });

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { force: false, pack: null };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--force') opts.force = true;
    else if (args[i] === '--pack' && args[i + 1]) opts.pack = args[++i];
  }
  return opts;
}

function makeSlug(topic, ageBand) {
  return topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')
    + '-' + ageBand.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

// 清理文件名（与 extract-batch-prompts.mjs 保持一致）
function safeFilename(str) {
  return str.toLowerCase().replace(/[/\\:*?"<>|]+/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

function injectImages(content) {
  const slug = makeSlug(content.topic, content.age_band || 'K-2');
  const imgDir = path.join(IMAGES_DIR, slug);
  const enriched = JSON.parse(JSON.stringify(content));
  let injected = 0;

  function tryInject(fpath, target, key) {
    if (fs.existsSync(fpath)) {
      target[key] = 'data:image/png;base64,' + fs.readFileSync(fpath).toString('base64');
      injected++;
    }
  }

  if (!fs.existsSync(imgDir)) return { enriched, injected };

  // Vocabulary
  if (enriched.vocabulary) {
    let idx = 0;
    for (const item of enriched.vocabulary) {
      if (item.image_prompt) {
        idx++;
        const fname = `vocab_${String(idx).padStart(2, '0')}_${safeFilename(item.en)}.png`;
        tryInject(path.join(imgDir, fname), item, 'image_data');
      }
    }
  }

  // Speaking prompts
  if (enriched.speaking_prompts) {
    for (let i = 0; i < enriched.speaking_prompts.length; i++) {
      const sp = enriched.speaking_prompts[i];
      if (sp.visual_cue) {
        tryInject(path.join(imgDir, `speaking_${String(i + 1).padStart(2, '0')}.png`), sp, 'image_data');
      }
    }
  }

  // Mini book
  if (enriched.mini_book?.pages) {
    for (const page of enriched.mini_book.pages) {
      if (page.image_prompt) {
        tryInject(path.join(imgDir, `minibook_p${page.page_number}.png`), page, 'image_data');
      }
    }
  }

  // Worksheets
  if (enriched.worksheets) {
    let globalIdx = enriched.vocabulary?.filter(v => v.image_prompt).length || 0;
    for (let wi = 0; wi < enriched.worksheets.length; wi++) {
      const ws = enriched.worksheets[wi];
      if (ws.items) {
        for (const item of ws.items) {
          if (item.image_prompt) {
            globalIdx++;
            const fname = `ws${wi + 1}_${String(globalIdx).padStart(2, '0')}_${safeFilename(item.content || item.id)}.png`;
            tryInject(path.join(imgDir, fname), item, 'image_data');
          }
        }
      }
    }
  }

  // Routine cards
  if (enriched.visual_routine_cards) {
    for (let i = 0; i < enriched.visual_routine_cards.length; i++) {
      const rc = enriched.visual_routine_cards[i];
      if (rc.icon_prompt) {
        tryInject(path.join(imgDir, `routine_${String(i + 1).padStart(2, '0')}.png`), rc, 'image_data');
      }
    }
  }

  // Classroom rules
  if (enriched.classroom_rules) {
    for (let i = 0; i < enriched.classroom_rules.length; i++) {
      const cr = enriched.classroom_rules[i];
      if (cr.icon_prompt) {
        tryInject(path.join(imgDir, `rule_${String(i + 1).padStart(2, '0')}.png`), cr, 'image_data');
      }
    }
  }

  return { enriched, injected };
}

async function renderOne(packFileName, browser) {
  const packFile = path.join(PACKS_DIR, packFileName + '.json');
  const outputPath = path.join(OUT_DIR, packFileName + '.pdf');
  const htmlPath = path.join(OUT_DIR, packFileName + '.html');

  const content = JSON.parse(fs.readFileSync(packFile, 'utf8'));
  const { enriched, injected } = injectImages(content);

  // 请求 dev server 渲染 HTML
  const res = await fetch(DEV_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ packContent: enriched, mode: 'sample' }),
    signal: AbortSignal.timeout(30000),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API 错误 ${res.status}: ${err.substring(0, 300)}`);
  }

  const html = await res.text();
  fs.writeFileSync(htmlPath, html);

  // Puppeteer 渲染 PDF
  const page = await browser.newPage();
  try {
    await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });
    await new Promise(r => setTimeout(r, 1500));

    await page.pdf({
      path: outputPath,
      format: 'Letter',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });
  } finally {
    await page.close();
  }

  const sizeMB = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(2);
  return { injected, sizeMB };
}

async function main() {
  const opts = parseArgs();

  let packFiles = fs.readdirSync(PACKS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => path.basename(f, '.json'))
    .sort();

  if (opts.pack) {
    packFiles = packFiles.filter(f => f.toLowerCase().includes(opts.pack.toLowerCase()));
    console.log(`过滤后: ${packFiles.length} 个 pack`);
  }

  // 断点续传：跳过已存在的 PDF
  const toRender = opts.force
    ? packFiles
    : packFiles.filter(f => !fs.existsSync(path.join(OUT_DIR, f + '.pdf')));

  const skipped = packFiles.length - toRender.length;

  console.log('========================================');
  console.log('  批量 PDF 渲染');
  console.log('========================================');
  console.log(`  总计: ${packFiles.length} 个 pack`);
  console.log(`  跳过: ${skipped} 个 (已存在)`);
  console.log(`  待渲染: ${toRender.length} 个`);
  console.log('');

  if (toRender.length === 0) {
    console.log('所有 PDF 已存在，无需操作。');
    return;
  }

  // 启动 Puppeteer（复用 browser 实例）
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
  });

  const results = { success: 0, failed: 0 };
  const startTime = Date.now();

  for (let i = 0; i < toRender.length; i++) {
    const packName = toRender[i];
    process.stdout.write(`  [${i + 1}/${toRender.length}] ${packName} ... `);
    try {
      const { injected, sizeMB } = await renderOne(packName, browser);
      results.success++;
      console.log(`✅ (${sizeMB}MB, ${injected} 张图)`);
    } catch (err) {
      results.failed++;
      console.log(`❌ ${err.message}`);
    }
  }

  await browser.close();

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log('');
  console.log('========================================');
  console.log('  完成');
  console.log('========================================');
  console.log(`  耗时: ${elapsed}s`);
  console.log(`  成功: ${results.success}`);
  console.log(`  失败: ${results.failed}`);
  console.log(`  输出目录: ${OUT_DIR}`);
}

main().catch(e => { console.error('致命错误:', e); process.exit(1); });
