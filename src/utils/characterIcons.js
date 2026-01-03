// Character icons for Blood on the Clocktower - Trouble Brewing
export const characterIcons = {
  // Townsfolk
  'washerwoman': '🧺',
  'librarian': '📚',
  'investigator': '🔍',
  'chef': '👨‍🍳',
  'empath': '💝',
  'fortune-teller': '🔮',
  'undertaker': '⚰️',
  'monk': '🙏',
  'ravenkeeper': '🐦‍⬛',
  'virgin': '👰',
  'slayer': '⚔️',
  'soldier': '🛡️',
  'mayor': '🎖️',

  // Outsiders
  'butler': '🤵',
  'drunk': '🍺',
  'recluse': '🚪',
  'saint': '😇',

  // Minions
  'poisoner': '☠️',
  'spy': '🕵️',
  'scarlet-woman': '💃',
  'baron': '👑',

  // Demons
  'imp': '👹',
}

// Get icon for a character by characterId
export const getCharacterIcon = (characterId) => {
  if (!characterId) return '❓'
  return characterIcons[characterId] || '❓'
}

// Get team-based default icon (fallback)
export const getTeamIcon = (team) => {
  const teamIcons = {
    'townsfolk': '👤',
    'outsider': '🎭',
    'minion': '😈',
    'demon': '👹'
  }
  return teamIcons[team] || '❓'
}

// Get color class for character type
export const getCharacterColor = (type) => {
  const colors = {
    'townsfolk': 'text-blue-400',
    'outsider': 'text-cyan-400',
    'minion': 'text-orange-500',
    'demon': 'text-red-600'
  }
  return colors[type] || 'text-gray-400'
}

// Get background color for character type
export const getCharacterBgColor = (type) => {
  const colors = {
    'townsfolk': 'bg-blue-900/20 border-blue-700',
    'outsider': 'bg-cyan-900/20 border-cyan-700',
    'minion': 'bg-orange-900/20 border-orange-700',
    'demon': 'bg-red-900/20 border-red-700'
  }
  return colors[type] || 'bg-gray-900/20 border-gray-700'
}
