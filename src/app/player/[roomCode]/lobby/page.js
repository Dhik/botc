'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRealtimeGame } from '@/hooks/useRealtimeGame'

export default function PlayerLobby({ params }) {
  const { roomCode } = use(params)
  const router = useRouter()
  const [gameId, setGameId] = useState(null)
  const [playerId, setPlayerId] = useState(null)
  const { game, players, loading, error } = useRealtimeGame(gameId)

  useEffect(() => {
    // Get gameId and playerId from localStorage
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

  useEffect(() => {
    // Redirect when game starts (status changes from 'lobby' to 'night' or other game phases)
    if (game && (game.status === 'setup' || game.status === 'night' || game.status === 'day')) {
      router.push(`/player/${roomCode}`)
    }
  }, [game, roomCode, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-townsfolk mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card max-w-md">
          <p className="text-red-400">Error: {error}</p>
        </div>
      </div>
    )
  }

  const regularPlayers = players.filter(p => !p.isGM)
  const currentPlayer = players.find(p => p.id === playerId)
  const gmPlayer = players.find(p => p.isGM)

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="card mb-6 text-center">
          <div className="text-6xl mb-4">⏳</div>
          <h1 className="text-3xl font-bold text-townsfolk mb-2">Menunggu...</h1>
          <p className="text-gray-400">Game Master sedang mempersiapkan game</p>
        </div>

        {/* Player Info */}
        {currentPlayer && (
          <div className="card mb-6">
            <h2 className="text-lg font-bold mb-3">Info Kamu</h2>
            <div className="bg-gray-900 rounded-lg p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-townsfolk flex items-center justify-center text-xl font-bold">
                {currentPlayer.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-lg">{currentPlayer.name}</p>
                <p className="text-sm text-gray-500">Seat #{currentPlayer.seatNumber}</p>
              </div>
            </div>
          </div>
        )}

        {/* Players List */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              Pemain di Lobby ({regularPlayers.length})
            </h2>
            {gmPlayer && (
              <span className="text-sm text-gray-500">
                GM: {gmPlayer.name}
              </span>
            )}
          </div>

          <div className="space-y-2">
            {regularPlayers.map((player, index) => (
              <div
                key={player.id}
                className={`bg-gray-900 rounded-lg p-3 flex items-center gap-3 ${
                  player.id === playerId ? 'ring-2 ring-townsfolk' : ''
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">
                    {player.name}
                    {player.id === playerId && (
                      <span className="ml-2 text-xs text-townsfolk">(Kamu)</span>
                    )}
                  </p>
                </div>
                <div className="text-green-400 text-sm">✓</div>
              </div>
            ))}
          </div>
        </div>

        {/* Waiting Message */}
        <div className="card bg-blue-900/20 border-blue-700">
          <div className="flex items-start gap-3">
            <div className="text-2xl">ℹ️</div>
            <div>
              <p className="font-semibold mb-1">Tips</p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Minimal 5 pemain untuk memulai game</li>
                <li>• Game Master akan memilih karakter dan membagikan role</li>
                <li>• Pastikan kamu siap dan fokus saat game dimulai</li>
                <li>• Jaga kerahasiaan role kamu dari pemain lain!</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Room Code Display */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-2">Room Code</p>
          <p className="text-2xl font-mono font-bold tracking-wider text-blood">
            {roomCode}
          </p>
        </div>
      </div>
    </main>
  )
}
