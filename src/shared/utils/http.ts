/**
 * HTTP utility functions
 */

export interface RequestOptions extends RequestInit {
  params?: Record<string, string>
  timeout?: number
}

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
    this.name = 'HttpError'
  }
}

export async function httpGet<T>(url: string, options?: RequestOptions): Promise<T> {
  const response = await httpRequest(url, { ...options, method: 'GET' })
  return response.json()
}

export async function httpPost<T>(
  url: string,
  data?: unknown,
  options?: RequestOptions
): Promise<T> {
  const response = await httpRequest(url, {
    ...options,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function httpPut<T>(
  url: string,
  data?: unknown,
  options?: RequestOptions
): Promise<T> {
  const response = await httpRequest(url, {
    ...options,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function httpDelete<T>(url: string, options?: RequestOptions): Promise<T> {
  const response = await httpRequest(url, { ...options, method: 'DELETE' })
  return response.json()
}

async function httpRequest(url: string, options?: RequestOptions): Promise<Response> {
  const { params, timeout, ...fetchOptions } = options || {}

  // Add query parameters
  let finalUrl = url
  if (params) {
    const searchParams = new URLSearchParams(params)
    finalUrl = `${url}?${searchParams.toString()}`
  }

  // Create abort controller for timeout
  const controller = new AbortController()
  if (timeout) {
    setTimeout(() => controller.abort(), timeout)
  }

  const response = await fetch(finalUrl, {
    ...fetchOptions,
    signal: controller.signal,
  })

  if (!response.ok) {
    throw new HttpError(response.status, response.statusText)
  }

  return response
}
