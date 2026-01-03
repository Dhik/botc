import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(request, { params }) {
  try {
    const { gameId } = await params
    const body = await request.json()
    const { status, currentPhase, nightNumber, dayNumber, currentStep } = body

    // Validate game exists
    const game = await prisma.game.findUnique({
      where: { id: gameId }
    })

    if (!game) {
      return NextResponse.json(
        { error: 'Game tidak ditemukan' },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData = {}
    if (status) updateData.status = status
    if (currentPhase) updateData.currentPhase = currentPhase
    if (nightNumber !== undefined) updateData.nightNumber = nightNumber
    if (dayNumber !== undefined) updateData.dayNumber = dayNumber
    if (currentStep !== undefined) updateData.currentStep = currentStep

    // Update game
    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: updateData
    })

    // Log event
    await prisma.gameEvent.create({
      data: {
        gameId,
        eventType: 'status-change',
        description: `Game status changed to ${status || game.status}${currentPhase ? `, phase: ${currentPhase}` : ''}`,
        metadata: updateData
      }
    })

    return NextResponse.json({
      success: true,
      game: updatedGame
    })

  } catch (error) {
    console.error('Error updating game status:', error)
    return NextResponse.json(
      { error: 'Gagal update status game' },
      { status: 500 }
    )
  }
}
