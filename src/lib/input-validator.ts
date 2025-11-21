/**
 * Input Validator - Comprehensive input validation for security and data integrity
 * HIGH PRIORITY: Security improvements through robust validation
 */

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export interface ValidationRule<T> {
  validate: (value: T) => boolean
  message: string
}

export class InputValidator {
  /**
   * Validate Ethereum address
   */
  static isEthereumAddress(address: string): ValidationResult {
    const errors: string[] = []

    if (!address) {
      errors.push('Address is required')
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      errors.push('Invalid Ethereum address format')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  /**
   * Validate transaction hash
   */
  static isTransactionHash(hash: string): ValidationResult {
    const errors: string[] = []

    if (!hash) {
      errors.push('Transaction hash is required')
    } else if (!/^0x[a-fA-F0-9]{64}$/.test(hash)) {
      errors.push('Invalid transaction hash format')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  /**
   * Validate username
   */
  static isValidUsername(username: string): ValidationResult {
    const errors: string[] = []

    if (!username) {
      errors.push('Username is required')
    } else {
      if (username.length < 3) {
        errors.push('Username must be at least 3 characters')
      }
      if (username.length > 20) {
        errors.push('Username must not exceed 20 characters')
      }
      if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        errors.push('Username can only contain letters, numbers, underscores, and hyphens')
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  /**
   * Validate score
   */
  static isValidScore(score: number): ValidationResult {
    const errors: string[] = []

    if (typeof score !== 'number') {
      errors.push('Score must be a number')
    } else if (score < 0) {
      errors.push('Score cannot be negative')
    } else if (!Number.isFinite(score)) {
      errors.push('Score must be a finite number')
    } else if (score > Number.MAX_SAFE_INTEGER) {
      errors.push('Score exceeds maximum safe integer')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  /**
   * Validate difficulty level
   */
  static isValidDifficulty(
    difficulty: string
  ): difficulty is 'easy' | 'normal' | 'hard' | 'extreme' {
    return ['easy', 'normal', 'hard', 'extreme'].includes(difficulty)
  }

  /**
   * Validate game mode
   */
  static isValidGameMode(mode: string): mode is 'classic' | 'endless' | 'timed' | 'multiplayer' {
    return ['classic', 'endless', 'timed', 'multiplayer'].includes(mode)
  }

  /**
   * Validate number range
   */
  static isInRange(value: number, min: number, max: number): ValidationResult {
    const errors: string[] = []

    if (typeof value !== 'number' || !Number.isFinite(value)) {
      errors.push('Value must be a finite number')
    } else if (value < min) {
      errors.push(`Value must be at least ${min}`)
    } else if (value > max) {
      errors.push(`Value must not exceed ${max}`)
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  /**
   * Sanitize string input
   */
  static sanitizeString(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): ValidationResult {
    const errors: string[] = []

    if (!email) {
      errors.push('Email is required')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Invalid email format')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  /**
   * Validate URL format
   */
  static isValidUrl(url: string): ValidationResult {
    const errors: string[] = []

    if (!url) {
      errors.push('URL is required')
    } else {
      try {
        new URL(url)
      } catch {
        errors.push('Invalid URL format')
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  /**
   * Validate object against schema
   */
  static validateObject<T extends Record<string, any>>(
    obj: T,
    schema: Record<keyof T, ValidationRule<any>>
  ): ValidationResult {
    const errors: string[] = []

    for (const [key, rule] of Object.entries(schema)) {
      const value = obj[key as keyof T]
      if (!rule.validate(value)) {
        errors.push(`${key}: ${rule.message}`)
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  /**
   * Validate array length
   */
  static isValidArrayLength(arr: any[], min: number, max: number): ValidationResult {
    const errors: string[] = []

    if (!Array.isArray(arr)) {
      errors.push('Value must be an array')
    } else if (arr.length < min) {
      errors.push(`Array must contain at least ${min} items`)
    } else if (arr.length > max) {
      errors.push(`Array must not contain more than ${max} items`)
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  /**
   * Validate JSON string
   */
  static isValidJSON(jsonString: string): ValidationResult {
    const errors: string[] = []

    try {
      JSON.parse(jsonString)
    } catch {
      errors.push('Invalid JSON format')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  /**
   * Validate positive integer
   */
  static isPositiveInteger(value: number): ValidationResult {
    const errors: string[] = []

    if (typeof value !== 'number') {
      errors.push('Value must be a number')
    } else if (!Number.isInteger(value)) {
      errors.push('Value must be an integer')
    } else if (value <= 0) {
      errors.push('Value must be positive')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  /**
   * Combine multiple validation results
   */
  static combine(...results: ValidationResult[]): ValidationResult {
    const errors: string[] = []

    for (const result of results) {
      if (!result.isValid) {
        errors.push(...result.errors)
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}

export default InputValidator
