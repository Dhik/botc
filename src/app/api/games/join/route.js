import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateRoomCode } from '@/lib/roomCode'

export async function POST(request) {
  try {
    const body = await request.json()
    const { roomCode, playerName } = body

    // Validate input
    if (!roomCode || !validateRoomCode(roomCode)) {
      return NextResponse.json(
        { error: 'Room code tidak valid' },
        { status: 400 }
      )
    }

    if (!playerName || playerName.trim().length === 0) {
      return NextResponse.json(
        { error: 'Nama pemain harus diisi' },
        { status: 400 }
      )
    }

    if (playerName.length > 20) {
      return NextResponse.json(
        { error: 'Nama maksimal 20 karakter' },
        { status: 400 }
      )
    }

    // Find game by room code
    const game = await prisma.game.findUnique({
      where: { roomCode: roomCode.toUpperCase() },
      include: {
        players: {
          orderBy: { seatNumber: 'desc' },
          take: 1
        }
      }
    })

    if (!game) {
      return NextResponse.json(
        { error: 'Game tidak ditemukan' },
        { status: 404 }
      )
    }

    // Check if game is in lobby status
    if (game.status !== 'lobby') {
      return NextResponse.json(
        { error: 'Game sudah dimulai atau selesai' },
        { status: 400 }
      )
    }

    // Get next seat number
    const lastSeatNumber = game.players.length > 0 ? game.players[0].seatNumber : 0
    const nextSeatNumber = lastSeatNumber + 1

    // Check if max players reached (15 players max for Trouble Brewing)
    if (nextSeatNumber > 15) {
      return NextResponse.json(
        { error: 'Game sudah penuh (maksimal 15 pemain)' },
        { status: 400 }
      )
    }

    // Create player
    const player = await prisma.player.create({
      data: {
        gameId: game.id,
        name: playerName.trim(),
        seatNumber: nextSeatNumber,
        isGM: false,
      }
    })

    return NextResponse.json({
      success: true,
      game,
      player,
      roomCode: game.roomCode
    })

  } catch (error) {
    console.error('Error joining game:', error)
    return NextResponse.json(
      { error: 'Gagal bergabung ke game. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}
