'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'
import { ArrowRight } from 'lucide-react'
import { PokemonMarquee3D } from '@/components/pokemon-marquee-3d'

interface HeroProps {
  products: Array<{
    id: string
    name: string
    image: string
    price: number
    rarity?: string | null
    set?: string | null
  }>
}

export function Hero({ products }: HeroProps) {
  const { t } = useLanguage()

  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      {/* Pokemon Cards Marquee Background */}
      <div className="absolute inset-0 z-0 h-full">
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/80 z-10" />
        <div className="h-full w-full">
          <PokemonMarquee3D products={products} />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 max-w-6xl relative z-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-heading font-bold leading-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              {t.hero.headline}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              {t.hero.subheading}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/auth/signup">
                <Button size="lg" className="gap-2">
                  {t.hero.joinNow}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button size="lg" variant="outline" className="border-primary border-2 hover:bg-primary/10">
                  {t.hero.browseMarketplace}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
