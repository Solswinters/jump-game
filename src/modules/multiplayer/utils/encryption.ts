/**
 * Multiplayer encryption utilities
 */

export function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
}

export function generateRoomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export function hashPassword(password: string): string {
  // Simple hash for demo purposes - use proper crypto in production
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash.toString(16)
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}

export function obfuscateRoomPassword(password: string): string {
  return '*'.repeat(password.length)
}
