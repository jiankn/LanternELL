'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Sparkles, CheckCircle, Download, ArrowRight, Package } from 'lucide-react'

export default function CheckoutSuccessPage() {
    const [sessionId, setSessionId] = useState<string | null>(null)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search)
            setSessionId(params.get('session') || params.get('session_id'))
        }
    }, [])

    return (
        <main className="min-h-screen bg-background flex flex-col">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-white/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-clay-sm">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-heading text-xl font-bold text-text-primary">LanternELL</span>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Success Content */}
            <div className="flex-1 flex items-center justify-center px-4 py-16">
                <div className="w-full max-w-lg text-center">
                    <div className="clay-card p-10">
                        {/* Success Icon */}
                        <div className="relative mx-auto mb-8 w-24 h-24">
                            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20"></div>
                            <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-clay-button">
                                <CheckCircle className="w-12 h-12 text-white" />
                            </div>
                        </div>

                        <h1 className="font-heading text-3xl font-bold text-text-primary mb-3">
                            Thank You!
                        </h1>
                        <p className="text-lg text-text-primary/70 mb-8">
                            Your purchase was successful. Your teaching packs are ready to download.
                        </p>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <Link
                                href="/account/library"
                                className="clay-button-cta w-full flex items-center justify-center gap-2 py-3 text-lg"
                            >
                                <Download className="w-5 h-5" />
                                Go to My Downloads
                            </Link>

                            <Link
                                href="/shop"
                                className="clay-button w-full flex items-center justify-center gap-2 py-3"
                            >
                                <Package className="w-5 h-5" />
                                Continue Shopping
                            </Link>
                        </div>

                        {/* Email Notice */}
                        <div className="mt-8 p-4 bg-primary/5 rounded-xl">
                            <p className="text-sm text-text-primary/70">
                                📧 We've also sent a confirmation email with a link to access your downloads.
                                If you're a new user, use the link to sign in.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
