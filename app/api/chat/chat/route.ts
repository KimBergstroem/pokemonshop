import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'

// Create a new chat
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const { title } = await req.json()

    const chat = await prisma.chat.create({
      data: {
        userId: session?.user?.id,
        title: title || 'New Chat',
      },
    })

    return NextResponse.json(chat)
  } catch (error) {
    console.error('Error creating chat:', error)
    return NextResponse.json(
      { error: 'Failed to create chat' },
      { status: 500 }
    )
  }
}

// Get all chats for the user
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ chats: [] })
    }

    const chats = await prisma.chat.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    return NextResponse.json({ chats })
  } catch (error) {
    console.error('Error fetching chats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chats' },
      { status: 500 }
    )
  }
}
