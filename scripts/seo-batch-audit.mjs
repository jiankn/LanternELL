#!/usr/bin/env node
/**
 * LanternELL SEO 批量审计脚本
 * ---------------------------------------------------------
 * 调用 seo-audit 技能里的 Python 脚本（check-site / check-page / check-schema）
 * 对一组 URL 做"单页 lint 式"批量审计，输出：
 *   - reports/seo-batch/<timestamp>/site.json
 *   - reports/seo-batch/<timestamp>/pages/<slug>.json
 *   - reports/seo-batch/<timestamp>/SUMMARY.md
 *
 * 用法：
 *   node scripts/seo-batch-audit.mjs                                # 默认 preset = landings
 *   node scripts/seo-batch-audit.mjs --preset landings              # 核心 landing 页面（约 20 个）
 *   node scripts/seo-batch-audit.mjs --preset blogs                 # 博客抽样（最近 5 篇）
 *   node scripts/seo-batch-audit.mjs --preset site                  # 仅站点级（robots/sitemap/404）
 *   node scripts/seo-batch-audit.mjs --preset all                   # landings + blogs + site
 *   node scripts/seo-batch-audit.mjs --urls "/,/shop,/pricing"      # 指定 path 列表
 *   node scripts/seo-batch-audit.mjs --base https://lanternell.com  # 自定义域名
 *   node scripts/seo-batch-audit.mjs --delay 1000                   # 每次请求间隔（毫秒）
 *   node scripts/seo-batch-audit.mjs --skill-dir .windsurf/skills   # 技能目录（默认 auto）
 *   node scripts/seo-batch-audit.mjs --dry-run                      # 只打印计划，不实际请求
 *
 * 环境变量：
 *   AUDIT_BASE_URL    生产域名（默认 https://lanternell.com）
 *   PYTHON_BIN        Python 解释器路径（默认 python）
 *
 * 退出码：
 *   0  无 fail 项
 *   1  有 fail 项
 *   2  脚本本身错误
 */

import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PROJECT_ROOT = path.resolve(__dirname, '..')

// ── CLI 参数解析 ─────────────────────────────────────────
const args = new Map()
for (let i = 2; i < process.argv.length; i += 1) {
  const arg = process.argv[i]
  if (arg.startsWith('--')) {
    const key = arg.slice(2)
    const next = process.argv[i + 1]
    if (next && !next.startsWith('--')) {
      args.set(key, next)
      i += 1
    } else {
      args.set(key, 'true')
    }
  }
}

const BASE = normalizeOrigin(args.get('base') || process.env.AUDIT_BASE_URL || 'https://lanternell.com')
const PYTHON_BIN = process.env.PYTHON_BIN || 'python'
const DELAY_MS = parseInt(args.get('delay') || '500', 10)
const DRY_RUN = args.get('dry-run') === 'true'
const PRESET = args.get('preset') || (args.get('urls') ? null : 'landings')
const SKILL_DIR_OVERRIDE = args.get('skill-dir')

function normalizeOrigin(value) {
  return new URL(value).origin
}

// ── 定位 seo-audit 技能脚本 ─────────────────────────────
const SKILL_CANDIDATE_DIRS = [
  '.windsurf/skills',
  '.claude/skills',
  '.codex/skills',
  '.codebuddy/skills',
  '.continue/skills',
  '.gemini/skills',
  '.opencode/skills',
  '.qoder/skills',
  '.roo/skills',
  '.trae/skills',
  '.agent/skills',
  '.agents/skills',
]

function findSkillScriptsDir() {
  if (SKILL_DIR_OVERRIDE) {
    const abs = path.resolve(PROJECT_ROOT, SKILL_DIR_OVERRIDE, 'seo-audit/scripts')
    if (fs.existsSync(abs)) return abs
    throw new Error(`--skill-dir 指定路径不存在 seo-audit/scripts: ${abs}`)
  }
  for (const dir of SKILL_CANDIDATE_DIRS) {
    const abs = path.join(PROJECT_ROOT, dir, 'seo-audit', 'scripts')
    if (fs.existsSync(abs)) return abs
  }
  throw new Error('未找到 seo-audit 技能脚本目录。请确认已安装 seo-audit 技能（参考 README.md 安装指引）')
}

