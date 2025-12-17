import { BlogClient } from './blog-client'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

async function getBlogPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    })
    return posts
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts()
  return <BlogClient posts={posts} />
}
