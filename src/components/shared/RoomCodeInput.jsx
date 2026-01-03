'use client'

import { formatRoomCode } from '@/lib/roomCode'

export default function RoomCodeInput({ value, onChange, ...props }) {
  const handleChange = (e) => {
    const formatted = formatRoomCode(e.target.value)
    onChange(formatted)
  }

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-townsfolk focus:border-transparent outline-none transition text-center text-2xl font-mono tracking-widest uppercase"
      placeholder="ABC123"
      maxLength={6}
      {...props}
    />
  )
}
