'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/language-context'
import { useCart } from '@/contexts/cart-context'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Check } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { CDN } from '@/lib/cdn'

export function AboutClient() {
  const { t } = useLanguage()
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [selectedSize, setSelectedSize] = useState<string>('M')
  const [addedToCart, setAddedToCart] = useState(false)

  const hoodieProduct = {
    id: 'hoodie-akknerds',
    name: 'akkNERDS Logo Hoodie',
    description: t.about.merchDescription,
    price: 49.99,
    image: CDN.logoHoodie,
    stock: 100,
    category: 'merch',
    set: null,
    type: null,
    rarity: null,
    condition: null,
    language: null,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const sizes = ['S', 'M', 'L', 'XL']

  const handleAddToCart = () => {
    addToCart(hoodieProduct)
    setAddedToCart(true)
    toast({
      title: t.about.merchAddedToCart,
      description: `${hoodieProduct.name} (${selectedSize})`,
    })
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="space-y-12 animate-about-fade-up">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-heading font-bold">
            {t.about.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.about.subtitle}
          </p>
        </div>

        {/* Portrait */}
        <div
          className="relative w-64 h-80 mx-auto rounded-lg overflow-hidden shadow-xl animate-about-scale-in [animation-delay:0.2s]"
        >
          <Image
            src={CDN.main}
            alt="Angel, Kristian and Kim - Pokemon Collectors"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 256px"
            loading="lazy"
            unoptimized
          />
        </div>

        {/* Bio */}
        <div
          className="space-y-6 text-lg leading-relaxed animate-about-fade [animation-delay:0.4s]"
        >
          <p className="text-center text-muted-foreground">
            {t.about.bio1}
          </p>
          <p className="text-center text-muted-foreground">
            {t.about.bio2}
          </p>
          <p className="text-center text-muted-foreground">
            {t.about.bio3}
          </p>
        </div>

        {/* Philosophy */}
        <div
          className="bg-card rounded-lg p-8 shadow-lg space-y-4 animate-about-fade-up [animation-delay:0.6s]"
        >
          <h2 className="text-2xl font-heading font-semibold text-center">
            {t.about.philosophyTitle}
          </h2>
          <p className="text-muted-foreground text-center italic text-xl">
            &quot;{t.about.motto}&quot;
          </p>
          <p className="text-muted-foreground text-center">
            {t.about.philosophy}
          </p>
        </div>

        {/* Merch Section */}
        <div
          className="bg-card rounded-lg p-8 shadow-lg border-2 border-primary/20 animate-about-fade-up [animation-delay:0.8s]"
        >
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-center mb-6">
            {t.about.merchTitle}
          </h2>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Image */}
            <div
              className="relative aspect-square rounded-lg overflow-hidden shadow-xl animate-about-slide-left [animation-delay:1s]"
            >
              <Image
                src={CDN.logoHoodie}
                alt="akkNERDS Logo Hoodie"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy"
                unoptimized
              />
            </div>

            {/* Product Info */}
            <div
              className="space-y-6 animate-about-slide-right [animation-delay:1s]"
            >
              <div>
                <h3 className="text-xl font-heading font-semibold mb-2">
                  {hoodieProduct.name}
                </h3>
                <p className="text-muted-foreground">
                  {t.about.merchDescription}
                </p>
              </div>

              {/* Price */}
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {t.about.merchPrice}
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-primary">
                    €{hoodieProduct.price.toFixed(2)}
                  </p>
                  <span className="text-sm text-muted-foreground">
                    {t.about.merchShipping}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {t.about.merchShippingInfo}
                </p>
              </div>

              {/* Size Selection */}
              <div>
                <p className="text-sm text-muted-foreground mb-3">
                  {t.about.merchSize}
                </p>
                <div className="flex gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all font-semibold ${
                        selectedSize === size
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-background text-foreground hover:border-primary/50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="w-full gap-2"
                disabled={addedToCart}
              >
                {addedToCart ? (
                  <>
                    <Check className="w-5 h-5" />
                    {t.about.merchAddedToCart}
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    {t.about.merchAddToCart}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