const SCRIPTS_DIR = findSkillScriptsDir()
const CHECK_SITE = path.join(SCRIPTS_DIR, 'check-site.py')
const CHECK_PAGE = path.join(SCRIPTS_DIR, 'check-page.py')
const CHECK_SCHEMA = path.join(SCRIPTS_DIR, 'check-schema.py')

// ── URL 预设清单 ──────────────────────────────────────────
// 与 app/sitemap.xml/route.ts 的 staticPages 保持一致（核心 landing）
const LANDING_PATHS = [
  '/',
  '/shop',
  '/free-samples',
  '/ell-worksheets',
  '/bilingual-classroom-labels',
  '/bilingual-flashcards',
  '/dual-language-classroom',
  '/english-spanish-printables',
  '/esl-activities-kindergarten',
  '/esl-reading-worksheets',
  '/esl-vocabulary-worksheets',
  '/esl-worksheets-beginners',
  '/esl-writing-worksheets',
  '/kindergarten-esl-worksheets',
  '/spanish-english-worksheets',
  '/spanish-flashcards',
  '/visual-supports-ell',
  '/newcomer-activities',
  '/vocabulary-worksheets',
  '/teaching-tips',
  '/pricing',
]

function getRecentBlogSlugs(n = 5) {
  const blogDir = path.join(PROJECT_ROOT, 'data', 'blog')
  if (!fs.existsSync(blogDir)) return []
  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.md'))
  // 简单按文件 mtime 排序，取最新 N 个
  const sorted = files
    .map((f) => ({ f, m: fs.statSync(path.join(blogDir, f)).mtimeMs }))
    .sort((a, b) => b.m - a.m)
    .slice(0, n)
  return sorted.map((x) => `/teaching-tips/${x.f.replace(/\.md$/, '')}`)
}

function resolvePaths() {
  if (args.get('urls')) {
    return args.get('urls').split(',').map((s) => s.trim()).filter(Boolean)
  }
  switch (PRESET) {
    case 'landings':
      return LANDING_PATHS
    case 'blogs':
      return getRecentBlogSlugs(5)
    case 'site':
      return [] // 只跑站点级
    case 'all':
      return [...LANDING_PATHS, ...getRecentBlogSlugs(5)]
    default:
      throw new Error(`未知 preset: ${PRESET}（支持 landings / blogs / site / all）`)
  }
}

// ── 关键词推断（从 slug） ─────────────────────────────────
// LanternELL 的 slug 本身就是关键词短语，直接 kebab→空格
const KEYWORD_OVERRIDE = {
  '/': 'bilingual ESL printables',
  '/shop': 'ESL printables shop',
  '/pricing': 'ESL printables pricing',
  '/free-samples': 'free ESL printables',
  '/teaching-tips': 'ESL teaching tips',
  '/ell-worksheets': 'ELL worksheets',
}

function inferKeyword(p) {
  if (KEYWORD_OVERRIDE[p]) return KEYWORD_OVERRIDE[p]
  // /teaching-tips/foo-bar → foo bar
  // /esl-activities-kindergarten → esl activities kindergarten
  const last = p.split('/').filter(Boolean).pop() || ''
  return last.replace(/-/g, ' ').trim() || ''
}

// ── 执行单个 Python 检查脚本 ──────────────────────────────
function runPython(scriptPath, scriptArgs) {
  const result = spawnSync(PYTHON_BIN, [scriptPath, ...scriptArgs], {
    encoding: 'utf-8',
    maxBuffer: 10 * 1024 * 1024,
  })
  if (result.error) {
    return { ok: false, json: null, stderr: String(result.error), exitCode: -1 }
  }
  let json = null
  try {
    json = JSON.parse(result.stdout)
  } catch (e) {
    return { ok: false, json: null, stderr: `JSON 解析失败：${e.message}\n--- stdout ---\n${result.stdout}\n--- stderr ---\n${result.stderr}`, exitCode: result.status }
  }
  return { ok: result.status === 0 || result.status === 1, json, stderr: result.stderr, exitCode: result.status }
}

// ── 状态统计 ────────────────────────────────────────────
function collectStatuses(obj, acc = { pass: 0, warn: 0, fail: 0, error: 0, items: [] }, prefix = '') {
  if (!obj || typeof obj !== 'object') return acc
  if (typeof obj.status === 'string') {
    const s = obj.status
    if (acc[s] !== undefined) acc[s] += 1
    acc.items.push({ field: prefix.replace(/^\./, ''), status: s, detail: obj.detail || '' })
  }
  for (const [k, v] of Object.entries(obj)) {
    if (k === 'status' || k === 'detail') continue
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      collectStatuses(v, acc, `${prefix}.${k}`)
    }
  }
  return acc
}

