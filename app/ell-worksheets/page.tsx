import Link from 'next/link'
import { query } from '@/lib/db'
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/footer'
import { ArrowRight, Download, BookOpen, Globe, Sparkles, Heart, Eye, ClipboardCheck } from 'lucide-react'
import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lanternell.com'

export const metadata: Metadata = {
  title: 'ELL Worksheets — Free & Printable ESL Resources for K-5 Classrooms',
  description:
    'Browse printable ELL worksheets for newcomer and bilingual students in K-5 classrooms. Vocabulary packs, visual supports, sentence frames, and classroom labels in 6 languages. Pre-K and middle school resources also available.',
  alternates: { canonical: '/ell-worksheets' },
  openGraph: {
    title: 'ELL Worksheets — Free & Printable ESL Resources',
    description: 'Printable ELL worksheets for K-5 newcomer and bilingual classrooms in 6 languages.',
    url: `${BASE_URL}/ell-worksheets`,
  },
}

export const dynamic = 'force-dynamic'

interface Product {
  id: string; slug: string; name: string; description: string
  type: string; price_cents: number
}

const categories = [
  { key: 'vocabulary_pack', label: 'Vocabulary Packs', icon: Sparkles, description: 'Picture word cards, tracing activities, and matching exercises for building core vocabulary in 6 languages.' },
  { key: 'sentence_frames', label: 'Sentence Frames', icon: BookOpen, description: 'Structured sentence starters that help ELL students form complete sentences. Designed for K-5 classrooms.' },
  { key: 'classroom_labels', label: 'Classroom Labels', icon: Globe, description: 'Bilingual labels in Spanish, Chinese, Arabic, Vietnamese, French & Portuguese.' },
  { key: 'visual_supports', label: 'Visual Supports', icon: Eye, description: 'Visual schedules, emotion cards, social stories, and behavior charts for ELL newcomers. Also helpful for students with IEPs.' },
  { key: 'parent_communication', label: 'Parent Communication', icon: Heart, description: 'Bilingual notes, newsletters, and forms for home-school communication with multilingual families.' },
  { key: 'assessment_tools', label: 'Assessment Tools', icon: ClipboardCheck, description: 'Progress checklists, self-assessment cards, observation guides, and rubrics for ELL learners.' },
]

export default async function EllWorksheetsPage() {
  let products: Product[] = []
  try {
    products = await query<Product>(
      'SELECT id, slug, name, description, type, price_cents FROM products WHERE active = 1 ORDER BY created_at DESC LIMIT 12'
    )
  } catch { /* DB may not be ready */ }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'ELL Worksheets',
    description: 'Printable ELL worksheets for K-5 newcomer and bilingual classrooms in 6 languages.',
    url: `${BASE_URL}/ell-worksheets`,
    publisher: { '@type': 'Organization', name: 'LanternELL' },
  }

  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar links={[
        { href: '/', label: 'Home' },
        { href: '/shop', label: 'Shop' },
        { href: '/teaching-tips', label: 'Teaching Tips' },
      ]} />

      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-text-primary mb-6 text-center">
            ELL Worksheets for K-5 Newcomer & Bilingual Classrooms
          </h1>
          <p className="text-lg text-text-primary/70 max-w-3xl mx-auto text-center mb-4">
            Print-ready ELL worksheets designed for English Language Learners in K-5 classrooms.
            Each worksheet pack includes bilingual content in 6 languages, visual supports, and teacher guides. Resources for Pre-K and grades 6-8 also available.
          </p>
          <p className="text-center mb-12">
            <Link href="/" className="text-primary hover:underline">LanternELL</Link> creates resources that help
            <Link href="/teaching-tips" className="text-primary hover:underline mx-1">ELL teachers</Link>
            save hours of prep time every week.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-8 text-center">
            Browse ELL Worksheet Categories
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map(cat => {
              const Icon = cat.icon
              return (
                <Link key={cat.key} href={`/shop?type=${cat.key}`} className="clay-card p-6 hover:-translate-y-1 transition-all duration-200 cursor-pointer group">
                  <Icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-heading text-lg font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors">{cat.label}</h3>
                  <p className="text-sm text-text-primary/70">{cat.description}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Products */}
      {products.length > 0 && (
        <section className="pb-16 px-4 sm:px-6 lg:px-8 bg-white/50">
          <div className="max-w-7xl mx-auto py-16">
            <h2 className="font-heading text-3xl font-bold text-text-primary mb-8 text-center">
              Popular ELL Teaching Packs
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.slice(0, 6).map(p => (
                <Link key={p.id} href={`/shop/${p.slug}`} className="clay-card p-6 hover:-translate-y-1 transition-all duration-200 cursor-pointer group">
                  <h3 className="font-heading text-lg font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors">{p.name}</h3>
                  <p className="text-sm text-text-primary/70 mb-4 line-clamp-2">{p.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-xl font-bold text-primary">${(p.price_cents / 100).toFixed(2)}</span>
                    <span className="text-sm text-cta font-medium flex items-center gap-1 group-hover:gap-2 transition-all">View <ArrowRight className="w-4 h-4" /></span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/shop" className="clay-button cursor-pointer inline-flex items-center">Browse All Packs <ArrowRight className="w-5 h-5 ml-2" /></Link>
            </div>
          </div>
        </section>
      )}

      {/* SEO Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
            What Are ELL Worksheets?
          </h2>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            ELL worksheets are specially designed printable resources that support English Language Learners as they develop
            reading, writing, speaking, and listening skills. Unlike generic worksheets, ELL-specific materials include
            visual supports, bilingual vocabulary, simplified language, and scaffolded activities that meet newcomer students
            where they are.
          </p>

          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
            Why Use Printable ELL Resources?
          </h2>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            Printable resources are ideal for ELL classrooms because they require no technology setup, can be sent home
            with students for family involvement, and provide tangible materials that young learners can interact with
            physically. Teachers can print multiple copies, differentiate by highlighting or annotating, and build
            student portfolios over time.
          </p>

          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
            How LanternELL Worksheets Are Different
          </h2>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            Every LanternELL worksheet pack is designed with input from experienced ELL and bilingual educators.
            Our packs include teacher guides, student self-assessment tools, and progress tracking templates.
            All content is available in 6 language pairs — Spanish, Chinese, Arabic, Vietnamese, French, and Portuguese — with visual supports designed for ELL newcomers in K-5 classrooms.
            Read our <Link href="/teaching-tips" className="text-primary hover:underline">teaching tips</Link> for
            strategies on using these resources effectively in your classroom.
          </p>

          <div className="text-center mt-8">
            <Link href="/shop" className="clay-button-cta text-lg cursor-pointer inline-flex items-center gap-2">
              <Download className="w-5 h-5" /> Get Started with Free Samples
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
