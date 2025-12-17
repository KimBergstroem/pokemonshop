'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'

export function AboutClient() {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-12"
      >
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
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative w-64 h-80 mx-auto rounded-lg overflow-hidden shadow-xl"
        >
          <Image
            src="https://media.istockphoto.com/id/1081389024/photo/real-caucasian-man-with-blank-expression.jpg?s=612x612&w=0&k=20&c=Wr8k5kCW1wtgORnZ_dfBtk8tQBuPunTnprfYoSvVO_I="
            alt="Kim - Pokemon Collector"
            fill
            className="object-cover"
          />
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-y-6 text-lg leading-relaxed"
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
        </motion.div>

        {/* Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="bg-card rounded-lg p-8 shadow-lg space-y-4"
        >
          <h2 className="text-2xl font-heading font-semibold text-center">
            {t.about.philosophyTitle}
          </h2>
          <p className="text-muted-foreground text-center italic text-xl">
            "{t.about.motto}"
          </p>
          <p className="text-muted-foreground text-center">
            {t.about.philosophy}
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
