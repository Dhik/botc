'use client'

import { useState, useEffect } from 'react'
import { useRealtimeVotes } from '@/hooks/useRealtimeVotes'

export default function VotingControls({ game, players }) {
  const [creating, setCreating] = useState(false)
  const [activeSessionId, setActiveSessionId] = useState(null)
  const [closing, setClosing] = useState(false)

  const { votingSession, votes, loading, refetch } = useRealtimeVotes(activeSessionId)

  // Fetch active session on mount
  useEffect(() => {
    const fetchActiveSession = async () => {
      try {
        const response = await fetch(`/api/votes?gameId=${game.id}&isOpen=true`)
        const data = await response.json()

        if (data.success && data.votingSessions.length > 0) {
          setActiveSessionId(data.votingSessions[0].id)
        }
      } catch (error) {
        console.error('Error fetching active session:', error)
      }
    }

    if (game?.id) {
      fetchActiveSession()
    }
  }, [game?.id])

  const handleStartVoting = async () => {
    setCreating(true)

    try {
      // Use first alive player as dummy nominee (we don't actually use this)
      const dummyPlayer = players.find(p => !p.isGM && p.isAlive)

      if (!dummyPlayer) {
        alert('Tidak ada pemain hidup untuk voting')
        return
      }

      const response = await fetch('/api/votes/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: game.id,
          nominatedPlayerId: dummyPlayer.id,
          nominatorPlayerId: null
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create voting')
      }

      const data = await response.json()
      setActiveSessionId(data.votingSession.id)
    } catch (error) {
      console.error('Error creating voting:', error)
      alert(error.message)
    } finally {
      setCreating(false)
    }
  }

  const handleCloseVoting = async () => {
    if (!activeSessionId) return

    if (!confirm('Yakin ingin menutup voting? Ini akan menghitung hasil voting.')) {
      return
    }

    setClosing(true)

    try {
      const response = await fetch('/api/votes/close-simple', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          votingSessionId: activeSessionId
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to close voting')
      }

      const data = await response.json()
      const { result } = data

      // Show result
      let message = `📊 HASIL VOTING:\n\n`

      if (result.isTie) {
        message += `⚠️ TIE! Tidak ada yang dieksekusi.\n\n`
        message += `Pemain dengan votes tertinggi (${result.highestVoteCount} votes):\n`
        result.tiedPlayers.forEach(p => {
          message += `- ${p.name}\n`
        })
        message += `\nSilakan mulai voting baru.`
      } else if (result.eliminatedPlayer) {
        message += `💀 ${result.eliminatedPlayer.name} DIEKSEKUSI!\n\n`
        message += `Total votes: ${result.highestVoteCount}\n\n`
        message += `Rincian votes:\n`
        Object.entries(result.voteTally).forEach(([playerId, count]) => {
          const player = players.find(p => p.id === playerId)
          if (player && count > 0) {
            message += `- ${player.name}: ${count} votes\n`
          }
        })
      } else {
        message += `Tidak ada yang dieksekusi (tidak ada votes).`
      }

      alert(message)

      // Clear active session
      setActiveSessionId(null)

      // Auto refresh after 1 second
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      console.error('Error closing voting:', error)
      alert(error.message)
    } finally {
      setClosing(false)
    }
  }

  const allNonGMPlayers = players.filter(p => !p.isGM)
  const alivePlayers = allNonGMPlayers.filter(p => p.isAlive)

  // Calculate vote tally by target player
  const voteTally = {}
  votes.forEach(vote => {
    if (!voteTally[vote.targetId]) {
      voteTally[vote.targetId] = []
    }
    voteTally[vote.targetId].push(vote.voter)
  })

  const totalVoted = votes.length
  const totalPlayers = allNonGMPlayers.length

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        🗳️ Voting Eliminasi
      </h2>

      {!activeSessionId ? (
        // Start voting button
        <div className="space-y-4">
          <p className="text-sm text-gray-400">
            Mulai sesi voting. Setiap pemain akan memilih 1 pemain untuk dieliminasi.
          </p>
          <button
            onClick={handleStartVoting}
            disabled={creating || alivePlayers.length < 2}
            className="btn-primary w-full disabled:opacity-50"
          >
            {creating ? 'Memulai...' : '🗳️ Mulai Voting'}
          </button>
          {alivePlayers.length < 2 && (
            <p className="text-sm text-yellow-500 text-center">
              Butuh minimal 2 pemain hidup untuk voting
            </p>
          )}
        </div>
      ) : (
        // Active voting session
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blood mx-auto"></div>
            </div>
          ) : (
            <>
              {/* Voting Status */}
              <div className="bg-purple-900/20 border-2 border-purple-700 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">Status Voting:</p>
                <p className="text-xl font-bold">
                  {totalVoted}/{totalPlayers} pemain sudah voting
                </p>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div
                    className="bg-blood h-2 rounded-full transition-all"
                    style={{ width: `${(totalVoted / totalPlayers) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Vote Tally by Player */}
              <div>
                <p className="text-sm font-medium mb-2">Tally Votes:</p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {alivePlayers.map(player => {
                    const votersForThisPlayer = voteTally[player.id] || []
                    const voteCount = votersForThisPlayer.length

                    return (
                      <div
                        key={player.id}
                        className={`bg-gray-800 rounded-lg p-3 border-2 ${
                          voteCount > 0 ? 'border-red-700' : 'border-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">
                            #{player.seatNumber} - {player.name}
                          </span>
                          <span className={`text-lg font-bold ${
                            voteCount > 0 ? 'text-red-400' : 'text-gray-500'
                          }`}>
                            {voteCount} votes
                          </span>
                        </div>
                        {votersForThisPlayer.length > 0 && (
                          <div className="text-xs text-gray-400 mt-1">
                            Dari: {votersForThisPlayer.map(v => v.name).join(', ')}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Who hasn't voted yet */}
              {totalVoted < totalPlayers && (
                <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-3">
                  <p className="text-xs text-yellow-400 font-medium mb-1">
                    Belum voting:
                  </p>
                  <p className="text-xs text-gray-300">
                    {allNonGMPlayers
                      .filter(p => !votes.find(v => v.voterId === p.id))
                      .map(p => `${p.name}${p.isAlive ? '' : ' 💀'}`)
                      .join(', ')}
                  </p>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={handleCloseVoting}
                disabled={closing}
                className="btn-primary w-full bg-red-900 hover:bg-red-800 disabled:opacity-50"
              >
                {closing ? 'Menutup...' : '🔒 Tutup Voting & Hitung Hasil'}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
