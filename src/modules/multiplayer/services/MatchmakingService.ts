/**
 * Matchmaking service
 */

export interface PlayerMatchProfile {
  playerId: string
  username: string
  skillRating: number
  region: string
  preferredMode: string
  queueTime: number
}

export interface Match {
  id: string
  players: PlayerMatchProfile[]
  averageRating: number
  createdAt: number
}

export class MatchmakingService {
  private queue: PlayerMatchProfile[] = []
  private matches: Match[] = []
  private readonly maxRatingDifference = 200
  private readonly minPlayers = 2
  private readonly maxPlayers = 4
  private readonly maxQueueTime = 60000 // 1 minute

  /**
   * Add player to matchmaking queue
   */
  joinQueue(player: Omit<PlayerMatchProfile, 'queueTime'>): void {
    // Check if already in queue
    if (this.queue.some(p => p.playerId === player.playerId)) {
      return
    }

    this.queue.push({
      ...player,
      queueTime: Date.now(),
    })
  }

  /**
   * Remove player from queue
   */
  leaveQueue(playerId: string): void {
    this.queue = this.queue.filter(p => p.playerId !== playerId)
  }

  /**
   * Find matches for players in queue
   */
  findMatches(): Match[] {
    const newMatches: Match[] = []

    // Sort queue by queue time (priority to longer waits)
    const sortedQueue = [...this.queue].sort((a, b) => a.queueTime - b.queueTime)

    while (sortedQueue.length >= this.minPlayers) {
      const anchor = sortedQueue[0]
      const compatible: PlayerMatchProfile[] = [anchor]

      // Find compatible players
      for (let i = 1; i < sortedQueue.length && compatible.length < this.maxPlayers; i++) {
        const candidate = sortedQueue[i]

        if (this.isCompatible(anchor, candidate)) {
          compatible.push(candidate)
          sortedQueue.splice(i, 1)
          i--
        }
      }

      // Create match if we have enough players
      if (compatible.length >= this.minPlayers) {
        const match = this.createMatch(compatible)
        newMatches.push(match)

        // Remove matched players from queue
        compatible.forEach(p => this.leaveQueue(p.playerId))
      } else {
        // Remove anchor from consideration
        sortedQueue.shift()
      }
    }

    this.matches.push(...newMatches)
    return newMatches
  }

  /**
   * Check if two players are compatible
   */
  private isCompatible(player1: PlayerMatchProfile, player2: PlayerMatchProfile): boolean {
    // Check rating difference
    const ratingDiff = Math.abs(player1.skillRating - player2.skillRating)
    if (ratingDiff > this.maxRatingDifference) {
      // Allow larger differences for players waiting longer
      const waitTime = Math.max(Date.now() - player1.queueTime, Date.now() - player2.queueTime)
      const adjustedMax = this.maxRatingDifference + Math.floor(waitTime / 10000) * 50
      if (ratingDiff > adjustedMax) {
        return false
      }
    }

    // Check region
    if (player1.region !== player2.region) {
      // Allow cross-region after long wait
      const waitTime = Date.now() - player1.queueTime
      if (waitTime < 30000) {
        return false
      }
    }

    // Check game mode preference
    if (player1.preferredMode !== player2.preferredMode) {
      return false
    }

    return true
  }

  /**
   * Create match from players
   */
  private createMatch(players: PlayerMatchProfile[]): Match {
    const averageRating = players.reduce((sum, p) => sum + p.skillRating, 0) / players.length

    return {
      id: `match-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      players,
      averageRating,
      createdAt: Date.now(),
    }
  }

  /**
   * Get queue position for player
   */
  getQueuePosition(playerId: string): number {
    return this.queue.findIndex(p => p.playerId === playerId) + 1
  }

  /**
   * Get estimated wait time
   */
  getEstimatedWaitTime(playerId: string): number {
    const position = this.getQueuePosition(playerId)
    if (position === 0) return 0

    // Rough estimate: 10 seconds per position ahead
    return position * 10
  }

  /**
   * Get queue status
   */
  getQueueStatus() {
    return {
      queueLength: this.queue.length,
      averageWaitTime: this.getAverageWaitTime(),
      matchesCreated: this.matches.length,
    }
  }

  /**
   * Get average wait time
   */
  private getAverageWaitTime(): number {
    if (this.queue.length === 0) return 0

    const now = Date.now()
    const totalWait = this.queue.reduce((sum, p) => sum + (now - p.queueTime), 0)
    return Math.round(totalWait / this.queue.length / 1000) // in seconds
  }

  /**
   * Clear old matches
   */
  clearOldMatches(beforeTimestamp: number): void {
    this.matches = this.matches.filter(m => m.createdAt >= beforeTimestamp)
  }
}
