import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(request, { params }) {
  try {
    const { gameId, playerId } = await params
    const body = await request.json()
    const { characterId } = body

    // Validate character exists
    const character = await prisma.character.findUnique({
      where: { characterId }
    })

    if (!character) {
      return NextResponse.json(
        { error: 'Karakter tidak ditemukan' },
        { status: 404 }
      )
    }

    // Validate player exists and belongs to game
    const player = await prisma.player.findUnique({
      where: { id: playerId }
    })

    if (!player || player.gameId !== gameId) {
      return NextResponse.json(
        { error: 'Pemain tidak ditemukan' },
        { status: 404 }
      )
    }

    // Update player's character
    const updatedPlayer = await prisma.player.update({
      where: { id: playerId },
      data: {
        characterId,
        actualRole: characterId // For now, actualRole is same as characterId
      }
    })

    return NextResponse.json({
      success: true,
      player: updatedPlayer
    })

  } catch (error) {
    console.error('Error assigning character:', error)
    return NextResponse.json(
      { error: 'Gagal assign karakter' },
      { status: 500 }
    )
  }
}
