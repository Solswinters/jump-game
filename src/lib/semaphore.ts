/**
 * Semaphore implementation for concurrency control
 */

export class Semaphore {
  private permits: number
  private waiting: Array<() => void> = []

  constructor(permits: number) {
    this.permits = permits
  }

  async acquire(): Promise<void> {
    if (this.permits > 0) {
      this.permits--
      return Promise.resolve()
    }

    return new Promise<void>(resolve => {
      this.waiting.push(resolve)
    })
  }

  release(): void {
    this.permits++

    if (this.waiting.length > 0) {
      this.permits--
      const resolve = this.waiting.shift()!
      resolve()
    }
  }

  async use<T>(fn: () => Promise<T>): Promise<T> {
    await this.acquire()
    try {
      return await fn()
    } finally {
      this.release()
    }
  }

  getAvailable(): number {
    return this.permits
  }

  getWaiting(): number {
    return this.waiting.length
  }
}
