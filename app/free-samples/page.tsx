import Link from 'next/link'
import Image from 'next/image'
import {
    Download,
    ArrowRight,
    BookOpen,
    Globe,
    Sparkles,
    Heart,
    CheckCircle,
    Mail,
} from 'lucide-react'
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/footer'
import { EmailCapture } from '@/components/ui/email-capture'
import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lanternell.com'

export const metadata: Metadata = {
    title: 'Free ELL Worksheets & Sample Packs — Download Now | LanternELL',
    description:
        'Download free printable ELL worksheets and sample teaching packs. Bilingual English-Spanish vocabulary cards, classroom labels, and sentence frames for K-5 newcomer students. No account required.',
    alternates: { canonical: '/free-samples' },
    openGraph: {
        title: 'Free ELL Worksheets & Sample Packs — LanternELL',
        description:
            'Free printable ELL resources for K-5 classrooms. Download bilingual vocabulary cards, classroom labels, and more.',
        url: `${BASE_URL}/free-samples`,
        images: [
            {
                url: `${BASE_URL}/images/og-home.png`,
                width: 1200,
                height: 630,
                alt: 'Free ELL Worksheets and Sample Packs',
            },
        ],
    },
}

const freeSamples = [
    {
        id: 1,
        title: 'Classroom Objects — Sample Vocabulary Cards',
        description: 'A free sample set of 6 bilingual vocabulary cards with pictures, English-Spanish labels, and tracing lines. From our Classroom Objects Vocabulary Pack (K-2).',
        gradeLevel: 'K-2',
        packType: 'Vocabulary',
        pages: '4 pages',
        image: '/images/products/classroom-objects-vocab-k2.webp',
        fullPackHref: '/shop/classroom-objects-vocabulary-pack-k-2-en-es',
    },
    {
        id: 2,
        title: 'Greetings & Introductions — Sample Sentence Frames',
        description: 'Free printable sentence starters for newcomer students: "My name is ___", "I am from ___", "I speak ___". Bilingual English-Spanish.',
        gradeLevel: 'K-2',
        packType: 'Sentence Frames',
        pages: '3 pages',
        image: '/images/products/greetings-sentences-k2.webp',
        fullPackHref: '/shop/basic-greetings-sentence-frames-k-2-en-es',
    },
    {
        id: 3,
        title: 'Classroom Areas — Sample Bilingual Labels',
        description: 'Free set of 8 bilingual English-Spanish labels for key classroom areas: library, door, window, teacher desk, and more. Ready to print and laminate.',
        gradeLevel: 'K-2',
        packType: 'Labels',
        pages: '2 pages',
        image: '/images/products/areas-labels-k2.webp',
        fullPackHref: '/shop/classroom-areas-classroom-labels-k-2-en-es',
    },
    {
        id: 4,
        title: 'Colors & Shapes — Sample Matching Worksheet',
        description: 'A free matching worksheet from our Colors Vocabulary Pack. Students match English-Spanish color words to colored objects.',
        gradeLevel: 'K-2',
        packType: 'Vocabulary',
        pages: '2 pages',
        image: '/images/products/colors-vocab-k2.webp',
        fullPackHref: '/shop/colors-vocabulary-pack-k-2-en-es',
    },
    {
        id: 5,
        title: 'Science Vocabulary — Sample Cards (Grade 3-5)',
        description: 'Free sample of 6 bilingual science vocabulary cards covering basic lab equipment and scientific terms for upper elementary ELL students.',
        gradeLevel: '3-5',
        packType: 'Vocabulary',
        pages: '3 pages',
        image: '/images/products/science-vocab-35.webp',
        fullPackHref: '/shop/science-vocabulary-vocabulary-pack-3-5-en-es',
    },
    {
        id: 6,
        title: 'Welcome Letter — Sample Parent Communication',
        description: 'A free bilingual welcome letter template for the first day of school. Introduces the teacher and classroom expectations in English and Spanish.',
        gradeLevel: 'K-8',
        packType: 'Parent Communication',
        pages: '2 pages',
        image: '/images/products/welcome-letter-parent.webp',
        fullPackHref: '/shop/welcome-letter-parent-communication-k-2-en-es',
    },
]

const benefits = [
    'No account required — instant download',
    'Print-ready US Letter & A4 PDF format',
    'Bilingual English-Spanish content',
    'Designed for ELL newcomer students',
    'Teacher-reviewed and classroom-tested',
    'Preview the quality of our premium packs',
]

