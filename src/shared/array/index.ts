/**
 * Array utilities
 */

export function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j] as T, result[i] as T]
  }
  return result
}

export function unique<T>(array: T[]): T[] {
  return [...new Set(array)]
}

export function uniqueBy<T, K>(array: T[], key: (item: T) => K): T[] {
  const seen = new Set<K>()
  return array.filter(item => {
    const k = key(item)
    if (seen.has(k)) {
      return false
    }
    seen.add(k)
    return true
  })
}

export function groupBy<T, K extends string | number>(
  array: T[],
  key: (item: T) => K
): Record<K, T[]> {
  return array.reduce(
    (groups, item) => {
      const k = key(item)
      if (!groups[k]) {
        groups[k] = []
      }
      groups[k]?.push(item)
      return groups
    },
    {} as Record<K, T[]>
  )
}

export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

export function partition<T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] {
  const pass: T[] = []
  const fail: T[] = []

  array.forEach(item => {
    if (predicate(item)) {
      pass.push(item)
    } else {
      fail.push(item)
    }
  })

  return [pass, fail]
}

export function sortBy<T>(array: T[], key: (item: T) => number | string): T[] {
  return [...array].sort((a, b) => {
    const aVal = key(a)
    const bVal = key(b)
    if (aVal < bVal) {
      return -1
    }
    if (aVal > bVal) {
      return 1
    }
    return 0
  })
}

export function sample<T>(array: T[]): T | undefined {
  return array[Math.floor(Math.random() * array.length)]
}

export function sampleSize<T>(array: T[], size: number): T[] {
  const shuffled = shuffle(array)
  return shuffled.slice(0, Math.min(size, array.length))
}

export function first<T>(array: T[]): T | undefined {
  return array[0]
}

export function last<T>(array: T[]): T | undefined {
  return array[array.length - 1]
}

export function compact<T>(array: (T | null | undefined | false | 0 | '')[]): T[] {
  return array.filter(Boolean) as T[]
}
