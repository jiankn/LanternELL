import Link from 'next/link'
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
  title: 'LanternELL — Printable ELL Worksheets & Bilingual Classroom Resources',
  description:
    'Print-ready ELL worksheets, bilingual classroom labels, visual supports, and multilingual teaching packs for Pre-K–8 teachers, SPED educators, and homeschool families. 6 languages. Just print and use today.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'LanternELL — Printable ELL Worksheets & Bilingual Resources',
    description: 'Print-ready bilingual & ELL resources for Pre-K–8 classrooms. 6 language pairs. Just print and use today.',
    url: BASE_URL,
  },
}

const packs = [
  { id: 1, title: 'Newcomer Survival Pack', description: 'Essential vocabulary and phrases for first-week ELL students in any grade', price: '$8.99', badge: 'Bestseller', icon: <Sparkles className="w-6 h-6" />, color: 'bg-amber-100', href: '/shop' },
  { id: 2, title: 'Classroom Labels — 6 Languages', description: 'Bilingual labels in Spanish, Chinese, Arabic, Vietnamese, French & Portuguese', price: '$5.99', badge: 'Popular', icon: <Globe className="w-6 h-6" />, color: 'bg-emerald-100', href: '/shop' },
  { id: 3, title: 'Visual Supports Pack', description: 'Visual schedules, emotion cards, and behavior charts for ELL & SPED students', price: '$5.99', badge: 'New', icon: <BookOpen className="w-6 h-6" />, color: 'bg-blue-100', href: '/shop' },
  { id: 4, title: 'Parent Communication', description: 'Bilingual notes for home-school communication in multiple languages', price: '$3.99', badge: null, icon: <Heart className="w-6 h-6" />, color: 'bg-rose-100', href: '/shop' },
]

const testimonials = [
  { id: 1, name: 'Sarah M.', role: '2nd Grade ESL Teacher', avatar: 'SM', content: 'These packs saved me hours of prep time. My newcomer students love the visual supports.', rating: 5 },
  { id: 2, name: 'Miguel R.', role: 'Dual Language 5th Grade', avatar: 'MR', content: 'The multilingual classroom labels are a game-changer. Finally resources in the languages my students actually speak.', rating: 5 },
  { id: 3, name: 'Jennifer L.', role: 'SPED Paraprofessional', avatar: 'JL', content: 'The visual supports work perfectly for my students with IEPs. I use them alongside the ELL vocabulary packs.', rating: 5 },
  { id: 4, name: 'Priya K.', role: 'Homeschool Parent', avatar: 'PK', content: 'My kids are learning English at home and these packs make it so easy. Just print and go.', rating: 5 },
]

const stats = [
  { value: '50+', label: 'Printable Packs' },
  { value: '6', label: 'Language Pairs' },
  { value: 'Pre-K–8', label: 'Grade Levels' },
  { value: 'Free', label: 'Sample Downloads' },
]

const faqs = [
  { question: 'What grade levels are these ELL worksheets for?', answer: 'Our printable packs cover Pre-K through 8th grade. Each pack is labeled with the target age band so you can find the right level for your students.' },
  { question: 'What languages do you support?', answer: 'We currently offer resources in 6 language pairs: English-Spanish, English-Chinese, English-Arabic, English-Vietnamese, English-French, and English-Portuguese — the top languages spoken by ELL students in the US.' },
  { question: 'Can I use these for special education students?', answer: 'Yes. Our visual supports packs are designed for both ELL newcomers and students with IEPs/504 plans. The visual scaffolding, simplified language, and structured formats work well across both populations.' },
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
            Print-Ready ELL Worksheets &<br />
            <span className="text-gradient">Bilingual Classroom Resources</span>
          </h1>

          <p className="text-lg sm:text-xl text-text-primary/80 max-w-2xl mx-auto mb-10">
            Save hours of prep time with ready-to-print ELL worksheets, visual supports, and bilingual teaching packs for Pre-K–8 classrooms. Available in 6 languages. Just print and use today.
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

      {/* H2: Multilingual Printable Teaching Packs */}
      <section id="courses" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Multilingual Printable Teaching Packs
            </h2>
            <p className="text-lg text-text-primary/70 max-w-2xl mx-auto">
              Ready-to-use <Link href="/shop" className="text-primary hover:underline">bilingual classroom resources</Link> in Spanish, Chinese, Arabic, Vietnamese, French & Portuguese for newcomer, ELL, and SPED students
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {packs.map((pack) => (
              <Link key={pack.id} href={pack.href} className="clay-card p-6 hover:-translate-y-1 transition-all duration-200 cursor-pointer group">
                <div className={`w-12 h-12 ${pack.color} rounded-xl flex items-center justify-center mb-4 text-primary`}>{pack.icon}</div>
                {pack.badge && <span className="inline-block px-3 py-1 bg-cta/10 text-cta text-xs font-semibold rounded-full mb-3">{pack.badge}</span>}
                <h3 className="font-heading text-lg font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors">{pack.title}</h3>
                <p className="text-sm text-text-primary/70 mb-4">{pack.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-heading text-xl font-bold text-primary">{pack.price}</span>
                  <span className="text-sm text-cta font-medium flex items-center gap-1 group-hover:gap-2 transition-all">Learn more <ArrowRight className="w-4 h-4" /></span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/shop" className="clay-button cursor-pointer inline-flex items-center">Browse All Packs <ArrowRight className="w-5 h-5 ml-2" /></Link>
            <Link href="/ell-worksheets" className="clay-button cursor-pointer inline-flex items-center ml-4">ELL Worksheets Guide <ArrowRight className="w-5 h-5 ml-2" /></Link>
          </div>
        </div>
      </section>

      {/* H2: ESL Newcomer Activities & Visual Supports for ELL and SPED */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary mb-4">
                Visual Supports for ELL & Special Education
              </h2>
              <p className="text-lg text-text-primary/70 mb-8">
                Our printable packs include visual schedules, emotion cards, and progress tracking tools designed for both <Link href="/teaching-tips" className="text-primary hover:underline">ELL newcomers</Link> and students with IEPs. Used by ESL teachers, SPED educators, paraprofessionals, and homeschool families across the US.
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
              <div key={t.id} className="clay-card p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-5 h-5 fill-cta text-cta" />)}
                </div>
                <p className="text-text-primary mb-6 italic">"{t.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">{t.avatar}</div>
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
          <div className="clay-card p-8 sm:p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-cta to-[#ea580c] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-clay-button">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Bilingual Classroom Labels & Sentence Frames
            </h2>
            <p className="text-lg text-text-primary/70 mb-8 max-w-xl mx-auto">
              Get instant access to our complete library of <Link href="/shop" className="text-primary hover:underline">printable ELL resources</Link>. New packs added weekly.
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
            <p className="text-text-primary/70 mb-6">
              Subscribe to get 3 free printable packs and be the first to know about new <Link href="/teaching-tips" className="text-primary hover:underline">teaching tips</Link> and resources.
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
