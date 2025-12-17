'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'
import { ArrowRight } from 'lucide-react'

export function AboutPreview() {
  const { t } = useLanguage()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <section ref={ref} className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold">
              {t.about.previewTitle}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t.about.previewText}
            </p>
            <p className="text-primary font-semibold italic text-xl">
              "{t.about.motto}"
            </p>
            <Link href="/about">
              <Button className="gap-2">
                {t.about.learnMore}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative aspect-square rounded-lg overflow-hidden shadow-2xl"
          >
            <Image
              src="https://media.istockphoto.com/id/1081389024/photo/real-caucasian-man-with-blank-expression.jpg?s=612x612&w=0&k=20&c=Wr8k5kCW1wtgORnZ_dfBtk8tQBuPunTnprfYoSvVO_I="
              alt="Kim - Founder"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
