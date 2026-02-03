'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Package, Calendar } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import type { Order, OrderItem, Product } from '@prisma/client'

type OrderWithItems = Order & {
  items: (OrderItem & {
    product: Product
  })[]
}

interface OrdersClientProps {
  orders: OrderWithItems[]
}

export function OrdersClient({ orders }: OrdersClientProps) {
  const { t } = useLanguage()

  if (orders?.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center space-y-6">
          <Package className="w-24 h-24 mx-auto text-muted-foreground" />
          <h1 className="text-3xl font-heading font-bold">{t.orders.noOrders}</h1>
          <p className="text-muted-foreground">{t.orders.noOrdersDescription}</p>
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
        <h1 className="text-4xl font-heading font-bold">{t.orders.title}</h1>

        <div className="space-y-6">
          {orders?.map((order, index) => (
            <motion.div
              key={order?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="bg-card rounded-lg p-6 shadow-lg space-y-4"
            >
              {/* Order Header */}
              <div className="flex flex-wrap justify-between items-start gap-4 border-b pb-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {t.orders.orderNumber}: <span className="font-mono">{order?.id?.slice(0, 8)}</span>
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(order?.createdAt ?? '').toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{t.orders.total}</p>
                  <p className="text-2xl font-semibold">€{order?.total?.toFixed(2)}</p>
                  <p className="text-sm capitalize mt-1">
                    <span
                      className={`px-2 py-1 rounded-full ${
                        order?.status === 'completed'
                          ? 'bg-primary/20 text-primary'
                          : order?.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-500'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {order?.status}
                    </span>
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3">
                {order?.items?.map((item) => (
                  <div key={item?.id} className="flex gap-4 items-center">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={item?.product?.image ?? ''}
                        alt={item?.product?.name ?? 'Product'}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item?.product?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {t.orders.quantity}: {item?.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">€{item?.price?.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
