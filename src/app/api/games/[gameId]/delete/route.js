import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// DELETE: Delete a game and all related data
export async function DELETE(request, { params }) {
  try {
    const { gameId } = await params

    // Check if game exists
    const game = await prisma.game.findUnique({
      where: { id: gameId }
    })

    if (!game) {
      return NextResponse.json(
        { error: 'Game tidak ditemukan' },
        { status: 404 }
      )
    }

    // Delete all related data in order (due to foreign key constraints)
    // 1. Delete all votes
    await prisma.vote.deleteMany({
      where: { gameId }
    })

    // 2. Delete all night actions
    await prisma.nightAction.deleteMany({
      where: { gameId }
    })

    // 3. Delete all information
    await prisma.information.deleteMany({
      where: { gameId }
    })

    // 4. Delete all game events
    await prisma.gameEvent.deleteMany({
      where: { gameId }
    })

    // 5. Delete all players
    await prisma.player.deleteMany({
      where: { gameId }
    })

    // 6. Finally, delete the game itself
    await prisma.game.delete({
      where: { id: gameId }
    })

    return NextResponse.json({
      success: true,
      message: 'Game berhasil dihapus'
    })

  } catch (error) {
    console.error('Error deleting game:', error)
    return NextResponse.json(
      { error: 'Gagal menghapus game' },
      { status: 500 }
    )
  }
}
