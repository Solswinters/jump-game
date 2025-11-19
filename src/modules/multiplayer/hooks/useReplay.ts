/**
 * Hook for replay system
 */

import { useState, useCallback } from 'react'
import { ReplayService } from '../services/ReplayService'
import type { ReplayData, GameStateSnapshot } from '../types'

// Singleton service
const replayService = new ReplayService()

export function useReplay() {
  const [currentReplay, setCurrentReplay] = useState<ReplayData | null>(null)
  const [playbackTime, setPlaybackTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const loadReplay = useCallback((sessionId: string) => {
    const replay = replayService.getReplay(sessionId)
    setCurrentReplay(replay ?? null)
    setPlaybackTime(0)
    setIsPlaying(false)
  }, [])

  const play = useCallback(() => {
    setIsPlaying(true)
  }, [])

  const pause = useCallback(() => {
    setIsPlaying(false)
  }, [])

  const seek = useCallback((time: number) => {
    setPlaybackTime(time)
  }, [])

  const getSnapshotAtCurrentTime = useCallback((): GameStateSnapshot | null => {
    if (!currentReplay) return null
    return replayService.getSnapshotAtTime(currentReplay.sessionId, playbackTime)
  }, [currentReplay, playbackTime])

  const getAllReplays = useCallback(() => {
    return replayService.getAllReplays()
  }, [])

  const deleteReplay = useCallback(
    (sessionId: string) => {
      replayService.deleteReplay(sessionId)
      if (currentReplay?.sessionId === sessionId) {
        setCurrentReplay(null)
      }
    },
    [currentReplay]
  )

  return {
    currentReplay,
    playbackTime,
    isPlaying,
    loadReplay,
    play,
    pause,
    seek,
    getSnapshotAtCurrentTime,
    getAllReplays,
    deleteReplay,
  }
}
