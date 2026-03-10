import Link from 'next/link'
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/footer'
import { CheckCircle, Download, ArrowRight, BookOpen, Sparkles, Eye, GraduationCap, Star } from 'lucide-react'
import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lanternell.com'

export const metadata: Metadata = {
  title: 'ESL Worksheets for Beginners — Free Printable ESL Activities for K-5',
  description:
    'Free printable ESL worksheets for beginners in K-5 classrooms. Download beginner ESL activities, vocabulary worksheets, and visual learning materials for students new to English. Bilingual English-Spanish support included.',
  keywords: [
    'ESL worksheets for beginners',
    'beginner ESL worksheets',
    'ESL worksheets kindergarten',
    'free ESL worksheets beginners',
    'ESL activities for beginners',
    'printable ESL worksheets',
    'ESL worksheets for kids',
    'beginner English worksheets',
  ],
  alternates: { canonical: '/esl-worksheets-beginners' },
  openGraph: {
    title: 'ESL Worksheets for Beginners — Free Printable ESL Activities',
    description: 'Free printable ESL worksheets for beginners in K-5 classrooms.',
    url: `${BASE_URL}/esl-worksheets-beginners`,
    images: [{ url: `${BASE_URL}/images/og-esl-beginners.png`, width: 1200, height: 630, alt: 'ESL Worksheets for Beginners - K-5' }],
  },
  robots: { index: true, follow: true },
}

const skillAreas = [
  { name: 'Listening & Speaking', icon: Star, desc: 'Audio-supported activities, dialogue practice, and speaking prompts for beginning English learners.' },
  { name: 'Reading & Phonics', icon: BookOpen, desc: 'Letter recognition, sight words, and decodable texts designed for ESL beginners.' },
  { name: 'Writing & Tracing', icon: Sparkles, desc: 'Letter formation, word tracing, and guided writing with sentence frames for early writers.' },
  { name: 'Visual Vocabulary', icon: Eye, desc: 'Picture-word cards, matching activities, and visual dictionaries for pre-literate learners.' },
]

