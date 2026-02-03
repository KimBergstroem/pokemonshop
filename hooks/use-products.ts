import { useQuery } from '@tanstack/react-query'
import { getProducts, getProductById } from '@/lib/api/products'
import type { Product } from '@prisma/client'

/**
 * React Query hook for fetching products
 * Automatically handles caching, refetching, and error states
 * 
 * Example usage:
 * ```tsx
 * const { data: products, isLoading, error } = useProducts()
 * ```
 */
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    // Data is fresh for 60 seconds
    staleTime: 60 * 1000,
    // Keep in cache for 5 minutes
    gcTime: 5 * 60 * 1000,
  })
}

/**
 * React Query hook for fetching a single product by ID
 * 
 * Example usage:
 * ```tsx
 * const { data: product, isLoading } = useProduct('product-id')
 * ```
 */
export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    enabled: !!id, // Only fetch if ID exists
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}
