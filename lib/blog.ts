import fs from 'fs'
import path from 'path'

const BLOG_DIR = path.join(process.cwd(), 'data', 'blog')

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  author: string
  tags: string[]
  seoTitle: string
  seoDescription: string
  publishedAt: string
  content: string          // raw markdown body
  coverImageUrl?: string
}

/**
 * 解析 YAML frontmatter（简易版，无需 gray-matter 依赖）
 */
function parseFrontmatter(raw: string): { meta: Record<string, string>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) return { meta: {}, content: raw }

  const meta: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    let val = line.slice(idx + 1).trim()
    // Strip surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    meta[key] = val
  }
  return { meta, content: match[2] }
}

function parseTags(raw?: string): string[] {
  if (!raw) return []
  // Handle JSON array format: ["tag1", "tag2"]
  try { return JSON.parse(raw) } catch { /* ignore */ }
  return raw.split(',').map(t => t.trim()).filter(Boolean)
}

function toPost(slug: string, meta: Record<string, string>, content: string): BlogPost {
  return {
    slug,
    title: meta.title || slug,
    excerpt: meta.excerpt || '',
    author: meta.author || 'LanternELL Team',
    tags: parseTags(meta.tags),
    seoTitle: meta.seoTitle || meta.title || slug,
    seoDescription: meta.seoDescription || meta.excerpt || '',
    publishedAt: meta.publishedAt || new Date().toISOString().split('T')[0],
    coverImageUrl: meta.coverImageUrl || undefined,
    content,
  }
}

/**
 * 获取所有已发布文章，按发布日期降序
 */
export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return []

  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'))
  const posts: BlogPost[] = []

  for (const file of files) {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8')
    const { meta, content } = parseFrontmatter(raw)
    const slug = file.replace(/\.md$/, '')
    posts.push(toPost(slug, meta, content))
  }

  return posts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

/**
 * 根据 slug 获取单篇文章
 */
export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { meta, content } = parseFrontmatter(raw)
  return toPost(slug, meta, content)
}

/**
 * Markdown → HTML（简易转换器，与原有逻辑一致）
 */
export function markdownToHtml(md: string): string {
  return md
    // Headings
    .replace(/^### (.+)$/gm, '<h3 class="font-heading text-xl font-semibold text-text-primary mt-8 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="font-heading text-2xl font-bold text-text-primary mt-10 mb-4">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="font-heading text-3xl font-bold text-text-primary mt-10 mb-4">$1</h1>')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li class="text-text-primary leading-relaxed ml-6 list-disc mb-1">$1</li>')
    // Bold & italic
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary underline hover:text-primary/80">$1</a>')
    // Paragraphs (lines not starting with HTML tags)
    .replace(/^(?!<h[1-3]|<ul|<ol|<li|<blockquote|<pre|<div)(.+)$/gm, '<p class="text-text-primary leading-relaxed mb-4">$1</p>')
}
