'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/cart-context'
import { useLanguage } from '@/contexts/language-context'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export function CartClient() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart()
  const { t } = useLanguage()
  const router = useRouter()
  const { data: session, status } = useSession() || {}

  const handleCheckout = async () => {
    if (status !== 'authenticated') {
      router.push('/auth/signin')
      return
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
        }),
      })

      const data = await response.json()

      if (data?.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Checkout error:', error)
    }
  }

  if (cart?.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center space-y-6">
          <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground" />
          <h1 className="text-3xl font-heading font-bold">{t.cart.empty}</h1>
          <p className="text-muted-foreground">{t.cart.emptyDescription}</p>
          <Link href="/marketplace">
            <Button size="lg" className="mt-4">{t.cart.continueShopping}</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        <h1 className="text-4xl font-heading font-bold">{t.cart.title}</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart?.map((item, index) => (
              <motion.div
                key={`${item?.product?.id}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="bg-card rounded-lg p-4 shadow-md flex gap-4"
              >
                <div className="relative w-24 h-24 rounded-md overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={item?.product?.image ?? ''}
                    alt={item?.product?.name ?? 'Product'}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold">{item?.product?.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item?.product?.rarity} | {item?.product?.condition}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item?.product?.id ?? '', Math.max(1, (item?.quantity ?? 1) - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center">{item?.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item?.product?.id ?? '', (item?.quantity ?? 0) + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(item?.product?.id ?? '')}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                  <p className="font-semibold text-lg">
                    €{((item?.product?.price ?? 0) * (item?.quantity ?? 1)).toFixed(2)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="bg-card rounded-lg p-6 shadow-lg space-y-6 sticky top-24">
              <h2 className="text-2xl font-heading font-semibold">{t.cart.summary}</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.cart.subtotal}</span>
                  <span>€{getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.cart.shipping}</span>
                  <span>{t.cart.calculatedAtCheckout}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-semibold">
                  <span>{t.cart.total}</span>
                  <span>€{getCartTotal().toFixed(2)}</span>
                </div>
              </div>
              <Button className="w-full" size="lg" onClick={handleCheckout}>
                {t.cart.checkout}
              </Button>
              <Link href="/marketplace">
                <Button variant="outline" className="w-full">
                  {t.cart.continueShopping}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
