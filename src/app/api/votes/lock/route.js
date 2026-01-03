import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(request) {
  try {
    const body = await request.json()
    const { voteId, isLocked } = body

    // Validate required fields
    if (!voteId || typeof isLocked !== 'boolean') {
      return NextResponse.json(
        { error: 'voteId dan isLocked diperlukan' },
        { status: 400 }
      )
    }

    // Get vote
    const vote = await prisma.vote.findUnique({
      where: { id: voteId },
      include: {
        votingSession: true
      }
    })

    if (!vote) {
      return NextResponse.json(
        { error: 'Vote tidak ditemukan' },
        { status: 404 }
      )
    }

    // Check if voting session is still open
    if (!vote.votingSession.isOpen) {
      return NextResponse.json(
        { error: 'Voting session sudah ditutup' },
        { status: 400 }
      )
    }

    // Update vote lock status
    const updatedVote = await prisma.vote.update({
      where: { id: voteId },
      data: { isLocked },
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

    return NextResponse.json({
      success: true,
      vote: updatedVote
    })

  } catch (error) {
    console.error('Error locking vote:', error)
    return NextResponse.json(
      { error: 'Gagal mengunci vote' },
      { status: 500 }
    )
  }
}
