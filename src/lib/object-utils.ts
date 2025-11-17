/**
 * Object manipulation utilities
 */

export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key]
    }
  })
  return result
}

export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj }
  keys.forEach(key => {
    delete result[key]
  })
  return result
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T
}

export function deepMerge<T extends object>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) {return target}

  const result = { ...target }

  sources.forEach(source => {
    Object.keys(source).forEach(key => {
      const sourceValue = source[key as keyof T]
      const targetValue = result[key as keyof T]

      if (isObject(sourceValue) && isObject(targetValue)) {
        result[key as keyof T] = deepMerge(
          targetValue as object,
          sourceValue as object
        ) as T[keyof T]
      } else if (sourceValue !== undefined) {
        result[key as keyof T] = sourceValue as T[keyof T]
      }
    })
  })

  return result
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function isEmpty(obj: object): boolean {
  return Object.keys(obj).length === 0
}

export function hasProperty<T extends object>(obj: T, property: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, property)
}

export function getProperty<T>(obj: unknown, path: string, defaultValue?: T): T | undefined {
  const keys = path.split('.')
  let result: unknown = obj

  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key]
    } else {
      return defaultValue
    }
  }

  return result as T
}
