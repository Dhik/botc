import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const gameId = searchParams.get('gameId')
    const phase = searchParams.get('phase')

    if (!gameId) {
      return NextResponse.json(
        { error: 'gameId is required' },
        { status: 400 }
      )
    }

    // Get all awake players for this game/phase
    const awakeEvents = await prisma.gameEvent.findMany({
      where: {
        gameId,
        eventType: 'player-awake'
      }
    })

    // Extract player IDs
    const awakePlayerIds = awakeEvents
      .map(event => event.metadata?.playerId)
      .filter(Boolean)

    return NextResponse.json({
      success: true,
      awakePlayerIds
    })

  } catch (error) {
    console.error('Error fetching awake players:', error)
    return NextResponse.json(
      { error: 'Failed to fetch awake players' },
      { status: 500 }
    )
  }
}
