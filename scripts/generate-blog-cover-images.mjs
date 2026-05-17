import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const BLOG_DIR = path.join(process.cwd(), 'data', 'blog')
const OUT_DIR = path.join(process.cwd(), 'public', 'images', 'blog')

const palettes = {
  vocabulary: ['#4F46E5', '#818CF8', '#F97316', '#EEF2FF'],
  worksheet: ['#0891B2', '#67E8F9', '#F97316', '#ECFEFF'],
  reading: ['#7C3AED', '#C4B5FD', '#F59E0B', '#F5F3FF'],
  writing: ['#DB2777', '#F9A8D4', '#4F46E5', '#FDF2F8'],
  dual: ['#0F766E', '#5EEAD4', '#F97316', '#F0FDFA'],
  sentence: ['#4F46E5', '#A5B4FC', '#F97316', '#EEF2FF'],
  default: ['#4F46E5', '#93C5FD', '#F97316', '#EEF2FF'],
}

function frontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) return null
  const meta = {}
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    let value = line.slice(idx + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    meta[key] = value
  }
  return { block: match[1], body: match[2], meta }
}

function categoryFor(text) {
  const value = text.toLowerCase()
  if (value.includes('sentence frame')) return 'sentence'
  if (value.includes('vocabulary') || value.includes('flashcard')) return 'vocabulary'
  if (value.includes('worksheet') || value.includes('printable')) return 'worksheet'
  if (value.includes('reading')) return 'reading'
  if (value.includes('writing') || value.includes('prompt')) return 'writing'
  if (value.includes('dual language') || value.includes('bilingual') || value.includes('spanish')) return 'dual'
  return 'default'
}

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function wrapText(text, maxChars, maxLines) {
  const words = text.replace(/[—–]/g, '-').split(/\s+/)
  const lines = []
  let line = ''
  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (next.length > maxChars && line) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
    if (lines.length === maxLines) break
  }
  if (line && lines.length < maxLines) lines.push(line)
  if (lines.length === maxLines && words.join(' ').length > lines.join(' ').length) {
    lines[lines.length - 1] = `${lines[lines.length - 1].replace(/[.,:;!?-]+$/, '')}...`
  }
  return lines
}

