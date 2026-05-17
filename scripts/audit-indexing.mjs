#!/usr/bin/env node

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

const targetBase = normalizeOrigin(args.get('base') || process.env.AUDIT_BASE_URL || 'https://lanternell.com')
const canonicalBase = normalizeOrigin(args.get('canonical') || process.env.AUDIT_CANONICAL_URL || 'https://lanternell.com')
const sitemapUrl = `${targetBase}/sitemap.xml`
const robotsUrl = `${targetBase}/robots.txt`

const errors = []
const warnings = []

function normalizeOrigin(value) {
  return new URL(value).origin
}

function normalizeUrl(value) {
  const url = new URL(value)
  url.hash = ''
  if (url.pathname !== '/' && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.slice(0, -1)
  }
  return url.toString()
}

function targetUrlFor(canonicalUrl) {
  const url = new URL(canonicalUrl)
  const target = new URL(`${url.pathname}${url.search}`, targetBase)
  return target.toString()
}

function decodeXml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
}

function parseSitemap(xml) {
  return Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g)).map((match) => decodeXml(match[1].trim()))
}

function parseDisallows(robotsText) {
  const disallows = []
  let appliesToAll = false

  for (const rawLine of robotsText.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*/, '').trim()
    if (!line) continue

    const [rawKey, ...rest] = line.split(':')
    const key = rawKey.trim().toLowerCase()
    const value = rest.join(':').trim()

    if (key === 'user-agent') {
      appliesToAll = value === '*'
      continue
    }

    if (appliesToAll && key === 'disallow' && value) {
      disallows.push(value)
    }
  }

  return disallows
}

function isDisallowed(pathname, disallows) {
  return disallows.some((rule) => {
    const normalized = rule.endsWith('*') ? rule.slice(0, -1) : rule
    return pathname.startsWith(normalized)
  })
}

function getAttr(html, regex) {
  const match = html.match(regex)
  return match ? match[1].trim() : ''
}

function getCanonical(html) {
  return getAttr(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i)
    || getAttr(html, /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["'][^>]*>/i)
}

function getTitle(html) {
  return getAttr(html, /<title[^>]*>([\s\S]*?)<\/title>/i).replace(/\s+/g, ' ')
}

function getDescription(html) {
  return getAttr(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i)
    || getAttr(html, /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["'][^>]*>/i)
}

function hasNoindex(html, headers) {
  const robotsMeta = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["'][^>]*>/i)?.[1] || ''
  const xRobots = headers.get('x-robots-tag') || ''
  return `${robotsMeta},${xRobots}`.toLowerCase().includes('noindex')
}

function getInternalLinks(html) {
  const links = []
  for (const match of html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi)) {
    const href = match[1]
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) continue
    try {
      const url = new URL(href, canonicalBase)
      if (url.origin === canonicalBase) {
        links.push(normalizeUrl(url.toString()))
      }
    } catch {
      // Ignore malformed links; the browser will not use them for discovery.
    }
  }
  return links
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'LanternELLIndexingAudit/1.0',
    },
    redirect: 'manual',
  })
  const text = await response.text().catch(() => '')
  return { response, text }
}

console.log(`Indexing audit target: ${targetBase}`)
console.log(`Canonical base: ${canonicalBase}`)

const { response: sitemapResponse, text: sitemapText } = await fetchText(sitemapUrl)
if (sitemapResponse.status !== 200) {
  errors.push(`sitemap.xml returned ${sitemapResponse.status}`)
}

const sitemapLocs = parseSitemap(sitemapText)
const normalizedLocs = sitemapLocs.map(normalizeUrl)
const sitemapSet = new Set(normalizedLocs)

if (sitemapLocs.length === 0) {
  errors.push('sitemap.xml has no <loc> entries')
}

if (sitemapSet.size !== sitemapLocs.length) {
  errors.push(`sitemap.xml has duplicate URLs: ${sitemapLocs.length - sitemapSet.size}`)
}

for (const loc of sitemapLocs) {
  if (!loc.startsWith(`${canonicalBase}/`) && loc !== canonicalBase) {
    errors.push(`sitemap URL is outside canonical host: ${loc}`)
  }
}

const { response: robotsResponse, text: robotsText } = await fetchText(robotsUrl)
if (robotsResponse.status !== 200) {
  errors.push(`robots.txt returned ${robotsResponse.status}`)
}
const disallows = parseDisallows(robotsText)

for (const loc of sitemapLocs) {
  const pathname = new URL(loc).pathname
  if (isDisallowed(pathname, disallows)) {
    errors.push(`sitemap includes robots-disallowed URL: ${loc}`)
  }
}

const pages = []
for (const loc of sitemapLocs) {
  const target = targetUrlFor(loc)
  const { response, text } = await fetchText(target)

  if (response.status !== 200) {
    errors.push(`${loc} returned ${response.status}`)
    continue
  }

  if (hasNoindex(text, response.headers)) {
    errors.push(`${loc} is noindex but appears in sitemap`)
  }

  const canonical = getCanonical(text)
  const expected = normalizeUrl(loc)
  if (!canonical) {
    errors.push(`${loc} is missing canonical tag`)
  } else {
    const resolvedCanonical = normalizeUrl(new URL(canonical, canonicalBase).toString())
    if (resolvedCanonical !== expected) {
      errors.push(`${loc} canonical mismatch: ${resolvedCanonical}`)
    }
  }

  const h1Count = (text.match(/<h1\b/gi) || []).length
  if (h1Count !== 1) {
    warnings.push(`${loc} has ${h1Count} H1 tags`)
  }

  const title = getTitle(text)
  if (!title || title.length < 20) {
    warnings.push(`${loc} has a weak or missing title`)
  }

  const description = getDescription(text)
  if (!description || description.length < 60) {
    warnings.push(`${loc} has a weak or missing meta description`)
  }

  pages.push({
    loc: expected,
    links: getInternalLinks(text),
  })
}

const incoming = new Map(normalizedLocs.map((loc) => [loc, 0]))
for (const page of pages) {
  for (const link of page.links) {
    if (link !== page.loc && incoming.has(link)) {
      incoming.set(link, incoming.get(link) + 1)
    }
  }
}

for (const [loc, count] of incoming) {
  if (loc !== normalizeUrl(canonicalBase) && count === 0) {
    warnings.push(`${loc} has no incoming links from other sitemap pages`)
  }
}

console.log(`Sitemap URLs: ${sitemapLocs.length}`)
console.log(`Errors: ${errors.length}`)
console.log(`Warnings: ${warnings.length}`)

if (errors.length > 0) {
  console.error('\nErrors')
  for (const error of errors) console.error(`- ${error}`)
}

if (warnings.length > 0) {
  console.warn('\nWarnings')
  for (const warning of warnings.slice(0, 80)) console.warn(`- ${warning}`)
  if (warnings.length > 80) console.warn(`- ... ${warnings.length - 80} more warnings`)
}

if (errors.length > 0) {
  process.exit(1)
}
