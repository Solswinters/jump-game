/**
 * Circular buffer for efficient data storage
 */

export class CircularBuffer<T> {
  private buffer: (T | undefined)[]
  private head: number = 0
  private tail: number = 0
  private count: number = 0
  private capacity: number

  constructor(capacity: number) {
    this.capacity = capacity
    this.buffer = new Array(capacity)
  }

  push(item: T): void {
    this.buffer[this.head] = item
    this.head = (this.head + 1) % this.capacity

    if (this.count < this.capacity) {
      this.count++
    } else {
      this.tail = (this.tail + 1) % this.capacity
    }
  }

  pop(): T | undefined {
    if (this.count === 0) {
      return undefined
    }

    this.head = (this.head - 1 + this.capacity) % this.capacity
    const item = this.buffer[this.head]
    this.buffer[this.head] = undefined
    this.count--

    return item
  }

  get(index: number): T | undefined {
    if (index < 0 || index >= this.count) {
      return undefined
    }

    const actualIndex = (this.tail + index) % this.capacity
    return this.buffer[actualIndex]
  }

  getAll(): T[] {
    const result: T[] = []
    for (let i = 0; i < this.count; i++) {
      const item = this.get(i)
      if (item !== undefined) {
        result.push(item)
      }
    }
    return result
  }

  clear(): void {
    this.buffer = new Array(this.capacity)
    this.head = 0
    this.tail = 0
    this.count = 0
  }

  size(): number {
    return this.count
  }

  isFull(): boolean {
    return this.count === this.capacity
  }

  isEmpty(): boolean {
    return this.count === 0
  }
}
