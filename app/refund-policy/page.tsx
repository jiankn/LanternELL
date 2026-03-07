import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Refund Policy for LanternELL printable teaching resources.',
  alternates: { canonical: '/refund-policy' },
}

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar links={[{ href: '/shop', label: 'Shop' }, { href: '/teaching-tips', label: 'Teaching Tips' }, { href: '/login', label: 'Sign In' }]} />
      <article className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto prose-lanternell">
          <h1 className="font-heading text-4xl font-bold text-text-primary mb-8">Refund Policy</h1>
          <p className="text-text-muted text-sm mb-8">Last updated: March 8, 2026</p>

          <h2 className="font-heading text-2xl font-semibold text-text-primary mt-10 mb-4">No Refunds on Digital Products</h2>
          <p className="text-text-primary leading-relaxed mb-4">
            All sales of digital downloads are final. Because our resources are delivered instantly and cannot be returned once downloaded, we do not offer refunds on individual packs or bundles.
          </p>
          <p className="text-text-primary leading-relaxed mb-4">
            We encourage you to download our free sample packs before purchasing to ensure the resources meet your needs. Free samples are available on every product page and at <a href="/shop" className="text-primary hover:underline">lanternell.com/shop</a>.
          </p>

          <h2 className="font-heading text-2xl font-semibold text-text-primary mt-10 mb-4">Exceptions</h2>
          <p className="text-text-primary leading-relaxed mb-4">
            We will issue a full refund in the following cases:
          </p>
          <ul className="list-disc pl-6 text-text-primary leading-relaxed mb-4 space-y-2">
            <li>You were charged more than once for the same order (duplicate charge)</li>
            <li>The file is corrupted or cannot be opened and we are unable to provide a working replacement</li>
            <li>The product content is materially different from what was described on the product page</li>
          </ul>
          <p className="text-text-primary leading-relaxed mb-4">
            To report an issue, email us at <a href="mailto:support@lanternell.com" className="text-primary hover:underline">support@lanternell.com</a> within 7 days of purchase with your order number and a description of the problem.
          </p>

          <h2 className="font-heading text-2xl font-semibold text-text-primary mt-10 mb-4">Subscriptions</h2>
          <p className="text-text-primary leading-relaxed mb-4">
            You may cancel your All Access subscription at any time from your account settings. Upon cancellation, you retain access until the end of your current billing period. We do not provide refunds for partial billing periods.
          </p>

          <h2 className="font-heading text-2xl font-semibold text-text-primary mt-10 mb-4">Contact</h2>
          <p className="text-text-primary leading-relaxed mb-4">
            Questions? Email us at <a href="mailto:support@lanternell.com" className="text-primary hover:underline">support@lanternell.com</a>.
          </p>
        </div>
      </article>
      <Footer />
    </main>
  )
}
