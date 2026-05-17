import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/footer'
import { Calendar, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Teaching Tips — ELL Strategies & Resources',
  description: 'Practical ELL teaching tips: WIDA-aligned strategies, classroom routines, scaffolding ideas & free printable resources for K-8 teachers.',
  alternates: { canonical: '/teaching-tips' },
  openGraph: {
    title: 'Teaching Tips - ELL Strategies & Classroom Resources',
    description: 'Practical teaching tips, strategies, and resources for ELL, bilingual, and SPED educators.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://lanternell.com'}/teaching-tips`,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://lanternell.com'}/images/og-teaching-tips.png`,
        width: 1200,
        height: 630,
        alt: 'LanternELL Teaching Tips for ELL Educators',
      },
    ],
  },
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <main className="min-h-screen bg-background">
      <Navbar links={[{ href: '/shop', label: 'Shop' }, { href: '/teaching-tips', label: 'Teaching Tips', active: true }, { href: '/login', label: 'Sign In' }]} />

      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-text-muted mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <span className="text-text-primary font-medium">Teaching Tips</span>
          </nav>
          <h1 className="font-heading text-4xl font-bold text-text-primary mb-4">Teaching Tips</h1>
          <p className="text-text-muted mb-12">Practical strategies and resources for ELL educators.</p>

          {posts.length === 0 ? (
            <div className="clay-card p-12 text-center">
              <p className="text-text-muted text-lg">No posts yet. Check back soon.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map(post => (
                <Link key={post.slug} href={`/teaching-tips/${post.slug}`}
                  className="clay-card p-6 flex flex-col sm:flex-row gap-6 group cursor-pointer hover:-translate-y-0.5 transition-all duration-200">
                  {post.coverImageUrl && (
                    <img src={post.coverImageUrl} alt={`${post.title} - ELL teaching tips and strategies`} className="w-full sm:w-48 h-32 object-cover rounded-xl shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h2 className="font-heading text-xl font-semibold text-text-primary group-hover:text-primary transition-colors mb-2">{post.title}</h2>
                    {post.excerpt && <p className="text-text-muted text-sm mb-3 line-clamp-2">{post.excerpt}</p>}
                    <div className="flex items-center gap-4 text-xs text-text-muted">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(post.publishedAt).toLocaleDateString()}</span>
                      {post.tags.slice(0, 3).map(t => <span key={t} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">{t}</span>)}
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors shrink-0 self-center hidden sm:block" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
