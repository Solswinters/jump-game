/**
 * Countdown timer utility
 */

export interface CountdownOptions {
  onTick?: (remaining: number) => void
  onComplete?: () => void
  interval?: number
}

export class Countdown {
  private timeoutId: NodeJS.Timeout | null = null
  private remaining: number
  private startTime: number = 0
  private pausedTime: number = 0
  private isPaused: boolean = false

  constructor(
    private duration: number,
    private options: CountdownOptions = {}
  ) {
    this.remaining = duration
  }

  /**
   * Start the countdown
   */
  start(): void {
    if (this.timeoutId) return

    this.startTime = Date.now() - (this.duration - this.remaining)
    this.tick()
  }

  /**
   * Pause the countdown
   */
  pause(): void {
    if (this.isPaused || !this.timeoutId) return

    this.isPaused = true
    this.pausedTime = Date.now()

    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
  }

  /**
   * Resume the countdown
   */
  resume(): void {
    if (!this.isPaused) return

    this.isPaused = false
    const pauseDuration = Date.now() - this.pausedTime
    this.startTime += pauseDuration
    this.tick()
  }

  /**
   * Stop the countdown
   */
  stop(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
    this.remaining = this.duration
    this.isPaused = false
  }

  /**
   * Reset the countdown
   */
  reset(): void {
    this.stop()
    this.remaining = this.duration
  }

  /**
   * Get remaining time
   */
  getRemaining(): number {
    if (this.isPaused) {
      return this.remaining
    }
    if (!this.timeoutId) {
      return this.remaining
    }
    return Math.max(0, this.duration - (Date.now() - this.startTime))
  }

  /**
   * Check if countdown is running
   */
  isRunning(): boolean {
    return this.timeoutId !== null && !this.isPaused
  }

  private tick(): void {
    this.remaining = this.getRemaining()

    if (this.remaining <= 0) {
      this.remaining = 0
      this.timeoutId = null
      this.options.onTick?.(0)
      this.options.onComplete?.()
      return
    }

    this.options.onTick?.(this.remaining)

    const interval = this.options.interval || 1000
    this.timeoutId = setTimeout(() => this.tick(), interval)
  }
}
