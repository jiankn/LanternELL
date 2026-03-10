import Link from 'next/link'
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/footer'
import { CheckCircle, Download, ArrowRight, Eye, Image as ImageIcon, Calendar, Smile, BarChart3 } from 'lucide-react'
import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lanternell.com'

export const metadata: Metadata = {
  title: 'Visual Supports for ELL Students — Free Printable Visual Aids for K-5',
  description:
    'Free printable visual supports for ELL students in K-5 classrooms. Download visual schedules, emotion cards, picture dictionaries, and graphic organizers designed for English Language Learners and newcomer students.',
  keywords: [
    'visual supports ELL',
    'visual supports for ELL students',
    'ELL visual aids',
    'visual supports English language learners',
    'printable visual supports',
    'visual schedule ELL',
    'picture dictionary ELL',
    'visual supports for newcomers',
  ],
  alternates: { canonical: '/visual-supports-ell' },
  openGraph: {
    title: 'Visual Supports for ELL Students — Free Printable Visual Aids',
    description: 'Free printable visual supports for ELL students in K-5 classrooms.',
    url: `${BASE_URL}/visual-supports-ell`,
    images: [{ url: `${BASE_URL}/images/og-visual-supports.png`, width: 1200, height: 630, alt: 'Visual Supports for ELL Students' }],
  },
  robots: { index: true, follow: true },
}

const supportTypes = [
  { name: 'Visual Schedules', icon: Calendar, desc: 'Daily routine cards with pictures and bilingual text. Help ELL students predict and prepare for transitions.' },
  { name: 'Emotion & Feeling Cards', icon: Smile, desc: 'Illustrated emotion cards in English-Spanish. Help students express needs when they lack English vocabulary.' },
  { name: 'Picture Dictionaries', icon: ImageIcon, desc: 'Thematic visual dictionaries with labeled illustrations. Build vocabulary through image-word association.' },
  { name: 'Graphic Organizers', icon: BarChart3, desc: 'Visual thinking tools — Venn diagrams, webs, T-charts — with bilingual labels and sentence starters.' },
]

