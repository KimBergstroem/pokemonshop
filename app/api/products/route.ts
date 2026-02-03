import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

// Enable caching: revalidate every 60 seconds
// This allows Next.js to cache the response and serve it from cache
export const revalidate = 60

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(products, {
      headers: {
        // Cache-Control headers for HTTP caching
        // public: can be cached by CDN/browser
        // s-maxage: cache for 60 seconds in CDN/shared cache
        // stale-while-revalidate: serve stale content while revalidating (up to 120s)
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
