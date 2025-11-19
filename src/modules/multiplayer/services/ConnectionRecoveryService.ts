/**
 * Connection recovery service for handling disconnections
 */

export interface RecoveryState {
  isRecovering: boolean
  attemptCount: number
  lastAttemptTime: number
  sessionData?: unknown
}

export class ConnectionRecoveryService {
  private recoveryState: RecoveryState = {
    isRecovering: false,
    attemptCount: 0,
    lastAttemptTime: 0,
  }

  private readonly maxAttempts = 5
  private readonly recoveryWindow = 30000 // 30 seconds

  /**
   * Start recovery process
   */
  startRecovery(sessionData?: unknown): void {
    this.recoveryState = {
      isRecovering: true,
      attemptCount: 0,
      lastAttemptTime: Date.now(),
      sessionData,
    }
  }

  /**
   * Record recovery attempt
   */
  recordAttempt(): boolean {
    if (!this.recoveryState.isRecovering) return false

    this.recoveryState.attemptCount++
    this.recoveryState.lastAttemptTime = Date.now()

    // Check if exceeded max attempts
    if (this.recoveryState.attemptCount >= this.maxAttempts) {
      this.failRecovery()
      return false
    }

    return true
  }

  /**
   * Mark recovery as successful
   */
  successfulRecovery(): void {
    this.recoveryState = {
      isRecovering: false,
      attemptCount: 0,
      lastAttemptTime: 0,
    }
  }

  /**
   * Mark recovery as failed
   */
  failRecovery(): void {
    this.recoveryState.isRecovering = false
  }

  /**
   * Check if recovery is possible
   */
  canRecover(): boolean {
    if (!this.recoveryState.isRecovering) return true

    const timeSinceLastAttempt = Date.now() - this.recoveryState.lastAttemptTime

    // Too long since last attempt
    if (timeSinceLastAttempt > this.recoveryWindow) {
      this.failRecovery()
      return false
    }

    // Too many attempts
    if (this.recoveryState.attemptCount >= this.maxAttempts) {
      return false
    }

    return true
  }

  /**
   * Get recovery state
   */
  getState(): RecoveryState {
    return { ...this.recoveryState }
  }

  /**
   * Reset recovery state
   */
  reset(): void {
    this.recoveryState = {
      isRecovering: false,
      attemptCount: 0,
      lastAttemptTime: 0,
    }
  }
}