export default function EslWorksheetsBeginnerPage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'ESL Worksheets for Beginners', item: `${BASE_URL}/esl-worksheets-beginners` },
    ],
  }
  const webPageJsonLd = {
    '@context': 'https://schema.org', '@type': 'WebPage',
    name: 'ESL Worksheets for Beginners', description: metadata.description,
    url: `${BASE_URL}/esl-worksheets-beginners`, breadcrumb: breadcrumbJsonLd,
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
            <span className="text-text-primary font-medium">ESL Worksheets for Beginners</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-clay-sm mb-6">
            <GraduationCap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-text-primary">Beginner-Friendly ESL</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-text-primary mb-6">
            ESL Worksheets for Beginners — Printable Activities for K-5
          </h1>
          <p className="text-lg text-text-primary/70 max-w-2xl mx-auto mb-8">
            Download free ESL worksheets for beginners designed specifically for students who are new to English. Our beginner ESL activities use visual supports, simplified language, and bilingual scaffolding to help K-5 students build foundational English skills. Perfect for ESL pull-out groups, newcomer programs, and bilingual classrooms.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/shop" className="clay-button-cta text-lg flex items-center gap-2 cursor-pointer">
              <Download className="w-5 h-5" /> Download Free ESL Worksheets
            </Link>
            <Link href="/ell-worksheets" className="clay-button text-lg cursor-pointer">Browse All ELL Resources</Link>
          </div>
        </div>
      </section>

      {/* H2: Beginner ESL Worksheets by Skill Area */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">Beginner ESL Worksheets by Skill Area</h2>
          <p className="text-text-primary/80 leading-relaxed mb-8">
            Our ESL worksheets for beginners are organized by the four core language skills. Each worksheet pack targets a specific skill area while incorporating visual supports that make content accessible to students at the earliest stages of English acquisition. All materials include bilingual English-Spanish support.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {skillAreas.map((area) => (
              <div key={area.name} className="clay-card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <area.icon className="w-5 h-5 text-primary" />
                  <h3 className="font-heading text-lg font-semibold text-text-primary">{area.name}</h3>
                </div>
                <p className="text-sm text-text-primary/70">{area.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* H2: What Makes a Good ESL Worksheet for Beginners */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">What Makes a Good ESL Worksheet for Beginners</h2>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            Not all worksheets work for beginning English learners. Effective ESL worksheets for beginners share several key characteristics that set them apart from general classroom materials. They use visual supports extensively — every new word is paired with an image. They limit the amount of text on each page to avoid overwhelming students. And they provide scaffolding through sentence frames, word banks, and bilingual glossaries.
          </p>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            Our beginner ESL worksheets are designed with these principles at their core. Each page has a clear, single focus — one vocabulary theme, one grammar pattern, or one phonics skill. Instructions are simple and often include visual cues so students can work independently or with minimal teacher support.
          </p>
          <p className="text-text-primary/80 leading-relaxed">
            For additional visual learning tools that complement these worksheets, explore our <Link href="/visual-supports-ell" className="text-primary hover:underline">visual supports for ELL students</Link> collection.
          </p>
        </div>
      </section>

      {/* H2: ESL Worksheets for Kindergarten and Early Grades */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">ESL Worksheets for Kindergarten and Early Grades</h2>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            Kindergarten and first-grade ESL students need worksheets that account for both their English proficiency level and their developmental stage. Our early grades ESL worksheets feature large fonts, ample white space, thick tracing lines, and engaging illustrations that keep young learners motivated. Activities include letter tracing with picture cues, color-by-word exercises, cut-and-paste vocabulary sorting, and simple pattern activities.
          </p>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            For kindergarten classrooms with Spanish-speaking students, our <Link href="/english-spanish-printables" className="text-primary hover:underline">English-Spanish printables</Link> provide additional bilingual support with vocabulary cards and picture dictionaries designed for the youngest learners.
          </p>
          <p className="text-text-primary/80 leading-relaxed">
            Teachers in newcomer programs will also find our <Link href="/newcomer-activities" className="text-primary hover:underline">newcomer activities</Link> helpful for the first weeks when students are adjusting to a new school environment.
          </p>
        </div>
      </section>

      {/* H2: ESL Activities for Beginner Students in Grades 3-5 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">ESL Activities for Beginner Students in Grades 3-5</h2>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            Older beginner ESL students face a unique challenge: they need age-appropriate content delivered at a beginning English level. Our grades 3-5 ESL worksheets address this by using topics and themes relevant to upper elementary students while keeping the language simple and heavily scaffolded. Activities include academic vocabulary building, content-area sentence frames, graphic organizers with bilingual support, and structured writing templates.
          </p>
          <p className="text-text-primary/80 leading-relaxed">
            These worksheets are particularly effective when used alongside <Link href="/bilingual-classroom-labels" className="text-primary hover:underline">bilingual classroom labels</Link> that reinforce the same vocabulary throughout the school day.
          </p>
        </div>
      </section>

      {/* H2: How to Use ESL Worksheets Effectively */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">How to Use ESL Worksheets Effectively</h2>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            The most effective way to use ESL worksheets for beginners is as part of a structured routine. Here are strategies recommended by experienced ESL teachers:
          </p>
          <div className="space-y-4 mb-6">
            {[
              { title: 'Pre-teach vocabulary', desc: 'Introduce key words orally with pictures before giving the worksheet. This builds comprehension.' },
              { title: 'Model the activity', desc: 'Complete the first example together as a class. Beginners need to see what success looks like.' },
              { title: 'Allow home language use', desc: 'Let students discuss in their home language while completing English worksheets. This deepens understanding.' },
              { title: 'Use worksheets in centers', desc: 'Place completed worksheets in literacy centers for review. Repetition builds fluency.' },
              { title: 'Send home for family practice', desc: 'Bilingual worksheets let families participate in learning. Parents can help in Spanish while students practice English.' },
            ].map((tip) => (
              <div key={tip.title} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-text-primary">{tip.title}:</span>{' '}
                  <span className="text-text-primary/70">{tip.desc}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-text-primary/80 leading-relaxed">
            For more teaching strategies, visit our <Link href="/teaching-tips" className="text-primary hover:underline">teaching tips</Link> blog where we share weekly ideas from ESL and bilingual educators.
          </p>
        </div>
      </section>

      {/* H2: Download Free ESL Worksheets for Beginners */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">Download Free ESL Worksheets for Beginners</h2>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            Try our free beginner ESL worksheet packs to see how they work in your classroom. Free packs include vocabulary cards, tracing activities, and simple sentence frames — everything you need to get started with beginning English learners.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {['Visual supports on every page', 'Bilingual English-Spanish scaffolding', 'K-5 grade-appropriate content', 'Free sample packs available', 'Teacher guides with each pack', 'Progress tracking templates'].map((b) => (
              <div key={b} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-text-primary">{b}</span>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/shop" className="clay-button-cta text-lg inline-flex items-center gap-2 cursor-pointer">
              <Download className="w-5 h-5" /> Get Free ESL Worksheets
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
            <Link href="/english-spanish-printables" className="clay-button text-sm cursor-pointer inline-flex items-center gap-1">English-Spanish Printables <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/visual-supports-ell" className="clay-button text-sm cursor-pointer inline-flex items-center gap-1">Visual Supports <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/newcomer-activities" className="clay-button text-sm cursor-pointer inline-flex items-center gap-1">Newcomer Activities <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
