import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(request, { params }) {
  try {
    const { playerId } = await params
    const body = await request.json()
    const { gameId, phase, isPoisoned } = body

    // Get player
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      select: {
        id: true,
        name: true,
        seatNumber: true,
        gameId: true,
        characterId: true
      }
    })

    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      )
    }

    // Log poison event
    await prisma.gameEvent.create({
      data: {
        gameId: player.gameId,
        eventType: isPoisoned ? 'player-poisoned' : 'player-unpoisoned',
        description: `${player.name} ${isPoisoned ? 'diracuni' : 'sembuh dari racun'} di ${phase || 'unknown phase'}`,
        metadata: {
          playerId: player.id,
          playerName: player.name,
          seatNumber: player.seatNumber,
          characterId: player.characterId,
          phase: phase || 'unknown',
          isPoisoned
        }
      }
    })

    return NextResponse.json({
      success: true,
      player: {
        ...player,
        isPoisoned
      }
    })

  } catch (error) {
    console.error('Error poisoning player:', error)
    return NextResponse.json(
      { error: 'Failed to poison player' },
      { status: 500 }
    )
  }
}
