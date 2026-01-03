'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRealtimeGame } from '@/hooks/useRealtimeGame'
import GMDashboard from '@/components/gm/GMDashboard'

export default function GMGameView({ params }) {
  const router = useRouter()
  const [gameId, setGameId] = useState(null)
  const [allCharacters, setAllCharacters] = useState([])
  const [loadingChars, setLoadingChars] = useState(true)
  const { game, players, loading, refetch } = useRealtimeGame(gameId)

  useEffect(() => {
    const storedGameId = localStorage.getItem('gameId')
    const isGM = localStorage.getItem('isGM') === 'true'

    if (!storedGameId || !isGM) {
      router.push('/')
      return
    }

    setGameId(storedGameId)
    fetchCharacters()
  }, [router])

  const fetchCharacters = async () => {
    try {
      const response = await fetch('/api/characters?script=trouble-brewing')
      const data = await response.json()
      setAllCharacters(data.characters || [])
      setLoadingChars(false)
    } catch (error) {
      console.error('Error fetching characters:', error)
      setLoadingChars(false)
    }
  }

  const handleGameUpdate = (updatedGame) => {
    // Optionally refetch to ensure sync
    refetch()
  }

  if (loading || loadingChars) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blood mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Game...</p>
        </div>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card max-w-md text-center">
          <p className="text-red-400 mb-4">Game tidak ditemukan</p>
          <button
            onClick={() => router.push('/')}
            className="btn-primary"
          >
            Kembali ke Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <GMDashboard
      game={game}
      players={players}
      allCharacters={allCharacters}
      onGameUpdate={handleGameUpdate}
    />
  )
}
