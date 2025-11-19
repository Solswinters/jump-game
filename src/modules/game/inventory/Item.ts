/**
 * Item system for inventory management
 */

export interface ItemProperties {
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  stackable?: boolean
  maxStack?: number
  tradeable?: boolean
  consumable?: boolean
  [key: string]: unknown
}

export interface ItemConfig {
  id: string
  name: string
  description: string
  type: 'powerup' | 'consumable' | 'equipment' | 'resource' | 'currency'
  properties?: ItemProperties
}

export class Item {
  id: string
  name: string
  description: string
  type: string
  properties: ItemProperties
  quantity: number

  constructor(config: ItemConfig, quantity = 1) {
    this.id = config.id
    this.name = config.name
    this.description = config.description
    this.type = config.type
    this.properties = {
      rarity: 'common',
      stackable: true,
      maxStack: 99,
      tradeable: true,
      consumable: false,
      ...config.properties,
    }
    this.quantity = quantity
  }

  canStack(other: Item): boolean {
    return (
      this.id === other.id &&
      this.properties.stackable === true &&
      this.quantity < this.getMaxStack()
    )
  }

  getMaxStack(): number {
    return (this.properties.maxStack as number) ?? 99
  }

  addQuantity(amount: number): number {
    const maxStack = this.getMaxStack()
    const newQuantity = Math.min(this.quantity + amount, maxStack)
    const added = newQuantity - this.quantity
    this.quantity = newQuantity
    return added
  }

  removeQuantity(amount: number): number {
    const removed = Math.min(this.quantity, amount)
    this.quantity -= removed
    return removed
  }

  isEmpty(): boolean {
    return this.quantity <= 0
  }

  clone(quantity?: number): Item {
    const item = new Item(
      {
        id: this.id,
        name: this.name,
        description: this.description,
        type: this.type as ItemConfig['type'],
        properties: { ...this.properties },
      },
      quantity ?? this.quantity
    )
    return item
  }
}
