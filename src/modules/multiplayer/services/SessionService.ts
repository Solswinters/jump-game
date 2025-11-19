/**
 * Game session management service
 */

import type { GameSession } from '../types'

export class SessionService {
  private sessions = new Map<string, GameSession>()

  /**
   * Create session
   */
  createSession(roomId: string, mode: string): GameSession {
    const session: GameSession = {
      id: `session-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      roomId,
      mode,
      startTime: Date.now(),
    }

    this.sessions.set(session.id, session)
    return session
  }

  /**
   * End session
   */
  endSession(sessionId: string, winner?: string): void {
    const session = this.sessions.get(sessionId)
    if (session) {
      session.endTime = Date.now()
      session.winner = winner
    }
  }

  /**
   * Get session
   */
  getSession(sessionId: string): GameSession | undefined {
    return this.sessions.get(sessionId)
  }

  /**
   * Get active sessions
   */
  getActiveSessions(): GameSession[] {
    return Array.from(this.sessions.values()).filter(s => !s.endTime)
  }

  /**
   * Get session duration
   */
  getSessionDuration(sessionId: string): number {
    const session = this.sessions.get(sessionId)
    if (!session) return 0

    const endTime = session.endTime ?? Date.now()
    return endTime - session.startTime
  }

  /**
   * Clear old sessions
   */
  clearOldSessions(olderThan: number): void {
    const cutoff = Date.now() - olderThan
    Array.from(this.sessions.entries()).forEach(([id, session]) => {
      if (session.endTime && session.endTime < cutoff) {
        this.sessions.delete(id)
      }
    })
  }
}
