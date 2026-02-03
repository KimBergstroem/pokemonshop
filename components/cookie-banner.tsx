'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'
import Link from 'next/link'

const COOKIE_CONSENT_KEY = 'cookie-consent'

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => {
        setShowBanner(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted')
    setShowBanner(false)
  }

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined')
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <AnimatePresence>
      {showBanner && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={handleDecline}
          />

          {/* Cookie Banner */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
          >
            <div className="container mx-auto max-w-4xl">
              <div className="bg-card border border-border rounded-lg shadow-2xl p-4 md:p-6 relative overflow-hidden">
                {/* Decorative gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-purple-600/10 pointer-events-none" />
                
                {/* Close button */}
                <button
                  onClick={handleDecline}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors z-10"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>

                <div className="relative flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
                  {/* Cookie Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <Cookie className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-2 pr-8 md:pr-0">
                    <h3 className="text-lg md:text-xl font-heading font-bold text-foreground">
                      {t.cookieBanner.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      {t.cookieBanner.description}{' '}
                      <Link
                        href="/support/cookie-policy"
                        className="text-primary hover:underline font-medium"
                      >
                        {t.cookieBanner.learnMore}
                      </Link>
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full md:w-auto md:flex-shrink-0">
                    <Button
                      onClick={handleDecline}
                      variant="outline"
                      className="border-border hover:bg-muted"
                    >
                      {t.cookieBanner.decline}
                    </Button>
                    <Button
                      onClick={handleAccept}
                      className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg"
                    >
                      {t.cookieBanner.accept}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
