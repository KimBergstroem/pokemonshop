import dynamic from 'next/dynamic'
import prisma from '@/lib/db'
import { Suspense } from 'react'

const MarketplaceClient = dynamic(
  () => import('./marketplace-client').then((m) => ({ default: m.MarketplaceClient })),
  { ssr: true }
)

// Enable caching: revalidate every 60 seconds
// This allows Next.js to cache the page and serve it faster
export const revalidate = 60

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return products
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

// Loading component for better UX
function MarketplaceLoading() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      <div className="text-center space-y-4 mb-12">
        <div className="h-12 w-64 bg-muted animate-pulse rounded mx-auto" />
        <div className="h-6 w-96 bg-muted animate-pulse rounded mx-auto" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="bg-card rounded-lg overflow-hidden">
            <div className="aspect-[330/460] bg-muted animate-pulse" />
            <div className="p-3 space-y-2">
              <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
              <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default async function MarketplacePage() {
  return (
    <Suspense fallback={<MarketplaceLoading />}>
      <MarketplaceContent />
    </Suspense>
  )
}

async function MarketplaceContent() {
  const products = await getProducts()
  return <MarketplaceClient products={products} />
}
