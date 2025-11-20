/**
 * Advanced score tracking and combo system with statistics
 */

export interface ScoreState {
  current: number
  high: number
  combo: number
  maxCombo: number
  comboMultiplier: number
}

export interface ScoreHistory {
  timestamp: number
  score: number
  combo: number
  multiplier: number
}

export interface ScoreStats {
  totalPoints: number
  averageCombo: number
  maxCombo: number
  totalCombos: number
  scoreRate: number
  timeElapsed: number
}

export class ScoreManager {
  private state: ScoreState = {
    current: 0,
    high: 0,
    combo: 0,
    maxCombo: 0,
    comboMultiplier: 1,
  }

  private comboTimeout: NodeJS.Timeout | null = null
  private comboTimeoutDuration = 3000
  private history: ScoreHistory[] = []
  private maxHistorySize = 100
  private comboBreaks: number = 0
  private totalCombos: number = 0
  private startTime: number = 0
  private scoreCallbacks: Set<(score: number) => void> = new Set()
  private comboCallbacks: Set<(combo: number) => void> = new Set()

  addPoints(basePoints: number): void {
    const points = Math.floor(basePoints * this.state.comboMultiplier)
    this.state.current += points

    if (this.state.current > this.state.high) {
      this.state.high = this.state.current
    }

    this.addToHistory(points)
    this.incrementCombo()
    this.notifyScoreCallbacks()
  }

  private addToHistory(points: number): void {
    this.history.push({
      timestamp: Date.now(),
      score: points,
      combo: this.state.combo,
      multiplier: this.state.comboMultiplier,
    })

    // Keep history size manageable
    if (this.history.length > this.maxHistorySize) {
      this.history.shift()
    }
  }

  private notifyScoreCallbacks(): void {
    this.scoreCallbacks.forEach((callback) => callback(this.state.current))
  }

  private notifyComboCallbacks(): void {
    this.comboCallbacks.forEach((callback) => callback(this.state.combo))
  }

  private incrementCombo(): void {
    if (this.state.combo === 0) {
      this.totalCombos++
    }

    this.state.combo++

    if (this.state.combo > this.state.maxCombo) {
      this.state.maxCombo = this.state.combo
    }

    // Increase multiplier with combo
    this.state.comboMultiplier = 1 + Math.min(this.state.combo * 0.1, 4)

    // Reset combo timeout
    if (this.comboTimeout) {
      clearTimeout(this.comboTimeout)
    }

    this.comboTimeout = setTimeout(() => {
      this.resetCombo()
    }, this.comboTimeoutDuration)

    this.notifyComboCallbacks()
  }

  resetCombo(): void {
    if (this.state.combo > 0) {
      this.comboBreaks++
    }

    this.state.combo = 0
    this.state.comboMultiplier = 1

    if (this.comboTimeout) {
      clearTimeout(this.comboTimeout)
      this.comboTimeout = null
    }

    this.notifyComboCallbacks()
  }

  getCurrentScore(): number {
    return this.state.current
  }

  getHighScore(): number {
    return this.state.high
  }

  getCombo(): number {
    return this.state.combo
  }

  getComboMultiplier(): number {
    return this.state.comboMultiplier
  }

  getState(): ScoreState {
    return { ...this.state }
  }

  reset(): void {
    const highScore = this.state.high
    this.state = {
      current: 0,
      high: highScore,
      combo: 0,
      maxCombo: 0,
      comboMultiplier: 1,
    }

    if (this.comboTimeout) {
      clearTimeout(this.comboTimeout)
      this.comboTimeout = null
    }

    this.history = []
    this.comboBreaks = 0
    this.totalCombos = 0
    this.startTime = Date.now()
  }

  setHighScore(score: number): void {
    this.state.high = Math.max(this.state.high, score)
  }

  getStats(): ScoreStats {
    const timeElapsed = this.startTime > 0 ? Date.now() - this.startTime : 0
    const timeInSeconds = timeElapsed / 1000

    return {
      totalPoints: this.state.current,
      averageCombo: this.totalCombos > 0 ? this.state.maxCombo / this.totalCombos : 0,
      maxCombo: this.state.maxCombo,
      totalCombos: this.totalCombos,
      scoreRate: timeInSeconds > 0 ? this.state.current / timeInSeconds : 0,
      timeElapsed: timeInSeconds,
    }
  }

  getHistory(): ScoreHistory[] {
    return [...this.history]
  }

  getComboBreaks(): number {
    return this.comboBreaks
  }

  onScoreChange(callback: (score: number) => void): () => void {
    this.scoreCallbacks.add(callback)
    return () => this.scoreCallbacks.delete(callback)
  }

  onComboChange(callback: (combo: number) => void): () => void {
    this.comboCallbacks.add(callback)
    return () => this.comboCallbacks.delete(callback)
  }

  setComboTimeout(duration: number): void {
    this.comboTimeoutDuration = Math.max(1000, duration)
  }

  getComboTimeRemaining(): number {
    // This would need to track when the timeout was started
    // For now, return the full duration
    return this.comboTimeoutDuration
  }

  getMaxComboMultiplier(): number {
    return 5 // Max multiplier based on incrementCombo logic
  }

  getNextComboMilestone(): number {
    // Return next combo milestone (5, 10, 25, 50, 100)
    const milestones = [5, 10, 25, 50, 100]
    for (const milestone of milestones) {
      if (this.state.combo < milestone) {
        return milestone
      }
    }
    return 100
  }

  cleanup(): void {
    if (this.comboTimeout) {
      clearTimeout(this.comboTimeout)
      this.comboTimeout = null
    }
    this.scoreCallbacks.clear()
    this.comboCallbacks.clear()
  }
}
