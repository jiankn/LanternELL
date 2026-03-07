import Link from 'next/link'
import { GraduationCap } from 'lucide-react'

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
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-clay-sm">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="font-heading text-xl font-bold text-text-primary">LanternELL</span>
            </div>
            <p className="text-sm text-text-primary/70">
              Print-ready bilingual & ELL resources for real classrooms.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-text-primary mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-text-primary/70">
              <li><Link href="/shop" className="hover:text-primary transition-colors cursor-pointer">All Packs</Link></li>
              <li><Link href="/teaching-tips" className="hover:text-primary transition-colors cursor-pointer">Teaching Tips</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-text-primary mb-4">Account</h4>
            <ul className="space-y-2 text-sm text-text-primary/70">
              <li><Link href="/login" className="hover:text-primary transition-colors cursor-pointer">Sign In</Link></li>
              <li><Link href="/account/library" className="hover:text-primary transition-colors cursor-pointer">My Library</Link></li>
            </ul>
          </div>

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
