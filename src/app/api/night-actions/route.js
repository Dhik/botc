import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const gameId = searchParams.get('gameId')
    const phase = searchParams.get('phase')

    if (!gameId) {
      return NextResponse.json(
        { error: 'gameId is required' },
        { status: 400 }
      )
    }

    // Build query
    const where = {
      gameId,
      eventType: {
        startsWith: 'night-action-'
      }
    }

    // If phase specified, filter by phase
    if (phase) {
      where.metadata = {
        path: ['phase'],
        equals: phase
      }
    }

    // Get all night actions
    const nightActions = await prisma.gameEvent.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      nightActions
    })

  } catch (error) {
    console.error('Error fetching night actions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch night actions' },
      { status: 500 }
    )
  }
}
