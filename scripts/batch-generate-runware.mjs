/**
 * Runware API 批量生图脚本
 * 
 * 读取 data/batch-prompts.json，调用 Runware API 生成图片，
 * 下载到 data/images/{pack-slug}/ 目录。
 * 
 * 功能：
 * - 跳过已下载的图片（断点续传）
 * - 并发控制（默认 3 并发）
 * - 自动重试（最多 3 次）
 * - 进度日志
 * 
 * 用法:
 *   node scripts/batch-generate-runware.mjs              # 全量生成
 *   node scripts/batch-generate-runware.mjs --pack colors # 只生成包含 "colors" 的 pack
 *   node scripts/batch-generate-runware.mjs --dry-run     # 预览，不实际调用 API
 *   node scripts/batch-generate-runware.mjs --concurrency 5  # 5 并发
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PROMPTS_FILE = path.join(ROOT, 'data', 'batch-prompts.json');
const LOG_FILE = path.join(ROOT, 'data', 'runware-batch-log.txt');

// ============================================================
// Runware API 配置
// ============================================================
const RUNWARE_API_URL = 'https://api.runware.ai/v1';
const RUNWARE_API_KEY = 'R3gClu3TirVGjOxLGdm1WtF8I6sdZCTk';
const RUNWARE_MODEL = 'runware:z-image@turbo';

const DEFAULT_CONCURRENCY = 3;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

// ============================================================
// 工具函数
// ============================================================
function log(msg) {
  const ts = new Date().toISOString();
  const line = `[${ts}] ${msg}`;
  console.log(msg);
  fs.appendFileSync(LOG_FILE, line + '\n', 'utf8');
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { pack: null, dryRun: false, concurrency: DEFAULT_CONCURRENCY };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--pack' && args[i + 1]) { opts.pack = args[++i]; }
    else if (args[i] === '--dry-run') { opts.dryRun = true; }
    else if (args[i] === '--concurrency' && args[i + 1]) { opts.concurrency = parseInt(args[++i], 10); }
  }
  return opts;
}


// ============================================================
// Runware API 调用
// ============================================================
async function callRunwareAPI(prompt) {
  const body = [
    {
      taskType: 'imageInference',
      numberResults: 1,
      width: 1024,
      height: 1024,
      steps: 9,
      CFGScale: 0,
      includeCost: true,
      checkNSFW: true,
      outputType: ['URL'],
      model: RUNWARE_MODEL,
      positivePrompt: prompt,
    },
  ];

  const res = await fetch(RUNWARE_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RUNWARE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(60000),
  });

  if (res.status === 429) {
    return { retry: true, msg: '429 rate limited' };
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${text.substring(0, 300)}`);
  }

  const data = await res.json();

  // Runware 返回格式: { data: [{ imageURL: "...", cost: ... }] }
  if (data.data && data.data[0] && data.data[0].imageURL) {
    return {
      retry: false,
      url: data.data[0].imageURL,
      cost: data.data[0].cost || 0,
    };
  }

  throw new Error('Runware 返回无图片: ' + JSON.stringify(data).substring(0, 300));
}

// ============================================================
// 下载图片
// ============================================================
async function downloadImage(url, outputPath) {
  const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`下载失败 ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(outputPath, buffer);
  return buffer.length;
}

// ============================================================
// 单张图片生成（含重试）
// ============================================================
async function generateOne(image, dryRun) {
  const outputDir = path.join(ROOT, image.output_dir);
  const outputPath = path.join(outputDir, image.output_filename);

  // 跳过已存在的图片
  if (fs.existsSync(outputPath)) {
    const sizeKB = Math.round(fs.statSync(outputPath).size / 1024);
    return { status: 'skipped', id: image.id, sizeKB };
  }

  if (dryRun) {
    return { status: 'dry-run', id: image.id };
  }

  // 确保输出目录存在
  fs.mkdirSync(outputDir, { recursive: true });

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await callRunwareAPI(image.full_prompt);

      if (result.retry) {
        log(`  ⏳ ${image.id} - 429 限流，等待 ${RETRY_DELAY_MS * attempt}ms 后重试 (${attempt}/${MAX_RETRIES})`);
        await sleep(RETRY_DELAY_MS * attempt);
        continue;
      }

      // 下载图片
      const bytes = await downloadImage(result.url, outputPath);
      const sizeKB = Math.round(bytes / 1024);
      return { status: 'success', id: image.id, sizeKB, cost: result.cost };
    } catch (err) {
      if (attempt < MAX_RETRIES) {
        log(`  ⚠️ ${image.id} - 错误: ${err.message}，重试 (${attempt}/${MAX_RETRIES})`);
        await sleep(RETRY_DELAY_MS);
      } else {
        return { status: 'failed', id: image.id, error: err.message };
      }
    }
  }

  return { status: 'failed', id: image.id, error: '超过最大重试次数' };
}


// ============================================================
// 并发控制器
// ============================================================
async function runWithConcurrency(tasks, concurrency, dryRun) {
  const results = { success: 0, skipped: 0, failed: 0, dryRun: 0, totalCost: 0 };
  const total = tasks.length;
  let completed = 0;
  let activeIndex = 0;

  async function worker() {
    while (activeIndex < tasks.length) {
      const idx = activeIndex++;
      const image = tasks[idx];
      const result = await generateOne(image, dryRun);
      completed++;

      switch (result.status) {
        case 'success':
          results.success++;
          results.totalCost += result.cost || 0;
          log(`  ✅ [${completed}/${total}] ${result.id} (${result.sizeKB}KB, $${(result.cost || 0).toFixed(4)})`);
          break;
        case 'skipped':
          results.skipped++;
          break;
        case 'failed':
          results.failed++;
          log(`  ❌ [${completed}/${total}] ${result.id} - ${result.error}`);
          break;
        case 'dry-run':
          results.dryRun++;
          break;
      }

      // 每 50 张打印一次进度
      if (completed % 50 === 0) {
        log(`\n📊 进度: ${completed}/${total} (成功: ${results.success}, 跳过: ${results.skipped}, 失败: ${results.failed})\n`);
      }
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);
  return results;
}

// ============================================================
// 主函数
// ============================================================
async function main() {
  const opts = parseArgs();

  log('========================================');
  log('  Runware 批量生图');
  log('========================================');
  log(`  并发数: ${opts.concurrency}`);
  log(`  模式: ${opts.dryRun ? '预览 (dry-run)' : '正式生成'}`);
  if (opts.pack) log(`  过滤: pack 包含 "${opts.pack}"`);
  log('');

  // 读取 prompts
  const data = JSON.parse(fs.readFileSync(PROMPTS_FILE, 'utf8'));
  let images = data.images;

  log(`总计: ${images.length} 张图片 (来自 ${data._meta.total_packs} 个 pack)`);

  // 按 pack 过滤
  if (opts.pack) {
    images = images.filter(img =>
      img.id.toLowerCase().includes(opts.pack.toLowerCase()) ||
      img.pack_topic.toLowerCase().includes(opts.pack.toLowerCase())
    );
    log(`过滤后: ${images.length} 张图片`);
  }

  // 统计已存在的
  let existCount = 0;
  for (const img of images) {
    const p = path.join(ROOT, img.output_dir, img.output_filename);
    if (fs.existsSync(p)) existCount++;
  }
  log(`已存在: ${existCount} 张 (将跳过)`);
  log(`待生成: ${images.length - existCount} 张`);
  log('');

  if (images.length - existCount === 0) {
    log('所有图片已生成，无需操作。');
    return;
  }

  // 开始生成
  const startTime = Date.now();
  const results = await runWithConcurrency(images, opts.concurrency, opts.dryRun);
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  // 汇总
  log('');
  log('========================================');
  log('  完成');
  log('========================================');
  log(`  耗时: ${elapsed}s`);
  log(`  成功: ${results.success}`);
  log(`  跳过: ${results.skipped}`);
  log(`  失败: ${results.failed}`);
  if (results.dryRun > 0) log(`  预览: ${results.dryRun}`);
  if (results.totalCost > 0) log(`  总费用: $${results.totalCost.toFixed(4)}`);
  log(`  日志: ${LOG_FILE}`);
}

main().catch(err => {
  log(`致命错误: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});
