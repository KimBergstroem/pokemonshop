'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ProductCard } from '@/components/product-card'
import { MarketplaceFilters } from '@/components/marketplace-filters'
import { useLanguage } from '@/contexts/language-context'
import type { Product } from '@prisma/client'

interface MarketplaceClientProps {
  products: Product[]
}

export function MarketplaceClient({ products }: MarketplaceClientProps) {
  const { t } = useLanguage()
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [selectedCategory, setSelectedCategory] = useState('all')

  const handleFilterChange = (filters: any) => {
    let filtered = [...products]

    // Category filter
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(p => p?.category === filters.category)
    }

    // Type filter (supports multiple types)
    if (filters.type && filters.type !== 'all') {
      // If type is an array (from multiple quick filter selection)
      if (Array.isArray(filters.type)) {
        filtered = filtered.filter(p => 
          filters.type.some((selectedType: string) => 
            p?.type?.toLowerCase() === selectedType.toLowerCase()
          )
        )
      } else {
        // Single type filter (from dropdown)
        filtered = filtered.filter(p => p?.type?.toLowerCase() === filters.type?.toLowerCase())
      }
    }

    // Rarity filter
    if (filters.rarity && filters.rarity !== 'all') {
      filtered = filtered.filter(p => {
        const productRarity = p?.rarity?.toLowerCase().trim()
        const filterRarity = filters.rarity?.toLowerCase().trim()
        return productRarity === filterRarity
      })
    }

    // Condition filter
    if (filters.condition && filters.condition !== 'all') {
      filtered = filtered.filter(p => p?.condition === filters.condition)
    }

    // Printed In (Set) filter
    if (filters.printedIn && filters.printedIn !== 'all') {
      filtered = filtered.filter(p => p?.set?.toLowerCase() === filters.printedIn?.toLowerCase())
    }

    // Language filter
    if (filters.language && filters.language !== 'all') {
      filtered = filtered.filter(p => p?.language?.toLowerCase() === filters.language?.toLowerCase())
    }

    // Price range filter
    if (filters.priceRange) {
      filtered = filtered.filter(
        p => (p?.price ?? 0) >= (filters.priceRange?.[0] ?? 0) && (p?.price ?? 0) <= (filters.priceRange?.[1] ?? 1000)
      )
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        p =>
          p?.name?.toLowerCase()?.includes(searchLower) ||
          p?.description?.toLowerCase()?.includes(searchLower)
      )
    }

    // Sort products
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-low':
          filtered.sort((a, b) => (a?.price ?? 0) - (b?.price ?? 0))
          break
        case 'price-high':
          filtered.sort((a, b) => (b?.price ?? 0) - (a?.price ?? 0))
          break
        case 'name-asc':
          filtered.sort((a, b) => (a?.name ?? '').localeCompare(b?.name ?? ''))
          break
        case 'name-desc':
          filtered.sort((a, b) => (b?.name ?? '').localeCompare(a?.name ?? ''))
          break
        default:
          // Keep original order
          break
      }
    }

    setFilteredProducts(filtered)
    if (filters.category) setSelectedCategory(filters.category)
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4 mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-heading font-bold">
          {t.marketplace.title}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t.marketplace.subtitle}
        </p>
      </motion.div>

      {/* Filters */}
      <MarketplaceFilters onFilterChange={handleFilterChange} totalProducts={products.length} />

      {/* Products Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 mt-8"
      >
        {filteredProducts?.map((product, index) => (
          <motion.div
            key={product?.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.02, 0.5), duration: 0.3 }}
          >
            <ProductCard product={product} index={index} />
          </motion.div>
        ))}
      </motion.div>

      {/* No results */}
      {filteredProducts?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            {t.marketplace.noResults}
          </p>
        </div>
      )}
    </div>
  )
}
