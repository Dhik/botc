'use client'

import { useState } from 'react'

export function useGamePhase(gameId) {
  const [updating, setUpdating] = useState(false)

  const nextStep = async (currentStep) => {
    setUpdating(true)
    try {
      const response = await fetch(`/api/games/${gameId}/phase`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'next-step',
          currentStep: currentStep + 1
        })
      })

      if (!response.ok) throw new Error('Failed to update step')

      const data = await response.json()
      return data.game
    } catch (error) {
      console.error('Error updating step:', error)
      throw error
    } finally {
      setUpdating(false)
    }
  }

  const prevStep = async (currentStep) => {
    setUpdating(true)
    try {
      const response = await fetch(`/api/games/${gameId}/phase`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'prev-step',
          currentStep: Math.max(0, currentStep - 1)
        })
      })

      if (!response.ok) throw new Error('Failed to update step')

      const data = await response.json()
      return data.game
    } catch (error) {
      console.error('Error updating step:', error)
      throw error
    } finally {
      setUpdating(false)
    }
  }

  const advancePhase = async () => {
    setUpdating(true)
    try {
      const response = await fetch(`/api/games/${gameId}/phase`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'advance-phase'
        })
      })

      if (!response.ok) throw new Error('Failed to advance phase')

      const data = await response.json()
      return data.game
    } catch (error) {
      console.error('Error advancing phase:', error)
      throw error
    } finally {
      setUpdating(false)
    }
  }

  const togglePlayerAlive = async (playerId, isAlive) => {
    try {
      const response = await fetch(`/api/games/${gameId}/players/${playerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAlive })
      })

      if (!response.ok) throw new Error('Failed to update player status')

      const data = await response.json()
      return data.player
    } catch (error) {
      console.error('Error toggling player status:', error)
      throw error
    }
  }

  return {
    nextStep,
    prevStep,
    advancePhase,
    togglePlayerAlive,
    updating
  }
}
