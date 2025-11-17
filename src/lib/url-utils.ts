/**
 * URL manipulation utilities
 */

export function getQueryParams(url: string): Record<string, string> {
  const params: Record<string, string> = {}
  const searchParams = new URL(url).searchParams

  searchParams.forEach((value, key) => {
    params[key] = value
  })

  return params
}

export function addQueryParams(url: string, params: Record<string, string | number>): string {
  const urlObj = new URL(url)

  Object.entries(params).forEach(([key, value]) => {
    urlObj.searchParams.set(key, String(value))
  })

  return urlObj.toString()
}

export function removeQueryParams(url: string, keys: string[]): string {
  const urlObj = new URL(url)

  keys.forEach(key => {
    urlObj.searchParams.delete(key)
  })

  return urlObj.toString()
}

export function getDomain(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return ''
  }
}

export function getPath(url: string): string {
  try {
    return new URL(url).pathname
  } catch {
    return ''
  }
}

export function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//i.test(url)
}

export function joinPaths(...paths: string[]): string {
  return paths
    .map((path, index) => {
      if (index === 0) {
        return path.replace(/\/+$/, '')
      }
      return path.replace(/^\/+/, '').replace(/\/+$/, '')
    })
    .filter(Boolean)
    .join('/')
}
