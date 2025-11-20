/**
 * Least Recently Used (LRU) cache implementation
 */

interface LRUNode<T> {
  key: string
  value: T
  prev: LRUNode<T> | null
  next: LRUNode<T> | null
}

export class LRUCache<T = any> {
  private capacity: number
  private cache: Map<string, LRUNode<T>> = new Map()
  private head: LRUNode<T> | null = null
  private tail: LRUNode<T> | null = null

  constructor(capacity: number = 100) {
    this.capacity = capacity
  }

  /**
   * Get value from cache
   */
  get(key: string): T | null {
    const node = this.cache.get(key)

    if (!node) return null

    // Move to front (most recently used)
    this.moveToFront(node)

    return node.value
  }

  /**
   * Set value in cache
   */
  set(key: string, value: T): void {
    // Update existing node
    if (this.cache.has(key)) {
      const node = this.cache.get(key)!
      node.value = value
      this.moveToFront(node)
      return
    }

    // Create new node
    const node: LRUNode<T> = {
      key,
      value,
      prev: null,
      next: null,
    }

    // Add to cache
    this.cache.set(key, node)
    this.addToFront(node)

    // Evict least recently used if over capacity
    if (this.cache.size > this.capacity) {
      this.evict()
    }
  }

  /**
   * Check if key exists
   */
  has(key: string): boolean {
    return this.cache.has(key)
  }

  /**
   * Delete key from cache
   */
  delete(key: string): boolean {
    const node = this.cache.get(key)

    if (!node) return false

    this.removeNode(node)
    return this.cache.delete(key)
  }

  /**
   * Clear all entries
   */
  clear(): void {
    this.cache.clear()
    this.head = null
    this.tail = null
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size
  }

  /**
   * Get all keys (ordered by recent usage)
   */
  keys(): string[] {
    const keys: string[] = []
    let current = this.head

    while (current) {
      keys.push(current.key)
      current = current.next
    }

    return keys
  }

  /**
   * Move node to front (most recently used)
   */
  private moveToFront(node: LRUNode<T>): void {
    if (node === this.head) return

    this.removeNode(node)
    this.addToFront(node)
  }

  /**
   * Add node to front
   */
  private addToFront(node: LRUNode<T>): void {
    node.prev = null
    node.next = this.head

    if (this.head) {
      this.head.prev = node
    }

    this.head = node

    if (!this.tail) {
      this.tail = node
    }
  }

  /**
   * Remove node from list
   */
  private removeNode(node: LRUNode<T>): void {
    if (node.prev) {
      node.prev.next = node.next
    } else {
      this.head = node.next
    }

    if (node.next) {
      node.next.prev = node.prev
    } else {
      this.tail = node.prev
    }
  }

  /**
   * Evict least recently used entry
   */
  private evict(): void {
    if (!this.tail) return

    this.cache.delete(this.tail.key)
    this.removeNode(this.tail)
  }

  /**
   * Get cache statistics
   */
  stats(): {
    size: number
    capacity: number
    keys: string[]
  } {
    return {
      size: this.size(),
      capacity: this.capacity,
      keys: this.keys(),
    }
  }
}
