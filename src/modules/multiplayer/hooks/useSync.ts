/**
 * Hook for state synchronization
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { SyncService, type GameStateSnapshot } from '../services/SyncService'
import { useWebSocket } from './useWebSocket'

// Singleton service
const syncService = new SyncService()

export function useSync() {
  const { send, on } = useWebSocket()
  const [latestSnapshot, setLatestSnapshot] = useState<GameStateSnapshot | null>(null)
  const [interpolatedState, setInterpolatedState] = useState<GameStateSnapshot | null>(null)
  const animationFrameRef = useRef<number>()

  // Listen for state updates
  useEffect(() => {
    const unsubscribe = on('game_state_update', event => {
      const snapshot = event.data as GameStateSnapshot
      setLatestSnapshot(snapshot)
    })

    return unsubscribe
  }, [on])

  // Interpolation loop
  useEffect(() => {
    const updateInterpolation = () => {
      const state = syncService.getInterpolatedState(Date.now())
      setInterpolatedState(state)
      animationFrameRef.current = requestAnimationFrame(updateInterpolation)
    }

    animationFrameRef.current = requestAnimationFrame(updateInterpolation)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  const sendInput = useCallback(
    (input: unknown) => {
      const tick = syncService.getCurrentTick()
      syncService.addPendingInput(tick, input)
      send('player_input', { tick, input })
    },
    [send]
  )

  return {
    latestSnapshot,
    interpolatedState,
    currentTick: syncService.getCurrentTick(),
    sendInput,
  }
}
