import Link from 'next/link'
import type { Metadata } from 'next'
import { GraduationCap, Download, CheckCircle, BookOpen, Calendar, Users, Sparkles } from 'lucide-react'
import { ClusterPageLayout, ClusterSection } from '@/components/seo/ClusterPageLayout'
import { EmailCapture } from '@/components/ui/email-capture'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lanternell.com'
const CANONICAL_PATH = '/kindergarten-esl-worksheets'

export const metadata: Metadata = {
  title: 'Kindergarten ESL Worksheets — Print-Ready for K Teachers | LanternELL',
  description:
    'Print-ready kindergarten ESL worksheets for newcomer and ELL students. 12+ themed packs covering classroom, family, food, colors, numbers, and feelings. Bilingual English-Spanish editions included.',
  keywords: [
    'kindergarten esl worksheets',
    'esl worksheets kindergarten',
    'kindergarten ell worksheets',
    'esl worksheets for kindergarten newcomers',
    'free kindergarten esl worksheets',
    'bilingual kindergarten worksheets',
    'kindergarten esl printable',
    'kindergarten newcomer worksheets',
  ],
  alternates: { canonical: CANONICAL_PATH },
  openGraph: {
    title: 'Kindergarten ESL Worksheets — Print-Ready for K Teachers',
    description:
      'Print-ready kindergarten ESL worksheets for newcomer and ELL students. 12+ themed packs, bilingual editions.',
    url: `${BASE_URL}${CANONICAL_PATH}`,
    images: [
      {
        url: `${BASE_URL}/images/og-kindergarten-esl-worksheets.webp`,
        width: 1200,
        height: 630,
        alt: 'Kindergarten ESL Worksheets for Newcomer and ELL Students',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kindergarten ESL Worksheets — Print-Ready for K Teachers',
    description:
      'Print-ready kindergarten ESL worksheets for newcomer and ELL students. 12+ themed packs.',
    images: [`${BASE_URL}/images/og-kindergarten-esl-worksheets.webp`],
  },
  robots: { index: true, follow: true },
}

const goodWorksheetTraits = [
  'Heavy picture support — at least 80% of every worksheet is visual',
  'Minimal text per page (1-3 target words at most)',
  'Tracing + writing components (motor memory)',
  'Bilingual English-Spanish option for newcomer students',
  'Clear, simple directions with picture cues',
  'A companion mini-book for reading practice',
]

const themeWorksheets = [
  { theme: 'Classroom Objects', desc: 'Pencil, book, chair, desk, scissors. The first 10 words every K newcomer needs.' },
  { theme: 'Family Members', desc: 'Mom, dad, brother, sister, grandparents. For "About Me" units and family connection.' },
  { theme: 'Food & Drinks', desc: 'Apple, milk, water, bread, common K-friendly foods. Connects to lunch routine.' },
  { theme: 'Body Parts', desc: 'Head, hands, feet, eyes, mouth. Songs, P.E., and self-care vocabulary.' },
  { theme: 'Colors', desc: '8-12 basic colors with tracing, matching, and sorting worksheets.' },
  { theme: 'Numbers 1-20', desc: 'Numerals, number words, counting practice, with picture support.' },
  { theme: 'Shapes', desc: 'Circle, square, triangle, rectangle, oval — with real-world examples.' },
  { theme: 'Feelings & Emotions', desc: 'Happy, sad, tired, excited. Faces matching + sentence frames.' },
  { theme: 'Animals', desc: 'Farm, zoo, pet, ocean animals — picture cards and sorting worksheets.' },
  { theme: 'Weather & Seasons', desc: 'Sun, rain, snow + four seasons. For morning meeting routines.' },
  { theme: 'Action Verbs', desc: 'Run, jump, sit, stand, eat, sleep — TPR-friendly vocabulary.' },
  { theme: 'Greetings & Introductions', desc: 'Hello, goodbye, my name is ___. Day-1 newcomer essentials.' },
]

const firstWeekWorksheets = [
  {
    day: 'Day 1',
    title: 'Greetings + Name Card',
    desc: 'Newcomer fills in name, age, country, language. Bilingual frames included so student can self-introduce in either language.',
  },
  {
    day: 'Day 2',
    title: 'Classroom Objects Tour',
    desc: 'Picture-only worksheet. Student labels 8 classroom items with stickers or matching cards.',
  },
  {
    day: 'Day 3',
    title: 'Daily Routine Sequence',
    desc: 'Morning meeting → snack → recess → lunch → dismissal. Picture cards to sequence.',
  },
  {
    day: 'Day 4',
    title: 'Feelings Check-In',
    desc: 'Faces matching worksheet so student can communicate feelings without English production.',
  },
  {
    day: 'Day 5',
    title: 'Colors + Numbers Mini-Book',
    desc: 'A foldable mini-book combining 4 colors and numbers 1-5. Ends Week 1 with reading practice.',
  },
]

const benefits = [
  '12+ themed kindergarten ESL packs',
  'Bilingual English-Spanish editions',
  'First-week newcomer survival packs',
  'Print-ready PDF (US Letter & A4)',
  'Picture support on every worksheet',
  'Free K sample pack available',
]

const faqs = [
  {
    question: 'What grade and age are these kindergarten ESL worksheets for?',
    answer:
      'Our kindergarten ESL worksheets target ages 5-6 (K). The vocabulary, picture density, and writing demands match what K newcomer and ELL students can handle. We have a separate library of K-2 worksheets for slightly older first and second grade students.',
  },
  {
    question: 'Are the kindergarten ESL worksheets bilingual?',
    answer:
      'Every theme is available in both English-only and English-Spanish bilingual editions. The bilingual edition pairs each English target word with the Spanish translation and a shared illustration — designed specifically for Spanish-speaking newcomer students at WIDA proficiency Level 1.',
  },
  {
    question: 'Can I use these worksheets for non-Spanish-speaking ELL students?',
    answer:
      'Yes. The English-only edition works for any ELL student because the picture support is universal. The visual scaffolds, simple directions, and minimal text make these worksheets effective for newcomers from any home language.',
  },
  {
    question: 'How many worksheets do I get per theme?',
    answer:
      'Each themed kindergarten ESL pack includes 8-12 worksheets: vocabulary cards (4-6 sets), a matching worksheet, a tracing worksheet, a fill-in-the-blank worksheet, a sorting worksheet, a foldable mini-book, and an answer key — bilingual options included.',
  },
  {
    question: 'Are there free kindergarten ESL worksheets I can try?',
    answer:
      'Yes. Our free kindergarten ESL sample pack includes 5 themed worksheets (classroom objects, colors, numbers, family, and feelings) plus 1 mini-book. Perfect for a teacher who wants to test the format before purchasing a full theme pack.',
  },
  {
    question: 'Do I need an interactive whiteboard or just printables?',
    answer:
      'Just printables. Every kindergarten ESL worksheet is designed for print-and-use — no digital tools required. Most teachers print on regular paper, but cardstock + lamination extends the lifespan and makes the worksheets reusable for centers and stations.',
  },
]

const relatedLinks = [
  { href: '/esl-activities-kindergarten', label: 'ESL Activities for Kindergarten' },
  { href: '/esl-worksheets-beginners', label: 'ESL Worksheets for Beginners' },
  { href: '/vocabulary-worksheets', label: 'Vocabulary Worksheets' },
  { href: '/newcomer-activities', label: 'Newcomer Activities' },
]

export default function KindergartenEslWorksheetsPage() {
  return (
    <ClusterPageLayout
      breadcrumbLabel="Kindergarten ESL Worksheets"
      canonicalPath={CANONICAL_PATH}
      badge={{ icon: GraduationCap, text: '12+ Themed Packs · K (Ages 5-6)' }}
      h1="Kindergarten ESL Worksheets for Newcomer & ELL Students"
      intro="Print-ready kindergarten ESL worksheets designed for the unique needs of K teachers and their newcomer or ELL students. Every kindergarten ESL worksheet pairs heavy picture support with minimal text, simple directions, and a clear path from recognition to production. Available in English-only and bilingual English-Spanish editions, our 12+ themed kindergarten ESL packs cover classroom objects, family, food, body parts, colors, numbers, shapes, feelings, animals, weather, action verbs, and greetings — everything a K teacher needs for their first year with newcomer students."
      primaryCta={{ href: '/shop?type=vocabulary_pack&grade=k-2', label: 'Browse Kindergarten ESL Packs', icon: Download }}
      secondaryCta={{ href: '/free-samples', label: 'Get Free K Samples' }}
      faqs={faqs}
      relatedLinks={relatedLinks}
    >
      {/* H2 #1: What Makes a Good Kindergarten ESL Worksheet */}
      <ClusterSection alt>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          What Makes a Good Kindergarten ESL Worksheet?
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          Most ESL worksheets aren&apos;t designed for kindergarteners. They have too much text, too few pictures, and
          assume reading skills the student doesn&apos;t have yet. A great kindergarten ESL worksheet is fundamentally
          different — it&apos;s built for a 5- or 6-year-old who is still learning to recognize letters, may not
          read in any language yet, and needs heavy visual scaffolding. Here are the six characteristics that separate
          a good kindergarten ESL worksheet from a mediocre one:
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
          For full criteria, read{' '}
          <Link href="/teaching-tips/choose-esl-worksheets-kindergarten-ell" className="text-primary hover:underline">
            how to choose ESL worksheets for kindergarten ELLs
          </Link>
          .
        </p>
      </ClusterSection>

      {/* H2 #2: Worksheets by Theme */}
      <ClusterSection>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Worksheets by Theme: Classroom, Family, Food, and More
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-8">
          Our kindergarten ESL worksheets are organized by 12 themes — each addressing a distinct vocabulary domain
          K students need. Every theme pack includes vocabulary cards, a matching worksheet, a tracing worksheet, a
          fill-in-the-blank worksheet, a sorting worksheet, a mini-book, and an answer key.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {themeWorksheets.map((t) => (
            <div key={t.theme} className="clay-card p-5">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <h3 className="font-heading text-base font-semibold text-text-primary">{t.theme}</h3>
              </div>
              <p className="text-sm text-text-primary/70">{t.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-text-primary/80 leading-relaxed mt-6">
          For 30 hand-picked recommendations, read{' '}
          <Link href="/teaching-tips/30-best-kindergarten-esl-worksheets" className="text-primary hover:underline">
            30 best kindergarten ESL worksheets for newcomers
          </Link>
          .
        </p>
      </ClusterSection>

      {/* H2 #3: Bilingual Options */}
      <ClusterSection alt>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Bilingual (English-Spanish) Kindergarten ESL Worksheets
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          For Spanish-speaking newcomer students, bilingual kindergarten ESL worksheets dramatically reduce the
          affective filter and accelerate vocabulary acquisition. Research shows that K newcomer students engage 3x
          faster with bilingual worksheets than with English-only worksheets in their first 90 days of US schooling.
        </p>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          Every kindergarten ESL theme is available in a bilingual English-Spanish edition. The bilingual editions
          include side-by-side English-Spanish vocabulary cards, picture support on every worksheet, home-language
          sentence frames, and a bilingual mini-book so students can read in either language.
        </p>
        <p className="text-text-primary/80 leading-relaxed">
          Browse our complete{' '}
          <Link href="/dual-language-classroom" className="text-primary hover:underline">
            dual language classroom
          </Link>{' '}
          collection and{' '}
          <Link href="/bilingual-flashcards" className="text-primary hover:underline">
            bilingual flashcards
          </Link>{' '}
          for K students.
        </p>
      </ClusterSection>

      {/* H2 #4: First-Week Newcomer Worksheets */}
      <ClusterSection>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          First-Week Kindergarten ESL Worksheets for Newcomers
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-8">
          The first week with a newcomer student is critical. Get it right and the student opens up; get it wrong
          and you spend months recovering. Our first-week kindergarten ESL pack provides a structured Day 1 - Day 5
          worksheet sequence specifically for K newcomers:
        </p>
        <div className="space-y-4">
          {firstWeekWorksheets.map((w) => (
            <div key={w.day} className="clay-card p-5">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-heading font-bold">
                    {w.day.replace('Day ', '')}
                  </span>
                </div>
                <div>
                  <h3 className="font-heading text-base font-semibold text-text-primary mb-1">
                    {w.day}: {w.title}
                  </h3>
                  <p className="text-sm text-text-primary/70">{w.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-text-primary/80 leading-relaxed mt-6">
          For a complete kindergarten ESL lesson plan template, read{' '}
          <Link href="/teaching-tips/kindergarten-esl-lesson-plan-templates" className="text-primary hover:underline">
            kindergarten ESL lesson plan templates
          </Link>
          .
        </p>
      </ClusterSection>

      {/* H2 #5: Daily Use & Centers */}
      <ClusterSection alt>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          How to Use Kindergarten ESL Worksheets in Daily Routines
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          Kindergarten ESL worksheets work best when integrated into existing daily routines — not added on top.
          Here&apos;s a typical K teacher schedule with worksheet integration:
        </p>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="clay-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="font-heading text-lg font-semibold text-text-primary">Morning Meeting</h3>
            </div>
            <p className="text-sm text-text-primary/70">
              Display feelings cards. Each student picks how they feel. Use the matching worksheet later as practice.
              Builds emotional regulation + vocabulary.
            </p>
          </div>
          <div className="clay-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="font-heading text-lg font-semibold text-text-primary">Centers (Daily 5)</h3>
            </div>
            <p className="text-sm text-text-primary/70">
              ESL worksheets fit naturally into Word Work and Listen to Reading centers. Pair vocabulary cards with
              matching worksheets and mini-books.
            </p>
          </div>
          <div className="clay-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-heading text-lg font-semibold text-text-primary">Read-Aloud Follow-Up</h3>
            </div>
            <p className="text-sm text-text-primary/70">
              After a themed read-aloud (a book about animals, family, etc.), use the matching theme&apos;s ESL
              worksheet for vocabulary reinforcement.
            </p>
          </div>
          <div className="clay-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-primary" />
              <h3 className="font-heading text-lg font-semibold text-text-primary">Take-Home Folder</h3>
            </div>
            <p className="text-sm text-text-primary/70">
              Send home one tracing worksheet + a mini-book each Friday. Bilingual editions help families participate
              in their home language.
            </p>
          </div>
        </div>
      </ClusterSection>

      {/* H2 #6: Free Sample + Newsletter */}
      <ClusterSection>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Free Kindergarten ESL Worksheets You Can Print Today
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          Start with our free kindergarten ESL sample pack. The download includes 5 themed worksheets (classroom
          objects, colors, numbers 1-10, family, and feelings) plus 1 foldable mini-book — designed specifically for
          K newcomer students. Print, cut, and use during this week&apos;s centers.
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
            <Download className="w-5 h-5" /> Get Free K ESL Samples
          </Link>
        </div>
        <p className="text-sm text-text-primary/70 mb-6 text-center">
          Looking for activity ideas instead of worksheets? See our{' '}
          <Link href="/teaching-tips/free-kindergarten-esl-worksheets" className="text-primary hover:underline">
            curated list of free kindergarten ESL worksheets
          </Link>{' '}
          across the web, plus{' '}
          <Link href="/esl-activities-kindergarten" className="text-primary hover:underline">
            ESL activities for kindergarten
          </Link>
          .
        </p>
        <div className="max-w-md mx-auto">
          <p className="text-sm text-text-primary/70 mb-3 text-center">
            Get weekly K teacher tips and new themed worksheet sets to your inbox:
          </p>
          <EmailCapture />
        </div>
      </ClusterSection>
    </ClusterPageLayout>
  )
}
