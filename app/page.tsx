import { Hero } from '@/components/hero'
import { AboutPreview } from '@/components/about-preview'
import { BlogPreview } from '@/components/blog-preview'
import { CTASection } from '@/components/cta-section'
import prisma from '@/lib/db'

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

export default async function Home() {
  const products = await getProducts()

  return (
    <div className="flex flex-col">
      <Hero products={products} />
      <AboutPreview />
      <BlogPreview />
      <CTASection />
    </div>
  )
}
