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

    if (!session.isOpen) {
      return NextResponse.json(
        { error: 'Voting session sudah ditutup' },
        { status: 400 }
      )
    }

    // Calculate vote tally by target player
    const voteTally = {}
    session.votes.forEach(vote => {
      if (!voteTally[vote.targetId]) {
        voteTally[vote.targetId] = 0
      }
      voteTally[vote.targetId]++
    })

    // Find player(s) with highest votes
    let highestVoteCount = 0
    let playersWithHighestVotes = []

    Object.entries(voteTally).forEach(([playerId, count]) => {
      if (count > highestVoteCount) {
        highestVoteCount = count
        playersWithHighestVotes = [playerId]
      } else if (count === highestVoteCount) {
        playersWithHighestVotes.push(playerId)
      }
    })

    // Check for tie
    const isTie = playersWithHighestVotes.length > 1

    let eliminatedPlayer = null
    let tiedPlayers = []

    // Close voting session
    await prisma.votingSession.update({
      where: { id: votingSessionId },
      data: {
        isOpen: false,
        closedAt: new Date()
      }
    })

    if (isTie) {
      // Fetch tied player details
      tiedPlayers = await Promise.all(
        playersWithHighestVotes.map(async (playerId) => {
          const player = await prisma.player.findUnique({
            where: { id: playerId },
            select: { id: true, name: true, seatNumber: true }
          })
          return player
        })
      )

      // Log tie event
      await prisma.gameEvent.create({
        data: {
          gameId: session.gameId,
          eventType: 'voting-tie',
          description: `Voting tie! Pemain dengan ${highestVoteCount} votes: ${tiedPlayers.map(p => p.name).join(', ')}`,
          metadata: {
            votingSessionId,
            tiedPlayerIds: playersWithHighestVotes,
            highestVoteCount,
            voteTally
          }
        }
      })
    } else if (highestVoteCount > 0) {
      // Eliminate player with highest votes
      const eliminatedPlayerId = playersWithHighestVotes[0]

      eliminatedPlayer = await prisma.player.findUnique({
        where: { id: eliminatedPlayerId },
        select: { id: true, name: true, seatNumber: true }
      })

      // Mark player as dead
      await prisma.player.update({
        where: { id: eliminatedPlayerId },
        data: { isAlive: false }
      })

      // Log elimination event
      await prisma.gameEvent.create({
        data: {
          gameId: session.gameId,
          eventType: 'player-eliminated',
          description: `${eliminatedPlayer.name} dieliminasi dengan ${highestVoteCount} votes`,
          metadata: {
            playerId: eliminatedPlayerId,
            playerName: eliminatedPlayer.name,
            voteCount: highestVoteCount,
            votingSessionId,
            voteTally
          }
        }
      })
    } else {
      // No votes - log event
      await prisma.gameEvent.create({
        data: {
          gameId: session.gameId,
          eventType: 'voting-no-elimination',
          description: 'Voting selesai tanpa eliminasi (tidak ada votes)',
          metadata: {
            votingSessionId
          }
        }
      })
    }

    return NextResponse.json({
      success: true,
      result: {
        isTie,
        highestVoteCount,
        eliminatedPlayer,
        tiedPlayers,
        voteTally
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
