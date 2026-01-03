import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: Fetch information for a specific game or player
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const gameId = searchParams.get('gameId')
    const playerId = searchParams.get('playerId')

    if (!gameId) {
      return NextResponse.json(
        { error: 'gameId diperlukan' },
        { status: 400 }
      )
    }

    const where = { gameId }
    if (playerId) {
      where.playerId = playerId
    }

    const information = await prisma.information.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      include: {
        player: {
          select: {
            id: true,
            name: true,
            seatNumber: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      information
    })

  } catch (error) {
    console.error('Error fetching information:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil informasi' },
      { status: 500 }
    )
  }
}

// POST: Create new information
export async function POST(request) {
  try {
    const body = await request.json()
    const { gameId, playerId, phase, infoType, content } = body

    // Validate required fields
    if (!gameId || !playerId || !content) {
      return NextResponse.json(
        { error: 'gameId, playerId, dan content diperlukan' },
        { status: 400 }
      )
    }

    // Validate player exists
    const player = await prisma.player.findUnique({
      where: { id: playerId }
    })

    if (!player || player.gameId !== gameId) {
      return NextResponse.json(
        { error: 'Pemain tidak ditemukan' },
        { status: 404 }
      )
    }

    // Create information
    const information = await prisma.information.create({
      data: {
        gameId,
        playerId,
        phase: phase || 'night-1',
        infoType: infoType || 'ability-info',
        content
      },
      include: {
        player: {
          select: {
            id: true,
            name: true,
            seatNumber: true
          }
        }
      }
    })

    // Log event
    await prisma.gameEvent.create({
      data: {
        gameId,
        eventType: 'information-sent',
        description: `Informasi dikirim ke ${player.name}`,
        metadata: {
          playerId,
          playerName: player.name,
          infoType: infoType || 'ability-info',
          contentPreview: content.substring(0, 50)
        }
      }
    })

    return NextResponse.json({
      success: true,
      information
    })

  } catch (error) {
    console.error('Error creating information:', error)
    return NextResponse.json(
      { error: 'Gagal mengirim informasi' },
      { status: 500 }
    )
  }
}
