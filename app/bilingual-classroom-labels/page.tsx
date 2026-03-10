import Link from 'next/link'
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/footer'
import { CheckCircle, Download, Globe, Tag, ArrowRight, BookOpen, Printer, Users, School } from 'lucide-react'
import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lanternell.com'

export const metadata: Metadata = {
  title: 'Bilingual Classroom Labels — Free English-Spanish Printable Labels for K-5',
  description:
    'Free printable bilingual classroom labels in English-Spanish for K-5 dual language classrooms. Download ready-to-print classroom labels for furniture, supplies, and daily routines. Perfect for bilingual teachers and ESL educators.',
  keywords: [
    'bilingual classroom labels',
    'English Spanish classroom labels',
    'dual language classroom labels',
    'printable bilingual labels',
    'classroom labels English Spanish',
    'bilingual labels for classroom',
    'free bilingual classroom labels',
    'Spanish classroom labels printable',
  ],
  alternates: { canonical: '/bilingual-classroom-labels' },
  openGraph: {
    title: 'Bilingual Classroom Labels — Free English-Spanish Printable Labels',
    description: 'Free printable bilingual classroom labels in English-Spanish for K-5 dual language classrooms.',
    url: `${BASE_URL}/bilingual-classroom-labels`,
    images: [{ url: `${BASE_URL}/images/og-bilingual-labels.png`, width: 1200, height: 630, alt: 'Bilingual Classroom Labels - English-Spanish' }],
  },
  robots: { index: true, follow: true },
}

const labelCategories = [
  { name: 'Furniture & Area Labels', count: 25, description: 'Desks, chairs, shelves, reading corner, math center — all labeled in English and Spanish.' },
  { name: 'Supply Labels', count: 30, description: 'Pencils, crayons, scissors, glue, paper — bilingual labels for every supply bin.' },
  { name: 'Daily Routine Labels', count: 20, description: 'Morning meeting, lunch, recess, dismissal — visual schedule labels in both languages.' },
  { name: 'Subject & Center Labels', count: 15, description: 'Reading, math, science, art — bilingual labels for learning centers and subject areas.' },
]

const benefits = [
  'Print-ready PDF format (US Letter & A4)',
  'English-Spanish bilingual text',
  'Designed for K-5 classrooms',
  'Free sample labels available',
  'Color and black & white options',
  'Editable versions in premium packs',
]

