import { MarketplaceClient } from './marketplace-client'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

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

export default async function MarketplacePage() {
  const products = await getProducts()
  return <MarketplaceClient products={products} />
}
