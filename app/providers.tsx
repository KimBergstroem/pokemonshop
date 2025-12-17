'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@/components/theme-provider'
import { LanguageProvider } from '@/contexts/language-context'
import { CartProvider } from '@/contexts/cart-context'
import { useState, useEffect } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <LanguageProvider>
          <CartProvider>
            {mounted ? children : <div style={{ visibility: 'hidden' }}>{children}</div>}
          </CartProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
