'use client'

import { useState, useEffect } from 'react'
import InformationFeed from './InformationFeed'
import VotingPanel from './VotingPanel'
import NightActionPanel from './NightActionPanel'
import { getCharacterIcon, getCharacterColor, getCharacterBgColor } from '@/utils/characterIcons'

export default function PlayerDashboard({ game, player, allPlayers }) {
  const [showRole, setShowRole] = useState(false)
  const [showDeathPopup, setShowDeathPopup] = useState(false)
  const [wasAlive, setWasAlive] = useState(player?.isAlive)

  // Detect when player dies
  useEffect(() => {
    if (wasAlive && !player?.isAlive) {
      // Player just died
      setShowDeathPopup(true)
    }
    setWasAlive(player?.isAlive)
  }, [player?.isAlive, wasAlive])

  if (!game || !player) {
    return <div>Loading...</div>
  }

  const currentPhase = game.currentPhase || 'night-1'
  const isNight = currentPhase?.startsWith('night')
  const phaseIcon = isNight ? '🌙' : '☀️'

  const alivePlayers = allPlayers.filter(p => p.isAlive && !p.isGM)
  const deadPlayers = allPlayers.filter(p => !p.isAlive && !p.isGM)

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-all duration-1000 ${isNight ? 'bg-night' : 'bg-day'}`}>
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header - Game Status */}
        <div className={`card ${isNight ? 'bg-purple-900/30 border-purple-700' : 'bg-orange-900/30 border-yellow-600'} mb-6 phase-transition`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-4xl animate-float">{phaseIcon}</span>
              <div>
                <h1 className="text-2xl font-bold capitalize">
                  {currentPhase?.replace('-', ' ')}
                </h1>
                <p className="text-sm opacity-80">
                  {isNight ? 'Tutup mata dan tunggu instruksi' : 'Diskusi dan voting'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80">Room</p>
              <p className="text-xl font-mono font-bold">{game.roomCode}</p>
            </div>
          </div>
        </div>

        {/* Player Info Card */}
        <div className="card mb-6 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">{player.name}</h2>
              <p className="text-sm text-gray-400">
                Kursi #{player.seatNumber} • {player.isAlive ? '❤️ Hidup' : '💀 Mati'}
              </p>
            </div>
            {player.character && (
              <button
                onClick={() => setShowRole(!showRole)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-all hover:scale-105 active:scale-95"
                title={showRole ? 'Sembunyikan peran' : 'Lihat peran'}
              >
                {showRole ? '👁️ Sembunyikan' : '👁️‍🗨️ Lihat Peran'}
              </button>
            )}
          </div>

          {/* Role Display (when visible) */}
          {showRole && player.character && (
            <div className={`mt-4 p-4 rounded-lg border-2 ${getCharacterBgColor(player.character.type)} role-card-enter`}>
              <div className="flex items-start gap-4">
                <div className="role-icon-large">
                  {getCharacterIcon(player.character.characterId)}
                </div>
                <div className="flex-1">
                  <h3 className={`text-2xl font-bold mb-1 ${getCharacterColor(player.character.type)}`}>
                    {player.character.name}
                  </h3>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">
                    {player.character.type}
                  </p>
                  <p className="text-sm leading-relaxed mb-3">
                    {player.character.ability}
                  </p>
                  {!player.isAlive && (
                    <div className="bg-red-900/30 border border-red-700 rounded p-2 text-xs animate-fade-in">
                      💀 Kamu mati. Kamu masih bisa membantu tim, tapi hanya bisa voting sekali lagi (ghost vote).
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Warning if no character assigned yet */}
          {!player.character && (
            <div className="mt-4 p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg text-center animate-bounce-subtle">
              <p className="text-sm">⏳ Menunggu Storyteller memberikan peran...</p>
            </div>
          )}
        </div>

        {/* Player Count */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="card bg-green-900/20 border-green-700 card-interactive hover:border-green-500 animate-slide-up" style={{animationDelay: '0.1s'}}>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-400 animate-bounce-subtle">{alivePlayers.length}</p>
              <p className="text-sm text-gray-400">❤️ Pemain Hidup</p>
            </div>
          </div>
          <div className="card bg-red-900/20 border-red-700 card-interactive hover:border-red-500 animate-slide-up" style={{animationDelay: '0.2s'}}>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-400">{deadPlayers.length}</p>
              <p className="text-sm text-gray-400">💀 Pemain Mati</p>
            </div>
          </div>
        </div>

        {/* Voting Panel (only during Day phase) */}
        {!isNight && (
          <div className="mb-6 animate-slide-up" style={{animationDelay: '0.3s'}}>
            <VotingPanel
              gameId={game.id}
              playerId={player.id}
              player={player}
            />
          </div>
        )}

        {/* Night Action Panel (only during Night phase) */}
        {isNight && (
          <div className="mb-6 animate-slide-up" style={{animationDelay: '0.3s'}}>
            <NightActionPanel
              game={game}
              player={player}
              allPlayers={allPlayers}
            />
          </div>
        )}

        {/* Information Feed */}
        <div className="animate-slide-up" style={{animationDelay: '0.4s'}}>
          <InformationFeed gameId={game.id} playerId={player.id} />
        </div>

        {/* Game Tips */}
        <div className="card mt-6 bg-gray-800/50 animate-slide-up" style={{animationDelay: '0.5s'}}>
          <h3 className="text-sm font-bold mb-2">💡 Tips:</h3>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Perhatikan informasi dari Storyteller dengan seksama</li>
            <li>• Jangan tunjukkan peranmu ke pemain lain kecuali memang diperlukan</li>
            <li>• Diskusikan dengan pemain lain di siang hari untuk menemukan Demon</li>
            <li>• Jika kamu mati, kamu masih bisa menggunakan 1 ghost vote</li>
            {isNight && <li className="text-yellow-400">• Saat malam: Tutup mata sampai Storyteller memanggilmu</li>}
          </ul>
        </div>
      </div>

      {/* Death Popup */}
      {showDeathPopup && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-gradient-to-b from-red-900 to-gray-900 border-4 border-red-600 rounded-xl p-8 max-w-md w-full shadow-2xl shadow-red-900/50 animate-slide-up">
            <div className="text-center">
              <div className="text-8xl mb-4 animate-bounce-subtle">💀</div>
              <h2 className="text-4xl font-bold text-red-400 mb-4">
                KAMU MATI!
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                Kamu telah terbunuh dan tidak bisa lagi menggunakan ability-mu.
              </p>
              <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-300 font-semibold mb-2">
                  👻 Ghost Vote
                </p>
                <p className="text-xs text-gray-300">
                  Kamu masih bisa voting SATU KALI LAGI selama siang hari kapanpun kamu mau.
                  Gunakan dengan bijak!
                </p>
              </div>
              <button
                onClick={() => setShowDeathPopup(false)}
                className="w-full py-3 px-6 bg-red-900 hover:bg-red-800 rounded-lg border border-red-700 font-bold text-lg transition-all hover:scale-105 active:scale-95"
              >
                Oke, Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
