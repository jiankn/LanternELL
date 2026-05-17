import Link from 'next/link'
import type { Metadata } from 'next'
import { BookOpen, Download, CheckCircle, Layers, GraduationCap, Globe, Target } from 'lucide-react'
import { ClusterPageLayout, ClusterSection } from '@/components/seo/ClusterPageLayout'
import { EmailCapture } from '@/components/ui/email-capture'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lanternell.com'
const CANONICAL_PATH = '/esl-vocabulary-worksheets'

export const metadata: Metadata = {
  title: 'ESL Vocabulary Worksheets — Themed Print Packs for K-8 ELLs | LanternELL',
  description:
    'Print-ready ESL vocabulary worksheets for K-8 ELL teachers. 25+ themed packs with bilingual English-Spanish editions, picture support, WIDA-aligned scaffolding, and newcomer survival vocabulary.',
  keywords: [
    'esl vocabulary worksheets',
    'esl vocabulary worksheets pdf',
    'esl vocabulary worksheets for beginners',
    'esl vocabulary printables',
    'ell vocabulary worksheets',
    'esl vocabulary worksheets k-2',
    'esl vocabulary worksheets 3-5',
    'free esl vocabulary worksheets',
  ],
  alternates: { canonical: CANONICAL_PATH },
  openGraph: {
    title: 'ESL Vocabulary Worksheets — Themed Print Packs for K-8 ELLs',
    description:
      'Print-ready ESL vocabulary worksheets for K-8 ELL teachers. 25+ themed packs, bilingual editions, WIDA-aligned.',
    url: `${BASE_URL}${CANONICAL_PATH}`,
    images: [
      {
        url: `${BASE_URL}/images/og-esl-vocabulary-worksheets.webp`,
        width: 1200,
        height: 630,
        alt: 'ESL Vocabulary Worksheets for K-8 ELL Classrooms',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ESL Vocabulary Worksheets — Themed Print Packs for K-8 ELLs',
    description:
      'Print-ready ESL vocabulary worksheets for K-8 ELL teachers. Themed packs with bilingual editions.',
    images: [`${BASE_URL}/images/og-esl-vocabulary-worksheets.webp`],
  },
  robots: { index: true, follow: true },
}

const tiers = [
  {
    tier: 'Tier 1: High-Frequency Daily Vocabulary',
    desc: 'Words ELL students need to navigate every classroom day — pencil, lunch, bathroom, water, hello, goodbye. ELL learners often know these orally before they can read them, so worksheets focus on building literacy connections.',
    examples: 'classroom objects, family, food, body parts, colors, numbers, greetings, feelings',
    grade: 'K-2 emphasis, recurring review through 3-5',
  },
  {
    tier: 'Tier 2: Cross-Curricular Academic Vocabulary',
    desc: 'Words that appear across subjects — analyze, predict, compare, observe, examine. Tier 2 is the bridge between conversational English and academic English, and it&apos;s the biggest gap for ELLs entering content-area instruction.',
    examples: 'math vocab, science vocab, social studies vocab, reading & writing, story elements',
    grade: '3-5 primary focus, introduced in 2nd grade',
  },
  {
    tier: 'Tier 3: Discipline-Specific Technical Vocabulary',
    desc: 'Subject-specific technical terms — mitosis, photosynthesis, isosceles, allegory. Tier 3 is essential for academic mastery and standardized assessment performance, but only after Tier 1 and Tier 2 are stable.',
    examples: 'lab vocabulary, scientific method, literary analysis, advanced math, social studies content',
    grade: '6-8 emphasis, content-area dependent',
  },
]

const themeCategories = [
  {
    title: 'Daily Life & Routines',
    themes: 'Classroom objects, family, home, food, body parts, clothes, daily routines',
    band: 'K-2',
  },
  {
    title: 'Descriptive & Functional',
    themes: 'Colors, numbers, shapes, opposites, feelings, weather, action verbs',
    band: 'K-2 / 3-5',
  },
  {
    title: 'Community & World',
    themes: 'Animals, places in community, transportation, geography, jobs',
    band: 'K-2 / 3-5',
  },
  {
    title: 'Cross-Curricular Academic',
    themes: 'Math vocabulary, science vocabulary, reading & writing, social studies, technology',
    band: '3-5 / 6-8',
  },
  {
    title: 'Middle Grade Academic',
    themes: 'Academic vocabulary, lab reports, literary analysis, career & life skills',
    band: '6-8',
  },
]

const wida = [
  {
    level: 'WIDA Level 1 (Entering)',
    desc: 'Picture support on every page. Single-word responses. Bilingual editions. Drawing accepted as written response.',
  },
  {
    level: 'WIDA Level 2 (Emerging)',
    desc: 'Picture support + sentence frames. 2-3 word responses. Bilingual sentence frames available.',
  },
  {
    level: 'WIDA Level 3 (Developing)',
    desc: 'Picture support + extended sentence frames. Short paragraph writing. Standard English instructions with home-language glossary.',
  },
  {
    level: 'WIDA Level 4-5 (Expanding/Bridging)',
    desc: 'Standard worksheets with light scaffolding. Multi-sentence writing. Vocabulary in context (passages).',
  },
]

const buildingSteps = [
  { step: 'Introduce', desc: 'Show vocabulary cards. Pronounce. Connect to picture. 2-3 exposures.' },
  { step: 'Practice', desc: 'Matching worksheet (recognition). Tracing worksheet (motor memory). 4-5 exposures.' },
  { step: 'Apply', desc: 'Fill-in-the-blank with picture clues. Sentence frames. 3-4 exposures.' },
  { step: 'Read', desc: 'Mini-book or connected text using target vocabulary. 3-4 exposures.' },
  { step: 'Assess', desc: 'Informal check + self-rating. 2-3 exposures.' },
]

const benefits = [
  '25+ themed ESL vocabulary packs',
  'WIDA-aligned scaffolding (Levels 1-5)',
  'Bilingual English-Spanish editions',
  'Newcomer survival vocabulary packs',
  'Picture support on every worksheet',
  'Free sample pack available',
]

const faqs = [
  {
    question: 'How are ESL vocabulary worksheets different from regular vocabulary worksheets?',
    answer:
      'ESL vocabulary worksheets are specifically designed for English Language Learners, with three key differences from general vocabulary worksheets: (1) heavy picture support on every page (80%+ visual), (2) bilingual or home-language scaffolding for newcomers, and (3) WIDA-aligned task complexity that matches each student&apos;s English proficiency level. Regular vocabulary worksheets often assume English proficiency that ELLs don&apos;t yet have.',
  },
  {
    question: 'Are these ESL vocabulary worksheets aligned to WIDA standards?',
    answer:
      'Yes. Every ESL vocabulary worksheet pack is explicitly designed against WIDA Can-Do Descriptors and WIDA proficiency levels (1-5). The packs include differentiated worksheets for each WIDA level so a single theme pack works for newcomers (Level 1) through advanced ELLs (Level 5).',
  },
  {
    question: 'What grade levels are covered?',
    answer:
      'Our ESL vocabulary worksheets span K-8, organized into three grade bands: K-2 (high-frequency Tier 1 vocabulary, classroom & family themes), 3-5 (cross-curricular Tier 2 vocabulary, math/science/social studies), and 6-8 (discipline-specific Tier 3 vocabulary, academic content mastery).',
  },
  {
    question: 'Are bilingual editions available?',
    answer:
      'Every ESL vocabulary worksheet pack includes a bilingual English-Spanish edition. The bilingual editions pair each English target word with the Spanish translation and shared illustration — designed for Spanish-speaking newcomer students. We are planning English-Mandarin and English-Vietnamese editions in 2026.',
  },
  {
    question: 'How do these compare to LanternELL\u2019s general vocabulary worksheets?',
    answer:
      'Our general vocabulary worksheets at /vocabulary-worksheets target any K-8 teacher building student vocabulary. The ESL vocabulary worksheets on this page are a specialized subset designed specifically for ELL classrooms — adding heavy picture scaffolding, WIDA alignment, bilingual editions, and newcomer-specific vocabulary not found in mainstream packs.',
  },
  {
    question: 'Are there free ESL vocabulary worksheets I can try?',
    answer:
      'Yes. Our free ESL vocabulary sample pack includes 5 themed worksheets covering classroom objects, colors, numbers, family, and feelings — bilingual English-Spanish, picture-supported, and immediately printable.',
  },
]

const relatedLinks = [
  { href: '/vocabulary-worksheets', label: 'Vocabulary Worksheets (general)' },
  { href: '/esl-worksheets-beginners', label: 'ESL Worksheets for Beginners' },
  { href: '/kindergarten-esl-worksheets', label: 'Kindergarten ESL Worksheets' },
  { href: '/bilingual-flashcards', label: 'Bilingual Flashcards' },
]

export default function EslVocabularyWorksheetsPage() {
  return (
    <ClusterPageLayout
      breadcrumbLabel="ESL Vocabulary Worksheets"
      canonicalPath={CANONICAL_PATH}
      badge={{ icon: BookOpen, text: '25+ Themed Packs · WIDA-Aligned · K-8' }}
      h1="ESL Vocabulary Worksheets by Theme & Grade"
      intro="Print-ready ESL vocabulary worksheets specifically designed for K-8 English Language Learners. Every ESL vocabulary worksheet pairs heavy picture support with WIDA-aligned scaffolding, so a single theme pack works for newcomer students (Level 1) through advanced ELLs (Level 5). Our 25+ themed ESL vocabulary packs cover Tier 1 daily-use vocabulary (classroom, family, food), Tier 2 cross-curricular academic vocabulary (math, science, social studies), and Tier 3 discipline-specific vocabulary — all available in bilingual English-Spanish editions for Spanish-speaking newcomers."
      primaryCta={{ href: '/shop?type=vocabulary_pack', label: 'Browse ESL Vocabulary Packs', icon: Download }}
      secondaryCta={{ href: '/free-samples', label: 'Get Free ESL Samples' }}
      faqs={faqs}
      relatedLinks={relatedLinks}
    >
      {/* H2 #1 — Intent disambiguation: ESL vs general vocabulary */}
      <ClusterSection alt>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          ESL Vocabulary Worksheets vs General Vocabulary Worksheets
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          A common question: &quot;What&apos;s the difference between{' '}
          <Link href="/vocabulary-worksheets" className="text-primary hover:underline">
            vocabulary worksheets
          </Link>{' '}
          and ESL vocabulary worksheets?&quot; The distinction is real and worth understanding before you print:
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="clay-card p-6">
            <h3 className="font-heading text-lg font-semibold text-text-primary mb-3">General Vocabulary Worksheets</h3>
            <ul className="space-y-2 text-sm text-text-primary/80">
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />Built for any K-8 student building vocabulary</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />Assumes baseline English literacy</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />Lighter picture scaffolding</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />Best for general ed and homeschool</li>
            </ul>
          </div>
          <div className="clay-card p-6 border-2 border-primary/30">
            <h3 className="font-heading text-lg font-semibold text-text-primary mb-3">ESL Vocabulary Worksheets (this page)</h3>
            <ul className="space-y-2 text-sm text-text-primary/80">
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />Built for ELLs at WIDA Levels 1-5</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />Heavy picture scaffolding (80%+ visual)</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />Bilingual English-Spanish editions</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />Includes newcomer survival vocab</li>
            </ul>
          </div>
        </div>
        <p className="text-text-primary/80 leading-relaxed mt-6">
          Most ELL teachers benefit from owning both — use general vocabulary packs for assessment-style practice and
          ESL vocabulary packs for newcomer instruction and WIDA Level 1-3 students.
        </p>
      </ClusterSection>

      {/* H2 #2 — Tier 1 / 2 / 3 */}
      <ClusterSection>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Tier 1 / Tier 2 / Tier 3 Vocabulary for ELLs
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-8">
          Effective ESL vocabulary instruction requires understanding the three vocabulary tiers (Beck, McKeown, &
          Kucan). Each tier needs a different worksheet approach:
        </p>
        <div className="space-y-4">
          {tiers.map((t) => (
            <div key={t.tier} className="clay-card p-6">
              <div className="flex items-start gap-3 mb-2">
                <Target className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">{t.tier}</h3>
                  <p className="text-sm text-text-primary/70 mb-3">{t.desc}</p>
                  <p className="text-xs text-text-primary/60"><strong>Examples:</strong> {t.examples}</p>
                  <p className="text-xs text-text-primary/60"><strong>Grade band:</strong> {t.grade}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-text-primary/80 leading-relaxed mt-6">
          For the highest-leverage ESL words to teach first, read{' '}
          <Link href="/teaching-tips/100-essential-vocabulary-words-esl" className="text-primary hover:underline">
            100 most important vocabulary words for ESL students
          </Link>
          .
        </p>
      </ClusterSection>

      {/* H2 #3 — Themes (25+) */}
      <ClusterSection alt>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          ESL Vocabulary Worksheets by Theme (25+ Topics)
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-8">
          Our ESL vocabulary worksheets are organized by theme and grade band. Every theme pack contains vocabulary
          cards, matching, tracing, fill-in-blank, sorting, mini-book, and answer key — all in bilingual editions.
        </p>
        <div className="space-y-4">
          {themeCategories.map((cat) => (
            <div key={cat.title} className="clay-card p-5">
              <div className="flex items-start gap-3">
                <Layers className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-heading text-lg font-semibold text-text-primary">{cat.title}</h3>
                    <span className="text-xs font-semibold text-primary bg-primary/10 rounded-full px-2 py-0.5">{cat.band}</span>
                  </div>
                  <p className="text-text-primary/70">{cat.themes}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-text-primary/80 leading-relaxed mt-6">
          For the complete theme list with sample worksheets, read{' '}
          <Link href="/teaching-tips/esl-vocabulary-worksheets-by-theme" className="text-primary hover:underline">
            ESL vocabulary worksheets by theme: complete list
          </Link>
          .
        </p>
      </ClusterSection>

      {/* H2 #4 — Grade Bands */}
      <ClusterSection>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          ESL Vocabulary Worksheets by Grade Band (K-2 / 3-5 / 6-8)
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          ESL vocabulary needs vary dramatically by age. Here&apos;s how each grade band&apos;s ESL vocabulary
          worksheet packs are designed differently:
        </p>
        <div className="space-y-4">
          <div className="clay-card p-5">
            <div className="flex items-start gap-3">
              <GraduationCap className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-heading text-lg font-semibold text-text-primary mb-1">K-2 ESL Vocabulary Worksheets</h3>
                <p className="text-sm text-text-primary/70 mb-2">
                  Heavy Tier 1 emphasis, picture-only directions, large font tracing, bilingual editions essential
                  for newcomers. 12+ themed packs.
                </p>
                <p className="text-xs text-text-primary/60">
                  Browse the dedicated{' '}
                  <Link href="/kindergarten-esl-worksheets" className="text-primary hover:underline">
                    kindergarten ESL worksheets
                  </Link>{' '}
                  page for K-specific packs.
                </p>
              </div>
            </div>
          </div>
          <div className="clay-card p-5">
            <div className="flex items-start gap-3">
              <GraduationCap className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-heading text-lg font-semibold text-text-primary mb-1">3-5 ESL Vocabulary Worksheets</h3>
                <p className="text-sm text-text-primary/70 mb-2">
                  Tier 2 cross-curricular emphasis. Math, science, social studies, reading & writing vocabulary.
                  WIDA Level 2-4 scaffolding. 8+ themed packs.
                </p>
              </div>
            </div>
          </div>
          <div className="clay-card p-5">
            <div className="flex items-start gap-3">
              <GraduationCap className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-heading text-lg font-semibold text-text-primary mb-1">6-8 ESL Vocabulary Worksheets</h3>
                <p className="text-sm text-text-primary/70 mb-2">
                  Tier 3 discipline-specific emphasis. Lab reports, literary analysis, academic vocabulary, career &
                  life skills. WIDA Level 3-5 scaffolding. 5+ themed packs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </ClusterSection>

      {/* H2 #5 — Bilingual & WIDA */}
      <ClusterSection alt>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Bilingual & WIDA-Aligned Scaffolding
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          What separates an ESL vocabulary worksheet from a general one is the explicit scaffolding for English
          proficiency level. Every ESL vocabulary pack includes differentiated worksheets for the four WIDA bands:
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {wida.map((w) => (
            <div key={w.level} className="clay-card p-5">
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-heading text-base font-semibold text-text-primary mb-1">{w.level}</h3>
                  <p className="text-sm text-text-primary/70">{w.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-text-primary/80 leading-relaxed mt-6">
          For more on bilingual support, see our{' '}
          <Link href="/bilingual-flashcards" className="text-primary hover:underline">
            bilingual flashcards
          </Link>{' '}
          collection and{' '}
          <Link href="/dual-language-classroom" className="text-primary hover:underline">
            dual language classroom resources
          </Link>
          .
        </p>
      </ClusterSection>

      {/* H2 #6 — How to Build Vocabulary */}
      <ClusterSection>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          How to Build Vocabulary with ESL Worksheets
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-8">
          Research shows ELLs need 12-15 meaningful exposures per word for retention. ESL vocabulary worksheets only
          deliver retention when used in a multi-day cycle — not as one-off assignments. Here&apos;s the 5-step build
          cycle:
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {buildingSteps.map((s, i) => (
            <div key={s.step} className="clay-card p-5 text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-heading font-bold mb-3">
                {i + 1}
              </div>
              <h3 className="font-heading text-base font-semibold text-text-primary mb-2">{s.step}</h3>
              <p className="text-xs text-text-primary/70">{s.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-text-primary/80 leading-relaxed mt-6">
          For detailed instructional sequencing, read{' '}
          <Link href="/teaching-tips/teach-esl-vocabulary-with-worksheets" className="text-primary hover:underline">
            how to teach ESL vocabulary using worksheets
          </Link>
          .
        </p>
      </ClusterSection>

      {/* H2 #7 — Free + Newsletter */}
      <ClusterSection alt>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Free ESL Vocabulary Worksheets You Can Print Today
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          Start with our free ESL vocabulary sample pack. The download includes 5 themed worksheets (classroom
          objects, colors, numbers 1-10, family, feelings) plus 1 bilingual mini-book — all WIDA-aligned and
          ready for newcomer instruction.
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
          <Link
            href="/free-samples"
            className="clay-button-cta text-lg inline-flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-5 h-5" /> Get Free ESL Vocabulary Samples
          </Link>
        </div>
        <p className="text-sm text-text-primary/70 mb-6 text-center">
          For a full curated list of free ESL vocabulary resources for beginners, read{' '}
          <Link href="/teaching-tips/esl-vocabulary-worksheets-beginners-free" className="text-primary hover:underline">
            ESL vocabulary worksheets for beginners (free printable)
          </Link>
          .
        </p>
        <div className="max-w-md mx-auto">
          <p className="text-sm text-text-primary/70 mb-3 text-center">
            Get weekly ESL teaching tips and new vocabulary packs to your inbox:
          </p>
          <EmailCapture />
        </div>
      </ClusterSection>
    </ClusterPageLayout>
  )
}
