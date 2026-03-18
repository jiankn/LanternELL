/**
 * 单 Pack PDF 渲染脚本
 * 
 * 读取 pack JSON，注入已生成的图片（base64），
 * 发给 dev server 渲染 HTML，再用 Puppeteer 转 PDF。
 * 
 * 用法: node scripts/render-one-pdf.mjs <pack-json-filename>
 * 示例: node scripts/render-one-pdf.mjs basic-greetings_sentence-frames_k-2_en-es
 * 
 * 前提: 需要先启动 dev server (npx next dev -p 3001)
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

fs.mkdirSync(OUT_DIR, { recursive: true });

function makeSlug(topic, ageBand) {
  return topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')
    + '-' + ageBand.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

/**
 * 将 data/images/ 下的图片注入到 pack JSON 中（base64）
 */
function injectImages(content) {
  const slug = makeSlug(content.topic, content.age_band || 'K-2');
  const imgDir = path.join(IMAGES_DIR, slug);

  if (!fs.existsSync(imgDir)) {
    console.log(`  图片目录不存在: ${imgDir}，跳过图片注入`);
    return content;
  }

  const enriched = JSON.parse(JSON.stringify(content));
  let injected = 0;

  // Vocabulary
  if (enriched.vocabulary) {
    let idx = 0;
    for (const item of enriched.vocabulary) {
      if (item.image_prompt) {
        idx++;
        const fname = `vocab_${String(idx).padStart(2, '0')}_${item.en.toLowerCase().replace(/\s+/g, '-')}.png`;
        const fpath = path.join(imgDir, fname);
        if (fs.existsSync(fpath)) {
          item.image_data = 'data:image/png;base64,' + fs.readFileSync(fpath).toString('base64');
          injected++;
        }
      }
    }
  }

  // Speaking prompts
  if (enriched.speaking_prompts) {
    for (let i = 0; i < enriched.speaking_prompts.length; i++) {
      const sp = enriched.speaking_prompts[i];
      if (sp.visual_cue) {
        const fname = `speaking_${String(i + 1).padStart(2, '0')}.png`;
        const fpath = path.join(imgDir, fname);
        if (fs.existsSync(fpath)) {
          sp.image_data = 'data:image/png;base64,' + fs.readFileSync(fpath).toString('base64');
          injected++;
        }
      }
    }
  }

  // Mini book
  if (enriched.mini_book?.pages) {
    for (const page of enriched.mini_book.pages) {
      // 无论是否有 image_prompt，只要图片文件存在就注入
      const fname = `minibook_p${page.page_number}.png`;
      const fpath = path.join(imgDir, fname);
      if (fs.existsSync(fpath)) {
        page.image_data = 'data:image/png;base64,' + fs.readFileSync(fpath).toString('base64');
        injected++;
      }
    }
  }

  // Worksheets
  if (enriched.worksheets) {
    // 需要全局 idx 计数器来匹配文件名
    let globalIdx = enriched.vocabulary?.filter(v => v.image_prompt).length || 0;
    for (let wi = 0; wi < enriched.worksheets.length; wi++) {
      const ws = enriched.worksheets[wi];
      if (ws.items) {
        for (const item of ws.items) {
          if (item.image_prompt) {
            globalIdx++;
            const fname = `ws${wi + 1}_${String(globalIdx).padStart(2, '0')}_${(item.content || item.id).toLowerCase().replace(/\s+/g, '-')}.png`;
            const fpath = path.join(imgDir, fname);
            if (fs.existsSync(fpath)) {
              item.image_data = 'data:image/png;base64,' + fs.readFileSync(fpath).toString('base64');
              injected++;
            }
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
        const fname = `routine_${String(i + 1).padStart(2, '0')}.png`;
        const fpath = path.join(imgDir, fname);
        if (fs.existsSync(fpath)) {
          rc.image_data = 'data:image/png;base64,' + fs.readFileSync(fpath).toString('base64');
          injected++;
        }
      }
    }
  }

  // Classroom rules
  if (enriched.classroom_rules) {
    for (let i = 0; i < enriched.classroom_rules.length; i++) {
      const cr = enriched.classroom_rules[i];
      if (cr.icon_prompt) {
        const fname = `rule_${String(i + 1).padStart(2, '0')}.png`;
        const fpath = path.join(imgDir, fname);
        if (fs.existsSync(fpath)) {
          cr.image_data = 'data:image/png;base64,' + fs.readFileSync(fpath).toString('base64');
          injected++;
        }
      }
    }
  }

  console.log(`  注入图片: ${injected} 张`);
  return enriched;
}

async function renderPDF(packFileName) {
  const packFile = path.join(PACKS_DIR, packFileName + '.json');
  if (!fs.existsSync(packFile)) {
    console.error('Pack 不存在:', packFile);
    process.exit(1);
  }

  const outputPath = path.join(OUT_DIR, packFileName + '.pdf');
  console.log(`\n渲染: ${packFileName}`);

  // 1. 读取并注入图片
  const content = JSON.parse(fs.readFileSync(packFile, 'utf8'));
  const enriched = injectImages(content);

  // 2. 请求 dev server 渲染 HTML
  console.log('  请求 HTML...');
  const res = await fetch(DEV_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ packContent: enriched, mode: 'sample' }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('  API 错误:', err.substring(0, 500));
    process.exit(1);
  }

  const html = await res.text();
  console.log(`  HTML: ${(html.length / 1024).toFixed(0)}KB`);

  // 3. 保存 HTML（调试用）
  const htmlPath = path.join(OUT_DIR, packFileName + '.html');
  fs.writeFileSync(htmlPath, html);

  // 4. Puppeteer 渲染 PDF
  console.log('  Puppeteer 渲染 PDF...');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  });
  const page = await browser.newPage();

  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), {
    waitUntil: 'networkidle2',
    timeout: 60000,
  });
  await new Promise(r => setTimeout(r, 2000));

  // 溢出处理：检测并拆分超出页面高度的内容
  const overflowResult = await page.evaluate(OVERFLOW_HANDLER_FN);
  if (overflowResult.overflowPages > 0) {
    console.log(`  溢出处理: ${overflowResult.originalPages} → ${overflowResult.finalPages} 页 (${overflowResult.overflowPages} 页溢出)`);
  }

  await page.pdf({
    path: outputPath,
    format: 'Letter',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });

  const sizeMB = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(2);
  console.log(`  PDF: ${outputPath} (${sizeMB}MB)`);

  await browser.close();
  console.log('  完成!');
}

// 入口
const packName = process.argv[2];
if (!packName) {
  console.error('用法: node scripts/render-one-pdf.mjs <pack-name>');
  console.error('示例: node scripts/render-one-pdf.mjs basic-greetings_sentence-frames_k-2_en-es');
  process.exit(1);
}
renderPDF(packName).catch(e => { console.error('错误:', e); process.exit(1); });
