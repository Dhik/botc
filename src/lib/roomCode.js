import { prisma } from './prisma'

export async function generateUniqueRoomCode() {
  let code = generateCode()
  let exists = await checkCodeExists(code)

  // Retry if code already exists (max 10 attempts)
  let attempts = 0
  while (exists && attempts < 10) {
    code = generateCode()
    exists = await checkCodeExists(code)
    attempts++
  }

  if (attempts >= 10) {
    throw new Error('Failed to generate unique room code')
  }

  return code
}

function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

async function checkCodeExists(code) {
  const game = await prisma.game.findUnique({
    where: { roomCode: code }
  })
  return game !== null
}

export function formatRoomCode(input) {
  // Remove non-alphanumeric, uppercase, limit to 6 chars
  return input.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 6)
}

export function validateRoomCode(code) {
  // Must be exactly 6 characters, alphanumeric, uppercase
  const regex = /^[A-Z0-9]{6}$/
  return regex.test(code)
}
