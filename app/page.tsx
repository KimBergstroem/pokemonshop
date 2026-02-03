import dynamic from 'next/dynamic'
import { Hero } from '@/components/hero'
import { AboutPreview } from '@/components/about-preview'
import prisma from '@/lib/db'

const GiveawaySection = dynamic(
  () => import('@/components/giveaway-section').then((m) => ({ default: m.GiveawaySection })),
  { ssr: true }
)
const BlogPreview = dynamic(
  () => import('@/components/blog-preview').then((m) => ({ default: m.BlogPreview })),
  { ssr: true }
)
const CTASection = dynamic(
  () => import('@/components/cta-section').then((m) => ({ default: m.CTASection })),
  { ssr: true }
)

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        image: true,
        price: true,
        rarity: true,
        set: true,
      },
    })
    return products
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

// Cache products for 60 seconds to improve performance
export const revalidate = 60

export default async function Home() {
  const products = await getProducts()

  return (
    <div className="flex flex-col">
      <Hero products={products} />
      <AboutPreview />
      <GiveawaySection />
      <BlogPreview />
      <CTASection />
    </div>
  )
}
