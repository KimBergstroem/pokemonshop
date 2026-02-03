import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Header } from '@/components/header'
import { Toaster } from '@/components/ui/toaster'
import { SplashScreen } from '@/components/splash-screen'
import { CDN } from '@/lib/cdn'
import { SpeedInsights } from '@vercel/speed-insights/next'

const Chatbot = dynamic(
  () => import('@/components/chatbot').then((m) => ({ default: m.Chatbot })),
  { ssr: false }
)

const CookieBanner = dynamic(
  () => import('@/components/cookie-banner').then((m) => ({ default: m.CookieBanner })),
  { ssr: false }
)

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  ),
  title: 'Card Marketplace Barcelona | Only Raw, No Damage',
  description: 'Join our community in Barcelona for trading events and premium tcg cards. Only Raw, No Damage, No Whitening and Only Pulled!',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'Marketplace Barcelona',
    description: 'Premium TCG cards and community events in Barcelona',
    images: [CDN.logoNavbar],
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
          <SplashScreen />
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Chatbot />
          <CookieBanner />
          <Toaster />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  )
}
