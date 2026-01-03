import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const script = searchParams.get('script') || 'trouble-brewing'

    const characters = await prisma.character.findMany({
      where: { script },
      orderBy: [
        { type: 'asc' }, // Group by type
        { name: 'asc' }  // Then alphabetically
      ]
    })

    // Group characters by type for easier display
    const grouped = {
      townsfolk: characters.filter(c => c.type === 'townsfolk'),
      outsider: characters.filter(c => c.type === 'outsider'),
      minion: characters.filter(c => c.type === 'minion'),
      demon: characters.filter(c => c.type === 'demon')
    }

    return NextResponse.json({
      characters,
      grouped,
      total: characters.length
    })

  } catch (error) {
    console.error('Error fetching characters:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data karakter' },
      { status: 500 }
    )
  }
}
