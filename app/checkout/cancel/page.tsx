'use client'

import { motion } from 'framer-motion'
import { XCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'

export default function CheckoutCancelPage() {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-6"
      >
        <XCircle className="w-24 h-24 mx-auto text-destructive" />
        <h1 className="text-4xl font-heading font-bold">{t.checkout.cancelTitle}</h1>
        <p className="text-lg text-muted-foreground">
          {t.checkout.cancelMessage}
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/cart">
            <Button size="lg">{t.checkout.returnToCart}</Button>
          </Link>
          <Link href="/marketplace">
            <Button variant="outline" size="lg">{t.checkout.continueShopping}</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
