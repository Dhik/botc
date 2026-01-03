'use client'

import { useState } from 'react'

export default function InformationHelper({ players, nightActions, game }) {
  const [expanded, setExpanded] = useState(false)
  const [generating, setGenerating] = useState(null)
  const [generatedInfo, setGeneratedInfo] = useState({})
  const [sendingInfo, setSendingInfo] = useState(null)

  // Find poisoned players
  const poisonedPlayerIds = nightActions
    .filter(action => action.eventType === 'night-action-poison')
    .map(action => action.metadata?.targetPlayerId)

  // Character information recommendations
  const getRecommendations = (player) => {
    if (!player.character) return []

    const characterId = player.character.characterId.toLowerCase()
    const isPoisoned = poisonedPlayerIds.includes(player.id)
    const prefix = isPoisoned ? '⚠️ SALAH (Poisoned)' : '✓ Benar'

    const recommendations = {
      'washerwoman': {
        correct: 'Beritahu 2 pemain, salah satunya adalah Townsfolk tertentu',
        wrong: 'Beritahu 2 pemain yang salah atau Townsfolk yang salah',
        example: isPoisoned ?
          'Contoh: "Antara Budi dan Siti, salah satunya adalah Monk" (padahal tidak benar)' :
          'Contoh: "Antara Budi dan Siti, salah satunya adalah Chef" (jika benar)'
      },
      'librarian': {
        correct: 'Beritahu 2 pemain, salah satunya adalah Outsider tertentu',
        wrong: 'Beritahu 2 pemain yang salah atau Outsider yang salah',
        example: isPoisoned ?
          'Contoh: "Antara Andi dan Rina, salah satunya adalah Saint" (padahal tidak benar)' :
          'Contoh: "Antara Andi dan Rina, salah satunya adalah Drunk" (jika benar)'
      },
      'investigator': {
        correct: 'Beritahu 2 pemain, salah satunya adalah Minion tertentu',
        wrong: 'Beritahu 2 pemain yang salah atau Minion yang salah',
        example: isPoisoned ?
          'Contoh: "Antara Doni dan Lisa, salah satunya adalah Spy" (padahal tidak benar)' :
          'Contoh: "Antara Doni dan Lisa, salah satunya adalah Poisoner" (jika benar)'
      },
      'chef': {
        correct: 'Beritahu jumlah pasangan Evil yang duduk bersebelahan',
        wrong: 'Beritahu angka yang salah',
        example: isPoisoned ?
          'Contoh: "Ada 2 pasang evil bersebelahan" (padahal 0 atau angka lain)' :
          'Contoh: "Ada 0 pasang evil bersebelahan" (jika benar tidak ada)'
      },
      'empath': {
        correct: 'Beritahu jumlah Evil (0, 1, atau 2) di sebelah kiri dan kanan',
        wrong: 'Beritahu angka yang salah',
        example: isPoisoned ?
          'Contoh: "Ada 1 Evil di sebelahmu" (padahal 0 atau 2)' :
          'Contoh: "Ada 0 Evil di sebelahmu" (jika tetangga Good)'
      },
      'fortune-teller': {
        correct: 'Beritahu apakah salah satu dari 2 pemain pilihan mereka adalah Demon (Ya/Tidak)',
        wrong: 'Beritahu jawaban yang salah',
        example: isPoisoned ?
          'Contoh: "Ya, salah satunya Demon" (padahal tidak)' :
          'Contoh: "Tidak, tidak ada Demon" (jika benar)'
      },
      'undertaker': {
        correct: 'Beritahu character pemain yang mati kemarin',
        wrong: 'Beritahu character yang salah',
        example: isPoisoned ?
          'Contoh: "Yang mati kemarin adalah Monk" (padahal Chef)' :
          'Contoh: "Yang mati kemarin adalah Chef" (jika benar)'
      },
      'ravenkeeper': {
        correct: 'Beritahu character pemain yang dipilih (saat Ravenkeeper mati)',
        wrong: 'Beritahu character yang salah',
        example: isPoisoned ?
          'Contoh: "Pemain itu adalah Imp" (padahal Virgin)' :
          'Contoh: "Pemain itu adalah Virgin" (jika benar)'
      }
    }

    return recommendations[characterId] || null
  }

  // Get players who need information
  const playersNeedingInfo = players.filter(p => {
    if (!p.character || p.isGM) return false
    const charId = p.character.characterId.toLowerCase()
    return ['washerwoman', 'librarian', 'investigator', 'chef', 'empath', 'fortune-teller', 'undertaker', 'ravenkeeper'].includes(charId)
  })

  // Auto-generate information for a player
  const handleAutoGenerate = async (player) => {
    setGenerating(player.id)

    try {
      const response = await fetch('/api/information/auto-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: game.id,
          playerId: player.id,
          phase: game.currentPhase
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to generate information')
      }

      const data = await response.json()

      // Store generated info
      setGeneratedInfo(prev => ({
        ...prev,
        [player.id]: data.information
      }))

      alert('✅ Informasi berhasil di-generate!')
    } catch (error) {
      console.error('Error generating information:', error)
      alert(error.message)
    } finally {
      setGenerating(null)
    }
  }

  // Send generated information to player
  const handleSendInfo = async (player) => {
    const info = generatedInfo[player.id]
    if (!info) {
      alert('Generate informasi terlebih dahulu')
      return
    }

    setSendingInfo(player.id)

    try {
      const response = await fetch('/api/information', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: game.id,
          playerId: player.id,
          phase: game.currentPhase,
          infoType: 'ability-info',
          content: info.content
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to send information')
      }

      alert(`✅ Informasi berhasil dikirim ke ${player.name}!`)

      // Clear generated info after sending
      setGeneratedInfo(prev => {
        const newInfo = { ...prev }
        delete newInfo[player.id]
        return newInfo
      })
    } catch (error) {
      console.error('Error sending information:', error)
      alert(error.message)
    } finally {
      setSendingInfo(null)
    }
  }

  if (playersNeedingInfo.length === 0) return null

  return (
    <div className="card border-2 border-blue-700 bg-blue-900/10">
      <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">💡</span>
          <div>
            <h2 className="text-lg font-bold">Information Helper</h2>
            <p className="text-xs text-blue-400">Rekomendasi info untuk setiap character</p>
          </div>
        </div>
        <button className="text-2xl">
          {expanded ? '▼' : '▶'}
        </button>
      </div>

      {expanded && (
        <div className="space-y-3">
          {playersNeedingInfo.map(player => {
            const recommendation = getRecommendations(player)
            const isPoisoned = poisonedPlayerIds.includes(player.id)

            if (!recommendation) return null

            const playerGeneratedInfo = generatedInfo[player.id]

            return (
              <div
                key={player.id}
                className={`p-4 rounded-lg border-2 ${
                  isPoisoned
                    ? 'bg-red-900/20 border-red-700'
                    : 'bg-blue-900/20 border-blue-700'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-lg">
                      {player.name} - {player.character.name}
                    </p>
                    <p className="text-xs text-gray-400">Kursi #{player.seatNumber}</p>
                  </div>
                  {isPoisoned && (
                    <span className="px-2 py-1 bg-red-900 border border-red-700 rounded text-xs font-bold">
                      ☠️ POISONED
                    </span>
                  )}
                </div>

                {/* Auto-Generate Button */}
                <div className="mb-3 flex gap-2">
                  <button
                    onClick={() => handleAutoGenerate(player)}
                    disabled={generating === player.id}
                    className="flex-1 px-3 py-2 bg-purple-900 hover:bg-purple-800 rounded border border-purple-700 text-sm font-semibold disabled:opacity-50 transition-colors"
                  >
                    {generating === player.id ? '⏳ Generating...' : '🤖 Auto Generate Info'}
                  </button>
                  {playerGeneratedInfo && (
                    <button
                      onClick={() => handleSendInfo(player)}
                      disabled={sendingInfo === player.id}
                      className="flex-1 px-3 py-2 bg-green-900 hover:bg-green-800 rounded border border-green-700 text-sm font-semibold disabled:opacity-50 transition-colors"
                    >
                      {sendingInfo === player.id ? '⏳ Sending...' : '📤 Kirim ke Player'}
                    </button>
                  )}
                </div>

                {/* Generated Information Display */}
                {playerGeneratedInfo && (
                  <div className="mb-3 p-3 bg-purple-900/30 border border-purple-700 rounded">
                    <p className="text-xs font-bold text-purple-300 mb-2">
                      🤖 Auto-Generated Information:
                    </p>
                    <p className="text-sm text-white font-medium">
                      {playerGeneratedInfo.content}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {playerGeneratedInfo.isCorrect ? '✅ Informasi Benar' : '⚠️ Informasi Salah (Poisoned)'}
                    </p>
                  </div>
                )}

                <div className="space-y-2 mt-3">
                  <div className={`p-2 rounded ${isPoisoned ? 'bg-red-900/30' : 'bg-green-900/30'}`}>
                    <p className="text-xs font-bold mb-1">
                      {isPoisoned ? '⚠️ Berikan Info SALAH:' : '✓ Berikan Info BENAR:'}
                    </p>
                    <p className="text-sm">
                      {isPoisoned ? recommendation.wrong : recommendation.correct}
                    </p>
                  </div>

                  <div className="p-2 bg-gray-800/50 rounded">
                    <p className="text-xs font-bold text-gray-400 mb-1">Contoh:</p>
                    <p className="text-xs italic text-gray-300">
                      {recommendation.example}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Poison Warning */}
          {poisonedPlayerIds.length > 0 && (
            <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-3 mt-4">
              <p className="text-sm font-bold text-yellow-400 mb-2">
                ⚠️ Reminder: Poisoned Players
              </p>
              <p className="text-xs text-gray-300">
                Pemain yang diracuni akan mendapat informasi yang SALAH. Pastikan memberikan misinformasi kepada mereka!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
