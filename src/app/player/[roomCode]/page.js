'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRealtimeGame } from '@/hooks/useRealtimeGame'
import PlayerDashboard from '@/components/player/PlayerDashboard'

export default function PlayerGameView({ params }) {
  const router = useRouter()
  const [gameId, setGameId] = useState(null)
  const [playerId, setPlayerId] = useState(null)
  const { game, players, loading } = useRealtimeGame(gameId)

  useEffect(() => {
    const storedGameId = localStorage.getItem('gameId')
    const storedPlayerId = localStorage.getItem('playerId')
    const isGM = localStorage.getItem('isGM') === 'true'

    if (!storedGameId || !storedPlayerId || isGM) {
      router.push('/')
      return
    }

    setGameId(storedGameId)
    setPlayerId(storedPlayerId)
  }, [router])

  const currentPlayer = players.find(p => p.id === playerId)

  if (loading || !currentPlayer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-townsfolk mx-auto mb-4"></div>
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
    <PlayerDashboard
      game={game}
      player={currentPlayer}
      allPlayers={players}
    />
  )
}
