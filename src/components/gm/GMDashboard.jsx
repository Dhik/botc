'use client'

import { useState, useEffect } from 'react'
import PhaseGuide from './PhaseGuide'
import WakeOrder from './WakeOrder'
import PlayerList from './PlayerList'
import InformationPanel from './InformationPanel'
import InformationHelper from './InformationHelper'
import VotingControls from './VotingControls'
import NightActionTracker from './NightActionTracker'
import GrimoireTracker from './GrimoireTracker'
import GameHistory from './GameHistory'
import { useGamePhase } from '@/hooks/useGamePhase'

export default function GMDashboard({
  game,
  players,
  allCharacters,
  onGameUpdate
}) {
  const [localGame, setLocalGame] = useState(game)
  const [nightActions, setNightActions] = useState([])
  const { nextStep, prevStep, advancePhase, togglePlayerAlive, updating } = useGamePhase(game?.id)

  useEffect(() => {
    setLocalGame(game)
  }, [game])

  // Fetch night actions
  useEffect(() => {
    const fetchNightActions = async () => {
      if (!game?.id) return

      try {
        const response = await fetch(`/api/night-actions?gameId=${game.id}&phase=${game.currentPhase}`)
        const data = await response.json()
        if (data.success) {
          setNightActions(data.nightActions)
        }
      } catch (error) {
        console.error('Error fetching night actions:', error)
      }
    }

    fetchNightActions()
    const interval = setInterval(fetchNightActions, 3000)
    return () => clearInterval(interval)
  }, [game?.id, game?.currentPhase])

  const handleNextStep = async () => {
    try {
      const updatedGame = await nextStep(localGame.currentStep)
      setLocalGame(updatedGame)
      if (onGameUpdate) onGameUpdate(updatedGame)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handlePrevStep = async () => {
    try {
      const updatedGame = await prevStep(localGame.currentStep)
      setLocalGame(updatedGame)
      if (onGameUpdate) onGameUpdate(updatedGame)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleAdvancePhase = async () => {
    try {
      const updatedGame = await advancePhase()
      setLocalGame(updatedGame)
      if (onGameUpdate) onGameUpdate(updatedGame)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleToggleAlive = async (playerId, isAlive) => {
    // Find player name for confirmation
    const player = players.find(p => p.id === playerId)
    const playerName = player?.name || 'player ini'
    const action = isAlive ? 'menghidupkan' : 'membunuh'

    // Confirmation popup
    if (!confirm(`Yakin ingin ${action} ${playerName}?`)) {
      return
    }

    try {
      await togglePlayerAlive(playerId, isAlive)
      alert(`✅ ${playerName} berhasil ${isAlive ? 'dihidupkan' : 'dibunuh'}`)
      // Auto refresh page after successful toggle
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      console.error('Error:', error)
      alert(`❌ Gagal ${action} ${playerName}`)
    }
  }

  if (!localGame) {
    return <div>Loading...</div>
  }

  const currentPhase = localGame.currentPhase || 'night-1'
  const currentStep = localGame.currentStep || 0

  // Determine phase icon and color
  const isNight = currentPhase?.startsWith('night')
  const phaseIcon = isNight ? '🌙' : '☀️'
  const phaseColor = isNight ? 'bg-purple-900 border-purple-700' : 'bg-yellow-900 border-yellow-700'

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-all duration-1000 ${isNight ? 'bg-night' : 'bg-day'}`}>
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className={`card ${isNight ? 'bg-purple-900/30 border-purple-700' : 'bg-orange-900/30 border-yellow-600'} mb-6 phase-transition`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-4xl animate-float">{phaseIcon}</span>
              <div>
                <h1 className="text-2xl font-bold capitalize">
                  {currentPhase?.replace('-', ' ')}
                </h1>
                <p className="text-sm opacity-80">
                  {isNight ? 'Semua pemain menutup mata' : 'Diskusi dan voting'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80">Room Code</p>
              <p className="text-2xl font-mono font-bold">{localGame.roomCode}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Column - Phase Guide & Voting */}
          <div className="lg:col-span-2 space-y-6">
            <div className="animate-slide-up">
              <PhaseGuide
                currentPhase={currentPhase}
                currentStep={currentStep}
                onNextStep={handleNextStep}
                onPrevStep={handlePrevStep}
                onAdvancePhase={handleAdvancePhase}
              />
            </div>

            {/* Show Voting Controls during Day phase */}
            {!isNight && (
              <div className="animate-slide-up" style={{animationDelay: '0.1s'}}>
                <VotingControls
                  game={localGame}
                  players={players}
                />
              </div>
            )}

            {/* Show Night Action Tracker during Night phase */}
            {isNight && (
              <div className="animate-slide-up" style={{animationDelay: '0.1s'}}>
                <NightActionTracker
                  game={localGame}
                  players={players}
                />
              </div>
            )}
          </div>

          {/* Sidebar - Wake Order, Information Panel & Player List */}
          <div className="space-y-6">
            <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
              <WakeOrder
                currentPhase={currentPhase}
                players={players}
                allCharacters={allCharacters}
              />
            </div>

            <div className="animate-slide-up" style={{animationDelay: '0.3s'}}>
              <InformationPanel
                game={localGame}
                players={players}
              />
            </div>

            <div className="animate-slide-up" style={{animationDelay: '0.35s'}}>
              <InformationHelper
                players={players}
                nightActions={nightActions}
                game={localGame}
              />
            </div>

            <div className="animate-slide-up" style={{animationDelay: '0.4s'}}>
              <PlayerList
                players={players}
                allCharacters={allCharacters}
                onToggleAlive={handleToggleAlive}
              />
            </div>
          </div>
        </div>

        {/* Loading Overlay */}
        {updating && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 flex items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blood"></div>
              <span>Updating...</span>
            </div>
          </div>
        )}

        {/* Grimoire Tracker - Floating Button & Modal */}
        <GrimoireTracker game={localGame} players={players} />

        {/* Game History - Floating Button & Modal */}
        <GameHistory game={localGame} />
      </div>
    </div>
  )
}
