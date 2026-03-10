import Link from 'next/link'
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/footer'
import { CheckCircle, Download, ArrowRight, Users, Heart, Globe, BookOpen, Sparkles, Clock } from 'lucide-react'
import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lanternell.com'

export const metadata: Metadata = {
  title: 'Newcomer Activities — Free ELL Newcomer Resources for K-5 Teachers',
  description:
    'Free printable newcomer activities for ELL students in K-5 classrooms. Download first-week survival packs, welcome materials, and orientation activities for newcomer English Language Learners. Bilingual English-Spanish resources included.',
  keywords: [
    'newcomer activities',
    'ELL newcomer activities',
    'newcomer ELL resources',
    'newcomer student activities',
    'first week ELL activities',
    'newcomer welcome activities',
    'ESL newcomer resources',
    'newcomer orientation activities',
  ],
  alternates: { canonical: '/newcomer-activities' },
  openGraph: {
    title: 'Newcomer Activities — Free ELL Newcomer Resources for K-5',
    description: 'Free printable newcomer activities for ELL students in K-5 classrooms.',
    url: `${BASE_URL}/newcomer-activities`,
    images: [{ url: `${BASE_URL}/images/og-newcomer.png`, width: 1200, height: 630, alt: 'Newcomer Activities for ELL Students' }],
  },
  robots: { index: true, follow: true },
}

const activityTypes = [
  { name: 'First-Week Survival Pack', icon: Sparkles, desc: 'Essential vocabulary, classroom phrases, and visual guides for the first days of school. Available in English-Spanish.' },
  { name: 'Welcome & Orientation', icon: Heart, desc: 'Welcome letters, school tour guides, and "about me" activities that help newcomers feel safe and included.' },
  { name: 'Buddy System Materials', icon: Users, desc: 'Peer buddy guides, conversation starters, and partner activities that connect newcomers with classmates.' },
  { name: 'Survival Vocabulary Cards', icon: Globe, desc: 'Picture-word cards for essential school vocabulary — bathroom, water, help, nurse, lunch — in English and Spanish.' },
]

