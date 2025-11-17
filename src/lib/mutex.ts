/**
 * Mutex implementation for mutual exclusion
 */

import { Semaphore } from './semaphore'

export class Mutex {
  private semaphore: Semaphore

  constructor() {
    this.semaphore = new Semaphore(1)
  }

  async lock(): Promise<void> {
    await this.semaphore.acquire()
  }

  unlock(): void {
    this.semaphore.release()
  }

  async runExclusive<T>(fn: () => Promise<T>): Promise<T> {
    await this.lock()
    try {
      return await fn()
    } finally {
      this.unlock()
    }
  }

  isLocked(): boolean {
    return this.semaphore.getAvailable() === 0
  }
}
