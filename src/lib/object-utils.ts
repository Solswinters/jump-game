/**
 * Object manipulation utilities
 */

export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key]
    }
  })
  return result
}

export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj }
  keys.forEach((key) => {
    delete result[key]
  })
  return result
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T
}

export function deepMerge<T extends object>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) {
    return target
  }

  const result = { ...target }

  sources.forEach((source) => {
    Object.keys(source).forEach((key) => {
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

export function setProperty<T extends object>(obj: T, path: string, value: unknown): T {
  const keys = path.split('.')
  const lastKey = keys.pop()

  if (!lastKey) {
    return obj
  }

  let current: Record<string, unknown> = obj as Record<string, unknown>

  for (const key of keys) {
    if (!(key in current) || !isObject(current[key])) {
      current[key] = {}
    }
    current = current[key] as Record<string, unknown>
  }

  current[lastKey] = value
  return obj
}

export function deleteProperty<T extends object>(obj: T, path: string): T {
  const keys = path.split('.')
  const lastKey = keys.pop()

  if (!lastKey) {
    return obj
  }

  let current: Record<string, unknown> = obj as Record<string, unknown>

  for (const key of keys) {
    if (!(key in current) || !isObject(current[key])) {
      return obj
    }
    current = current[key] as Record<string, unknown>
  }

  delete current[lastKey]
  return obj
}

export function mapKeys<T extends object>(
  obj: T,
  fn: (key: string, value: unknown) => string
): Record<string, unknown> {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      acc[fn(key, value)] = value
      return acc
    },
    {} as Record<string, unknown>
  )
}

export function mapValues<T extends object, R>(
  obj: T,
  fn: (value: T[keyof T], key: keyof T) => R
): Record<keyof T, R> {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      acc[key as keyof T] = fn(value as T[keyof T], key as keyof T)
      return acc
    },
    {} as Record<keyof T, R>
  )
}

export function filterKeys<T extends object>(
  obj: T,
  predicate: (key: keyof T, value: T[keyof T]) => boolean
): Partial<T> {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (predicate(key as keyof T, value as T[keyof T])) {
      acc[key as keyof T] = value as T[keyof T]
    }
    return acc
  }, {} as Partial<T>)
}

export function invert<T extends Record<string, string | number>>(obj: T): Record<string, string> {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      acc[String(value)] = key
      return acc
    },
    {} as Record<string, string>
  )
}

export function flatten(obj: object, prefix = ''): Record<string, unknown> {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      const newKey = prefix ? `${prefix}.${key}` : key

      if (isObject(value)) {
        Object.assign(acc, flatten(value as object, newKey))
      } else {
        acc[newKey] = value
      }

      return acc
    },
    {} as Record<string, unknown>
  )
}

export function unflatten(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  Object.entries(obj).forEach(([key, value]) => {
    setProperty(result, key, value)
  })

  return result
}

export function freeze<T extends object>(obj: T): Readonly<T> {
  return Object.freeze(obj)
}

export function deepFreeze<T extends object>(obj: T): Readonly<T> {
  Object.freeze(obj)

  Object.values(obj).forEach((value) => {
    if (isObject(value)) {
      deepFreeze(value)
    }
  })

  return obj as Readonly<T>
}

export function isDeepEqual(obj1: unknown, obj2: unknown): boolean {
  if (obj1 === obj2) {
    return true
  }

  if (!isObject(obj1) || !isObject(obj2)) {
    return false
  }

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) {
    return false
  }

  return keys1.every((key) => {
    return isDeepEqual(obj1[key], obj2[key])
  })
}

export function merge<T extends object>(...objects: Partial<T>[]): T {
  return Object.assign({}, ...objects) as T
}

export function cloneShallow<T extends object>(obj: T): T {
  return { ...obj }
}

export function keys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[]
}

export function values<T extends object>(obj: T): T[keyof T][] {
  return Object.values(obj)
}

export function entries<T extends object>(obj: T): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][]
}

export function fromEntries<K extends string | number | symbol, V>(
  entries: [K, V][]
): Record<K, V> {
  return Object.fromEntries(entries) as Record<K, V>
}

export function compact<T extends object>(obj: T): Partial<T> {
  return filterKeys(obj, (_, value) => value !== null && value !== undefined)
}

export function defaults<T extends object>(obj: T, ...defaults: Partial<T>[]): T {
  return deepMerge({} as T, ...defaults, obj)
}
