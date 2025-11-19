/**
 * Inventory management system
 */

import { Item } from './Item'

export class Inventory {
  private items: Map<string, Item>
  private maxSlots: number

  constructor(maxSlots = 20) {
    this.items = new Map()
    this.maxSlots = maxSlots
  }

  addItem(item: Item): boolean {
    // Try to stack with existing item
    const existingItem = this.items.get(item.id)
    if (existingItem && existingItem.canStack(item)) {
      const added = existingItem.addQuantity(item.quantity)
      item.removeQuantity(added)

      if (item.isEmpty()) {
        return true
      }
    }

    // Add as new item if space available
    if (this.items.size < this.maxSlots) {
      this.items.set(item.id, item)
      return true
    }

    return false
  }

  removeItem(itemId: string, quantity = 1): boolean {
    const item = this.items.get(itemId)
    if (!item) {
      return false
    }

    item.removeQuantity(quantity)

    if (item.isEmpty()) {
      this.items.delete(itemId)
    }

    return true
  }

  getItem(itemId: string): Item | undefined {
    return this.items.get(itemId)
  }

  hasItem(itemId: string, quantity = 1): boolean {
    const item = this.items.get(itemId)
    return item ? item.quantity >= quantity : false
  }

  getItemCount(itemId: string): number {
    return this.items.get(itemId)?.quantity ?? 0
  }

  getAllItems(): Item[] {
    return Array.from(this.items.values())
  }

  getItemsByType(type: string): Item[] {
    return this.getAllItems().filter(item => item.type === type)
  }

  isFull(): boolean {
    return this.items.size >= this.maxSlots
  }

  getAvailableSlots(): number {
    return this.maxSlots - this.items.size
  }

  clear(): void {
    this.items.clear()
  }

  sort(compareFn?: (a: Item, b: Item) => number): void {
    const sortedItems = this.getAllItems().sort(compareFn)
    this.items.clear()
    sortedItems.forEach(item => this.items.set(item.id, item))
  }
}
