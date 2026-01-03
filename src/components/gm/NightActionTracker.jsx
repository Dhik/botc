'use client'

import { useState, useEffect } from 'react'
import { getCharacterIcon } from '@/utils/characterIcons'

export default function NightActionTracker({ game, players }) {
  const [nightActions, setNightActions] = useState([])
  const [loading, setLoading] = useState(true)
  const [killingPlayerId, setKillingPlayerId] = useState(null)
  const [awakePlayerIds, setAwakePlayerIds] = useState([])
  const [wakingPlayerId, setWakingPlayerId] = useState(null)

  const currentPhase = game?.currentPhase || 'night-1'
  const isNight = currentPhase?.startsWith('night')

  // Fetch night actions
  useEffect(() => {
    const fetchNightActions = async () => {
      if (!game?.id || !isNight) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/night-actions?gameId=${game.id}&phase=${currentPhase}`)
        const data = await response.json()

        if (data.success) {
          setNightActions(data.nightActions)
        }
        setLoading(false)
      } catch (error) {
        console.error('Error fetching night actions:', error)
        setLoading(false)
      }
    }

    fetchNightActions()

    // Poll every 2 seconds for real-time updates
    const interval = setInterval(fetchNightActions, 2000)
    return () => clearInterval(interval)
  }, [game?.id, currentPhase, isNight])

  // Fetch awake players
  useEffect(() => {
    const fetchAwakePlayers = async () => {
      if (!game?.id || !isNight) return

      try {
        const response = await fetch(`/api/players/awake?gameId=${game.id}&phase=${currentPhase}`)
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
  }, [game?.id, currentPhase, isNight])

  const handleKillPlayer = async (playerId, playerName) => {
    if (!confirm(`Yakin ingin membunuh ${playerName}?`)) {
      return
    }

    setKillingPlayerId(playerId)

    try {
      const response = await fetch(`/api/players/${playerId}/kill`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: game.id,
          phase: currentPhase,
          killedBy: 'Storyteller'
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to kill player')
      }

      alert(`✅ ${playerName} telah dibunuh`)
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      console.error('Error killing player:', error)
      alert(error.message)
    } finally {
      setKillingPlayerId(null)
    }
  }

  const handlePoisonPlayer = async (playerId, playerName, isPoisoned) => {
    if (!confirm(`Yakin ingin ${isPoisoned ? 'meracuni' : 'menyembuhkan'} ${playerName}?`)) {
      return
    }

    setKillingPlayerId(playerId)

    try {
      const response = await fetch(`/api/players/${playerId}/poison`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: game.id,
          phase: currentPhase,
          isPoisoned
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to poison player')
      }

      alert(`✅ ${playerName} ${isPoisoned ? 'diracuni' : 'sembuh dari racun'}`)
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      console.error('Error poisoning player:', error)
      alert(error.message)
    } finally {
      setKillingPlayerId(null)
    }
  }

  const handleToggleWake = async (playerId, playerName, isCurrentlyAwake) => {
    setWakingPlayerId(playerId)

    try {
      const response = await fetch(`/api/players/${playerId}/wake`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: game.id,
          phase: currentPhase,
          isAwake: !isCurrentlyAwake
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to toggle wake')
      }

      // Refresh awake players immediately
      const refreshResponse = await fetch(`/api/players/awake?gameId=${game.id}&phase=${currentPhase}`)
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

  if (!isNight) {
    return null
  }

  // Group actions by action type
  const actionsByType = {
    kill: nightActions.filter(a => a.eventType === 'night-action-kill'),
    poison: nightActions.filter(a => a.eventType === 'night-action-poison'),
    protect: nightActions.filter(a => a.eventType === 'night-action-protect'),
    check: nightActions.filter(a => a.eventType === 'night-action-check')
  }

  // Check if anyone targeted for poison
  const poisonAction = actionsByType.poison[0]
  const poisonedPlayerId = poisonAction?.metadata?.targetPlayerId

  return (
    <div className="card border-2 border-purple-700 bg-purple-900/10">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl">👁️</span>
        <div>
          <h2 className="text-xl font-bold">Night Action Tracker</h2>
          <p className="text-sm text-purple-400">{currentPhase}</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
        </div>
      ) : (
        <>
          {/* Wake-up Controls - Only for characters who actively choose targets */}
          <div className="mb-4">
            <h3 className="text-sm font-bold text-yellow-400 mb-2 flex items-center gap-2">
              <span>👁️</span> Wake-up Controls (Active Roles)
            </h3>
            <p className="text-xs text-gray-400 mb-2">
              Kontrol untuk karakter yang memilih target (Imp, Poisoner, Fortune Teller, Monk)
            </p>
            <div className="grid grid-cols-2 gap-2">
              {players.filter(p => !p.isGM && p.isAlive && p.character).map(player => {
                const isAwake = awakePlayerIds.includes(player.id)
                const characterId = player.character?.characterId?.toLowerCase() || ''
                // Only show characters who actively choose targets
                const hasActiveNightAction = ['imp', 'poisoner', 'fortune-teller', 'monk'].includes(characterId)

                if (!hasActiveNightAction) return null

                return (
                  <button
                    key={player.id}
                    onClick={() => handleToggleWake(player.id, player.name, isAwake)}
                    disabled={wakingPlayerId === player.id}
                    className={`p-2 rounded border-2 text-left text-xs transition-all ${
                      isAwake
                        ? 'bg-green-900/30 border-green-700 text-green-300'
                        : 'bg-gray-800 border-gray-700 text-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold">{player.name}</p>
                        <p className="text-xs opacity-75">{player.character?.name}</p>
                      </div>
                      <span className="text-lg">
                        {wakingPlayerId === player.id ? '⏳' : isAwake ? '👁️' : '😴'}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
            <div className="mt-2 p-2 bg-blue-900/20 border border-blue-700 rounded text-xs text-blue-200">
              💡 Info: Karakter pasif (Chef, Empath, Washerwoman, dll) menerima info otomatis dari GM, tidak perlu wake control
            </div>
          </div>

          {/* Kill Actions */}
          {actionsByType.kill.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-bold text-red-400 mb-2 flex items-center gap-2">
                <span>🔪</span> Kill Actions
              </h3>
              <div className="space-y-2">
                {actionsByType.kill.map(action => (
                  <div
                    key={action.id}
                    className="bg-red-900/20 border border-red-700 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-red-300">
                          {action.metadata?.playerName} → Bunuh → {action.metadata?.targetPlayerName}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {action.metadata?.characterId}
                        </p>
                      </div>
                      <button
                        onClick={() => handleKillPlayer(
                          action.metadata?.targetPlayerId,
                          action.metadata?.targetPlayerName
                        )}
                        disabled={killingPlayerId === action.metadata?.targetPlayerId}
                        className="px-3 py-1 bg-red-900 hover:bg-red-800 rounded border border-red-700 text-xs disabled:opacity-50"
                      >
                        {killingPlayerId === action.metadata?.targetPlayerId ? 'Killing...' : '💀 Execute Kill'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Poison Actions */}
          {actionsByType.poison.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-bold text-green-400 mb-2 flex items-center gap-2">
                <span>☠️</span> Poison Actions
              </h3>
              <div className="space-y-2">
                {actionsByType.poison.map(action => (
                  <div
                    key={action.id}
                    className="bg-green-900/20 border border-green-700 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-green-300">
                          {action.metadata?.playerName} → Racuni → {action.metadata?.targetPlayerName}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {action.metadata?.characterId}
                        </p>
                      </div>
                      <button
                        onClick={() => handlePoisonPlayer(
                          action.metadata?.targetPlayerId,
                          action.metadata?.targetPlayerName,
                          true
                        )}
                        disabled={killingPlayerId === action.metadata?.targetPlayerId}
                        className="px-3 py-1 bg-green-900 hover:bg-green-800 rounded border border-green-700 text-xs disabled:opacity-50"
                      >
                        {killingPlayerId === action.metadata?.targetPlayerId ? 'Applying...' : '☠️ Apply Poison'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Protect Actions */}
          {actionsByType.protect.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-bold text-blue-400 mb-2 flex items-center gap-2">
                <span>🛡️</span> Protect Actions
              </h3>
              <div className="space-y-2">
                {actionsByType.protect.map(action => (
                  <div
                    key={action.id}
                    className="bg-blue-900/20 border border-blue-700 rounded-lg p-3"
                  >
                    <p className="font-medium text-blue-300">
                      {action.metadata?.playerName} → Lindungi → {action.metadata?.targetPlayerName}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {action.metadata?.characterId}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Check Actions */}
          {actionsByType.check.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-bold text-purple-400 mb-2 flex items-center gap-2">
                <span>🔮</span> Check Actions
              </h3>
              <div className="space-y-2">
                {actionsByType.check.map(action => (
                  <div
                    key={action.id}
                    className="bg-purple-900/20 border border-purple-700 rounded-lg p-3"
                  >
                    <p className="font-medium text-purple-300">
                      {action.metadata?.playerName} → Cek → {action.metadata?.targetPlayerName}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {action.metadata?.characterId}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Actions */}
          {nightActions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">Belum ada night action</p>
              <p className="text-xs mt-1">Tunggu pemain melakukan aksi</p>
            </div>
          )}

          {/* Misinformation Helper */}
          {poisonedPlayerId && (
            <div className="mt-4 bg-yellow-900/20 border border-yellow-700 rounded-lg p-3">
              <p className="text-sm font-bold text-yellow-400 mb-2">
                ⚠️ Reminder: Misinformation
              </p>
              <p className="text-xs text-gray-300">
                Pemain yang diracuni akan menerima informasi yang salah dari ability mereka.
                Berikan misinformasi saat memberikan info kepada mereka.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
