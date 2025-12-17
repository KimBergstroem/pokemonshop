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

    // Type filter
    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(p => p?.type === filters.type)
    }

    // Rarity filter
    if (filters.rarity && filters.rarity !== 'all') {
      filtered = filtered.filter(p => p?.rarity === filters.rarity)
    }

    // Condition filter
    if (filters.condition && filters.condition !== 'all') {
      filtered = filtered.filter(p => p?.condition === filters.condition)
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
      <MarketplaceFilters onFilterChange={handleFilterChange} />

      {/* Products Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 mt-8"
      >
        {filteredProducts?.map((product, index) => (
          <motion.div
            key={product?.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
          >
            <ProductCard product={product} />
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
