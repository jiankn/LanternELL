import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LanternELL - Printable Bilingual & ELL Resources for Teachers',
  description: 'Print-ready bilingual & ELL resources for real classrooms. Save time with ready-to-print teaching packs for K-2 ELL/Newcomer students.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  )
}
