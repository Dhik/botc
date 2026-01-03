'use client'

import { getCharacterTypeIcon } from '@/lib/gameLogic'

export default function CharacterSelector({
  characters,
  selectedCharacters,
  onToggleCharacter,
  required,
  playerCount
}) {
  const isSelected = (characterId) => {
    return selectedCharacters.some(c => c.characterId === characterId)
  }

  const getTypeCount = (type) => {
    return selectedCharacters.filter(c => c.type === type).length
  }

  const typeColors = {
    townsfolk: 'border-townsfolk bg-townsfolk/10',
    outsider: 'border-outsider bg-outsider/10',
    minion: 'border-minion bg-minion/10',
    demon: 'border-demon bg-demon/10'
  }

  const typeTextColors = {
    townsfolk: 'text-townsfolk',
    outsider: 'text-outsider',
    minion: 'text-minion',
    demon: 'text-demon'
  }

  const renderCharacterType = (type, typeCharacters) => {
    const count = getTypeCount(type)
    const requiredCount = required[type] || required[type + 's'] || 0
    const isComplete = count === requiredCount

    return (
      <div key={type} className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-xl font-bold ${typeTextColors[type]} flex items-center gap-2`}>
            <span className="text-2xl">{getCharacterTypeIcon(type)}</span>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </h3>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            isComplete
              ? 'bg-green-900 text-green-200'
              : count > requiredCount
                ? 'bg-red-900 text-red-200'
                : 'bg-gray-700 text-gray-300'
          }`}>
            {count} / {requiredCount}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {typeCharacters.map((character) => {
            const selected = isSelected(character.characterId)

            return (
              <button
                key={character.id}
                onClick={() => onToggleCharacter(character)}
                className={`
                  p-3 rounded-lg border-2 transition-all text-left
                  ${selected
                    ? `${typeColors[type]} ring-2 ring-offset-2 ring-offset-gray-900 ${typeColors[type].replace('border-', 'ring-')}`
                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                  }
                `}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="font-bold text-sm">{character.name}</span>
                  {selected && (
                    <span className={typeTextColors[type]}>✓</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 line-clamp-2">
                  {character.ability}
                </p>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="card bg-gray-900">
        <h4 className="font-bold mb-3">Distribusi untuk {playerCount} Pemain</h4>
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(required).map(([type, count]) => {
            const selected = getTypeCount(type)
            const isComplete = selected === count

            return (
              <div key={type} className="text-center">
                <div className="text-2xl mb-1">{getCharacterTypeIcon(type)}</div>
                <div className={`text-sm font-semibold ${
                  isComplete ? 'text-green-400' : 'text-gray-400'
                }`}>
                  {selected}/{count}
                </div>
                <div className="text-xs text-gray-500 capitalize">{type}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Character Grid by Type */}
      {characters.townsfolk && renderCharacterType('townsfolk', characters.townsfolk)}
      {characters.outsider && renderCharacterType('outsider', characters.outsider)}
      {characters.minion && renderCharacterType('minion', characters.minion)}
      {characters.demon && renderCharacterType('demon', characters.demon)}
    </div>
  )
}
