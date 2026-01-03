'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRealtimeGame } from '@/hooks/useRealtimeGame'

export default function GMLobby({ params }) {
  const { roomCode } = use(params)
  const router = useRouter()
  const [gameId, setGameId] = useState(null)
  const [copied, setCopied] = useState(false)
  const { game, players, loading, error } = useRealtimeGame(gameId)

  useEffect(() => {
    // Get gameId from localStorage
    const storedGameId = localStorage.getItem('gameId')
    const isGM = localStorage.getItem('isGM') === 'true'

    if (!storedGameId || !isGM) {
      router.push('/')
      return
    }

    setGameId(storedGameId)
  }, [router])

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleStartGame = () => {
    router.push(`/gm/${roomCode}/setup`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blood mx-auto mb-4"></div>
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
  const canStart = regularPlayers.length >= 5 // Min 5 players for Trouble Brewing

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="card mb-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-blood mb-2">Game Master Lobby</h1>
            <p className="text-gray-400 mb-4">Menunggu pemain bergabung...</p>

            {/* Room Code Display */}
            <div className="bg-gray-900 rounded-lg p-6 mb-4">
              <p className="text-sm text-gray-400 mb-2">Room Code:</p>
              <div className="flex items-center justify-center gap-4">
                <span className="text-5xl font-mono font-bold tracking-widest text-blood">
                  {roomCode}
                </span>
                <button
                  onClick={copyRoomCode}
                  className="btn-secondary"
                >
                  {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              Bagikan kode ini ke pemain agar mereka bisa bergabung
            </p>
          </div>
        </div>

        {/* Players List */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              Pemain ({regularPlayers.length}/15)
            </h2>
            <span className={`px-3 py-1 rounded-full text-sm ${
              canStart ? 'bg-green-900 text-green-200' : 'bg-gray-700 text-gray-300'
            }`}>
              {canStart ? 'Siap Mulai' : `Min. ${5 - regularPlayers.length} pemain lagi`}
            </span>
          </div>

          {regularPlayers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-4xl mb-2">🎮</p>
              <p>Belum ada pemain yang bergabung</p>
              <p className="text-sm mt-2">Minimal 5 pemain untuk mulai game</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-3">
              {regularPlayers.map((player, index) => (
                <div
                  key={player.id}
                  className="bg-gray-900 rounded-lg p-4 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-townsfolk flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{player.name}</p>
                    <p className="text-xs text-gray-500">Seat #{player.seatNumber}</p>
                  </div>
                  <div className="text-green-400">✓</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Game Info */}
        <div className="card mb-6">
          <h3 className="font-bold mb-3">Informasi Game</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Script:</span>
              <span className="font-semibold">Trouble Brewing</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Pemain Saat Ini:</span>
              <span className="font-semibold">{regularPlayers.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span className="font-semibold text-yellow-400">Lobby</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <button
          onClick={handleStartGame}
          disabled={!canStart}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {canStart ? 'Mulai Setup Game' : `Butuh ${5 - regularPlayers.length} pemain lagi`}
        </button>
      </div>
    </main>
  )
}