export default function VisualSupportsEllPage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Visual Supports for ELL', item: `${BASE_URL}/visual-supports-ell` },
    ],
  }
  const webPageJsonLd = {
    '@context': 'https://schema.org', '@type': 'WebPage',
    name: 'Visual Supports for ELL Students', description: metadata.description,
    url: `${BASE_URL}/visual-supports-ell`, breadcrumb: breadcrumbJsonLd,
  }

  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Navbar links={[{ href: '/', label: 'Home' }, { href: '/shop', label: 'Shop' }, { href: '/teaching-tips', label: 'Teaching Tips' }]} />

      {/* Breadcrumb */}
      <div className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-text-muted mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <span className="text-text-primary font-medium">Visual Supports for ELL</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-clay-sm mb-6">
            <Eye className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-text-primary">Visual Learning Tools</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-text-primary mb-6">
            Visual Supports for ELL Students in K-5 Classrooms
          </h1>
          <p className="text-lg text-text-primary/70 max-w-2xl mx-auto mb-8">
            Download free printable visual supports for ELL students designed to make learning accessible for English Language Learners at every proficiency level. Our visual aids include schedules, emotion cards, picture dictionaries, and graphic organizers — all with bilingual English-Spanish text. Essential tools for newcomer students, ESL pull-out groups, and inclusive classrooms.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/shop?type=visual_supports" className="clay-button-cta text-lg flex items-center gap-2 cursor-pointer">
              <Download className="w-5 h-5" /> Download Free Visual Supports
            </Link>
            <Link href="/ell-worksheets" className="clay-button text-lg cursor-pointer">Browse ELL Worksheets</Link>
          </div>
        </div>
      </section>

      {/* H2: Types of Visual Supports for English Language Learners */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">Types of Visual Supports for English Language Learners</h2>
          <p className="text-text-primary/80 leading-relaxed mb-8">
            Visual supports are tools that use images, symbols, and graphic representations to make information accessible to students who are still developing English proficiency. For ELL students, visual supports bridge the gap between what they can understand and what they can express in English. Our collection covers four essential categories used in effective ELL classrooms.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {supportTypes.map((type) => (
              <div key={type.name} className="clay-card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <type.icon className="w-5 h-5 text-primary" />
                  <h3 className="font-heading text-lg font-semibold text-text-primary">{type.name}</h3>
                </div>
                <p className="text-sm text-text-primary/70">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* H2: Why Visual Supports Are Essential for ELL Newcomers */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">Why Visual Supports Are Essential for ELL Newcomers</h2>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            When a student arrives in your classroom speaking little or no English, visual supports become their primary means of understanding and participating. During the silent period — which can last weeks or months — newcomer students rely on visual cues to follow classroom routines, understand expectations, and begin building English vocabulary. Without visual supports, these students are essentially navigating their school day without a map.
          </p>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            Research in second language acquisition consistently shows that visual input activates different neural pathways than auditory input alone. When ELL students see a picture paired with a word, they create stronger memory connections than when they hear the word in isolation. This is why picture-word association is the foundation of effective ELL vocabulary instruction.
          </p>
          <p className="text-text-primary/80 leading-relaxed">
            For first-week resources specifically designed for newcomer students, visit our <Link href="/newcomer-activities" className="text-primary hover:underline">newcomer activities</Link> page with orientation materials and survival vocabulary packs.
          </p>
        </div>
      </section>

      {/* H2: Visual Schedules and Routine Cards for ELL Classrooms */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">Visual Schedules and Routine Cards for ELL Classrooms</h2>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            A visual schedule is often the first visual support teachers implement for ELL students, and for good reason. When students can see what comes next in the day, their anxiety decreases and their ability to participate increases. Our visual schedule cards feature clear illustrations paired with bilingual English-Spanish text, covering every part of the school day from morning arrival to dismissal.
          </p>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            Each card is designed to be printed, laminated, and displayed on a pocket chart or magnetic board. Teachers can rearrange cards to match their daily schedule, and students quickly learn to check the visual schedule independently. This builds autonomy and reduces the number of times students need to ask &quot;What are we doing next?&quot; — a question that can be especially stressful for students who don&apos;t yet have the English to ask it.
          </p>
          <p className="text-text-primary/80 leading-relaxed">
            Pair visual schedules with our <Link href="/bilingual-classroom-labels" className="text-primary hover:underline">bilingual classroom labels</Link> to create a fully labeled, visually supported learning environment.
          </p>
        </div>
      </section>

      {/* H2: Picture Dictionaries and Visual Vocabulary Tools */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">Picture Dictionaries and Visual Vocabulary Tools</h2>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            Picture dictionaries are personal reference tools that ELL students can keep at their desks and use throughout the day. Unlike traditional dictionaries that require reading proficiency, picture dictionaries use illustrations to convey meaning — making them accessible to students at any English level. Our printable picture dictionaries are organized by theme (school, home, food, animals, weather, body parts) and include both English and Spanish labels.
          </p>
          <p className="text-text-primary/80 leading-relaxed">
            For more vocabulary-building resources, browse our <Link href="/english-spanish-printables" className="text-primary hover:underline">English-Spanish printables</Link> collection which includes vocabulary cards, matching activities, and word wall materials.
          </p>
        </div>
      </section>

      {/* H2: Visual Supports for SPED and ELL Dual-Identified Students */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">Visual Supports for SPED and ELL Dual-Identified Students</h2>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            Many visual supports designed for ELL students also benefit students with IEPs and 504 plans. Visual schedules, emotion cards, and graphic organizers are standard tools in special education classrooms. Our materials are designed to serve both populations — ELL students who need language support and SPED students who need visual and structural support. This makes them especially valuable in inclusive classrooms where teachers serve both groups simultaneously.
          </p>
          <p className="text-text-primary/80 leading-relaxed">
            Paraprofessionals and resource teachers find our visual supports particularly useful because they can be used across settings — in the general education classroom, the resource room, and at home. The bilingual format also helps families understand and reinforce the same visual systems being used at school.
          </p>
        </div>
      </section>

      {/* H2: Download Free Visual Supports for ELL Students */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">Download Free Visual Supports for ELL Students</h2>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            Start with our free visual supports sample pack, which includes a set of daily schedule cards, basic emotion cards, and a mini picture dictionary. Premium packs include complete visual support systems with teacher implementation guides and student tracking tools.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {['Clear illustrations on every card', 'Bilingual English-Spanish text', 'Print, laminate, and reuse', 'Free sample pack available', 'Works for ELL and SPED students', 'Teacher implementation guide included'].map((b) => (
              <div key={b} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-text-primary">{b}</span>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/shop?type=visual_supports" className="clay-button-cta text-lg inline-flex items-center gap-2 cursor-pointer">
              <Download className="w-5 h-5" /> Get Free Visual Supports
            </Link>
          </div>
        </div>
      </section>

      {/* Internal links */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-text-primary/70 mb-4">
            Looking for more resources? Browse our complete collection of{' '}
            <Link href="/" className="text-primary hover:underline">ELL worksheets and bilingual teaching resources</Link>.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/ell-worksheets" className="clay-button text-sm cursor-pointer inline-flex items-center gap-1">ELL Worksheets <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/bilingual-classroom-labels" className="clay-button text-sm cursor-pointer inline-flex items-center gap-1">Classroom Labels <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/english-spanish-printables" className="clay-button text-sm cursor-pointer inline-flex items-center gap-1">English-Spanish Printables <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/newcomer-activities" className="clay-button text-sm cursor-pointer inline-flex items-center gap-1">Newcomer Activities <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
