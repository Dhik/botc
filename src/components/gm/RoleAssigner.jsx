'use client'

import { getCharacterTypeColor, getCharacterTypeIcon } from '@/lib/gameLogic'

export default function RoleAssigner({
  players,
  characters,
  assignments,
  onAssign
}) {
  const getAssignedCharacter = (playerId) => {
    return assignments[playerId]
  }

  const isCharacterAssigned = (characterId) => {
    return Object.values(assignments).some(c => c && c.characterId === characterId)
  }

  const getAvailableCharacters = () => {
    return characters.filter(char => !isCharacterAssigned(char.characterId))
  }

  const assignedCount = Object.keys(assignments).filter(k => assignments[k]).length
  const totalPlayers = players.length

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="card bg-gray-900">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold">Progress Assignment</h4>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            assignedCount === totalPlayers
              ? 'bg-green-900 text-green-200'
              : 'bg-gray-700 text-gray-300'
          }`}>
            {assignedCount} / {totalPlayers}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-blood h-2 rounded-full transition-all"
            style={{ width: `${(assignedCount / totalPlayers) * 100}%` }}
          />
        </div>
      </div>

      {/* Players Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map((player) => {
          const assigned = getAssignedCharacter(player.id)

          return (
            <div key={player.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold">
                    {player.seatNumber}
                  </div>
                  <div>
                    <p className="font-semibold">{player.name}</p>
                    <p className="text-xs text-gray-500">Seat #{player.seatNumber}</p>
                  </div>
                </div>
              </div>

              {assigned ? (
                <div
                  className="p-3 rounded-lg border-2 cursor-pointer hover:opacity-80 transition"
                  style={{
                    borderColor: getCharacterTypeColor(assigned.type),
                    backgroundColor: `${getCharacterTypeColor(assigned.type)}20`
                  }}
                  onClick={() => onAssign(player.id, null)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold">{assigned.name}</span>
                    <span className="text-xl">{getCharacterTypeIcon(assigned.type)}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                    {assigned.ability}
                  </p>
                  <button className="text-xs text-red-400 hover:text-red-300">
                    ✕ Hapus Assignment
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-gray-800 rounded-lg border-2 border-dashed border-gray-600">
                  <p className="text-sm text-gray-500 text-center mb-3">
                    Belum di-assign
                  </p>
                  <select
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm"
                    value=""
                    onChange={(e) => {
                      const char = characters.find(c => c.characterId === e.target.value)
                      if (char) onAssign(player.id, char)
                    }}
                  >
                    <option value="">Pilih karakter...</option>
                    {getAvailableCharacters().map(char => (
                      <option key={char.characterId} value={char.characterId}>
                        {getCharacterTypeIcon(char.type)} {char.name} ({char.type})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Available Characters Summary */}
      <div className="card bg-gray-900">
        <h4 className="font-bold mb-3">Karakter Tersedia</h4>
        <div className="flex flex-wrap gap-2">
          {getAvailableCharacters().map(char => (
            <span
              key={char.characterId}
              className="px-3 py-1 rounded-full text-sm"
              style={{
                backgroundColor: `${getCharacterTypeColor(char.type)}30`,
                color: getCharacterTypeColor(char.type)
              }}
            >
              {getCharacterTypeIcon(char.type)} {char.name}
            </span>
          ))}
          {getAvailableCharacters().length === 0 && (
            <p className="text-green-400 text-sm">✓ Semua karakter sudah di-assign!</p>
          )}
        </div>
      </div>
    </div>
  )
}
