import type { Product } from '@prisma/client'

/**
 * API functions for products
 * These can be used with TanStack Query's useQuery hook
 */

export async function getProducts(): Promise<Product[]> {
  const response = await fetch('/api/products', {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  })

  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }

  return response.json()
}

export async function getProductById(id: string): Promise<Product> {
  const response = await fetch(`/api/products/${id}`, {
    next: { revalidate: 60 },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch product')
  }

  return response.json()
}
