'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function GamesPage() {
  const router = useRouter()
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGames()
  }, [])

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games')
      const data = await response.json()

      if (data.success) {
        setGames(data.games)
      }
    } catch (error) {
      console.error('Error fetching games:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blood mx-auto mb-4"></div>
          <p className="text-gray-400">Loading games...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-blood mb-2">Game Saya</h1>
            <p className="text-gray-400">Daftar semua game yang pernah kamu ikuti</p>
          </div>
          <Link
            href="/"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-600 transition-colors"
          >
            ← Kembali
          </Link>
        </div>

        {/* Games Grid */}
        {games.length === 0 ? (
          <div className="card text-center py-16">
            <div className="text-6xl mb-4">🎭</div>
            <h2 className="text-2xl font-bold text-gray-300 mb-2">Belum Ada Game</h2>
            <p className="text-gray-400 mb-6">Kamu belum pernah membuat atau bergabung dengan game apapun</p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/gm/create"
                className="px-6 py-3 bg-blood hover:bg-red-700 rounded-lg font-semibold transition-colors"
              >
                Buat Game Baru
              </Link>
              <Link
                href="/player/join"
                className="px-6 py-3 bg-townsfolk hover:bg-blue-700 rounded-lg font-semibold transition-colors"
              >
                Gabung Game
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map(game => (
              <div
                key={game.id}
                className="card hover:border-blood transition-all cursor-pointer group"
                onClick={() => {
                  // Check if user is GM or player and redirect accordingly
                  const gmPlayer = game.players?.find(p => p.isGM)
                  if (gmPlayer) {
                    router.push(`/gm/${game.id}`)
                  } else {
                    // Find player ID (you'll need to implement player identification)
                    router.push(`/player/${game.id}`)
                  }
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold group-hover:text-blood transition-colors">
                      Game #{game.roomCode}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {new Date(game.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="text-3xl">
                    {game.currentPhase?.startsWith('night') ? '🌙' : '☀️'}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400">Phase:</span>
                    <span className="font-semibold capitalize">
                      {game.currentPhase?.replace('-', ' ') || 'Setup'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400">Players:</span>
                    <span className="font-semibold">
                      {game.players?.filter(p => !p.isGM).length || 0} pemain
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400">Alive:</span>
                    <span className="font-semibold text-green-400">
                      {game.players?.filter(p => !p.isGM && p.isAlive).length || 0}
                    </span>
                    <span className="text-gray-400">/</span>
                    <span className="font-semibold text-red-400">
                      {game.players?.filter(p => !p.isGM && !p.isAlive).length || 0}
                    </span>
                  </div>
                </div>

                <div className={`px-3 py-1 rounded text-xs font-semibold inline-block ${
                  game.status === 'setup' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-700' :
                  game.status === 'in-progress' ? 'bg-green-900/30 text-green-400 border border-green-700' :
                  'bg-gray-800 text-gray-400 border border-gray-700'
                }`}>
                  {game.status === 'setup' ? '⏳ Setup' :
                   game.status === 'in-progress' ? '▶️ Berlangsung' :
                   '✓ Selesai'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
