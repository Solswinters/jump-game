/**
 * Data transformation utilities for converting between formats
 */

export class DataTransformer {
  /**
   * Convert snake_case to camelCase
   */
  static toCamelCase<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
    const result: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(obj)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase())

      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        result[camelKey] = this.toCamelCase(value as Record<string, unknown>)
      } else if (Array.isArray(value)) {
        result[camelKey] = value.map((item: unknown) =>
          typeof item === 'object' && item !== null
            ? this.toCamelCase(item as Record<string, unknown>)
            : item
        )
      } else {
        result[camelKey] = value
      }
    }

    return result
  }

  /**
   * Convert camelCase to snake_case
   */
  static toSnakeCase<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
    const result: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(obj)) {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)

      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        result[snakeKey] = this.toSnakeCase(value as Record<string, unknown>)
      } else if (Array.isArray(value)) {
        result[snakeKey] = value.map((item: unknown) =>
          typeof item === 'object' && item !== null
            ? this.toSnakeCase(item as Record<string, unknown>)
            : item
        )
      } else {
        result[snakeKey] = value
      }
    }

    return result
  }

  /**
   * Deep clone an object
   */
  static deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
      return obj
    }

    if (obj instanceof Date) {
      return new Date(obj.getTime()) as T
    }

    if (obj instanceof Array) {
      return obj.map((item: unknown) => this.deepClone(item)) as T
    }

    if (obj instanceof Object) {
      const cloned: Record<string, unknown> = {}
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          cloned[key] = this.deepClone((obj as Record<string, unknown>)[key])
        }
      }
      return cloned as T
    }

    return obj
  }

  /**
   * Flatten nested object
   */
  static flatten(obj: Record<string, unknown>, prefix = ''): Record<string, unknown> {
    const result: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(obj)) {
      const newKey = prefix ? `${prefix}.${key}` : key

      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        Object.assign(result, this.flatten(value as Record<string, unknown>, newKey))
      } else {
        result[newKey] = value
      }
    }

    return result
  }

  /**
   * Unflatten object
   */
  static unflatten(obj: Record<string, unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(obj)) {
      const keys = key.split('.')
      let current = result

      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i]
        if (k) {
          if (!(k in current)) {
            current[k] = {}
          }
          current = current[k] as Record<string, unknown>
        }
      }

      const lastKey = keys[keys.length - 1]
      if (lastKey) {
        current[lastKey] = value
      }
    }

    return result
  }

  /**
   * Pick specific keys from object
   */
  static pick<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>

    for (const key of keys) {
      if (key in obj) {
        result[key] = obj[key]
      }
    }

    return result
  }

  /**
   * Omit specific keys from object
   */
  static omit<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    const result = { ...obj }

    for (const key of keys) {
      delete result[key]
    }

    return result
  }

  /**
   * Merge objects deeply
   */
  static deepMerge<T extends Record<string, unknown>>(target: T, ...sources: Partial<T>[]): T {
    if (!sources.length) {return target}

    const result = { ...target }

    for (const source of sources) {
      for (const [key, value] of Object.entries(source)) {
        if (value !== undefined) {
          if (
            value !== null &&
            typeof value === 'object' &&
            !Array.isArray(value) &&
            key in result &&
            typeof result[key as keyof T] === 'object'
          ) {
            result[key as keyof T] = this.deepMerge(
              result[key as keyof T] as Record<string, unknown>,
              value as Record<string, unknown>
            ) as T[keyof T]
          } else {
            result[key as keyof T] = value as T[keyof T]
          }
        }
      }
    }

    return result
  }
}
