/**
 * Inventory System - Manage player items, power-ups, and collectibles
 * FEATURE: Adds depth to game with collectible items and upgrades
 */

export interface InventoryItem {
  id: string
  name: string
  type: ItemType
  category: ItemCategory
  rarity: ItemRarity
  icon: string
  description: string
  quantity: number
  maxStack: number
  usable: boolean
  tradable: boolean
  metadata: Record<string, unknown>
  acquiredAt: Date
}

export enum ItemType {
  POWER_UP = 'power_up',
  SKIN = 'skin',
  UPGRADE = 'upgrade',
  CONSUMABLE = 'consumable',
  COLLECTIBLE = 'collectible',
  ACHIEVEMENT_ITEM = 'achievement_item',
  CURRENCY = 'currency',
}

export enum ItemCategory {
  GAMEPLAY = 'gameplay',
  COSMETIC = 'cosmetic',
  BOOST = 'boost',
  SPECIAL = 'special',
}

export enum ItemRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
  MYTHIC = 'mythic',
}

export interface InventoryConfig {
  maxSlots: number
  persistKey: string
  autoSave: boolean
  autoSaveInterval: number
}

type EventCallback = (data: unknown) => void

export class InventorySystem {
  private items: Map<string, InventoryItem> = new Map()
  private config: InventoryConfig
  private eventListeners: Map<string, Set<EventCallback>> = new Map()
  private autoSaveTimer?: NodeJS.Timeout

  constructor(config: Partial<InventoryConfig> = {}) {
    this.config = {
      maxSlots: config.maxSlots || 100,
      persistKey: config.persistKey || 'game_inventory',
      autoSave: config.autoSave !== false,
      autoSaveInterval: config.autoSaveInterval || 30000, // 30 seconds
    }

    this.loadInventory()

    if (this.config.autoSave) {
      this.startAutoSave()
    }
  }

  /**
   * Add item to inventory
   */
  addItem(item: Omit<InventoryItem, 'quantity' | 'acquiredAt'>, quantity: number = 1): boolean {
    // Check if inventory is full
    if (this.items.size >= this.config.maxSlots && !this.items.has(item.id)) {
      this.emit('inventoryFull', { item })
      return false
    }

    const existingItem = this.items.get(item.id)

    if (existingItem) {
      // Stack existing item
      const newQuantity = existingItem.quantity + quantity

      if (newQuantity > existingItem.maxStack) {
        this.emit('stackFull', { item: existingItem })
        return false
      }

      existingItem.quantity = newQuantity
      this.emit('itemUpdated', { item: existingItem })
    } else {
      // Add new item
      const newItem: InventoryItem = {
        ...item,
        quantity,
        acquiredAt: new Date(),
      }

      this.items.set(item.id, newItem)
      this.emit('itemAdded', { item: newItem })
    }

    this.saveInventory()
    return true
  }

  /**
   * Remove item from inventory
   */
  removeItem(itemId: string, quantity: number = 1): boolean {
    const item = this.items.get(itemId)

    if (!item) {
      return false
    }

    if (quantity >= item.quantity) {
      // Remove completely
      this.items.delete(itemId)
      this.emit('itemRemoved', { item })
    } else {
      // Decrease quantity
      item.quantity -= quantity
      this.emit('itemUpdated', { item })
    }

    this.saveInventory()
    return true
  }

  /**
   * Use item
   */
  useItem(itemId: string): boolean {
    const item = this.items.get(itemId)

    if (!item || !item.usable) {
      return false
    }

    this.emit('itemUsed', { item })

    // If consumable, decrease quantity
    if (item.type === ItemType.CONSUMABLE) {
      this.removeItem(itemId, 1)
    }

    return true
  }

  /**
   * Get item by ID
   */
  getItem(itemId: string): InventoryItem | undefined {
    return this.items.get(itemId)
  }

  /**
   * Get all items
   */
  getAllItems(): InventoryItem[] {
    return Array.from(this.items.values())
  }

  /**
   * Get items by type
   */
  getItemsByType(type: ItemType): InventoryItem[] {
    return this.getAllItems().filter((item) => item.type === type)
  }

  /**
   * Get items by category
   */
  getItemsByCategory(category: ItemCategory): InventoryItem[] {
    return this.getAllItems().filter((item) => item.category === category)
  }

  /**
   * Get items by rarity
   */
  getItemsByRarity(rarity: ItemRarity): InventoryItem[] {
    return this.getAllItems().filter((item) => item.rarity === rarity)
  }

  /**
   * Check if has item
   */
  hasItem(itemId: string, quantity: number = 1): boolean {
    const item = this.items.get(itemId)
    return item ? item.quantity >= quantity : false
  }

  /**
   * Get item count
   */
  getItemCount(itemId: string): number {
    return this.items.get(itemId)?.quantity || 0
  }

  /**
   * Get total item count
   */
  getTotalItemCount(): number {
    let total = 0
    for (const item of this.items.values()) {
      total += item.quantity
    }
    return total
  }

  /**
   * Get used slots
   */
  getUsedSlots(): number {
    return this.items.size
  }

  /**
   * Get available slots
   */
  getAvailableSlots(): number {
    return this.config.maxSlots - this.items.size
  }

  /**
   * Is inventory full
   */
  isFull(): boolean {
    return this.items.size >= this.config.maxSlots
  }

