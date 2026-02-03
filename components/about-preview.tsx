'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useInView } from 'react-intersection-observer'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'
import { ArrowRight } from 'lucide-react'
import { CDN } from '@/lib/cdn'
import { cn } from '@/lib/utils'

export function AboutPreview() {
  const { t } = useLanguage()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <section ref={ref} className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div
            className={cn(
              'space-y-6 transition-all duration-700 ease-out',
              inView ? 'translate-x-0 opacity-100' : '-translate-x-[30px] opacity-0'
            )}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold">
              {t.about.previewTitle}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t.about.previewText}
            </p>
            <p className="text-primary font-semibold italic text-xl pb-6">
              "{t.about.motto}"
            </p>
            <Link href="/about">
              <Button className="gap-2">
                {t.about.learnMore}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div
            className={cn(
              'relative aspect-square rounded-lg overflow-hidden shadow-2xl transition-all duration-700 ease-out delay-200',
              inView ? 'translate-x-0 opacity-100' : 'translate-x-[30px] opacity-0'
            )}
          >
            <Image
              src={CDN.main}
              alt="Angel, Kristian and Kim - Founders"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              loading="lazy"
              unoptimized
            />
          </div>
        </div>
      </div>
    </section>
  )
}
