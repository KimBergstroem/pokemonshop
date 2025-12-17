import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { OrdersClient } from './orders-client'
import prisma from '@/lib/db'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

async function getOrders(userId: string) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return orders
  } catch (error) {
    console.error('Error fetching orders:', error)
    return []
  }
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const orders = await getOrders(session.user.id)

  return <OrdersClient orders={orders} />
}
