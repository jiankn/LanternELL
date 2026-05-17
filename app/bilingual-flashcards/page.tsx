import Link from 'next/link'
import type { Metadata } from 'next'
import { Layers, Download, CheckCircle, Sparkles, Brain, Scissors, Gift } from 'lucide-react'
import { ClusterPageLayout, ClusterSection } from '@/components/seo/ClusterPageLayout'
import { EmailCapture } from '@/components/ui/email-capture'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lanternell.com'
const CANONICAL_PATH = '/bilingual-flashcards'

export const metadata: Metadata = {
  title: 'Bilingual Flashcards — English-Spanish Printable',
  description:
    'Print-ready bilingual flashcards in English-Spanish. 12+ themed sets for K-8 ELL & dual language classrooms. Picture-supported with free samples.',
  keywords: [
    'bilingual flashcards',
    'english spanish flashcards',
    'printable bilingual flashcards',
    'esl bilingual flashcards',
    'dual language flashcards',
    'bilingual vocabulary cards',
    'bilingual flashcards k-2',
    'free bilingual flashcards',
  ],
  alternates: { canonical: CANONICAL_PATH },
  openGraph: {
    title: 'Bilingual Flashcards — English-Spanish Printable for K-8',
    description:
      'Print-ready bilingual flashcards in English-Spanish. 12+ themed sets for ELL and dual language classrooms.',
    url: `${BASE_URL}${CANONICAL_PATH}`,
    images: [
      {
        url: `${BASE_URL}/images/og-bilingual-flashcards.webp`,
        width: 1200,
        height: 630,
        alt: 'Bilingual Flashcards English-Spanish for K-8 ELL Classrooms',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bilingual Flashcards — English-Spanish Printable for K-8',
    description:
      'Print-ready bilingual flashcards in English-Spanish. 12+ themed sets, picture-supported.',
    images: [`${BASE_URL}/images/og-bilingual-flashcards.webp`],
  },
  robots: { index: true, follow: true },
}

const themeSets = [
  { theme: 'Classroom Objects', count: '40 cards', desc: 'Pencil, book, chair, desk, eraser, scissors — every essential classroom item with picture support.' },
  { theme: 'Family Members', count: '24 cards', desc: 'Mom, dad, brother, sister, grandma, grandpa, aunt, uncle, cousin — extended family included.' },
  { theme: 'Body Parts', count: '32 cards', desc: 'Head, shoulders, arms, hands, fingers, legs, knees, feet, toes, internal organs.' },
  { theme: 'Food & Drinks', count: '50 cards', desc: 'Fruits, vegetables, grains, dairy, drinks, common meals — fully bilingual.' },
  { theme: 'Animals', count: '40 cards', desc: 'Farm, zoo, ocean, pet, and forest animals with English-Spanish labels.' },
  { theme: 'Colors & Numbers', count: '36 cards', desc: '12 colors + numbers 1-20 with numerals, words, and counting pictures.' },
  { theme: 'Feelings & Emotions', count: '24 cards', desc: 'Happy, sad, tired, excited, angry, scared, surprised — with bilingual sentence frames.' },
  { theme: 'Action Verbs', count: '40 cards', desc: 'Run, jump, eat, sleep, read, write — most-used K-2 verbs in present tense.' },
  { theme: 'Weather & Seasons', count: '20 cards', desc: 'Sun, rain, snow, wind, clouds + four seasons with vocabulary.' },
  { theme: 'Clothes & Accessories', count: '28 cards', desc: 'Shirt, pants, dress, jacket, shoes, hat, gloves, socks — for daily routines.' },
  { theme: 'Transportation', count: '24 cards', desc: 'Car, bus, bike, plane, boat, train + community vehicles.' },
  { theme: 'Places in Community', count: '30 cards', desc: 'School, hospital, park, store, library, post office — with bilingual signs.' },
]

const whyWorks = [
  {
    title: 'Activates Both Languages Simultaneously',
    desc: 'When a student sees "manzana / apple" with the same picture, both vocabulary networks fire — research shows this dual activation accelerates retention by 40% over English-only flashcards.',
  },
  {
    title: 'Reduces Affective Filter for Newcomers',
    desc: 'Seeing their home language on the card lowers anxiety. Newcomer students engage 3x faster when bilingual flashcards include Spanish than when given English-only cards.',
  },
  {
    title: 'Builds Cognate Awareness',
    desc: 'Spanish-English bilingual flashcards expose hundreds of cognates (familia/family, animal/animal, hospital/hospital). Students start noticing patterns and learn faster across all subjects.',
  },
  {
    title: 'Supports Bidirectional Learning',
    desc: 'Bilingual flashcards work for both Spanish-speaking ELLs learning English AND English-speaking students learning Spanish (dual language programs). Same cards, two audiences.',
  },
]

const centerActivities = [
  { name: 'Memory Match', desc: 'Print 2 copies, lay face-down, match pairs. Builds recognition.' },
  { name: 'Pictionary', desc: 'Student draws the word, others guess in either language.' },
  { name: 'Sort by Category', desc: 'Sort animals into farm/zoo/pet, foods into fruit/vegetable/grain.' },
  { name: 'Sentence Frames', desc: 'Pair flashcard with sentence frame: "I see a ___."' },
  { name: 'Bingo', desc: 'Use 9 cards on a bingo board, call words in English or Spanish.' },
  { name: 'Speed Round', desc: 'Time how fast students label all 12 cards in their flexible language.' },
]

const diyVsPrintable = [
  { aspect: 'Time investment', diy: '4-8 hours per theme set', printable: 'Print-and-cut, ~15 minutes' },
  { aspect: 'Visual quality', diy: 'Variable, depends on artist', printable: 'Consistent, professional illustrations' },
  { aspect: 'Bilingual accuracy', diy: 'Risk of translation errors', printable: 'Native-Spanish reviewed' },
  { aspect: 'Durability', diy: 'Hand-drawn, prone to wear', printable: 'High-resolution PDF, laminate-ready' },
  { aspect: 'Cost per set', diy: '$15-30 in materials + time', printable: '$3.99 per pack' },
  { aspect: 'Scalability', diy: 'Limited themes', printable: '12+ themes available' },
]

const benefits = [
  '12+ themed bilingual flashcard sets',
  'English-Spanish on every card',
  'Print-ready PDF (US Letter & A4)',
  'Picture support on every card',
  'Suggestion sentence frames included',
  'Free sample pack available',
]

const faqs = [
  {
    question: 'What grades are these bilingual flashcards for?',
    answer:
      'Our bilingual flashcards span Kindergarten through 8th grade. K-2 sets focus on Tier 1 high-frequency vocabulary (classroom, family, food, body parts, colors). 3-5 sets add cross-curricular vocabulary (math, science, social studies). 6-8 sets emphasize academic Tier 3 vocabulary tied to content areas.',
  },
  {
    question: 'Are the bilingual flashcards English-Spanish or other languages?',
    answer:
      'Currently all bilingual flashcards are English-Spanish, since Spanish is the home language of the majority of US ELL students. We are planning English-Mandarin and English-Vietnamese sets in 2026 based on US ELL demographic data.',
  },
  {
    question: 'How are bilingual flashcards different from regular vocabulary cards?',
    answer:
      'Bilingual flashcards display the target word in both English and Spanish on the same card, with one shared illustration. Regular vocabulary cards are typically monolingual. Bilingual flashcards reduce the cognitive load for newcomer ELLs and accelerate vocabulary acquisition by leveraging the home language as a bridge.',
  },
  {
    question: 'Can I use bilingual flashcards for English-speaking students learning Spanish?',
    answer:
      'Absolutely. Bilingual flashcards are bidirectional — Spanish-speaking ELLs use them to learn English, and English-speaking students use them to learn Spanish. Dual language programs (50/50 or 90/10 models) rely heavily on bilingual flashcards because they serve both populations of students at once.',
  },
  {
    question: 'How do I store and organize bilingual flashcards?',
    answer:
      'Print on cardstock, laminate for durability, and store in labeled snack-size bags or index card boxes by theme. Most teachers organize by theme (one bag per topic) and store all bags in a single bin. Hole-punch and put on a binder ring for portable sets.',
  },
  {
    question: 'Are there free bilingual flashcards I can try?',
    answer:
      'Yes. Our free sample pack includes 5 themed bilingual flashcard sets (classroom objects, colors, numbers, family members, feelings) — about 60 cards total. Use the email capture below to download.',
  },
]

const relatedLinks = [
  { href: '/spanish-flashcards', label: 'Spanish Flashcards' },
  { href: '/english-spanish-printables', label: 'English-Spanish Printables' },
  { href: '/vocabulary-worksheets', label: 'Vocabulary Worksheets' },
  { href: '/dual-language-classroom', label: 'Dual Language Classroom' },
]

export default function BilingualFlashcardsPage() {
  return (
    <ClusterPageLayout
      breadcrumbLabel="Bilingual Flashcards"
      canonicalPath={CANONICAL_PATH}
      badge={{ icon: Layers, text: '12+ Themed Sets · K-8 · EN-ES' }}
      h1="Bilingual Flashcards for K-8 Classrooms"
      intro="Print-ready bilingual flashcards in English-Spanish, designed for ELL and dual language classrooms across K-8. Each card pairs the target word in both languages with a single shared illustration, so students activate both vocabulary networks at once. Our 12+ bilingual flashcard sets cover classroom objects, family, food, body parts, animals, feelings, action verbs, and academic vocabulary — all native-Spanish reviewed and ready to print, cut, and laminate today."
      primaryCta={{ href: '/shop?type=vocabulary_pack&language=en-es', label: 'Browse Bilingual Flashcards', icon: Download }}
      secondaryCta={{ href: '/free-samples', label: 'Get Free Samples' }}
      faqs={faqs}
      relatedLinks={relatedLinks}
    >
      {/* H2 #1: Why Bilingual Flashcards Work */}
      <ClusterSection alt>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Why Bilingual Flashcards Work for ELLs
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-8">
          Bilingual flashcards aren&apos;t just translated vocabulary cards. They&apos;re a research-backed instructional
          tool that taps into specific cognitive mechanisms in second-language acquisition. Here&apos;s why bilingual
          flashcards consistently outperform English-only cards for ELL students:
        </p>
        <div className="grid sm:grid-cols-2 gap-6">
          {whyWorks.map((item) => (
            <div key={item.title} className="clay-card p-6">
              <div className="flex items-start gap-3 mb-3">
                <Brain className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <h3 className="font-heading text-lg font-semibold text-text-primary">{item.title}</h3>
              </div>
              <p className="text-sm text-text-primary/70">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-text-primary/80 leading-relaxed mt-6">
          For deeper background, read our guide on{' '}
          <Link href="/teaching-tips/bilingual-vocabulary-cards-classroom-guide" className="text-primary hover:underline">
            bilingual vocabulary cards: a classroom guide
          </Link>
          .
        </p>
      </ClusterSection>

      {/* H2 #2: Themes */}
      <ClusterSection>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Bilingual Flashcards by Theme (12+ Sets)
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-8">
          Our bilingual flashcards are organized by theme, so you can grab the exact set you need for this week&apos;s
          unit. Every set is fully English-Spanish, picture-supported, and includes a teacher guide with sentence
          frames and center activity suggestions.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {themeSets.map((set) => (
            <div key={set.theme} className="clay-card p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-heading text-base font-semibold text-text-primary">{set.theme}</h3>
                <span className="text-xs font-semibold text-primary bg-primary/10 rounded-full px-2 py-0.5">{set.count}</span>
              </div>
              <p className="text-sm text-text-primary/70">{set.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-text-primary/80 leading-relaxed mt-6">
          For a complete list of K-2 essentials, read{' '}
          <Link href="/teaching-tips/50-bilingual-flashcards-k2" className="text-primary hover:underline">
            50 must-have bilingual flashcards for K-2 classrooms
          </Link>
          .
        </p>
      </ClusterSection>

      {/* H2 #3: Center Activities */}
      <ClusterSection alt>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Center & Independent Practice Activities
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-8">
          Bilingual flashcards become exponentially more powerful in centers — students get 12-15 exposures per word
          across the week without needing direct teacher attention. Here are 6 center setups using a single bilingual
          flashcard set:
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {centerActivities.map((act) => (
            <div key={act.name} className="clay-card p-5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="font-heading text-base font-semibold text-text-primary">{act.name}</h3>
              </div>
              <p className="text-sm text-text-primary/70">{act.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-text-primary/80 leading-relaxed mt-6">
          For a full ELL center rotation plan, read{' '}
          <Link href="/teaching-tips/bilingual-flashcards-ell-centers" className="text-primary hover:underline">
            how to use bilingual flashcards in ELL centers
          </Link>
          . For game-format ideas, see{' '}
          <Link href="/teaching-tips/bilingual-flashcard-games-beginners" className="text-primary hover:underline">
            bilingual flashcard games for beginners
          </Link>
          .
        </p>
      </ClusterSection>

      {/* H2 #4: DIY vs Printable */}
      <ClusterSection>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          DIY vs Printable Bilingual Flashcards
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-8">
          Many teachers start by making their own bilingual flashcards. After year one, most switch to
          professionally-designed printable sets. Here&apos;s the honest comparison:
        </p>
        <div className="overflow-hidden rounded-lg border border-text-primary/10">
          <table className="w-full text-sm">
            <thead className="bg-primary/10">
              <tr>
                <th className="text-left p-3 font-heading font-semibold text-text-primary">Aspect</th>
                <th className="text-left p-3 font-heading font-semibold text-text-primary">DIY</th>
                <th className="text-left p-3 font-heading font-semibold text-text-primary">Printable Pack</th>
              </tr>
            </thead>
            <tbody>
              {diyVsPrintable.map((row, i) => (
                <tr key={row.aspect} className={i % 2 === 0 ? 'bg-white' : 'bg-white/60'}>
                  <td className="p-3 font-medium text-text-primary">{row.aspect}</td>
                  <td className="p-3 text-text-primary/70">{row.diy}</td>
                  <td className="p-3 text-text-primary/70">{row.printable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-start gap-3 mt-6 p-4 bg-cta/10 rounded-lg">
          <Scissors className="w-5 h-5 text-cta flex-shrink-0 mt-0.5" />
          <p className="text-sm text-text-primary/80">
            <strong className="text-text-primary">Verdict:</strong> DIY is fine for one-off lessons. For ongoing
            instruction across themes and grade bands, printable packs save 30+ hours of prep per semester and
            deliver more consistent visuals. Try{' '}
            <Link href="/free-samples" className="text-primary hover:underline">
              our free sample
            </Link>{' '}
            to compare directly with your current DIY cards.
          </p>
        </div>
      </ClusterSection>

      {/* H2 #5: Bilingual Flashcards vs Spanish Flashcards */}
      <ClusterSection alt>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Bilingual Flashcards vs Spanish-Only Flashcards
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          A common question: &quot;What&apos;s the difference between bilingual flashcards and{' '}
          <Link href="/spanish-flashcards" className="text-primary hover:underline">
            Spanish flashcards
          </Link>
          ?&quot; The distinction matters depending on your classroom context:
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="clay-card p-6">
            <h3 className="font-heading text-lg font-semibold text-text-primary mb-3">Bilingual Flashcards (this page)</h3>
            <ul className="space-y-2 text-sm text-text-primary/80">
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />Both English + Spanish on each card</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />Best for ELL classrooms with Spanish-speaking newcomers</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />Best for dual language programs (50/50 or 90/10)</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />Bridge-builders for Spanish home-language students</li>
            </ul>
          </div>
          <div className="clay-card p-6">
            <h3 className="font-heading text-lg font-semibold text-text-primary mb-3">Spanish Flashcards</h3>
            <ul className="space-y-2 text-sm text-text-primary/80">
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />Spanish-only on each card (with picture)</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />Best for English-speaking students learning Spanish</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />Best for Spanish FLES (Foreign Language Elementary)</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />Used for immersion contexts where English isn&apos;t needed</li>
            </ul>
          </div>
        </div>
      </ClusterSection>

      {/* H2 #6: Free Sample + Newsletter */}
      <ClusterSection>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Free Bilingual Flashcards You Can Try Today
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          Start with our free bilingual flashcard sample pack. The download includes 5 themed sets — about 60 cards
          total — covering classroom objects, colors, numbers, family members, and feelings. Print, cut, and laminate
          tonight; use them in centers tomorrow morning.
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
            <Gift className="w-5 h-5" /> Get Free Bilingual Flashcards
          </Link>
        </div>
        <div className="max-w-md mx-auto">
          <p className="text-sm text-text-primary/70 mb-3 text-center">
            Or get weekly bilingual teaching tips and new flashcard sets to your inbox:
          </p>
          <EmailCapture />
        </div>
      </ClusterSection>
    </ClusterPageLayout>
  )
}
