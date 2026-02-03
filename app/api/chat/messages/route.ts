import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

/** Max messages per chat. Oldest are deleted when cap is reached. */
const MAX_MESSAGES_PER_CHAT = 50

// Save a message to the database. Enforces cap per chat to avoid unbounded growth.
export async function POST(req: Request) {
  try {
    const { chatId, role, content } = await req.json()

    if (!chatId || !role || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const count = await prisma.message.count({ where: { chatId } })
    if (count >= MAX_MESSAGES_PER_CHAT) {
      const toDelete = await prisma.message.findMany({
        where: { chatId },
        orderBy: { createdAt: 'asc' },
        take: count - MAX_MESSAGES_PER_CHAT + 1,
        select: { id: true },
      })
      if (toDelete.length > 0) {
        await prisma.message.deleteMany({
          where: { id: { in: toDelete.map((m) => m.id) } },
        })
      }
    }

    const message = await prisma.message.create({
      data: {
        chatId,
        role,
        content,
      },
    })

    await prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('Error saving message:', error)
    return NextResponse.json(
      { error: 'Failed to save message' },
      { status: 500 }
    )
  }
}
