/**
 * Message queue middleware
 */

import type { Message } from '../protocols/MessageProtocol'

export class MessageQueue {
  private queue: Message[] = []
  private maxSize: number
  private processing = false

  constructor(maxSize = 100) {
    this.maxSize = maxSize
  }

  enqueue(message: Message): boolean {
    if (this.queue.length >= this.maxSize) {
      console.warn('Message queue is full, dropping oldest message')
      this.queue.shift()
    }
    this.queue.push(message)
    return true
  }

  dequeue(): Message | undefined {
    return this.queue.shift()
  }

  peek(): Message | undefined {
    return this.queue[0]
  }

  clear(): void {
    this.queue = []
  }

  size(): number {
    return this.queue.length
  }

  isEmpty(): boolean {
    return this.queue.length === 0
  }

  async process(handler: (message: Message) => Promise<void>): Promise<void> {
    if (this.processing) return

    this.processing = true
    try {
      while (!this.isEmpty()) {
        const message = this.dequeue()
        if (message) {
          await handler(message)
        }
      }
    } finally {
      this.processing = false
    }
  }

  filter(predicate: (message: Message) => boolean): void {
    this.queue = this.queue.filter(predicate)
  }

  getMessages(): Message[] {
    return [...this.queue]
  }
}
