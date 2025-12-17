import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Header } from '@/components/header'
import { Chatbot } from '@/components/chatbot'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'Pokemon Marketplace Barcelona | Only Raw, No Damage',
  description: 'Join our Pokemon community in Barcelona for trading events and premium Pokemon cards. Only Raw, No Damage, No Whitening and Only Pulled!',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'Pokemon Marketplace Barcelona',
    description: 'Premium Pokemon cards and community events in Barcelona',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <Providers>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Chatbot />
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
