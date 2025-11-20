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

  keys.forEach((key) => {
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

export function parseUrl(url: string): {
  protocol: string
  hostname: string
  port: string
  pathname: string
  search: string
  hash: string
} | null {
  try {
    const urlObj = new URL(url)
    return {
      protocol: urlObj.protocol,
      hostname: urlObj.hostname,
      port: urlObj.port,
      pathname: urlObj.pathname,
      search: urlObj.search,
      hash: urlObj.hash,
    }
  } catch {
    return null
  }
}

export function buildUrl(
  baseUrl: string,
  path?: string,
  params?: Record<string, string | number | boolean>
): string {
  let url = baseUrl

  if (path) {
    url = joinPaths(url, path)
  }

  if (params && Object.keys(params).length > 0) {
    url = addQueryParams(url, params)
  }

  return url
}

export function getQueryParam(url: string, key: string): string | null {
  try {
    return new URL(url).searchParams.get(key)
  } catch {
    return null
  }
}

export function hasQueryParam(url: string, key: string): boolean {
  try {
    return new URL(url).searchParams.has(key)
  } catch {
    return false
  }
}

export function updateQueryParam(url: string, key: string, value: string | number): string {
  try {
    const urlObj = new URL(url)
    urlObj.searchParams.set(key, String(value))
    return urlObj.toString()
  } catch {
    return url
  }
}

export function removeAllQueryParams(url: string): string {
  try {
    const urlObj = new URL(url)
    return `${urlObj.origin}${urlObj.pathname}`
  } catch {
    return url
  }
}

export function getUrlHash(url: string): string {
  try {
    return new URL(url).hash.substring(1)
  } catch {
    return ''
  }
}

export function setUrlHash(url: string, hash: string): string {
  try {
    const urlObj = new URL(url)
    urlObj.hash = hash
    return urlObj.toString()
  } catch {
    return url
  }
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function isSameOrigin(url1: string, url2: string): boolean {
  try {
    const origin1 = new URL(url1).origin
    const origin2 = new URL(url2).origin
    return origin1 === origin2
  } catch {
    return false
  }
}

export function getOrigin(url: string): string {
  try {
    return new URL(url).origin
  } catch {
    return ''
  }
}

export function ensureProtocol(url: string, protocol = 'https:'): string {
  if (/^https?:\/\//i.test(url)) {
    return url
  }
  return `${protocol}//${url}`
}

export function stripProtocol(url: string): string {
  return url.replace(/^https?:\/\//i, '')
}

export function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    // Remove trailing slash from pathname unless it's root
    if (urlObj.pathname !== '/' && urlObj.pathname.endsWith('/')) {
      urlObj.pathname = urlObj.pathname.slice(0, -1)
    }
    // Sort query parameters
    const params = Array.from(urlObj.searchParams.entries()).sort()
    urlObj.search = new URLSearchParams(params).toString()
    return urlObj.toString().toLowerCase()
  } catch {
    return url
  }
}
