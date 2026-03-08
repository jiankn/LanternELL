import type { Metadata } from 'next'
import './globals.css'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lanternell.com'

export const metadata: Metadata = {
  title: {
    default: 'LanternELL - Printable Bilingual & ELL Resources for Teachers',
    template: '%s | LanternELL',
  },
  description:
    'Print-ready bilingual & ELL resources for real classrooms. Save hours of prep time with ready-to-print teaching packs designed for K-5 ELL and bilingual classrooms. English-Spanish.',
  keywords: [
    'ELL worksheets',
    'bilingual classroom labels',
    'newcomer activities',
    'English Spanish printables',
    'ESL worksheets for beginners',
    'ELL newcomer worksheets',
    'bilingual teaching resources',
    'visual supports SPED',
    'multilingual classroom resources',
    'English Chinese worksheets',
    'English Arabic printables',
    'special education visual aids',
    'homeschool ELL resources',
    'ESL printable activities Pre-K 8',
  ],
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: 'LanternELL - Printable Bilingual & ELL Resources',
    description:
      'Print-ready bilingual & ELL resources for real classrooms. Just print and use today.',
    url: BASE_URL,
    siteName: 'LanternELL',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LanternELL - Printable Bilingual & ELL Resources',
    description:
      'Print-ready bilingual & ELL resources for real classrooms. Just print and use today.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'LanternELL',
    url: BASE_URL,
    description:
      'Print-ready bilingual & ELL resources for real classrooms.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/shop?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Crimson+Pro:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
          />
        )}
      </head>
      <body className="min-h-screen font-body">
        <a href="#main-content" className="skip-link">Skip to content</a>
        <div id="main-content">{children}</div>
      </body>
    </html>
  )
}

