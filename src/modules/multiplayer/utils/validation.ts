/**
 * Multiplayer validation utilities
 */

export function isValidRoomName(name: string): boolean {
  return name.length >= 3 && name.length <= 50 && /^[a-zA-Z0-9\s-]+$/.test(name)
}

export function isValidPlayerName(name: string): boolean {
  return name.length >= 2 && name.length <= 20 && /^[a-zA-Z0-9_-]+$/.test(name)
}

export function isValidMessage(message: string): boolean {
  return message.length > 0 && message.length <= 500
}

export function isValidRoomCapacity(capacity: number): boolean {
  return capacity >= 2 && capacity <= 10 && Number.isInteger(capacity)
}

export function isValidRoomPassword(password: string | null): boolean {
  if (password === null) return true
  return password.length >= 4 && password.length <= 50
}

export function isValidEmote(type: string): boolean {
  const validEmotes = ['happy', 'fire', 'thumbs_up', 'cry', 'heart', 'laugh', 'cool', 'thinking']
  return validEmotes.includes(type)
}

export function sanitizeMessage(message: string): string {
  return message.trim().slice(0, 500)
}

export function sanitizeRoomName(name: string): string {
  return name
    .trim()
    .slice(0, 50)
    .replace(/[^a-zA-Z0-9\s-]/g, '')
}

export function sanitizePlayerName(name: string): string {
  return name
    .trim()
    .slice(0, 20)
    .replace(/[^a-zA-Z0-9_-]/g, '')
}
