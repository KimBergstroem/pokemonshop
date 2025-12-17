'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/cart-context'
import { useLanguage } from '@/contexts/language-context'

export function SuccessClient() {
  const { clearCart } = useCart()
  const { t } = useLanguage()

  useEffect(() => {
    clearCart()
  }, [])

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-6"
      >
        <CheckCircle className="w-24 h-24 mx-auto text-primary" />
        <h1 className="text-4xl font-heading font-bold">{t.checkout.successTitle}</h1>
        <p className="text-lg text-muted-foreground">
          {t.checkout.successMessage}
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/orders">
            <Button size="lg">{t.checkout.viewOrders}</Button>
          </Link>
          <Link href="/marketplace">
            <Button variant="outline" size="lg">{t.checkout.continueShopping}</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
