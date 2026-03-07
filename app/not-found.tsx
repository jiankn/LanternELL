import Link from 'next/link'
import { Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Compass className="w-10 h-10 text-primary" />
        </div>
        <h1 className="font-heading text-4xl font-bold text-text-primary mb-3">
          Page Not Found
        </h1>
        <p className="text-text-primary/70 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" className="clay-button-cta cursor-pointer">
            Go Home
          </Link>
          <Link href="/shop" className="clay-button cursor-pointer">
            Browse Shop
          </Link>
        </div>
      </div>
    </main>
  )
}
