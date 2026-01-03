import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(request, { params }) {
  try {
    const { playerId } = await params
    const body = await request.json()
    const { gameId, phase, isAwake } = body

    // Get player
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      select: {
        id: true,
        name: true,
        characterId: true,
        gameId: true
      }
    })

    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      )
    }

    // Delete existing wake state for this player in this phase
    await prisma.gameEvent.deleteMany({
      where: {
        gameId: player.gameId,
        eventType: 'player-awake',
        metadata: {
          path: ['playerId'],
          equals: playerId
        }
      }
    })

    // Create new wake state if awake
    if (isAwake) {
      await prisma.gameEvent.create({
        data: {
          gameId: player.gameId,
          eventType: 'player-awake',
          description: `${player.name} bangun di ${phase}`,
          metadata: {
            playerId: player.id,
            playerName: player.name,
            characterId: player.characterId,
            phase: phase || 'unknown',
            isAwake: true
          }
        }
      })
    }

    return NextResponse.json({
      success: true,
      isAwake
    })

  } catch (error) {
    console.error('Error toggling wake state:', error)
    return NextResponse.json(
      { error: 'Failed to toggle wake state' },
      { status: 500 }
    )
  }
}
