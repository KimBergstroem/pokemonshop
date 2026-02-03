'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQueryClient } from '@tanstack/react-query'
import { getProducts } from '@/lib/api/products'
import { getPreloadImageUrls } from '@/lib/cdn'

export function SplashScreen() {
  const [show, setShow] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (typeof window === 'undefined') {
      setShow(false)
      setIsLoading(false)
      return
    }

    // Simple splash screen logic:
    // Show splash on page load/reload to preload cache
    // Use short cooldown to prevent showing on rapid refreshes
    
    const splashShownTime = sessionStorage.getItem('splashShownTime')
    const now = Date.now()
    const cooldownPeriod = 2000 // 2 seconds cooldown
    
    // Don't show if splash was shown very recently (rapid refresh protection)
    if (splashShownTime) {
      const timeSinceLastSplash = now - parseInt(splashShownTime)
      if (timeSinceLastSplash < cooldownPeriod) {
        setShow(false)
        setIsLoading(false)
        return
      }
    }

    // Show splash screen
    setShow(true)

    // Preload critical resources while splash is showing
    const preloadResources = async () => {
      try {
        // MAIN PURPOSE: Build cache while showing splash
        // Preload marketplace data using TanStack Query (will be cached in memory)
        await queryClient.prefetchQuery({
          queryKey: ['products'],
          queryFn: getProducts,
        }).catch(() => {})

        // Preload blog data
        fetch('/api/blog', { 
          method: 'GET',
          headers: { 'Cache-Control': 'max-age=60' }
        }).catch(() => {})

        const criticalImages = getPreloadImageUrls()

        criticalImages.forEach((src) => {
          const link = document.createElement('link')
          link.rel = 'preload'
          link.as = 'image'
          link.href = src
          ;(link as any).fetchPriority = 'high'
          document.head.appendChild(link)
        })

        // Preload fonts
        if (document.fonts) {
          document.fonts.ready.catch(() => {})
        }

        // Wait minimum 1 second for smooth UX, max 2 seconds
        const startTime = Date.now()
        const minTime = 1000 // 1 second minimum
        const maxTime = 2000 // 2 seconds maximum
        
        // Wait for minimum time
        await new Promise(resolve => setTimeout(resolve, minTime))
        
        // If we haven't reached max time, wait a bit more (up to max)
        const elapsed = Date.now() - startTime
        if (elapsed < maxTime) {
          await new Promise(resolve => setTimeout(resolve, maxTime - elapsed))
        }
      } catch (error) {
        console.error('Error preloading resources:', error)
        // Still show splash for minimum time
        await new Promise(resolve => setTimeout(resolve, 1000))
      } finally {
        // Mark splash as shown with timestamp
        // Cooldown prevents showing again within 2 seconds
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('splashShownTime', Date.now().toString())
        }
        setIsLoading(false)
        
        // Fade out animation
        setTimeout(() => {
          setShow(false)
        }, 300)
      }
    }

    preloadResources()
  }, [queryClient])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: isLoading ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{
            background: 'linear-gradient(to bottom right, hsl(270, 70%, 50%), hsl(270, 70%, 40%), hsl(270, 65%, 35%))',
          }}
        >
          <div className="flex flex-col items-center gap-8">
            {/* Animated Pokeball */}
            <div className="splash-pokeball" />

            {/* Logo/Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                akkNERDS
              </h2>
              <p className="text-purple-200 text-sm md:text-base">
                Loading your Pokemon marketplace...
              </p>
            </motion.div>

            {/* Loading dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex gap-2"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-white"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
