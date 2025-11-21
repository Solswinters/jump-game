/**
 * Inventory System - Manage player items and equipment
 */

export interface InventoryItem {
  id: string
  name: string
  type: 'powerup' | 'skin' | 'boost' | 'token'
  quantity: number
  equipped: boolean
  metadata?: Record<string, any>
}

export class InventorySystem {
  private items: Map<string, InventoryItem> = new Map()
  private maxSlots: number = 50

  addItem(item: Omit<InventoryItem, 'equipped'>): boolean {
    const existing = this.items.get(item.id)
    if (existing) {
      existing.quantity += item.quantity
      return true
    }
    if (this.items.size >= this.maxSlots) return false
    this.items.set(item.id, { ...item, equipped: false })
    return true
  }

  removeItem(itemId: string, quantity: number = 1): boolean {
    const item = this.items.get(itemId)
    if (!item) return false
    item.quantity -= quantity
    if (item.quantity <= 0) this.items.delete(itemId)
    return true
  }

  equipItem(itemId: string): boolean {
    const item = this.items.get(itemId)
    if (!item) return false
    this.items.forEach((i) => {
      if (i.type === item.type) i.equipped = false
    })
    item.equipped = true
    return true
  }

  getItems(): InventoryItem[] {
    return Array.from(this.items.values())
  }

  getEquippedItems(): InventoryItem[] {
    return this.getItems().filter((item) => item.equipped)
  }

  clear(): void {
    this.items.clear()
  }
}

export default InventorySystem
