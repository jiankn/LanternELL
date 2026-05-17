import Link from 'next/link'
import type { Metadata } from 'next'
import { BookOpen, Download, CheckCircle, Layers, GraduationCap, Sparkles } from 'lucide-react'
import { ClusterPageLayout, ClusterSection } from '@/components/seo/ClusterPageLayout'
import { EmailCapture } from '@/components/ui/email-capture'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lanternell.com'
const CANONICAL_PATH = '/vocabulary-worksheets'

export const metadata: Metadata = {
  title: 'Vocabulary Worksheets — Print-Ready for K-8 Bilingual & ELL Classrooms | LanternELL',
  description:
    'Print-ready vocabulary worksheets for K-8 teachers. 25+ themed sets covering classroom objects, animals, food, math, and science. English-Spanish bilingual editions for ELL classrooms.',
  keywords: [
    'vocabulary worksheets',
    'vocabulary worksheets pdf',
    'printable vocabulary worksheets',
    'vocabulary worksheets by grade',
    'esl vocabulary worksheets',
    'bilingual vocabulary worksheets',
    'vocabulary worksheets k-5',
    'free vocabulary worksheets',
  ],
  alternates: { canonical: CANONICAL_PATH },
  openGraph: {
    title: 'Vocabulary Worksheets — Print-Ready for K-8 Classrooms',
    description:
      'Print-ready vocabulary worksheets for K-8 teachers. 25+ themed sets in English and bilingual English-Spanish editions.',
    url: `${BASE_URL}${CANONICAL_PATH}`,
    images: [
      {
        url: `${BASE_URL}/images/og-vocabulary-worksheets.webp`,
        width: 1200,
        height: 630,
        alt: 'Vocabulary Worksheets for K-8 Bilingual and ELL Classrooms',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vocabulary Worksheets — Print-Ready for K-8 Classrooms',
    description:
      'Print-ready vocabulary worksheets for K-8 teachers. 25+ themed sets, bilingual editions available.',
    images: [`${BASE_URL}/images/og-vocabulary-worksheets.webp`],
  },
  robots: { index: true, follow: true },
}

const themeCategories = [
  { title: 'Everyday Vocabulary', themes: 'Classroom objects, family, food, clothes, body parts, colors, numbers, shapes' },
  { title: 'Action & Description', themes: 'Action verbs, opposites, feelings, weather, transportation' },
  { title: 'Community & World', themes: 'Places in community, animals, geography, social studies' },
  { title: 'Academic Content', themes: 'Math vocabulary, science vocabulary, reading & writing, technology, arts & music' },
  { title: 'Middle Grades', themes: 'Academic vocabulary, career & life skills, health & safety, lab reports' },
]

const gradeBreakdown = [
  {
    grade: 'K-2 Vocabulary Worksheets',
    desc: 'High-frequency Tier 1 vocabulary with picture support. Themes: classroom, family, animals, food, body parts, colors, numbers, shapes. 12+ ready-made packs.',
  },
  {
    grade: '3-5 Vocabulary Worksheets',
    desc: 'Cross-curricular Tier 2 vocabulary tied to content areas. Themes: math vocab, science vocab, social studies, reading & writing, geography, health & safety. 8+ ready-made packs.',
  },
  {
    grade: '6-8 Vocabulary Worksheets',
    desc: 'Academic Tier 3 vocabulary for content mastery. Themes: academic vocabulary, career & life skills, lab reports & scientific method, literary analysis. 5+ ready-made packs.',
  },
]

const goodWorksheetTraits = [
  'Clear visual support paired with each word',
  'Multiple exposure activities (match, trace, write)',
  'A built-in mini-book for reading practice',
  'Answer key for self-checking and stations',
  'Print-ready in US Letter and A4 sizes',
  'Bilingual option for ELL & dual language',
]

const centerActivities = [
  {
    title: 'Picture-Word Matching',
    desc: 'Cut and match. Students pair vocabulary cards with picture cards. Builds word-image association.',
  },
  {
    title: 'Trace and Write',
    desc: 'Students trace target words, then write them independently. Builds spelling and motor memory.',
  },
  {
    title: 'Fill-in-the-Blank',
    desc: 'Use the worksheet with a paragraph or sentence-frame strip. Builds vocabulary in context.',
  },
  {
    title: 'Mini-Book Reading',
    desc: 'Foldable mini-book using the same vocabulary. Students read alone or with a partner.',
  },
]

const benefits = [
  '25+ themed vocabulary packs',
  'Print-ready PDF (US Letter & A4)',
  'Bilingual English-Spanish editions',
  'Color and black & white options',
  'Answer keys included',
  'Free sample packs available',
]

const faqs = [
  {
    question: 'What grade levels are these vocabulary worksheets for?',
    answer:
      'Our vocabulary worksheets span Kindergarten through 8th grade, organized into three grade bands: K-2 (high-frequency Tier 1 vocabulary with heavy picture support), 3-5 (cross-curricular Tier 2 vocabulary tied to math, science, and social studies), and 6-8 (academic Tier 3 vocabulary for content mastery and standardized assessment prep).',
  },
  {
    question: 'Are these vocabulary worksheets free?',
    answer:
      'We offer free sample worksheets from each themed pack so you can try before you buy. Full packs are available for individual purchase or through our membership plan. The free samples include vocabulary cards, one matching worksheet, and a mini-book preview for each theme.',
  },
  {
    question: 'Can I use these vocabulary worksheets for ESL or ELL students?',
    answer:
      'Yes. Our vocabulary worksheets are designed with ELL classrooms in mind. Every pack has a bilingual English-Spanish edition that pairs target English vocabulary with Spanish translations and clear illustrations. The visual scaffolds, simple sentence frames, and picture-based exercises work well for newcomers at WIDA proficiency levels 1-3.',
  },
  {
    question: 'How many vocabulary worksheet themes do you have?',
    answer:
      'We currently have 25+ themed vocabulary packs covering everyday topics (classroom, family, food, body parts), descriptive vocabulary (colors, numbers, shapes, opposites, feelings), community topics (places, animals, transportation), and academic content (math, science, social studies, reading & writing). New themes are added monthly based on teacher requests.',
  },
  {
    question: 'What languages are available?',
    answer:
      'All vocabulary worksheets are available in English-only and English-Spanish bilingual editions. Spanish is our first translation language because it serves the largest US ELL student population. We are planning additional language pairs (Mandarin, Arabic, Vietnamese, French, Portuguese) based on US ELL demographic data.',
  },
  {
    question: 'Can I edit the worksheets?',
    answer:
      'The standard PDF versions are designed for print-and-use without editing. Premium packs include editable templates (Google Slides format) so you can customize words, add your student names, or adapt the worksheet for a specific lesson. Editable versions are part of our membership plan.',
  },
]

const relatedLinks = [
  { href: '/esl-vocabulary-worksheets', label: 'ESL Vocabulary Worksheets' },
  { href: '/kindergarten-esl-worksheets', label: 'Kindergarten ESL Worksheets' },
  { href: '/bilingual-classroom-labels', label: 'Bilingual Classroom Labels' },
  { href: '/ell-worksheets', label: 'ELL Worksheets' },
]

export default function VocabularyWorksheetsPage() {
  return (
    <ClusterPageLayout
      breadcrumbLabel="Vocabulary Worksheets"
      canonicalPath={CANONICAL_PATH}
      badge={{ icon: BookOpen, text: '25+ Themed Packs · K-8' }}
      h1="Vocabulary Worksheets for Real Classrooms"
      intro="Build student vocabulary with print-ready vocabulary worksheets designed for K-8 teachers. Our 25+ themed packs cover classroom objects, animals, food, body parts, math, and science — every worksheet pairs clear visuals with multiple exposure activities so students see, hear, trace, and write each target word. Available in English-only and bilingual English-Spanish editions, our vocabulary worksheets are designed to work in ELL classrooms, dual language programs, and general education settings."
      primaryCta={{ href: '/shop?type=vocabulary_pack', label: 'Browse Vocabulary Packs', icon: Download }}
      secondaryCta={{ href: '/free-samples', label: 'Get Free Samples' }}
      faqs={faqs}
      relatedLinks={relatedLinks}
    >
      {/* H2 #1: What Makes a Great Vocabulary Worksheet */}
      <ClusterSection alt>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          What Makes a Great Vocabulary Worksheet?
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          Not all vocabulary worksheets are equal. The vocabulary worksheets that actually move students from
          recognition to mastery share six characteristics — and these are the design principles every LanternELL
          vocabulary pack is built on:
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {goodWorksheetTraits.map((trait) => (
            <div key={trait} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-text-primary/80">{trait}</span>
            </div>
          ))}
        </div>
        <p className="text-text-primary/80 leading-relaxed mt-6">
          For more on choosing effective worksheets, read our guide on{' '}
          <Link href="/teaching-tips/how-to-use-vocabulary-worksheets" className="text-primary hover:underline">
            how to use vocabulary worksheets effectively
          </Link>
          .
        </p>
      </ClusterSection>

      {/* H2 #2: Vocabulary Worksheets by Theme */}
      <ClusterSection>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Vocabulary Worksheets by Theme (25+ Topics)
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-8">
          Our vocabulary worksheets are organized by theme so you can grab exactly what you need for this week&apos;s
          lesson. Every theme comes with vocabulary cards, a matching worksheet, a tracing worksheet, a
          fill-in-the-blank worksheet, a mini-book, and an answer key — all in one downloadable pack.
        </p>
        <div className="space-y-4">
          {themeCategories.map((cat) => (
            <div key={cat.title} className="clay-card p-5">
              <div className="flex items-start gap-3">
                <Layers className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-heading text-lg font-semibold text-text-primary mb-1">{cat.title}</h3>
                  <p className="text-text-primary/70">{cat.themes}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-text-primary/80 leading-relaxed mt-6">
          Need a complete theme list? Read{' '}
          <Link href="/teaching-tips/vocabulary-worksheets-by-grade-level" className="text-primary hover:underline">
            vocabulary worksheets by grade level: K-8 guide
          </Link>{' '}
          for the full inventory.
        </p>
      </ClusterSection>

      {/* H2 #3: Vocabulary Worksheets by Grade */}
      <ClusterSection alt>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Vocabulary Worksheets by Grade (K-2 / 3-5 / 6-8)
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          Vocabulary instruction looks different across grade bands. Early grades need high-frequency Tier 1 words with
          heavy visual support. Upper elementary needs cross-curricular Tier 2 vocabulary tied to content. Middle
          school needs academic Tier 3 vocabulary for assessment readiness. Our vocabulary worksheets are explicitly
          designed for each band:
        </p>
        <div className="space-y-4">
          {gradeBreakdown.map((g) => (
            <div key={g.grade} className="clay-card p-5">
              <div className="flex items-start gap-3">
                <GraduationCap className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-heading text-lg font-semibold text-text-primary mb-1">{g.grade}</h3>
                  <p className="text-text-primary/70">{g.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ClusterSection>

      {/* H2 #4: Bilingual Vocabulary Worksheets */}
      <ClusterSection>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Bilingual Vocabulary Worksheets (English-Spanish)
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          Every theme is also available in a bilingual English-Spanish edition for ELL classrooms, dual language
          programs, and Spanish-speaking newcomer students. Bilingual vocabulary worksheets accelerate acquisition by
          connecting new English words to the student&apos;s home-language background — research consistently shows
          that ELLs build vocabulary 40% faster when given bilingual exposure compared to English-only instruction.
        </p>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          Our bilingual editions include side-by-side English-Spanish vocabulary cards, picture support on every
          worksheet, and home-language sentence frames so students can express what they know even before they have
          full English fluency.
        </p>
        <p className="text-text-primary/80 leading-relaxed">
          Browse the full <Link href="/dual-language-classroom" className="text-primary hover:underline">
            dual language classroom resources
          </Link>{' '}
          collection, or explore{' '}
          <Link href="/bilingual-classroom-labels" className="text-primary hover:underline">
            bilingual classroom labels
          </Link>{' '}
          and{' '}
          <Link href="/english-spanish-printables" className="text-primary hover:underline">
            English-Spanish printables
          </Link>{' '}
          to build a fully bilingual learning environment.
        </p>
      </ClusterSection>

      {/* H2 #5: How to Use Vocabulary Worksheets in Centers */}
      <ClusterSection alt>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          How to Use Vocabulary Worksheets in Centers
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-8">
          Vocabulary worksheets aren&apos;t just for whole-group teaching. They&apos;re some of the most flexible
          center materials in the classroom. Here are four center setups using a single vocabulary pack:
        </p>
        <div className="grid sm:grid-cols-2 gap-6">
          {centerActivities.map((act) => (
            <div key={act.title} className="clay-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="font-heading text-lg font-semibold text-text-primary">{act.title}</h3>
              </div>
              <p className="text-sm text-text-primary/70">{act.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-text-primary/80 leading-relaxed mt-6">
          For a complete center rotation plan using one vocabulary pack across the week, read{' '}
          <Link href="/teaching-tips/how-to-use-vocabulary-worksheets" className="text-primary hover:underline">
            how to use vocabulary worksheets effectively
          </Link>
          .
        </p>
      </ClusterSection>

      {/* H2 #6: ELL-Specific Use */}
      <ClusterSection>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Vocabulary Worksheets for ELL & Newcomer Students
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          For ELL students, vocabulary worksheets are more than practice — they&apos;re the entry point to academic
          English. A newcomer student who masters 200 high-frequency English words in their first semester is
          dramatically more likely to participate in grade-level content by year-end. The vocabulary worksheets in
          this collection are engineered specifically to deliver those high-frequency words with maximum visual and
          bilingual support.
        </p>
        <p className="text-text-primary/80 leading-relaxed">
          Our{' '}
          <Link href="/esl-vocabulary-worksheets" className="text-primary hover:underline">
            ESL vocabulary worksheets
          </Link>{' '}
          page focuses specifically on the ELL/ESL use case, with WIDA-aligned vocabulary progressions and newcomer
          survival vocabulary packs. The{' '}
          <Link href="/kindergarten-esl-worksheets" className="text-primary hover:underline">
            kindergarten ESL worksheets
          </Link>{' '}
          page focuses on K vocabulary specifically.
        </p>
      </ClusterSection>

      {/* H2 #7: Free Download & Newsletter */}
      <ClusterSection alt>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Free Vocabulary Worksheets You Can Print Today
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          Start with our free sample pack. The free download includes 5 themed vocabulary card sets (classroom
          objects, colors, numbers, family members, feelings), one fill-in-the-blank worksheet, and one foldable
          mini-book — everything you need to run a vocabulary lesson tomorrow morning.
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
            <Download className="w-5 h-5" /> Get Free Vocabulary Worksheet Samples
          </Link>
        </div>
        <div className="max-w-md mx-auto">
          <p className="text-sm text-text-primary/70 mb-3 text-center">
            Or get weekly vocabulary worksheets and teaching tips to your inbox:
          </p>
          <EmailCapture />
        </div>
      </ClusterSection>
    </ClusterPageLayout>
  )
}
