/**
 * Chat actions hook
 */

'use client'

import { useCallback } from 'react'
import { useMultiplayerStore } from './useMultiplayerStore'

/**
 * useChatActions utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of useChatActions.
 */
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