export default function BilingualClassroomLabelsPage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Bilingual Classroom Labels', item: `${BASE_URL}/bilingual-classroom-labels` },
    ],
  }
  const webPageJsonLd = {
    '@context': 'https://schema.org', '@type': 'WebPage',
    name: 'Bilingual Classroom Labels', description: metadata.description,
    url: `${BASE_URL}/bilingual-classroom-labels`, breadcrumb: breadcrumbJsonLd,
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
            <span className="text-text-primary font-medium">Bilingual Classroom Labels</span>
          </nav>
        </div>
      </div>

      {/* Hero — keyword in first 100 words */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-clay-sm mb-6">
            <Globe className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-text-primary">English-Spanish Bilingual</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-text-primary mb-6">
            Bilingual Classroom Labels for Dual Language Classrooms
          </h1>
          <p className="text-lg text-text-primary/70 max-w-2xl mx-auto mb-8">
            Download free printable bilingual classroom labels in English and Spanish for your K-5 dual language classroom. Our ready-to-print classroom labels help create an immersive bilingual learning environment where every object becomes a vocabulary lesson. Perfect for ESL teachers, bilingual educators, and dual language programs looking for professional-quality labels.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/shop?type=classroom_labels" className="clay-button-cta text-lg flex items-center gap-2 cursor-pointer">
              <Download className="w-5 h-5" /> Download Free Labels
            </Link>
            <Link href="/shop" className="clay-button text-lg cursor-pointer">Browse All Packs</Link>
          </div>
        </div>
      </section>

      {/* H2: Free Printable Bilingual Classroom Labels */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">Free Printable Bilingual Classroom Labels</h2>
          <p className="text-text-primary/80 leading-relaxed mb-8">
            Bilingual classroom labels are one of the most effective tools for creating a language-rich environment. When students see both English and Spanish on every object in the classroom, they naturally absorb vocabulary throughout the day. Our free printable bilingual classroom labels cover the most common items in K-5 classrooms, from furniture and supplies to daily routines and learning centers.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {labelCategories.map((cat) => (
              <div key={cat.name} className="clay-card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Tag className="w-5 h-5 text-primary" />
                  <h3 className="font-heading text-lg font-semibold text-text-primary">{cat.name}</h3>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{cat.count}+ labels</span>
                </div>
                <p className="text-sm text-text-primary/70">{cat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* H2: How to Use Bilingual Labels in Your Classroom */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">How to Use Bilingual Labels in Your Classroom</h2>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            Setting up bilingual classroom labels is simple, but strategic placement makes all the difference. Here are proven strategies from experienced dual language teachers for maximizing the impact of your bilingual labels:
          </p>
          <div className="space-y-4 mb-6">
            {[
              { title: 'Label at student eye level', desc: 'Place labels where students can see and touch them. For K-2, this means lower on furniture and walls.' },
              { title: 'Use consistent formatting', desc: 'Keep English on top and Spanish below (or vice versa) throughout the classroom for predictability.' },
              { title: 'Add visual icons', desc: 'Pair each label with a simple icon or image so pre-readers and newcomers can understand immediately.' },
              { title: 'Rotate and refresh', desc: 'Change seasonal labels monthly. Keep core labels (furniture, supplies) permanent for stability.' },
              { title: 'Involve students', desc: 'Have students help place labels and practice reading them aloud during morning routines.' },
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
            For more classroom setup strategies, check out our <Link href="/teaching-tips" className="text-primary hover:underline">teaching tips</Link> blog where we share weekly ideas from experienced ELL and bilingual educators.
          </p>
        </div>
      </section>

      {/* H2: English-Spanish Classroom Labels by Category */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">English-Spanish Classroom Labels by Category</h2>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            Our bilingual classroom labels are organized into categories that match how real classrooms are set up. Each category includes both color and black-and-white versions, so you can choose what works best for your printing setup and classroom aesthetic.
          </p>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            Every label features clear, large fonts that are easy to read from across the room. The English text appears alongside the Spanish translation, with consistent formatting throughout. Teachers in dual language programs use these labels to reinforce vocabulary in both languages simultaneously, while ESL teachers use them to help newcomer students connect English words to familiar Spanish terms.
          </p>
          <p className="text-text-primary/80 leading-relaxed">
            Looking for more bilingual resources beyond labels? Browse our <Link href="/english-spanish-printables" className="text-primary hover:underline">English-Spanish printables</Link> collection for vocabulary packs, sentence frames, and parent communication templates — all in English and Spanish.
          </p>
        </div>
      </section>

      {/* H2: Why Bilingual Labels Matter for ELL Students */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">Why Bilingual Labels Matter for ELL Students</h2>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            Research consistently shows that a print-rich environment accelerates language acquisition for English Language Learners. Bilingual classroom labels serve multiple purposes: they validate students&apos; home language, provide constant vocabulary exposure, and create a welcoming environment for newcomer families. When ELL students see their home language represented in the classroom, it sends a powerful message that their linguistic background is valued.
          </p>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            For newcomer students who are just beginning to learn English, bilingual labels act as a bridge between what they already know and what they are learning. A student who recognizes &quot;tijeras&quot; can immediately connect it to &quot;scissors&quot; — building vocabulary through meaningful context rather than rote memorization.
          </p>
          <p className="text-text-primary/80 leading-relaxed">
            Explore our <Link href="/visual-supports-ell" className="text-primary hover:underline">visual supports for ELL students</Link> for additional tools that complement bilingual labels, including visual schedules, emotion cards, and picture dictionaries.
          </p>
        </div>
      </section>

      {/* H2: Bilingual Labels for Dual Language Programs */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">Bilingual Labels for Dual Language Programs</h2>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            Dual language programs require consistent bilingual materials across all classrooms. Our label packs are designed with dual language program standards in mind — consistent formatting, accurate translations, and age-appropriate vocabulary. Whether you run a 50/50 or 90/10 dual language model, these labels support both language goals.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {[
              { icon: Printer, label: 'Print-Ready', desc: 'PDF format, US Letter & A4' },
              { icon: Users, label: 'Teacher-Tested', desc: 'Designed with dual language educators' },
              { icon: School, label: 'School-Wide', desc: 'Consistent across all classrooms' },
            ].map((item) => (
              <div key={item.label} className="clay-card-sm p-4 text-center">
                <item.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-medium text-text-primary mb-1">{item.label}</h3>
                <p className="text-xs text-text-primary/70">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-text-primary/80 leading-relaxed">
            Need labels for <Link href="/newcomer-activities" className="text-primary hover:underline">newcomer activities</Link> and orientation? We also have welcome labels and first-day visual supports designed specifically for students new to your school.
          </p>
        </div>
      </section>

      {/* H2: Download Free Bilingual Classroom Labels */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">Download Free Bilingual Classroom Labels</h2>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            Get started with our free sample pack of bilingual classroom labels. The free pack includes 10 of our most popular labels covering essential classroom items. Premium packs include 90+ labels across all categories, plus editable templates so you can create custom labels for your specific classroom needs.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {benefits.map((b) => (
              <div key={b} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-text-primary">{b}</span>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/shop?type=classroom_labels" className="clay-button-cta text-lg inline-flex items-center gap-2 cursor-pointer">
              <Download className="w-5 h-5" /> Get Free Label Pack
            </Link>
          </div>
        </div>
      </section>

      {/* Internal links back to Pillar + related Clusters */}
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
            <Link href="/esl-worksheets-beginners" className="clay-button text-sm cursor-pointer inline-flex items-center gap-1">ESL Worksheets <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
