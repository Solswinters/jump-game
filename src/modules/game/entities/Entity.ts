/**
 * Base entity class for game objects
 */

export interface EntityOptions {
  id: string
  x: number
  y: number
  width: number
  height: number
  type: string
}

export class Entity {
  id: string
  x: number
  y: number
  width: number
  height: number
  type: string
  active: boolean
  visible: boolean

  constructor(options: EntityOptions) {
    this.id = options.id
    this.x = options.x
    this.y = options.y
    this.width = options.width
    this.height = options.height
    this.type = options.type
    this.active = true
    this.visible = true
  }

  update(_deltaTime: number): void {
    // Override in subclasses
  }

  render(_ctx: CanvasRenderingContext2D): void {
    // Override in subclasses
  }

  getBounds(): { x: number; y: number; width: number; height: number } {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    }
  }

  getCenter(): { x: number; y: number } {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
    }
  }

  distanceTo(other: Entity): number {
    const center1 = this.getCenter()
    const center2 = other.getCenter()
    const dx = center2.x - center1.x
    const dy = center2.y - center1.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  destroy(): void {
    this.active = false
    this.visible = false
  }
}
