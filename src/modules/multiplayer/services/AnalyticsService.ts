/**
 * Multiplayer analytics service
 */

interface AnalyticsEvent {
  type: string
  data: Record<string, unknown>
  timestamp: number
}

export class AnalyticsService {
  private events: AnalyticsEvent[] = []
  private readonly maxEvents = 1000

  /**
   * Track event
   */
  trackEvent(type: string, data: Record<string, unknown>): void {
    this.events.push({
      type,
      data,
      timestamp: Date.now(),
    })

    // Keep only last N events
    if (this.events.length > this.maxEvents) {
      this.events.shift()
    }
  }

  /**
   * Track room creation
   */
  trackRoomCreate(roomId: string, mode: string): void {
    this.trackEvent('room_create', { roomId, mode })
  }

  /**
   * Track room join
   */
  trackRoomJoin(roomId: string, playerId: string): void {
    this.trackEvent('room_join', { roomId, playerId })
  }

  /**
   * Track game start
   */
  trackGameStart(sessionId: string, playerCount: number): void {
    this.trackEvent('game_start', { sessionId, playerCount })
  }

  /**
   * Track game end
   */
  trackGameEnd(sessionId: string, duration: number, winner?: string): void {
    this.trackEvent('game_end', { sessionId, duration, winner })
  }

  /**
   * Track matchmaking
   */
  trackMatchmaking(playerId: string, queueTime: number): void {
    this.trackEvent('matchmaking', { playerId, queueTime })
  }

  /**
   * Get events
   */
  getEvents(type?: string): AnalyticsEvent[] {
    if (type) {
      return this.events.filter(e => e.type === type)
    }
    return [...this.events]
  }

  /**
   * Get event count
   */
  getEventCount(type: string): number {
    return this.events.filter(e => e.type === type).length
  }

  /**
   * Clear events
   */
  clear(): void {
    this.events = []
  }
}
