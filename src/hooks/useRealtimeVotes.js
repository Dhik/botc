'use client'

import { useState, useEffect } from 'react'
import { subscribeToVotes } from '@/lib/supabase'

export function useRealtimeVotes(votingSessionId) {
  const [votingSession, setVotingSession] = useState(null)
  const [votes, setVotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!votingSessionId) {
      setLoading(false)
      return
    }

    // Fetch initial voting session data
    const fetchVotingSession = async () => {
      try {
        const response = await fetch(`/api/votes?votingSessionId=${votingSessionId}`)
        const data = await response.json()

        if (data.success) {
          setVotingSession(data.votingSession)
          setVotes(data.votingSession.votes || [])
        } else {
          setError(data.error)
        }
        setLoading(false)
      } catch (err) {
        console.error('Error fetching voting session:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchVotingSession()

    // Subscribe to vote updates
    const channel = subscribeToVotes(votingSessionId, (payload) => {
      console.log('Real-time vote update:', payload)

      if (payload.eventType === 'INSERT') {
        setVotes(prev => [...prev, payload.new])
      } else if (payload.eventType === 'UPDATE') {
        setVotes(prev =>
          prev.map(vote => vote.id === payload.new.id ? payload.new : vote)
        )
      } else if (payload.eventType === 'DELETE') {
        setVotes(prev => prev.filter(vote => vote.id !== payload.old.id))
      }
    })

    // Cleanup
    return () => {
      if (channel) {
        channel.unsubscribe()
      }
    }
  }, [votingSessionId])

  const refetch = async () => {
    if (!votingSessionId) return

    try {
      const response = await fetch(`/api/votes?votingSessionId=${votingSessionId}`)
      const data = await response.json()

      if (data.success) {
        setVotingSession(data.votingSession)
        setVotes(data.votingSession.votes || [])
      }
    } catch (err) {
      console.error('Error refetching voting session:', err)
    }
  }

  return { votingSession, votes, loading, error, refetch }
}
