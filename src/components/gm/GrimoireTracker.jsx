'use client'

import { useState, useEffect } from 'react'
import PlayerToken from '@/components/shared/PlayerToken'

export default function GrimoireTracker({ game, players }) {
  const [grimoireState, setGrimoireState] = useState(null)
  const [selectedPlayerId, setSelectedPlayerId] = useState(null)
  const [reminderInput, setReminderInput] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Fetch grimoire state
  useEffect(() => {
    if (!game?.id || !isOpen) return

    const fetchGrimoireState = async () => {
      try {
        const response = await fetch(`/api/grimoire/${game.id}`)
        const data = await response.json()

        if (data.success) {
          setGrimoireState(data.grimoireState)
          setNotes(data.grimoireState.notes || '')
        }
      } catch (error) {
        console.error('Error fetching grimoire state:', error)
      }
    }

    fetchGrimoireState()
  }, [game?.id, isOpen])

  const saveGrimoireState = async (updates) => {
    if (!game?.id) return

    setSaving(true)

    try {
      const response = await fetch(`/api/grimoire/${game.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (!response.ok) throw new Error('Failed to save grimoire state')

      const data = await response.json()
      setGrimoireState(data.grimoireState)
    } catch (error) {
      console.error('Error saving grimoire state:', error)
      alert('Gagal menyimpan grimoire state')
    } finally {
      setSaving(false)
    }
  }

  const handleAddReminder = () => {
    if (!selectedPlayerId || !reminderInput.trim()) return

    const currentReminders = grimoireState?.reminders || {}
    const playerReminders = currentReminders[selectedPlayerId] || []

    const updatedReminders = {
      ...currentReminders,
      [selectedPlayerId]: [...playerReminders, reminderInput.trim()]
    }

    saveGrimoireState({ reminders: updatedReminders })
    setReminderInput('')
  }

  const handleRemoveReminder = (playerId, reminderIndex) => {
    const currentReminders = grimoireState?.reminders || {}
    const playerReminders = currentReminders[playerId] || []

    const updatedPlayerReminders = playerReminders.filter((_, idx) => idx !== reminderIndex)

    const updatedReminders = {
      ...currentReminders,
      [playerId]: updatedPlayerReminders
    }

    saveGrimoireState({ reminders: updatedReminders })
  }

  const handleSaveNotes = () => {
    saveGrimoireState({ notes })
  }

  // Arrange players in a circle
  const nonGMPlayers = players.filter(p => !p.isGM).sort((a, b) => a.seatNumber - b.seatNumber)
  const playerCount = nonGMPlayers.length
  const radius = 180 // pixels from center

  const getPlayerPosition = (index) => {
    const angle = (index / playerCount) * 2 * Math.PI - Math.PI / 2 // Start from top
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    return { x, y }
  }

  const selectedPlayer = nonGMPlayers.find(p => p.id === selectedPlayerId)
  const selectedPlayerReminders = grimoireState?.reminders?.[selectedPlayerId] || []

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blood hover:bg-red-800 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-all hover:scale-110 z-40"
        title="Buka Grimoire"
      >
        <span className="text-3xl">📖</span>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 overflow-y-auto">
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className="text-4xl">📖</span>
              <div>
                <h1 className="text-3xl font-bold">Grimoire</h1>
                <p className="text-sm text-gray-400">
                  Visual tracker untuk semua pemain dan status game
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700"
            >
              ✕ Tutup
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main - Circular Grimoire */}
            <div className="lg:col-span-2">
              <div className="card bg-gray-900/50 min-h-[600px] flex items-center justify-center">
                {playerCount === 0 ? (
                  <div className="text-center text-gray-500">
                    <p className="text-4xl mb-2">📭</p>
                    <p>Belum ada pemain</p>
                  </div>
                ) : (
                  <div className="relative w-full h-[500px]">
                    {/* Center Info */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                      <div className="text-6xl mb-2">📖</div>
                      <div className="text-sm text-gray-400">
                        {nonGMPlayers.filter(p => p.isAlive).length} hidup
                      </div>
                      <div className="text-sm text-gray-400">
                        {nonGMPlayers.filter(p => !p.isAlive).length} mati
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {game.currentPhase?.replace('-', ' ')}
                      </div>
                    </div>

                    {/* Players in Circle */}
                    {nonGMPlayers.map((player, index) => {
                      const pos = getPlayerPosition(index)
                      return (
                        <div
                          key={player.id}
                          className="absolute"
                          style={{
                            left: `calc(50% + ${pos.x}px)`,
                            top: `calc(50% + ${pos.y}px)`,
                            transform: 'translate(-50%, -50%)'
                          }}
                        >
                          <PlayerToken
                            player={player}
                            onClick={() => setSelectedPlayerId(player.id)}
                            isSelected={selectedPlayerId === player.id}
                            showReminders={true}
                            reminders={grimoireState?.reminders?.[player.id] || []}
                          />
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Reminders & Notes */}
            <div className="space-y-6">
              {/* Selected Player Info */}
              {selectedPlayer ? (
                <div className="card">
                  <h3 className="text-lg font-bold mb-3">
                    #{selectedPlayer.seatNumber} - {selectedPlayer.name}
                  </h3>

                  {selectedPlayer.character && (
                    <div className="mb-4 p-3 bg-gray-800 rounded-lg">
                      <p className="text-sm font-medium">
                        {selectedPlayer.character.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {selectedPlayer.character.team}
                      </p>
                    </div>
                  )}

                  {/* Status Badges */}
                  <div className="flex gap-2 mb-4">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        selectedPlayer.isAlive
                          ? 'bg-green-900 text-green-200'
                          : 'bg-red-900 text-red-200'
                      }`}
                    >
                      {selectedPlayer.isAlive ? '❤️ Hidup' : '💀 Mati'}
                    </span>
                    {!selectedPlayer.isAlive && selectedPlayer.hasUsedGhostVote && (
                      <span className="text-xs px-2 py-1 rounded bg-purple-900 text-purple-200">
                        👻 Used Ghost Vote
                      </span>
                    )}
                  </div>

                  {/* Add Reminder */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Tambah Reminder
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={reminderInput}
                        onChange={(e) => setReminderInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddReminder()}
                        placeholder="e.g. Poisoned, Drunk, etc"
                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm focus:outline-none focus:border-blood"
                      />
                      <button
                        onClick={handleAddReminder}
                        disabled={!reminderInput.trim() || saving}
                        className="px-4 py-2 bg-blood hover:bg-red-800 rounded disabled:opacity-50 text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Current Reminders */}
                  {selectedPlayerReminders.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Reminders:</p>
                      <div className="space-y-1">
                        {selectedPlayerReminders.map((reminder, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-yellow-900/30 border border-yellow-700 px-3 py-2 rounded"
                          >
                            <span className="text-sm text-yellow-200">{reminder}</span>
                            <button
                              onClick={() => handleRemoveReminder(selectedPlayerId, idx)}
                              className="text-red-400 hover:text-red-300 text-sm"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="card text-center text-gray-500">
                  <p className="text-3xl mb-2">👆</p>
                  <p className="text-sm">Pilih pemain untuk menambah reminder</p>
                </div>
              )}

              {/* General Notes */}
              <div className="card">
                <h3 className="text-lg font-bold mb-3">📝 Catatan GM</h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tulis catatan game di sini..."
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm focus:outline-none focus:border-blood min-h-[150px] resize-none"
                />
                <button
                  onClick={handleSaveNotes}
                  disabled={saving}
                  className="mt-2 w-full btn-primary text-sm disabled:opacity-50"
                >
                  {saving ? 'Menyimpan...' : '💾 Simpan Catatan'}
                </button>
              </div>

              {/* Quick Stats */}
              <div className="card">
                <h3 className="text-sm font-bold mb-3">📊 Statistik</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Players:</span>
                    <span className="font-bold">{playerCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Alive:</span>
                    <span className="font-bold text-green-400">
                      {nonGMPlayers.filter(p => p.isAlive).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Dead:</span>
                    <span className="font-bold text-red-400">
                      {nonGMPlayers.filter(p => !p.isAlive).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Ghost Votes Used:</span>
                    <span className="font-bold text-purple-400">
                      {nonGMPlayers.filter(p => p.hasUsedGhostVote).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
