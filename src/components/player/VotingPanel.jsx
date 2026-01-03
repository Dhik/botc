'use client'

import { useState, useEffect } from 'react'
import { useRealtimeVotes } from '@/hooks/useRealtimeVotes'
import { useRealtimeGame } from '@/hooks/useRealtimeGame'

export default function VotingPanel({ gameId, playerId, player }) {
  const [activeSessionId, setActiveSessionId] = useState(null)
  const [myVote, setMyVote] = useState(null)
  const [voting, setVoting] = useState(false)
  const [locking, setLocking] = useState(false)

  const { game, players } = useRealtimeGame(gameId)
  const { votingSession, votes, loading, refetch } = useRealtimeVotes(activeSessionId)

  // Fetch active session
  useEffect(() => {
    const fetchActiveSession = async () => {
      try {
        const response = await fetch(`/api/votes?gameId=${gameId}&isOpen=true`)
        const data = await response.json()

        if (data.success && data.votingSessions.length > 0) {
          setActiveSessionId(data.votingSessions[0].id)
        } else {
          setActiveSessionId(null)
          setMyVote(null)
        }
      } catch (error) {
        console.error('Error fetching active session:', error)
      }
    }

    if (gameId) {
      fetchActiveSession()

      // Poll for active session every 3 seconds
      const interval = setInterval(fetchActiveSession, 3000)

      return () => clearInterval(interval)
    }
  }, [gameId])

  // Update my vote when votes change
  useEffect(() => {
    if (votes && playerId) {
      const vote = votes.find(v => v.voterId === playerId)
      setMyVote(vote || null)
    }
  }, [votes, playerId])

  const handleVoteForPlayer = async (targetPlayerId) => {
    if (!activeSessionId || !playerId) return

    // Check if vote is locked
    if (myVote?.isLocked) {
      alert('Vote kamu sudah dikunci, tidak bisa diubah!')
      return
    }

    // Check if player can vote
    if (!player.isAlive && player.hasUsedGhostVote) {
      alert('Kamu sudah menggunakan ghost vote!')
      return
    }

    setVoting(true)

    try {
      const response = await fetch('/api/votes/cast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          votingSessionId: activeSessionId,
          voterId: playerId,
          targetId: targetPlayerId,
          value: 'vote' // Just a marker that they voted
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to vote')
      }

      await refetch()
    } catch (error) {
      console.error('Error voting:', error)
      alert(error.message)
    } finally {
      setVoting(false)
    }
  }

  const handleLockVote = async () => {
    if (!myVote) return

    setLocking(true)

    try {
      const response = await fetch('/api/votes/lock', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voteId: myVote.id,
          isLocked: true
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to lock vote')
      }

      await refetch()
    } catch (error) {
      console.error('Error locking vote:', error)
      alert(error.message)
    } finally {
      setLocking(false)
    }
  }

  const handleUnlockVote = async () => {
    if (!myVote) return

    setLocking(true)

    try {
      const response = await fetch('/api/votes/lock', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voteId: myVote.id,
          isLocked: false
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to unlock vote')
      }

      await refetch()
    } catch (error) {
      console.error('Error unlocking vote:', error)
      alert(error.message)
    } finally {
      setLocking(false)
    }
  }

  const canVote = player.isAlive || !player.hasUsedGhostVote
  const alivePlayers = players.filter(p => !p.isGM && p.isAlive && p.id !== playerId)

  // Find who this player voted for
  const votedPlayer = myVote ? players.find(p => p.id === myVote.targetId) : null

  if (!activeSessionId) {
    return (
      <div className="card bg-gray-800/50">
        <div className="text-center py-8">
          <p className="text-4xl mb-2">🗳️</p>
          <p className="text-gray-400">Tidak ada voting aktif</p>
          <p className="text-sm text-gray-500 mt-1">
            Tunggu Storyteller memulai voting
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blood mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        🗳️ Voting Eliminasi
      </h2>

      {/* Instructions */}
      <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-3 mb-4">
        <p className="text-sm">
          Pilih 1 pemain untuk dieliminasi. Kamu bisa lock vote untuk mengunci pilihan.
        </p>
      </div>

      {/* Voting Status */}
      {!canVote && (
        <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-3 mb-4">
          <p className="text-sm text-yellow-200">
            ⚠️ Kamu sudah mati dan sudah menggunakan ghost vote. Kamu tidak bisa voting lagi.
          </p>
        </div>
      )}

      {/* Current Vote Display */}
      {myVote && votedPlayer && (
        <div className="mb-4 p-4 bg-gradient-to-r from-red-900/30 to-purple-900/30 rounded-lg border-2 border-red-700 animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-400">Vote kamu:</p>
              <p className="text-xl font-bold text-red-400">
                #{votedPlayer.seatNumber} - {votedPlayer.name}
              </p>
              {myVote.isGhostVote && (
                <p className="text-xs text-purple-400 mt-1">👻 Ghost Vote</p>
              )}
            </div>
            <div className="text-right">
              {myVote.isLocked ? (
                <div>
                  <span className="text-3xl">🔒</span>
                  <p className="text-xs text-gray-400 mt-1">Dikunci</p>
                </div>
              ) : (
                <div>
                  <span className="text-3xl">🔓</span>
                  <p className="text-xs text-gray-400 mt-1">Belum dikunci</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Player List to Vote */}
      {canVote && !myVote?.isLocked && (
        <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
          <p className="text-sm font-medium mb-2">Pilih pemain untuk dieliminasi:</p>
          {alivePlayers.map(targetPlayer => {
            const isSelected = myVote?.targetId === targetPlayer.id

            return (
              <button
                key={targetPlayer.id}
                onClick={() => handleVoteForPlayer(targetPlayer.id)}
                disabled={voting}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all disabled:opacity-50 ${
                  isSelected
                    ? 'bg-red-900/40 border-red-600 shadow-lg shadow-red-900/50'
                    : 'bg-gray-800 border-gray-700 hover:border-red-700 hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-lg">
                      #{targetPlayer.seatNumber} - {targetPlayer.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {targetPlayer.isAlive ? '✅ Hidup' : '💀 Mati'}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="text-2xl">✓</div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Lock/Unlock Button */}
      {myVote && (
        <div className="space-y-2">
          {myVote.isLocked ? (
            <button
              onClick={handleUnlockVote}
              disabled={locking}
              className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg border border-gray-600 disabled:opacity-50 font-semibold"
            >
              {locking ? 'Membuka...' : '🔓 Unlock Vote'}
            </button>
          ) : (
            <button
              onClick={handleLockVote}
              disabled={locking}
              className="w-full py-3 px-4 bg-yellow-900 hover:bg-yellow-800 rounded-lg border border-yellow-700 disabled:opacity-50 font-semibold animate-pulse"
            >
              {locking ? 'Mengunci...' : '🔒 Lock Vote (Tidak bisa diubah!)'}
            </button>
          )}
          <p className="text-xs text-gray-500 text-center">
            {myVote.isLocked
              ? 'Vote kamu sudah dikunci. Unlock untuk mengubah.'
              : 'Kunci vote kamu agar tidak bisa diubah lagi.'}
          </p>
        </div>
      )}

      {/* Info */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-500">
          💡 Tip: Lock vote kamu saat sudah yakin dengan pilihan
        </p>
      </div>
    </div>
  )
}