export default function NewcomerActivitiesPage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Newcomer Activities', item: `${BASE_URL}/newcomer-activities` },
    ],
  }
  const webPageJsonLd = {
    '@context': 'https://schema.org', '@type': 'WebPage',
    name: 'Newcomer Activities', description: metadata.description,
    url: `${BASE_URL}/newcomer-activities`, breadcrumb: breadcrumbJsonLd,
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
            <span className="text-text-primary font-medium">Newcomer Activities</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-clay-sm mb-6">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-text-primary">Newcomer Support</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-text-primary mb-6">
            Newcomer Activities for ELL Students in K-5 Classrooms
          </h1>
          <p className="text-lg text-text-primary/70 max-w-2xl mx-auto mb-8">
            Download free newcomer activities designed to help ELL students feel welcome and start learning from day one. Our newcomer resources include first-week survival packs, welcome materials, buddy system guides, and survival vocabulary cards — all with bilingual English-Spanish support. Created by teachers who have welcomed hundreds of newcomer students into their classrooms.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/shop" className="clay-button-cta text-lg flex items-center gap-2 cursor-pointer">
              <Download className="w-5 h-5" /> Download Newcomer Pack
            </Link>
            <Link href="/ell-worksheets" className="clay-button text-lg cursor-pointer">Browse All ELL Resources</Link>
          </div>
        </div>
      </section>

      {/* H2: Newcomer Activity Packs for the First Week */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">Newcomer Activity Packs for the First Week</h2>
          <p className="text-text-primary/80 leading-relaxed mb-8">
            The first week is critical for newcomer ELL students. Everything is unfamiliar — the language, the routines, the building, the people. Our first-week newcomer activity packs give teachers a structured plan for making those first days as smooth and welcoming as possible. Each pack includes daily activities, survival vocabulary cards, and visual guides that help newcomers navigate their new school.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {activityTypes.map((type) => (
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

      {/* H2: How to Welcome a Newcomer Student */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">How to Welcome a Newcomer Student to Your Classroom</h2>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            Welcoming a newcomer student requires preparation and intentionality. The goal is to create a safe, predictable environment where the student can begin to feel comfortable before academic demands increase. Here are strategies used by experienced ELL teachers across the country:
          </p>
          <div className="space-y-4 mb-6">
            {[
              { title: 'Prepare a welcome kit', desc: 'Include a bilingual welcome letter, a visual schedule, survival vocabulary cards, and a small personal item like a pencil case with their name.' },
              { title: 'Assign a buddy', desc: 'Pair the newcomer with a bilingual student or a kind, patient classmate. Provide the buddy with conversation starter cards.' },
              { title: 'Label the classroom', desc: 'Ensure bilingual classroom labels are visible on furniture, supplies, and areas. This gives newcomers immediate vocabulary access.' },
              { title: 'Simplify the first day', desc: 'Focus on routines, not academics. Teach bathroom, water, lunch, and help. Use visual supports for every instruction.' },
              { title: 'Connect with the family', desc: 'Send home a bilingual welcome packet. Include school information, contact details, and a simple "about our classroom" guide.' },
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
            Our <Link href="/bilingual-classroom-labels" className="text-primary hover:underline">bilingual classroom labels</Link> and <Link href="/visual-supports-ell" className="text-primary hover:underline">visual supports</Link> are the perfect complement to these welcome strategies.
          </p>
        </div>
      </section>

      {/* H2: Survival Vocabulary for ELL Newcomers */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">Survival Vocabulary for ELL Newcomers</h2>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            Before newcomer students can engage with academic content, they need survival vocabulary — the essential words and phrases that allow them to navigate the school day safely. Our survival vocabulary cards cover the most critical words: bathroom, water, help, nurse, lunch, stop, yes, no, please, thank you, and more. Each card features a clear illustration, the English word, and the Spanish translation.
          </p>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            Teachers typically introduce 5-10 survival words on the first day and add more throughout the first week. Students keep their personal set of cards on a ring or in a pocket chart at their desk for quick reference. Many teachers report that newcomer students begin using these words independently within the first few days.
          </p>
          <p className="text-text-primary/80 leading-relaxed">
            For a broader vocabulary-building approach beyond survival words, explore our <Link href="/ell-worksheets" className="text-primary hover:underline">ELL worksheets</Link> with thematic vocabulary packs covering school, home, food, animals, and more.
          </p>
        </div>
      </section>

      {/* H2: Newcomer Activities for Different Grade Levels */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">Newcomer Activities for Different Grade Levels</h2>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            A kindergarten newcomer has very different needs than a fifth-grade newcomer. Our activity packs are differentiated by grade band to ensure age-appropriate content and expectations. K-1 newcomer packs focus on basic routines, colors, numbers, and classroom objects with heavy visual support. Grades 2-3 packs add simple reading and writing activities with sentence frames. Grades 4-5 packs include academic vocabulary introduction and content-area survival phrases.
          </p>
          <p className="text-text-primary/80 leading-relaxed">
            For ongoing support beyond the first week, our <Link href="/esl-worksheets-beginners" className="text-primary hover:underline">ESL worksheets for beginners</Link> provide structured practice that builds on the foundation established during the newcomer period.
          </p>
        </div>
      </section>

      {/* H2: Building a Newcomer-Friendly Classroom */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">Building a Newcomer-Friendly Classroom Environment</h2>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            A newcomer-friendly classroom goes beyond having the right materials — it requires a culture of inclusion and patience. The physical environment should include bilingual labels, visual schedules, and a designated quiet space where overwhelmed students can take a break. The social environment should include structured peer interactions, predictable routines, and explicit teaching of classroom expectations using visual supports.
          </p>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            Teachers who consistently welcome newcomer students recommend keeping a &quot;newcomer kit&quot; ready at all times — because new students can arrive any day of the year. The kit should include survival vocabulary cards, a visual schedule, a bilingual welcome letter, and basic school supplies. Having this ready means you can welcome a new student with confidence, even on short notice.
          </p>
          <p className="text-text-primary/80 leading-relaxed">
            For more ideas on creating an effective bilingual learning environment, browse our <Link href="/english-spanish-printables" className="text-primary hover:underline">English-Spanish printables</Link> for parent communication templates and classroom setup materials.
          </p>
        </div>
      </section>

      {/* H2: Download Free Newcomer Activities */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">Download Free Newcomer Activities</h2>
          <p className="text-text-primary/80 leading-relaxed mb-6">
            Get started with our free newcomer activity sampler, which includes a set of survival vocabulary cards, a visual daily schedule, and a bilingual welcome letter template. Premium packs include complete first-week plans with daily activities, buddy system materials, family communication templates, and progress monitoring tools.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {['First-week daily activity plans', 'Bilingual English-Spanish materials', 'Survival vocabulary card sets', 'Free sampler pack available', 'Buddy system guides included', 'Family welcome packet templates'].map((b) => (
              <div key={b} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-text-primary">{b}</span>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/shop" className="clay-button-cta text-lg inline-flex items-center gap-2 cursor-pointer">
              <Download className="w-5 h-5" /> Get Free Newcomer Pack
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
            <Link href="/esl-worksheets-beginners" className="clay-button text-sm cursor-pointer inline-flex items-center gap-1">ESL Worksheets <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