export default function FreeSamplesPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Free ELL Worksheets & Sample Packs',
        description: metadata.description,
        url: `${BASE_URL}/free-samples`,
        publisher: { '@type': 'Organization', name: 'LanternELL' },
    }

    return (
        <main className="min-h-screen bg-background">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <Navbar
                links={[
                    { href: '/shop', label: 'Packs' },
                    { href: '/free-samples', label: 'Free Samples', active: true },
                    { href: '/teaching-tips', label: 'Teaching Tips' },
                    { href: '/login', label: 'Sign In' },
                ]}
            />

            {/* Breadcrumb */}
            <div className="pt-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <nav className="flex items-center gap-2 text-sm text-text-muted mb-4" aria-label="Breadcrumb">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <span aria-hidden="true">/</span>
                        <span className="text-text-primary font-medium">Free Samples</span>
                    </nav>
                </div>
            </div>

            {/* Hero */}
            <section className="pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-clay-sm mb-6">
                        <Download className="w-4 h-4 text-cta" />
                        <span className="text-sm font-medium text-text-primary">100% Free — No Account Required</span>
                    </div>
                    <h1 className="font-heading text-4xl sm:text-5xl font-bold text-text-primary mb-6">
                        Free ELL Worksheets &{' '}
                        <span className="text-gradient">Sample Packs</span>
                    </h1>
                    <p className="text-lg text-text-primary/70 max-w-2xl mx-auto">
                        Try before you buy. Download free sample pages from our most popular teaching packs — bilingual vocabulary cards, classroom labels, sentence frames, and parent communication templates. All in English-Spanish for K-8 classrooms.
                    </p>
                </div>
            </section>

            {/* Benefits */}
            <section className="px-4 sm:px-6 lg:px-8 pb-12">
                <div className="max-w-4xl mx-auto">
                    <div className="clay-card p-6 sm:p-8">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {benefits.map((benefit) => (
                                <div key={benefit} className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span className="text-sm text-text-primary">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Free Samples Grid */}
            <section className="px-4 sm:px-6 lg:px-8 pb-16">
                <div className="max-w-7xl mx-auto">
                    <h2 className="font-heading text-3xl font-bold text-text-primary mb-8 text-center">
                        Download Free Sample Pages
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {freeSamples.map((sample) => (
                            <div key={sample.id} className="clay-card overflow-hidden flex flex-col">
                                {/* Cover Image */}
                                <div className="relative h-44 w-full bg-slate-50">
                                    <Image
                                        src={sample.image}
                                        alt={`${sample.title} — Free ELL teaching resource`}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute top-3 left-3">
                                        <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                            FREE
                                        </span>
                                    </div>
                                    <div className="absolute top-3 right-3">
                                        <span className="bg-white/90 text-text-primary text-xs font-medium px-2 py-1 rounded-full">
                                            {sample.gradeLevel}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex flex-col flex-grow">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                            {sample.packType}
                                        </span>
                                        <span className="text-xs text-text-muted">{sample.pages}</span>
                                    </div>
                                    <h3 className="font-heading text-lg font-semibold text-text-primary mb-2 line-clamp-2">
                                        {sample.title}
                                    </h3>
                                    <p className="text-sm text-text-primary/70 mb-4 flex-grow line-clamp-3">
                                        {sample.description}
                                    </p>

                                    {/* Actions */}
                                    <div className="space-y-2 mt-auto">
                                        <a
                                            href={`/api/download/sample/${sample.fullPackHref.split('/').pop()}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="clay-button-cta w-full text-sm flex items-center justify-center gap-2 cursor-pointer"
                                            title="Download free sample PDF"
                                        >
                                            <Download className="w-4 h-4" /> Download Free PDF
                                        </a>
                                        <Link
                                            href={sample.fullPackHref}
                                            className="block text-center text-xs text-primary hover:underline"
                                        >
                                            View Full Pack →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA — Upgrade to Premium */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="clay-card p-8 sm:p-12">
                        <Sparkles className="w-10 h-10 text-cta mx-auto mb-4" />
                        <h2 className="font-heading text-3xl font-bold text-text-primary mb-4">
                            Ready for the Full Teaching Packs?
                        </h2>
                        <p className="text-text-primary/70 mb-8 max-w-xl mx-auto">
                            Each premium pack includes 8-15 pages: vocabulary cards, matching worksheets, tracing activities, mini-books, teacher guides, and answer keys. Available as single packs, bundles, or unlimited All Access membership.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/shop" className="clay-button-cta text-lg cursor-pointer">
                                Browse All Packs
                            </Link>
                            <Link href="/pricing" className="clay-button text-lg cursor-pointer">
                                View Pricing
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="clay-card p-8 sm:p-10">
                        <Mail className="w-10 h-10 text-primary mx-auto mb-4" />
                        <h2 className="font-heading text-2xl font-bold text-text-primary mb-4">
                            Get More Free Resources
                        </h2>
                        <p className="text-sm text-text-primary/70 mb-4">
                            Subscribe to receive new free samples, teaching tips, and early access to new packs.
                        </p>
                        <EmailCapture />
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
