import Link from 'next/link'
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/footer'
import { Mail, MessageSquare, Clock } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us — LanternELL Support',
  description: 'Get help with your LanternELL account, orders, or teaching resources. We typically respond within 24 hours.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar links={[{ href: '/shop', label: 'Shop' }, { href: '/teaching-tips', label: 'Teaching Tips' }, { href: '/login', label: 'Sign In' }]} />
      <article className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-text-muted mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <span className="text-text-primary font-medium">Contact</span>
          </nav>
          <h1 className="font-heading text-4xl font-bold text-text-primary mb-4">Contact Us</h1>
          <p className="text-text-primary/70 text-lg mb-12">
            Have a question about your order, account, or our ELL teaching resources? We're here to help.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            <div className="clay-card p-6 text-center">
              <Mail className="w-8 h-8 text-primary mx-auto mb-3" />
              <h2 className="font-heading text-lg font-semibold text-text-primary mb-2">Email</h2>
              <a href="mailto:support@lanternell.com" className="text-primary hover:underline text-sm">support@lanternell.com</a>
            </div>
            <div className="clay-card p-6 text-center">
              <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
              <h2 className="font-heading text-lg font-semibold text-text-primary mb-2">Response Time</h2>
              <p className="text-sm text-text-primary/70">Within 24 hours on business days</p>
            </div>
            <div className="clay-card p-6 text-center">
              <MessageSquare className="w-8 h-8 text-primary mx-auto mb-3" />
              <h2 className="font-heading text-lg font-semibold text-text-primary mb-2">FAQ</h2>
              <p className="text-sm text-text-primary/70">Check our <a href="/#faq" className="text-primary hover:underline">FAQ section</a> first</p>
            </div>
          </div>

          <div className="clay-card p-8">
            <h2 className="font-heading text-2xl font-semibold text-text-primary mb-6">Common Questions</h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">Order & Download Issues</h3>
                <p className="text-text-primary/80 leading-relaxed">If you haven't received your download link after purchase, check your spam folder first. If you still can't find it, email us with your order confirmation and we'll resend the download link right away.</p>
              </div>

              <div>
                <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">Refunds</h3>
                <p className="text-text-primary/80 leading-relaxed">All digital download sales are final. We offer free samples on every product page so you can try before you buy. If you were charged twice, received a corrupted file, or the content is materially different from the description, email us within 7 days. See our <a href="/refund-policy" className="text-primary hover:underline">refund policy</a> for details.</p>
              </div>

              <div>
                <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">Licensing</h3>
                <p className="text-text-primary/80 leading-relaxed">Our standard license covers single-classroom use. For school-wide or district licenses, email us at support@lanternell.com and we'll set up a custom plan.</p>
              </div>

              <div>
                <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">Custom Resources</h3>
                <p className="text-text-primary/80 leading-relaxed">Need resources for a specific language pair or topic not yet available? Let us know — we're always expanding our library based on teacher feedback.</p>
              </div>
            </div>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  )
}
