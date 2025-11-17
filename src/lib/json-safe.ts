/**
 * Safe JSON operations with error handling and recovery
 */

export class JSONParseError extends Error {
  constructor(
    message: string,
    public readonly input: string
  ) {
    super(message)
    this.name = 'JSONParseError'
  }
}

export class JSONSafe {
  /**
   * Safe JSON parse with fallback
   */
  static parse<T = unknown>(input: string, fallback?: T): T {
    try {
      return JSON.parse(input) as T
    } catch (error) {
      if (fallback !== undefined) {
        return fallback
      }
      throw new JSONParseError(
        `Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`,
        input
      )
    }
  }

  /**
   * Safe JSON stringify with error handling
   */
  static stringify(value: unknown, space?: string | number, fallback?: string): string {
    try {
      return JSON.stringify(value, (key: string, val: unknown) => this.replacer(key, val), space)
    } catch (error) {
      if (fallback !== undefined) {
        return fallback
      }
      throw new Error(
        `Failed to stringify value: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Parse with validation
   */
  static parseWithValidation<T>(
    input: string,
    validator: (value: unknown) => value is T,
    fallback?: T
  ): T {
    const parsed = this.parse<unknown>(input, fallback)

    if (!validator(parsed)) {
      if (fallback !== undefined) {
        return fallback
      }
      throw new JSONParseError('Parsed value failed validation', input)
    }

    return parsed
  }

  /**
   * Try parse without throwing
   */
  static tryParse<T = unknown>(
    input: string
  ): { success: true; data: T } | { success: false; error: Error } {
    try {
      return { success: true, data: JSON.parse(input) as T }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
      }
    }
  }

  /**
   * Deep clone using JSON
   */
  static clone<T>(value: T): T {
    return this.parse<T>(this.stringify(value))
  }

  /**
   * Check if string is valid JSON
   */
  static isValid(input: string): boolean {
    try {
      JSON.parse(input)
      return true
    } catch {
      return false
    }
  }

  /**
   * Custom replacer for handling special types
   */
  private static replacer(key: string, value: unknown): unknown {
    // Handle BigInt
    if (typeof value === 'bigint') {
      return value.toString()
    }

    // Handle undefined
    if (value === undefined) {
      return null
    }

    // Handle functions (skip them)
    if (typeof value === 'function') {
      return undefined
    }

    // Handle circular references (basic)
    if (value && typeof value === 'object') {
      const seen = new WeakSet()
      if (seen.has(value)) {
        return '[Circular]'
      }
      seen.add(value)
    }

    return value
  }

  /**
   * Pretty print JSON
   */
  static prettyPrint(value: unknown, space = 2): string {
    return this.stringify(value, space)
  }

  /**
   * Minify JSON
   */
  static minify(value: unknown): string {
    return this.stringify(value, 0)
  }

  /**
   * Compare two JSON strings for equality
   */
  static equal(a: string, b: string): boolean {
    try {
      const parsedA = this.parse<unknown>(a)
      const parsedB = this.parse<unknown>(b)
      return JSON.stringify(parsedA) === JSON.stringify(parsedB)
    } catch {
      return false
    }
  }
}
