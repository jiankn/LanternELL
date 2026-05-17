import Link from 'next/link'
import type { Metadata } from 'next'
import { Globe, Download, CheckCircle, Users, BookOpen, Home, GraduationCap } from 'lucide-react'
import { ClusterPageLayout, ClusterSection } from '@/components/seo/ClusterPageLayout'
import { EmailCapture } from '@/components/ui/email-capture'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lanternell.com'
const CANONICAL_PATH = '/dual-language-classroom'

export const metadata: Metadata = {
  title: 'Dual Language Classroom — Spanish-English K-8',
  description:
    'Print-ready Spanish-English dual language classroom resources for K-8: bilingual labels, vocabulary cards, sentence frames & parent letters.',
  keywords: [
    'dual language classroom',
    'dual language resources',
    'spanish english classroom',
    'bilingual classroom resources',
    'dual language teaching materials',
    'dual language program',
    'two-way immersion classroom',
    'dual language classroom setup',
  ],
  alternates: { canonical: CANONICAL_PATH },
  openGraph: {
    title: 'Dual Language Classroom Resources — Spanish-English for K-8',
    description:
      'Print-ready dual language classroom resources for Spanish-English programs. Labels, vocabulary, sentence frames, parent communication.',
    url: `${BASE_URL}${CANONICAL_PATH}`,
    images: [
      {
        url: `${BASE_URL}/images/og-dual-language.webp`,
        width: 1200,
        height: 630,
        alt: 'Dual Language Classroom Resources for Spanish-English Teachers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dual Language Classroom Resources — Spanish-English for K-8',
    description:
      'Print-ready dual language classroom resources for Spanish-English programs.',
    images: [`${BASE_URL}/images/og-dual-language.webp`],
  },
  robots: { index: true, follow: true },
}

const programModels = [
  {
    title: 'One-Way (50/50)',
    desc: 'All students share one home language (often Spanish) and learn the second language alongside it. Instruction split equally.',
  },
  {
    title: 'Two-Way Immersion',
    desc: 'Half native English speakers, half native Spanish speakers. Both groups become bilingual together.',
  },
  {
    title: '90/10 Immersion',
    desc: 'Early grades start 90% in Spanish, gradually shifting toward 50/50 by grade 4-5. Common in K-2.',
  },
  {
    title: 'Maintenance Bilingual',
    desc: 'Built to maintain and develop literacy in the home language while adding English. Often used in heritage programs.',
  },
]

const resourceCategories = [
  {
    icon: BookOpen,
    title: 'Bilingual Vocabulary Cards',
    desc: 'Themed English-Spanish picture cards for 25+ topics. Print, laminate, use across centers, word walls, and home-school bridges.',
    href: '/english-spanish-printables',
  },
  {
    icon: Users,
    title: 'Bilingual Classroom Labels',
    desc: 'Furniture, supplies, areas, and daily routines labeled in English-Spanish. Make every object a vocabulary lesson.',
    href: '/bilingual-classroom-labels',
  },
  {
    icon: GraduationCap,
    title: 'Sentence Frames & Writing',
    desc: 'Bilingual sentence starters for speaking, writing, and academic discussion. K-2, 3-5, and 6-8 grade bands.',
    href: '/shop?type=sentence_frames',
  },
  {
    icon: Home,
    title: 'Parent Communication',
    desc: 'Welcome letters, homework notes, and progress reports in English and Spanish. Ready to send home this week.',
    href: '/shop?type=parent_communication',
  },
]

const setupTips = [
  {
    grade: 'K-2 Setup',
    desc: 'Start with bilingual labels on every visible object, a visual schedule with both languages, and 6-10 themed vocabulary cards introduced weekly.',
  },
  {
    grade: '3-5 Setup',
    desc: 'Add academic vocabulary walls by subject, bilingual sentence frames for math/science talk, and bilingual graphic organizers for writing.',
  },
  {
    grade: '6-8 Setup',
    desc: 'Focus on academic discourse: literary analysis frames, research citation supports, and cross-language transfer activities for cognates.',
  },
]

const benefits = [
  'Print-ready PDF (US Letter & A4)',
  'Aligned to dual language program standards',
  'Free sample resources available',
  'Color and black & white options',
  'Covers K-2, 3-5, and 6-8 grade bands',
  'Designed by ELL & bilingual educators',
]

const faqs = [
  {
    question: "What's the difference between a dual language classroom and a bilingual classroom?",
    answer:
      "A dual language classroom is designed for students to become fully bilingual and biliterate in two languages by the end of the program — both languages are used for academic instruction throughout the day. A bilingual classroom often refers to transitional bilingual programs where the home language is used as a bridge to English, with the goal of eventually transitioning students fully into English-only instruction. Dual language programs maintain both languages long-term; transitional bilingual programs phase out the home language.",
  },
  {
    question: "Which dual language model is best for newcomer students?",
    answer:
      "Two-way immersion models work well for newcomer students because they include native speakers of both languages, creating natural peer language models. The 90/10 model is also strong for newcomers in K-2 because it provides extensive support in the home language during the most vulnerable early-school years. The best model depends on your district's student population — but in all models, newcomers benefit from bilingual visual supports, sentence frames, and structured peer interaction.",
  },
  {
    question: "Do I need to be fully bilingual to teach in a dual language classroom?",
    answer:
      "It depends on your program's structure. In single-teacher models, you typically need strong proficiency in both languages. In team-teaching or partner-teacher models, one teacher delivers instruction in English and a partner teacher delivers instruction in the target language — so each teacher only needs to be proficient in one language. Many programs also include paraprofessionals or pull-out bilingual specialists who provide additional support.",
  },
  {
    question: "What materials do I need to start a dual language classroom?",
    answer:
      "Start with these five categories: (1) Bilingual classroom labels — for furniture, supplies, and routines; (2) Bilingual vocabulary cards — themed sets for word walls and centers; (3) Sentence frames in both languages — for speaking and writing scaffolds; (4) Parent communication templates — welcome letters, homework notes, behavior notes in both languages; (5) Visual schedules — so students can predict transitions. LanternELL packs cover all five categories for English-Spanish dual language programs.",
  },
  {
    question: "How do you assess student progress in a dual language classroom?",
    answer:
      "Dual language programs typically assess in both languages, separately and side-by-side. Common tools include WIDA ACCESS for English proficiency, AVANT STAMP or Spanish AAPPL for target-language proficiency, and ongoing classroom-based formative assessments (running records, writing samples, oral language rubrics) in both languages. The goal is to track growth in each language independently while watching for cross-linguistic transfer.",
  },
  {
    question: "Can I use English-Spanish dual language resources in an ESL or newcomer classroom?",
    answer:
      "Yes. Resources designed for dual language classrooms are excellent in ESL/ELL and newcomer settings because they're already bilingual and visual. The same bilingual vocabulary cards, sentence frames, and parent communication templates that work in a dual language program also work in a traditional ESL pull-out, push-in, or sheltered content classroom. The bilingual format helps newcomers connect new English vocabulary to known Spanish concepts.",
  },
]

const relatedLinks = [
  { href: '/english-spanish-printables', label: 'English-Spanish Printables' },
  { href: '/bilingual-classroom-labels', label: 'Bilingual Classroom Labels' },
  { href: '/ell-worksheets', label: 'ELL Worksheets' },
  { href: '/newcomer-activities', label: 'Newcomer Activities' },
]

export default function DualLanguageClassroomPage() {
  return (
    <ClusterPageLayout
      breadcrumbLabel="Dual Language Classroom"
      canonicalPath={CANONICAL_PATH}
      badge={{ icon: Globe, text: 'Spanish-English K-8' }}
      h1="Dual Language Classroom Resources & Bilingual Teaching Tools"
      intro="Build a thriving dual language classroom with print-ready Spanish-English resources designed for K-8 teachers. Whether you run a two-way immersion, 90/10, or 50/50 model, our bilingual vocabulary cards, classroom labels, sentence frames, and parent communication templates give you everything you need to support biliteracy in real classrooms. Designed by ELL and bilingual educators, every dual language classroom pack is print-and-go — no prep, no scrambling, just teaching."
      primaryCta={{ href: '/shop', label: 'Browse Bilingual Packs', icon: Download }}
      secondaryCta={{ href: '/english-spanish-printables', label: 'See English-Spanish Printables' }}
      faqs={faqs}
      relatedLinks={relatedLinks}
    >
      {/* H2 #1: What Is a Dual Language Classroom */}
      <ClusterSection alt>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          What Is a Dual Language Classroom?
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          A dual language classroom is one where academic content is taught in two languages — most commonly English
          and Spanish in the US — with the explicit goal of helping students become fully bilingual and biliterate.
          Unlike traditional ESL programs that view the home language as a temporary bridge, dual language programs
          treat both languages as long-term assets and develop them in parallel through grade 5, 8, or even 12.
        </p>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          Students in a dual language classroom rotate between languages on a structured schedule: a 50/50 model
          splits each day evenly, a 90/10 model starts with 90% target-language instruction in Kindergarten and
          gradually balances out by grade 4-5, and two-way immersion programs intentionally mix native speakers of
          both languages so peers become language models for each other. The result, when implemented well, is
          students who read, write, and think academically in two languages by middle school.
        </p>
        <p className="text-text-primary/80 leading-relaxed">
          For practical setup ideas, see our guide on{' '}
          <Link href="/teaching-tips/set-up-dual-language-classroom-guide" className="text-primary hover:underline">
            how to set up a dual language classroom step-by-step
          </Link>
          .
        </p>
      </ClusterSection>

      {/* H2 #2: Dual Language vs Bilingual vs ESL */}
      <ClusterSection>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Dual Language vs Bilingual vs ESL: Key Differences
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          The terms &quot;dual language,&quot; &quot;bilingual,&quot; and &quot;ESL&quot; are often used
          interchangeably in casual conversation, but they describe meaningfully different programs. Knowing the
          difference helps you choose resources that actually fit your classroom model.
        </p>
        <ul className="space-y-3 mb-6 text-text-primary/80">
          <li>
            <strong className="text-text-primary">Dual language (DL):</strong> Both languages used as media of
            instruction long-term. Goal: full biliteracy. Both native English and native target-language speakers
            benefit. Resources need to be balanced in both languages.
          </li>
          <li>
            <strong className="text-text-primary">Transitional bilingual:</strong> Home language used short-term to
            bridge into English-only instruction (typically 1-3 years). Goal: English proficiency. Resources
            emphasize gradual English transition.
          </li>
          <li>
            <strong className="text-text-primary">ESL / ELD:</strong> English is the only medium of instruction.
            Targeted English Language Development pull-out or push-in support for English Learners. Goal: English
            proficiency. Resources are English-first, often with home-language scaffolds for newcomers.
          </li>
        </ul>
        <p className="text-text-primary/80 leading-relaxed">
          The good news: bilingual resources designed for dual language programs also work in ESL/ELD settings, since
          they provide native-language support that helps newcomers bridge into English. See our{' '}
          <Link href="/teaching-tips/dual-language-vs-bilingual-classroom" className="text-primary hover:underline">
            dual language vs bilingual classroom breakdown
          </Link>{' '}
          for more.
        </p>
      </ClusterSection>

      {/* H2 #3: Essential Resources for Spanish-English Programs */}
      <ClusterSection alt>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Essential Resources for Spanish-English Programs
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-8">
          Effective dual language classrooms run on four pillars of bilingual print resources. Start with these four
          categories — they cover 80% of what teachers actually use day to day.
        </p>
        <div className="grid sm:grid-cols-2 gap-6">
          {resourceCategories.map((cat) => (
            <Link key={cat.title} href={cat.href} className="clay-card p-6 hover:shadow-clay-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <cat.icon className="w-5 h-5 text-primary" />
                <h3 className="font-heading text-lg font-semibold text-text-primary">{cat.title}</h3>
              </div>
              <p className="text-sm text-text-primary/70">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </ClusterSection>

      {/* H2 #4: Setting Up Your Dual Language Classroom */}
      <ClusterSection>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Setting Up Your Dual Language Classroom (K-2 / 3-5 / 6-8)
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          A dual language classroom looks different across grade bands. Early grades need maximum visual support and
          environmental print, while upper grades need academic vocabulary scaffolds and discipline-specific sentence
          frames. Here&apos;s what to prioritize at each level:
        </p>
        <div className="space-y-4 mb-6">
          {setupTips.map((tip) => (
            <div key={tip.grade} className="clay-card p-5">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-heading text-lg font-semibold text-text-primary mb-1">{tip.grade}</h3>
                  <p className="text-text-primary/70">{tip.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-text-primary/80 leading-relaxed">
          For 10 specific teaching moves you can use this week, read our{' '}
          <Link href="/teaching-tips/dual-language-teaching-strategies-k5" className="text-primary hover:underline">
            top dual language teaching strategies for K-5
          </Link>{' '}
          guide.
        </p>
      </ClusterSection>

      {/* H2 #5: Program Models Compared */}
      <ClusterSection alt>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Dual Language Program Models Compared
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-8">
          Not all dual language classrooms run on the same model. Your district&apos;s choice affects how you allocate
          instructional minutes, which language you teach which subject in, and how you balance materials.
        </p>
        <div className="grid sm:grid-cols-2 gap-6">
          {programModels.map((model) => (
            <div key={model.title} className="clay-card p-6">
              <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">{model.title}</h3>
              <p className="text-sm text-text-primary/70">{model.desc}</p>
            </div>
          ))}
        </div>
      </ClusterSection>

      {/* H2 #6: Family & Parent Engagement */}
      <ClusterSection>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Family & Parent Engagement in Dual Language
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          Dual language programs depend on family buy-in. Parents who don&apos;t see their language valued at school
          disengage; parents who see Spanish or English communication treated as equal become long-term partners. The
          single highest-leverage thing you can do as a dual language classroom teacher is make sure every home
          communication goes home in both languages — every welcome letter, every homework note, every progress
          report.
        </p>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          Our bilingual parent communication packs provide ready-to-edit templates so you don&apos;t have to scramble
          to translate every note. Welcome letters, homework reminders, behavior notes, supply requests, and progress
          reports — all bilingual, all editable, all designed for real dual language classrooms.
        </p>
        <p className="text-text-primary/80 leading-relaxed">
          For free templates and example phrases, read our{' '}
          <Link href="/teaching-tips/ell-parent-communication-templates-guide" className="text-primary hover:underline">
            ELL parent communication templates guide
          </Link>
          .
        </p>
      </ClusterSection>

      {/* H2 #7: Free Sample Pack & Download */}
      <ClusterSection alt>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Free Dual Language Classroom Resources
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          Start with our free sample pack to see what print-ready dual language classroom resources look like in
          practice. The free pack includes a starter set of bilingual vocabulary cards, classroom labels, and one
          parent welcome letter — enough to use this week.
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
            <Download className="w-5 h-5" /> Get Free Sample Pack
          </Link>
        </div>
        <div className="max-w-md mx-auto">
          <p className="text-sm text-text-primary/70 mb-3 text-center">
            Or get weekly bilingual teaching resources to your inbox:
          </p>
          <EmailCapture />
        </div>
      </ClusterSection>
    </ClusterPageLayout>
  )
}
