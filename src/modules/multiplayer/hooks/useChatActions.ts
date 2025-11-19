/**
 * Chat actions hook
 */

'use client'

import { useCallback } from 'react'
import { useMultiplayerStore } from './useMultiplayerStore'

export function useChatActions() {
  const { addChatMessage, clearChatMessages } = useMultiplayerStore()

  const sendMessage = useCallback(
    (playerId: string, username: string, message: string) => {
      addChatMessage({
        playerId,
        username,
        message: message.trim(),
      })
    },
    [addChatMessage]
  )

  const clearMessages = useCallback(() => {
    clearChatMessages()
  }, [clearChatMessages])

  return {
    sendMessage,
    clearMessages,
  }
}
