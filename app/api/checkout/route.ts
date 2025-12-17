import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Stripe from 'stripe'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2025-11-17.clover',
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { items } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      )
    }

    // Get origin for success/cancel URLs
    const origin = request?.headers?.get('origin') ?? 'http://localhost:3000'

    // Create line items for Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item?.product?.name ?? 'Product',
          description: item?.product?.description ?? '',
          images: [item?.product?.image ?? ''],
        },
        unit_amount: Math.round((item?.product?.price ?? 0) * 100),
      },
      quantity: item?.quantity ?? 1,
    }))

    // Calculate total
    const total = items.reduce(
      (sum: number, item: any) =>
        sum + (item?.product?.price ?? 0) * (item?.quantity ?? 0),
      0
    )

    // Create order in database
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total,
        status: 'pending',
        customerEmail: session?.user?.email ?? '',
        customerName: session?.user?.name ?? '',
        items: {
          create: items.map((item: any) => ({
            productId: item?.product?.id ?? '',
            quantity: item?.quantity ?? 1,
            price: item?.product?.price ?? 0,
          })),
        },
      },
    })

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      customer_email: session?.user?.email ?? undefined,
      metadata: {
        orderId: order.id,
        userId: session.user.id,
      },
    })

    // Update order with Stripe session ID
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: checkoutSession.id },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
