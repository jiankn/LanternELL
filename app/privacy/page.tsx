import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for LanternELL — how we collect, use, and protect your data.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar links={[{ href: '/shop', label: 'Shop' }, { href: '/teaching-tips', label: 'Teaching Tips' }, { href: '/login', label: 'Sign In' }]} />
      <article className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto prose-lanternell">
          <h1 className="font-heading text-4xl font-bold text-text-primary mb-8">Privacy Policy</h1>
          <p className="text-text-muted text-sm mb-8">Last updated: March 7, 2026</p>

          <h2 className="font-heading text-2xl font-semibold text-text-primary mt-10 mb-4">1. Information We Collect</h2>
          <p className="text-text-primary leading-relaxed mb-4">We collect information you provide directly: email address when creating an account or subscribing to our newsletter, payment information processed securely by Stripe (we do not store card details), and usage data such as pages visited and resources downloaded.</p>

          <h2 className="font-heading text-2xl font-semibold text-text-primary mt-10 mb-4">2. How We Use Your Information</h2>
          <p className="text-text-primary leading-relaxed mb-4">We use your information to: provide and deliver purchased resources, send order confirmations and download links, improve our products and services, send occasional newsletters (you can unsubscribe anytime), and comply with legal obligations.</p>

          <h2 className="font-heading text-2xl font-semibold text-text-primary mt-10 mb-4">3. Data Sharing</h2>
          <p className="text-text-primary leading-relaxed mb-4">We do not sell your personal information. We share data only with: Stripe for payment processing, Resend for transactional emails, and Cloudflare for hosting and content delivery. These providers process data only as necessary to provide their services.</p>

          <h2 className="font-heading text-2xl font-semibold text-text-primary mt-10 mb-4">4. Cookies</h2>
          <p className="text-text-primary leading-relaxed mb-4">We use essential cookies for authentication (session cookies). We use Plausible Analytics, which is privacy-friendly and does not use cookies or collect personal data.</p>

          <h2 className="font-heading text-2xl font-semibold text-text-primary mt-10 mb-4">5. Data Security</h2>
          <p className="text-text-primary leading-relaxed mb-4">We implement appropriate security measures including encrypted connections (HTTPS), hashed authentication tokens, and secure payment processing through Stripe.</p>

          <h2 className="font-heading text-2xl font-semibold text-text-primary mt-10 mb-4">6. Your Rights</h2>
          <p className="text-text-primary leading-relaxed mb-4">You have the right to: access your personal data, request deletion of your account and data, opt out of marketing emails, and request a copy of your data. To exercise these rights, contact us at support@lanternell.com.</p>

          <h2 className="font-heading text-2xl font-semibold text-text-primary mt-10 mb-4">7. Children's Privacy</h2>
          <p className="text-text-primary leading-relaxed mb-4">LanternELL is designed for educators and parents. We do not knowingly collect information from children under 13. Our resources are intended to be used by adults with children in educational settings.</p>

          <h2 className="font-heading text-2xl font-semibold text-text-primary mt-10 mb-4">8. Changes to This Policy</h2>
          <p className="text-text-primary leading-relaxed mb-4">We may update this policy from time to time. We will notify you of significant changes via email or a notice on our Site.</p>

          <h2 className="font-heading text-2xl font-semibold text-text-primary mt-10 mb-4">9. Contact</h2>
          <p className="text-text-primary leading-relaxed mb-4">For privacy-related questions, contact us at support@lanternell.com.</p>
        </div>
      </article>
      <Footer />
    </main>
  )
}
