/**
 * CSRF protection utilities
 */

/**
 * generateCSRFToken utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of generateCSRFToken.
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * storeCSRFToken utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of storeCSRFToken.
 */
export function storeCSRFToken(token: string) {
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem('csrf_token', token)
  }
}

/**
 * getCSRFToken utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getCSRFToken.
 */
export function getCSRFToken(): string | null {
  if (typeof sessionStorage !== 'undefined') {
    return sessionStorage.getItem('csrf_token')
  }
  return null
}

/**
 * validateCSRFToken utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of validateCSRFToken.
 */
export function validateCSRFToken(token: string): boolean {
  const storedToken = getCSRFToken()
  return storedToken !== null && storedToken === token
}

/**
 * addCSRFHeader utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of addCSRFHeader.
 */
export function addCSRFHeader(headers: Headers) {
  const token = getCSRFToken()
  if (token) {
    headers.set('X-CSRF-Token', token)
  }
  return headers
}
