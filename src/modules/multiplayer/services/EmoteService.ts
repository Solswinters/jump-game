/**
 * Emote/reaction service
 */

export interface Emote {
  id: string
  type: string
  emoji: string
  playerId: string
  username: string
  timestamp: number
}

export class EmoteService {
  private emotes: Emote[] = []
  private readonly maxEmotes = 50

  /**
   * Send emote
   */
  sendEmote(playerId: string, username: string, type: string, emoji: string): Emote {
    const emote: Emote = {
      id: `emote-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type,
      emoji,
      playerId,
      username,
      timestamp: Date.now(),
    }

    this.emotes.push(emote)

    // Keep only last N emotes
    if (this.emotes.length > this.maxEmotes) {
      this.emotes.shift()
    }

    return emote
  }

  /**
   * Get recent emotes
   */
  getRecentEmotes(limit = 10): Emote[] {
    return this.emotes.slice(-limit)
  }

  /**
   * Clear old emotes
   */
  clearOldEmotes(olderThan: number): void {
    const now = Date.now()
    this.emotes = this.emotes.filter(e => now - e.timestamp < olderThan)
  }
}
