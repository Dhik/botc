import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create Supabase client only if credentials are provided
export const supabase = (supabaseUrl && supabaseAnonKey && supabaseAnonKey.length > 0)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Check if real-time is available
export const isRealtimeAvailable = () => {
  if (!supabase) {
    console.warn('⚠️ Supabase not configured. Real-time features disabled. Add NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local')
    return false
  }
  return true
}

// Real-time subscription helpers (with fallback)
export const subscribeToGame = (gameId, callback) => {
  if (!supabase) return null

  return supabase
    .channel(`game:${gameId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'Game', filter: `id=eq.${gameId}` },
      callback
    )
    .subscribe()
}

export const subscribeToPlayers = (gameId, callback) => {
  if (!supabase) return null

  return supabase
    .channel(`players:${gameId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'Player', filter: `gameId=eq.${gameId}` },
      callback
    )
    .subscribe()
}

export const subscribeToVotes = (sessionId, callback) => {
  if (!supabase) return null

  return supabase
    .channel(`votes:${sessionId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'Vote', filter: `votingSessionId=eq.${sessionId}` },
      callback
    )
    .subscribe()
}

export const subscribeToInformation = (playerId, callback) => {
  if (!supabase) return null

  return supabase
    .channel(`info:${playerId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'Information', filter: `playerId=eq.${playerId}` },
      callback
    )
    .subscribe()
}
