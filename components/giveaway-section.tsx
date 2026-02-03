'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'
import { Gift, Twitch, Instagram, Sparkles, Users } from 'lucide-react'
import Link from 'next/link'

export function GiveawaySection() {
  const { t } = useLanguage()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })
  const currentFollowers = 442
  const goalFollowers = 2500
  const progressPercentage = (currentFollowers / goalFollowers) * 100

  return (
    <section ref={ref} className="relative py-24 overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          {/* Header with sparkles */}
          <div className="relative inline-block">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="absolute -top-4 -left-4"
            >
              <Sparkles className="w-8 h-8 text-primary" />
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-heading font-bold bg-gradient-to-r from-primary via-primary to-primary bg-clip-text text-transparent">
              {t.giveaway.title}
            </h2>
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="absolute -bottom-6 -right-7"
            >
              <Gift className="w-8 h-8 text-primary" />
            </motion.div>
          </div>

          {/* Main content card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative bg-card border-2 border-primary/30 rounded-2xl p-8 md:p-12 shadow-2xl overflow-hidden"
          >
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            <div className="relative z-10">
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                {/* Left side - Card image */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="relative"
                >
                  <div className="relative aspect-[63/88] max-w-sm mx-auto w-full">
                    {/* Glow effect behind card */}
                    <div className="absolute inset-0 bg-primary/20 rounded-xl blur-2xl scale-110" />
                    
                    {/* Card image */}
                    <div className="relative w-full h-full rounded-xl overflow-hidden border-4 border-primary/50 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                      <img
                        src="/giveaway.webp"
                        alt="Giveaway Card"
                        className="w-full h-full object-contain"
                        style={{ position: 'relative', zIndex: 1 }}
                      />
                    </div>
                    
                    {/* Floating sparkles around card */}
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-4 -right-4"
                    >
                      <Sparkles className="w-6 h-6 text-primary" />
                    </motion.div>
                    <motion.div
                      animate={{ y: [0, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      className="absolute -bottom-4 -left-4"
                    >
                      <Sparkles className="w-6 h-6 text-primary" />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Right side - Information */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="space-y-6 text-left"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-full bg-primary/10 border border-primary/30">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-heading font-bold">
                          {t.giveaway.instagramGoal}
                        </h3>
                        <p className="text-muted-foreground">
                          {t.giveaway.instagramDescription}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      className="space-y-3 pt-2"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">                         
                          <span className="font-semibold text-foreground">
                            {currentFollowers.toLocaleString('en-US')} / {goalFollowers.toLocaleString('en-US')}
                          </span>
                        </div>
                        <span className="font-bold text-primary">
                          {Math.round(progressPercentage)}%
                        </span>
                      </div>
                      
                      {/* Progress Bar Container */}
                      <div className="relative h-6 bg-muted rounded-full overflow-hidden border border-primary/20">
                        {/* Animated background gradient */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20"
                          animate={{
                            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                          style={{
                            backgroundSize: '200% 100%',
                          }}
                        />
                        
                        {/* Progress fill */}
                        <motion.div
                          className="relative h-full bg-gradient-to-r from-primary via-primary/90 to-primary rounded-full overflow-hidden"
                          initial={{ width: 0 }}
                          animate={inView ? { width: `${progressPercentage}%` } : { width: 0 }}
                          transition={{ duration: 1.5, delay: 0.8, ease: 'easeOut' }}
                        >
                          {/* Shimmer effect on progress */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            animate={{
                              x: ['-100%', '100%'],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatDelay: 0.5,
                              ease: 'easeInOut',
                            }}
                          />
                          
                          {/* Sparkle particles */}
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="absolute top-1/2 w-1 h-1 bg-white rounded-full"
                              style={{
                                left: `${20 + i * 30}%`,
                              }}
                              animate={{
                                y: [0, -8, 0],
                                opacity: [0.5, 1, 0.5],
                                scale: [1, 1.5, 1],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.3,
                                ease: 'easeInOut',
                              }}
                            />
                          ))}
                        </motion.div>
                      </div>
                    </motion.div>

                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-full bg-primary/10 border border-primary/30">
                        <Twitch className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-heading font-bold">
                          {t.giveaway.liveTitle}
                        </h3>
                        <p className="text-muted-foreground">
                          {t.giveaway.liveDescription}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                      <Button size="lg" className="w-full sm:w-auto gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                        <Instagram className="w-5 h-5" />
                        {t.giveaway.followButton}
                      </Button>
                    </Link>
                    <Link href="https://twitch.tv" target="_blank" rel="noopener noreferrer">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 border-primary/50 hover:bg-primary/10">
                        <Twitch className="w-5 h-5 text-primary" />
                        {t.giveaway.watchButton}
                      </Button>
                    </Link>
                  </div>

                  {/* Progress indicator or countdown */}
                  <div className="pt-4 border-t border-border/50">
                    <p className="text-sm text-muted-foreground">
                      {t.giveaway.footerText}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Additional info */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            {t.giveaway.subtitle}
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
