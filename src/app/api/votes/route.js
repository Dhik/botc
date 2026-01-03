import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const gameId = searchParams.get('gameId')
    const votingSessionId = searchParams.get('votingSessionId')
    const isOpen = searchParams.get('isOpen')

    if (!gameId && !votingSessionId) {
      return NextResponse.json(
        { error: 'gameId atau votingSessionId diperlukan' },
        { status: 400 }
      )
    }

    if (votingSessionId) {
      // Get specific voting session with votes
      const session = await prisma.votingSession.findUnique({
        where: { id: votingSessionId },
        include: {
          votes: {
            include: {
              voter: {
                select: {
                  id: true,
                  name: true,
                  seatNumber: true,
                  isAlive: true
                }
              }
            },
            orderBy: {
              voter: {
                seatNumber: 'asc'
              }
            }
          }
        }
      })

      if (!session) {
        return NextResponse.json(
          { error: 'Voting session tidak ditemukan' },
          { status: 404 }
        )
      }

      // Fetch nominated and nominator players separately
      const nominatedPlayer = await prisma.player.findUnique({
        where: { id: session.nominatedPlayerId },
        select: {
          id: true,
          name: true,
          seatNumber: true,
          characterId: true
        }
      })

      let nominatorPlayer = null
      if (session.nominatorPlayerId) {
        nominatorPlayer = await prisma.player.findUnique({
          where: { id: session.nominatorPlayerId },
          select: {
            id: true,
            name: true,
            seatNumber: true
          }
        })
      }

      return NextResponse.json({
        success: true,
        votingSession: {
          ...session,
          nominatedPlayer,
          nominatorPlayer
        }
      })
    }

    // Get voting sessions for game
    const where = { gameId }
    if (isOpen !== null && isOpen !== undefined) {
      where.isOpen = isOpen === 'true'
    }

    const sessions = await prisma.votingSession.findMany({
      where,
      include: {
        votes: {
          include: {
            voter: {
              select: {
                id: true,
                name: true,
                seatNumber: true,
                isAlive: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Fetch player data for each session
    const sessionsWithPlayers = await Promise.all(
      sessions.map(async (session) => {
        const nominatedPlayer = await prisma.player.findUnique({
          where: { id: session.nominatedPlayerId },
          select: {
            id: true,
            name: true,
            seatNumber: true,
            characterId: true
          }
        })

        let nominatorPlayer = null
        if (session.nominatorPlayerId) {
          nominatorPlayer = await prisma.player.findUnique({
            where: { id: session.nominatorPlayerId },
            select: {
              id: true,
              name: true,
              seatNumber: true
            }
          })
        }

        return {
          ...session,
          nominatedPlayer,
          nominatorPlayer
        }
      })
    )

    return NextResponse.json({
      success: true,
      votingSessions: sessionsWithPlayers
    })

  } catch (error) {
    console.error('Error fetching voting sessions:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil voting sessions' },
      { status: 500 }
    )
  }
}
