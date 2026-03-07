import { notFound } from 'next/navigation'
import Link from 'next/link'
import { query, queryOne } from '@/lib/db'
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/footer'
import { Calendar, ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface BlogPost {
  id: string; slug: string; title: string; excerpt: string | null
  content_md: string; cover_image_url: string | null; author: string
  tags: string | null; seo_title: string | null; seo_description: string | null
  published_at: string
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await queryOne<BlogPost>('SELECT title, excerpt, seo_title, seo_description FROM blog_posts WHERE slug = ? AND status = ?', [slug, 'published'])
  if (!post) return { title: 'Post Not Found' }
  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt || '',
    alternates: { canonical: `/teaching-tips/${slug}` },
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
          <Link href="/teaching-tips" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors mb-8 cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> Back to Teaching Tips
          </Link>

          {post.cover_image_url && (
            <img src={post.cover_image_url} alt="" className="w-full h-64 object-cover rounded-2xl mb-8" />
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
        </div>
      </article>

      <Footer />
    </main>
  )
}