  /**
   * Sort items
   */
  sortItems(
    sortBy: 'name' | 'type' | 'rarity' | 'quantity' | 'date' = 'name',
    order: 'asc' | 'desc' = 'asc'
  ): InventoryItem[] {
    const items = this.getAllItems()

    items.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'type':
          comparison = a.type.localeCompare(b.type)
          break
        case 'rarity':
          comparison = this.getRarityValue(a.rarity) - this.getRarityValue(b.rarity)
          break
        case 'quantity':
          comparison = a.quantity - b.quantity
          break
        case 'date':
          comparison = a.acquiredAt.getTime() - b.acquiredAt.getTime()
          break
      }

      return order === 'asc' ? comparison : -comparison
    })

    return items
  }

  /**
   * Filter items
   */
  filterItems(predicate: (item: InventoryItem) => boolean): InventoryItem[] {
    return this.getAllItems().filter(predicate)
  }

  /**
   * Search items
   */
  searchItems(query: string): InventoryItem[] {
    const lowerQuery = query.toLowerCase()
    return this.getAllItems().filter(
      (item) =>
        item.name.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery)
    )
  }

  /**
   * Clear inventory
   */
  clearInventory(): void {
    this.items.clear()
    this.emit('inventoryCleared', {})
    this.saveInventory()
  }

  /**
   * Get inventory statistics
   */
  getStatistics(): {
    totalItems: number
    totalSlots: number
    usedSlots: number
    availableSlots: number
    itemsByType: Record<ItemType, number>
    itemsByRarity: Record<ItemRarity, number>
    mostCommonType: ItemType
    mostCommonRarity: ItemRarity
  } {
    const itemsByType: Record<string, number> = {}
    const itemsByRarity: Record<string, number> = {}

    for (const item of this.items.values()) {
      itemsByType[item.type] = (itemsByType[item.type] || 0) + 1
      itemsByRarity[item.rarity] = (itemsByRarity[item.rarity] || 0) + 1
    }

    const mostCommonType = (Object.entries(itemsByType).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      ItemType.COLLECTIBLE) as ItemType

    const mostCommonRarity = (Object.entries(itemsByRarity).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      ItemRarity.COMMON) as ItemRarity

    return {
      totalItems: this.getTotalItemCount(),
      totalSlots: this.config.maxSlots,
      usedSlots: this.getUsedSlots(),
      availableSlots: this.getAvailableSlots(),
      itemsByType: itemsByType as Record<ItemType, number>,
      itemsByRarity: itemsByRarity as Record<ItemRarity, number>,
      mostCommonType,
      mostCommonRarity,
    }
  }

  /**
   * Export inventory
   */
  exportInventory(): string {
    return JSON.stringify({
      items: Array.from(this.items.entries()),
      config: this.config,
      exportedAt: new Date().toISOString(),
    })
  }

  /**
   * Import inventory
   */
  importInventory(data: string): boolean {
    try {
      const parsed = JSON.parse(data)

      this.items.clear()

      for (const [id, item] of parsed.items) {
        this.items.set(id, {
          ...item,
          acquiredAt: new Date(item.acquiredAt),
        })
      }

      this.emit('inventoryImported', {})
      this.saveInventory()
      return true
    } catch (error) {
      console.error('Failed to import inventory:', error)
      return false
    }
  }

  /**
   * Save inventory to storage
   */
  private saveInventory(): void {
    try {
      const data = {
        items: Array.from(this.items.entries()),
        savedAt: new Date().toISOString(),
      }

      localStorage.setItem(this.config.persistKey, JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save inventory:', error)
    }
  }

  /**
   * Load inventory from storage
   */
  private loadInventory(): void {
    try {
      const data = localStorage.getItem(this.config.persistKey)

      if (data) {
        const parsed = JSON.parse(data)

        for (const [id, item] of parsed.items) {
          this.items.set(id, {
            ...item,
            acquiredAt: new Date(item.acquiredAt),
          })
        }

        this.emit('inventoryLoaded', {})
      }
    } catch (error) {
      console.error('Failed to load inventory:', error)
    }
  }

  /**
   * Start auto-save
   */
  private startAutoSave(): void {
    this.autoSaveTimer = setInterval(() => {
      this.saveInventory()
    }, this.config.autoSaveInterval)
  }

  /**
   * Stop auto-save
   */
  private stopAutoSave(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer)
      this.autoSaveTimer = undefined
    }
  }

  /**
   * Get rarity value for sorting
   */
  private getRarityValue(rarity: ItemRarity): number {
    const values = {
      [ItemRarity.COMMON]: 1,
      [ItemRarity.UNCOMMON]: 2,
      [ItemRarity.RARE]: 3,
      [ItemRarity.EPIC]: 4,
      [ItemRarity.LEGENDARY]: 5,
      [ItemRarity.MYTHIC]: 6,
    }
    return values[rarity] || 0
  }

  /**
   * Add event listener
   */
  on(event: string, callback: EventCallback): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set())
    }
    this.eventListeners.get(event)!.add(callback)
  }

  /**
   * Remove event listener
   */
  off(event: string, callback: EventCallback): void {
    this.eventListeners.get(event)?.delete(callback)
  }

  /**
   * Emit event
   */
  private emit(event: string, data: unknown): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach((callback) => callback(data))
    }
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.stopAutoSave()
    this.saveInventory()
    this.items.clear()
    this.eventListeners.clear()
  }
}

export default InventorySystem