function svgFor({ title, tags, category, index }) {
  const [primary, secondary, accent, bg] = palettes[category] || palettes.default
  const motif = category === 'vocabulary'
    ? ['word', 'palabra']
    : category === 'sentence'
      ? ['I think ___', 'because ___']
      : category === 'reading'
        ? ['read', 'leer']
        : category === 'writing'
          ? ['write', 'escribir']
          : category === 'dual'
            ? ['EN', 'ES']
            : ['ELL', 'K-8']
  const variant = index % 6
  const teacherX = variant % 2 === 0 ? 92 : 438
  const boardX = variant % 2 === 0 ? 176 : 56
  const boardWidth = variant % 2 === 0 ? 338 : 340
  const topic = escapeXml(motif[0])
  const topic2 = escapeXml(motif[1])

  const topicProps = {
    vocabulary: `
      <g transform="translate(452,104) rotate(-4)">
        <rect x="0" y="0" width="74" height="46" rx="8" fill="#FFFFFF" stroke="${primary}" stroke-width="3"/>
        <text x="37" y="30" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="900" fill="${primary}">${topic}</text>
      </g>
      <g transform="translate(478,154) rotate(5)">
        <rect x="0" y="0" width="82" height="46" rx="8" fill="#FFF7ED" stroke="${accent}" stroke-width="3"/>
        <text x="41" y="30" text-anchor="middle" font-family="Arial, sans-serif" font-size="15" font-weight="900" fill="${accent}">${topic2}</text>
      </g>`,
    sentence: `
      <g transform="translate(${boardX + 32},144)">
        <rect x="0" y="0" width="${boardWidth - 64}" height="32" rx="16" fill="#EEF2FF"/>
        <text x="16" y="22" font-family="Arial, sans-serif" font-size="16" font-weight="800" fill="${primary}">${topic}</text>
        <rect x="0" y="48" width="${boardWidth - 90}" height="28" rx="14" fill="#FFF7ED"/>
        <text x="16" y="68" font-family="Arial, sans-serif" font-size="15" font-weight="800" fill="${accent}">${topic2}</text>
      </g>`,
    reading: `
      <g transform="translate(426,122)">
        <path d="M0 22 C28 6 58 8 88 24 L88 92 C58 76 28 74 0 90 Z" fill="#FFFFFF" stroke="${primary}" stroke-width="3"/>
        <path d="M88 24 C116 8 146 6 174 22 L174 90 C146 74 116 76 88 92 Z" fill="#FEF3C7" stroke="${primary}" stroke-width="3"/>
        <line x1="88" y1="24" x2="88" y2="92" stroke="${primary}" stroke-width="3"/>
      </g>`,
    writing: `
      <g transform="translate(442,116) rotate(4)">
        <rect x="0" y="0" width="120" height="144" rx="12" fill="#FFFFFF" stroke="${primary}" stroke-width="3"/>
        <line x1="22" y1="38" x2="98" y2="38" stroke="${secondary}" stroke-width="8" stroke-linecap="round"/>
        <line x1="22" y1="70" x2="88" y2="70" stroke="${accent}" stroke-width="8" stroke-linecap="round"/>
        <line x1="22" y1="102" x2="100" y2="102" stroke="${secondary}" stroke-width="8" stroke-linecap="round" opacity="0.65"/>
      </g>`,
    dual: `
      <g transform="translate(454,116)">
        <rect x="0" y="0" width="116" height="78" rx="12" fill="#FFFFFF" stroke="${primary}" stroke-width="3"/>
        <text x="30" y="48" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="900" fill="${primary}">${topic}</text>
        <line x1="58" y1="16" x2="58" y2="62" stroke="${secondary}" stroke-width="3"/>
        <text x="86" y="48" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="900" fill="${accent}">${topic2}</text>
      </g>`,
    default: `
      <g transform="translate(448,118)">
        <circle cx="50" cy="50" r="48" fill="#FFFFFF" stroke="${primary}" stroke-width="3"/>
        <path d="M18 50 H82 M50 18 C36 34 36 66 50 82 M50 18 C64 34 64 66 50 82" fill="none" stroke="${secondary}" stroke-width="4"/>
        <circle cx="50" cy="50" r="12" fill="${accent}"/>
      </g>`,
  }
  const prop = topicProps[category] || topicProps.default

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640">
  <defs>
    <linearGradient id="wall" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#BFEFE6"/>
      <stop offset="1" stop-color="#FFF1D6"/>
    </linearGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="9" stdDeviation="9" flood-color="#64748B" flood-opacity="0.24"/>
    </filter>
  </defs>
  <rect width="640" height="640" fill="url(#wall)"/>
  <rect x="0" y="410" width="640" height="230" fill="#F3C98B"/>
  <path d="M0 410 H640 M0 465 H640 M0 520 H640 M52 410 L20 640 M156 410 L130 640 M260 410 L246 640 M370 410 L386 640 M486 410 L526 640 M590 410 L640 608" stroke="#D9A760" stroke-width="3" opacity="0.55"/>

  <g transform="translate(446,48)" opacity="0.95">
    <rect x="0" y="0" width="122" height="92" rx="10" fill="#DDF7FF" stroke="#FFFFFF" stroke-width="8"/>
    <path d="M6 78 C42 48 64 64 116 26" fill="none" stroke="#7DD3FC" stroke-width="7" opacity="0.75"/>
    <line x1="61" y1="4" x2="61" y2="88" stroke="#FFFFFF" stroke-width="6"/>
  </g>

  <g transform="translate(48,46)">
    <path d="M0 0 H228 L214 30 H12 Z" fill="${accent}" opacity="0.92"/>
    <text x="114" y="22" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="900" fill="#FFFFFF">WE LOVE LEARNING</text>
  </g>

  <g filter="url(#softShadow)">
    <rect x="${boardX}" y="92" width="${boardWidth}" height="216" rx="14" fill="#F8FEFF" stroke="#60A5FA" stroke-width="8"/>
    <rect x="${boardX + 18}" y="112" width="${boardWidth - 36}" height="28" rx="14" fill="${primary}" opacity="0.12"/>
    <line x1="${boardX + 36}" y1="206" x2="${boardX + boardWidth - 46}" y2="206" stroke="${primary}" stroke-width="7" stroke-linecap="round" opacity="0.24"/>
    <line x1="${boardX + 36}" y1="240" x2="${boardX + boardWidth - 94}" y2="240" stroke="${accent}" stroke-width="7" stroke-linecap="round" opacity="0.35"/>
    <rect x="${boardX + boardWidth - 94}" y="290" width="58" height="10" rx="5" fill="#2563EB" opacity="0.7"/>
  </g>
  ${prop}

  <g transform="translate(${teacherX},170)">
    <ellipse cx="44" cy="235" rx="55" ry="12" fill="#475569" opacity="0.18"/>
    <path d="M24 88 C18 130 18 168 10 232 H36 L46 142 L60 232 H86 C78 168 78 130 70 88 Z" fill="#475569"/>
    <path d="M20 86 C28 52 62 48 78 86 L70 150 H28 Z" fill="${variant % 3 === 0 ? '#10B981' : '#F59E0B'}"/>
    <path d="M26 102 H72" stroke="#FFFFFF" stroke-width="7" opacity="0.65"/>
    <circle cx="50" cy="34" r="28" fill="#9A5B3D"/>
    <path d="M20 30 C24 0 70 -4 82 28 C68 16 44 18 20 30 Z" fill="#1F2937"/>
    <circle cx="39" cy="38" r="3" fill="#111827"/>
    <circle cx="58" cy="38" r="3" fill="#111827"/>
    <path d="M40 52 C48 58 57 57 64 51" fill="none" stroke="#111827" stroke-width="3" stroke-linecap="round"/>
    <path d="M75 96 C104 112 124 132 138 152" fill="none" stroke="#9A5B3D" stroke-width="12" stroke-linecap="round"/>
    <path d="M20 96 C-2 122 -12 150 -14 178" fill="none" stroke="#9A5B3D" stroke-width="12" stroke-linecap="round"/>
    <circle cx="140" cy="154" r="7" fill="#9A5B3D"/>
  </g>

  <g transform="translate(172,394)">
    <rect x="0" y="46" width="148" height="58" rx="12" fill="#8B5E34"/>
    <rect x="10" y="22" width="128" height="44" rx="10" fill="#D9A760"/>
    <rect x="32" y="32" width="72" height="12" rx="6" fill="#FFFFFF" opacity="0.7"/>
    <line x1="22" y1="104" x2="8" y2="164" stroke="#8B5E34" stroke-width="10" stroke-linecap="round"/>
    <line x1="124" y1="104" x2="144" y2="164" stroke="#8B5E34" stroke-width="10" stroke-linecap="round"/>
  </g>
  <g transform="translate(354,380)">
    <rect x="0" y="46" width="166" height="62" rx="12" fill="#8B5E34"/>
    <rect x="14" y="20" width="138" height="48" rx="10" fill="#D9A760"/>
    <rect x="38" y="32" width="76" height="12" rx="6" fill="#FFFFFF" opacity="0.72"/>
    <circle cx="128" cy="38" r="9" fill="${accent}"/>
    <line x1="24" y1="108" x2="8" y2="172" stroke="#8B5E34" stroke-width="10" stroke-linecap="round"/>
    <line x1="140" y1="108" x2="160" y2="172" stroke="#8B5E34" stroke-width="10" stroke-linecap="round"/>
  </g>

  <g transform="translate(186,288)">
    <path d="M48 76 C26 82 20 112 24 148 H82 C88 110 78 82 58 76 Z" fill="#F472B6"/>
    <circle cx="52" cy="42" r="24" fill="#7C3F2D"/>
    <path d="M30 40 C34 16 66 14 78 38 C62 28 46 30 30 40 Z" fill="#111827"/>
    <path d="M64 82 C72 58 82 44 92 28" fill="none" stroke="#7C3F2D" stroke-width="10" stroke-linecap="round"/>
    <circle cx="94" cy="26" r="6" fill="#7C3F2D"/>
  </g>
  <g transform="translate(294,262)">
    <path d="M38 90 C16 98 12 126 18 164 H78 C84 126 76 98 56 90 Z" fill="#22C55E"/>
    <circle cx="48" cy="52" r="24" fill="#D08B5B"/>
    <path d="M28 52 C30 24 72 22 78 54 C62 40 44 42 28 52 Z" fill="#5B3926"/>
    <path d="M30 92 C12 68 0 48 -12 22" fill="none" stroke="#D08B5B" stroke-width="10" stroke-linecap="round"/>
    <circle cx="-14" cy="20" r="6" fill="#D08B5B"/>
  </g>
  <g transform="translate(428,266)">
    <path d="M32 94 C10 102 10 132 18 168 H82 C88 132 78 102 56 94 Z" fill="#38BDF8"/>
    <circle cx="48" cy="56" r="24" fill="#F0B27A"/>
    <path d="M24 54 C28 26 74 24 82 54 C60 46 44 42 24 54 Z" fill="#92400E"/>
    <path d="M60 96 C74 66 88 42 104 20" fill="none" stroke="#F0B27A" stroke-width="10" stroke-linecap="round"/>
    <circle cx="106" cy="18" r="6" fill="#F0B27A"/>
  </g>
  <g transform="translate(516,284)">
    <path d="M26 84 C6 92 4 124 12 158 H74 C82 124 72 92 54 84 Z" fill="#F97316"/>
    <circle cx="44" cy="48" r="24" fill="#6B3F2A"/>
    <path d="M20 48 C20 22 68 20 76 50 C56 36 40 38 20 48 Z" fill="#111827"/>
    <path d="M28 88 C10 68 0 44 -8 20" fill="none" stroke="#6B3F2A" stroke-width="10" stroke-linecap="round"/>
    <circle cx="-10" cy="18" r="6" fill="#6B3F2A"/>
  </g>

  <g transform="translate(66,484)">
    <rect x="0" y="48" width="114" height="64" rx="16" fill="#38BDF8"/>
    <rect x="12" y="0" width="92" height="78" rx="18" fill="#FFFFFF" stroke="${primary}" stroke-width="5"/>
    <circle cx="58" cy="38" r="20" fill="${secondary}" opacity="0.7"/>
    <rect x="28" y="60" width="58" height="9" rx="5" fill="${accent}" opacity="0.8"/>
  </g>
  <g transform="translate(64,148)">
    <rect x="0" y="0" width="54" height="84" rx="8" fill="#FFFFFF" stroke="#34D399" stroke-width="4"/>
    <text x="27" y="34" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="900" fill="#059669">ABC</text>
    <text x="27" y="62" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="900" fill="#F97316">123</text>
  </g>
</svg>`
}

function parseTags(raw) {
  if (!raw) return []
  try {
    const value = JSON.parse(raw)
    return Array.isArray(value) ? value.map(String) : []
  } catch {
    return raw.split(',').map((x) => x.trim()).filter(Boolean)
  }
}

fs.mkdirSync(OUT_DIR, { recursive: true })

const files = fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith('.md')).sort()
const created = []

for (const [index, file] of files.entries()) {
  const filePath = path.join(BLOG_DIR, file)
  const raw = fs.readFileSync(filePath, 'utf8')
  const parsed = frontmatter(raw)
  const slug = file.replace(/\.md$/, '')
  const generatedUrl = `/images/blog/cover-${slug}.png`
  if (!parsed || (parsed.meta.coverImageUrl && parsed.meta.coverImageUrl !== generatedUrl)) continue

  const title = parsed.meta.title || slug
  const tags = parseTags(parsed.meta.tags)
  const category = categoryFor(`${title} ${tags.join(' ')}`)
  const outName = `cover-${slug}.png`
  const outUrl = `/images/blog/${outName}`
  const outPath = path.join(OUT_DIR, outName)

  await sharp(Buffer.from(svgFor({ title, tags, category, index })))
    .png({ compressionLevel: 9, palette: true })
    .toFile(outPath)

  const blockWithoutCover = parsed.block
    .split(/\r?\n/)
    .filter((line) => !/^coverImageUrl:\s*/.test(line))
    .join('\n')
  const nextBlock = blockWithoutCover.includes('seoDescription:')
    ? blockWithoutCover.replace(/^(seoDescription:.*)$/m, `$1\ncoverImageUrl: "${outUrl}"`)
    : `${blockWithoutCover}\ncoverImageUrl: "${outUrl}"`
  if (parsed.meta.coverImageUrl !== outUrl || parsed.block !== nextBlock) {
    fs.writeFileSync(filePath, `---\n${nextBlock}\n---\n${parsed.body}`, 'utf8')
  }
  created.push(outUrl)
}

console.log(`Created ${created.length} blog cover image(s).`)
for (const item of created) console.log(item)
