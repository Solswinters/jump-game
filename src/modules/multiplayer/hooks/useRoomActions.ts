/**
 * Room actions hook
 */

'use client'

import { useCallback } from 'react'
import { useMultiplayerStore } from './useMultiplayerStore'

export function useRoomActions() {
  const { setCurrentRoom, addPlayer, removePlayer, updatePlayer } = useMultiplayerStore()

  const joinRoom = useCallback(
    (room: {
      id: string
      name: string
      host: string
      maxPlayers: number
      currentPlayers: number
      isPrivate: boolean
      createdAt: number
    }) => {
      setCurrentRoom(room)
    },
    [setCurrentRoom]
  )

  const leaveRoom = useCallback(() => {
    setCurrentRoom(null)
  }, [setCurrentRoom])

  const addPlayerToRoom = useCallback(
    (player: { id: string; name: string; score: number; isReady: boolean; joinedAt: number }) => {
      addPlayer(player)
    },
    [addPlayer]
  )

  const removePlayerFromRoom = useCallback(
    (playerId: string) => {
      removePlayer(playerId)
    },
    [removePlayer]
  )

  const togglePlayerReady = useCallback(
    (playerId: string, isReady: boolean) => {
      updatePlayer(playerId, { isReady })
    },
    [updatePlayer]
  )

  const updatePlayerScore = useCallback(
    (playerId: string, score: number) => {
      updatePlayer(playerId, { score })
    },
    [updatePlayer]
  )

  return {
    joinRoom,
    leaveRoom,
    addPlayerToRoom,
    removePlayerFromRoom,
    togglePlayerReady,
    updatePlayerScore,
  }
}
