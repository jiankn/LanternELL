import Link from 'next/link'
import type { Metadata } from 'next'
import { Languages, Download, CheckCircle, Home, GraduationCap, Heart } from 'lucide-react'
import { ClusterPageLayout, ClusterSection } from '@/components/seo/ClusterPageLayout'
import { EmailCapture } from '@/components/ui/email-capture'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lanternell.com'
const CANONICAL_PATH = '/spanish-flashcards'

export const metadata: Metadata = {
  title: 'Spanish Flashcards — Print-Ready for Beginners',
  description:
    'Print-ready Spanish flashcards for beginners, kids & homeschool. 12+ themed packs with picture support, native-Spanish reviewed, K-8 friendly.',
  keywords: [
    'spanish flashcards',
    'spanish flashcards for beginners',
    'spanish flashcards for kids',
    'spanish flashcards printable',
    'spanish flashcards pdf',
    'spanish vocabulary flashcards',
    'spanish flashcards by theme',
    'free spanish flashcards',
  ],
  alternates: { canonical: CANONICAL_PATH },
  openGraph: {
    title: 'Spanish Flashcards — Print-Ready for Beginners, Kids & Homeschool',
    description:
      'Print-ready Spanish flashcards for beginners, kids, homeschool. 12+ themed packs, picture support, native-Spanish reviewed.',
    url: `${BASE_URL}${CANONICAL_PATH}`,
    images: [
      {
        url: `${BASE_URL}/images/og-spanish-flashcards.webp`,
        width: 1200,
        height: 630,
        alt: 'Spanish Flashcards for Beginners and Kids',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Spanish Flashcards — Print-Ready for Beginners, Kids & Homeschool',
    description: 'Print-ready Spanish flashcards. 12+ themed packs, picture support.',
    images: [`${BASE_URL}/images/og-spanish-flashcards.webp`],
  },
  robots: { index: true, follow: true },
}

const themePacks = [
  { theme: 'Family (Familia)', desc: 'mamá, papá, hermano, hermana with picture cards' },
  { theme: 'Food (Comida)', desc: 'manzana, pan, leche, agua, pollo - lunch + everyday' },
  { theme: 'Animals (Animales)', desc: 'gato, perro, vaca, caballo - farm + zoo + pets' },
  { theme: 'Body Parts (Cuerpo)', desc: 'cabeza, manos, pies, ojos with anatomical diagrams' },
  { theme: 'Colors (Colores)', desc: 'rojo, azul, amarillo, verde - 12 basic colors' },
  { theme: 'Numbers (Números)', desc: 'uno, dos, tres - numbers 1-20 with quantities' },
  { theme: 'Greetings (Saludos)', desc: 'hola, adiós, buenos días - daily greetings' },
  { theme: 'Feelings (Sentimientos)', desc: 'feliz, triste, cansado - emotion cards' },
  { theme: 'Weather (Clima)', desc: 'sol, lluvia, nieve, viento - weather + seasons' },
  { theme: 'Action Verbs (Verbos)', desc: 'correr, saltar, comer - TPR-friendly verbs' },
  { theme: 'School (Escuela)', desc: 'lápiz, libro, silla - classroom vocabulary' },
  { theme: 'Travel (Viajes)', desc: 'avión, hotel, restaurante - traveler vocabulary' },
]

const useCases = [
  {
    icon: GraduationCap,
    title: 'Spanish Class (FLES, Immersion)',
    desc: 'For native English speakers learning Spanish in K-8 FLES, 50/50 dual language, or full immersion programs.',
  },
  {
    icon: Home,
    title: 'Homeschool & Family',
    desc: 'For homeschool families teaching Spanish, second-generation Latino families maintaining heritage Spanish.',
  },
  {
    icon: Heart,
    title: 'Adult Spanish Learners',
    desc: 'For adults learning Spanish for travel, work, or community connection — picture-supported flashcards work for all ages.',
  },
]

const benefits = [
  '12+ themed Spanish flashcard packs',
  'Native-Spanish reviewed (not Google Translate)',
  '600+ cards across the library',
  'K-8 and adult-friendly',
  'Picture support on every card',
  'Free Spanish flashcard sample available',
]

const faqs = [
  {
    question: 'What\u2019s the difference between Spanish flashcards and bilingual flashcards?',
    answer:
      'The user direction matters. Spanish flashcards are for English speakers learning Spanish (FLES, immersion, homeschool, travel). Bilingual flashcards (English-Spanish) are for ELL students learning English with Spanish as scaffold. Same vocabulary, different intent. For ELL classrooms, see our bilingual flashcards page.',
  },
  {
    question: 'Are these Spanish flashcards for kids or adults?',
    answer:
      'Both. The picture support, simple Spanish vocabulary, and clear pronunciation guides make these flashcards effective for K-8 students AND adult Spanish learners. The cards don\u2019t look childish — they look universal.',
  },
  {
    question: 'Are the Spanish translations native-reviewed?',
    answer:
      'Yes. Every Spanish flashcard is reviewed by native Spanish speakers. We don\u2019t use machine translation. The Spanish reflects regional variation (Mexican, Caribbean, South American) where appropriate.',
  },
  {
    question: 'Can I use these in a dual language program?',
    answer:
      'For dual language programs, we recommend our bidirectional Spanish-English worksheets and bilingual flashcards. Spanish flashcards (this page) are designed for English-dominant learners. For 50/50 dual language, browse our dual language classroom resources.',
  },
  {
    question: 'What ages do these flashcards work for?',
    answer:
      'K-8 students (ages 5-13) for school use, plus adult learners for self-study. The picture support and simple vocabulary make them universal — though theme selection should match age (animals + colors for K-2, travel + food for 6-8 + adults).',
  },
  {
    question: 'Are there free Spanish flashcards I can try?',
    answer:
      'Yes. Our free Spanish flashcard sample includes 50 cards covering family, food, colors, numbers, and greetings — picture-supported, native-reviewed, and immediately printable.',
  },
]

const relatedLinks = [
  { href: '/bilingual-flashcards', label: 'Bilingual Flashcards (ELL focus)' },
  { href: '/spanish-english-worksheets', label: 'Spanish-English Worksheets' },
  { href: '/dual-language-classroom', label: 'Dual Language Classroom' },
  { href: '/english-spanish-printables', label: 'English-Spanish Printables' },
]

export default function SpanishFlashcardsPage() {
  return (
    <ClusterPageLayout
      breadcrumbLabel="Spanish Flashcards"
      canonicalPath={CANONICAL_PATH}
      badge={{ icon: Languages, text: 'Native-Reviewed · 600+ Cards · K-8 + Adult' }}
      h1="Spanish Flashcards for Beginners, Kids & Homeschool"
      intro="Print-ready Spanish flashcards designed for English speakers learning Spanish — K-8 students, homeschool families, FLES programs, and adult learners. Every Spanish flashcard pairs the Spanish word with a clear illustration and English translation, making vocabulary acquisition immediate and visual. Our 12+ themed Spanish flashcard packs cover family, food, animals, colors, numbers, body parts, greetings, weather, action verbs, school, feelings, and travel — all native-Spanish reviewed and ready to print on cardstock for years of classroom or home use."
      primaryCta={{ href: '/shop?type=flashcard&language=es', label: 'Browse Spanish Flashcards', icon: Download }}
      secondaryCta={{ href: '/free-samples', label: 'Get Free Samples' }}
      faqs={faqs}
      relatedLinks={relatedLinks}
    >
      {/* H2 #1 — Spanish vs Bilingual Disambiguation */}
      <ClusterSection alt>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Spanish Flashcards vs Bilingual Flashcards: Which Do You Need?
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          Same words, different intent. Choose based on your learner&apos;s direction:
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="clay-card p-6 border-2 border-primary/30">
            <h3 className="font-heading text-lg font-semibold text-text-primary mb-3">Spanish Flashcards (this page)</h3>
            <ul className="space-y-2 text-sm text-text-primary/80">
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />For English speakers learning Spanish</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />FLES, immersion, homeschool</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />Spanish-prioritized layout</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />K-8 students + adult learners</li>
            </ul>
          </div>
          <div className="clay-card p-6">
            <h3 className="font-heading text-lg font-semibold text-text-primary mb-3">
              <Link href="/bilingual-flashcards" className="text-primary hover:underline">Bilingual Flashcards</Link>
            </h3>
            <ul className="space-y-2 text-sm text-text-primary/80">
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />For Spanish-speaking ELLs learning English</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />Mainstream classrooms with newcomers</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />English-prioritized with Spanish scaffold</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />WIDA-aligned scaffolding</li>
            </ul>
          </div>
        </div>
        <p className="text-text-primary/80 leading-relaxed mt-6">
          For dual language programs, you may want both. The vocabulary overlaps but the pedagogical framing differs.
        </p>
      </ClusterSection>

      {/* H2 #2 — Use Cases */}
      <ClusterSection>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Who Uses Spanish Flashcards?
        </h2>
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
          For beginners, read{' '}
          <Link href="/teaching-tips/spanish-flashcards-beginners" className="text-primary hover:underline">
            Spanish flashcards for beginners
          </Link>
          . For home use, read{' '}
          <Link href="/teaching-tips/spanish-flashcards-at-home" className="text-primary hover:underline">
            how to use Spanish flashcards at home
          </Link>
          .
        </p>
      </ClusterSection>

      {/* H2 #3 — Themed Packs */}
      <ClusterSection alt>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Spanish Flashcards by Theme (12+ Packs)
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {themePacks.map((p) => (
            <div key={p.theme} className="clay-card p-5">
              <h3 className="font-heading text-base font-semibold text-text-primary mb-1">{p.theme}</h3>
              <p className="text-sm text-text-primary/70">{p.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-text-primary/80 leading-relaxed mt-6">
          For complete theme breakdown, read{' '}
          <Link href="/teaching-tips/spanish-flashcards-by-theme" className="text-primary hover:underline">
            Spanish vocabulary flashcards by theme
          </Link>
          .
        </p>
      </ClusterSection>

      {/* H2 #4 — Free + Newsletter */}
      <ClusterSection>
        <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">
          Free Spanish Flashcards Printable
        </h2>
        <p className="text-text-primary/80 leading-relaxed mb-6">
          Start with our free Spanish flashcard sample: 50 cards covering family, food, colors, numbers, and
          greetings — picture-supported, native-reviewed, ready to print on cardstock.
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
            <Download className="w-5 h-5" /> Get Free Spanish Flashcards
          </Link>
        </div>
        <p className="text-sm text-text-primary/70 mb-6 text-center">
          For more free options, read{' '}
          <Link href="/teaching-tips/free-spanish-flashcards-printable" className="text-primary hover:underline">
            free Spanish flashcards printable
          </Link>
          .
        </p>
        <div className="max-w-md mx-auto">
          <p className="text-sm text-text-primary/70 mb-3 text-center">Get weekly Spanish learning tips:</p>
          <EmailCapture />
        </div>
      </ClusterSection>
    </ClusterPageLayout>
  )
}
