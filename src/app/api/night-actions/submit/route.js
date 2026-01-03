import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  try {
    const body = await request.json()
    const { gameId, playerId, targetPlayerId, actionType, phase } = body

    // Validate required fields
    if (!gameId || !playerId || !targetPlayerId || !actionType || !phase) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Get player info
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      select: {
        id: true,
        name: true,
        characterId: true,
        gameId: true
      }
    })

    if (!player || player.gameId !== gameId) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      )
    }

    // Get target player info
    const targetPlayer = await prisma.player.findUnique({
      where: { id: targetPlayerId },
      select: {
        id: true,
        name: true,
        seatNumber: true
      }
    })

    if (!targetPlayer) {
      return NextResponse.json(
        { error: 'Target player not found' },
        { status: 404 }
      )
    }

    // Check if action already exists for this player in this phase
    const existingAction = await prisma.gameEvent.findFirst({
      where: {
        gameId,
        eventType: `night-action-${actionType}`,
        metadata: {
          path: ['phase'],
          equals: phase
        }
      }
    })

    let nightAction

    if (existingAction && existingAction.metadata?.playerId === playerId) {
      // Update existing action
      nightAction = await prisma.gameEvent.update({
        where: { id: existingAction.id },
        data: {
          description: `${player.name} (${player.characterId}) → ${actionType} → ${targetPlayer.name}`,
          metadata: {
            playerId: player.id,
            playerName: player.name,
            characterId: player.characterId,
            targetPlayerId: targetPlayer.id,
            targetPlayerName: targetPlayer.name,
            targetSeatNumber: targetPlayer.seatNumber,
            actionType,
            phase
          }
        }
      })
    } else {
      // Create new night action
      nightAction = await prisma.gameEvent.create({
        data: {
          gameId,
          eventType: `night-action-${actionType}`,
          description: `${player.name} (${player.characterId}) → ${actionType} → ${targetPlayer.name}`,
          metadata: {
            playerId: player.id,
            playerName: player.name,
            characterId: player.characterId,
            targetPlayerId: targetPlayer.id,
            targetPlayerName: targetPlayer.name,
            targetSeatNumber: targetPlayer.seatNumber,
            actionType,
            phase
          }
        }
      })
    }

    return NextResponse.json({
      success: true,
      nightAction
    })

  } catch (error) {
    console.error('Error submitting night action:', error)
    return NextResponse.json(
      { error: 'Failed to submit night action' },
      { status: 500 }
    )
  }
}
