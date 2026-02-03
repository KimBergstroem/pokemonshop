'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface RarityIconProps {
  rarity: string | null | undefined
  className?: string
}

// Map rarity strings to star count and icon filename
function getRarityIconPath(rarity: string | null | undefined): string | null {
  if (!rarity) return '/1.png'
  
  const rarityLower = rarity.toLowerCase()
  
  // 1 star rarities
  if (rarityLower.includes('rare') && !rarityLower.includes('double') && !rarityLower.includes('ultra') && !rarityLower.includes('hyper') && !rarityLower.includes('illustration')) {
    return '/1.png'
  }
  if (rarityLower.includes('illustration rare') && !rarityLower.includes('special')) {
    return '/1.png'
  }
  
  // 2 star rarities
  if (rarityLower.includes('double rare') || rarityLower.includes('double-rare')) {
    return '/2.png'
  }
  if (rarityLower.includes('ultra rare') || rarityLower.includes('ultra-rare')) {
    return '/2.png'
  }
  if (rarityLower.includes('special illustration rare') || rarityLower.includes('special-illustration-rare')) {
    return '/2.png'
  }
  
  // 3 star rarities
  if (rarityLower.includes('hyper rare') || rarityLower.includes('hyper-rare')) {
    return '/3.png'
  }
  
  // Common and Uncommon - no stars, return null to hide icon
  if (rarityLower.includes('common') || rarityLower.includes('uncommon')) {
    return null
  }
  
  // Default to 1 star
  return '/1.png'
}

export function RarityIcon({ rarity, className }: RarityIconProps) {
  const iconPath = getRarityIconPath(rarity)
  
  if (!rarity || rarity.toLowerCase().includes('common')) {
    return (
      <svg
        viewBox="0 0 24 24"
        className={cn("!w-3 !h-3 dark:text-white", className)}
        fill="currentColor"
      >
        <circle cx="12" cy="12" r="10" />
      </svg>
    )
  }
  
  // Uncommon - Show black diamond SVG
  if (rarity.toLowerCase().includes('uncommon')) {
    return (
      <svg
        viewBox="0 0 24 24"
        className={cn("!w-3 !h-3 text-black dark:text-white", className)}
        fill="currentColor"
      >
        <path d="M12 2L22 12L12 22L2 12L12 2Z" />
      </svg>
    )
  }
  
  if (!iconPath) return null

  return (
    <Image
      src={iconPath}
      alt={rarity || 'Rarity icon'}
      width={26}
      height={26}
      className={cn("object-contain", className)}
      unoptimized={false}
    />
  )
}
