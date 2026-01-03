import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(request, { params }) {
  try {
    const { gameId, playerId } = await params
    const body = await request.json()
    const { isAlive } = body

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

    // Update player status
    const updatedPlayer = await prisma.player.update({
      where: { id: playerId },
      data: { isAlive }
    })

    // Log event
    await prisma.gameEvent.create({
      data: {
        gameId,
        eventType: 'player-death',
        description: `${player.name} ${isAlive ? 'dihidupkan kembali' : 'mati'}`,
        metadata: { playerId, isAlive, playerName: player.name }
      }
    })

    return NextResponse.json({
      success: true,
      player: updatedPlayer
    })

  } catch (error) {
    console.error('Error updating player status:', error)
    return NextResponse.json(
      { error: 'Gagal update status pemain' },
      { status: 500 }
    )
  }
}
