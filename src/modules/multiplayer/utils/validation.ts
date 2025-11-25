/**
 * Multiplayer validation utilities
 */

/**
 * isValidRoomName utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isValidRoomName.
 */
export function isValidRoomName(name: string): boolean {
  return name.length >= 3 && name.length <= 50 && /^[a-zA-Z0-9\s-]+$/.test(name)
}

/**
 * isValidPlayerName utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isValidPlayerName.
 */
export function isValidPlayerName(name: string): boolean {
  return name.length >= 2 && name.length <= 20 && /^[a-zA-Z0-9_-]+$/.test(name)
}

/**
 * isValidMessage utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isValidMessage.
 */
export function isValidMessage(message: string): boolean {
  return message.length > 0 && message.length <= 500
}

/**
 * isValidRoomCapacity utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isValidRoomCapacity.
 */
export function isValidRoomCapacity(capacity: number): boolean {
  return capacity >= 2 && capacity <= 10 && Number.isInteger(capacity)
}

/**
 * isValidRoomPassword utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isValidRoomPassword.
 */
export function isValidRoomPassword(password: string | null): boolean {
  if (password === null) return true
  return password.length >= 4 && password.length <= 50
}

/**
 * isValidEmote utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isValidEmote.
 */
export function isValidEmote(type: string): boolean {
  const validEmotes = ['happy', 'fire', 'thumbs_up', 'cry', 'heart', 'laugh', 'cool', 'thinking']
  return validEmotes.includes(type)
}

/**
 * sanitizeMessage utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of sanitizeMessage.
 */
export function sanitizeMessage(message: string): string {
  return message.trim().slice(0, 500)
}

/**
 * sanitizeRoomName utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of sanitizeRoomName.
 */
export function sanitizeRoomName(name: string): string {
  return name
    .trim()
    .slice(0, 50)
    .replace(/[^a-zA-Z0-9\s-]/g, '')
}

/**
 * sanitizePlayerName utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of sanitizePlayerName.
 */
export function sanitizePlayerName(name: string): string {
  return name
    .trim()
    .slice(0, 20)
    .replace(/[^a-zA-Z0-9_-]/g, '')
}
