import Link from 'next/link'
import type { Metadata } from 'next'
import { Languages, Download, CheckCircle, Home, School, Users, ArrowLeftRight } from 'lucide-react'
import { ClusterPageLayout, ClusterSection } from '@/components/seo/ClusterPageLayout'
import { EmailCapture } from '@/components/ui/email-capture'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lanternell.com'
const CANONICAL_PATH = '/spanish-english-worksheets'

export const metadata: Metadata = {
  title: 'Spanish-English Worksheets — K-8 Print Packs',
  description:
    'Print-ready Spanish-English worksheets for K-8 dual language, ELL & homeschool. Bidirectional learning: ELLs build English, native speakers build Spanish.',
  keywords: [
    'spanish english worksheets',
    'spanish english worksheets pdf',
    'spanish english worksheets free',
    'spanish english worksheets for kindergarten',
    'spanish english bilingual worksheets',
    'spanish english homeschool worksheets',
    'spanish english printable worksheets',
    'spanish english vocabulary worksheets',
  ],
  alternates: { canonical: CANONICAL_PATH },
  openGraph: {
    title: 'Spanish-English Worksheets — Bidirectional Print Packs for K-8',
    description:
      'Print-ready Spanish-English worksheets for K-8 dual language, ELL, and homeschool families. Bidirectional learning.',
    url: `${BASE_URL}${CANONICAL_PATH}`,
    images: [
      {
        url: `${BASE_URL}/images/og-spanish-english-worksheets.webp`,
        width: 1200,
        height: 630,
        alt: 'Spanish-English Worksheets for K-8 Dual Language and Homeschool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Spanish-English Worksheets — Bidirectional Print Packs',
    description: 'Spanish-English worksheets for K-8 dual language, ELL, and homeschool. Bidirectional learning.',
    images: [`${BASE_URL}/images/og-spanish-english-worksheets.webp`],
  },
  robots: { index: true, follow: true },
}

const useCases = [
  {
    icon: School,
    title: 'Dual Language Programs',
    desc: 'Two-way immersion classrooms where half the students are native English speakers learning Spanish, and half are native Spanish speakers learning English. Spanish-English worksheets serve both directions equally.',
  },
  {
    icon: Users,
    title: 'ELL & Bilingual Classrooms',
    desc: 'Mainstream classrooms with Spanish-speaking ELL students. Spanish-English worksheets reduce the affective filter and accelerate vocabulary acquisition for newcomers in their first 90 days.',
  },
  {
    icon: Home,
    title: 'Homeschool Families',
    desc: 'Bilingual families teaching both languages at home. Spanish-English worksheets keep both languages active and equal — preventing the heritage language attrition common in second-generation Latino families.',
  },
]

const themePacks = [
  { theme: 'Family & Home', desc: 'familia / family, casa / home, mom-dad-brother-sister with picture support' },
  { theme: 'Classroom & School', desc: 'escuela / school, lápiz-libro-silla, daily routine vocabulary' },
  { theme: 'Food & Drinks', desc: 'comida / food, manzana-pan-leche, lunch vocabulary' },
  { theme: 'Animals', desc: 'animales / animals, farm-zoo-pet across both languages' },
  { theme: 'Body Parts', desc: 'cuerpo / body, head-hands-feet-eyes with diagram labeling' },
  { theme: 'Colors & Numbers', desc: 'colores / colors, números / numbers, foundational K-2' },
  { theme: 'Weather & Seasons', desc: 'clima-estaciones / weather-seasons, picture wheel' },
  { theme: 'Action Verbs', desc: 'verbos de acción / action verbs, run-jump-eat-sleep with TPR' },
  { theme: 'Feelings & Emotions', desc: 'sentimientos / feelings, happy-sad-tired with face matching' },
  { theme: 'Community & Places', desc: 'lugares / places, store-school-park-library' },
]

const benefits = [
  '10+ Spanish-English themed packs',
  'Bidirectional (works both directions)',
  'Aligned to dual language curriculum',
  'K-8 grade band coverage',
  'Picture support on every worksheet',
  'Free Spanish-English sample available',
]

const faqs = [
  {
    question: 'What\u2019s the difference between Spanish-English worksheets and English-Spanish printables?',
    answer:
      'The order signals intent. Spanish-English worksheets are bidirectional — designed for dual language programs and bilingual homes where both languages matter equally. English-Spanish printables typically prioritize English (with Spanish as scaffold for ELLs). For dual language and homeschool, choose Spanish-English. For ELL classrooms with English-only instruction goals, choose English-Spanish.',
  },
  {
    question: 'Are these worksheets for ELLs or for native English speakers learning Spanish?',
    answer:
      'Both. Every Spanish-English worksheet is designed to serve both directions: Spanish speakers learning English, AND English speakers learning Spanish. This is the defining feature of bidirectional materials, and it\u2019s why dual language programs require Spanish-English (not English-Spanish) worksheets.',
  },
  {
    question: 'Do these worksheets work in homeschool environments?',
    answer:
      'Yes — homeschool families are one of our largest user groups. Spanish-English worksheets support heritage language maintenance, second-language acquisition for English-speaking children, and bilingual identity development. Most include parent guides in both languages.',
  },
  {
    question: 'What grade levels are covered?',
    answer:
      'Spanish-English worksheets span K-8, organized into K-2 (foundational vocabulary, daily life themes), 3-5 (cross-curricular content vocabulary, math/science/social studies in both languages), and 6-8 (academic Tier 2 + Tier 3 vocabulary, literary analysis, content mastery in both languages).',
  },
  {
    question: 'How are these different from regular bilingual worksheets?',
    answer:
      'Regular bilingual worksheets often translate one direction (English with Spanish caption). Spanish-English worksheets are designed bidirectionally — Spanish appears first or equally, picture support is universal, and tasks work whether you\u2019re a native Spanish or native English speaker. Read our blog comparing the two.',
  },
  {
    question: 'Are there free Spanish-English worksheets I can try?',
    answer:
      'Yes. Our free Spanish-English sample pack includes 5 themed worksheets (family, food, colors, animals, body parts) plus 1 bilingual mini-book. Email-gated but immediate download.',
  },
]

const relatedLinks = [
  { href: '/dual-language-classroom', label: 'Dual Language Classroom Resources' },
  { href: '/english-spanish-printables', label: 'English-Spanish Printables (ELL focus)' },
  { href: '/bilingual-flashcards', label: 'Bilingual Flashcards' },
  { href: '/bilingual-classroom-labels', label: 'Bilingual Classroom Labels' },
]

export default function SpanishEnglishWorksheetsPage() {
  return (
    <ClusterPageLayout
      breadcrumbLabel="Spanish-English Worksheets"
      canonicalPath={CANONICAL_PATH}
      badge={{ icon: Languages, text: 'Bidirectional · K-8 · 10+ Themed Packs' }}
      h1="Spanish-English Worksheets for Dual Language, ELL & Homeschool"
      intro="Print-ready Spanish-English worksheets designed for bidirectional learning — equally usable by Spanish speakers learning English AND English speakers learning Spanish. Our K-8 Spanish-English worksheet collection serves dual language programs, bilingual ELL classrooms, and homeschool families. Every worksheet pairs picture support with side-by-side Spanish-English vocabulary, sentence frames, and a foldable mini-book — designed against the unique pedagogy of bidirectional bilingual education."
      primaryCta={{ href: '/shop?language=en-es', label: 'Browse Spanish-English Packs', icon: Download }}
      secondaryCta={{ href: '/free-samples', label: 'Get Free Samples' }}
      faqs={faqs}
      relatedLinks={relatedLinks}
    >
      {/* H2 #1 — Disambiguation: Spanish-English vs English-Spanish vs Bilingual */}
      <ClusterSection alt>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Spanish-English vs English-Spanish vs Bilingual: Which Do You Need?
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          The order of the languages in the worksheet name actually matters — it signals which direction the
          materials prioritize. Here&apos;s when to use each:
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="clay-card p-5 border-2 border-primary/30">
            <div className="flex items-center gap-2 mb-2">
              <ArrowLeftRight className="w-4 h-4 text-primary" />
              <h3 className="font-heading text-base font-semibold text-text-primary">Spanish-English (this page)</h3>
            </div>
            <p className="text-sm text-text-primary/70 mb-2"><strong>Bidirectional.</strong> Both directions equal.</p>
            <p className="text-xs text-text-primary/60">For: Dual language programs, bilingual homes, two-way immersion</p>
          </div>
          <div className="clay-card p-5">
            <div className="flex items-center gap-2 mb-2">
              <ArrowLeftRight className="w-4 h-4 text-primary" />
              <h3 className="font-heading text-base font-semibold text-text-primary">English-Spanish</h3>
            </div>
            <p className="text-sm text-text-primary/70 mb-2"><strong>English-prioritized.</strong> Spanish as scaffold.</p>
            <p className="text-xs text-text-primary/60">For: <Link href="/english-spanish-printables" className="text-primary hover:underline">ELL classrooms</Link> with English-acquisition goals</p>
          </div>
          <div className="clay-card p-5">
            <div className="flex items-center gap-2 mb-2">
              <ArrowLeftRight className="w-4 h-4 text-primary" />
              <h3 className="font-heading text-base font-semibold text-text-primary">Bilingual (general)</h3>
            </div>
            <p className="text-sm text-text-primary/70 mb-2"><strong>Loosely defined.</strong> Either direction.</p>
            <p className="text-xs text-text-primary/60">For: <Link href="/bilingual-flashcards" className="text-primary hover:underline">Flashcards</Link> + <Link href="/bilingual-classroom-labels" className="text-primary hover:underline">labels</Link>; less curriculum-specific</p>
          </div>
        </div>
        <p className="text-text-primary/80 leading-relaxed mt-6">
          For deep comparison, read{' '}
          <Link href="/teaching-tips/spanish-english-vs-bilingual" className="text-primary hover:underline">
            Spanish-English worksheets vs bilingual worksheets
          </Link>
          .
        </p>
      </ClusterSection>

      {/* H2 #2 — Use Cases */}
      <ClusterSection>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Who Uses Spanish-English Worksheets?
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-8">
          Spanish-English worksheets serve three distinct user groups, each with different needs but the same
          bidirectional materials:
        </p>
        <div className="space-y-4">
          {useCases.map((u) => (
            <div key={u.title} className="clay-card p-6">
              <div className="flex items-start gap-3">
                <u.icon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-heading text-lg font-semibold text-text-primary mb-1">{u.title}</h3>
                  <p className="text-sm text-text-primary/70">{u.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-text-primary/80 leading-relaxed mt-6">
          For dual language program specifics, read{' '}
          <Link href="/teaching-tips/spanish-english-dual-language" className="text-primary hover:underline">
            Spanish-English worksheets for dual language classrooms
          </Link>
          . For homeschool, read{' '}
          <Link href="/teaching-tips/spanish-english-worksheets-home" className="text-primary hover:underline">
            how to use Spanish-English worksheets at home
          </Link>
          .
        </p>
      </ClusterSection>

      {/* H2 #3 — Themed Packs */}
      <ClusterSection alt>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Spanish-English Worksheets by Theme
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-8">
          Our 10+ Spanish-English themed packs cover foundational K-8 vocabulary. Every theme includes vocabulary
          cards, matching, tracing, fill-in-blank, sorting, and a bilingual mini-book.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {themePacks.map((p) => (
            <div key={p.theme} className="clay-card p-5">
              <h3 className="font-heading text-base font-semibold text-text-primary mb-1">{p.theme}</h3>
              <p className="text-sm text-text-primary/70">{p.desc}</p>
            </div>
          ))}
        </div>
      </ClusterSection>

      {/* H2 #4 — Pedagogy */}
      <ClusterSection>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Bidirectional Pedagogy: Why Order Matters
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          A worksheet labeled &quot;English with Spanish translation&quot; treats Spanish as a scaffold — useful for
          ELLs but messaging Spanish as &quot;less important.&quot; A Spanish-English worksheet treats both languages
          as equally valuable. This subtle messaging matters in:
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" /><span className="text-text-primary/80"><strong>Identity formation</strong> — Latino students see Spanish valued, not subordinated</span></div>
          <div className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" /><span className="text-text-primary/80"><strong>Heritage language retention</strong> — second-gen kids keep Spanish active</span></div>
          <div className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" /><span className="text-text-primary/80"><strong>Bidirectional cognitive transfer</strong> — research-backed bilingual benefits</span></div>
          <div className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" /><span className="text-text-primary/80"><strong>Two-way immersion alignment</strong> — required for state-funded DL programs</span></div>
        </div>
        <p className="text-text-primary/80 leading-relaxed">
          Browse our{' '}
          <Link href="/dual-language-classroom" className="text-primary hover:underline">
            dual language classroom resources
          </Link>{' '}
          for the broader curriculum context.
        </p>
      </ClusterSection>

      {/* H2 #5 — Free + CTA */}
      <ClusterSection alt>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Free Spanish-English Worksheets You Can Print Today
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          Start with our free Spanish-English sample pack: 5 themed worksheets covering family, food, colors,
          animals, and body parts — bidirectional, picture-supported, immediately printable.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {benefits.map((b) => (
            <div key={b} className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-text-primary">{b}</span>
            </div>
          ))}
        </div>
        <div className="text-center mb-8">
          <Link href="/free-samples" className="clay-button-cta text-lg inline-flex items-center gap-2 cursor-pointer">
            <Download className="w-5 h-5" /> Get Free Spanish-English Samples
          </Link>
        </div>
        <p className="text-sm text-text-primary/70 mb-6 text-center">
          For a curated list of free K-5 resources, read{' '}
          <Link href="/teaching-tips/free-spanish-english-worksheets-k5" className="text-primary hover:underline">
            free Spanish-English worksheets for K-5
          </Link>
          .
        </p>
        <div className="max-w-md mx-auto">
          <p className="text-sm text-text-primary/70 mb-3 text-center">Get bilingual teaching tips weekly:</p>
          <EmailCapture />
        </div>
      </ClusterSection>
    </ClusterPageLayout>
  )
}
