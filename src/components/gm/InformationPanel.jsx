'use client'

import { useState } from 'react'

export default function InformationPanel({ game, players }) {
  const [selectedPlayerId, setSelectedPlayerId] = useState('')
  const [message, setMessage] = useState('')
  const [type, setType] = useState('info')
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSendInformation = async (e) => {
    e.preventDefault()

    if (!selectedPlayerId || !message.trim()) {
      return
    }

    setSending(true)
    setSuccess(false)

    try {
      const response = await fetch('/api/information', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: game.id,
          playerId: selectedPlayerId,
          phase: game.currentPhase,
          type,
          content: message.trim()
        })
      })

      if (!response.ok) throw new Error('Failed to send information')

      // Success
      setSuccess(true)
      setMessage('')

      // Clear success message after 2 seconds
      setTimeout(() => setSuccess(false), 2000)

    } catch (error) {
      console.error('Error sending information:', error)
      alert('Gagal mengirim informasi')
    } finally {
      setSending(false)
    }
  }

  const typeOptions = [
    { value: 'info', label: '💬 Informasi', color: 'bg-blue-900 border-blue-700' },
    { value: 'warning', label: '⚠️ Peringatan', color: 'bg-yellow-900 border-yellow-700' },
    { value: 'ability', label: '✨ Kemampuan', color: 'bg-purple-900 border-purple-700' },
    { value: 'death', label: '💀 Kematian', color: 'bg-red-900 border-red-700' }
  ]

  const selectedType = typeOptions.find(opt => opt.value === type)

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        📨 Kirim Informasi ke Pemain
      </h2>

      <form onSubmit={handleSendInformation} className="space-y-4">
        {/* Player Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Pilih Pemain
          </label>
          <select
            value={selectedPlayerId}
            onChange={(e) => setSelectedPlayerId(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blood"
            required
          >
            <option value="">-- Pilih Pemain --</option>
            {players
              .filter(p => !p.isGM)
              .sort((a, b) => a.seatNumber - b.seatNumber)
              .map(player => (
                <option key={player.id} value={player.id}>
                  #{player.seatNumber} - {player.name}
                  {player.character && ` (${player.character.name})`}
                  {!player.isAlive && ' 💀'}
                </option>
              ))}
          </select>
        </div>

        {/* Type Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Tipe Informasi
          </label>
          <div className="grid grid-cols-2 gap-2">
            {typeOptions.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => setType(option.value)}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  type === option.value
                    ? option.color
                    : 'bg-gray-800 border-gray-700 opacity-50 hover:opacity-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Pesan
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tulis informasi yang akan dikirim ke pemain..."
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blood min-h-[100px] resize-none"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {message.length} karakter
          </p>
        </div>

        {/* Preview */}
        {message && (
          <div className={`p-4 rounded-lg border-2 ${selectedType.color}`}>
            <p className="text-xs font-medium opacity-70 mb-1">Preview:</p>
            <p className="text-sm">{message}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!selectedPlayerId || !message.trim() || sending}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Mengirim...
            </span>
          ) : (
            '📤 Kirim Informasi'
          )}
        </button>

        {/* Success Message */}
        {success && (
          <div className="bg-green-900 border-2 border-green-700 text-green-100 px-4 py-2 rounded-lg text-center">
            ✅ Informasi berhasil dikirim!
          </div>
        )}
      </form>

      {/* Quick Templates */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <p className="text-sm font-medium mb-3">Template Cepat:</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setMessage('Kamu melihat seorang Demon.')}
            className="text-xs px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded border border-gray-700"
          >
            👁️ Lihat Demon
          </button>
          <button
            type="button"
            onClick={() => setMessage('Kamu mendapat informasi positif.')}
            className="text-xs px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded border border-gray-700"
          >
            ✅ Info Positif
          </button>
          <button
            type="button"
            onClick={() => setMessage('Kamu telah diracuni malam ini.')}
            className="text-xs px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded border border-gray-700"
          >
            🧪 Diracuni
          </button>
          <button
            type="button"
            onClick={() => setMessage('Kamu tidak mendapat informasi.')}
            className="text-xs px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded border border-gray-700"
          >
            ❌ Tidak Ada Info
          </button>
        </div>
      </div>
    </div>
  )
}
