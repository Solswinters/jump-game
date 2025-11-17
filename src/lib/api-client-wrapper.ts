/**
 * Enhanced API client with retry and error handling
 */

import { retry } from './helpers/retry'
import { logger } from './logger'
import type { AppError } from './errors'

export interface ApiClientConfig {
  baseURL: string
  timeout?: number
  retries?: number
  headers?: Record<string, string>
}

export class ApiClient {
  private config: Required<ApiClientConfig>

  constructor(config: ApiClientConfig) {
    this.config = {
      timeout: 30000,
      retries: 3,
      headers: {},
      ...config,
    }
  }

  async get<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' })
  }

  async post<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async put<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async delete<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' })
  }

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const url = `${this.config.baseURL}${path}`

    return retry(
      async () => {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), this.config.timeout)

        try {
          const response = await fetch(url, {
            ...options,
            headers: {
              'Content-Type': 'application/json',
              ...this.config.headers,
              ...options?.headers,
            },
            signal: controller.signal,
          })

          if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`)
          }

          return (await response.json()) as T
        } finally {
          clearTimeout(timeout)
        }
      },
      { maxAttempts: this.config.retries }
    )
  }
}
