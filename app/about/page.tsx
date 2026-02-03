import { AboutClient } from './about-client'
import { Suspense } from 'react'

// Enable caching for better performance
export const revalidate = 3600 // Revalidate every hour (about page doesn't change often)

export default function AboutPage() {
  return (
    <Suspense fallback={<AboutLoadingFallback />}>
      <AboutClient />
    </Suspense>
  )
}

function AboutLoadingFallback() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <div className="h-12 w-64 bg-muted animate-pulse rounded mx-auto" />
          <div className="h-6 w-96 bg-muted animate-pulse rounded mx-auto" />
        </div>
        <div className="w-64 h-80 mx-auto bg-muted animate-pulse rounded-lg" />
      </div>
    </div>
  )
}
