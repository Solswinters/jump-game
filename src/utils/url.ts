/**
 * URL utility functions
 */

export function buildUrl(base: string, path: string, params?: Record<string, string>): string {
  let url = base.endsWith('/') ? base.slice(0, -1) : base
  url += path.startsWith('/') ? path : `/${path}`

  if (params) {
    const queryString = new URLSearchParams(params).toString()
    if (queryString) {
      url += `?${queryString}`
    }
  }

  return url
}

export function parseQueryString(queryString: string): Record<string, string> {
  const params = new URLSearchParams(queryString)
  const result: Record<string, string> = {}

  params.forEach((value, key) => {
    result[key] = value
  })

  return result
}

export function addQueryParams(url: string, params: Record<string, string>): string {
  const [baseUrl, existingQuery] = url.split('?')
  const allParams = existingQuery ? parseQueryString(existingQuery) : {}

  Object.assign(allParams, params)

  const queryString = new URLSearchParams(allParams).toString()
  return queryString ? `${baseUrl}?${queryString}` : (baseUrl ?? '')
}

export function removeQueryParam(url: string, paramName: string): string {
  const [baseUrl, existingQuery] = url.split('?')
  if (!existingQuery) {
    return url
  }

  const params = parseQueryString(existingQuery)
  delete params[paramName]

  const queryString = new URLSearchParams(params).toString()
  return queryString ? `${baseUrl}?${queryString}` : (baseUrl ?? '')
}

export function getQueryParamValue(url: string, paramName: string): string | null {
  const [, queryString] = url.split('?')
  if (!queryString) {
    return null
  }

  const params = new URLSearchParams(queryString)
  return params.get(paramName)
}

export function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//i.test(url)
}

export function isRelativeUrl(url: string): boolean {
  return !isAbsoluteUrl(url)
}

export function joinPaths(...paths: string[]): string {
  return paths
    .map(path => path.replace(/^\/+|\/+$/g, ''))
    .filter(path => path.length > 0)
    .join('/')
}

export function getFileExtension(url: string): string {
  const pathname = url.split('?')[0] ?? ''
  const filename = pathname.split('/').pop() ?? ''
  const parts = filename.split('.')

  return parts.length > 1 ? (parts.pop() ?? '') : ''
}

export function getFilename(url: string): string {
  const pathname = url.split('?')[0] ?? ''
  return pathname.split('/').pop() ?? ''
}

export function getDomain(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname
  } catch {
    return ''
  }
}

export function getProtocol(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.protocol.replace(':', '')
  } catch {
    return ''
  }
}

export function sanitizeUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.toString()
  } catch {
    return ''
  }
}
