/**
 * Request ID generation and tracking
 */

import { generateUUID } from './crypto-utils'

class RequestIDManager {
  private currentRequestId: string | null = null

  generate(): string {
    const id = generateUUID()
    this.currentRequestId = id
    return id
  }

  getCurrent(): string | null {
    return this.currentRequestId
  }

  clear(): void {
    this.currentRequestId = null
  }

  withRequestId<T>(fn: () => T): T {
    const requestId = this.generate()
    try {
      return fn()
    } finally {
      this.clear()
    }
  }

  async withRequestIdAsync<T>(fn: () => Promise<T>): Promise<T> {
    const requestId = this.generate()
    try {
      return await fn()
    } finally {
      this.clear()
    }
  }
}

export const requestIdManager = new RequestIDManager()

export function generateRequestId(): string {
  return requestIdManager.generate()
}

export function getCurrentRequestId(): string | null {
  return requestIdManager.getCurrent()
}
