/**
 * Security utilities
 */

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}

export function validateRoomCode(code: string): boolean {
  return /^[A-Z0-9]{6}$/.test(code)
}

export function validateUsername(username: string): boolean {
  return /^[a-zA-Z0-9_-]{2,20}$/.test(username)
}

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

export function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return hash
}

export function verifyMessageIntegrity(message: string, checksum: number): boolean {
  return hashString(message) === checksum
}

export function maskSensitiveData(data: string, visibleChars = 4): string {
  if (data.length <= visibleChars) return '*'.repeat(data.length)
  return data.substring(0, visibleChars) + '*'.repeat(data.length - visibleChars)
}

export function detectSpam(messages: string[], timeWindow = 10000, threshold = 5): boolean {
  if (messages.length < threshold) return false

  const recent = messages.slice(-threshold)
  const timestamps = recent.map(() => Date.now())

  const span = Math.max(...timestamps) - Math.min(...timestamps)
  return span < timeWindow
}

export function filterProfanity(text: string): string {
  // Simple word list - in production, use a proper profanity filter
  const badWords = ['badword1', 'badword2']
  let filtered = text

  badWords.forEach(word => {
    const regex = new RegExp(word, 'gi')
    filtered = filtered.replace(regex, '*'.repeat(word.length))
  })

  return filtered
}
