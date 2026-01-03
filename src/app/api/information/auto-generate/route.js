import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST: Auto-generate information for a player based on their character and game state
export async function POST(request) {
  try {
    const body = await request.json()
    const { gameId, playerId, phase, targetPlayerIds: requestTargetPlayerIds } = body

    if (!gameId || !playerId) {
      return NextResponse.json(
        { error: 'gameId dan playerId diperlukan' },
        { status: 400 }
      )
    }

    // Default empty array if not provided
    const targetPlayerIds = requestTargetPlayerIds || []

    // Get player
    const player = await prisma.player.findUnique({
      where: { id: playerId }
    })

    if (!player || !player.characterId) {
      return NextResponse.json(
        { error: 'Pemain atau karakter tidak ditemukan' },
        { status: 404 }
      )
    }

    // Get all characters
    const allCharacters = await prisma.character.findMany()

    // Find player's character
    const playerCharacter = allCharacters.find(c => c.characterId === player.characterId)

    if (!playerCharacter) {
      return NextResponse.json(
        { error: 'Karakter tidak ditemukan' },
        { status: 404 }
      )
    }

    // Get all players in the game (sorted by seat number for neighbor checks)
    const allPlayersRaw = await prisma.player.findMany({
      where: {
        gameId,
        isGM: false
      },
      orderBy: {
        seatNumber: 'asc'
      }
    })

    // Attach character data to each player
    const allPlayers = allPlayersRaw.map(p => ({
      ...p,
      character: p.characterId ? allCharacters.find(c => c.characterId === p.characterId) : null
    }))

    // Check if player is poisoned
    const poisonEvents = await prisma.gameEvent.findMany({
      where: {
        gameId,
        eventType: 'player-poisoned',
        metadata: {
          path: ['playerId'],
          equals: playerId
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 1
    })

    // Check if there's an unpoisoned event after the poisoned event
    const unpoisonEvents = await prisma.gameEvent.findMany({
      where: {
        gameId,
        eventType: 'player-unpoisoned',
        metadata: {
          path: ['playerId'],
          equals: playerId
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 1
    })

    const isPoisoned = poisonEvents.length > 0 &&
      (unpoisonEvents.length === 0 || poisonEvents[0].createdAt > unpoisonEvents[0].createdAt)

    // Generate information based on character
    const characterId = playerCharacter.characterId.toLowerCase()
    let generatedInfo = null

    switch (characterId) {
      case 'washerwoman':
        generatedInfo = generateWasherwomanInfo(allPlayers, isPoisoned)
        break
      case 'librarian':
        generatedInfo = generateLibrarianInfo(allPlayers, isPoisoned)
        break
      case 'investigator':
        generatedInfo = generateInvestigatorInfo(allPlayers, isPoisoned)
        break
      case 'chef':
        generatedInfo = generateChefInfo(allPlayers, isPoisoned)
        break
      case 'empath':
        generatedInfo = generateEmpathInfo(player, allPlayers, isPoisoned)
        break
      case 'fortune-teller':
        generatedInfo = generateFortuneTellerInfo(allPlayers, targetPlayerIds, isPoisoned)
        break
      case 'undertaker':
        generatedInfo = await generateUndertakerInfo(gameId, phase, isPoisoned)
        break
      case 'ravenkeeper':
        generatedInfo = generateRavenkeeperInfo(allPlayers, targetPlayerIds, isPoisoned)
        break
      default:
        return NextResponse.json(
          { error: 'Karakter ini tidak memiliki informasi otomatis' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      information: generatedInfo,
      isPoisoned
    })

  } catch (error) {
    console.error('Error auto-generating information:', error)
    return NextResponse.json(
      { error: 'Gagal generate informasi' },
      { status: 500 }
    )
  }
}

// Helper: Get random element from array
function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Helper: Get two random different elements
function getRandomTwo(arr) {
  if (arr.length < 2) return arr
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return [shuffled[0], shuffled[1]]
}

// Washerwoman: 2 players, one is a Townsfolk
function generateWasherwomanInfo(allPlayers, isPoisoned) {
  const townsfolk = allPlayers.filter(p => p.character?.type === 'Townsfolk')

  if (isPoisoned) {
    // Give wrong information
    const randomPlayers = getRandomTwo(allPlayers)
    const randomTownsfolk = getRandomElement(townsfolk.length > 0 ? townsfolk : allPlayers)
    const fakeCharacter = randomTownsfolk.character?.name || 'Monk'

    return {
      content: `Antara ${randomPlayers[0].name} dan ${randomPlayers[1].name}, salah satunya adalah ${fakeCharacter}.`,
      players: randomPlayers,
      isCorrect: false
    }
  }

  // Give correct information
  if (townsfolk.length === 0) {
    return {
      content: 'Tidak ada Townsfolk dalam permainan.',
      players: [],
      isCorrect: true
    }
  }

  const targetTownsfolk = getRandomElement(townsfolk)
  const otherPlayer = getRandomElement(allPlayers.filter(p => p.id !== targetTownsfolk.id))

  return {
    content: `Antara ${targetTownsfolk.name} dan ${otherPlayer.name}, salah satunya adalah ${targetTownsfolk.character.name}.`,
    players: [targetTownsfolk, otherPlayer],
    isCorrect: true
  }
}

// Librarian: 2 players, one is an Outsider
function generateLibrarianInfo(allPlayers, isPoisoned) {
  const outsiders = allPlayers.filter(p => p.character?.type === 'Outsider')

  if (isPoisoned) {
    // Give wrong information
    const randomPlayers = getRandomTwo(allPlayers)
    const fakeCharacter = 'Drunk' // or any outsider name

    return {
      content: `Antara ${randomPlayers[0].name} dan ${randomPlayers[1].name}, salah satunya adalah ${fakeCharacter}.`,
      players: randomPlayers,
      isCorrect: false
    }
  }

  // Give correct information
  if (outsiders.length === 0) {
    return {
      content: 'Tidak ada Outsider dalam permainan.',
      players: [],
      isCorrect: true
    }
  }

  const targetOutsider = getRandomElement(outsiders)
  const otherPlayer = getRandomElement(allPlayers.filter(p => p.id !== targetOutsider.id))

  return {
    content: `Antara ${targetOutsider.name} dan ${otherPlayer.name}, salah satunya adalah ${targetOutsider.character.name}.`,
    players: [targetOutsider, otherPlayer],
    isCorrect: true
  }
}

// Investigator: 2 players, one is a Minion
function generateInvestigatorInfo(allPlayers, isPoisoned) {
  const minions = allPlayers.filter(p => p.character?.type === 'Minion')

  if (isPoisoned) {
    // Give wrong information
    const randomPlayers = getRandomTwo(allPlayers)
    const fakeCharacter = 'Poisoner' // or any minion name

    return {
      content: `Antara ${randomPlayers[0].name} dan ${randomPlayers[1].name}, salah satunya adalah ${fakeCharacter}.`,
      players: randomPlayers,
      isCorrect: false
    }
  }

  // Give correct information
  if (minions.length === 0) {
    return {
      content: 'Tidak ada Minion dalam permainan.',
      players: [],
      isCorrect: true
    }
  }

  const targetMinion = getRandomElement(minions)
  const otherPlayer = getRandomElement(allPlayers.filter(p => p.id !== targetMinion.id))

  return {
    content: `Antara ${targetMinion.name} dan ${otherPlayer.name}, salah satunya adalah ${targetMinion.character.name}.`,
    players: [targetMinion, otherPlayer],
    isCorrect: true
  }
}

// Chef: Count pairs of Evil neighbors
function generateChefInfo(allPlayers, isPoisoned) {
  let evilPairCount = 0

  // Check each adjacent pair
  for (let i = 0; i < allPlayers.length; i++) {
    const currentPlayer = allPlayers[i]
    const nextPlayer = allPlayers[(i + 1) % allPlayers.length] // circular

    const isCurrentEvil = ['Demon', 'Minion'].includes(currentPlayer.character?.type)
    const isNextEvil = ['Demon', 'Minion'].includes(nextPlayer.character?.type)

    if (isCurrentEvil && isNextEvil) {
      evilPairCount++
    }
  }

  if (isPoisoned) {
    // Give wrong count
    const wrongCount = evilPairCount === 0 ? 1 : (evilPairCount === 1 ? 2 : 0)
    return {
      content: `Ada ${wrongCount} pasang pemain Evil yang duduk bersebelahan.`,
      count: wrongCount,
      isCorrect: false
    }
  }

  return {
    content: `Ada ${evilPairCount} pasang pemain Evil yang duduk bersebelahan.`,
    count: evilPairCount,
    isCorrect: true
  }
}

// Empath: Count Evil neighbors
function generateEmpathInfo(player, allPlayers, isPoisoned) {
  const playerIndex = allPlayers.findIndex(p => p.id === player.id)

  if (playerIndex === -1) {
    return {
      content: 'Error: Pemain tidak ditemukan dalam urutan duduk.',
      count: 0,
      isCorrect: false
    }
  }

  const leftNeighbor = allPlayers[(playerIndex - 1 + allPlayers.length) % allPlayers.length]
  const rightNeighbor = allPlayers[(playerIndex + 1) % allPlayers.length]

  let evilCount = 0
  if (['Demon', 'Minion'].includes(leftNeighbor.character?.type)) evilCount++
  if (['Demon', 'Minion'].includes(rightNeighbor.character?.type)) evilCount++

  if (isPoisoned) {
    // Give wrong count
    const wrongCount = evilCount === 0 ? 1 : (evilCount === 1 ? 2 : 0)
    return {
      content: `Ada ${wrongCount} pemain Evil di sebelah kiri dan kananmu.`,
      count: wrongCount,
      neighbors: [leftNeighbor, rightNeighbor],
      isCorrect: false
    }
  }

  return {
    content: `Ada ${evilCount} pemain Evil di sebelah kiri dan kananmu.`,
    count: evilCount,
    neighbors: [leftNeighbor, rightNeighbor],
    isCorrect: true
  }
}

// Fortune Teller: Check if one of 2 selected players is Demon
function generateFortuneTellerInfo(allPlayers, targetPlayerIds, isPoisoned) {
  if (!targetPlayerIds || targetPlayerIds.length !== 2) {
    return {
      content: 'Pilih 2 pemain untuk dicek.',
      isCorrect: false
    }
  }

  const player1 = allPlayers.find(p => p.id === targetPlayerIds[0])
  const player2 = allPlayers.find(p => p.id === targetPlayerIds[1])

  if (!player1 || !player2) {
    return {
      content: 'Pemain tidak ditemukan.',
      isCorrect: false
    }
  }

  const hasDemon = player1.character?.type === 'Demon' || player2.character?.type === 'Demon'

  if (isPoisoned) {
    // Give opposite answer
    const wrongAnswer = !hasDemon
    return {
      content: wrongAnswer
        ? `Ya, salah satu dari ${player1.name} atau ${player2.name} adalah Demon.`
        : `Tidak, ${player1.name} dan ${player2.name} bukan Demon.`,
      answer: wrongAnswer,
      players: [player1, player2],
      isCorrect: false
    }
  }

  return {
    content: hasDemon
      ? `Ya, salah satu dari ${player1.name} atau ${player2.name} adalah Demon.`
      : `Tidak, ${player1.name} dan ${player2.name} bukan Demon.`,
    answer: hasDemon,
    players: [player1, player2],
    isCorrect: true
  }
}

// Undertaker: Show character of player who died yesterday
async function generateUndertakerInfo(gameId, phase, isPoisoned) {
  // Find the most recent death
  const deathEvents = await prisma.gameEvent.findMany({
    where: {
      gameId,
      eventType: 'player-death'
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 1
  })

  if (deathEvents.length === 0) {
    return {
      content: 'Belum ada pemain yang mati.',
      isCorrect: true
    }
  }

  const deathEvent = deathEvents[0]
  const deadPlayerId = deathEvent.metadata?.playerId

  if (!deadPlayerId) {
    return {
      content: 'Data pemain yang mati tidak ditemukan.',
      isCorrect: false
    }
  }

  const deadPlayer = await prisma.player.findUnique({
    where: { id: deadPlayerId },
    include: { character: true }
  })

  if (!deadPlayer || !deadPlayer.character) {
    return {
      content: 'Karakter pemain yang mati tidak ditemukan.',
      isCorrect: false
    }
  }

  if (isPoisoned) {
    // Give wrong character
    const allCharacters = ['Imp', 'Poisoner', 'Chef', 'Monk', 'Virgin', 'Saint']
    const fakeCharacter = getRandomElement(allCharacters.filter(c => c !== deadPlayer.character.name))

    return {
      content: `Pemain yang mati adalah ${fakeCharacter}.`,
      character: fakeCharacter,
      isCorrect: false
    }
  }

  return {
    content: `Pemain yang mati adalah ${deadPlayer.character.name}.`,
    character: deadPlayer.character.name,
    player: deadPlayer,
    isCorrect: true
  }
}

// Ravenkeeper: Show character of selected player (when dying)
function generateRavenkeeperInfo(allPlayers, targetPlayerIds, isPoisoned) {
  if (!targetPlayerIds || targetPlayerIds.length === 0) {
    return {
      content: 'Pilih 1 pemain untuk dicek karakternya.',
      isCorrect: false
    }
  }

  const targetPlayer = allPlayers.find(p => p.id === targetPlayerIds[0])

  if (!targetPlayer || !targetPlayer.character) {
    return {
      content: 'Pemain atau karakter tidak ditemukan.',
      isCorrect: false
    }
  }

  if (isPoisoned) {
    // Give wrong character
    const allCharacters = ['Imp', 'Poisoner', 'Chef', 'Monk', 'Virgin', 'Saint']
    const fakeCharacter = getRandomElement(allCharacters.filter(c => c !== targetPlayer.character.name))

    return {
      content: `${targetPlayer.name} adalah ${fakeCharacter}.`,
      character: fakeCharacter,
      player: targetPlayer,
      isCorrect: false
    }
  }

  return {
    content: `${targetPlayer.name} adalah ${targetPlayer.character.name}.`,
    character: targetPlayer.character.name,
    player: targetPlayer,
    isCorrect: true
  }
}
