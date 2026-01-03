'use client'

import { useEffect, useState } from 'react'
import { subscribeToGame, subscribeToPlayers } from '@/lib/supabase'

export function useRealtimeGame(gameId) {
  const [game, setGame] = useState(null)
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!gameId) return

    // Initial fetch
    fetchGameData()

    // Subscribe to changes
    const gameChannel = subscribeToGame(gameId, handleGameUpdate)
    const playersChannel = subscribeToPlayers(gameId, handlePlayersUpdate)

    return () => {
      if (gameChannel) gameChannel.unsubscribe()
      if (playersChannel) playersChannel.unsubscribe()
    }
  }, [gameId])

  const fetchGameData = async () => {
    try {
      // Fetch game and players
      const response = await fetch(`/api/games/${gameId}`)

      if (!response.ok) {
        throw new Error('Failed to fetch game data')
      }

      const data = await response.json()
      setGame(data.game)
      setPlayers(data.players || [])
      setLoading(false)
    } catch (err) {
      console.error('Error fetching game data:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  const handleGameUpdate = (payload) => {
    console.log('Game updated:', payload)
    if (payload.new) {
      setGame(payload.new)
    }
  }

  const handlePlayersUpdate = (payload) => {
    console.log('Players updated:', payload)

    if (payload.eventType === 'INSERT') {
      setPlayers(prev => [...prev, payload.new])
    } else if (payload.eventType === 'UPDATE') {
      setPlayers(prev => prev.map(p => p.id === payload.new.id ? payload.new : p))
    } else if (payload.eventType === 'DELETE') {
      setPlayers(prev => prev.filter(p => p.id !== payload.old.id))
    }
  }

  return { game, players, loading, error, refetch: fetchGameData }
}
