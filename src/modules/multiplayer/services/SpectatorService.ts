/**
 * Spectator management service
 */

import type { SpectatorInfo } from '../types'

export class SpectatorService {
  private spectators = new Map<string, SpectatorInfo[]>()

  /**
   * Add spectator to room
   */
  addSpectator(roomId: string, playerId: string, username: string): void {
    if (!this.spectators.has(roomId)) {
      this.spectators.set(roomId, [])
    }

    const spectators = this.spectators.get(roomId)!
    if (!spectators.find(s => s.playerId === playerId)) {
      spectators.push({
        playerId,
        username,
        joinedAt: Date.now(),
      })
    }
  }

  /**
   * Remove spectator from room
   */
  removeSpectator(roomId: string, playerId: string): void {
    const spectators = this.spectators.get(roomId)
    if (spectators) {
      const filtered = spectators.filter(s => s.playerId !== playerId)
      this.spectators.set(roomId, filtered)
    }
  }

  /**
   * Get spectators in room
   */
  getSpectators(roomId: string): SpectatorInfo[] {
    return this.spectators.get(roomId) ?? []
  }

  /**
   * Get spectator count
   */
  getSpectatorCount(roomId: string): number {
    return this.getSpectators(roomId).length
  }

  /**
   * Clear room spectators
   */
  clearRoom(roomId: string): void {
    this.spectators.delete(roomId)
  }
}
