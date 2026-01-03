import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(request) {
  try {
    const body = await request.json()
    const { votingSessionId } = body

    // Validate required fields
    if (!votingSessionId) {
      return NextResponse.json(
        { error: 'votingSessionId diperlukan' },
        { status: 400 }
      )
    }

    // Get voting session with all votes
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
          }
        },
        game: {
          include: {
            players: {
              where: {
                isGM: false
              }
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

    // Fetch nominated player separately
    const nominatedPlayer = await prisma.player.findUnique({
      where: { id: session.nominatedPlayerId },
      select: {
        id: true,
        name: true,
        seatNumber: true
      }
    })

    if (!session.isOpen) {
      return NextResponse.json(
        { error: 'Voting session sudah ditutup' },
        { status: 400 }
      )
    }

    // Calculate tally
    const yesVotes = session.votes.filter(v => v.value === 'yes').length
    const noVotes = session.votes.filter(v => v.value === 'no').length
    const passVotes = session.votes.filter(v => v.value === 'pass').length
    const totalPlayers = session.game.players.length
    const totalVotes = session.votes.length

    // Determine if execution passes (need more than 50% of total players to vote yes)
    const votesNeededToExecute = Math.floor(totalPlayers / 2) + 1
    const isExecuted = yesVotes >= votesNeededToExecute

    // Close voting session
    const updatedSession = await prisma.votingSession.update({
      where: { id: votingSessionId },
      data: {
        isOpen: false,
        closedAt: new Date()
      },
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
      }
    })

    // If player is executed, mark them as dead
    if (isExecuted) {
      await prisma.player.update({
        where: { id: session.nominatedPlayerId },
        data: { isAlive: false }
      })

      // Log execution event
      await prisma.gameEvent.create({
        data: {
          gameId: session.gameId,
          eventType: 'player-executed',
          description: `${nominatedPlayer.name} dieksekusi dengan voting (${yesVotes} yes, ${noVotes} no)`,
          metadata: {
            playerId: session.nominatedPlayerId,
            playerName: nominatedPlayer.name,
            yesVotes,
            noVotes,
            totalVotes,
            votingSessionId
          }
        }
      })
    } else {
      // Log failed execution
      await prisma.gameEvent.create({
        data: {
          gameId: session.gameId,
          eventType: 'voting-failed',
          description: `${nominatedPlayer.name} tidak dieksekusi (${yesVotes} yes, ${noVotes} no - butuh ${votesNeededToExecute})`,
          metadata: {
            playerId: session.nominatedPlayerId,
            playerName: nominatedPlayer.name,
            yesVotes,
            noVotes,
            totalVotes,
            votesNeededToExecute,
            votingSessionId
          }
        }
      })
    }

    return NextResponse.json({
      success: true,
      votingSession: {
        ...updatedSession,
        nominatedPlayer
      },
      result: {
        isExecuted,
        yesVotes,
        noVotes,
        passVotes,
        totalVotes,
        totalPlayers,
        votesNeededToExecute
      }
    })

  } catch (error) {
    console.error('Error closing voting session:', error)
    return NextResponse.json(
      { error: 'Gagal menutup voting session' },
      { status: 500 }
    )
  }
}
