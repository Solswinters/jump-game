/**
 * Input sanitization utilities
 */

/**
 * sanitizeString utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of sanitizeString.
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
}

/**
 * sanitizeHTML utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of sanitizeHTML.
 */
export function sanitizeHTML(html: string): string {
  const div = document.createElement('div')
  div.textContent = html
  return div.innerHTML
}

/**
 * sanitizeURL utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of sanitizeURL.
 */
export function sanitizeURL(url: string): string {
  try {
    const parsed = new URL(url)

    // Only allow http and https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('Invalid protocol')
    }

    return parsed.toString()
  } catch {
    return ''
  }
}

/**
 * sanitizeAddress utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of sanitizeAddress.
 */
export function sanitizeAddress(address: string): string {
  // Ethereum address validation
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    throw new Error('Invalid Ethereum address')
  }
  return address.toLowerCase()
}

/**
 * sanitizeNumber utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of sanitizeNumber.
 */
export function sanitizeNumber(
  input: string | number,
  options?: {
    min?: number
    max?: number
    integer?: boolean
  }
): number {
  const num = typeof input === 'string' ? parseFloat(input) : input

  if (isNaN(num) || !isFinite(num)) {
    throw new Error('Invalid number')
  }

  if (options?.integer && !Number.isInteger(num)) {
    throw new Error('Must be an integer')
  }

  if (options?.min !== undefined && num < options.min) {
    throw new Error(`Must be at least ${options.min}`)
  }

  if (options?.max !== undefined && num > options.max) {
    throw new Error(`Must be at most ${options.max}`)
  }

  return num
}
