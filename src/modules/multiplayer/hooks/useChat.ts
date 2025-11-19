/**
 * Hook for chat functionality
 */

import { useState, useCallback, useEffect } from 'react'
import { ChatService, type ChatMessage, type ChatChannel } from '../services/ChatService'
import { useWebSocket } from './useWebSocket'

// Singleton service
const chatService = new ChatService()

export function useChat(channelId: string) {
  const { send, on } = useWebSocket()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)

  // Load initial messages
  useEffect(() => {
    const initialMessages = chatService.getMessages(channelId)
    setMessages(initialMessages)
  }, [channelId])

  // Listen for new messages
  useEffect(() => {
    const unsubscribe = on('chat_message', event => {
      const message = event.data as ChatMessage & { channelId: string }
      if (message.channelId === channelId) {
        const newMessage = chatService.addMessage(channelId, message)
        setMessages(prev => [...prev, newMessage])
      }
    })

    return unsubscribe
  }, [channelId, on])

  const sendMessage = useCallback(
    (playerId: string, username: string, message: string) => {
      const validation = chatService.validateMessage(message)
      if (!validation.valid) {
        throw new Error(validation.error)
      }

      const filtered = chatService.filterProfanity(message)

      send('send_message', {
        channelId,
        playerId,
        username,
        message: filtered,
        type: 'text',
      })
    },
    [channelId, send]
  )

  const clearMessages = useCallback(() => {
    chatService.clearMessages(channelId)
    setMessages([])
  }, [channelId])

  return {
    messages,
    isTyping,
    sendMessage,
    clearMessages,
  }
}
