import Link from 'next/link'
import Image from 'next/image'
import { query } from '@/lib/db'
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/footer'
import { ArrowRight, Download, BookOpen, Globe, Sparkles, Heart, Eye, ClipboardCheck } from 'lucide-react'
import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lanternell.com'

export const metadata: Metadata = {
  title: 'ELL Newcomer Worksheets — Free Printable ESL Resources for K-5 Classrooms',
  description:
    'Free printable ELL newcomer worksheets for bilingual and ESL students in K-5 classrooms. Download vocabulary packs, visual supports, sentence frames, and classroom labels in English-Spanish. Resources for Pre-K through grade 8 also available.',
  keywords: [
    'ELL newcomer worksheets',
    'ELL worksheets',
    'ELL worksheets for newcomers',
    'printable ELL worksheets',
    'free ELL worksheets',
    'ESL worksheets K-5',
    'newcomer worksheets',
    'bilingual worksheets',
  ],
  alternates: { canonical: '/ell-worksheets' },
  openGraph: {
    title: 'ELL Newcomer Worksheets — Free Printable ESL Resources',
    description: 'Free printable ELL newcomer worksheets for K-5 bilingual and ESL classrooms. English-Spanish.',
    url: `${BASE_URL}/ell-worksheets`,
    images: [{ url: `${BASE_URL}/images/og-home.png`, width: 1200, height: 630, alt: 'ELL Newcomer Worksheets for K-5' }],
  },
  robots: { index: true, follow: true },
}

export const revalidate = 3600

interface Product {
  id: string; slug: string; name: string; description: string
  type: string; price_cents: number
}

const categories = [
  { key: 'vocabulary_pack', label: 'Vocabulary Packs', icon: Sparkles, image: '/images/categories/cat-vocabulary.webp', description: 'Picture word cards, tracing activities, and matching exercises for building core vocabulary. English-Spanish bilingual.' },
  { key: 'sentence_frames', label: 'Sentence Frames', icon: BookOpen, image: '/images/categories/cat-sentence.webp', description: 'Structured sentence starters that help ELL students form complete sentences. Designed for K-5 classrooms.' },
  { key: 'classroom_labels', label: 'Classroom Labels', icon: Globe, image: '/images/categories/cat-labels.webp', description: 'Bilingual English-Spanish labels for classroom furniture, areas, routines, and daily schedules.' },
  { key: 'parent_communication', label: 'Parent Communication', icon: Heart, image: '/images/categories/cat-parents.webp', description: 'Bilingual notes, newsletters, and forms for home-school communication with multilingual families.' },
]

