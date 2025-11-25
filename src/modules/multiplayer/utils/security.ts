/**
 * Security utilities
 */

/**
 * sanitizeInput utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of sanitizeInput.
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}

/**
 * validateRoomCode utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of validateRoomCode.
 */
export function validateRoomCode(code: string): boolean {
  return /^[A-Z0-9]{6}$/.test(code)
}

/**
 * validateUsername utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of validateUsername.
 */
export function validateUsername(username: string): boolean {
  return /^[a-zA-Z0-9_-]{2,20}$/.test(username)
}

/**
 * isRateLimited utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isRateLimited.
 */
export function isRateLimited(
  key: string,
  limit: number,
  window: number,
  cache: Map<string, { count: number; resetAt: number }>
): boolean {
  const now = Date.now()
  const record = cache.get(key)

  if (!record || now >= record.resetAt) {
    cache.set(key, { count: 1, resetAt: now + window })
    return false
  }

  if (record.count >= limit) {
    return true
  }

  record.count++
  return false
}

/**
 * generateNonce utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of generateNonce.
 */
export function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

/**
 * hashString utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of hashString.
 */
export function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return hash
}

/**
 * verifyMessageIntegrity utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of verifyMessageIntegrity.
 */
export function verifyMessageIntegrity(message: string, checksum: number): boolean {
  return hashString(message) === checksum
}

/**
 * maskSensitiveData utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of maskSensitiveData.
 */
export function maskSensitiveData(data: string, visibleChars = 4): string {
  if (data.length <= visibleChars) return '*'.repeat(data.length)
  return data.substring(0, visibleChars) + '*'.repeat(data.length - visibleChars)
}

/**
 * detectSpam utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of detectSpam.
 */
export function detectSpam(messages: string[], timeWindow = 10000, threshold = 5): boolean {
  if (messages.length < threshold) return false

  const recent = messages.slice(-threshold)
  const timestamps = recent.map(() => Date.now())

  const span = Math.max(...timestamps) - Math.min(...timestamps)
  return span < timeWindow
}

/**
 * filterProfanity utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of filterProfanity.
 */
export function filterProfanity(text: string): string {
  // Simple word list - in production, use a proper profanity filter
  const badWords = ['badword1', 'badword2']
  let filtered = text

  badWords.forEach((word) => {
    const regex = new RegExp(word, 'gi')
    filtered = filtered.replace(regex, '*'.repeat(word.length))
  })

  return filtered
}
