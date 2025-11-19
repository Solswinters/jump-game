/**
 * Entity manager for tracking and updating game objects
 */

import { Entity } from './Entity'

export class EntityManager {
  private entities: Map<string, Entity>
  private entitiesByType: Map<string, Set<string>>

  constructor() {
    this.entities = new Map()
    this.entitiesByType = new Map()
  }

  add(entity: Entity): void {
    this.entities.set(entity.id, entity)

    if (!this.entitiesByType.has(entity.type)) {
      this.entitiesByType.set(entity.type, new Set())
    }

    this.entitiesByType.get(entity.type)?.add(entity.id)
  }

  remove(entityId: string): void {
    const entity = this.entities.get(entityId)
    if (entity) {
      this.entitiesByType.get(entity.type)?.delete(entityId)
      this.entities.delete(entityId)
    }
  }

  get(entityId: string): Entity | undefined {
    return this.entities.get(entityId)
  }

  getByType(type: string): Entity[] {
    const ids = this.entitiesByType.get(type)
    if (!ids) return []

    return Array.from(ids)
      .map(id => this.entities.get(id))
      .filter((entity): entity is Entity => entity !== undefined)
  }

  getAll(): Entity[] {
    return Array.from(this.entities.values())
  }

  update(deltaTime: number): void {
    for (const entity of this.entities.values()) {
      if (entity.active) {
        entity.update(deltaTime)
      }
    }

    // Clean up inactive entities
    for (const [id, entity] of this.entities.entries()) {
      if (!entity.active) {
        this.remove(id)
      }
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    for (const entity of this.entities.values()) {
      if (entity.visible) {
        entity.render(ctx)
      }
    }
  }

  clear(): void {
    this.entities.clear()
    this.entitiesByType.clear()
  }

  count(): number {
    return this.entities.size
  }

  countByType(type: string): number {
    return this.entitiesByType.get(type)?.size ?? 0
  }
}
