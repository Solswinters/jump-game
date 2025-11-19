/**
 * Manager for game triggers
 */

import { Trigger, TriggerConfig } from './Trigger'

export class TriggerManager {
  private triggers: Map<string, Trigger>

  constructor() {
    this.triggers = new Map()
  }

  addTrigger(config: TriggerConfig): Trigger {
    const trigger = new Trigger(config)
    this.triggers.set(config.id, trigger)
    return trigger
  }

  removeTrigger(id: string): void {
    this.triggers.delete(id)
  }

  getTrigger(id: string): Trigger | undefined {
    return this.triggers.get(id)
  }

  checkEntity(entityId: string, x: number, y: number, width: number, height: number): void {
    for (const trigger of this.triggers.values()) {
      trigger.checkEntity(entityId, x, y, width, height)
    }
  }

  reset(): void {
    for (const trigger of this.triggers.values()) {
      trigger.reset()
    }
  }

  clear(): void {
    this.triggers.clear()
  }

  getActiveTriggers(): Trigger[] {
    return Array.from(this.triggers.values()).filter(trigger => trigger.isActive())
  }

  getTriggersInArea(x: number, y: number, width: number, height: number): Trigger[] {
    return Array.from(this.triggers.values()).filter(trigger => {
      return (
        x < trigger.x + trigger.width &&
        x + width > trigger.x &&
        y < trigger.y + trigger.height &&
        y + height > trigger.y
      )
    })
  }
}
