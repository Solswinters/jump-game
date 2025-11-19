/**
 * Game state synchronization service
 */

export interface GameStateSnapshot {
  timestamp: number
  tick: number
  players: Record<string, PlayerState>
  entities: Record<string, EntityState>
  events: GameEvent[]
}

export interface PlayerState {
  id: string
  position: { x: number; y: number }
  velocity: { x: number; y: number }
  score: number
  health: number
  isAlive: boolean
}

export interface EntityState {
  id: string
  type: string
  position: { x: number; y: number }
  data: unknown
}

export interface GameEvent {
  id: string
  type: string
  timestamp: number
  data: unknown
}

export interface SyncConfig {
  tickRate: number // Hz
  snapshotRate: number // Hz
  interpolationDelay: number // ms
  predictionEnabled: boolean
  reconciliationEnabled: boolean
}

const DEFAULT_CONFIG: SyncConfig = {
  tickRate: 60,
  snapshotRate: 20,
  interpolationDelay: 100,
  predictionEnabled: true,
  reconciliationEnabled: true,
}

export class SyncService {
  private config: SyncConfig
  private currentTick = 0
  private snapshots: GameStateSnapshot[] = []
  private maxSnapshots = 100
  private pendingInputs: Map<number, unknown[]> = new Map()

  constructor(config?: Partial<SyncConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  /**
   * Create game state snapshot
   */
  createSnapshot(
    players: Record<string, PlayerState>,
    entities: Record<string, EntityState>,
    events: GameEvent[]
  ): GameStateSnapshot {
    const snapshot: GameStateSnapshot = {
      timestamp: Date.now(),
      tick: this.currentTick++,
      players: JSON.parse(JSON.stringify(players)),
      entities: JSON.parse(JSON.stringify(entities)),
      events: [...events],
    }

    this.snapshots.push(snapshot)

    // Keep only last N snapshots
    if (this.snapshots.length > this.maxSnapshots) {
      this.snapshots.shift()
    }

    return snapshot
  }

  /**
   * Get snapshot by tick
   */
  getSnapshot(tick: number): GameStateSnapshot | undefined {
    return this.snapshots.find(s => s.tick === tick)
  }

  /**
   * Get latest snapshot
   */
  getLatestSnapshot(): GameStateSnapshot | undefined {
    return this.snapshots[this.snapshots.length - 1]
  }

  /**
   * Get snapshots in time range
   */
  getSnapshotsInRange(startTime: number, endTime: number): GameStateSnapshot[] {
    return this.snapshots.filter(s => s.timestamp >= startTime && s.timestamp <= endTime)
  }

  /**
   * Interpolate between two snapshots
   */
  interpolate(
    snapshot1: GameStateSnapshot,
    snapshot2: GameStateSnapshot,
    alpha: number
  ): GameStateSnapshot {
    const interpolated: GameStateSnapshot = {
      timestamp: snapshot1.timestamp + (snapshot2.timestamp - snapshot1.timestamp) * alpha,
      tick: snapshot1.tick,
      players: {},
      entities: {},
      events: [],
    }

    // Interpolate player positions
    Object.keys(snapshot1.players).forEach(playerId => {
      const p1 = snapshot1.players[playerId]
      const p2 = snapshot2.players[playerId]

      if (p1 && p2) {
        interpolated.players[playerId] = {
          ...p1,
          position: {
            x: p1.position.x + (p2.position.x - p1.position.x) * alpha,
            y: p1.position.y + (p2.position.y - p1.position.y) * alpha,
          },
        }
      }
    })

    // Interpolate entity positions
    Object.keys(snapshot1.entities).forEach(entityId => {
      const e1 = snapshot1.entities[entityId]
      const e2 = snapshot2.entities[entityId]

      if (e1 && e2) {
        interpolated.entities[entityId] = {
          ...e1,
          position: {
            x: e1.position.x + (e2.position.x - e1.position.x) * alpha,
            y: e1.position.y + (e2.position.y - e1.position.y) * alpha,
          },
        }
      }
    })

    return interpolated
  }

  /**
   * Get interpolated state for current time
   */
  getInterpolatedState(currentTime: number): GameStateSnapshot | null {
    const renderTime = currentTime - this.config.interpolationDelay

    // Find two snapshots to interpolate between
    let snapshot1: GameStateSnapshot | undefined
    let snapshot2: GameStateSnapshot | undefined

    for (let i = this.snapshots.length - 1; i >= 0; i--) {
      if (this.snapshots[i].timestamp <= renderTime) {
        snapshot1 = this.snapshots[i]
        snapshot2 = this.snapshots[i + 1]
        break
      }
    }

    if (!snapshot1 || !snapshot2) {
      return this.getLatestSnapshot() ?? null
    }

    const timeDiff = snapshot2.timestamp - snapshot1.timestamp
    if (timeDiff === 0) return snapshot1

    const alpha = (renderTime - snapshot1.timestamp) / timeDiff
    return this.interpolate(snapshot1, snapshot2, Math.max(0, Math.min(1, alpha)))
  }

  /**
   * Add pending input for client-side prediction
   */
  addPendingInput(tick: number, input: unknown): void {
    if (!this.pendingInputs.has(tick)) {
      this.pendingInputs.set(tick, [])
    }
    this.pendingInputs.get(tick)!.push(input)
  }

  /**
   * Reconcile predicted state with server state
   */
  reconcile(serverSnapshot: GameStateSnapshot): void {
    if (!this.config.reconciliationEnabled) return

    const serverTick = serverSnapshot.tick

    // Remove acknowledged inputs
    Array.from(this.pendingInputs.keys()).forEach(tick => {
      if (tick <= serverTick) {
        this.pendingInputs.delete(tick)
      }
    })

    // Re-apply remaining inputs
    // (This would need actual game logic to properly reconcile)
  }

  /**
   * Clear old snapshots
   */
  clearOldSnapshots(beforeTimestamp: number): void {
    this.snapshots = this.snapshots.filter(s => s.timestamp >= beforeTimestamp)
  }

  /**
   * Reset sync state
   */
  reset(): void {
    this.currentTick = 0
    this.snapshots = []
    this.pendingInputs.clear()
  }

  /**
   * Get current tick
   */
  getCurrentTick(): number {
    return this.currentTick
  }

  /**
   * Get tick rate
   */
  getTickRate(): number {
    return this.config.tickRate
  }
}
