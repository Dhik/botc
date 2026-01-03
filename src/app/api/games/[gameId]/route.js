import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request, { params }) {
  try {
    const { gameId } = await params

    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        players: {
          orderBy: { seatNumber: 'asc' }
        }
      }
    })

    if (!game) {
      return NextResponse.json(
        { error: 'Game tidak ditemukan' },
        { status: 404 }
      )
    }

    // Fetch character data for each player
    const playersWithCharacters = await Promise.all(
      game.players.map(async (player) => {
        if (!player.characterId) {
          return { ...player, character: null }
        }

        const character = await prisma.character.findUnique({
          where: { characterId: player.characterId }
        })

        return {
          ...player,
          character: character ? {
            characterId: character.characterId,
            name: character.name,
            type: character.type,
            team: character.type, // Use type as team (townsfolk, outsider, minion, demon)
            ability: character.ability,
            firstNight: character.firstNight,
            otherNights: character.otherNights
          } : null
        }
      })
    )

    return NextResponse.json({
      game,
      players: playersWithCharacters
    })

  } catch (error) {
    console.error('Error fetching game:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data game' },
      { status: 500 }
    )
  }
}
