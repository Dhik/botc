'use client'

import { useState, useEffect } from 'react'
import { getCharacterIcon } from '@/utils/characterIcons'

export default function NightActionPanel({ game, player, allPlayers }) {
  const [selectedTargetIds, setSelectedTargetIds] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [myAction, setMyAction] = useState(null)
  const [isAwake, setIsAwake] = useState(false)

  const currentPhase = game?.currentPhase || 'night-1'
  const isNight = currentPhase?.startsWith('night')
  const characterId = player?.characterId?.toLowerCase() || ''
  const isFortuneTeller = characterId === 'fortune-teller'
  const maxTargets = isFortuneTeller ? 2 : 1

  // Check if player is awake
  useEffect(() => {
    const checkAwakeStatus = async () => {
      if (!game?.id || !player?.id || !isNight) {
        setIsAwake(false)
        return
      }

      try {
        const response = await fetch(`/api/players/awake?gameId=${game.id}&phase=${currentPhase}`)
        const data = await response.json()

        if (data.success) {
          setIsAwake(data.awakePlayerIds.includes(player.id))
        }
      } catch (error) {
        console.error('Error checking awake status:', error)
      }
    }

    checkAwakeStatus()
    const interval = setInterval(checkAwakeStatus, 2000)
    return () => clearInterval(interval)
  }, [game?.id, player?.id, currentPhase, isNight])

  // Fetch existing night action
  useEffect(() => {
    const fetchMyAction = async () => {
      if (!game?.id || !player?.id || !isNight) return

      try {
        const response = await fetch(`/api/night-actions?gameId=${game.id}&phase=${currentPhase}`)
        const data = await response.json()

        if (data.success) {
          // Find my action
          const action = data.nightActions.find(
            a => a.metadata?.playerId === player.id
          )
          if (action) {
            // Only update selection if the action ID changed (to avoid overwriting local changes)
            setMyAction(prevAction => {
              if (!prevAction || prevAction.id !== action.id) {
                // New action, update selection
                const targets = action.metadata?.targetPlayerIds || [action.metadata?.targetPlayerId]
                setSelectedTargetIds(targets.filter(Boolean))
              }
              return action
            })
          } else {
            // No action on server, clear everything
            setMyAction(null)
          }
        }
      } catch (error) {
        console.error('Error fetching night action:', error)
      }
    }

    fetchMyAction()

    // Poll every 3 seconds
    const interval = setInterval(fetchMyAction, 3000)
    return () => clearInterval(interval)
  }, [game?.id, player?.id, currentPhase, isNight])

  const handleSubmitAction = async () => {
    if (selectedTargetIds.length === 0 || !player?.characterId) return

    // Validate Fortune Teller has 2 targets
    if (isFortuneTeller && selectedTargetIds.length !== 2) {
      alert('Fortune Teller harus memilih 2 pemain!')
      return
    }

    setSubmitting(true)

    try {
      // Determine action type based on character
      let actionType = 'check' // default

      if (characterId.includes('demon') || characterId === 'imp') {
        actionType = 'kill'
      } else if (characterId === 'poisoner') {
        actionType = 'poison'
      } else if (characterId === 'fortune-teller') {
        actionType = 'check'
      } else if (characterId === 'monk') {
        actionType = 'protect'
      }

      // For single target actions, use first target
      const targetPlayerId = selectedTargetIds[0]

      const response = await fetch('/api/night-actions/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: game.id,
          playerId: player.id,
          targetPlayerId,
          targetPlayerIds: isFortuneTeller ? selectedTargetIds : [targetPlayerId],
          actionType,
          phase: currentPhase
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit action')
      }

      const data = await response.json()
      setMyAction(data.nightAction)
      alert('✅ Aksi berhasil dikirim!')
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      console.error('Error submitting action:', error)
      alert(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  // Don't show if not night phase
  if (!isNight) {
    return null
  }

  // Only show for characters who actively choose targets
  const hasActiveNightAction = ['imp', 'poisoner', 'fortune-teller', 'monk'].includes(characterId)

  if (!hasActiveNightAction) {
    return null
  }

  // Handle target selection (toggle for Fortune Teller, single for others)
  const handleTargetSelect = (targetId) => {
    if (isFortuneTeller) {
      // Fortune Teller can select 2
      if (selectedTargetIds.includes(targetId)) {
        setSelectedTargetIds(selectedTargetIds.filter(id => id !== targetId))
      } else if (selectedTargetIds.length < 2) {
        setSelectedTargetIds([...selectedTargetIds, targetId])
      }
    } else {
      // Other characters select only 1
      setSelectedTargetIds([targetId])
    }
  }

  // Don't show if player is not awake
  if (!isAwake) {
    return (
      <div className="card border-2 border-purple-700 bg-purple-900/20">
        <div className="text-center py-8">
          <p className="text-4xl mb-2">😴</p>
          <p className="text-gray-400">Tutup mata dan tidur</p>
          <p className="text-sm text-gray-500 mt-1">
            Tunggu Storyteller memanggilmu
          </p>
        </div>
      </div>
    )
  }

  // Filter available targets (can't target self)
  const availableTargets = allPlayers.filter(p =>
    !p.isGM &&
    p.isAlive &&
    p.id !== player.id
  )

  // Get action verb based on character
  let actionVerb = 'Pilih'
  let actionDescription = 'Pilih pemain untuk aksi malam ini'

  if (characterId.includes('demon') || characterId === 'imp') {
    actionVerb = 'Bunuh'
    actionDescription = 'Pilih pemain untuk dibunuh malam ini'
  } else if (characterId === 'poisoner') {
    actionVerb = 'Racuni'
    actionDescription = 'Pilih pemain untuk diracuni malam ini'
  } else if (characterId === 'fortune-teller') {
    actionVerb = 'Cek'
    actionDescription = 'Pilih 2 pemain untuk dicek apakah salah satunya Demon'
  } else if (characterId === 'monk') {
    actionVerb = 'Lindungi'
    actionDescription = 'Pilih pemain untuk dilindungi dari Demon malam ini'
  }

  // Find selected target players
  const selectedTargets = selectedTargetIds
    .map(id => allPlayers.find(p => p.id === id))
    .filter(Boolean)

  return (
    <div className="card border-2 border-purple-700 bg-purple-900/20 animate-slide-up">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl">🌙</span>
        <div>
          <h2 className="text-xl font-bold">Aksi Malam</h2>
          <p className="text-sm text-purple-400">{currentPhase}</p>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-purple-800/30 border border-purple-600 rounded-lg p-3 mb-4">
        <p className="text-sm">{actionDescription}</p>
        {isFortuneTeller && (
          <p className="text-xs text-purple-300 mt-1">
            ✨ Pilih tepat 2 pemain ({selectedTargetIds.length}/2 dipilih)
          </p>
        )}
      </div>

      {/* Current Action Display */}
      {myAction && selectedTargets.length > 0 && (
        <div className="mb-4 p-4 bg-gradient-to-r from-purple-900/40 to-red-900/40 rounded-lg border-2 border-purple-600">
          <p className="text-sm text-gray-400 mb-1">Aksi kamu:</p>
          <p className="text-lg font-bold text-purple-300">
            {actionVerb} → {selectedTargets.map(t => `#${t.seatNumber} ${t.name}`).join(' & ')}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            ✓ Storyteller sudah melihat pilihanmu
          </p>
        </div>
      )}

      {/* Player List */}
      <div className="space-y-2 mb-4 max-h-80 overflow-y-auto">
        <p className="text-sm font-medium mb-2">Pilih target:</p>
        {availableTargets.map(targetPlayer => {
          const isSelected = selectedTargetIds.includes(targetPlayer.id)
          const canSelect = !isSelected || isFortuneTeller
          const isDisabled = submitting || (!isSelected && selectedTargetIds.length >= maxTargets)

          return (
            <button
              key={targetPlayer.id}
              onClick={() => handleTargetSelect(targetPlayer.id)}
              disabled={isDisabled}
              className={`w-full p-3 rounded-lg border-2 text-left transition-all disabled:opacity-50 ${
                isSelected
                  ? 'bg-purple-900/50 border-purple-500 shadow-lg shadow-purple-900/50'
                  : 'bg-gray-800 border-gray-700 hover:border-purple-600 hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {targetPlayer.character && (
                    <span className="text-2xl">
                      {getCharacterIcon(targetPlayer.character.characterId)}
                    </span>
                  )}
                  <div>
                    <p className="font-bold">
                      #{targetPlayer.seatNumber} - {targetPlayer.name}
                    </p>
                    {targetPlayer.character && (
                      <p className="text-xs text-gray-400">
                        {targetPlayer.character.name}
                      </p>
                    )}
                  </div>
                </div>
                {isSelected && (
                  <div className="text-2xl">
                    {isFortuneTeller ? `${selectedTargetIds.indexOf(targetPlayer.id) + 1}` : '✓'}
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmitAction}
        disabled={selectedTargetIds.length === 0 || submitting || (isFortuneTeller && selectedTargetIds.length !== 2)}
        className="w-full py-3 px-4 bg-purple-900 hover:bg-purple-800 rounded-lg border border-purple-700 disabled:opacity-50 font-semibold"
      >
        {submitting ? 'Mengirim...' : myAction ? '🔄 Ubah Pilihan' : `✅ Konfirmasi ${actionVerb}`}
      </button>

      {/* Info */}
      <div className="mt-4 pt-4 border-t border-purple-700">
        <p className="text-xs text-gray-500">
          💡 Storyteller dapat melihat pilihanmu secara real-time
        </p>
      </div>
    </div>
  )
}
