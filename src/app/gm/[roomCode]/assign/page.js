'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import RoleAssigner from '@/components/gm/RoleAssigner'

export default function GMAssign({ params }) {
  const { roomCode } = use(params)
  const router = useRouter()
  const [gameId, setGameId] = useState(null)
  const [players, setPlayers] = useState([])
  const [selectedCharacters, setSelectedCharacters] = useState([])
  const [assignments, setAssignments] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const storedGameId = localStorage.getItem('gameId')
    const isGM = localStorage.getItem('isGM') === 'true'
    const storedCharacters = localStorage.getItem('selectedCharacters')

    if (!storedGameId || !isGM || !storedCharacters) {
      router.push(`/gm/${roomCode}/setup`)
      return
    }

    setGameId(storedGameId)
    setSelectedCharacters(JSON.parse(storedCharacters))
    fetchPlayers(storedGameId)
  }, [router, roomCode])

  const fetchPlayers = async (gameId) => {
    try {
      const res = await fetch(`/api/games/${gameId}`)
      const data = await res.json()
      const regularPlayers = data.players.filter(p => !p.isGM)
      setPlayers(regularPlayers)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching players:', err)
      setError('Gagal memuat data pemain')
      setLoading(false)
    }
  }

  const handleAssign = (playerId, character) => {
    setAssignments(prev => ({
      ...prev,
      [playerId]: character
    }))
  }

  const handleRandomAssign = () => {
    // Shuffle characters
    const shuffledCharacters = [...selectedCharacters].sort(() => Math.random() - 0.5)

    // Assign each player a random character
    const newAssignments = {}
    players.forEach((player, index) => {
      if (shuffledCharacters[index]) {
        newAssignments[player.id] = shuffledCharacters[index]
      }
    })

    setAssignments(newAssignments)
    setError('')
  }

  const handleStartGame = async () => {
    // Validate all players have characters
    const allAssigned = players.every(p => assignments[p.id])

    if (!allAssigned) {
      setError('Semua pemain harus di-assign karakter terlebih dahulu')
      return
    }

    setSaving(true)
    setError('')

    try {
      // Assign characters to all players
      const assignPromises = players.map(player => {
        const character = assignments[player.id]
        return fetch(`/api/games/${gameId}/players/${player.id}/character`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            characterId: character.characterId
          })
        })
      })

      await Promise.all(assignPromises)

      // Update game status to 'night' and set phase to 'night-1'
      await fetch(`/api/games/${gameId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'night',
          currentPhase: 'night-1',
          nightNumber: 1
        })
      })

      // Clear localStorage of selected characters
      localStorage.removeItem('selectedCharacters')

      // Navigate to GM game view
      router.push(`/gm/${roomCode}`)

    } catch (err) {
      console.error('Error starting game:', err)
      setError('Gagal memulai game. Silakan coba lagi.')
      setSaving(false)
    }
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

  const allAssigned = players.every(p => assignments[p.id])

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blood mb-2">Assign Roles</h1>
          <p className="text-gray-400">
            Assign karakter ke setiap pemain ({players.length} pemain)
          </p>
        </div>

        {/* Role Assigner */}
        <RoleAssigner
          players={players}
          characters={selectedCharacters}
          assignments={assignments}
          onAssign={handleAssign}
        />

        {/* Error Message */}
        {error && (
          <div className="mt-6 bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 space-y-4">
          {/* Random Assign Button */}
          <button
            onClick={handleRandomAssign}
            disabled={saving}
            className="w-full py-3 px-6 bg-purple-900 hover:bg-purple-800 rounded-lg border border-purple-700 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🎲 Random Assign Semua Karakter
          </button>

          <div className="flex gap-4">
            <button
              onClick={() => router.back()}
              className="btn-secondary flex-1"
              disabled={saving}
            >
              ← Kembali
            </button>
            <button
              onClick={handleStartGame}
              disabled={!allAssigned || saving}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memulai Game...
                </span>
              ) : (
                'Mulai Game →'
              )}
            </button>
          </div>
        </div>

        {/* Helper Text */}
        {!allAssigned && (
          <p className="mt-4 text-center text-sm text-yellow-400">
            Assign semua karakter ke pemain untuk melanjutkan
          </p>
        )}
      </div>
    </main>
  )
}
