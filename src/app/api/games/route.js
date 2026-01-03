import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: Fetch all games
export async function GET(request) {
  try {
    // Fetch all games with their players
    const games = await prisma.game.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        players: {
          orderBy: { seatNumber: 'asc' }
        }
      }
    })

    return NextResponse.json({
      success: true,
      games
    })

  } catch (error) {
    console.error('Error fetching games:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal mengambil daftar game'
      },
      { status: 500 }
    )
  }
}
