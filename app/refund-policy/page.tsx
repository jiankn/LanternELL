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
          <p className="text-text-muted text-sm mb-8">Last updated: March 7, 2026</p>

          <h2 className="font-heading text-2xl font-semibold text-text-primary mt-10 mb-4">30-Day Money-Back Guarantee</h2>
          <p className="text-text-primary leading-relaxed mb-4">We want you to be completely satisfied with your purchase. If you are not happy with a resource, you may request a full refund within 30 days of purchase.</p>

          <h2 className="font-heading text-2xl font-semibold text-text-primary mt-10 mb-4">How to Request a Refund</h2>
          <p className="text-text-primary leading-relaxed mb-4">To request a refund, email us at support@lanternell.com with your order details. We will process your refund within 5-7 business days. Refunds are issued to the original payment method.</p>

          <h2 className="font-heading text-2xl font-semibold text-text-primary mt-10 mb-4">Subscriptions</h2>
          <p className="text-text-primary leading-relaxed mb-4">You may cancel your subscription at any time through your account settings. Upon cancellation, you will retain access until the end of your current billing period. Refunds for partial billing periods are not provided for subscriptions.</p>

          <h2 className="font-heading text-2xl font-semibold text-text-primary mt-10 mb-4">Free Resources</h2>
          <p className="text-text-primary leading-relaxed mb-4">Free resources do not require a refund as no payment is involved.</p>

          <h2 className="font-heading text-2xl font-semibold text-text-primary mt-10 mb-4">Contact</h2>
          <p className="text-text-primary leading-relaxed mb-4">For refund requests or questions, contact us at support@lanternell.com.</p>
        </div>
      </article>
      <Footer />
    </main>
  )
}
