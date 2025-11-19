/**
 * Multiplayer utility functions
 */

import type { PlayerState, GameStateSnapshot } from '../types'

/**
 * Calculate distance between two players
 */
export function calculateDistance(player1: PlayerState, player2: PlayerState): number {
  const dx = player1.position.x - player2.position.x
  const dy = player1.position.y - player2.position.y
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Check if player is within range
 */
export function isPlayerInRange(
  player1: PlayerState,
  player2: PlayerState,
  range: number
): boolean {
  return calculateDistance(player1, player2) <= range
}

/**
 * Get alive players from snapshot
 */
export function getAlivePlayers(snapshot: GameStateSnapshot): PlayerState[] {
  return Object.values(snapshot.players).filter(p => p.isAlive)
}

/**
 * Get leading player from snapshot
 */
export function getLeadingPlayer(snapshot: GameStateSnapshot): PlayerState | null {
  const players = Object.values(snapshot.players)
  if (players.length === 0) return null

  return players.reduce((leader, player) => (player.score > leader.score ? player : leader))
}

/**
 * Format duration in seconds to MM:SS
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * Generate room code (6 characters)
 */
export function generateRoomCode(roomId: string): string {
  return roomId.slice(-6).toUpperCase()
}

/**
 * Validate username
 */
export function validateUsername(username: string): {
  valid: boolean
  error?: string
} {
  if (!username || username.trim().length === 0) {
    return { valid: false, error: 'Username is required' }
  }

  if (username.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' }
  }

  if (username.length > 20) {
    return { valid: false, error: 'Username must be 20 characters or less' }
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return {
      valid: false,
      error: 'Username can only contain letters, numbers, hyphens, and underscores',
    }
  }

  return { valid: true }
}

/**
 * Get skill rating tier
 */
export function getSkillTier(rating: number): {
  tier: string
  color: string
} {
  if (rating >= 2000) return { tier: 'Master', color: '#FF6B6B' }
  if (rating >= 1500) return { tier: 'Diamond', color: '#4ECDC4' }
  if (rating >= 1000) return { tier: 'Gold', color: '#FFD93D' }
  if (rating >= 500) return { tier: 'Silver', color: '#C0C0C0' }
  return { tier: 'Bronze', color: '#CD7F32' }
}

/**
 * Calculate win rate
 */
export function calculateWinRate(wins: number, losses: number): number {
  const total = wins + losses
  if (total === 0) return 0
  return Math.round((wins / total) * 100)
}

/**
 * Interpolate between two values
 */
export function lerp(start: number, end: number, alpha: number): number {
  return start + (end - start) * alpha
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Generate unique session ID
 */
export function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

/**
 * Check if session is active
 */
export function isSessionActive(startTime: number, endTime?: number): boolean {
  if (endTime) return false
  const now = Date.now()
  const sessionDuration = now - startTime
  // Consider session active if less than 2 hours old
  return sessionDuration < 7200000
}
