/**
 * Common validation utilities
 */

export class ValidationUtils {
  static isEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  static isURL(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  static isHex(hex: string): boolean {
    return /^[0-9a-fA-F]+$/.test(hex)
  }

  static isEthereumAddress(address: string): boolean {
    return /^0x[0-9a-fA-F]{40}$/.test(address)
  }

  static isTransactionHash(hash: string): boolean {
    return /^0x[0-9a-fA-F]{64}$/.test(hash)
  }

  static isUUID(uuid: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid)
  }

  static isNumeric(value: string): boolean {
    return /^-?\d+\.?\d*$/.test(value)
  }

  static isAlphanumeric(value: string): boolean {
    return /^[a-zA-Z0-9]+$/.test(value)
  }

  static isStrongPassword(password: string): boolean {
    return (
      password.length >= 8 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^a-zA-Z0-9]/.test(password)
    )
  }

  static isJSON(str: string): boolean {
    try {
      JSON.parse(str)
      return true
    } catch {
      return false
    }
  }

  static isBase64(str: string): boolean {
    try {
      return btoa(atob(str)) === str
    } catch {
      return false
    }
  }

  static isEmpty(value: unknown): boolean {
    if (value === null || value === undefined) {return true}
    if (typeof value === 'string') {return value.trim().length === 0}
    if (Array.isArray(value)) {return value.length === 0}
    if (typeof value === 'object') {return Object.keys(value).length === 0}
    return false
  }

  static isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max
  }

  static matches(value: string, pattern: RegExp): boolean {
    return pattern.test(value)
  }

  static minLength(value: string, min: number): boolean {
    return value.length >= min
  }

  static maxLength(value: string, max: number): boolean {
    return value.length <= max
  }
}
