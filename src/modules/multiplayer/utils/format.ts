/**
 * Formatting utilities for multiplayer
 */

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`
}

export function formatPlayerCount(current: number, max: number): string {
  return `${current}/${max}`
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp)
  const hours = date.getHours()
  const minutes = date.getMinutes()
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

export function formatRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  if (seconds > 5) return `${seconds}s ago`
  return 'just now'
}

export function formatScore(score: number): string {
  return score.toLocaleString()
}

export function formatRank(rank: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd']
  const v = rank % 100
  return rank + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0])
}

export function formatRoomCode(code: string): string {
  return code
    .toUpperCase()
    .replace(/(.{3})/g, '$1 ')
    .trim()
}

export function truncateUsername(username: string, maxLength = 20): string {
  if (username.length <= maxLength) return username
  return username.substring(0, maxLength - 3) + '...'
}
