import Link from 'next/link'
import type { Metadata } from 'next'
import { Sparkles, Download, CheckCircle, Clock, Users, Hand, Music, Star } from 'lucide-react'
import { ClusterPageLayout, ClusterSection } from '@/components/seo/ClusterPageLayout'
import { EmailCapture } from '@/components/ui/email-capture'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lanternell.com'
const CANONICAL_PATH = '/esl-activities-kindergarten'

export const metadata: Metadata = {
  title: 'ESL Activities for Kindergarten — Hands-On & Print-Free Ideas | LanternELL',
  description:
    'Hands-on ESL activities for kindergarten ELL students. 50+ no-prep & low-prep ideas: 5-min warm-ups, whole-group games, centers, TPR movement, newcomer routines.',
  keywords: [
    'esl activities for kindergarten',
    'esl activities kindergarten',
    'esl kindergarten activities',
    'esl games for kindergarten',
    'kindergarten ell activities',
    'tpr activities kindergarten esl',
    'esl circle time kindergarten',
    'newcomer kindergarten activities',
  ],
  alternates: { canonical: CANONICAL_PATH },
  openGraph: {
    title: 'ESL Activities for Kindergarten — Hands-On & Print-Free Ideas',
    description:
      'Hands-on ESL activities for kindergarten ELL students. 50+ no-prep & low-prep ideas — warm-ups, games, centers, TPR.',
    url: `${BASE_URL}${CANONICAL_PATH}`,
    images: [
      {
        url: `${BASE_URL}/images/og-esl-activities-kindergarten.webp`,
        width: 1200,
        height: 630,
        alt: 'ESL Activities for Kindergarten ELL Students',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ESL Activities for Kindergarten — Hands-On & Print-Free Ideas',
    description: 'Hands-on ESL activities for kindergarten ELL students. 50+ ideas, mostly no-prep.',
    images: [`${BASE_URL}/images/og-esl-activities-kindergarten.webp`],
  },
  robots: { index: true, follow: true },
}

const warmUps = [
  { name: 'Hello Song with Hand Wave', desc: 'Sing "Hello, hello, hello!" while waving. Each student waves back. 2 min.' },
  { name: 'Color of the Day', desc: 'Hold up a color card. Students point to something matching in the room. 3 min.' },
  { name: 'Quick Pictionary', desc: 'Draw a vocabulary word fast. First student to say it (any language) wins. 3 min.' },
  { name: 'Beat the Teacher', desc: 'Show a flashcard. Race the student to say it first. 3 min.' },
  { name: 'Greeting Chain', desc: 'Each student greets the next. "Hello, Maria." "Hello, José." 4 min.' },
]

const wholeGroup = [
  { name: 'Mystery Bag', desc: 'Object hidden in a bag. Students feel and guess. Builds adjective + noun vocab.' },
  { name: 'I Spy (in 2 languages)', desc: '"I spy with my little eye, something blue." First student to point wins.' },
  { name: 'Pass the Picture', desc: 'A picture goes around the circle. Each student says one word about it.' },
  { name: 'Living Word Wall', desc: 'Word wall with cards. Daily helper picks one card and uses it in a sentence.' },
  { name: 'Story Sequencing', desc: 'After read-aloud, students sequence picture cards retelling the story.' },
]

const centers = [
  { name: 'Memory Match', desc: 'Bilingual flashcards face-down. Match pairs while saying both languages.' },
  { name: 'Sort by Category', desc: 'Mix flashcards from 2-3 themes. Students sort into correct piles.' },
  { name: 'Sentence Frame Builder', desc: 'Pick a flashcard. Place on frame strip. Read aloud or write.' },
  { name: 'Bingo with Picture Cards', desc: '3x3 grid filled with picture cards. Caller says word in either language.' },
  { name: 'Mini-Book Reading', desc: 'Foldable mini-book using week\u2019s vocabulary. Students read alone or in pairs.' },
  { name: 'Word Hunt', desc: 'Vocabulary cards hidden in classroom. Students find + return + name them.' },
]

const tpr = [
  { name: 'Simon Says (Action Verbs)', desc: 'Run, jump, stand, sit, clap, dance — students do the action.' },
  { name: 'Body Parts Touch', desc: '"Touch your head!" Students touch the body part. Add speed for challenge.' },
  { name: 'Color Hunt', desc: '"Touch something red!" Students race to a red object in the room.' },
  { name: 'Animal Walk', desc: 'Pretend to walk like elephant, snake, frog. Builds animal vocabulary + motor.' },
  { name: 'Songs with Motion', desc: '"Head, Shoulders, Knees, and Toes," "If You\u2019re Happy and You Know It."' },
]

const newcomerRoutines = [
  { name: 'Buddy Welcome', desc: 'Pair newcomer with a buddy on Day 1. Buddy walks them through routines.' },
  { name: 'Visual Schedule Tour', desc: 'Show day\u2019s picture schedule. Newcomer points to where we are now.' },
  { name: 'Bilingual Survival Cards', desc: 'Lanyard with picture cards: bathroom, water, help, sick. Newcomer uses non-verbally.' },
  { name: 'Silent Period Welcome', desc: 'Allow 4-12 weeks of silent observation. Don\u2019t force English production.' },
  { name: 'Family Photo Page', desc: 'Newcomer brings family photo. Other students ask 3 questions through buddy translator.' },
]

const benefits = [
  '50+ ESL activities organized by use case',
  'No-prep & low-prep options',
  'Multi-modal (movement, song, game, art)',
  'Newcomer-specific routines',
  'Pairs naturally with worksheets',
  'Free K activity guide available',
]

const faqs = [
  {
    question: 'What\u2019s the difference between ESL activities and ESL worksheets for kindergarten?',
    answer:
      'ESL activities are hands-on, verbal, movement-based experiences (games, songs, TPR, circle-time routines). ESL worksheets are pen-and-paper printables (matching, tracing, fill-in-blank). Most successful K teachers use both: activities for vocabulary introduction + engagement, worksheets for practice + assessment. The two complement each other and shouldn\u2019t replace each other.',
  },
  {
    question: 'Are these ESL activities truly no-prep?',
    answer:
      'About 70% require no preparation (warm-ups, TPR, songs). The remaining 30% require minimal prep (vocabulary cards on hand, a basket of objects, a foldable mini-book). We separate "no-prep" vs "low-prep" so you can find what fits your time.',
  },
  {
    question: 'Do these activities work for non-Spanish-speaking ELLs?',
    answer:
      'Yes. The bulk of these activities rely on visuals, movement, songs, and gestures — not Spanish. Bilingual support helps Spanish-speaking newcomers but isn\u2019t required for Mandarin, Vietnamese, Arabic, or other home language students.',
  },
  {
    question: 'How do I integrate these activities with my regular K curriculum?',
    answer:
      'Most activities slot into existing routines: warm-ups during morning meeting, TPR during transitions, centers during literacy block, circle-time activities during read-aloud follow-up. You don\u2019t need separate ESL time — these activities enrich existing time.',
  },
  {
    question: 'What if my newcomer doesn\u2019t talk yet?',
    answer:
      'Honor the silent period (4-12 weeks). Choose activities with non-verbal participation: TPR, sorting, pointing, drawing, movement. Don\u2019t force English production until the student initiates it. The activities still build receptive vocabulary even without verbal output.',
  },
  {
    question: 'Are there free kindergarten ESL activities I can try?',
    answer:
      'Yes. Our free K activity guide includes 10 favorite warm-ups, 5 TPR movement activities, and 5 newcomer-specific routines — all no-prep and ready for tomorrow morning. Email-gated but immediate download.',
  },
]

const relatedLinks = [
  { href: '/kindergarten-esl-worksheets', label: 'Kindergarten ESL Worksheets' },
  { href: '/newcomer-activities', label: 'Newcomer Activities (K-5)' },
  { href: '/bilingual-flashcards', label: 'Bilingual Flashcards' },
  { href: '/visual-supports-ell', label: 'Visual Supports for ELL' },
]

export default function EslActivitiesKindergartenPage() {
  return (
    <ClusterPageLayout
      breadcrumbLabel="ESL Activities for Kindergarten"
      canonicalPath={CANONICAL_PATH}
      badge={{ icon: Sparkles, text: '50+ Activities · No-Prep & Low-Prep · K' }}
      h1="ESL Activities for Kindergarten Classrooms"
      intro="Hands-on ESL activities for kindergarten ELL and newcomer students — designed for K teachers who need engagement, not just worksheets. Our 50+ kindergarten ESL activities are organized by use case (warm-ups, whole-group, centers, movement, newcomer routines), heavily multi-modal (song, gesture, game, art), and mostly no-prep. Every activity activates vocabulary, builds confidence, and respects the silent period for newcomers — so your K ELL students engage even before they\u2019re ready to produce English."
      primaryCta={{ href: '/free-samples', label: 'Get Free K Activity Guide', icon: Download }}
      secondaryCta={{ href: '/kindergarten-esl-worksheets', label: 'Pair with Worksheets' }}
      faqs={faqs}
      relatedLinks={relatedLinks}
    >
      {/* H2 #1 — Activities vs Worksheets disambiguation */}
      <ClusterSection alt>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          ESL Activities vs ESL Worksheets for Kindergarten
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          A common K teacher question: &quot;Should I use{' '}
          <Link href="/kindergarten-esl-worksheets" className="text-primary hover:underline">
            kindergarten ESL worksheets
          </Link>{' '}
          or ESL activities?&quot; The right answer is **both** — they serve different purposes and shouldn&apos;t
          replace each other:
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="clay-card p-6">
            <h3 className="font-heading text-lg font-semibold text-text-primary mb-3">ESL Worksheets</h3>
            <ul className="space-y-2 text-sm text-text-primary/80">
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />Pen-and-paper practice (matching, tracing)</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />Independent or paired work</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />Used for retention + assessment</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />Builds literacy + motor memory</li>
            </ul>
          </div>
          <div className="clay-card p-6 border-2 border-primary/30">
            <h3 className="font-heading text-lg font-semibold text-text-primary mb-3">ESL Activities (this page)</h3>
            <ul className="space-y-2 text-sm text-text-primary/80">
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />Hands-on, verbal, movement-based</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />Whole-group, pairs, centers</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />Used for introduction + engagement</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />Builds oral fluency + confidence</li>
            </ul>
          </div>
        </div>
        <p className="text-text-primary/80 leading-relaxed mt-6">
          Most effective K classrooms run a 60/40 split: 60% activity-based time (this page) and 40% worksheet time
          (the worksheets page). Worksheets without activities = boring drill. Activities without worksheets = no
          retention. Combine both.
        </p>
      </ClusterSection>

      {/* H2 #2 — Why K ESL Needs Activities */}
      <ClusterSection>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Why Kindergarten ESL Needs Activities (Not Just Worksheets)
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          K students are 5- and 6-year-olds. Their brains are wired for play, movement, song, and social interaction
          — not seat work. Research on ESL acquisition consistently shows:
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="flex items-start gap-3"><Star className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" /><span className="text-text-primary/80"><strong>Total Physical Response (TPR)</strong> doubles vocabulary retention vs seated practice (Asher, 1969)</span></div>
          <div className="flex items-start gap-3"><Star className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" /><span className="text-text-primary/80"><strong>Songs and chants</strong> embed vocabulary in long-term memory through prosody</span></div>
          <div className="flex items-start gap-3"><Star className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" /><span className="text-text-primary/80"><strong>Play-based learning</strong> lowers the affective filter (Krashen) for newcomer students</span></div>
          <div className="flex items-start gap-3"><Star className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" /><span className="text-text-primary/80"><strong>Peer interaction</strong> provides comprehensible input that direct instruction can&apos;t match</span></div>
        </div>
        <p className="text-text-primary/80 leading-relaxed">
          Worksheets alone — even great ones — don&apos;t deliver these benefits. The activities below fill the gap.
        </p>
      </ClusterSection>

      {/* H2 #3 — 5-Minute Warm-Ups */}
      <ClusterSection alt>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          5-Minute ESL Warm-Up Activities
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          Quick, energizing, low-prep activities perfect for the start of the day, transitions, or filling 5 minutes
          before lunch. Most need only your voice + flashcards.
        </p>
        <div className="space-y-4">
          {warmUps.map((a) => (
            <div key={a.name} className="clay-card p-5">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-heading text-base font-semibold text-text-primary mb-1">{a.name}</h3>
                  <p className="text-sm text-text-primary/70">{a.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-text-primary/80 leading-relaxed mt-6">
          For 50+ activities including warm-ups, read{' '}
          <Link href="/teaching-tips/50-hands-on-esl-activities-kindergarten" className="text-primary hover:underline">
            50 hands-on ESL activities for kindergarten
          </Link>
          .
        </p>
      </ClusterSection>

      {/* H2 #4 — Whole-Group */}
      <ClusterSection>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Whole-Group ESL Activities for Kindergarten
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          Activities that engage the entire K class together — perfect for circle time, morning meeting, or shared
          read-aloud follow-up.
        </p>
        <div className="space-y-4">
          {wholeGroup.map((a) => (
            <div key={a.name} className="clay-card p-5">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-heading text-base font-semibold text-text-primary mb-1">{a.name}</h3>
                  <p className="text-sm text-text-primary/70">{a.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-text-primary/80 leading-relaxed mt-6">
          For circle-time-specific activities, read{' '}
          <Link href="/teaching-tips/esl-circle-time-activities-kindergarten" className="text-primary hover:underline">
            ESL circle time activities for kindergarten
          </Link>
          .
        </p>
      </ClusterSection>

      {/* H2 #5 — Centers */}
      <ClusterSection alt>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Center & Station ESL Activities for Kindergarten
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          Independent or small-group activities that fit naturally into Daily 5 or center rotations. Most use
          flashcards or small printables you already have.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {centers.map((a) => (
            <div key={a.name} className="clay-card p-5">
              <h3 className="font-heading text-base font-semibold text-text-primary mb-1">{a.name}</h3>
              <p className="text-sm text-text-primary/70">{a.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-text-primary/80 leading-relaxed mt-6">
          For game-specific center activities, read{' '}
          <Link href="/teaching-tips/esl-games-kindergarten-ell" className="text-primary hover:underline">
            ESL games for kindergarten ELL students
          </Link>
          .
        </p>
      </ClusterSection>

      {/* H2 #6 — TPR & Movement */}
      <ClusterSection>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Movement & TPR (Total Physical Response) Activities
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          TPR is the single most research-backed method for kindergarten ESL. Students hear a word + see/do an action
          + repeat. The motor memory trace doubles retention compared to verbal-only instruction.
        </p>
        <div className="space-y-4">
          {tpr.map((a) => (
            <div key={a.name} className="clay-card p-5">
              <div className="flex items-start gap-3">
                <Hand className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-heading text-base font-semibold text-text-primary mb-1">{a.name}</h3>
                  <p className="text-sm text-text-primary/70">{a.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ClusterSection>

      {/* H2 #7 — Newcomer-Specific */}
      <ClusterSection alt>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Newcomer-Specific ESL Activities
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          When you have a brand-new K ELL student arriving Monday, generic ESL activities aren&apos;t enough. These
          newcomer-specific routines respect the silent period, build trust, and create the foundation for everything
          else.
        </p>
        <div className="space-y-4">
          {newcomerRoutines.map((a) => (
            <div key={a.name} className="clay-card p-5">
              <div className="flex items-start gap-3">
                <Music className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-heading text-base font-semibold text-text-primary mb-1">{a.name}</h3>
                  <p className="text-sm text-text-primary/70">{a.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-text-primary/80 leading-relaxed mt-6">
          For Day 1 specific routines, read{' '}
          <Link href="/teaching-tips/first-day-esl-activities-k-newcomers" className="text-primary hover:underline">
            first-day ESL activities for K newcomers
          </Link>
          . For broader newcomer support, see our{' '}
          <Link href="/newcomer-activities" className="text-primary hover:underline">
            newcomer activities
          </Link>{' '}
          page.
        </p>
      </ClusterSection>

      {/* H2 #8 — Free + Newsletter */}
      <ClusterSection>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Free Kindergarten ESL Activity Guide
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          Get a free K ESL activity starter guide: 10 favorite warm-ups, 5 TPR movement activities, and 5 newcomer
          routines — all no-prep, with picture cues, ready for tomorrow morning.
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
            <Download className="w-5 h-5" /> Get Free K Activity Guide
          </Link>
        </div>
        <p className="text-sm text-text-primary/70 mb-6 text-center">
          Activities pair best with{' '}
          <Link href="/kindergarten-esl-worksheets" className="text-primary hover:underline">
            kindergarten ESL worksheets
          </Link>{' '}
          and{' '}
          <Link href="/bilingual-flashcards" className="text-primary hover:underline">
            bilingual flashcards
          </Link>{' '}
          for the full 60/40 split.
        </p>
        <div className="max-w-md mx-auto">
          <p className="text-sm text-text-primary/70 mb-3 text-center">
            Get weekly K ESL activity ideas to your inbox:
          </p>
          <EmailCapture />
        </div>
      </ClusterSection>
    </ClusterPageLayout>
  )
}
