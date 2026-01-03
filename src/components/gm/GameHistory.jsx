'use client'

import { useState, useEffect } from 'react'

export default function GameHistory({ game }) {
  const [events, setEvents] = useState([])
  const [eventCounts, setEventCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!game?.id || !isOpen) return

    const fetchHistory = async () => {
      setLoading(true)
      try {
        const url = filterType
          ? `/api/games/${game.id}/history?eventType=${filterType}`
          : `/api/games/${game.id}/history`

        const response = await fetch(url)
        const data = await response.json()

        if (data.success) {
          setEvents(data.events)
          setEventCounts(data.eventCounts || {})
        }
      } catch (error) {
        console.error('Error fetching history:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [game?.id, filterType, isOpen])

  const getEventIcon = (type) => {
    const icons = {
      'phase-change': '🔄',
      'player-death': '💀',
      'player-executed': '⚖️',
      'voting-started': '🗳️',
      'voting-failed': '❌',
      'information-sent': '📨',
      'grimoire-updated': '📖',
      'game-created': '🎮',
      'player-joined': '👋',
      'character-assigned': '🎭'
    }
    return icons[type] || '📌'
  }

  const getEventColor = (type) => {
    const colors = {
      'phase-change': 'bg-blue-900/20 border-blue-700',
      'player-death': 'bg-red-900/20 border-red-700',
      'player-executed': 'bg-red-900/20 border-red-700',
      'voting-started': 'bg-yellow-900/20 border-yellow-700',
      'voting-failed': 'bg-gray-800 border-gray-700',
      'information-sent': 'bg-purple-900/20 border-purple-700',
      'grimoire-updated': 'bg-green-900/20 border-green-700',
      'game-created': 'bg-blue-900/20 border-blue-700',
      'player-joined': 'bg-green-900/20 border-green-700',
      'character-assigned': 'bg-purple-900/20 border-purple-700'
    }
    return colors[type] || 'bg-gray-800 border-gray-700'
  }

  const eventTypes = [
    { value: null, label: 'Semua Event', count: Object.values(eventCounts).reduce((a, b) => a + b, 0) },
    { value: 'phase-change', label: 'Phase Changes', count: eventCounts['phase-change'] || 0 },
    { value: 'player-death', label: 'Deaths', count: eventCounts['player-death'] || 0 },
    { value: 'player-executed', label: 'Executions', count: eventCounts['player-executed'] || 0 },
    { value: 'voting-started', label: 'Voting', count: (eventCounts['voting-started'] || 0) + (eventCounts['voting-failed'] || 0) },
    { value: 'information-sent', label: 'Information', count: eventCounts['information-sent'] || 0 }
  ]

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 bg-purple-900 hover:bg-purple-800 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-all hover:scale-110 z-40"
        title="Game History"
      >
        <span className="text-3xl">📜</span>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 overflow-y-auto">
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className="text-4xl">📜</span>
              <div>
                <h1 className="text-3xl font-bold">Game History</h1>
                <p className="text-sm text-gray-400">
                  Complete event log untuk game ini
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

          {/* Filters */}
          <div className="card mb-6">
            <p className="text-sm font-medium mb-3">Filter by Event Type:</p>
            <div className="flex flex-wrap gap-2">
              {eventTypes.map(type => (
                <button
                  key={type.value || 'all'}
                  onClick={() => setFilterType(type.value)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all text-sm ${
                    filterType === type.value
                      ? 'bg-blood border-blood text-white'
                      : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {type.label} {type.count > 0 && `(${type.count})`}
                </button>
              ))}
            </div>
          </div>

          {/* Events List */}
          <div className="card">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blood mx-auto mb-4"></div>
                <p className="text-gray-400">Loading events...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-4xl mb-2">📭</p>
                <p>Belum ada event</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-400 mb-4">
                  Showing {events.length} events
                </p>
                {events.map((event, index) => (
                  <div
                    key={event.id}
                    className={`p-4 rounded-lg border-2 ${getEventColor(event.eventType)}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{getEventIcon(event.eventType)}</span>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <p className="font-medium">{event.description}</p>
                          <span className="text-xs text-gray-500 ml-2">
                            {new Date(event.createdAt).toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-400">
                            {event.eventType}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(event.createdAt).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                        {/* Metadata */}
                        {event.metadata && Object.keys(event.metadata).length > 0 && (
                          <details className="mt-2">
                            <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-400">
                              Show details
                            </summary>
                            <pre className="mt-2 text-xs bg-gray-900 p-2 rounded overflow-x-auto">
                              {JSON.stringify(event.metadata, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stats Footer */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card text-center">
              <p className="text-2xl font-bold text-blue-400">
                {eventCounts['phase-change'] || 0}
              </p>
              <p className="text-xs text-gray-400">Phase Changes</p>
            </div>
            <div className="card text-center">
              <p className="text-2xl font-bold text-red-400">
                {(eventCounts['player-death'] || 0) + (eventCounts['player-executed'] || 0)}
              </p>
              <p className="text-xs text-gray-400">Deaths</p>
            </div>
            <div className="card text-center">
              <p className="text-2xl font-bold text-yellow-400">
                {eventCounts['voting-started'] || 0}
              </p>
              <p className="text-xs text-gray-400">Votings</p>
            </div>
            <div className="card text-center">
              <p className="text-2xl font-bold text-purple-400">
                {eventCounts['information-sent'] || 0}
              </p>
              <p className="text-xs text-gray-400">Info Sent</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
