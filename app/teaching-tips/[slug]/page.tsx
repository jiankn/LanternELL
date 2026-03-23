import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllPosts, getPostBySlug, markdownToHtml } from '@/lib/blog'
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/footer'
import { Calendar } from 'lucide-react'
import type { Metadata } from 'next'

export function generateStaticParams() {
  return getAllPosts().map(post => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: 'Post Not Found' }
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || '',
    alternates: { canonical: `/teaching-tips/${slug}` },
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt || '',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://lanternell.com'}/teaching-tips/${slug}`,
      images: post.coverImageUrl
        ? [{ url: post.coverImageUrl, width: 1200, height: 630, alt: post.title }]
        : [],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const html = markdownToHtml(post.content)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    author: { '@type': 'Person', name: post.author },
    datePublished: post.publishedAt,
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

          {post.coverImageUrl && (
            <img src={post.coverImageUrl} alt={`${post.title} - Cover image`} className="w-full h-64 object-cover rounded-2xl mb-8" />
          )}

          <h1 className="font-heading text-4xl font-bold text-text-primary mb-4">{post.title}</h1>

          <div className="flex items-center gap-4 text-sm text-text-muted mb-8">
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(post.publishedAt).toLocaleDateString()}</span>
            <span>by {post.author}</span>
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map(t => <span key={t} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary">{t}</span>)}
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
