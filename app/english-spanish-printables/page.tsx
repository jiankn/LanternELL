import Link from 'next/link'
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/footer'
import { CheckCircle, Download, Globe, ArrowRight, BookOpen, Sparkles, FileText, Users } from 'lucide-react'
import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lanternell.com'

export const metadata: Metadata = {
  title: 'English-Spanish Printables — Free Bilingual Worksheets for K-5 Classrooms',
  description:
    'Free English-Spanish printables for K-5 bilingual and ESL classrooms. Download bilingual vocabulary worksheets, sentence frames, classroom labels, and parent communication templates in English and Spanish.',
  keywords: [
    'English Spanish printables',
    'bilingual printables English Spanish',
    'English Spanish worksheets',
    'bilingual worksheets for kids',
    'Spanish English classroom printables',
    'free bilingual printables',
    'English Spanish vocabulary printables',
    'dual language printables',
  ],
  alternates: { canonical: '/english-spanish-printables' },
  openGraph: {
    title: 'English-Spanish Printables — Free Bilingual Worksheets for K-5',
    description: 'Free English-Spanish printables for K-5 bilingual and ESL classrooms.',
    url: `${BASE_URL}/english-spanish-printables`,
    images: [{ url: `${BASE_URL}/images/og-english-spanish.png`, width: 1200, height: 630, alt: 'English-Spanish Printables for K-5 Classrooms' }],
  },
  robots: { index: true, follow: true },
}

const printableTypes = [
  { name: 'Vocabulary Worksheets', icon: Sparkles, desc: 'Picture-word matching, tracing, and labeling activities in English and Spanish for building core vocabulary.' },
  { name: 'Sentence Frames', icon: BookOpen, desc: 'Bilingual sentence starters and writing prompts that scaffold English production for Spanish-speaking students.' },
  { name: 'Classroom Labels', icon: FileText, desc: 'Ready-to-print English-Spanish labels for furniture, supplies, centers, and daily routines.' },
  { name: 'Parent Communication', icon: Users, desc: 'Bilingual letters, newsletters, and forms for communicating with Spanish-speaking families.' },
]

