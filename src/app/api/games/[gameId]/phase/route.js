import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getNextPhase } from '@/lib/gameLogic'

export async function PATCH(request, { params }) {
  try {
    const { gameId } = await params
    const body = await request.json()
    const { action, currentStep } = body

    // Get current game state
    const game = await prisma.game.findUnique({
      where: { id: gameId }
    })

    if (!game) {
      return NextResponse.json(
        { error: 'Game tidak ditemukan' },
        { status: 404 }
      )
    }

    let updateData = {}

    if (action === 'next-step') {
      // Just update the step number
      updateData.currentStep = currentStep !== undefined ? currentStep : game.currentStep + 1
    } else if (action === 'prev-step') {
      // Go back one step
      updateData.currentStep = Math.max(0, currentStep !== undefined ? currentStep : game.currentStep - 1)
    } else if (action === 'advance-phase') {
      // Move to next phase
      const nextPhase = getNextPhase(game.currentPhase)
      updateData.currentPhase = nextPhase
      updateData.currentStep = 0

      // Update day/night numbers
      if (nextPhase.startsWith('night')) {
        const nightNum = parseInt(nextPhase.split('-')[1])
        updateData.nightNumber = nightNum
      } else if (nextPhase.startsWith('day')) {
        const dayNum = parseInt(nextPhase.split('-')[1])
        updateData.dayNumber = dayNum
      }
    }

    // Update game
    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: updateData
    })

    // Log event
    await prisma.gameEvent.create({
      data: {
        gameId,
        eventType: 'phase-change',
        description: `Phase updated: ${updatedGame.currentPhase} step ${updatedGame.currentStep}`,
        metadata: updateData
      }
    })

    return NextResponse.json({
      success: true,
      game: updatedGame
    })

  } catch (error) {
    console.error('Error updating phase:', error)
    return NextResponse.json(
      { error: 'Gagal update phase' },
      { status: 500 }
    )
  }
}
