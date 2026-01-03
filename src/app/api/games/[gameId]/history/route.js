import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request, { params }) {
  try {
    const { gameId } = await params
    const { searchParams } = new URL(request.url)
    const eventType = searchParams.get('eventType')
    const limit = parseInt(searchParams.get('limit') || '100')

    // Build where clause
    const where = { gameId }
    if (eventType) {
      where.eventType = eventType
    }

    // Fetch events
    const events = await prisma.gameEvent.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })

    // Get event type counts
    const eventCounts = await prisma.gameEvent.groupBy({
      by: ['eventType'],
      where: { gameId },
      _count: {
        eventType: true
      }
    })

    return NextResponse.json({
      success: true,
      events,
      eventCounts: eventCounts.reduce((acc, curr) => {
        acc[curr.eventType] = curr._count.eventType
        return acc
      }, {})
    })

  } catch (error) {
    console.error('Error fetching game history:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil history' },
      { status: 500 }
    )
  }
}
