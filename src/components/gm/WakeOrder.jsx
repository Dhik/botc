'use client'

import { useMemo, useState, useEffect } from 'react'
import { getWakeOrder, isFirstNight } from '@/lib/gameLogic'
import { getCharacterInstruction } from '@/data/phaseGuides'
import { getCharacterTypeIcon, getCharacterTypeColor } from '@/lib/gameLogic'

export default function WakeOrder({
  currentPhase,
  players,
  allCharacters
}) {
  const [awakePlayerIds, setAwakePlayerIds] = useState([])
  const [wakingPlayerId, setWakingPlayerId] = useState(null)

  // Fetch awake players
  useEffect(() => {
    const fetchAwakePlayers = async () => {
      if (!currentPhase?.startsWith('night')) return

      try {
        const gameId = players[0]?.gameId
        if (!gameId) return

        const response = await fetch(`/api/players/awake?gameId=${gameId}&phase=${currentPhase}`)
        const data = await response.json()

        if (data.success) {
          setAwakePlayerIds(data.awakePlayerIds)
        }
      } catch (error) {
        console.error('Error fetching awake players:', error)
      }
    }

    fetchAwakePlayers()
    const interval = setInterval(fetchAwakePlayers, 2000)
    return () => clearInterval(interval)
  }, [currentPhase, players])

  const handleToggleWake = async (playerId, playerName, isCurrentlyAwake) => {
    setWakingPlayerId(playerId)

    try {
      const gameId = players[0]?.gameId

      const response = await fetch(`/api/players/${playerId}/wake`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId,
          phase: currentPhase,
          isAwake: !isCurrentlyAwake
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to toggle wake')
      }

      // Refresh awake players immediately
      const refreshResponse = await fetch(`/api/players/awake?gameId=${gameId}&phase=${currentPhase}`)
      const refreshData = await refreshResponse.json()
      if (refreshData.success) {
        setAwakePlayerIds(refreshData.awakePlayerIds)
      }
    } catch (error) {
      console.error('Error toggling wake:', error)
      alert(error.message)
    } finally {
      setWakingPlayerId(null)
    }
  }
  const wakeOrderCharacters = useMemo(() => {
    if (!currentPhase || !currentPhase.startsWith('night')) {
      return []
    }

    // Get all unique character IDs from ALIVE players only
    const playerCharacterIds = players
      .filter(p => p.characterId && !p.isGM && p.isAlive) // Only show alive players
      .map(p => p.characterId)

    // Get character details for these IDs
    const charactersInPlay = playerCharacterIds
      .map(charId => allCharacters?.find(c => c.characterId === charId))
      .filter(Boolean)

    // Get wake order for current night
    const firstNight = isFirstNight(currentPhase)
    return getWakeOrder(charactersInPlay, firstNight)
  }, [currentPhase, players, allCharacters])

  if (!currentPhase?.startsWith('night')) {
    return (
      <div className="card">
        <h3 className="font-bold mb-2">Wake Order</h3>
        <p className="text-sm text-gray-500">
          Wake order hanya tersedia saat fase malam
        </p>
      </div>
    )
  }

  if (wakeOrderCharacters.length === 0) {
    return (
      <div className="card">
        <h3 className="font-bold mb-2">Wake Order</h3>
        <p className="text-sm text-gray-500">
          Tidak ada karakter yang perlu dibangunkan malam ini
        </p>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold">Wake Order</h3>
        <span className="text-xs text-gray-500">
          {isFirstNight(currentPhase) ? 'Malam Pertama' : 'Malam Lainnya'}
        </span>
      </div>

      <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
        {wakeOrderCharacters.map((character, index) => {
          const instruction = getCharacterInstruction(character.characterId)
          // Only show alive players in wake order
          const playersWithChar = players.filter(p =>
            p.characterId === character.characterId && p.isAlive
          )

          return (
            <details
              key={character.id}
              className="group"
            >
              <summary className="cursor-pointer list-none">
                <div
                  className="p-3 rounded-lg border-2 transition-all hover:border-opacity-100"
                  style={{
                    borderColor: getCharacterTypeColor(character.type),
                    backgroundColor: `${getCharacterTypeColor(character.type)}10`
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getCharacterTypeIcon(character.type)}</span>
                        <span className="font-semibold">{character.name}</span>
                      </div>
                      {playersWithChar.length > 0 && (
                        <p className="text-xs text-gray-500">
                          {playersWithChar.map(p => p.name).join(', ')}
                        </p>
                      )}
                    </div>
                    <span className="text-gray-500 text-sm group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </div>
                </div>
              </summary>

              <div className="mt-2 ml-11 p-3 bg-gray-900 rounded-lg border border-gray-700">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Instruksi:</p>
                    <p className="text-sm">{instruction.instruction}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Yang ditanyakan:</p>
                    <p className="text-sm italic text-gray-400">{instruction.question}</p>
                  </div>
                  {character.ability && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Ability:</p>
                      <p className="text-xs text-gray-400">{character.ability}</p>
                    </div>
                  )}

                  {/* Wake Controls for Players with this Character */}
                  {playersWithChar.length > 0 && (
                    <div className="pt-3 border-t border-gray-700">
                      <p className="text-xs text-gray-500 mb-2">Wake Controls:</p>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                        {playersWithChar.map(player => {
                          const isAwake = awakePlayerIds.includes(player.id)
                          const isWaking = wakingPlayerId === player.id
                          const isDead = !player.isAlive

                          return (
                            <button
                              key={player.id}
                              onClick={() => handleToggleWake(player.id, player.name, isAwake)}
                              disabled={isWaking || isDead}
                              className={`w-full p-2 rounded-lg border-2 text-left text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                isDead
                                  ? 'bg-gray-900 border-gray-700 text-gray-600'
                                  : isAwake
                                  ? 'bg-green-900/30 border-green-700 text-green-300'
                                  : 'bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-500'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">
                                    {player.name}
                                    {isDead && ' 💀'}
                                  </p>
                                  <p className="text-xs opacity-75">
                                    Kursi #{player.seatNumber}
                                    {isDead && ' (Mati)'}
                                  </p>
                                </div>
                                <span className="text-2xl">
                                  {isDead ? '💀' : isWaking ? '⏳' : isAwake ? '👁️' : '😴'}
                                </span>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </details>
          )
        })}
      </div>

      <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
        <p className="text-xs text-blue-200">
          💡 Klik pada karakter untuk melihat instruksi detail
        </p>
      </div>
    </div>
  )
}
