const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const troubleBrewingCharacters = [
  // TOWNSFOLK
  {
    characterId: 'washerwoman',
    name: 'Washerwoman',
    type: 'townsfolk',
    ability: 'You start knowing that 1 of 2 players is a particular Townsfolk.',
    firstNight: 1,
    otherNights: null,
    reminders: ['Townsfolk', 'Wrong'],
    setup: null
  },
  {
    characterId: 'librarian',
    name: 'Librarian',
    type: 'townsfolk',
    ability: 'You start knowing that 1 of 2 players is a particular Outsider. (Or that zero are in play.)',
    firstNight: 2,
    otherNights: null,
    reminders: ['Outsider', 'Wrong'],
    setup: null
  },
  {
    characterId: 'investigator',
    name: 'Investigator',
    type: 'townsfolk',
    ability: 'You start knowing that 1 of 2 players is a particular Minion.',
    firstNight: 3,
    otherNights: null,
    reminders: ['Minion', 'Wrong'],
    setup: null
  },
  {
    characterId: 'chef',
    name: 'Chef',
    type: 'townsfolk',
    ability: 'You start knowing how many pairs of evil players there are.',
    firstNight: 4,
    otherNights: null,
    reminders: [],
    setup: null
  },
  {
    characterId: 'empath',
    name: 'Empath',
    type: 'townsfolk',
    ability: 'Each night, you learn how many of your 2 alive neighbours are evil.',
    firstNight: 5,
    otherNights: 1,
    reminders: [],
    setup: null
  },
  {
    characterId: 'fortune-teller',
    name: 'Fortune Teller',
    type: 'townsfolk',
    ability: 'Each night, choose 2 players: you learn if either is a Demon. There is a good player that registers as a Demon to you.',
    firstNight: 6,
    otherNights: 2,
    reminders: ['Red Herring'],
    setup: 'Red Herring'
  },
  {
    characterId: 'undertaker',
    name: 'Undertaker',
    type: 'townsfolk',
    ability: 'Each night*, you learn which character died by execution today.',
    firstNight: null,
    otherNights: 3,
    reminders: [],
    setup: null
  },
  {
    characterId: 'monk',
    name: 'Monk',
    type: 'townsfolk',
    ability: 'Each night*, choose a player (not yourself): they are safe from the Demon tonight.',
    firstNight: null,
    otherNights: 4,
    reminders: ['Protected'],
    setup: null
  },
  {
    characterId: 'ravenkeeper',
    name: 'Ravenkeeper',
    type: 'townsfolk',
    ability: 'If you die at night, you are woken to choose a player: you learn their character.',
    firstNight: null,
    otherNights: 5,
    reminders: [],
    setup: null
  },
  {
    characterId: 'virgin',
    name: 'Virgin',
    type: 'townsfolk',
    ability: 'The 1st time you are nominated, if the nominator is a Townsfolk, they are executed immediately.',
    firstNight: null,
    otherNights: null,
    reminders: ['No ability'],
    setup: null
  },
  {
    characterId: 'slayer',
    name: 'Slayer',
    type: 'townsfolk',
    ability: 'Once per game, during the day, publicly choose a player: if they are the Demon, they die.',
    firstNight: null,
    otherNights: null,
    reminders: ['No ability'],
    setup: null
  },
  {
    characterId: 'soldier',
    name: 'Soldier',
    type: 'townsfolk',
    ability: 'You are safe from the Demon.',
    firstNight: null,
    otherNights: null,
    reminders: [],
    setup: null
  },
  {
    characterId: 'mayor',
    name: 'Mayor',
    type: 'townsfolk',
    ability: 'If only 3 players live & no execution occurs, your team wins. If you die at night, another player might die instead.',
    firstNight: null,
    otherNights: null,
    reminders: [],
    setup: null
  },

  // OUTSIDERS
  {
    characterId: 'butler',
    name: 'Butler',
    type: 'outsider',
    ability: 'Each night, choose a player (not yourself): tomorrow, you may only vote if they are voting too.',
    firstNight: 7,
    otherNights: 6,
    reminders: ['Master'],
    setup: null
  },
  {
    characterId: 'drunk',
    name: 'Drunk',
    type: 'outsider',
    ability: 'You do not know you are the Drunk. You think you are a Townsfolk, but you are not.',
    firstNight: null,
    otherNights: null,
    reminders: [],
    setup: 'Drunk thinks they are a Townsfolk'
  },
  {
    characterId: 'recluse',
    name: 'Recluse',
    type: 'outsider',
    ability: 'You might register as evil & as a Minion or Demon, even if dead.',
    firstNight: null,
    otherNights: null,
    reminders: [],
    setup: null
  },
  {
    characterId: 'saint',
    name: 'Saint',
    type: 'outsider',
    ability: 'If you die by execution, your team loses.',
    firstNight: null,
    otherNights: null,
    reminders: [],
    setup: null
  },

  // MINIONS
  {
    characterId: 'poisoner',
    name: 'Poisoner',
    type: 'minion',
    ability: 'Each night, choose a player: they are poisoned tonight and tomorrow day.',
    firstNight: 8,
    otherNights: 7,
    reminders: ['Poisoned'],
    setup: null
  },
  {
    characterId: 'spy',
    name: 'Spy',
    type: 'minion',
    ability: 'Each night, you see the Grimoire. You might register as good & as a Townsfolk or Outsider, even if dead.',
    firstNight: 9,
    otherNights: 8,
    reminders: [],
    setup: null
  },
  {
    characterId: 'scarlet-woman',
    name: 'Scarlet Woman',
    type: 'minion',
    ability: 'If there are 5 or more players alive & the Demon dies, you become the Demon.',
    firstNight: null,
    otherNights: 9,
    reminders: [],
    setup: null
  },
  {
    characterId: 'baron',
    name: 'Baron',
    type: 'minion',
    ability: 'There are extra Outsiders in play.',
    firstNight: null,
    otherNights: null,
    reminders: [],
    setup: 'Add 2 Outsiders'
  },

  // DEMONS
  {
    characterId: 'imp',
    name: 'Imp',
    type: 'demon',
    ability: 'Each night*, choose a player: they die. If you kill yourself this way, a Minion becomes the Imp.',
    firstNight: null,
    otherNights: 10,
    reminders: ['Dead'],
    setup: null
  }
]

async function main() {
  console.log('Start seeding...')

  // Clear existing characters
  await prisma.character.deleteMany({})

  // Insert all Trouble Brewing characters
  for (const character of troubleBrewingCharacters) {
    await prisma.character.create({
      data: character
    })
    console.log(`Created character: ${character.name}`)
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
