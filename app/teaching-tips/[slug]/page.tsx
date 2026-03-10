import { notFound } from 'next/navigation'
import Link from 'next/link'
import { query, queryOne } from '@/lib/db'
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/footer'
import { Calendar, ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

// ISR: 静态生成，每 3600 秒（1小时）重新验证
export const revalidate = 3600

interface BlogPost {
  id: string; slug: string; title: string; excerpt: string | null
  content_md: string; cover_image_url: string | null; author: string
  tags: string | null; seo_title: string | null; seo_description: string | null
  published_at: string
}

// Build 时预渲染所有已发布文章为静态 HTML
export async function generateStaticParams() {
  try {
    const posts = await query<{ slug: string }>(
      "SELECT slug FROM blog_posts WHERE status = 'published'"
    )
    return posts.map((post) => ({ slug: post.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await queryOne<BlogPost>('SELECT title, excerpt, seo_title, seo_description FROM blog_posts WHERE slug = ? AND status = ?', [slug, 'published'])
  if (!post) return { title: 'Post Not Found' }
  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt || '',
    alternates: { canonical: `/teaching-tips/${slug}` },
    openGraph: {
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt || '',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://lanternell.com'}/teaching-tips/${slug}`,
      images: post.cover_image_url
        ? [
            {
              url: post.cover_image_url,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : [],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await queryOne<BlogPost>(
    'SELECT * FROM blog_posts WHERE slug = ? AND status = ?', [slug, 'published']
  )
  if (!post) notFound()

  const tags: string[] = post.tags ? JSON.parse(post.tags) : []

  // Simple markdown-to-HTML: headings, bold, italic, links, paragraphs
  const html = post.content_md
    .replace(/^### (.+)$/gm, '<h3 class="font-heading text-xl font-semibold text-text-primary mt-8 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="font-heading text-2xl font-bold text-text-primary mt-10 mb-4">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="font-heading text-3xl font-bold text-text-primary mt-10 mb-4">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary underline hover:text-primary/80">$1</a>')
    .replace(/^(?!<h[1-3]|<ul|<ol|<li|<blockquote|<pre|<div)(.+)$/gm, '<p class="text-text-primary leading-relaxed mb-4">$1</p>')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    author: { '@type': 'Person', name: post.author },
    datePublished: post.published_at,
    description: post.excerpt || '',
    publisher: { '@type': 'Organization', name: 'LanternELL' },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://lanternell.com'}/teaching-tips/${slug}`,
    },
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar links={[{ href: '/shop', label: 'Shop' }, { href: '/teaching-tips', label: 'Teaching Tips', active: true }, { href: '/login', label: 'Sign In' }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-text-muted mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/teaching-tips" className="hover:text-primary transition-colors">Teaching Tips</Link>
            <span aria-hidden="true">/</span>
            <span className="text-text-primary font-medium line-clamp-1">{post.title}</span>
          </nav>

          {post.cover_image_url && (
            <img src={post.cover_image_url} alt={`${post.title} - Cover image`} className="w-full h-64 object-cover rounded-2xl mb-8" />
          )}

          <h1 className="font-heading text-4xl font-bold text-text-primary mb-4">{post.title}</h1>

          <div className="flex items-center gap-4 text-sm text-text-muted mb-8">
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(post.published_at).toLocaleDateString()}</span>
            <span>by {post.author}</span>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {tags.map(t => <span key={t} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary">{t}</span>)}
            </div>
          )}

          <div className="prose-lanternell" dangerouslySetInnerHTML={{ __html: html }} />

          {/* Related Resources — internal links to cluster pages */}
          <div className="mt-12 pt-8 border-t border-text-primary/10">
            <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">Related ELL Resources</h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/ell-worksheets" className="text-sm text-primary hover:underline">ELL Worksheets</Link>
              <span className="text-text-muted">·</span>
              <Link href="/bilingual-classroom-labels" className="text-sm text-primary hover:underline">Bilingual Classroom Labels</Link>
              <span className="text-text-muted">·</span>
              <Link href="/english-spanish-printables" className="text-sm text-primary hover:underline">English-Spanish Printables</Link>
              <span className="text-text-muted">·</span>
              <Link href="/visual-supports-ell" className="text-sm text-primary hover:underline">Visual Supports</Link>
              <span className="text-text-muted">·</span>
              <Link href="/newcomer-activities" className="text-sm text-primary hover:underline">Newcomer Activities</Link>
              <span className="text-text-muted">·</span>
              <Link href="/esl-worksheets-beginners" className="text-sm text-primary hover:underline">ESL for Beginners</Link>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  )
}
