/**
 * Priority queue implementation
 */

export interface PriorityQueueItem<T> {
  value: T
  priority: number
}

export class PriorityQueue<T> {
  private heap: PriorityQueueItem<T>[] = []

  enqueue(value: T, priority: number): void {
    this.heap.push({ value, priority })
    this.bubbleUp(this.heap.length - 1)
  }

  dequeue(): T | undefined {
    if (this.isEmpty()) {
      return undefined
    }

    const root = this.heap[0]
    const last = this.heap.pop()

    if (this.heap.length > 0 && last) {
      this.heap[0] = last
      this.bubbleDown(0)
    }

    return root?.value
  }

  peek(): T | undefined {
    return this.heap[0]?.value
  }

  private bubbleUp(index: number): void {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2)
      const parent = this.heap[parentIndex]
      const current = this.heap[index]

      if (!parent || !current || parent.priority <= current.priority) {
        break
      }

      this.heap[parentIndex] = current
      this.heap[index] = parent
      index = parentIndex
    }
  }

  private bubbleDown(index: number): void {
    while (true) {
      const leftChild = 2 * index + 1
      const rightChild = 2 * index + 2
      let smallest = index

      const current = this.heap[index]
      const left = this.heap[leftChild]
      const right = this.heap[rightChild]

      if (left && current && left.priority < current.priority) {
        smallest = leftChild
      }

      const smallestItem = this.heap[smallest]
      if (right && smallestItem && right.priority < smallestItem.priority) {
        smallest = rightChild
      }

      if (smallest === index) {
        break
      }

      const temp = this.heap[index]
      const swap = this.heap[smallest]
      if (temp && swap) {
        this.heap[index] = swap
        this.heap[smallest] = temp
      }

      index = smallest
    }
  }

  size(): number {
    return this.heap.length
  }

  isEmpty(): boolean {
    return this.heap.length === 0
  }

  clear(): void {
    this.heap = []
  }
}
