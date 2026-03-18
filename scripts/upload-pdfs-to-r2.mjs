/**
 * 上传 PDF 到 Cloudflare R2 + 更新远程 D1 数据库
 * 
 * 直接使用 wrangler CLI 操作，无需本地数据库。
 * 
 * 用法:
 *   node scripts/upload-pdfs-to-r2.mjs              # 上传全部
 *   node scripts/upload-pdfs-to-r2.mjs --dry-run    # 仅预览，不实际上传
 *   node scripts/upload-pdfs-to-r2.mjs --pack colors # 只上传包含 "colors" 的
 * 
 * 前提: npx wrangler login 已完成
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PDF_DIR = path.join(ROOT, 'data', 'pdfs');
const BUCKET = 'lanternell-files-prod';
const D1_DB = 'lanternell-prod';

// 6 个 free sample pack — 同时上传到 pdfs/ 和 samples/
const FREE_SAMPLE_PACKS = new Set([
  'classroom-objects_vocabulary_pack_k-2_en-es',
  'basic-greetings_sentence_frames_k-2_en-es',
  'classroom-areas_classroom_labels_k-2_en-es',
  'colors_vocabulary_pack_k-2_en-es',
  'science-vocabulary_vocabulary_pack_3-5_en-es',
  'welcome-letter_parent_communication_k-2_en-es',
]);

// 文件名 → DB slug 的特殊映射（文件名缩写 vs DB 全称）
const SLUG_OVERRIDES = {
  'arts-music-vocabulary-pack-3-5-en-es': 'arts-and-music-vocabulary-pack-3-5-en-es',
  'book-reports-reading-logs-sentence-frames-3-5-en-es': 'book-reports-and-reading-logs-sentence-frames-3-5-en-es',
  'career-life-skills-vocabulary-pack-6-8-en-es': 'career-and-life-skills-vocabulary-pack-6-8-en-es',
  'days-months-classroom-labels-k-2-en-es': 'days-and-months-classroom-labels-k-2-en-es',
  'feelings-emotions-vocabulary-pack-k-2-en-es': 'feelings-and-emotions-vocabulary-pack-k-2-en-es',
  'geography-maps-vocabulary-pack-3-5-en-es': 'geography-and-maps-vocabulary-pack-3-5-en-es',
  'health-safety-vocabulary-pack-3-5-en-es': 'health-and-safety-vocabulary-pack-3-5-en-es',
  'lab-reports-scientific-method-vocabulary-pack-6-8-en-es': 'lab-reports-and-scientific-method-vocabulary-pack-6-8-en-es',
  'reading-writing-vocabulary-pack-3-5-en-es': 'reading-and-writing-vocabulary-pack-3-5-en-es',
  'research-citation-sentence-frames-6-8-en-es': 'research-and-citation-sentence-frames-6-8-en-es',
  'sharing-taking-turns-sentence-frames-k-2-en-es': 'sharing-and-taking-turns-sentence-frames-k-2-en-es',
  'technology-computers-vocabulary-pack-3-5-en-es': 'technology-and-computers-vocabulary-pack-3-5-en-es',
  'time-clock-classroom-labels-k-2-en-es': 'time-and-clock-classroom-labels-k-2-en-es',
  'weather-seasons-vocabulary-pack-k-2-en-es': 'weather-and-seasons-vocabulary-pack-k-2-en-es',
  'writing-prompts-responses-sentence-frames-3-5-en-es': 'writing-prompts-and-responses-sentence-frames-3-5-en-es',
};

function fileToDbSlug(fileName) {
  const slug = fileName.replace(/_/g, '-');
  return SLUG_OVERRIDES[slug] || slug;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { dryRun: false, pack: null };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--dry-run') opts.dryRun = true;
    else if (args[i] === '--pack' && args[i + 1]) opts.pack = args[++i];
  }
  return opts;
}

function r2Put(localPath, remoteKey) {
  execSync(
    `npx wrangler r2 object put "${BUCKET}/${remoteKey}" --file="${localPath}" --remote`,
    { stdio: 'pipe', cwd: ROOT }
  );
}

function d1Exec(sql) {
  const escaped = sql.replace(/'/g, "''");
  execSync(
    `npx wrangler d1 execute ${D1_DB} --remote --command "${sql}"`,
    { stdio: 'pipe', cwd: ROOT }
  );
}

async function main() {
  const opts = parseArgs();

  let pdfFiles = fs.readdirSync(PDF_DIR)
    .filter(f => f.endsWith('.pdf'))
    .map(f => path.basename(f, '.pdf'))
    .sort();

  if (opts.pack) {
    pdfFiles = pdfFiles.filter(f => f.toLowerCase().includes(opts.pack.toLowerCase()));
  }

  console.log('========================================');
  console.log('  R2 上传 + D1 数据库更新');
  console.log('========================================');
  console.log(`  待处理: ${pdfFiles.length} 个 PDF`);
  console.log(`  模式: ${opts.dryRun ? '预览 (dry-run)' : '正式上传'}`);
  console.log('');

  let success = 0, failed = 0;

  for (let i = 0; i < pdfFiles.length; i++) {
    const packName = pdfFiles[i];
    const localPath = path.join(PDF_DIR, packName + '.pdf');
    const isSample = FREE_SAMPLE_PACKS.has(packName);
    const dbSlug = fileToDbSlug(packName);
    const sizeMB = (fs.statSync(localPath).size / 1024 / 1024).toFixed(2);

    const pdfKey = `pdfs/${packName}.pdf`;
    const sampleKey = isSample ? `samples/${packName}.pdf` : null;

    process.stdout.write(`  [${i + 1}/${pdfFiles.length}] ${packName} (${sizeMB}MB) ... `);

    if (opts.dryRun) {
      console.log(`🔍 → R2: ${pdfKey}${sampleKey ? ' + ' + sampleKey : ''} → DB: ${dbSlug}`);
      success++;
      continue;
    }

    try {
      // 1. 上传 final PDF 到 pdfs/
      r2Put(localPath, pdfKey);

      // 2. free sample 同时上传到 samples/
      if (sampleKey) {
        r2Put(localPath, sampleKey);
      }

      // 3. 更新远程 D1 数据库
      const sql = sampleKey
        ? `UPDATE resources SET pdf_url = '${pdfKey}', sample_pdf_url = '${sampleKey}', updated_at = datetime('now') WHERE slug = '${dbSlug}'`
        : `UPDATE resources SET pdf_url = '${pdfKey}', updated_at = datetime('now') WHERE slug = '${dbSlug}'`;
      d1Exec(sql);

      const tag = isSample ? '📎sample+final' : '📄final';
      console.log(`✅ ${tag}`);
      success++;
    } catch (err) {
      console.log(`❌ ${err.message.substring(0, 120)}`);
      failed++;
    }
  }

  console.log('');
  console.log('========================================');
  console.log('  完成');
  console.log('========================================');
  console.log(`  成功: ${success}`);
  console.log(`  失败: ${failed}`);
}

main().catch(e => { console.error('致命错误:', e); process.exit(1); });