export default async function EllWorksheetsPage() {
  let products: Product[] = []
  try {
    products = await query<Product>(
      'SELECT id, slug, name, description, type, price_cents FROM products WHERE active = 1 ORDER BY created_at DESC LIMIT 12'
    )
  } catch { /* DB may not be ready */ }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'ELL Worksheets', item: `${BASE_URL}/ell-worksheets` },
    ],
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'ELL Newcomer Worksheets',
    description: metadata.description,
    url: `${BASE_URL}/ell-worksheets`,
    publisher: { '@type': 'Organization', name: 'LanternELL' },
    breadcrumb: breadcrumbJsonLd,
  }

  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Navbar links={[
        { href: '/', label: 'Home' },
        { href: '/shop', label: 'Shop' },
        { href: '/teaching-tips', label: 'Teaching Tips' },
      ]} />

      {/* Breadcrumb */}
      <div className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-text-muted mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <span className="text-text-primary font-medium">ELL Worksheets</span>
          </nav>
        </div>
      </div>

      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-text-primary mb-6 text-center">
            ELL Newcomer Worksheets for K-5 Bilingual Classrooms
          </h1>
          <p className="text-lg text-text-primary/70 max-w-3xl mx-auto text-center mb-4">
            Download free printable ELL newcomer worksheets designed for English Language Learners in K-5 classrooms.
            Each worksheet pack includes English-Spanish bilingual content, <Link href="/visual-supports-ell" className="text-primary hover:underline">visual supports</Link>, and teacher guides. Browse our <Link href="/bilingual-classroom-labels" className="text-primary hover:underline">bilingual classroom labels</Link>, <Link href="/english-spanish-printables" className="text-primary hover:underline">English-Spanish printables</Link>, and <Link href="/esl-worksheets-beginners" className="text-primary hover:underline">ESL worksheets for beginners</Link>. Resources for Pre-K and grades 6-8 also available.
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
                <Link key={cat.key} href={`/shop?type=${cat.key}`} className="clay-card overflow-hidden hover:-translate-y-1 transition-all duration-200 cursor-pointer group flex flex-col">
                  <div className="relative h-40 w-full bg-slate-100">
                    <Image src={cat.image} alt={cat.label} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className="w-5 h-5 text-primary" />
                      <h3 className="font-heading text-lg font-semibold text-text-primary group-hover:text-primary transition-colors">{cat.label}</h3>
                    </div>
                    <p className="text-sm text-text-primary/70 mb-4 flex-grow">{cat.description}</p>
                    <span className="text-sm text-cta font-medium flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">Browse Packs <ArrowRight className="w-4 h-4" /></span>
                  </div>
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
                <Link key={p.id} href={`/shop/${p.slug}`} className="clay-card overflow-hidden hover:-translate-y-1 transition-all duration-200 cursor-pointer group flex flex-col">
                  <div className="relative h-48 w-full bg-slate-100">
                    <Image src="/images/products/placeholder-pack.webp" alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-heading text-lg font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors line-clamp-1">{p.name}</h3>
                    <p className="text-sm text-text-primary/70 mb-4 flex-grow line-clamp-2">{p.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="font-heading text-xl font-bold text-primary">${(p.price_cents / 100).toFixed(2)}</span>
                      <span className="text-sm text-cta font-medium flex items-center gap-1 group-hover:gap-2 transition-all">View <ArrowRight className="w-4 h-4" /></span>
                    </div>
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
            What Are ELL Newcomer Worksheets?
          </h2>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            ELL newcomer worksheets are specially designed printable resources that support English Language Learners as they develop
            reading, writing, speaking, and listening skills. Unlike generic worksheets, ELL-specific materials include
            visual supports, bilingual vocabulary, simplified language, and scaffolded activities that meet newcomer students
            where they are. Our worksheets are designed for the unique needs of students who are new to English, with heavy visual scaffolding and bilingual support in English and Spanish.
          </p>

          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
            Why Use Printable ELL Resources?
          </h2>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            Printable resources are ideal for ELL classrooms because they require no technology setup, can be sent home
            with students for family involvement, and provide tangible materials that young learners can interact with
            physically. Teachers can print multiple copies, differentiate by highlighting or annotating, and build
            student portfolios over time. Pair these worksheets with our <Link href="/bilingual-classroom-labels" className="text-primary hover:underline">bilingual classroom labels</Link> to create a fully immersive language learning environment.
          </p>

          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
            ELL Worksheets for Newcomer Students
          </h2>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            Newcomer students need worksheets that account for the silent period — the weeks or months when students are absorbing English but not yet producing it. Our newcomer worksheets use picture-word matching, tracing, and visual sorting activities that allow students to demonstrate understanding without requiring English output. As students progress, sentence frames and guided writing activities scaffold their transition to independent English production. For first-week resources, visit our <Link href="/newcomer-activities" className="text-primary hover:underline">newcomer activities</Link> page.
          </p>

          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
            Bilingual Worksheets in English and Spanish
          </h2>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            All of our ELL worksheet packs are available in bilingual English-Spanish format. This means every vocabulary word, instruction, and sentence frame appears in both languages, allowing Spanish-speaking students to leverage their home language while building English skills. Teachers in dual language programs use these worksheets during both English and Spanish instruction blocks. Browse our full collection of <Link href="/english-spanish-printables" className="text-primary hover:underline">English-Spanish printables</Link> for additional bilingual resources.
          </p>

          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
            How LanternELL Worksheets Are Different
          </h2>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            Every LanternELL worksheet pack is designed with input from experienced ELL and bilingual educators.
            Our packs include teacher guides, student self-assessment tools, and progress tracking templates.
            All content is available in English-Spanish bilingual format, with <Link href="/visual-supports-ell" className="text-primary hover:underline">visual supports</Link> designed for ELL newcomers in K-5 classrooms. More language pairs are planned for future updates.
            Read our <Link href="/teaching-tips" className="text-primary hover:underline">teaching tips</Link> for
            strategies on using these resources effectively in your classroom. For beginning English learners, our <Link href="/esl-worksheets-beginners" className="text-primary hover:underline">ESL worksheets for beginners</Link> provide additional scaffolding.
          </p>

          <div className="text-center mt-8">
            <Link href="/free-samples" className="clay-button-cta text-lg cursor-pointer inline-flex items-center gap-2">
              <Download className="w-5 h-5" /> Browse Free Samples
            </Link>
          </div>
        </div>
      </section>

      {/* Internal links */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-text-primary/70 mb-4">
            Looking for more resources? Browse our complete collection of{' '}
            <Link href="/" className="text-primary hover:underline">ELL worksheets and bilingual teaching resources</Link>.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/bilingual-classroom-labels" className="clay-button text-sm cursor-pointer inline-flex items-center gap-1">Classroom Labels <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/english-spanish-printables" className="clay-button text-sm cursor-pointer inline-flex items-center gap-1">English-Spanish Printables <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/visual-supports-ell" className="clay-button text-sm cursor-pointer inline-flex items-center gap-1">Visual Supports <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/newcomer-activities" className="clay-button text-sm cursor-pointer inline-flex items-center gap-1">Newcomer Activities <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/esl-worksheets-beginners" className="clay-button text-sm cursor-pointer inline-flex items-center gap-1">ESL for Beginners <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
