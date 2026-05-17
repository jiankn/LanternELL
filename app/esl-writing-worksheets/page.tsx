import Link from 'next/link'
import type { Metadata } from 'next'
import { PenTool, Download, CheckCircle, Layers, Target, GraduationCap } from 'lucide-react'
import { ClusterPageLayout, ClusterSection } from '@/components/seo/ClusterPageLayout'
import { EmailCapture } from '@/components/ui/email-capture'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lanternell.com'
const CANONICAL_PATH = '/esl-writing-worksheets'

export const metadata: Metadata = {
  title: 'ESL Writing Worksheets — K-8 Frames & Prompts',
  description:
    'Print-ready ESL writing worksheets for K-8 ELLs: sentence frames, paragraph templates & writing prompts, WIDA-aligned for Levels 1-5.',
  keywords: [
    'esl writing worksheets',
    'esl writing prompts',
    'esl sentence frames',
    'esl paragraph templates',
    'free esl writing worksheets',
    'esl writing worksheets pdf',
    'ell writing worksheets',
    'esl writing worksheets for beginners',
  ],
  alternates: { canonical: CANONICAL_PATH },
  openGraph: {
    title: 'ESL Writing Worksheets — Print-Ready Prompts & Frames for K-8 ELLs',
    description:
      'Print-ready ESL writing worksheets for K-8 ELL classrooms. Sentence frames, paragraph templates, WIDA-aligned.',
    url: `${BASE_URL}${CANONICAL_PATH}`,
    images: [
      {
        url: `${BASE_URL}/images/og-esl-writing-worksheets.webp`,
        width: 1200,
        height: 630,
        alt: 'ESL Writing Worksheets for K-8 ELL Classrooms',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ESL Writing Worksheets — Print-Ready Prompts & Frames',
    description: 'Print-ready ESL writing worksheets for K-8 ELL classrooms. WIDA-aligned.',
    images: [`${BASE_URL}/images/og-esl-writing-worksheets.webp`],
  },
  robots: { index: true, follow: true },
}

const writingTypes = [
  { type: 'Sentence Frames', desc: '"I see a ___." "I have a ___." Foundational scaffolds for WIDA Level 1-2 students.' },
  { type: 'Paragraph Templates', desc: 'Topic sentence + 3 supporting sentences + closing sentence. For WIDA Level 3-4.' },
  { type: 'Writing Prompts (Leveled)', desc: 'Same prompt at WIDA Level 1, 2, 3, 4 — different scaffolding for each.' },
  { type: 'Tracing & Handwriting', desc: 'Letter formation + word tracing for K-2 newcomers building motor memory.' },
  { type: 'Journal Templates', desc: 'Daily journal frames with picture prompts. Build writing habit + vocabulary application.' },
  { type: 'Bilingual Bridge Worksheets', desc: 'Side-by-side English-Spanish writing tasks. Use home language as production scaffold.' },
]

const widaProgression = [
  { level: 'WIDA Level 1', desc: 'Drawing + 1-word labels. Native language acceptable. Picture-supported sentence frames.' },
  { level: 'WIDA Level 2', desc: '1-3 word responses. Sentence frames with picture support. Bilingual scaffolding.' },
  { level: 'WIDA Level 3', desc: 'Single sentences. Topic-sentence frames. Simple paragraph attempts.' },
  { level: 'WIDA Level 4', desc: 'Multi-sentence paragraphs. Topic + supporting + closing structure.' },
  { level: 'WIDA Level 5', desc: 'Multi-paragraph essays. Standard rubrics. Light scaffolding only.' },
]

const benefits = [
  '6+ types of writing worksheets',
  'WIDA Level 1-5 progression',
  'Sentence frames in both languages',
  'Picture-supported prompts K-3',
  'Paragraph templates 4-8',
  'Free writing sample available',
]

const faqs = [
  {
    question: 'How are ESL writing worksheets different from regular writing worksheets?',
    answer:
      'ESL writing worksheets include three key features regular writing materials often miss: sentence frames (so students don\u2019t face a blank page), picture prompts (visual entry into the topic), and WIDA-level differentiation (same prompt at multiple complexity levels). They support the writing process for students still acquiring English.',
  },
  {
    question: 'Are sentence frames helpful or do they limit student writing?',
    answer:
      'Sentence frames are research-backed scaffolds for WIDA Level 1-3. They reduce the cognitive load of writing while students focus on vocabulary and meaning. As students reach Level 4-5, frames are gradually removed. Used correctly, frames don\u2019t limit writing — they enable it.',
  },
  {
    question: 'Do these worksheets include bilingual scaffolds?',
    answer:
      'Yes. Theme packs include bilingual sentence frames for Spanish-speaking students at Level 1-2, allowing students to write in either language while building English production gradually.',
  },
  {
    question: 'What grade bands are covered?',
    answer:
      'K-2 (tracing, sentence frames with picture support, journal templates), 3-5 (paragraph templates, writing prompts at WIDA 1-4 levels), 6-8 (multi-paragraph essays, content-area writing, academic Tier 2 vocabulary application).',
  },
  {
    question: 'How are these used alongside reading worksheets?',
    answer:
      'Reading + writing pair naturally: students read a leveled passage, then complete a writing task using vocabulary from the passage. Our ESL writing worksheets pair with our ESL reading worksheets — same themes, same vocabulary, integrated cycle.',
  },
  {
    question: 'Are there free ESL writing worksheets I can try?',
    answer:
      'Yes. Our free ESL writing sample includes 1 set of sentence frames (Levels 1-3), 1 paragraph template, and 1 journal template — covering K-2 through 6-8.',
  },
]

const relatedLinks = [
  { href: '/esl-reading-worksheets', label: 'ESL Reading Worksheets' },
  { href: '/esl-vocabulary-worksheets', label: 'ESL Vocabulary Worksheets' },
  { href: '/esl-worksheets-beginners', label: 'ESL Worksheets for Beginners' },
  { href: '/visual-supports-ell', label: 'Visual Supports for ELL' },
]

export default function EslWritingWorksheetsPage() {
  return (
    <ClusterPageLayout
      breadcrumbLabel="ESL Writing Worksheets"
      canonicalPath={CANONICAL_PATH}
      badge={{ icon: PenTool, text: 'WIDA-Aligned · K-8 · 6 Types' }}
      h1="ESL Writing Worksheets for K-8 ELL Classrooms"
      intro="Print-ready ESL writing worksheets specifically designed for English Language Learners — from K-2 sentence frames to 6-8 multi-paragraph essays. Every ESL writing worksheet includes WIDA-aligned scaffolding (Levels 1-5), picture prompts for visual learners, and bilingual sentence frames for Spanish-speaking newcomers. Use them as drop-in materials for your writing block, ESL pull-out, or center rotation — designed to take students from blank-page anxiety to confident production."
      primaryCta={{ href: '/shop?type=writing_pack', label: 'Browse ESL Writing Packs', icon: Download }}
      secondaryCta={{ href: '/free-samples', label: 'Get Free Samples' }}
      faqs={faqs}
      relatedLinks={relatedLinks}
    >
      {/* H2 #1 — Types of Writing Worksheets */}
      <ClusterSection alt>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Types of ESL Writing Worksheets
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-8">
          ESL writing instruction needs different worksheet types for different stages of writing development. Six
          core types cover the K-8 ELL writing journey:
        </p>
        <div className="space-y-4">
          {writingTypes.map((w) => (
            <div key={w.type} className="clay-card p-5">
              <div className="flex items-start gap-3">
                <Layers className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-heading text-base font-semibold text-text-primary mb-1">{w.type}</h3>
                  <p className="text-sm text-text-primary/70">{w.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ClusterSection>

      {/* H2 #2 — WIDA Progression */}
      <ClusterSection>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          ESL Writing Progression by WIDA Level
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-8">
          Writing development for ELLs follows a predictable path from labeling to multi-paragraph essays. Our
          worksheets meet students at every stage:
        </p>
        <div className="space-y-4">
          {widaProgression.map((w) => (
            <div key={w.level} className="clay-card p-5">
              <div className="flex items-start gap-3">
                <GraduationCap className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-heading text-base font-semibold text-text-primary mb-1">{w.level}</h3>
                  <p className="text-sm text-text-primary/70">{w.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-text-primary/80 leading-relaxed mt-6">
          For prompts at every level, read{' '}
          <Link href="/teaching-tips/esl-writing-prompts-by-level" className="text-primary hover:underline">
            ESL writing prompts by level
          </Link>
          .
        </p>
      </ClusterSection>

      {/* H2 #3 — Sentence Frames */}
      <ClusterSection alt>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Sentence Frames: The Core ESL Writing Scaffold
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          Sentence frames are the single highest-leverage tool in ESL writing instruction. They reduce blank-page
          anxiety and let students focus on vocabulary application instead of syntax. Examples by level:
        </p>
        <div className="space-y-4">
          <div className="clay-card p-5">
            <h3 className="font-heading text-base font-semibold text-text-primary mb-1">Level 1-2</h3>
            <p className="text-sm text-text-primary/70">"I see a ___." "I have a ___." "My favorite ___ is ___."</p>
          </div>
          <div className="clay-card p-5">
            <h3 className="font-heading text-base font-semibold text-text-primary mb-1">Level 3-4</h3>
            <p className="text-sm text-text-primary/70">"I think ___ because ___." "First, ___. Next, ___. Finally, ___." "___ is similar to ___ because ___."</p>
          </div>
          <div className="clay-card p-5">
            <h3 className="font-heading text-base font-semibold text-text-primary mb-1">Level 5</h3>
            <p className="text-sm text-text-primary/70">"In contrast to ___, ___ demonstrates that ___." Light or no scaffolding.</p>
          </div>
        </div>
        <p className="text-text-primary/80 leading-relaxed mt-6">
          For 50+ sentence frames, read{' '}
          <Link href="/teaching-tips/sentence-frames-esl-writing" className="text-primary hover:underline">
            sentence frames for ESL writing
          </Link>
          .
        </p>
      </ClusterSection>

      {/* H2 #4 — Free + Newsletter */}
      <ClusterSection>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Free ESL Writing Worksheets
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          Start with our free ESL writing sample: 1 set of sentence frames (Levels 1-3), 1 paragraph template, and 1
          journal template — covering K-2 through 6-8.
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
            <Download className="w-5 h-5" /> Get Free ESL Writing Samples
          </Link>
        </div>
        <p className="text-sm text-text-primary/70 mb-6 text-center">
          For more free options, read{' '}
          <Link href="/teaching-tips/free-esl-writing-worksheets" className="text-primary hover:underline">
            free ESL writing worksheets
          </Link>
          . For paragraph templates, read{' '}
          <Link href="/teaching-tips/esl-paragraph-writing-templates" className="text-primary hover:underline">
            ESL paragraph writing templates
          </Link>
          .
        </p>
        <div className="max-w-md mx-auto">
          <p className="text-sm text-text-primary/70 mb-3 text-center">Get weekly ESL writing tips:</p>
          <EmailCapture />
        </div>
      </ClusterSection>

      {/* H2 #5 — Why Specialized */}
      <ClusterSection alt>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Why Specialized ESL Writing Worksheets Matter
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          Mainstream writing worksheets assume English production skills ELLs are still developing. Three specific
          challenges:
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="flex items-start gap-3"><Target className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" /><span className="text-text-primary/80"><strong>Blank page anxiety</strong> — newcomers freeze without sentence frames</span></div>
          <div className="flex items-start gap-3"><Target className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" /><span className="text-text-primary/80"><strong>Syntax errors</strong> — common L1 transfer needs explicit support</span></div>
          <div className="flex items-start gap-3"><Target className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" /><span className="text-text-primary/80"><strong>Vocabulary gaps</strong> — students know what they want to say in L1 but lack English words</span></div>
          <div className="flex items-start gap-3"><Target className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" /><span className="text-text-primary/80"><strong>Writing process</strong> — pre-writing scaffolds essential for ELL success</span></div>
        </div>
        <p className="text-text-primary/80 leading-relaxed">
          ESL writing worksheets address all four — making them necessary, not optional, for any classroom serving
          ELLs.
        </p>
      </ClusterSection>
    </ClusterPageLayout>
  )
}
