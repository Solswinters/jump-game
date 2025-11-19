/**
 * Trigger system for event-based interactions
 */

export type TriggerType = 'enter' | 'exit' | 'stay'

export interface TriggerConfig {
  id: string
  x: number
  y: number
  width: number
  height: number
  type: TriggerType
  oneTime?: boolean
  cooldown?: number
  onActivate: () => void
}

export class Trigger {
  id: string
  x: number
  y: number
  width: number
  height: number
  type: TriggerType
  oneTime: boolean
  cooldown: number
  onActivate: () => void

  private activated: boolean
  private lastActivation: number
  private entitiesInside: Set<string>

  constructor(config: TriggerConfig) {
    this.id = config.id
    this.x = config.x
    this.y = config.y
    this.width = config.width
    this.height = config.height
    this.type = config.type
    this.oneTime = config.oneTime ?? false
    this.cooldown = config.cooldown ?? 0
    this.onActivate = config.onActivate

    this.activated = false
    this.lastActivation = 0
    this.entitiesInside = new Set()
  }

  checkEntity(entityId: string, x: number, y: number, width: number, height: number): void {
    const isInside =
      x < this.x + this.width &&
      x + width > this.x &&
      y < this.y + this.height &&
      y + height > this.y

    const wasInside = this.entitiesInside.has(entityId)

    if (isInside && !wasInside) {
      // Entity entered
      this.entitiesInside.add(entityId)
      if (this.type === 'enter') {
        this.tryActivate()
      }
    } else if (!isInside && wasInside) {
      // Entity exited
      this.entitiesInside.delete(entityId)
      if (this.type === 'exit') {
        this.tryActivate()
      }
    } else if (isInside && wasInside) {
      // Entity staying
      if (this.type === 'stay') {
        this.tryActivate()
      }
    }
  }

  private tryActivate(): void {
    if (this.oneTime && this.activated) {
      return
    }

    const now = Date.now()
    if (now - this.lastActivation < this.cooldown) {
      return
    }

    this.onActivate()
    this.activated = true
    this.lastActivation = now
  }

  reset(): void {
    this.activated = false
    this.entitiesInside.clear()
  }

  isActive(): boolean {
    return this.entitiesInside.size > 0
  }

  getEntityCount(): number {
    return this.entitiesInside.size
  }
}
