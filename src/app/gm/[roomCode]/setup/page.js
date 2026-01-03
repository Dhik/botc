'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import CharacterSelector from '@/components/gm/CharacterSelector'
import { calculateRequiredDistribution, validateCharacterSelection } from '@/lib/gameLogic'

export default function GMSetup({ params }) {
  const { roomCode } = use(params)
  const router = useRouter()
  const [gameId, setGameId] = useState(null)
  const [players, setPlayers] = useState([])
  const [allCharacters, setAllCharacters] = useState(null)
  const [selectedCharacters, setSelectedCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const storedGameId = localStorage.getItem('gameId')
    const isGM = localStorage.getItem('isGM') === 'true'

    if (!storedGameId || !isGM) {
      router.push('/')
      return
    }

    setGameId(storedGameId)
    fetchData(storedGameId)
  }, [router])

  const fetchData = async (gameId) => {
    try {
      // Fetch game and players
      const gameRes = await fetch(`/api/games/${gameId}`)
      const gameData = await gameRes.json()
      const regularPlayers = gameData.players.filter(p => !p.isGM)
      setPlayers(regularPlayers)

      // Fetch all characters
      const charRes = await fetch('/api/characters?script=trouble-brewing')
      const charData = await charRes.json()
      setAllCharacters(charData.grouped)

      setLoading(false)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Gagal memuat data')
      setLoading(false)
    }
  }

  const handleToggleCharacter = (character) => {
    setSelectedCharacters(prev => {
      const isSelected = prev.some(c => c.characterId === character.characterId)

      if (isSelected) {
        return prev.filter(c => c.characterId !== character.characterId)
      } else {
        return [...prev, character]
      }
    })
  }

  const handleContinue = async () => {
    const playerCount = players.length
    const required = calculateRequiredDistribution(playerCount)

    if (!validateCharacterSelection(selectedCharacters, playerCount)) {
      setError('Pilihan karakter belum sesuai dengan distribusi yang dibutuhkan')
      return
    }

    setSaving(true)

    try {
      // Save selected characters to localStorage for next step
      localStorage.setItem('selectedCharacters', JSON.stringify(selectedCharacters))

      // Navigate to assignment page
      router.push(`/gm/${roomCode}/assign`)
    } catch (err) {
      setError('Gagal menyimpan pilihan karakter')
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

  const playerCount = players.length
  const required = calculateRequiredDistribution(playerCount)
  const isValid = validateCharacterSelection(selectedCharacters, playerCount)

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blood mb-2">Setup Game</h1>
          <p className="text-gray-400">
            Pilih {playerCount} karakter untuk game ini ({players.length} pemain)
          </p>
        </div>

        {/* Character Selector */}
        {allCharacters && (
          <CharacterSelector
            characters={allCharacters}
            selectedCharacters={selectedCharacters}
            onToggleCharacter={handleToggleCharacter}
            required={required}
            playerCount={playerCount}
          />
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-6 bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => router.back()}
            className="btn-secondary flex-1"
          >
            ← Kembali
          </button>
          <button
            onClick={handleContinue}
            disabled={!isValid || saving}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Menyimpan...' : 'Lanjut ke Assignment →'}
          </button>
        </div>

        {/* Helper Text */}
        {!isValid && selectedCharacters.length > 0 && (
          <p className="mt-4 text-center text-sm text-yellow-400">
            Sesuaikan jumlah karakter dengan distribusi yang dibutuhkan
          </p>
        )}
      </div>
    </main>
  )
}
