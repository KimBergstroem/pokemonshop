'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/cart-context'
import { useToast } from '@/hooks/use-toast'
import { useLanguage } from '@/contexts/language-context'
import type { Product } from '@prisma/client'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const { t } = useLanguage()

  const handleAddToCart = () => {
    addToCart(product)
    toast({
      title: t.marketplace.addedToCart,
      description: `${product?.name} ${t.marketplace.addedSuccess}`,
    })
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col w-full"
    >
      {/* Image */}
      <div className="relative w-full aspect-[2/3] bg-muted overflow-hidden">
        <Image
          src={product?.image ?? ''}
          alt={product?.name ?? 'Product'}
          fill
          className="object-cover"
        />
        {product?.featured && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-semibold z-10">
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 space-y-2 w-full">
        <div className="space-y-1">
          <h3 className="font-semibold text-sm line-clamp-1">{product?.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {product?.description}
          </p>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {product?.rarity && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/20 text-primary">
              {product.rarity}
            </span>
          )}
          {product?.condition && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-secondary/20 text-secondary-foreground">
              {product.condition}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-lg font-bold">€{product?.price?.toFixed(2)}</span>
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
          </Button>
        </div>

        {product?.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
          <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-1">
            Only {product.stock} left in stock!
          </p>
        )}
        {product?.stock === 0 && (
          <p className="text-xs text-destructive font-semibold mt-1">
            Out of stock
          </p>
        )}
      </div>
    </motion.div>
  )
}
