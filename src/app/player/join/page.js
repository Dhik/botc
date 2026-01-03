'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import RoomCodeInput from '@/components/shared/RoomCodeInput'

export default function JoinGame() {
  const router = useRouter()
  const [roomCode, setRoomCode] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/games/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomCode, playerName }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal bergabung ke game')
      }

      // Store player data in localStorage
      localStorage.setItem('playerId', data.player.id)
      localStorage.setItem('gameId', data.game.id)
      localStorage.setItem('isGM', 'false')

      // Redirect to lobby
      router.push(`/player/${data.roomCode}/lobby`)

    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const isFormValid = roomCode.length === 6 && playerName.trim().length > 0

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎮</div>
          <h1 className="text-4xl font-bold text-townsfolk mb-2">Gabung Game</h1>
          <p className="text-gray-400">Masukkan kode room dari Game Master</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6">
          <div>
            <label htmlFor="roomCode" className="block text-sm font-medium mb-2">
              Room Code
            </label>
            <RoomCodeInput
              id="roomCode"
              value={roomCode}
              onChange={setRoomCode}
              required
            />
            <p className="text-xs text-gray-500 mt-1 text-center">
              6 karakter (huruf & angka)
            </p>
          </div>

          <div>
            <label htmlFor="playerName" className="block text-sm font-medium mb-2">
              Nama Kamu
            </label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-townsfolk focus:border-transparent outline-none transition"
              placeholder="Masukkan nama..."
              maxLength={20}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {playerName.length}/20 karakter
            </p>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Bergabung...
              </span>
            ) : (
              'Gabung'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-gray-400 hover:text-white transition">
            ← Kembali ke Home
          </Link>
        </div>
      </div>
    </main>
  )
}
