/**
 * Async queue for managing concurrent operations
 */

type AsyncTask<T> = () => Promise<T>

export class AsyncQueue {
  private queue: Array<() => Promise<unknown>> = []
  private running = 0
  private maxConcurrent: number

  constructor(maxConcurrent: number = 5) {
    this.maxConcurrent = maxConcurrent
  }

  async add<T>(task: AsyncTask<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await task()
          resolve(result)
        } catch (error) {
          reject(error instanceof Error ? error : new Error(String(error)))
        }
      })

      void this.process()
    })
  }

  private async process(): Promise<void> {
    if (this.running >= this.maxConcurrent || this.queue.length === 0) {
      return
    }

    this.running++
    const task = this.queue.shift()

    if (task) {
      try {
        await task()
      } finally {
        this.running--
        void this.process()
      }
    }
  }

  getQueueSize(): number {
    return this.queue.length
  }

  getRunningCount(): number {
    return this.running
  }
}
