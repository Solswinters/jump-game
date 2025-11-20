/**
 * Enum utilities
 */

export class EnumUtils {
  /**
   * Get all keys from an enum
   */
  static getKeys<T extends Record<string, string | number>>(enumObj: T): (keyof T)[] {
    return Object.keys(enumObj).filter((key) => isNaN(Number(key))) as (keyof T)[]
  }

  /**
   * Get all values from an enum
   */
  static getValues<T extends Record<string, string | number>>(enumObj: T): T[keyof T][] {
    return this.getKeys(enumObj).map((key) => enumObj[key])
  }

  /**
   * Get all entries from an enum
   */
  static getEntries<T extends Record<string, string | number>>(
    enumObj: T
  ): [keyof T, T[keyof T]][] {
    return this.getKeys(enumObj).map((key) => [key, enumObj[key]])
  }

  /**
   * Check if value exists in enum
   */
  static hasValue<T extends Record<string, string | number>>(
    enumObj: T,
    value: unknown
  ): value is T[keyof T] {
    return this.getValues(enumObj).includes(value as T[keyof T])
  }

  /**
   * Get enum key by value
   */
  static getKeyByValue<T extends Record<string, string | number>>(
    enumObj: T,
    value: T[keyof T]
  ): keyof T | undefined {
    return this.getEntries(enumObj).find(([, v]) => v === value)?.[0]
  }

  /**
   * Convert enum to array of options
   */
  static toOptions<T extends Record<string, string | number>>(
    enumObj: T
  ): Array<{ label: string; value: T[keyof T] }> {
    return this.getEntries(enumObj).map(([key, value]) => ({
      label: String(key),
      value,
    }))
  }

  /**
   * Parse value to enum
   */
  static parse<T extends Record<string, string | number>>(
    enumObj: T,
    value: unknown,
    defaultValue?: T[keyof T]
  ): T[keyof T] | undefined {
    if (this.hasValue(enumObj, value)) {
      return value
    }
    return defaultValue
  }
}
