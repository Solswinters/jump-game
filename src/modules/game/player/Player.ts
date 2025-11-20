/**
 * Player entity with state, abilities and power-ups
 */

import { PHYSICS, PLAYER, CANVAS } from '../constants'
import type { Position, Velocity } from '../utils/physics'

export interface PlayerState {
  position: Position
  velocity: Velocity
  isGrounded: boolean
  isAlive: boolean
  canDoubleJump: boolean
  hasDoubleJumped: boolean
  isInvincible: boolean
  size: number
  speedMultiplier: number
  jumpPowerMultiplier: number
  health: number
  maxHealth: number
}

export interface PowerUp {
  type: 'invincibility' | 'double_jump' | 'speed' | 'shield'
  duration: number
  startTime: number
}

export interface PlayerStats {
  totalJumps: number
  doubleJumps: number
  damagesTaken: number
  powerUpsCollected: number
  distanceTraveled: number
  airTime: number
}

export class Player {
  private state: PlayerState
  private activePowerUps: Map<string, PowerUp> = new Map()
  private stats: PlayerStats = {
    totalJumps: 0,
    doubleJumps: 0,
    damagesTaken: 0,
    powerUpsCollected: 0,
    distanceTraveled: 0,
    airTime: 0,
  }
  private lastGroundedTime: number = 0
  private stateChangeCallbacks: Set<(state: PlayerState) => void> = new Set()

  constructor() {
    this.state = {
      position: { x: PLAYER.START_X, y: CANVAS.GROUND_Y - PLAYER.SIZE },
      velocity: { x: 0, y: 0 },
      isGrounded: false,
      isAlive: true,
      canDoubleJump: false,
      hasDoubleJumped: false,
      isInvincible: false,
      size: PLAYER.SIZE,
      speedMultiplier: 1,
      jumpPowerMultiplier: 1,
      health: 3,
      maxHealth: 3,
    }
    this.lastGroundedTime = Date.now()
  }

  update(deltaTime: number): void {
    if (!this.state.isAlive) {
      return
    }

    // Update power-ups
    this.updatePowerUps()

    // Apply gravity
    this.state.velocity.y += PHYSICS.GRAVITY
    this.state.velocity.y = Math.min(this.state.velocity.y, PHYSICS.TERMINAL_VELOCITY)

    // Update position with speed multiplier
    this.state.position.y += this.state.velocity.y * this.state.speedMultiplier

    // Track air time
    if (!this.state.isGrounded) {
      const now = Date.now()
      this.stats.airTime += now - this.lastGroundedTime
    }

    // Ground collision
    const groundY = CANVAS.GROUND_Y - this.state.size
    if (this.state.position.y >= groundY) {
      this.state.position.y = groundY
      this.state.velocity.y = 0

      if (!this.state.isGrounded) {
        this.lastGroundedTime = Date.now()
      }

      this.state.isGrounded = true
      this.state.hasDoubleJumped = false
    } else {
      this.state.isGrounded = false
    }

    this.notifyStateChange()
  }

  private updatePowerUps(): void {
    const now = Date.now()
    const expired: string[] = []

    for (const [type, powerUp] of this.activePowerUps.entries()) {
      if (now - powerUp.startTime > powerUp.duration) {
        expired.push(type)
      }
    }

    expired.forEach((type) => {
      this.removePowerUp(type as PowerUp['type'])
    })
  }

  private notifyStateChange(): void {
    this.stateChangeCallbacks.forEach((callback) => callback(this.state))
  }

  jump(): boolean {
    if (this.state.isGrounded) {
      this.state.velocity.y = -PHYSICS.JUMP_POWER * this.state.jumpPowerMultiplier
      this.state.isGrounded = false
      this.stats.totalJumps++
      return true
    } else if (this.state.canDoubleJump && !this.state.hasDoubleJumped) {
      this.state.velocity.y = -PHYSICS.DOUBLE_JUMP_POWER * this.state.jumpPowerMultiplier
      this.state.hasDoubleJumped = true
      this.stats.totalJumps++
      this.stats.doubleJumps++
      return true
    }
    return false
  }

