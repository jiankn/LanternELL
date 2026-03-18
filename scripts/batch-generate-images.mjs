/**
 * Evolink Z-Image Turbo 批量生图脚本
 * 
 * 读取 data/batch-prompts.json，调用 Evolink 异步 API 生成图片，
 * 下载到 data/images/{pack-slug}/ 目录。
 * 
 * API 流程（异步）：
 *   1. POST /v1/images/generations → 拿到 task ID
 *   2. GET /v1/tasks/{task_id} → 轮询直到 completed
 *   3. 从 results[0] 拿到图片 URL → 下载保存
 * 
 * 用法:
 *   node scripts/batch-generate-images.mjs                    # 全量生成
 *   node scripts/batch-generate-images.mjs --pack "colors"    # 按 pack 过滤
 *   node scripts/batch-generate-images.mjs --dry-run          # 预览不调用
 *   node scripts/batch-generate-images.mjs --concurrency 5    # 5 并发
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PROMPTS_FILE = path.join(ROOT, 'data', 'batch-prompts.json');
const LOG_FILE = path.join(ROOT, 'data', 'evolink-batch-log.txt');

// ============================================================
// Evolink API 配置
// ============================================================
const API_BASE = 'https://api.evolink.ai/v1';
const API_KEY = process.env.EVOLINK_API_KEY || '';
const MODEL = 'z-image-turbo';
const IMAGE_SIZE = '512x512';

const DEFAULT_CONCURRENCY = 3;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;
const POLL_INTERVAL_MS = 2000;  // 轮询间隔
const POLL_TIMEOUT_MS = 120000; // 单张图最长等待 2 分钟

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
// Evolink API：提交生图任务
// ============================================================
async function submitTask(prompt) {
  const res = await fetch(`${API_BASE}/images/generations`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      prompt: prompt,
      size: IMAGE_SIZE,
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (res.status === 429) {
    return { retry: true, msg: '429 rate limited' };
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`提交失败 ${res.status}: ${text.substring(0, 300)}`);
  }

  const data = await res.json();
  if (!data.id) {
    throw new Error('无 task ID: ' + JSON.stringify(data).substring(0, 300));
  }

  return { retry: false, taskId: data.id, cost: data.usage?.credits_reserved || 0 };
}

// ============================================================
// Evolink API：轮询任务状态
// ============================================================
async function pollTask(taskId) {
  const startTime = Date.now();

  while (Date.now() - startTime < POLL_TIMEOUT_MS) {
    const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` },
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      throw new Error(`轮询失败 ${res.status}`);
    }

    const data = await res.json();

    if (data.status === 'completed') {
      if (data.results && data.results.length > 0) {
        return { url: data.results[0] };
      }
      throw new Error('任务完成但无结果 URL');
    }

    if (data.status === 'failed') {
      const errMsg = data.error?.message || '未知错误';
      throw new Error(`任务失败: ${errMsg}`);
    }

    // pending / processing → 继续等
    await sleep(POLL_INTERVAL_MS);
  }

  throw new Error(`轮询超时 (${POLL_TIMEOUT_MS / 1000}s)`);
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
// 单张图片生成（提交 + 轮询 + 下载，含重试）
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

  fs.mkdirSync(outputDir, { recursive: true });

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // 1. 提交任务
      const task = await submitTask(image.full_prompt);

      if (task.retry) {
        log(`  ⏳ ${image.id} - 429 限流，等 ${RETRY_DELAY_MS * attempt}ms (${attempt}/${MAX_RETRIES})`);
        await sleep(RETRY_DELAY_MS * attempt);
        continue;
      }

      // 2. 轮询结果
      const result = await pollTask(task.taskId);

      // 3. 下载图片
      const bytes = await downloadImage(result.url, outputPath);
      const sizeKB = Math.round(bytes / 1024);
      return { status: 'success', id: image.id, sizeKB, cost: task.cost };
    } catch (err) {
      if (attempt < MAX_RETRIES) {
        log(`  ⚠️ ${image.id} - ${err.message}，重试 (${attempt}/${MAX_RETRIES})`);
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
          log(`  ✅ [${completed}/${total}] ${result.id} (${result.sizeKB}KB)`);
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

  if (!API_KEY) {
    console.error('错误: 请设置环境变量 EVOLINK_API_KEY');
    console.error('  Windows: set EVOLINK_API_KEY=your_key');
    console.error('  Linux/Mac: export EVOLINK_API_KEY=your_key');
    process.exit(1);
  }

  log('========================================');
  log('  Evolink Z-Image Turbo 批量生图');
  log('========================================');
  log(`  模型: ${MODEL}`);
  log(`  尺寸: ${IMAGE_SIZE}`);
  log(`  并发: ${opts.concurrency}`);
  log(`  模式: ${opts.dryRun ? '预览 (dry-run)' : '正式生成'}`);
  if (opts.pack) log(`  过滤: pack 包含 "${opts.pack}"`);
  log('');

  const data = JSON.parse(fs.readFileSync(PROMPTS_FILE, 'utf8'));
  let images = data.images;

  log(`总计: ${images.length} 张图片 (来自 ${data._meta.total_packs} 个 pack)`);

  if (opts.pack) {
    images = images.filter(img =>
      img.id.toLowerCase().includes(opts.pack.toLowerCase()) ||
      img.pack_topic.toLowerCase().includes(opts.pack.toLowerCase())
    );
    log(`过滤后: ${images.length} 张图片`);
  }

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

  const startTime = Date.now();
  const results = await runWithConcurrency(images, opts.concurrency, opts.dryRun);
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  log('');
  log('========================================');
  log('  完成');
  log('========================================');
  log(`  耗时: ${elapsed}s`);
  log(`  成功: ${results.success}`);
  log(`  跳过: ${results.skipped}`);
  log(`  失败: ${results.failed}`);
  if (results.dryRun > 0) log(`  预览: ${results.dryRun}`);
  if (results.totalCost > 0) log(`  预估费用: ${results.totalCost.toFixed(4)} credits`);
  log(`  日志: ${LOG_FILE}`);
}

main().catch(err => {
  log(`致命错误: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});
