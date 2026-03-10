import Link from 'next/link'
import Image from 'next/image'
import {
  BookOpen,
  Download,
  Star,
  CheckCircle,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Globe,
  Heart,
  Mail
} from 'lucide-react'
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/footer'
import type { Metadata } from 'next'
import { EmailCapture } from '@/components/ui/email-capture'
import { FaqAccordion } from '@/components/ui/faq-accordion'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lanternell.com'

export const metadata: Metadata = {
  title: 'ELL Worksheets — Printable Bilingual Resources for K-5 Teachers | LanternELL',
  description:
    'Free & premium ELL worksheets for newcomer students. Print-ready bilingual resources in English-Spanish for K-5 classrooms. Download ELL worksheets, classroom labels, visual supports & sentence frames today.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'ELL Worksheets — Printable Bilingual Resources for K-5 Teachers',
    description: 'Free & premium ELL worksheets for newcomer students. Print-ready bilingual resources in English-Spanish for K-5 classrooms.',
    url: BASE_URL,
    images: [
      {
        url: `${BASE_URL}/images/og-home.png`,
        width: 1200,
        height: 630,
        alt: 'LanternELL - ELL Worksheets and Bilingual Classroom Resources',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ELL Worksheets — Printable Bilingual Resources for K-5 Teachers',
    description: 'Free & premium ELL worksheets for newcomer students. Print-ready bilingual resources in English-Spanish for K-5 classrooms.',
    images: [`${BASE_URL}/images/og-home.png`],
  },
}

const packs = [
  { id: 1, title: 'Newcomer Survival Pack', description: 'Essential vocabulary and phrases for first-week ELL students in any grade', price: '$8.99', badge: 'Bestseller', image: '/images/categories/cat-vocabulary.webp', href: '/shop' },
  { id: 2, title: 'Classroom Labels — English-Spanish', description: 'Bilingual labels for classroom furniture, supplies, areas, and daily routines', price: '$3.99', badge: 'Popular', image: '/images/categories/cat-labels.webp', href: '/shop' },
  { id: 3, title: 'Sentence Frames Pack', description: 'Bilingual sentence starters, dialogue strips, and speaking prompts for ELL newcomers', price: '$5.99', badge: 'New', image: '/images/categories/cat-sentence.webp', href: '/shop' },
  { id: 4, title: 'Parent Communication', description: 'Bilingual notes for home-school communication — welcome letters, homework notes, progress reports', price: '$3.99', badge: null, image: '/images/categories/cat-parents.webp', href: '/shop' },
]

const testimonials = [
  { id: 1, name: 'Sarah M.', role: '2nd Grade ESL Teacher', avatar: '/images/avatars/sarah.png', content: 'These packs saved me hours of prep time. My newcomer students love the visual supports.', rating: 5 },
  { id: 2, name: 'Miguel R.', role: 'Dual Language 5th Grade', avatar: '/images/avatars/miguel.png', content: 'The multilingual classroom labels are a game-changer. Finally resources in the languages my students actually speak.', rating: 5 },
  { id: 3, name: 'Jennifer L.', role: 'SPED Paraprofessional', avatar: '/images/avatars/jennifer.png', content: 'The visual supports work perfectly for my students with IEPs. I use them alongside the ELL vocabulary packs.', rating: 5 },
  { id: 4, name: 'Priya K.', role: 'Homeschool Parent', avatar: '/images/avatars/priya.png', content: 'My kids are learning English at home and these packs make it so easy. Just print and go.', rating: 5 },
]

const stats = [
  { value: '50+', label: 'Printable Packs' },
  { value: 'EN-ES', label: 'Bilingual Packs' },
  { value: 'K–5', label: 'Core Grades' },
  { value: 'Free', label: 'Sample Downloads' },
]

const faqs = [
  { question: 'What grade levels are these ELL worksheets for?', answer: 'Our core packs are designed for K-5 classrooms — the grades where ELL and newcomer support is most needed. We also have resources for Pre-K and grades 6-8. Each pack is labeled with the target age band so you can find the right level.' },
  { question: 'What languages do you support?', answer: 'Our first release focuses on English-Spanish bilingual resources — the most in-demand language pair for ELL classrooms in the US. More language pairs (Chinese, Arabic, Vietnamese, French, Portuguese) are planned for future updates.' },
  { question: 'Can I use these for special education students?', answer: 'Yes. Many of our visual supports packs work well for students with IEPs/504 plans alongside ELL newcomers. The visual scaffolding, simplified language, and structured formats are helpful across both populations.' },
  { question: 'What file formats do you offer?', answer: 'All resources are delivered as PDF files, formatted for US Letter (8.5" x 11") and A4, ready to print.' },
  { question: 'Can I use these bilingual resources in my classroom?', answer: 'Yes. Single-teacher licenses allow use in one classroom. School-wide licenses are also available for districts and programs.' },
  { question: 'Do you offer refunds?', answer: 'All digital download sales are final. We offer free sample packs so you can try before you buy. Exceptions apply for duplicate charges, corrupted files, or content materially different from the description — contact us within 7 days of purchase.' },
]

export default function LandingPage() {
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LanternELL',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description: 'Print-ready bilingual & ELL resources for real classrooms.',
    sameAs: [],
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }

  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <Navbar
        links={[
          { href: '/shop', label: 'Packs' },
          { href: '/teaching-tips', label: 'Teaching Tips' },
          { href: '/pricing', label: 'Pricing' },
          { href: '/login', label: 'Sign In' },
        ]}
      />

      {/* Hero — primary keyword: ELL newcomer worksheets */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-clay-sm mb-8">
            <Sparkles className="w-4 h-4 text-cta" />
            <span className="text-sm font-medium text-text-primary">Trusted by 10,000+ Teachers</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-6 leading-tight">
            ELL Worksheets &<br />
            <span className="text-gradient">Bilingual Classroom Resources</span>
          </h1>

          <p className="text-lg sm:text-xl text-text-primary/80 max-w-2xl mx-auto mb-10">
            Download free and premium ELL worksheets for newcomer students in K-5 classrooms. Our print-ready bilingual resources include ELL worksheets, classroom labels, visual supports, and sentence frames in English-Spanish. Perfect for ESL teachers, bilingual educators, and homeschool families. Just print and use today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/shop" className="clay-button-cta text-lg flex items-center gap-2 cursor-pointer">
              <Download className="w-5 h-5" /> Get Free Samples
            </Link>
            <Link href="/shop" className="clay-button text-lg flex items-center gap-2 cursor-pointer">
              View All Packs <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="clay-card-sm p-4">
                <div className="font-heading text-2xl sm:text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* H2: Printable ELL Worksheets & Teaching Packs */}
      <section id="courses" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Printable ELL Worksheets & Teaching Packs
            </h2>
            <p className="text-lg text-text-primary/70 max-w-2xl mx-auto">
              Ready-to-use <Link href="/ell-worksheets" className="text-primary hover:underline">ELL worksheets</Link>, <Link href="/bilingual-classroom-labels" className="text-primary hover:underline">bilingual classroom labels</Link>, <Link href="/visual-supports-ell" className="text-primary hover:underline">visual supports</Link>, and <Link href="/english-spanish-printables" className="text-primary hover:underline">English-Spanish printables</Link> — designed for K-5 ESL teachers, bilingual educators, and homeschool families
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {packs.map((pack) => (
              <Link key={pack.id} href={pack.href} className="clay-card overflow-hidden hover:-translate-y-1 transition-all duration-200 cursor-pointer group flex flex-col">
                <div className="relative h-48 w-full bg-slate-100">
                  <Image src={pack.image} alt={`${pack.title} - Printable ELL teaching pack for K-5 classrooms`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  {pack.badge && <span className="absolute top-3 right-3 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full shadow-sm">{pack.badge}</span>}
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-heading text-lg font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors line-clamp-1">{pack.title}</h3>
                  <p className="text-sm text-text-primary/70 mb-4 flex-grow line-clamp-2">{pack.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-heading text-xl font-bold text-primary">{pack.price}</span>
                    <span className="text-sm text-cta font-medium flex items-center gap-1 group-hover:gap-2 transition-all">View Pack <ArrowRight className="w-4 h-4" /></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/shop" className="clay-button cursor-pointer inline-flex items-center">Browse All ELL Worksheets & Packs <ArrowRight className="w-5 h-5 ml-2" /></Link>
            <Link href="/ell-worksheets" className="clay-button cursor-pointer inline-flex items-center ml-4">Free ELL Worksheets <ArrowRight className="w-5 h-5 ml-2" /></Link>
          </div>
        </div>
      </section>

      {/* H2: ESL Newcomer Activities & Visual Supports for ELL and SPED */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary mb-4">
                Visual Supports for ELL Newcomers & SPED Students
              </h2>
              <p className="text-lg text-text-primary/70 mb-8">
                Our printable packs include visual schedules, emotion cards, and progress tracking tools designed for <Link href="/newcomer-activities" className="text-primary hover:underline">ELL newcomers</Link> in K-5 classrooms. Also used by SPED educators, paraprofessionals, and homeschool families across the US. Browse our <Link href="/esl-worksheets-beginners" className="text-primary hover:underline">ESL worksheets for beginners</Link> and <Link href="/visual-supports-ell" className="text-primary hover:underline">visual supports for ELL students</Link>.
              </p>
              <div className="space-y-4">
                {['Vocabulary checklists for each pack', 'Student self-assessment cards', 'Teacher observation guides', 'Progress report templates'].map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-text-primary">{f}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <ProgressCard value={75} label="Vocabulary Mastered" color="#4F46E5" />
              <ProgressCard value={60} label="Reading Fluency" color="#F97316" />
              <ProgressCard value={90} label="Class Participation" color="#10B981" />
              <ProgressCard value={70} label="Writing Skills" color="#8B5CF6" />
            </div>
          </div>
        </div>
      </section>

      {/* H2: Trusted by ELL & Bilingual Teachers */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Trusted by ELL & Bilingual Teachers
            </h2>
            <p className="text-lg text-text-primary/70">Join thousands of educators who use LanternELL in their classrooms</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t) => (
              <div key={t.id} className="clay-card p-6 flex flex-col">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-5 h-5 fill-cta text-cta" />)}
                </div>
                <p className="text-text-primary mb-6 italic flex-grow">"{t.content}"</p>
                <div className="flex items-center gap-3 mt-auto">
                  <Image src={t.avatar} alt={t.name} width={48} height={48} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-text-primary">{t.name}</p>
                    <p className="text-sm text-text-muted">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* H2: Bilingual Classroom Labels & Sentence Frames */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="clay-card overflow-hidden">
            <div className="relative h-64 w-full">
              <Image
                src="/images/mockups/bundle-showcase.webp"
                alt="Complete K-8 ELL Teaching Pack bundle with bilingual classroom labels and sentence frames"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-8 sm:p-12 text-center">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary mb-4">
                Bilingual Classroom Labels & Sentence Frames
              </h2>
              <p className="text-lg text-text-primary/70 mb-8 max-w-xl mx-auto">
                Get instant access to our complete library of <Link href="/bilingual-classroom-labels" className="text-primary hover:underline">bilingual classroom labels</Link>, <Link href="/english-spanish-printables" className="text-primary hover:underline">English-Spanish printables</Link>, and ELL sentence frames. New packs added weekly.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <Link href="/shop" className="clay-button-cta text-lg cursor-pointer">Get All Access - $9/mo</Link>
                <Link href="/pricing" className="clay-button text-lg cursor-pointer">View Pricing Options</Link>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-text-muted">
                <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Free Samples Available</span>
                <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Cancel Anytime</span>
                <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Instant Download</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* H2: ELL Worksheets for Beginners — FAQ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary text-center mb-12">
            ELL Worksheets for Beginners — FAQ
          </h2>
          <FaqAccordion faqs={faqs} />
        </div>
      </section>

      {/* H2: Free ELL Teaching Resources — Newsletter */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="clay-card p-8 sm:p-10">
            <Mail className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary mb-4">
              Free ELL Teaching Resources
            </h2>
            <p className="text-sm text-text-primary/70">
              Subscribe to get 3 free printable packs and be the first to know about new <Link href="/teaching-tips" className="text-primary hover:underline">ELL teaching tips</Link>, <Link href="/ell-worksheets" className="text-primary hover:underline">free ELL worksheets</Link>, and bilingual classroom resources.
            </p>
            <EmailCapture />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function ProgressCard({ value, label, color }: { value: number; label: string; color: string }) {
  const circumference = 2 * Math.PI * 40
  const offset = circumference - (value / 100) * circumference
  return (
    <div className="clay-card-sm p-6 text-center">
      <div className="relative w-24 h-24 mx-auto mb-4">
        <svg className="w-24 h-24 transform -rotate-90" role="img" aria-label={`${label}: ${value}%`}>
          <circle cx="48" cy="48" r="40" stroke="#EEF2FF" strokeWidth="8" fill="none" />
          <circle cx="48" cy="48" r="40" stroke={color} strokeWidth="8" fill="none" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-heading text-2xl font-bold" style={{ color }}>{value}%</span>
        </div>
      </div>
      <p className="text-sm font-medium text-text-primary">{label}</p>
    </div>
  )
}