  die(): void {
    if (!this.state.isInvincible) {
      this.state.isAlive = false
      this.notifyStateChange()
    }
  }

  takeDamage(amount = 1): boolean {
    if (this.state.isInvincible || !this.state.isAlive) {
      return false
    }

    this.state.health = Math.max(0, this.state.health - amount)
    this.stats.damagesTaken++

    if (this.state.health <= 0) {
      this.die()
    }

    this.notifyStateChange()
    return true
  }

  heal(amount = 1): void {
    this.state.health = Math.min(this.state.maxHealth, this.state.health + amount)
    this.notifyStateChange()
  }

  reset(): void {
    this.state = {
      position: { x: PLAYER.START_X, y: CANVAS.GROUND_Y - PLAYER.SIZE },
      velocity: { x: 0, y: 0 },
      isGrounded: false,
      isAlive: true,
      canDoubleJump: false,
      hasDoubleJumped: false,
      isInvincible: false,
      size: PLAYER.SIZE,
      speedMultiplier: 1,
      jumpPowerMultiplier: 1,
      health: 3,
      maxHealth: 3,
    }
    this.activePowerUps.clear()
    this.lastGroundedTime = Date.now()
    this.notifyStateChange()
  }

  getState(): PlayerState {
    return { ...this.state }
  }

  getPosition(): Position {
    return { ...this.state.position }
  }

  getBounds(): { x: number; y: number; width: number; height: number } {
    return {
      x: this.state.position.x,
      y: this.state.position.y,
      width: this.state.size,
      height: this.state.size,
    }
  }

  setInvincible(invincible: boolean): void {
    this.state.isInvincible = invincible
  }

  setDoubleJump(enabled: boolean): void {
    this.state.canDoubleJump = enabled
  }

  isAlive(): boolean {
    return this.state.isAlive
  }

  applyPowerUp(type: PowerUp['type'], duration: number): void {
    const powerUp: PowerUp = {
      type,
      duration,
      startTime: Date.now(),
    }

    this.activePowerUps.set(type, powerUp)
    this.stats.powerUpsCollected++

    switch (type) {
      case 'invincibility':
        this.state.isInvincible = true
        break
      case 'double_jump':
        this.state.canDoubleJump = true
        break
      case 'speed':
        this.state.speedMultiplier = 1.5
        break
      case 'shield':
        this.state.health = Math.min(this.state.health + 1, this.state.maxHealth)
        break
    }

    this.notifyStateChange()
  }

  removePowerUp(type: PowerUp['type']): void {
    this.activePowerUps.delete(type)

    switch (type) {
      case 'invincibility':
        this.state.isInvincible = false
        break
      case 'double_jump':
        this.state.canDoubleJump = false
        break
      case 'speed':
        this.state.speedMultiplier = 1
        break
    }

    this.notifyStateChange()
  }

  getActivePowerUps(): PowerUp[] {
    return Array.from(this.activePowerUps.values())
  }

  hasPowerUp(type: PowerUp['type']): boolean {
    return this.activePowerUps.has(type)
  }

  getPowerUpTimeRemaining(type: PowerUp['type']): number {
    const powerUp = this.activePowerUps.get(type)
    if (!powerUp) {
      return 0
    }

    const elapsed = Date.now() - powerUp.startTime
    return Math.max(0, powerUp.duration - elapsed)
  }

  getStats(): PlayerStats {
    return { ...this.stats }
  }

  resetStats(): void {
    this.stats = {
      totalJumps: 0,
      doubleJumps: 0,
      damagesTaken: 0,
      powerUpsCollected: 0,
      distanceTraveled: 0,
      airTime: 0,
    }
  }

  getHealth(): number {
    return this.state.health
  }

  getMaxHealth(): number {
    return this.state.maxHealth
  }

  onStateChange(callback: (state: PlayerState) => void): () => void {
    this.stateChangeCallbacks.add(callback)
    return () => this.stateChangeCallbacks.delete(callback)
  }

  cleanup(): void {
    this.activePowerUps.clear()
    this.stateChangeCallbacks.clear()
  }
}
