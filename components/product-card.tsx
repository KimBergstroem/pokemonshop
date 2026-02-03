'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingCart, MoreVertical, DollarSign, Link as LinkIcon, Images } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { RarityIcon } from '@/components/ui/rarity-icon'
import { useCart } from '@/contexts/cart-context'
import { useToast } from '@/hooks/use-toast'
import { useLanguage } from '@/contexts/language-context'
import type { Product } from '@prisma/client'

interface ProductCardProps {
  product: Product
  index?: number
}

// Helper function to extract abbreviation from condition (e.g., "Near Mint (NM)" -> "(NM)")
function getConditionAbbreviation(condition: string | null | undefined): string | null {
  if (!condition) return null
  const match = condition.match(/\(([^)]+)\)/)
  return match ? `(${match[1]})` : condition
}

// Helper function to extract card number from product name (e.g., "Charmander - 109/091" -> "109/091")
function getCardNumber(name: string | null | undefined): string | null {
  if (!name) return null
  // Look for pattern like "109/091" or "TG22/TG30"
  const match = name.match(/(\d+\/\d+|[A-Z]+\d+\/[A-Z]+\d+)/)
  return match ? match[1] : null
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
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

  const handleCheckPrices = () => {
    // TODO: Implement price checking functionality
    toast({
      title: 'Price Check',
      description: `Checking prices for ${product?.name}...`,
    })
  }

  const handleCopyCardLink = () => {
    const cardLink = `${window.location.origin}/marketplace?product=${product?.id}`
    navigator.clipboard.writeText(cardLink)
    toast({
      title: 'Link Copied',
      description: 'Card link has been copied to clipboard!',
    })
  }

  const handleViewMoreImages = () => {
    // TODO: Implement image gallery/modal functionality
    toast({
      title: 'View Images',
      description: `Viewing additional images for ${product?.name}...`,
    })
  }

  const conditionAbbr = getConditionAbbreviation(product?.condition)
  const cardNumber = getCardNumber(product?.name)
  
  // TODO: Replace with actual image count from product.gallery or product.images array when available
  // For now, defaulting to 1 image (the main product image)
  const imageCount = 1

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col w-full"
    >
      {/* Image */}
      <div className="relative w-full aspect-[330/460] overflow-hidden bg-muted/50">
        <Image
          src={product?.image ?? ''}
          alt={product?.name ?? 'Product'}
          fill
          className="object-contain transition-opacity duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 20vw, 16vw"
          loading={index < 12 ? "eager" : "lazy"}
          priority={index < 8}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        {product?.featured && (
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-semibold z-10">
            New
          </div>
        )}
        {/* Multiple Images Icon - Top Right */}
        <button
          onClick={handleViewMoreImages}
          className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white px-2 py-1.5 rounded-md z-10 transition-colors shadow-md flex items-center gap-1.5"
          aria-label={`View ${imageCount} image${imageCount !== 1 ? 's' : ''}`}
        >
          <Images className="w-4 h-4" />
          <span className="text-xs font-semibold">{imageCount}</span>
        </button>
        {/* Card Number Overlay - Bottom with background that fits text */}
        {cardNumber && (
          <div className="absolute bottom-0 left-0 z-10">
            <div className="bg-black/70 backdrop-blur-sm px-3 py-2.5 rounded-tr-md flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-white">
                {cardNumber}
              </span>
              {product?.rarity && (
                <RarityIcon 
                  rarity={product.rarity} 
                  className="w-6 h-6"
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 space-y-2 w-full">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground line-clamp-1">
            {product?.set}
          </p>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {product?.rarity && (
            <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-full bg-primary/20">
              <span className="text-xs font-medium text-primary">{product.rarity}</span>
            </div>
          )}
          {product?.condition && (
            <>
              {/* Mobile: Show abbreviation only */}
              <span className="md:hidden text-xs px-1.5 py-0.5 rounded-full bg-secondary/20 text-secondary-foreground">
                {conditionAbbr || product.condition}
              </span>
              {/* Desktop: Show full condition */}
              <span className="hidden md:inline text-xs px-1.5 py-0.5 rounded-full bg-secondary/20 text-secondary-foreground">
                {product.condition}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-lg font-bold">€{product?.price?.toFixed(2)}</span>
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleCheckPrices}>
                  <DollarSign className="mr-2 h-4 w-4" />
                  Check prices
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyCardLink}>
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Copy Card Link
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
