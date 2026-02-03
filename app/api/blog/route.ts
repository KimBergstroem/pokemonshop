import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

// Enable caching: revalidate every 60 seconds
export const revalidate = 60

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(posts, {
      headers: {
        // Cache-Control headers for HTTP caching
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}
