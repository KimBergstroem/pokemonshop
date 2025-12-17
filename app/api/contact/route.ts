import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const submission = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        message,
      },
    })

    return NextResponse.json(
      { message: 'Contact submission saved', id: submission.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error saving contact submission:', error)
    return NextResponse.json(
      { error: 'Failed to save submission' },
      { status: 500 }
    )
  }
}