export default function EnglishSpanishPrintablesPage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'English-Spanish Printables', item: `${BASE_URL}/english-spanish-printables` },
    ],
  }
  const webPageJsonLd = {
    '@context': 'https://schema.org', '@type': 'WebPage',
    name: 'English-Spanish Printables', description: metadata.description,
    url: `${BASE_URL}/english-spanish-printables`, breadcrumb: breadcrumbJsonLd,
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
            <span className="text-text-primary font-medium">English-Spanish Printables</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-clay-sm mb-6">
            <Globe className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-text-primary">Bilingual Resources</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-text-primary mb-6">
            English-Spanish Printables for K-5 Bilingual Classrooms
          </h1>
          <p className="text-lg text-text-primary/70 max-w-2xl mx-auto mb-8">
            Download free English-Spanish printables designed for bilingual and ESL classrooms. Our printable worksheets, vocabulary cards, sentence frames, and classroom labels are all available in English and Spanish — ready to print and use today. Created by experienced bilingual educators for K-5 dual language programs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/shop" className="clay-button-cta text-lg flex items-center gap-2 cursor-pointer">
              <Download className="w-5 h-5" /> Download Free Printables
            </Link>
            <Link href="/ell-worksheets" className="clay-button text-lg cursor-pointer">Browse ELL Worksheets</Link>
          </div>
        </div>
      </section>

      {/* H2: Types of English-Spanish Printables */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">Types of English-Spanish Printables for the Classroom</h2>
          <p className="text-text-primary/80 leading-relaxed mb-8">
            Our English-Spanish printables cover every area of the bilingual classroom. Whether you need vocabulary building materials, writing scaffolds, environmental print, or family communication tools, each resource is professionally designed with accurate translations and age-appropriate content for K-5 students.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {printableTypes.map((type) => (
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

      {/* H2: Why English-Spanish Bilingual Resources Work */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">Why English-Spanish Bilingual Resources Work</h2>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            Spanish is the most common home language among English Language Learners in the United States, with over 75% of ELL students coming from Spanish-speaking households. English-Spanish printables leverage this linguistic foundation by connecting new English vocabulary to words students already know in Spanish. This approach, known as translanguaging, accelerates English acquisition while maintaining and strengthening the home language.
          </p>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            Research from leading bilingual education programs shows that students who maintain their home language while learning English outperform those in English-only programs on standardized tests by third grade. Our English-Spanish printables support this dual language development by presenting content in both languages simultaneously.
          </p>
          <p className="text-text-primary/80 leading-relaxed">
            For teachers working with newcomer students who are just arriving from Spanish-speaking countries, our <Link href="/newcomer-activities" className="text-primary hover:underline">newcomer activities</Link> page has first-week resources specifically designed for the transition period.
          </p>
        </div>
      </section>

      {/* H2: English-Spanish Vocabulary Printables */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">English-Spanish Vocabulary Printables</h2>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            Building vocabulary is the foundation of language learning. Our English-Spanish vocabulary printables use proven methods — picture-word association, tracing, matching, and contextual sentences — to help students internalize new words in both languages. Each vocabulary pack is organized by theme (animals, food, school, family, weather) and aligned with common K-5 curriculum standards.
          </p>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            Teachers can use these printables during dedicated vocabulary time, as morning work, in literacy centers, or as homework that families can complete together. The bilingual format means Spanish-speaking parents can actively participate in their child&apos;s learning at home.
          </p>
          <p className="text-text-primary/80 leading-relaxed">
            Want more vocabulary-building tools? Our <Link href="/ell-worksheets" className="text-primary hover:underline">ELL worksheets</Link> collection includes additional vocabulary packs with visual supports and progress tracking templates.
          </p>
        </div>
      </section>

      {/* H2: Bilingual Sentence Frames and Writing Supports */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">Bilingual Sentence Frames and Writing Supports</h2>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            Sentence frames are essential scaffolds for ELL students learning to write in English. Our bilingual sentence frames provide the structure students need to form complete sentences while building confidence. Each frame includes the English sentence starter with a Spanish translation, so students understand the meaning before attempting to write.
          </p>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            Our sentence frame printables cover academic language across subjects — science observations, math explanations, reading responses, and social studies discussions. Teachers in dual language programs use them during both English and Spanish instruction blocks.
          </p>
          <p className="text-text-primary/80 leading-relaxed">
            For beginning English learners who need additional support, check out our <Link href="/esl-worksheets-beginners" className="text-primary hover:underline">ESL worksheets for beginners</Link> with simplified sentence frames and extra visual scaffolding.
          </p>
        </div>
      </section>

      {/* H2: Printable Bilingual Labels and Environmental Print */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">Printable Bilingual Labels and Environmental Print</h2>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            Environmental print — the words and labels students see around them every day — is a powerful tool for language learning. Our English-Spanish printable labels transform your classroom into a bilingual learning environment where vocabulary acquisition happens naturally throughout the day.
          </p>
          <p className="text-text-primary/80 leading-relaxed">
            Visit our dedicated <Link href="/bilingual-classroom-labels" className="text-primary hover:underline">bilingual classroom labels</Link> page for our complete collection of 90+ printable labels organized by category, including furniture, supplies, daily routines, and learning centers.
          </p>
        </div>
      </section>

      {/* H2: Download Free English-Spanish Printables */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">Download Free English-Spanish Printables</h2>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            Start with our free sample packs to see the quality and format of our English-Spanish printables. Free packs include vocabulary cards, sentence frames, and classroom labels — enough to get started in your bilingual classroom right away. Premium packs include complete thematic units with teacher guides and student progress tracking.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {['PDF format — print on US Letter or A4', 'English-Spanish bilingual content', 'K-5 grade-appropriate vocabulary', 'Free samples for every category', 'Teacher guides included in premium packs', 'New packs added weekly'].map((b) => (
              <div key={b} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-text-primary">{b}</span>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/shop" className="clay-button-cta text-lg inline-flex items-center gap-2 cursor-pointer">
              <Download className="w-5 h-5" /> Get Free Printables
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
            <Link href="/visual-supports-ell" className="clay-button text-sm cursor-pointer inline-flex items-center gap-1">Visual Supports <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/newcomer-activities" className="clay-button text-sm cursor-pointer inline-flex items-center gap-1">Newcomer Activities <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
