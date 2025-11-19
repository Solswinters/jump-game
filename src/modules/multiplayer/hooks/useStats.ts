/**
 * Hook for player statistics
 */

import { useState, useEffect, useCallback } from 'react'
import { StatsService } from '../services/StatsService'
import { useWebSocket } from './useWebSocket'
import type { MultiplayerStats } from '../types'

// Singleton service
const statsService = new StatsService()

export function useStats(playerId: string) {
  const { send, on } = useWebSocket()
  const [stats, setStats] = useState<MultiplayerStats | null>(null)

  // Listen for stats updates
  useEffect(() => {
    const unsubscribe = on('stats_update', event => {
      const data = event.data as { playerId: string; stats: MultiplayerStats }
      if (data.playerId === playerId) {
        setStats(data.stats)
      }
    })

    return unsubscribe
  }, [on, playerId])

  const fetchStats = useCallback(() => {
    send('get_stats', { playerId })
  }, [playerId, send])

  const recordGame = useCallback(
    (result: 'win' | 'loss' | 'draw', score: number, playTime: number) => {
      statsService.recordGame(playerId, result, score, playTime)
      send('record_game', { playerId, result, score, playTime })
    },
    [playerId, send]
  )

  return {
    stats,
    fetchStats,
    recordGame,
  }
}
