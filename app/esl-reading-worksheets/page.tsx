import Link from 'next/link'
import type { Metadata } from 'next'
import { BookOpen, Download, CheckCircle, Layers, Target, Eye } from 'lucide-react'
import { ClusterPageLayout, ClusterSection } from '@/components/seo/ClusterPageLayout'
import { EmailCapture } from '@/components/ui/email-capture'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lanternell.com'
const CANONICAL_PATH = '/esl-reading-worksheets'

export const metadata: Metadata = {
  title: 'ESL Reading Worksheets — K-8 Comprehension',
  description:
    'Print-ready ESL reading worksheets for K-8 ELLs: comprehension passages, guided reading templates & bilingual support, WIDA-aligned Levels 1-5.',
  keywords: [
    'esl reading worksheets',
    'esl reading comprehension worksheets',
    'esl reading passages pdf',
    'free esl reading worksheets',
    'esl reading worksheets k-2',
    'esl guided reading templates',
    'ell reading worksheets',
    'esl reading strategies worksheets',
  ],
  alternates: { canonical: CANONICAL_PATH },
  openGraph: {
    title: 'ESL Reading Worksheets — Print-Ready Comprehension for K-8 ELLs',
    description:
      'Print-ready ESL reading worksheets for K-8 ELL classrooms. Comprehension, guided reading, bilingual support, WIDA-aligned.',
    url: `${BASE_URL}${CANONICAL_PATH}`,
    images: [
      {
        url: `${BASE_URL}/images/og-esl-reading-worksheets.webp`,
        width: 1200,
        height: 630,
        alt: 'ESL Reading Worksheets for K-8 ELL Classrooms',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ESL Reading Worksheets — Print-Ready Comprehension',
    description: 'Print-ready ESL reading worksheets for K-8 ELL classrooms. WIDA-aligned, bilingual support.',
    images: [`${BASE_URL}/images/og-esl-reading-worksheets.webp`],
  },
  robots: { index: true, follow: true },
}

const readingTypes = [
  { type: 'Mini-Books (4-8 pages)', desc: 'Foldable books with 1-2 sentences per page using target vocabulary. Best for K-2 newcomers and Level 1 students.' },
  { type: 'Leveled Passages', desc: '50-150 word passages at WIDA Level 1, 2, 3, and 4 — same content, different complexity. For 3-8 differentiation.' },
  { type: 'Guided Reading Sets', desc: 'Books with comprehension question pages, vocabulary worksheets, and graphic organizers. For systematic 6-8 reading instruction.' },
  { type: 'Cloze Exercises', desc: 'Fill-in-the-blank reading passages with picture support. Best for Level 2-3 vocabulary application.' },
  { type: 'Reader\u2019s Theater Scripts', desc: 'Bilingual short scripts for partner or small-group performance. Builds reading fluency + oral production.' },
  { type: 'Picture Walk Worksheets', desc: 'Pre-reading worksheets that prepare ELL students for upcoming text — predict + vocabulary preview.' },
]

const strategies = [
  { name: 'Picture Walk', desc: 'Before reading, walk through illustrations. Predict story + preview vocabulary.' },
  { name: 'Echo Reading', desc: 'Teacher reads, students repeat. Builds fluency + pronunciation.' },
  { name: 'Cloze Deletion', desc: 'Remove 1 in 7 words. Students predict from context.' },
  { name: 'Story Mapping', desc: 'Graphic organizer: characters, setting, problem, solution.' },
  { name: 'Retell with Pictures', desc: 'After reading, students sequence picture cards retelling the story.' },
  { name: 'Question-Answer Relationships', desc: 'Right There / Think and Search / On My Own / Author and Me.' },
]

const benefits = [
  '6+ types of reading worksheets',
  'WIDA Level 1-5 differentiation',
  'Bilingual passages available',
  'Picture support for K-3',
  'Guided reading templates 4-8',
  'Free reading sample available',
]

const faqs = [
  {
    question: 'How are ESL reading worksheets different from regular reading worksheets?',
    answer:
      'ESL reading worksheets include three key features regular reading worksheets often miss: heavy picture support (especially for K-3), simplified syntax for WIDA Level 1-2, and pre-reading vocabulary scaffolds. They aim to make grade-level content accessible without watering down rigor.',
  },
  {
    question: 'Are these passages WIDA-aligned?',
    answer:
      'Yes. Every ESL reading worksheet is built against WIDA Can-Do Descriptors. Most theme packs include the same content at WIDA Level 1, 2, 3, and 4 — letting one teacher serve a mixed-proficiency class with a single download.',
  },
  {
    question: 'Are the reading passages bilingual?',
    answer:
      'Theme packs include Spanish-English bilingual passages for K-5. Bilingual support is most useful at WIDA Level 1-2 and fades by Level 4-5. We also offer English-only passages for advanced ELLs.',
  },
  {
    question: 'How are these used in guided reading?',
    answer:
      'Each guided reading set includes the leveled passage, vocabulary worksheet, comprehension questions, and graphic organizer — the four core components of a guided reading session. Use them as drop-in materials for your existing guided reading rotation.',
  },
  {
    question: 'What grade bands are covered?',
    answer:
      'K-2 (mini-books, picture-supported, 4-8 pages), 3-5 (leveled passages 50-150 words, vocabulary preview), 6-8 (guided reading sets with comprehension questions, graphic organizers, and content-area passages).',
  },
  {
    question: 'Are there free ESL reading worksheets I can try?',
    answer:
      'Yes. Our free ESL reading sample includes 1 K-2 mini-book, 1 set of leveled passages (Level 1-3), and 1 guided reading template — covering all three grade bands.',
  },
]

const relatedLinks = [
  { href: '/esl-vocabulary-worksheets', label: 'ESL Vocabulary Worksheets' },
  { href: '/esl-writing-worksheets', label: 'ESL Writing Worksheets' },
  { href: '/esl-worksheets-beginners', label: 'ESL Worksheets for Beginners' },
  { href: '/visual-supports-ell', label: 'Visual Supports for ELL' },
]

export default function EslReadingWorksheetsPage() {
  return (
    <ClusterPageLayout
      breadcrumbLabel="ESL Reading Worksheets"
      canonicalPath={CANONICAL_PATH}
      badge={{ icon: BookOpen, text: 'WIDA-Aligned · K-8 · 6 Types' }}
      h1="ESL Reading Worksheets for K-8 ELL Classrooms"
      intro="Print-ready ESL reading worksheets specifically designed for English Language Learners — from K-2 mini-books to 6-8 guided reading sets. Every ESL reading worksheet includes picture support, WIDA-aligned scaffolding (Levels 1-5), pre-reading vocabulary preview, and post-reading comprehension. Use them as drop-in materials for your guided reading rotation, ESL pull-out, or whole-class reading block — WIDA differentiated so one pack serves your full mixed-proficiency class."
      primaryCta={{ href: '/shop?type=reading_pack', label: 'Browse ESL Reading Packs', icon: Download }}
      secondaryCta={{ href: '/free-samples', label: 'Get Free Samples' }}
      faqs={faqs}
      relatedLinks={relatedLinks}
    >
      {/* H2 #1 — Types of Reading Worksheets */}
      <ClusterSection alt>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Types of ESL Reading Worksheets
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-8">
          ESL reading instruction needs multiple worksheet types — each addresses a different reading skill. Our
          library covers all six core types:
        </p>
        <div className="space-y-4">
          {readingTypes.map((r) => (
            <div key={r.type} className="clay-card p-5">
              <div className="flex items-start gap-3">
                <Layers className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-heading text-base font-semibold text-text-primary mb-1">{r.type}</h3>
                  <p className="text-sm text-text-primary/70">{r.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-text-primary/80 leading-relaxed mt-6">
          For 50 hand-picked reading worksheets, read{' '}
          <Link href="/teaching-tips/50-esl-reading-worksheets-k8" className="text-primary hover:underline">
            50 ESL reading worksheets for K-8
          </Link>
          .
        </p>
      </ClusterSection>

      {/* H2 #2 — Reading Strategies */}
      <ClusterSection>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          ESL Reading Comprehension Strategies (Built Into Every Worksheet)
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-8">
          Research-backed reading strategies are embedded into every ESL reading worksheet. Six core strategies you&apos;ll
          see across our library:
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {strategies.map((s) => (
            <div key={s.name} className="clay-card p-5">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-heading text-base font-semibold text-text-primary mb-1">{s.name}</h3>
                  <p className="text-sm text-text-primary/70">{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-text-primary/80 leading-relaxed mt-6">
          For implementation guidance, read{' '}
          <Link href="/teaching-tips/esl-reading-comprehension-strategies" className="text-primary hover:underline">
            ESL reading comprehension strategies
          </Link>
          .
        </p>
      </ClusterSection>

      {/* H2 #3 — Grade Bands */}
      <ClusterSection alt>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          ESL Reading Worksheets by Grade Band
        </h2>
        <div className="space-y-4">
          <div className="clay-card p-5">
            <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">K-2: Mini-Books</h3>
            <p className="text-sm text-text-primary/70">Foldable 4-8 page books with 1-2 sentences per page. Heavy picture support. Bilingual editions available. 12+ themed mini-books.</p>
          </div>
          <div className="clay-card p-5">
            <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">3-5: Leveled Passages</h3>
            <p className="text-sm text-text-primary/70">50-150 word passages at WIDA Level 1, 2, 3, 4 — same content, different complexity. Picture support fading. Vocabulary preview included.</p>
          </div>
          <div className="clay-card p-5">
            <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">6-8: Guided Reading Sets</h3>
            <p className="text-sm text-text-primary/70">Content-area passages (science, social studies) with comprehension questions, graphic organizers, and Tier 2 vocabulary. Bridges to grade-level texts.</p>
          </div>
        </div>
      </ClusterSection>

      {/* H2 #4 — Free + Newsletter */}
      <ClusterSection>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Free ESL Reading Worksheets PDF
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          Start with our free ESL reading sample: 1 K-2 mini-book, 1 set of leveled passages (Level 1-3), and 1 guided
          reading template — covering all three grade bands.
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
            <Download className="w-5 h-5" /> Get Free ESL Reading Samples
          </Link>
        </div>
        <p className="text-sm text-text-primary/70 mb-6 text-center">
          For more free options, read{' '}
          <Link href="/teaching-tips/free-esl-reading-worksheets-pdf" className="text-primary hover:underline">
            free ESL reading worksheets PDF
          </Link>
          . For guided reading templates, read{' '}
          <Link href="/teaching-tips/esl-guided-reading-templates" className="text-primary hover:underline">
            ESL guided reading templates
          </Link>
          .
        </p>
        <div className="max-w-md mx-auto">
          <p className="text-sm text-text-primary/70 mb-3 text-center">Get weekly ESL reading tips:</p>
          <EmailCapture />
        </div>
      </ClusterSection>

      {/* H2 #5 — Why ESL Reading Matters */}
      <ClusterSection alt>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Why Specialized ESL Reading Worksheets Matter
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          Mainstream reading worksheets assume English literacy that ELL students don&apos;t yet have. Three problems:
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="flex items-start gap-3"><Eye className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" /><span className="text-text-primary/80"><strong>Vocabulary load</strong> — mainstream texts have 3-5 unknown words per sentence for ELLs</span></div>
          <div className="flex items-start gap-3"><Eye className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" /><span className="text-text-primary/80"><strong>Cultural references</strong> — assumed background knowledge ELLs may lack</span></div>
          <div className="flex items-start gap-3"><Eye className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" /><span className="text-text-primary/80"><strong>Syntactic complexity</strong> — long, embedded sentences overwhelm Level 1-2</span></div>
          <div className="flex items-start gap-3"><Eye className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" /><span className="text-text-primary/80"><strong>No pre-reading scaffold</strong> — vocabulary preview is optional, not required</span></div>
        </div>
        <p className="text-text-primary/80 leading-relaxed">
          ESL reading worksheets address all four — and that&apos;s why they&apos;re necessary, not optional, in any
          classroom serving ELLs.
        </p>
      </ClusterSection>
    </ClusterPageLayout>
  )
}
