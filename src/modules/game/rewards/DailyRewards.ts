/**
 * Daily Rewards System - Incentivize daily player engagement
 * FEATURE: Increase player retention with daily login rewards
 */

export interface DailyReward {
  day: number
  type: 'coins' | 'powerup' | 'skin' | 'boost' | 'special'
  amount: number
  itemId?: string
  bonus?: boolean
  claimed: boolean
  claimedAt?: Date
}

export interface RewardStreak {
  currentStreak: number
  longestStreak: number
  lastClaimDate: Date | null
  totalRewardsClaimed: number
}

export interface DailyRewardsConfig {
  persistKey: string
  rewardCycle: number // Days in one reward cycle
  streakBonusThreshold: number // Days to get bonus
  streakBonusMultiplier: number
  resetTimeUTC: number // Hour in UTC (0-23)
}

export class DailyRewards {
  private config: DailyRewardsConfig
  private streak: RewardStreak
  private rewards: DailyReward[]
  private eventListeners: Map<string, Set<(data: unknown) => void>> = new Map()

  constructor(config: Partial<DailyRewardsConfig> = {}) {
    this.config = {
      persistKey: config.persistKey || 'daily_rewards',
      rewardCycle: config.rewardCycle || 7,
      streakBonusThreshold: config.streakBonusThreshold || 7,
      streakBonusMultiplier: config.streakBonusMultiplier || 2,
      resetTimeUTC: config.resetTimeUTC || 0,
    }

    this.streak = this.loadStreak()
    this.rewards = this.initializeRewards()
    this.checkStreak()
  }

  /**
   * Initialize rewards for current cycle
   */
  private initializeRewards(): DailyReward[] {
    const rewards: DailyReward[] = []

    for (let day = 1; day <= this.config.rewardCycle; day++) {
      let type: DailyReward['type'] = 'coins'
      let amount = 100 * day

      // Vary reward types
      if (day % 3 === 0) {
        type = 'powerup'
        amount = 1
      } else if (day % 5 === 0) {
        type = 'boost'
        amount = 2
      } else if (day === this.config.rewardCycle) {
        type = 'special'
        amount = 1000
      }

      rewards.push({
        day,
        type,
        amount,
        bonus: day % this.config.streakBonusThreshold === 0,
        claimed: false,
      })
    }

    return rewards
  }

  /**
   * Check if can claim today's reward
   */
  canClaimToday(): boolean {
    if (!this.streak.lastClaimDate) {
      return true
    }

    const today = this.getToday()
    const lastClaim = new Date(this.streak.lastClaimDate)

    return today.getTime() !== this.normalizeDate(lastClaim).getTime()
  }

  /**
   * Get today's reward
   */
  getTodaysReward(): DailyReward | null {
    if (!this.canClaimToday()) {
      return null
    }

    const dayIndex = this.streak.currentStreak % this.config.rewardCycle
    return this.rewards[dayIndex] || this.rewards[0]
  }

  /**
   * Claim today's reward
   */
  claimReward(): DailyReward | null {
    if (!this.canClaimToday()) {
      this.emit('rewardAlreadyClaimed', { streak: this.streak })
      return null
    }

    const reward = this.getTodaysReward()
    if (!reward) {
      return null
    }

    // Apply streak bonus
    let finalAmount = reward.amount
    if (reward.bonus) {
      finalAmount *= this.config.streakBonusMultiplier
    }

    // Update reward
    reward.claimed = true
    reward.claimedAt = new Date()

    // Update streak
    this.streak.currentStreak++
    this.streak.lastClaimDate = new Date()
    this.streak.totalRewardsClaimed++

    if (this.streak.currentStreak > this.streak.longestStreak) {
      this.streak.longestStreak = this.streak.currentStreak
    }

    // Save state
    this.saveStreak()

    // Emit events
    this.emit('rewardClaimed', {
      reward: { ...reward, amount: finalAmount },
      streak: this.streak,
    })

    if (reward.bonus) {
      this.emit('bonusReward', {
        reward: { ...reward, amount: finalAmount },
        streak: this.streak,
      })
    }

    return { ...reward, amount: finalAmount }
  }

  /**
   * Get current streak info
   */
  getStreakInfo(): RewardStreak {
    return { ...this.streak }
  }

  /**
   * Get all rewards for current cycle
   */
  getAllRewards(): DailyReward[] {
    return [...this.rewards]
  }

  /**
   * Get upcoming rewards
   */
  getUpcomingRewards(count: number = 3): DailyReward[] {
    const currentDay = this.streak.currentStreak % this.config.rewardCycle
    const upcoming: DailyReward[] = []

    for (let i = 1; i <= count; i++) {
      const dayIndex = (currentDay + i) % this.config.rewardCycle
      const reward = this.rewards[dayIndex]
      if (reward) {
        upcoming.push({ ...reward })
      }
    }

    return upcoming
  }

