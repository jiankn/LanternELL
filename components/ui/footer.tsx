import Link from 'next/link'
import Image from 'next/image'

interface FooterProps {
  /** Minimal footer with just copyright */
  minimal?: boolean
}

export function Footer({ minimal = false }: FooterProps) {
  if (minimal) {
    return (
      <footer className="bg-white/80 border-t border-white/40 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-sm text-text-muted">
          © {new Date().getFullYear()} LanternELL. All rights reserved.
        </div>
      </footer>
    )
  }

  return (
    <footer className="bg-white/80 border-t border-white/40 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Column 1: Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4 group inline-flex">
              <div className="relative w-10 h-10 overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105">
                <Image src="/images/logo.webp" alt="LanternELL Logo" fill className="object-contain" />
              </div>
              <span className="font-heading text-xl font-bold text-text-primary tracking-tight">LanternELL</span>
            </Link>
            <p className="text-sm text-text-primary/70 mb-4">
              Print-ready bilingual & ELL resources for real classrooms.
            </p>
            <ul className="space-y-2 text-sm text-text-primary/70">
              <li><Link href="/shop" className="hover:text-primary transition-colors cursor-pointer">All Packs</Link></li>
              <li><Link href="/free-samples" className="hover:text-primary transition-colors cursor-pointer">Free Samples</Link></li>
              <li><Link href="/teaching-tips" className="hover:text-primary transition-colors cursor-pointer">Teaching Tips</Link></li>
              <li><Link href="/pricing" className="hover:text-primary transition-colors cursor-pointer">Pricing</Link></li>
            </ul>
          </div>

          {/* Column 2: ESL Worksheets cluster */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">ESL Worksheets</h4>
            <ul className="space-y-2 text-sm text-text-primary/70">
              <li><Link href="/ell-worksheets" className="hover:text-primary transition-colors cursor-pointer">ELL Worksheets</Link></li>
              <li><Link href="/esl-worksheets-beginners" className="hover:text-primary transition-colors cursor-pointer">ESL for Beginners</Link></li>
              <li><Link href="/kindergarten-esl-worksheets" className="hover:text-primary transition-colors cursor-pointer">Kindergarten ESL</Link></li>
              <li><Link href="/esl-vocabulary-worksheets" className="hover:text-primary transition-colors cursor-pointer">ESL Vocabulary</Link></li>
              <li><Link href="/esl-reading-worksheets" className="hover:text-primary transition-colors cursor-pointer">ESL Reading</Link></li>
              <li><Link href="/esl-writing-worksheets" className="hover:text-primary transition-colors cursor-pointer">ESL Writing</Link></li>
              <li><Link href="/vocabulary-worksheets" className="hover:text-primary transition-colors cursor-pointer">Vocabulary Worksheets</Link></li>
            </ul>
          </div>

          {/* Column 3: Bilingual & Spanish cluster */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Bilingual & Spanish</h4>
            <ul className="space-y-2 text-sm text-text-primary/70">
              <li><Link href="/bilingual-flashcards" className="hover:text-primary transition-colors cursor-pointer">Bilingual Flashcards</Link></li>
              <li><Link href="/spanish-flashcards" className="hover:text-primary transition-colors cursor-pointer">Spanish Flashcards</Link></li>
              <li><Link href="/bilingual-classroom-labels" className="hover:text-primary transition-colors cursor-pointer">Bilingual Labels</Link></li>
              <li><Link href="/dual-language-classroom" className="hover:text-primary transition-colors cursor-pointer">Dual Language</Link></li>
              <li><Link href="/spanish-english-worksheets" className="hover:text-primary transition-colors cursor-pointer">Spanish-English Worksheets</Link></li>
              <li><Link href="/english-spanish-printables" className="hover:text-primary transition-colors cursor-pointer">English-Spanish Printables</Link></li>
            </ul>
          </div>

          {/* Column 4: K & Newcomer cluster */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">K & Newcomer</h4>
            <ul className="space-y-2 text-sm text-text-primary/70">
              <li><Link href="/esl-activities-kindergarten" className="hover:text-primary transition-colors cursor-pointer">K ESL Activities</Link></li>
              <li><Link href="/newcomer-activities" className="hover:text-primary transition-colors cursor-pointer">Newcomer Activities</Link></li>
              <li><Link href="/visual-supports-ell" className="hover:text-primary transition-colors cursor-pointer">Visual Supports</Link></li>
            </ul>
            <h4 className="font-semibold text-text-primary mt-6 mb-4">Account</h4>
            <ul className="space-y-2 text-sm text-text-primary/70">
              <li><Link href="/login" className="hover:text-primary transition-colors cursor-pointer">Sign In</Link></li>
              <li><Link href="/account/library" className="hover:text-primary transition-colors cursor-pointer">My Library</Link></li>
            </ul>
          </div>

          {/* Column 5: Support */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-text-primary/70">
              <li><Link href="/contact" className="hover:text-primary transition-colors cursor-pointer">Contact Us</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors cursor-pointer">Terms of Use</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</Link></li>
              <li><Link href="/refund-policy" className="hover:text-primary transition-colors cursor-pointer">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-text-primary/10 text-center text-sm text-text-muted">
          © {new Date().getFullYear()} LanternELL. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
