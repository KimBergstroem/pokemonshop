'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'
import { Sparkles } from 'lucide-react'

export function CTASection() {
  const { t } = useLanguage()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <section ref={ref} className="py-24 bg-primary/10">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          <Sparkles className="w-16 h-16 mx-auto text-primary" />
          <h2 className="text-3xl md:text-5xl font-heading font-bold">
            {t.cta.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.cta.description}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg">{t.cta.joinButton}</Button>
            </Link>
            <Link href="/marketplace">
              <Button size="lg" variant="outline">
                {t.cta.exploreButton}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
