import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms of Use for LanternELL printable teaching resources.',
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar links={[{ href: '/shop', label: 'Shop' }, { href: '/teaching-tips', label: 'Teaching Tips' }, { href: '/login', label: 'Sign In' }]} />
      <article className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto prose-lanternell">
          <h1 className="font-heading text-4xl font-bold text-text-primary mb-8">Terms of Use</h1>
          <p className="text-text-muted text-sm mb-8">Last updated: March 7, 2026</p>

          <h2 className="font-heading text-2xl font-semibold text-text-primary mt-10 mb-4">1. Acceptance of Terms</h2>
          <p className="text-text-primary leading-relaxed mb-4">By accessing and using LanternELL ("the Site"), you agree to be bound by these Terms of Use. If you do not agree, please do not use the Site.</p>

          <h2 className="font-heading text-2xl font-semibold text-text-primary mt-10 mb-4">2. License to Use Resources</h2>
          <p className="text-text-primary leading-relaxed mb-4">When you purchase or download resources from LanternELL, you receive a limited, non-exclusive, non-transferable license to use the materials for personal or single-classroom educational purposes only.</p>
          <p className="text-text-primary leading-relaxed mb-4">You may: print copies for your own classroom use, share printed copies with students in your classroom.</p>
          <p className="text-text-primary leading-relaxed mb-4">You may not: redistribute, resell, or share digital files with others; upload files to any website or shared drive; use resources for commercial purposes without a commercial license; claim authorship of the materials.</p>

          <h2 className="font-heading text-2xl font-semibold text-text-primary mt-10 mb-4">3. Accounts</h2>
          <p className="text-text-primary leading-relaxed mb-4">You are responsible for maintaining the security of your account. You must provide accurate information when creating an account. We reserve the right to suspend accounts that violate these terms.</p>

          <h2 className="font-heading text-2xl font-semibold text-text-primary mt-10 mb-4">4. Payments</h2>
          <p className="text-text-primary leading-relaxed mb-4">All payments are processed securely through Stripe. Prices are listed in USD. You agree to pay all charges associated with your purchases.</p>

          <h2 className="font-heading text-2xl font-semibold text-text-primary mt-10 mb-4">5. Intellectual Property</h2>
          <p className="text-text-primary leading-relaxed mb-4">All content on LanternELL, including text, graphics, templates, and PDF resources, is the intellectual property of LanternELL and is protected by copyright law.</p>

          <h2 className="font-heading text-2xl font-semibold text-text-primary mt-10 mb-4">6. Disclaimer</h2>
          <p className="text-text-primary leading-relaxed mb-4">Resources are provided "as is" for educational purposes. LanternELL makes no warranties regarding the suitability of materials for any specific educational outcome.</p>

          <h2 className="font-heading text-2xl font-semibold text-text-primary mt-10 mb-4">7. Changes to Terms</h2>
          <p className="text-text-primary leading-relaxed mb-4">We may update these terms from time to time. Continued use of the Site after changes constitutes acceptance of the new terms.</p>

          <h2 className="font-heading text-2xl font-semibold text-text-primary mt-10 mb-4">8. Contact</h2>
          <p className="text-text-primary leading-relaxed mb-4">For questions about these terms, please contact us at support@lanternell.com.</p>
        </div>
      </article>
      <Footer />
    </main>
  )
}
