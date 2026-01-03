import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  try {
    const body = await request.json()
    const { votingSessionId, voterId, value, targetId } = body

    // Validate required fields
    if (!votingSessionId || !voterId || !value || !targetId) {
      return NextResponse.json(
        { error: 'votingSessionId, voterId, value, dan targetId diperlukan' },
        { status: 400 }
      )
    }

    // Get voting session
    const session = await prisma.votingSession.findUnique({
      where: { id: votingSessionId },
      include: {
        game: true
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

    // Get voter
    const voter = await prisma.player.findUnique({
      where: { id: voterId }
    })

    if (!voter || voter.gameId !== session.gameId) {
      return NextResponse.json(
        { error: 'Voter tidak ditemukan' },
        { status: 404 }
      )
    }

    // Check if voter is dead and determine if this is a ghost vote
    let isGhostVote = false
    if (!voter.isAlive) {
      // This is a dead player voting
      if (voter.hasUsedGhostVote) {
        return NextResponse.json(
          { error: 'Kamu sudah menggunakan ghost vote' },
          { status: 400 }
        )
      }
      isGhostVote = true
    }

    // Check if vote already exists
    const existingVote = await prisma.vote.findFirst({
      where: {
        votingSessionId,
        voterId
      }
    })

    let vote

    if (existingVote) {
      // Check if vote is locked
      if (existingVote.isLocked) {
        return NextResponse.json(
          { error: 'Vote sudah dikunci, tidak bisa diubah' },
          { status: 400 }
        )
      }

      // Update existing vote
      vote = await prisma.vote.update({
        where: { id: existingVote.id },
        data: {
          targetId, // Update target player if changed
          value,
          isGhostVote
        },
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
      })
    } else {
      // Create new vote
      vote = await prisma.vote.create({
        data: {
          gameId: session.gameId,
          votingSessionId,
          voterId,
          targetId, // Use targetId from request (the player being voted for)
          value,
          isGhostVote,
          isLocked: false
        },
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
      })
    }

    // If this is a ghost vote, mark the player as having used their ghost vote
    if (isGhostVote) {
      await prisma.player.update({
        where: { id: voterId },
        data: { hasUsedGhostVote: true }
      })
    }

    return NextResponse.json({
      success: true,
      vote
    })

  } catch (error) {
    console.error('Error casting vote:', error)
    return NextResponse.json(
      { error: 'Gagal memberikan vote' },
      { status: 500 }
    )
  }
}
