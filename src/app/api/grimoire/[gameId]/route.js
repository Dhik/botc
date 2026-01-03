import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: Fetch grimoire state
export async function GET(request, { params }) {
  try {
    const { gameId } = await params

    const grimoireState = await prisma.grimoireState.findUnique({
      where: { gameId }
    })

    if (!grimoireState) {
      // Create default grimoire state if doesn't exist
      const newState = await prisma.grimoireState.create({
        data: {
          gameId,
          tokens: {},
          reminders: {},
          notes: ''
        }
      })

      return NextResponse.json({
        success: true,
        grimoireState: newState
      })
    }

    return NextResponse.json({
      success: true,
      grimoireState
    })

  } catch (error) {
    console.error('Error fetching grimoire state:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil grimoire state' },
      { status: 500 }
    )
  }
}

// PATCH: Update grimoire state
export async function PATCH(request, { params }) {
  try {
    const { gameId } = await params
    const body = await request.json()
    const { tokens, reminders, notes } = body

    // Check if grimoire state exists
    const existingState = await prisma.grimoireState.findUnique({
      where: { gameId }
    })

    let grimoireState

    if (existingState) {
      // Update existing state
      grimoireState = await prisma.grimoireState.update({
        where: { gameId },
        data: {
          tokens: tokens !== undefined ? tokens : existingState.tokens,
          reminders: reminders !== undefined ? reminders : existingState.reminders,
          notes: notes !== undefined ? notes : existingState.notes
        }
      })
    } else {
      // Create new state
      grimoireState = await prisma.grimoireState.create({
        data: {
          gameId,
          tokens: tokens || {},
          reminders: reminders || {},
          notes: notes || ''
        }
      })
    }

    // Log event
    await prisma.gameEvent.create({
      data: {
        gameId,
        eventType: 'grimoire-updated',
        description: 'Grimoire state updated',
        metadata: {
          hasTokens: Object.keys(grimoireState.tokens || {}).length > 0,
          hasReminders: Object.keys(grimoireState.reminders || {}).length > 0,
          hasNotes: !!grimoireState.notes
        }
      }
    })

    return NextResponse.json({
      success: true,
      grimoireState
    })

  } catch (error) {
    console.error('Error updating grimoire state:', error)
    return NextResponse.json(
      { error: 'Gagal update grimoire state' },
      { status: 500 }
    )
  }
}
