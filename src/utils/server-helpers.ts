// Server-side utility helpers

/**
 * Generate unique room ID
 */
export function generateRoomId(): string {
  return `room-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Generate unique session ID
 */
export function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
}

/**
 * Validate room name
 */
export function isValidRoomName(name: string): boolean {
  return name.length >= 3 && name.length <= 50 && /^[a-zA-Z0-9\s-_]+$/.test(name)
}

/**
 * Validate player name
 */
export function isValidPlayerName(name: string): boolean {
  return name.length >= 2 && name.length <= 30 && /^[a-zA-Z0-9\s-_]+$/.test(name)
}

/**
 * Calculate distance between two points
 */
export function calculateDistance(
  p1: { x: number; y: number },
  p2: { x: number; y: number }
): number {
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Check if two rectangles collide
 */
export function checkCollision(
  rect1: { x: number; y: number; width: number; height: number },
  rect2: { x: number; y: number; width: number; height: number }
): boolean {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  )
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 500) // Limit length
}

/**
 * Format duration in milliseconds to readable string
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor((ms / 1000) % 60)
  const minutes = Math.floor((ms / (1000 * 60)) % 60)
  const hours = Math.floor(ms / (1000 * 60 * 60))

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  }
  return `${seconds}s`
}

/**
 * Calculate average
 */
export function calculateAverage(numbers: number[]): number {
  if (numbers.length === 0) {return 0}
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length
}

/**
 * Get percentile
 */
export function getPercentile(values: number[], percentile: number): number {
  if (values.length === 0) {return 0}

  const sorted = [...values].sort((a, b) => a - b)
  const index = Math.ceil((percentile / 100) * sorted.length) - 1
  return sorted[index] ?? 0
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Generate random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Shuffle array
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!]
  }
  return shuffled
}

/**
 * Sleep/delay helper
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Convert timestamp to ISO string
 */
export function timestampToISO(timestamp: number): string {
  return new Date(timestamp).toISOString()
}

/**
 * Check if timestamp is expired
 */
export function isExpired(timestamp: number, maxAge: number): boolean {
  return Date.now() - timestamp > maxAge
}

/**
 * Get client IP from request
 */
export function getClientIP(headers: { get: (name: string) => string | null }): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headers.get('x-real-ip') ??
    headers.get('cf-connecting-ip') ??
    'unknown'
  )
}

/**
 * Parse user agent string
 */
export function parseUserAgent(userAgent: string | null): {
  browser?: string
  os?: string
  device?: string
} {
  if (!userAgent) {return {}}

  const result: { browser?: string; os?: string; device?: string } = {}

  // Browser
  if (userAgent.includes('Chrome')) {result.browser = 'Chrome'}
  else if (userAgent.includes('Firefox')) {result.browser = 'Firefox'}
  else if (userAgent.includes('Safari')) {result.browser = 'Safari'}
  else if (userAgent.includes('Edge')) {result.browser = 'Edge'}

  // OS
  if (userAgent.includes('Windows')) {result.os = 'Windows'}
  else if (userAgent.includes('Mac')) {result.os = 'macOS'}
  else if (userAgent.includes('Linux')) {result.os = 'Linux'}
  else if (userAgent.includes('Android')) {result.os = 'Android'}
  else if (userAgent.includes('iOS')) {result.os = 'iOS'}

  // Device
  if (userAgent.includes('Mobile')) {result.device = 'Mobile'}
  else if (userAgent.includes('Tablet')) {result.device = 'Tablet'}
  else {result.device = 'Desktop'}

  return result
}