// ── 主流程 ──────────────────────────────────────────────
async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function main() {
  console.log(`\n🔦 LanternELL SEO 批量审计`)
  console.log(`   base       : ${BASE}`)
  console.log(`   preset     : ${PRESET || 'custom'}`)
  console.log(`   skill dir  : ${path.relative(PROJECT_ROOT, SCRIPTS_DIR)}`)
  console.log(`   python     : ${PYTHON_BIN}`)
  console.log(`   delay      : ${DELAY_MS}ms`)
  console.log(`   dry-run    : ${DRY_RUN}\n`)

  const paths = resolvePaths()
  if (PRESET !== 'site') {
    console.log(`📄 将审计 ${paths.length} 个页面：`)
    paths.forEach((p) => console.log(`   - ${BASE}${p}  [kw: ${inferKeyword(p)}]`))
  }
  console.log()

  if (DRY_RUN) {
    console.log('💨 dry-run 模式，到此结束。')
    return 0
  }

  const ts = new Date().toISOString().replace(/[:.]/g, '-').replace(/T/, '_').slice(0, 19)
  const outDir = path.join(PROJECT_ROOT, 'reports', 'seo-batch', ts)
  const pagesDir = path.join(outDir, 'pages')
  fs.mkdirSync(pagesDir, { recursive: true })

  // 1. 站点级检查
  console.log('🌐 1/3 站点级检查（robots.txt + sitemap.xml）...')
  const siteRes = runPython(CHECK_SITE, [BASE])
  if (!siteRes.json) {
    console.error(`   ❌ check-site.py 执行失败：${siteRes.stderr}`)
    return 2
  }
  fs.writeFileSync(path.join(outDir, 'site.json'), JSON.stringify(siteRes.json, null, 2))
  const siteAcc = collectStatuses(siteRes.json)
  console.log(`   pass=${siteAcc.pass} warn=${siteAcc.warn} fail=${siteAcc.fail} error=${siteAcc.error}`)

  // 2. 页面级检查
  const pageResults = []
  if (paths.length > 0) {
    console.log(`\n📑 2/3 页面级检查（${paths.length} 个页面）...`)
    for (let i = 0; i < paths.length; i += 1) {
      const p = paths[i]
      const url = `${BASE}${p}`
      const kw = inferKeyword(p)
      const slug = p === '/' ? 'home' : p.replace(/^\//, '').replace(/\//g, '_')
      process.stdout.write(`   [${i + 1}/${paths.length}] ${url} ... `)

      // check-page
      const pageRes = runPython(CHECK_PAGE, [url, '--keyword', kw])
      // check-schema
      const schemaRes = runPython(CHECK_SCHEMA, [url])

      const combined = {
        url,
        path: p,
        inferred_keyword: kw,
        page: pageRes.json,
        page_stderr: pageRes.stderr || null,
        schema: schemaRes.json,
        schema_stderr: schemaRes.stderr || null,
      }
      fs.writeFileSync(path.join(pagesDir, `${slug}.json`), JSON.stringify(combined, null, 2))

      const acc = { pass: 0, warn: 0, fail: 0, error: 0, items: [] }
      if (pageRes.json) collectStatuses(pageRes.json, acc, 'page')
      if (schemaRes.json) collectStatuses(schemaRes.json, acc, 'schema')

      pageResults.push({ path: p, url, keyword: kw, slug, ...acc })
      console.log(`pass=${acc.pass} warn=${acc.warn} fail=${acc.fail} error=${acc.error}`)

      if (i < paths.length - 1) await sleep(DELAY_MS)
    }
  }

  // 3. 汇总报告
  console.log('\n📊 3/3 生成汇总报告...')
  const summary = renderSummary({ ts, paths, siteRes: siteRes.json, siteAcc, pageResults })
  fs.writeFileSync(path.join(outDir, 'SUMMARY.md'), summary)

  const totalFail = siteAcc.fail + pageResults.reduce((s, r) => s + r.fail, 0)
  const totalWarn = siteAcc.warn + pageResults.reduce((s, r) => s + r.warn, 0)
  const totalPass = siteAcc.pass + pageResults.reduce((s, r) => s + r.pass, 0)

  console.log(`\n${totalFail === 0 ? '✅' : '❌'} 完成`)
  console.log(`   总计 pass=${totalPass}  warn=${totalWarn}  fail=${totalFail}`)
  console.log(`   报告 → ${path.relative(PROJECT_ROOT, outDir)}/`)
  console.log(`   汇总 → ${path.relative(PROJECT_ROOT, path.join(outDir, 'SUMMARY.md'))}\n`)

  return totalFail === 0 ? 0 : 1
}

function renderSummary({ ts, paths, siteRes, siteAcc, pageResults }) {
  const lines = []
  lines.push(`# LanternELL SEO 批量审计汇总`)
  lines.push('')
  lines.push(`- **时间：** ${ts}`)
  lines.push(`- **域名：** ${BASE}`)
  lines.push(`- **审计页面数：** ${paths.length}`)
  lines.push('')

  // 站点级
  lines.push(`## 站点级`)
  lines.push('')
  lines.push(`| 检查项 | 状态 | 说明 |`)
  lines.push(`|---|---|---|`)
  if (siteRes?.robots) lines.push(`| robots.txt | ${badge(siteRes.robots.status)} | ${escapeCell(siteRes.robots.detail)} |`)
  if (siteRes?.sitemap) lines.push(`| sitemap.xml | ${badge(siteRes.sitemap.status)} | ${escapeCell(siteRes.sitemap.detail)} |`)
  lines.push('')
  lines.push(`**站点级聚合：** pass=${siteAcc.pass} · warn=${siteAcc.warn} · fail=${siteAcc.fail} · error=${siteAcc.error}`)
  lines.push('')

  // 页面级
  if (pageResults.length > 0) {
    lines.push(`## 页面级聚合`)
    lines.push('')
    lines.push(`| 页面 | 关键词 | pass | warn | fail | error |`)
    lines.push(`|---|---|---|---|---|---|`)
    for (const r of pageResults) {
      lines.push(`| ${r.path} | ${r.keyword || '—'} | ${r.pass} | ${r.warn} | ${r.fail} | ${r.error} |`)
    }
    lines.push('')

    // Top 失败项
    const fails = []
    for (const r of pageResults) {
      for (const it of r.items) {
        if (it.status === 'fail' || it.status === 'error') {
          fails.push({ path: r.path, ...it })
        }
      }
    }
    if (fails.length > 0) {
      lines.push(`## ❌ 失败项（${fails.length}）`)
      lines.push('')
      lines.push(`| 页面 | 字段 | 状态 | 细节 |`)
      lines.push(`|---|---|---|---|`)
      for (const f of fails) {
        lines.push(`| ${f.path} | \`${f.field}\` | ${badge(f.status)} | ${escapeCell(f.detail)} |`)
      }
      lines.push('')
    }

    // Top 警告项（≤30 条）
    const warns = []
    for (const r of pageResults) {
      for (const it of r.items) {
        if (it.status === 'warn') warns.push({ path: r.path, ...it })
      }
    }
    if (warns.length > 0) {
      lines.push(`## ⚠️ 警告项（${warns.length}，显示前 30）`)
      lines.push('')
      lines.push(`| 页面 | 字段 | 细节 |`)
      lines.push(`|---|---|---|`)
      for (const w of warns.slice(0, 30)) {
        lines.push(`| ${w.path} | \`${w.field}\` | ${escapeCell(w.detail)} |`)
      }
      lines.push('')
    }
  }

  lines.push(`## 后续动作`)
  lines.push('')
  lines.push(`- 查看每个页面的详细 JSON：\`reports/seo-batch/${ts}/pages/<slug>.json\``)
  lines.push(`- 对单页做深度 LLM 审计：直接在 Cascade 中说 "审计这个页面：<url>"，技能会输出完整 HTML 报告`)
  lines.push(`- 全站爬虫（每月）：用 Screaming Frog / Sitebulb`)
  lines.push(`- 真实排名 / 索引：登录 Google Search Console`)
  lines.push('')

  return lines.join('\n')
}

function badge(s) {
  return ({ pass: '✅ pass', warn: '⚠️ warn', fail: '❌ fail', error: '🔥 error' })[s] || s
}

function escapeCell(v) {
  if (!v) return ''
  return String(v).replace(/\|/g, '\\|').replace(/\n/g, ' ').slice(0, 200)
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    console.error('\n💥 脚本异常：', err.message)
    console.error(err.stack)
    process.exit(2)
  })
