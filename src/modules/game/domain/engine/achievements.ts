/**
 * Achievement tracking system
 */

import { Achievement, GameSession } from '../models'

/**
 * ACHIEVEMENTS utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of ACHIEVEMENTS.
 */
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-jump',
    name: 'First Jump',
    description: 'Complete your first jump',
    icon: '🦘',
    condition: (session) => session.obstaclesCleared >= 1,
    unlocked: false,
  },
  {
    id: 'survivor',
    name: 'Survivor',
    description: 'Clear 50 obstacles',
    icon: '🏆',
    condition: (session) => session.obstaclesCleared >= 50,
    unlocked: false,
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Reach difficulty level 5',
    icon: '⚡',
    condition: (session) => session.difficulty >= 5,
    unlocked: false,
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Score 10,000 points',
    icon: '✨',
    condition: (session) => session.finalScore >= 10000,
    unlocked: false,
  },
  {
    id: 'marathon',
    name: 'Marathon Runner',
    description: 'Play for 10 minutes',
    icon: '🏃',
    condition: (session) => {
      const duration = (session.endTime ?? Date.now()) - session.startTime
      return duration >= 600000 // 10 minutes
    },
    unlocked: false,
  },
]

export class AchievementManager {
  private achievements: Map<string, Achievement> = new Map()
  private listeners: Set<(achievement: Achievement) => void> = new Set()

  constructor() {
    ACHIEVEMENTS.forEach((achievement) => {
      this.achievements.set(achievement.id, { ...achievement })
    })
  }

  /**
   * Check achievements against game session
   */
  checkAchievements(session: GameSession): Achievement[] {
    const unlocked: Achievement[] = []

    this.achievements.forEach((achievement) => {
      if (!achievement.unlocked && achievement.condition(session)) {
        achievement.unlocked = true
        achievement.unlockedAt = Date.now()
        unlocked.push(achievement)
        this.notifyListeners(achievement)
      }
    })

    return unlocked
  }

  /**
   * Get all achievements
   */
  getAllAchievements(): Achievement[] {
    return Array.from(this.achievements.values())
  }

  /**
   * Get unlocked achievements
   */
  getUnlockedAchievements(): Achievement[] {
    return this.getAllAchievements().filter((a) => a.unlocked)
  }

  /**
   * Get achievement progress
   */
  getProgress(): { total: number; unlocked: number; percentage: number } {
    const total = this.achievements.size
    const unlocked = this.getUnlockedAchievements().length
    return {
      total,
      unlocked,
      percentage: (unlocked / total) * 100,
    }
  }

  /**
   * Subscribe to achievement unlocks
   */
  subscribe(listener: (achievement: Achievement) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  /**
   * Notify listeners
   */
  private notifyListeners(achievement: Achievement): void {
    this.listeners.forEach((listener) => listener(achievement))
  }

  /**
   * Reset all achievements (for testing)
   */
  resetAll(): void {
    this.achievements.forEach((achievement) => {
      achievement.unlocked = false
      achievement.unlockedAt = undefined
    })
  }
}
