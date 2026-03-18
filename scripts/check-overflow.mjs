/**
 * 批量检测所有 pack HTML 的页面溢出情况
 * 
 * 先请求 dev server 生成最新 HTML，然后用 Puppeteer 加载并检测每页是否溢出。
 * 不生成 PDF，只输出溢出报告。
 * 
 * 用法: node scripts/check-overflow.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import { OVERFLOW_HANDLER_FN } from './pdf-page-overflow.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PACKS_DIR = path.join(ROOT, 'data', 'packs');
const IMAGES_DIR = path.join(ROOT, 'data', 'images');
const OUT_DIR = path.join(ROOT, 'data', 'pdfs');
const DEV_URL = 'http://127.0.0.1:3001/api/internal/render-pdf-html';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const FREE_SAMPLE_PACKS = new Set([
  'classroom-objects_vocabulary_pack_k-2_en-es',
  'basic-greetings_sentence_frames_k-2_en-es',
  'classroom-areas_classroom_labels_k-2_en-es',
  'colors_vocabulary_pack_k-2_en-es',
  'science-vocabulary_vocabulary_pack_3-5_en-es',
  'welcome-letter_parent_communication_k-2_en-es',
]);

function makeSlug(topic, ageBand) {
  return topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')
    + '-' + ageBand.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
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
  if (enriched.vocabulary) {
    let idx = 0;
    for (const item of enriched.vocabulary) {
      if (item.image_prompt) { idx++; tryInject(path.join(imgDir, `vocab_${String(idx).padStart(2,'0')}_${safeFilename(item.en)}.png`), item, 'image_data'); }
    }
  }
  if (enriched.speaking_prompts) {
    for (let i = 0; i < enriched.speaking_prompts.length; i++) {
      const sp = enriched.speaking_prompts[i];
      if (sp.visual_cue) tryInject(path.join(imgDir, `speaking_${String(i+1).padStart(2,'0')}.png`), sp, 'image_data');
    }
  }
  if (enriched.mini_book?.pages) {
    for (const page of enriched.mini_book.pages) tryInject(path.join(imgDir, `minibook_p${page.page_number}.png`), page, 'image_data');
  }
  if (enriched.worksheets) {
    let globalIdx = enriched.vocabulary?.filter(v => v.image_prompt).length || 0;
    for (let wi = 0; wi < enriched.worksheets.length; wi++) {
      const ws = enriched.worksheets[wi];
      if (ws.items) for (const item of ws.items) {
        if (item.image_prompt) { globalIdx++; tryInject(path.join(imgDir, `ws${wi+1}_${String(globalIdx).padStart(2,'0')}_${safeFilename(item.content||item.id)}.png`), item, 'image_data'); }
      }
    }
  }
  if (enriched.visual_routine_cards) {
    for (let i = 0; i < enriched.visual_routine_cards.length; i++) {
      const rc = enriched.visual_routine_cards[i];
      if (rc.icon_prompt) tryInject(path.join(imgDir, `routine_${String(i+1).padStart(2,'0')}.png`), rc, 'image_data');
    }
  }
  if (enriched.classroom_rules) {
    for (let i = 0; i < enriched.classroom_rules.length; i++) {
      const cr = enriched.classroom_rules[i];
      if (cr.icon_prompt) tryInject(path.join(imgDir, `rule_${String(i+1).padStart(2,'0')}.png`), cr, 'image_data');
    }
  }
  return { enriched, injected };
}

// 检测单个 HTML 的溢出（不生成 PDF）
const CHECK_OVERFLOW_FN = function () {
  const LETTER_HEIGHT = 11 * 96;
  const SAFETY_MARGIN = 12;
  const pages = document.querySelectorAll('.pdf-page');
  const results = [];
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const content = page.querySelector('.page-content');
    if (!content) continue;
    const brandBar = page.querySelector('.brand-bar');
    const header = page.querySelector('.page-header');
    const footer = page.querySelector('.page-footer');
    const used = (brandBar?.offsetHeight||0) + (header?.offsetHeight||0) + (footer?.offsetHeight||0);
    const cs = window.getComputedStyle(content);
    const pt = parseFloat(cs.paddingTop)||0;
    const pb = parseFloat(cs.paddingBottom)||0;
    const avail = LETTER_HEIGHT - used - pt - pb - SAFETY_MARGIN;
    const kids = Array.from(content.children);
    const last = kids[kids.length-1];
    const cr = content.getBoundingClientRect();
    const h = last ? last.getBoundingClientRect().bottom - cr.top - pt : 0;
    const title = header?.children[1]?.textContent || '';
    if (h > avail) {
      results.push({ page: i+1, title, available: Math.round(avail), actual: Math.round(h), overflow: Math.round(h - avail) });
    }
  }
  return { totalPages: pages.length, overflowPages: results };
};

async function main() {
  const packFiles = fs.readdirSync(PACKS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => path.basename(f, '.json'))
    .sort();

  console.log(`检测 ${packFiles.length} 个 pack 的页面溢出...\n`);

  const browser = await puppeteer.launch({ headless: 'new', executablePath: CHROME_PATH });
  const allOverflows = [];
  const startTime = Date.now();

  for (let i = 0; i < packFiles.length; i++) {
    const packName = packFiles[i];
    const isSample = FREE_SAMPLE_PACKS.has(packName);
    const mode = isSample ? 'sample' : 'final';

    process.stdout.write(`[${i+1}/${packFiles.length}] ${packName} ... `);

    try {
      const content = JSON.parse(fs.readFileSync(path.join(PACKS_DIR, packName + '.json'), 'utf8'));
      const { enriched } = injectImages(content);

      // 请求 HTML
      const res = await fetch(DEV_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packContent: enriched, mode }),
        signal: AbortSignal.timeout(30000),
      });
      if (!res.ok) { console.log('❌ API错误'); continue; }
      const html = await res.text();
      const htmlPath = path.join(OUT_DIR, packName + '.html');
      fs.writeFileSync(htmlPath, html);

      // Puppeteer 检测溢出（处理前）
      const page = await browser.newPage();
      await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'networkidle2', timeout: 60000 });
      await new Promise(r => setTimeout(r, 800));

      const beforeResult = await page.evaluate(CHECK_OVERFLOW_FN);

      // 执行溢出处理
      const fixResult = await page.evaluate(OVERFLOW_HANDLER_FN);

      // 处理后再检测
      const afterResult = await page.evaluate(CHECK_OVERFLOW_FN);

      await page.close();

      if (beforeResult.overflowPages.length > 0) {
        const fixed = afterResult.overflowPages.length === 0 ? '✅已修复' : `⚠️仍有${afterResult.overflowPages.length}页溢出`;
        console.log(`⚠️ ${beforeResult.overflowPages.length}页溢出 → ${fixResult.originalPages}→${fixResult.finalPages}页 ${fixed}`);
        for (const op of beforeResult.overflowPages) {
          console.log(`    P${op.page} "${op.title}" 溢出${op.overflow}px`);
        }
        if (afterResult.overflowPages.length > 0) {
          for (const op of afterResult.overflowPages) {
            console.log(`    ❗处理后仍溢出: P${op.page} "${op.title}" 溢出${op.overflow}px`);
          }
        }
        allOverflows.push({ pack: packName, before: beforeResult.overflowPages, after: afterResult.overflowPages, fixed: afterResult.overflowPages.length === 0 });
      } else {
        console.log('✅');
      }
    } catch (err) {
      console.log(`❌ ${err.message}`);
    }
  }

  await browser.close();
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('\n========================================');
  console.log('  溢出检测报告');
  console.log('========================================');
  console.log(`  总计: ${packFiles.length} 个 pack`);
  console.log(`  有溢出: ${allOverflows.length} 个`);
  console.log(`  已修复: ${allOverflows.filter(o => o.fixed).length} 个`);
  console.log(`  仍有问题: ${allOverflows.filter(o => !o.fixed).length} 个`);
  console.log(`  耗时: ${elapsed}s`);

  if (allOverflows.filter(o => !o.fixed).length > 0) {
    console.log('\n未修复的溢出:');
    for (const o of allOverflows.filter(o => !o.fixed)) {
      console.log(`  ${o.pack}:`);
      for (const p of o.after) {
        console.log(`    P${p.page} "${p.title}" 溢出${p.overflow}px`);
      }
    }
  }
}

main().catch(e => { console.error('错误:', e); process.exit(1); });
