import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(request, { params }) {
  try {
    const { playerId } = await params
    const body = await request.json()
    const { gameId, phase, killedBy } = body

    // Get player
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      select: {
        id: true,
        name: true,
        seatNumber: true,
        gameId: true,
        isAlive: true,
        characterId: true
      }
    })

    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      )
    }

    if (!player.isAlive) {
      return NextResponse.json(
        { error: 'Player is already dead' },
        { status: 400 }
      )
    }

    // Kill the player
    const updatedPlayer = await prisma.player.update({
      where: { id: playerId },
      data: { isAlive: false }
    })

    // Log the death event
    await prisma.gameEvent.create({
      data: {
        gameId: player.gameId,
        eventType: 'player-death',
        description: `${player.name} terbunuh di ${phase || 'unknown phase'}${killedBy ? ` oleh ${killedBy}` : ''}`,
        metadata: {
          playerId: player.id,
          playerName: player.name,
          seatNumber: player.seatNumber,
          characterId: player.characterId,
          phase: phase || 'unknown',
          killedBy: killedBy || 'unknown'
        }
      }
    })

    return NextResponse.json({
      success: true,
      player: updatedPlayer
    })

  } catch (error) {
    console.error('Error killing player:', error)
    return NextResponse.json(
      { error: 'Failed to kill player' },
      { status: 500 }
    )
  }
}
