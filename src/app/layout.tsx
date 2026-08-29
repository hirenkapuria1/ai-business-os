import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PINREKI AI - Digital Products & Tools',
  description: 'Create smarter. Sell faster. AI-powered digital tools and productivity systems.',
  openGraph: {
    title: 'PINREKI AI',
    description: 'AI-powered digital tools, templates and productivity systems',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
