// Game logic and rule helpers for Blood on the Clocktower

// Calculate required character distribution based on player count
// Trouble Brewing distribution rules
export function calculateRequiredDistribution(playerCount) {
  if (playerCount < 5 || playerCount > 15) {
    throw new Error('Player count must be between 5 and 15')
  }

  // Trouble Brewing distribution formula
  // Always 1 Demon
  // Minions: 1 for 5-6 players, 2 for 7-9, 3 for 10-12, 4 for 13-15
  // Outsiders: Based on formula (playerCount - 5) / 3, rounded down
  // Townsfolk: Remainder

  const demon = 1

  let minions
  if (playerCount <= 6) minions = 1
  else if (playerCount <= 9) minions = 2
  else if (playerCount <= 12) minions = 3
  else minions = 4

  const outsiders = Math.floor((playerCount - 5) / 3)
  const townsfolk = playerCount - demon - minions - outsiders

  return {
    townsfolk,
    outsider: outsiders,
    minion: minions,
    demon
  }
}

// Validate if selected characters match required distribution
export function validateCharacterSelection(selectedCharacters, playerCount) {
  const required = calculateRequiredDistribution(playerCount)
  const selected = countByType(selectedCharacters)

  return (
    selected.townsfolk === required.townsfolk &&
    selected.outsider === required.outsider &&
    selected.minion === required.minion &&
    selected.demon === required.demon
  )
}

// Count characters by type
export function countByType(characters) {
  const counts = {
    townsfolk: 0,
    outsider: 0,
    minion: 0,
    demon: 0
  }

  characters.forEach(char => {
    if (counts.hasOwnProperty(char.type)) {
      counts[char.type]++
    }
  })

  return counts
}

// Get next phase in game flow
export function getNextPhase(currentPhase) {
  if (!currentPhase) return 'night-1'

  const [type, num] = currentPhase.split('-')
  const number = parseInt(num)

  if (type === 'night') {
    return `day-${number}`
  } else {
    return `night-${number + 1}`
  }
}

// Check if it's first night
export function isFirstNight(phase) {
  return phase === 'night-1'
}

// Get wake order for a night phase
export function getWakeOrder(characters, isFirstNight) {
  const orderKey = isFirstNight ? 'firstNight' : 'otherNights'

  return characters
    .filter(char => char[orderKey] !== null && char[orderKey] !== undefined)
    .sort((a, b) => a[orderKey] - b[orderKey])
}

// Calculate vote result
export function calculateVoteResult(votes) {
  const tally = {
    yes: 0,
    no: 0,
    abstain: 0,
    total: votes.length
  }

  votes.forEach(vote => {
    if (vote.value === 'yes') tally.yes++
    else if (vote.value === 'no') tally.no++
    else tally.abstain++
  })

  return tally
}

// Check if player should die from execution
export function shouldPlayerDie(votes, totalAlivePlayers) {
  const result = calculateVoteResult(votes)
  // Need more than half of alive players to execute
  return result.yes > (totalAlivePlayers / 2)
}

// Get character type color
export function getCharacterTypeColor(type) {
  const colors = {
    townsfolk: '#4169e1',
    outsider: '#4682b4',
    minion: '#ff4500',
    demon: '#dc143c'
  }
  return colors[type] || '#gray'
}

// Get character type icon
export function getCharacterTypeIcon(type) {
  const icons = {
    townsfolk: '👥',
    outsider: '🎭',
    minion: '😈',
    demon: '👹'
  }
  return icons[type] || '❓'
}
