"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Marquee } from "@/components/ui/marquee"
import Image from "next/image"

interface PokemonCard {
  id: string
  name: string
  image: string
  price: number
  rarity?: string | null
  set?: string | null
  priority?: boolean
}

interface PokemonMarquee3DProps {
  products: PokemonCard[]
}

const PokemonCard = ({
  id,
  name,
  image,
  price,
  rarity,
  set,
  priority = false,
}: PokemonCard) => {
  return (
    <figure
      className={cn(
        "group relative h-[16.75rem] w-44 cursor-pointer overflow-hidden rounded-xl border-2 shadow-2xl transition-all hover:scale-110 hover:shadow-primary/20",
        // Pokemon card styling - looks like a real Pokemon card
        "bg-gradient-to-br from-white via-gray-50 to-gray-100",
        "dark:from-gray-800 dark:via-gray-700 dark:to-gray-900",
        "border-gray-300 dark:border-gray-600",
        "hover:border-primary/50"
      )}
    >
      {/* Card Image - Main Pokemon Image */}
      <div className="relative h-44 w-full overflow-hidden bg-gradient-to-b from-primary/10 to-transparent bg-muted/20">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover p-2 transition-opacity duration-300"
            sizes="(max-width: 768px) 176px, 224px"
            loading={priority ? "eager" : "lazy"}
            priority={priority}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            onError={(e) => {
              // Fallback if image fails to load
              const target = e.target as HTMLImageElement
              target.style.opacity = '0.3'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted/50">
            <span className="text-xs text-muted-foreground">No image</span>
          </div>
        )}
        {/* Rarity Badge - Top Right */}
        {rarity && (
          <div className="absolute top-2 right-2">
            <span className="rounded-full bg-primary px-2 py-1 text-xs font-bold text-primary-foreground shadow-lg">
              {rarity}
            </span>
          </div>
        )}
      </div>

      {/* Card Info - Bottom Section */}
      <div className="flex flex-col justify-between min-h-[6rem] px-3 pt-2 pb-3 bg-gradient-to-b from-transparent to-gray-100/50 dark:to-gray-800/50">
        <div className="space-y-1">
          <h3 className="font-bold text-base line-clamp-1 text-foreground">
            {name}
          </h3>
          {set && (
            <p className="text-xs text-muted-foreground line-clamp-1 font-medium">
              {set}
            </p>
          )}
        </div>
        
        {/* Price Section */}
        <div className="flex items-center justify-between pt-2 mt-auto border-t border-border/50">
          <span className="text-lg font-bold text-primary">€{price.toFixed(2)}</span>
        </div>
      </div>

      {/* Card Shine Effect - Holographic effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
      
      {/* Card Border Glow */}
      <div className="absolute inset-0 rounded-xl border-2 border-primary/0 group-hover:border-primary/30 transition-colors pointer-events-none" />
    </figure>
  )
}

export function PokemonMarquee3D({ products }: PokemonMarquee3DProps) {
  // On mobile, use fewer products to improve performance
  // Use all products on desktop for better visual effect
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Use fewer products on mobile (8 instead of all) for better performance
  const optimizedProducts = isMobile ? products.slice(0, 8) : products
  
  // Split products into columns for vertical scrolling
  // Duplicate products to ensure smooth infinite scrolling
  const allProducts = [...optimizedProducts, ...optimizedProducts]
  
  const firstColumn = allProducts.slice(0, Math.ceil(allProducts.length / 4))
  const secondColumn = allProducts.slice(
    Math.ceil(allProducts.length / 4),
    Math.ceil(allProducts.length / 2)
  )
  const thirdColumn = allProducts.slice(
    Math.ceil(allProducts.length / 2),
    Math.ceil((allProducts.length * 3) / 4)
  )
  const fourthColumn = allProducts.slice(Math.ceil((allProducts.length * 3) / 4))

  // Preload first few images for better performance on mobile
  useEffect(() => {
    const imagesToPreload = optimizedProducts.slice(0, isMobile ? 8 : 12).map(p => p.image).filter(Boolean)
    imagesToPreload.forEach((src) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
    })

    return () => {
      // Cleanup preload links
      imagesToPreload.forEach((src) => {
        const existingLink = document.querySelector(`link[href="${src}"]`)
        if (existingLink) {
          document.head.removeChild(existingLink)
        }
      })
    }
  }, [optimizedProducts, isMobile])

  return (
    <div className="relative flex h-full w-full flex-row items-center justify-center gap-4 overflow-hidden [perspective:300px]">
      <div
        className="flex flex-row items-center gap-4"
        style={{
          transform:
            "translateX(200px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)",
        }}
      >
        {/* Column 1 - Fast, Down */}
        <Marquee pauseOnHover vertical className="[--duration:15s]">
          {firstColumn.map((product, index) => (
            <PokemonCard 
              key={`col1-${product.id}-${index}`} 
              {...product} 
              priority={index < 2}
            />
          ))}
        </Marquee>
        
        {/* Column 2 - Medium, Up (Reverse) */}
        <Marquee reverse pauseOnHover vertical className="[--duration:25s]">
          {secondColumn.map((product, index) => (
            <PokemonCard 
              key={`col2-${product.id}-${index}`} 
              {...product} 
              priority={index < 2}
            />
          ))}
        </Marquee>
        
        {/* Column 3 - Slow, Down */}
        <Marquee pauseOnHover vertical className="[--duration:35s]">
          {thirdColumn.map((product, index) => (
            <PokemonCard 
              key={`col3-${product.id}-${index}`} 
              {...product} 
              priority={index < 2}
            />
          ))}
        </Marquee>
        
        {/* Column 4 - Medium-Fast, Up (Reverse) */}
        <Marquee reverse pauseOnHover vertical className="[--duration:20s]">
          {fourthColumn.map((product, index) => (
            <PokemonCard 
              key={`col4-${product.id}-${index}`} 
              {...product} 
              priority={index < 2}
            />
          ))}
        </Marquee>
      </div>

      {/* Large Shadow Fades - Top and Bottom for smooth fade in/out */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-2/5 z-10">
        <div className="h-full w-full bg-gradient-to-b from-background via-background/95 via-background/80 via-background/50 via-background/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent"></div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 z-10">
        <div className="h-full w-full bg-gradient-to-t from-background via-background/95 via-background/80 via-background/50 via-background/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
      </div>
      
      {/* Side Fades - Left and Right (softer) */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background/40 to-transparent z-10"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background/40 to-transparent z-10"></div>
    </div>
  )
}

