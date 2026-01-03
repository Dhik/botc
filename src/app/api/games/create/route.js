import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateUniqueRoomCode } from '@/lib/roomCode'

export async function POST(request) {
  try {
    const body = await request.json()
    const { gmName } = body

    // Validate input
    if (!gmName || gmName.trim().length === 0) {
      return NextResponse.json(
        { error: 'Nama Game Master harus diisi' },
        { status: 400 }
      )
    }

    if (gmName.length > 20) {
      return NextResponse.json(
        { error: 'Nama maksimal 20 karakter' },
        { status: 400 }
      )
    }

    // Generate unique room code
    const roomCode = await generateUniqueRoomCode()

    // Create game and GM player in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create game
      const game = await tx.game.create({
        data: {
          roomCode,
          status: 'lobby',
          gmId: 'temp', // Will be updated after creating player
        }
      })

      // Create GM player
      const gmPlayer = await tx.player.create({
        data: {
          gameId: game.id,
          name: gmName.trim(),
          seatNumber: 0, // GM sits at position 0
          isGM: true,
        }
      })

      // Update game with GM ID
      const updatedGame = await tx.game.update({
        where: { id: game.id },
        data: { gmId: gmPlayer.id }
      })

      return { game: updatedGame, gmPlayer }
    })

    return NextResponse.json({
      success: true,
      game: result.game,
      player: result.gmPlayer,
      roomCode: result.game.roomCode
    })

  } catch (error) {
    console.error('Error creating game:', error)
    return NextResponse.json(
      { error: 'Gagal membuat game. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}
