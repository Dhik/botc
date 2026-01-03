'use client'

export default function PlayerToken({ player, onClick, isSelected, showReminders, reminders }) {
  if (!player) return null

  const getCharacterIcon = (team) => {
    const icons = {
      townsfolk: '👤',
      outsider: '🎭',
      minion: '😈',
      demon: '👹'
    }
    return icons[team] || '❓'
  }

  const getCharacterColor = (team) => {
    const colors = {
      townsfolk: 'border-townsfolk bg-townsfolk/20',
      outsider: 'border-outsider bg-outsider/20',
      minion: 'border-minion bg-minion/20',
      demon: 'border-demon bg-demon/20'
    }
    return colors[team] || 'border-gray-500 bg-gray-500/20'
  }

  const playerReminders = reminders || []
  const hasReminders = playerReminders.length > 0

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer transition-all ${
        isSelected ? 'scale-110 ring-4 ring-blood' : 'hover:scale-105'
      }`}
    >
      {/* Player Token Circle */}
      <div
        className={`w-20 h-20 rounded-full border-4 flex flex-col items-center justify-center ${
          player.character
            ? getCharacterColor(player.character.team)
            : 'border-gray-600 bg-gray-600/20'
        } ${!player.isAlive ? 'opacity-40 grayscale' : ''}`}
      >
        {/* Character Icon */}
        {player.character ? (
          <div className="text-3xl">{getCharacterIcon(player.character.team)}</div>
        ) : (
          <div className="text-2xl">❓</div>
        )}

        {/* Seat Number */}
        <div className="text-xs font-bold mt-1">#{player.seatNumber}</div>
      </div>

      {/* Dead Shroud */}
      {!player.isAlive && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl opacity-80">💀</div>
        </div>
      )}

      {/* Ghost Vote Indicator */}
      {!player.isAlive && player.hasUsedGhostVote && (
        <div className="absolute -top-1 -right-1 bg-purple-900 border-2 border-purple-700 rounded-full w-6 h-6 flex items-center justify-center text-xs">
          👻
        </div>
      )}

      {/* Player Name */}
      <div className="mt-1 text-center">
        <p className="text-xs font-medium truncate max-w-[80px]">
          {player.name}
        </p>
        {player.character && (
          <p className="text-[10px] text-gray-400 truncate max-w-[80px]">
            {player.character.name}
          </p>
        )}
      </div>

      {/* Reminders */}
      {showReminders && hasReminders && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
          {playerReminders.slice(0, 3).map((reminder, idx) => (
            <div
              key={idx}
              className="bg-yellow-900 border border-yellow-700 rounded px-1 text-[8px] font-bold text-yellow-200"
              title={reminder}
            >
              {reminder.substring(0, 3)}
            </div>
          ))}
          {playerReminders.length > 3 && (
            <div className="bg-yellow-900 border border-yellow-700 rounded px-1 text-[8px] font-bold text-yellow-200">
              +{playerReminders.length - 3}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