  /**
   * Check and update streak status
   */
  private checkStreak(): void {
    if (!this.streak.lastClaimDate) {
      return
    }

    const today = this.getToday()
    const lastClaim = this.normalizeDate(new Date(this.streak.lastClaimDate))
    const daysSinceLastClaim = Math.floor(
      (today.getTime() - lastClaim.getTime()) / (1000 * 60 * 60 * 24)
    )

    // Reset streak if missed a day
    if (daysSinceLastClaim > 1) {
      this.emit('streakLost', {
        previousStreak: this.streak.currentStreak,
        daysMissed: daysSinceLastClaim - 1,
      })

      this.streak.currentStreak = 0
      this.saveStreak()
    }
  }

  /**
   * Get time until next reward
   */
  getTimeUntilNextReward(): number {
    if (this.canClaimToday()) {
      return 0
    }

    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)
    tomorrow.setUTCHours(this.config.resetTimeUTC, 0, 0, 0)

    return tomorrow.getTime() - now.getTime()
  }

  /**
   * Format time until next reward
   */
  formatTimeUntilNextReward(): string {
    const ms = this.getTimeUntilNextReward()

    if (ms === 0) {
      return 'Available now'
    }

    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}h ${minutes}m`
  }

  /**
   * Get today's date normalized to reset time
   */
  private getToday(): Date {
    const now = new Date()
    const today = new Date(now)
    today.setUTCHours(this.config.resetTimeUTC, 0, 0, 0)

    // If current time is before reset time, consider it previous day
    if (now.getUTCHours() < this.config.resetTimeUTC) {
      today.setUTCDate(today.getUTCDate() - 1)
    }

    return today
  }

  /**
   * Normalize date to midnight UTC
   */
  private normalizeDate(date: Date): Date {
    const normalized = new Date(date)
    normalized.setUTCHours(this.config.resetTimeUTC, 0, 0, 0)
    return normalized
  }

  /**
   * Load streak from storage
   */
  private loadStreak(): RewardStreak {
    try {
      const data = localStorage.getItem(this.config.persistKey)

      if (data) {
        const parsed = JSON.parse(data)
        return {
          currentStreak: parsed.currentStreak || 0,
          longestStreak: parsed.longestStreak || 0,
          lastClaimDate: parsed.lastClaimDate ? new Date(parsed.lastClaimDate) : null,
          totalRewardsClaimed: parsed.totalRewardsClaimed || 0,
        }
      }
    } catch (error) {
      console.error('Failed to load daily rewards:', error)
    }

    return {
      currentStreak: 0,
      longestStreak: 0,
      lastClaimDate: null,
      totalRewardsClaimed: 0,
    }
  }

  /**
   * Save streak to storage
   */
  private saveStreak(): void {
    try {
      localStorage.setItem(this.config.persistKey, JSON.stringify(this.streak))
    } catch (error) {
      console.error('Failed to save daily rewards:', error)
    }
  }

  /**
   * Reset rewards (for testing)
   */
  reset(): void {
    this.streak = {
      currentStreak: 0,
      longestStreak: 0,
      lastClaimDate: null,
      totalRewardsClaimed: 0,
    }
    this.rewards = this.initializeRewards()
    this.saveStreak()
    this.emit('rewardsReset', {})
  }

  /**
   * Get statistics
   */
  getStatistics(): {
    currentStreak: number
    longestStreak: number
    totalRewardsClaimed: number
    canClaimToday: boolean
    timeUntilNextReward: number
    cycleProgress: number
  } {
    return {
      currentStreak: this.streak.currentStreak,
      longestStreak: this.streak.longestStreak,
      totalRewardsClaimed: this.streak.totalRewardsClaimed,
      canClaimToday: this.canClaimToday(),
      timeUntilNextReward: this.getTimeUntilNextReward(),
      cycleProgress:
        (this.streak.currentStreak % this.config.rewardCycle) / this.config.rewardCycle,
    }
  }

  /**
   * Export data
   */
  export(): string {
    return JSON.stringify({
      streak: this.streak,
      rewards: this.rewards,
      config: this.config,
    })
  }

  /**
   * Import data
   */
  import(data: string): boolean {
    try {
      const parsed = JSON.parse(data)

      this.streak = {
        ...parsed.streak,
        lastClaimDate: parsed.streak.lastClaimDate ? new Date(parsed.streak.lastClaimDate) : null,
      }

      this.rewards = parsed.rewards
      this.saveStreak()

      this.emit('dataImported', {})
      return true
    } catch (error) {
      console.error('Failed to import daily rewards:', error)
      return false
    }
  }

  /**
   * Add event listener
   */
  on(event: string, callback: (data: unknown) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set())
    }
    this.eventListeners.get(event)!.add(callback)
  }

  /**
   * Remove event listener
   */
  off(event: string, callback: (data: unknown) => void): void {
    this.eventListeners.get(event)?.delete(callback)
  }

  /**
   * Emit event
   */
  private emit(event: string, data: unknown): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach((callback) => callback(data))
    }
  }
}

export default DailyRewards
