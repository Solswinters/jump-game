/**
 * Event emitter utility for game events
 * Provides a type-safe event system for game components
 */

export type EventCallback = (...args: any[]) => void

export interface EventSubscription {
  unsubscribe: () => void
}

export class GameEventEmitter {
  private events: Map<string, EventCallback[]> = new Map()
  private onceEvents: Map<string, EventCallback[]> = new Map()

  /**
   * Subscribe to an event
   */
  on(event: string, callback: EventCallback): EventSubscription {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }

    this.events.get(event)!.push(callback)

    return {
      unsubscribe: () => this.off(event, callback),
    }
  }

  /**
   * Subscribe to an event once
   */
  once(event: string, callback: EventCallback): EventSubscription {
    if (!this.onceEvents.has(event)) {
      this.onceEvents.set(event, [])
    }

    this.onceEvents.get(event)!.push(callback)

    return {
      unsubscribe: () => {
        const callbacks = this.onceEvents.get(event)
        if (callbacks) {
          const index = callbacks.indexOf(callback)
          if (index !== -1) {
            callbacks.splice(index, 1)
          }
        }
      },
    }
  }

  /**
   * Unsubscribe from an event
   */
  off(event: string, callback: EventCallback): void {
    const callbacks = this.events.get(event)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index !== -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  /**
   * Emit an event
   */
  emit(event: string, ...args: any[]): void {
    // Handle regular listeners
    const callbacks = this.events.get(event)
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(...args)
        } catch (error) {
          console.error(`Error in event listener for "${event}":`, error)
        }
      })
    }

    // Handle once listeners
    const onceCallbacks = this.onceEvents.get(event)
    if (onceCallbacks && onceCallbacks.length > 0) {
      // Create a copy of callbacks before executing them
      const callbacksCopy = [...onceCallbacks]
      this.onceEvents.set(event, [])

      callbacksCopy.forEach((callback) => {
        try {
          callback(...args)
        } catch (error) {
          console.error(`Error in once event listener for "${event}":`, error)
        }
      })
    }
  }

  /**
   * Remove all listeners for an event
   */
  removeAllListeners(event?: string): void {
    if (event) {
      this.events.delete(event)
      this.onceEvents.delete(event)
    } else {
      this.events.clear()
      this.onceEvents.clear()
    }
  }

  /**
   * Get listener count for an event
   */
  listenerCount(event: string): number {
    const regular = this.events.get(event)?.length || 0
    const once = this.onceEvents.get(event)?.length || 0
    return regular + once
  }

  /**
   * Get all event names
   */
  eventNames(): string[] {
    const allEvents = new Set([...this.events.keys(), ...this.onceEvents.keys()])
    return Array.from(allEvents)
  }

  /**
   * Check if an event has listeners
   */
  hasListeners(event: string): boolean {
    return this.listenerCount(event) > 0
  }
}

/**
 * Typed event emitter for specific game events
 */
export class TypedGameEventEmitter<EventMap extends Record<string, any[]>> {
  private emitter = new GameEventEmitter()

  on<K extends keyof EventMap>(
    event: K,
    callback: (...args: EventMap[K]) => void
  ): EventSubscription {
    return this.emitter.on(event as string, callback)
  }

  once<K extends keyof EventMap>(
    event: K,
    callback: (...args: EventMap[K]) => void
  ): EventSubscription {
    return this.emitter.once(event as string, callback)
  }

  off<K extends keyof EventMap>(event: K, callback: (...args: EventMap[K]) => void): void {
    this.emitter.off(event as string, callback)
  }

  emit<K extends keyof EventMap>(event: K, ...args: EventMap[K]): void {
    this.emitter.emit(event as string, ...args)
  }

  removeAllListeners<K extends keyof EventMap>(event?: K): void {
    this.emitter.removeAllListeners(event as string | undefined)
  }

  listenerCount<K extends keyof EventMap>(event: K): number {
    return this.emitter.listenerCount(event as string)
  }

  eventNames(): (keyof EventMap)[] {
    return this.emitter.eventNames()
  }

  hasListeners<K extends keyof EventMap>(event: K): boolean {
    return this.emitter.hasListeners(event as string)
  }
}

/**
 * Common game event types
 */
export interface GameEvents {
  // Player events
  'player:jump': []
  'player:land': []
  'player:damage': [damage: number]
  'player:heal': [amount: number]
  'player:die': []
  'player:respawn': []

  // Game state events
  'game:start': []
  'game:pause': []
  'game:resume': []
  'game:over': [score: number]
  'game:levelComplete': [level: number]

  // Collectible events
  'collectible:coin': [value: number]
  'collectible:powerup': [type: string]

  // Obstacle events
  'obstacle:hit': [obstacleType: string]

  // Achievement events
  'achievement:unlocked': [achievementId: string]

  // Multiplayer events
  'multiplayer:connected': []
  'multiplayer:disconnected': []
  'multiplayer:playerJoined': [playerId: string]
  'multiplayer:playerLeft': [playerId: string]

  // Web3 events
  'web3:connected': [address: string]
  'web3:disconnected': []
  'web3:transactionPending': [hash: string]
  'web3:transactionSuccess': [hash: string]
  'web3:transactionFailed': [error: Error]

  // UI events
  'ui:menuOpen': [menuName: string]
  'ui:menuClose': [menuName: string]
}

/**
 * Global game event emitter instance
 */
export const gameEvents = new TypedGameEventEmitter<GameEvents>()
