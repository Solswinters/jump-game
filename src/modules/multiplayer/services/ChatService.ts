/**
 * Real-time chat service
 */

export interface ChatMessage {
  id: string
  playerId: string
  username: string
  message: string
  timestamp: number
  type: ChatMessageType
}

export type ChatMessageType = 'text' | 'system' | 'emote'

export interface ChatChannel {
  id: string
  name: string
  type: 'room' | 'global' | 'team' | 'private'
  participants: string[]
}

export class ChatService {
  private messages = new Map<string, ChatMessage[]>()
  private channels = new Map<string, ChatChannel>()
  private maxMessagesPerChannel = 100

  /**
   * Add message to channel
   */
  addMessage(channelId: string, message: Omit<ChatMessage, 'id'>): ChatMessage {
    const fullMessage: ChatMessage = {
      ...message,
      id: this.generateMessageId(),
    }

    if (!this.messages.has(channelId)) {
      this.messages.set(channelId, [])
    }

    const channelMessages = this.messages.get(channelId)!
    channelMessages.push(fullMessage)

    // Keep only last N messages
    if (channelMessages.length > this.maxMessagesPerChannel) {
      channelMessages.shift()
    }

    return fullMessage
  }

  /**
   * Get messages for channel
   */
  getMessages(channelId: string, limit = 50): ChatMessage[] {
    const messages = this.messages.get(channelId) ?? []
    return messages.slice(-limit)
  }

  /**
   * Clear messages in channel
   */
  clearMessages(channelId: string): void {
    this.messages.set(channelId, [])
  }

  /**
   * Create channel
   */
  createChannel(channel: ChatChannel): void {
    this.channels.set(channel.id, channel)
    this.messages.set(channel.id, [])
  }

  /**
   * Get channel
   */
  getChannel(channelId: string): ChatChannel | undefined {
    return this.channels.get(channelId)
  }

  /**
   * Get all channels for player
   */
  getPlayerChannels(playerId: string): ChatChannel[] {
    return Array.from(this.channels.values()).filter(channel =>
      channel.participants.includes(playerId)
    )
  }

  /**
   * Join channel
   */
  joinChannel(channelId: string, playerId: string): void {
    const channel = this.channels.get(channelId)
    if (channel && !channel.participants.includes(playerId)) {
      channel.participants.push(playerId)
    }
  }

  /**
   * Leave channel
   */
  leaveChannel(channelId: string, playerId: string): void {
    const channel = this.channels.get(channelId)
    if (channel) {
      channel.participants = channel.participants.filter(id => id !== playerId)
    }
  }

  /**
   * Filter profanity (basic implementation)
   */
  filterProfanity(text: string): string {
    const profanityList = ['badword1', 'badword2'] // Add actual words
    let filtered = text

    profanityList.forEach(word => {
      const regex = new RegExp(word, 'gi')
      filtered = filtered.replace(regex, '*'.repeat(word.length))
    })

    return filtered
  }

  /**
   * Validate message
   */
  validateMessage(message: string): { valid: boolean; error?: string } {
    if (!message || message.trim().length === 0) {
      return { valid: false, error: 'Message cannot be empty' }
    }

    if (message.length > 500) {
      return { valid: false, error: 'Message too long' }
    }

    return { valid: true }
  }

  /**
   * Generate unique message ID
   */
  private generateMessageId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  }
}
