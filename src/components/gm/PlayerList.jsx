'use client'

import { getCharacterTypeIcon, getCharacterTypeColor } from '@/lib/gameLogic'

export default function PlayerList({
  players,
  allCharacters,
  onToggleAlive
}) {
  const regularPlayers = players.filter(p => !p.isGM)

  const getCharacterDetails = (characterId) => {
    return allCharacters?.find(c => c.characterId === characterId)
  }

  const aliveCount = regularPlayers.filter(p => p.isAlive).length
  const deadCount = regularPlayers.length - aliveCount

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold">Daftar Pemain</h3>
        <div className="flex gap-2 text-sm">
          <span className="px-2 py-1 bg-green-900 text-green-200 rounded">
            ❤️ {aliveCount}
          </span>
          <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded">
            💀 {deadCount}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {regularPlayers.map((player) => {
          const character = getCharacterDetails(player.characterId)

          return (
            <div
              key={player.id}
              className={`p-3 rounded-lg border-2 transition-all ${
                player.isAlive
                  ? 'border-gray-700 bg-gray-800'
                  : 'border-gray-800 bg-gray-900 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Seat Number */}
                <div className="flex-shrink-0 w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold">
                  {player.seatNumber}
                </div>

                {/* Player Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      {player.name}
                      {!player.isAlive && <span className="ml-2">💀</span>}
                    </span>
                    {player.hasUsedGhostVote && !player.isAlive && (
                      <span className="text-xs px-2 py-0.5 bg-purple-900 text-purple-200 rounded">
                        Ghost Vote Used
                      </span>
                    )}
                  </div>

                  {/* Character */}
                  {character && (
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="text-lg"
                        title={character.type}
                      >
                        {getCharacterTypeIcon(character.type)}
                      </span>
                      <span
                        className="text-sm font-semibold"
                        style={{ color: getCharacterTypeColor(character.type) }}
                      >
                        {character.name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Toggle Alive/Dead Button */}
                <button
                  onClick={() => onToggleAlive(player.id, !player.isAlive)}
                  className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                    player.isAlive
                      ? 'bg-red-900 hover:bg-red-800 text-red-200'
                      : 'bg-green-900 hover:bg-green-800 text-green-200'
                  }`}
                >
                  {player.isAlive ? '💀 Bunuh' : '❤️ Hidupkan'}
                </button>
              </div>

              {/* Character Ability (collapsed) */}
              {character && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-300">
                    Lihat ability
                  </summary>
                  <p className="text-xs text-gray-400 mt-2 p-2 bg-gray-900 rounded">
                    {character.ability}
                  </p>
                </details>
              )}
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="mt-4 p-3 bg-gray-900 rounded-lg">
        <p className="text-sm text-gray-400">
          Total: {regularPlayers.length} pemain
          {deadCount > 0 && ` • ${deadCount} mati`}
        </p>
      </div>
    </div>
  )
}
