import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  try {
    const body = await request.json()
    const { gameId, nominatedPlayerId, nominatorPlayerId } = body

    // Validate required fields
    if (!gameId || !nominatedPlayerId) {
      return NextResponse.json(
        { error: 'gameId dan nominatedPlayerId diperlukan' },
        { status: 400 }
      )
    }

    // Get game to get current day number
    const game = await prisma.game.findUnique({
      where: { id: gameId }
    })

    if (!game) {
      return NextResponse.json(
        { error: 'Game tidak ditemukan' },
        { status: 404 }
      )
    }

    // Validate nominated player exists
    const nominatedPlayer = await prisma.player.findUnique({
      where: { id: nominatedPlayerId }
    })

    if (!nominatedPlayer || nominatedPlayer.gameId !== gameId) {
      return NextResponse.json(
        { error: 'Pemain yang dinominasikan tidak ditemukan' },
        { status: 404 }
      )
    }

    // Check if there's already an open voting session
    const existingSession = await prisma.votingSession.findFirst({
      where: {
        gameId,
        isOpen: true
      }
    })

    if (existingSession) {
      return NextResponse.json(
        { error: 'Sudah ada voting session yang aktif' },
        { status: 400 }
      )
    }

    // Create voting session
    const votingSession = await prisma.votingSession.create({
      data: {
        game: {
          connect: { id: gameId }
        },
        nominatedPlayerId,
        nominatorPlayerId: nominatorPlayerId || gameId, // Use gameId as default if no nominator
        dayNumber: game.dayNumber || 1,
        isOpen: true
      }
    })

    // Fetch nominator player if provided
    let nominatorPlayer = null
    if (nominatorPlayerId) {
      nominatorPlayer = await prisma.player.findUnique({
        where: { id: nominatorPlayerId },
        select: {
          id: true,
          name: true,
          seatNumber: true
        }
      })
    }

    // Log event
    await prisma.gameEvent.create({
      data: {
        gameId,
        eventType: 'voting-started',
        description: `Voting dimulai: ${nominatedPlayer.name} dinominasikan${nominatorPlayer ? ` oleh ${nominatorPlayer.name}` : ''}`,
        metadata: {
          votingSessionId: votingSession.id,
          nominatedPlayerId,
          nominatorPlayerId,
          dayNumber: game.dayNumber || 1
        }
      }
    })

    // Return session with player data
    return NextResponse.json({
      success: true,
      votingSession: {
        ...votingSession,
        nominatedPlayer: {
          id: nominatedPlayer.id,
          name: nominatedPlayer.name,
          seatNumber: nominatedPlayer.seatNumber
        },
        nominatorPlayer
      }
    })

  } catch (error) {
    console.error('Error creating voting session:', error)
    return NextResponse.json(
      { error: 'Gagal membuat voting session' },
      { status: 500 }
    )
  }
}
