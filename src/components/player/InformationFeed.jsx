'use client'

import { useState, useEffect } from 'react'
import { subscribeToInformation } from '@/lib/supabase'

export default function InformationFeed({ gameId, playerId }) {
  const [information, setInformation] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!gameId || !playerId) return

    // Fetch initial information
    const fetchInformation = async () => {
      try {
        const response = await fetch(`/api/information?gameId=${gameId}&playerId=${playerId}`)
        const data = await response.json()

        if (data.success) {
          setInformation(data.information)
        }
        setLoading(false)
      } catch (error) {
        console.error('Error fetching information:', error)
        setLoading(false)
      }
    }

    fetchInformation()

    // Subscribe to real-time updates
    const channel = subscribeToInformation(playerId, (payload) => {
      console.log('Real-time information update:', payload)

      if (payload.eventType === 'INSERT') {
        setInformation(prev => [...prev, payload.new])
      }
    })

    // Cleanup
    return () => {
      if (channel) {
        channel.unsubscribe()
      }
    }
  }, [gameId, playerId])

  const getTypeStyle = (type) => {
    const styles = {
      info: 'bg-blue-900 border-blue-700 text-blue-100',
      warning: 'bg-yellow-900 border-yellow-700 text-yellow-100',
      ability: 'bg-purple-900 border-purple-700 text-purple-100',
      death: 'bg-red-900 border-red-700 text-red-100'
    }
    return styles[type] || styles.info
  }

  const getTypeIcon = (type) => {
    const icons = {
      info: '💬',
      warning: '⚠️',
      ability: '✨',
      death: '💀'
    }
    return icons[type] || '💬'
  }

  const getPhaseDisplay = (phase) => {
    if (!phase) return ''
    const isNight = phase.startsWith('night')
    const number = phase.split('-')[1]
    return isNight ? `🌙 Malam ${number}` : `☀️ Siang ${number}`
  }

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blood"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        📬 Informasi dari Storyteller
      </h2>

      {information.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p className="text-4xl mb-2">📭</p>
          <p>Belum ada informasi</p>
          <p className="text-sm mt-1">
            Tunggu instruksi dari Storyteller
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {information.map((info) => (
            <div
              key={info.id}
              className={`p-4 rounded-lg border-2 ${getTypeStyle(info.type)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getTypeIcon(info.type)}</span>
                  <span className="text-xs font-medium opacity-70">
                    {getPhaseDisplay(info.phase)}
                  </span>
                </div>
                <span className="text-xs opacity-50">
                  {new Date(info.createdAt).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <p className="text-sm leading-relaxed">{info.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Unread indicator */}
      {information.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700 text-center">
          <p className="text-xs text-gray-500">
            Total {information.length} informasi diterima
          </p>
        </div>
      )}
    </div>
  )
}
