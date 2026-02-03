'use client'

import { SessionProvider } from 'next-auth/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/components/theme-provider'
import { LanguageProvider } from '@/contexts/language-context'
import { CartProvider } from '@/contexts/cart-context'
import { useState, useEffect } from 'react'
import { getQueryClient } from '@/lib/query-client'

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  // Use the singleton QueryClient instance
  const queryClient = getQueryClient()

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <LanguageProvider>
            <CartProvider>
              {mounted ? children : <div style={{ visibility: 'hidden' }}>{children}</div>}
            </CartProvider>
          </LanguageProvider>
        </ThemeProvider>
      </SessionProvider>
    </QueryClientProvider>
  )
}
