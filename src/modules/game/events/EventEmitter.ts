/**
 * Game event emitter for decoupled communication
 */

import { GameEvent, GameEventHandler } from './EventTypes'

export class GameEventEmitter {
  private listeners: Map<string, Set<GameEventHandler>>

  constructor() {
    this.listeners = new Map()
  }

  on<T extends GameEvent>(eventType: string, handler: GameEventHandler<T>): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set())
    }

    const handlers = this.listeners.get(eventType)
    handlers?.add(handler as GameEventHandler)

    return () => this.off(eventType, handler)
  }

  once<T extends GameEvent>(eventType: string, handler: GameEventHandler<T>): void {
    const onceHandler: GameEventHandler<T> = event => {
      handler(event)
      this.off(eventType, onceHandler)
    }
    this.on(eventType, onceHandler)
  }

  off<T extends GameEvent>(eventType: string, handler: GameEventHandler<T>): void {
    const handlers = this.listeners.get(eventType)
    if (handlers) {
      handlers.delete(handler as GameEventHandler)
      if (handlers.size === 0) {
        this.listeners.delete(eventType)
      }
    }
  }

  emit<T extends GameEvent>(event: T): void {
    const handlers = this.listeners.get(event.type)
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(event)
        } catch (error) {
          console.error(`Error in event handler for ${event.type}:`, error)
        }
      })
    }
  }

  clear(eventType?: string): void {
    if (eventType) {
      this.listeners.delete(eventType)
    } else {
      this.listeners.clear()
    }
  }

  getListenerCount(eventType: string): number {
    return this.listeners.get(eventType)?.size ?? 0
  }
}
