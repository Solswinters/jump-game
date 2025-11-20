/**
 * Achievement Registry - Comprehensive achievement definitions and metadata
 */

import type { Achievement } from './types'

export enum AchievementTier {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
  DIAMOND = 'diamond',
}

export interface AchievementReward {
  type: 'coins' | 'tokens' | 'nft' | 'powerup' | 'cosmetic'
  amount?: number
  itemId?: string
  rarity?: string
}

export interface ExtendedAchievement extends Achievement {
  tier: AchievementTier
  reward?: AchievementReward
  hidden?: boolean
  prerequisite?: string[]
  points: number
}

export class AchievementRegistry {
  private static achievements: ExtendedAchievement[] = [
    // Score Achievements
    {
      id: 'score-100',
      name: 'Century',
      description: 'Score 100 points',
      icon: '💯',
      unlocked: false,
      progress: 0,
      target: 100,
      category: 'score',
      tier: AchievementTier.BRONZE,
      points: 10,
      reward: { type: 'coins', amount: 100 },
    },
    {
      id: 'score-500',
      name: 'High Flyer',
      description: 'Score 500 points',
      icon: '🚀',
      unlocked: false,
      progress: 0,
      target: 500,
      category: 'score',
      tier: AchievementTier.SILVER,
      points: 25,
      reward: { type: 'coins', amount: 500 },
    },
    {
      id: 'score-1000',
      name: 'Elite Player',
      description: 'Score 1000 points',
      icon: '⭐',
      unlocked: false,
      progress: 0,
      target: 1000,
      category: 'score',
      tier: AchievementTier.GOLD,
      points: 50,
      reward: { type: 'tokens', amount: 10 },
    },
    {
      id: 'score-5000',
      name: 'Legend',
      description: 'Score 5000 points',
      icon: '👑',
      unlocked: false,
      progress: 0,
      target: 5000,
      category: 'score',
      tier: AchievementTier.PLATINUM,
      points: 100,
      reward: { type: 'nft', itemId: 'legend-badge', rarity: 'rare' },
    },
    {
      id: 'score-10000',
      name: 'Immortal',
      description: 'Score 10000 points',
      icon: '💎',
      unlocked: false,
      progress: 0,
      target: 10000,
      category: 'score',
      tier: AchievementTier.DIAMOND,
      points: 250,
      reward: { type: 'nft', itemId: 'immortal-badge', rarity: 'legendary' },
      hidden: true,
    },

    // Combo Achievements
    {
      id: 'combo-5',
      name: 'Combo Starter',
      description: 'Reach a 5x combo',
      icon: '🔥',
      unlocked: false,
      progress: 0,
      target: 5,
      category: 'combo',
      tier: AchievementTier.BRONZE,
      points: 10,
    },
    {
      id: 'combo-10',
      name: 'Combo Master',
      description: 'Reach a 10x combo',
      icon: '⚡',
      unlocked: false,
      progress: 0,
      target: 10,
      category: 'combo',
      tier: AchievementTier.SILVER,
      points: 25,
    },
    {
      id: 'combo-25',
      name: 'Combo Legend',
      description: 'Reach a 25x combo',
      icon: '💥',
      unlocked: false,
      progress: 0,
      target: 25,
      category: 'combo',
      tier: AchievementTier.GOLD,
      points: 50,
    },
    {
      id: 'combo-50',
      name: 'Untouchable',
      description: 'Reach a 50x combo',
      icon: '🌟',
      unlocked: false,
      progress: 0,
      target: 50,
      category: 'combo',
      tier: AchievementTier.PLATINUM,
      points: 100,
      hidden: true,
    },

    // Time/Survival Achievements
    {
      id: 'survive-30',
      name: 'Quick Runner',
      description: 'Survive for 30 seconds',
      icon: '⏱️',
      unlocked: false,
      progress: 0,
      target: 30,
      category: 'time',
      tier: AchievementTier.BRONZE,
      points: 10,
    },
    {
      id: 'survive-60',
      name: 'Survivor',
      description: 'Survive for 60 seconds',
      icon: '⌛',
      unlocked: false,
      progress: 0,
      target: 60,
      category: 'time',
      tier: AchievementTier.SILVER,
      points: 25,
    },
    {
      id: 'survive-120',
      name: 'Endurance Runner',
      description: 'Survive for 2 minutes',
      icon: '🏃',
      unlocked: false,
      progress: 0,
      target: 120,
      category: 'time',
      tier: AchievementTier.GOLD,
      points: 50,
    },
    {
      id: 'survive-300',
      name: 'Marathon Master',
      description: 'Survive for 5 minutes',
      icon: '🏅',
      unlocked: false,
      progress: 0,
      target: 300,
      category: 'time',
      tier: AchievementTier.PLATINUM,
      points: 100,
    },

    // Distance Achievements
    {
      id: 'distance-1000',
      name: 'First Steps',
      description: 'Travel 1000 meters',
      icon: '👣',
      unlocked: false,
      progress: 0,
      target: 1000,
      category: 'distance',
      tier: AchievementTier.BRONZE,
      points: 10,
    },
    {
      id: 'distance-5000',
      name: 'Long Distance',
      description: 'Travel 5000 meters',
      icon: '🛤️',
      unlocked: false,
      progress: 0,
      target: 5000,
      category: 'distance',
      tier: AchievementTier.SILVER,
      points: 25,
    },
    {
      id: 'distance-10000',
      name: 'World Traveler',
      description: 'Travel 10000 meters',
      icon: '🌍',
      unlocked: false,
      progress: 0,
      target: 10000,
      category: 'distance',
      tier: AchievementTier.GOLD,
      points: 50,
    },

    // Collection Achievements
    {
      id: 'collect-10-coins',
      name: 'Coin Collector',
      description: 'Collect 10 coins',
      icon: '🪙',
      unlocked: false,
      progress: 0,
      target: 10,
      category: 'collection',
      tier: AchievementTier.BRONZE,
      points: 10,
    },
    {
      id: 'collect-100-coins',
      name: 'Treasure Hunter',
      description: 'Collect 100 coins',
      icon: '💰',
      unlocked: false,
      progress: 0,
      target: 100,
      category: 'collection',
      tier: AchievementTier.SILVER,
      points: 25,
    },
    {
      id: 'collect-1000-coins',
      name: 'Wealthy',
      description: 'Collect 1000 coins',
      icon: '💸',
      unlocked: false,
      progress: 0,
      target: 1000,
      category: 'collection',
      tier: AchievementTier.GOLD,
      points: 50,
    },

    // Power-up Achievements
    {
      id: 'powerup-10',
      name: 'Power User',
      description: 'Collect 10 power-ups',
      icon: '⚡',
      unlocked: false,
      progress: 0,
      target: 10,
      category: 'powerup',
      tier: AchievementTier.BRONZE,
      points: 10,
    },
    {
      id: 'powerup-50',
      name: 'Power Master',
      description: 'Collect 50 power-ups',
      icon: '✨',
      unlocked: false,
      progress: 0,
      target: 50,
      category: 'powerup',
      tier: AchievementTier.SILVER,
      points: 25,
    },
    {
      id: 'all-powerups',
      name: 'Collector',
      description: 'Collect all power-up types',
      icon: '🎁',
      unlocked: false,
      progress: 0,
      target: 5,
      category: 'powerup',
      tier: AchievementTier.GOLD,
      points: 50,
    },

    // Special Achievements
    {
      id: 'first-jump',
      name: 'First Jump',
      description: 'Jump for the first time',
      icon: '🦘',
      unlocked: false,
      progress: 0,
      target: 1,
      category: 'special',
      tier: AchievementTier.BRONZE,
      points: 5,
    },
    {
      id: 'perfect-dodge',
      name: 'Perfect Dodge',
      description: 'Dodge an obstacle by a hair',
      icon: '😅',
      unlocked: false,
      progress: 0,
      target: 1,
      category: 'special',
      tier: AchievementTier.SILVER,
      points: 20,
    },
    {
      id: 'no-damage-run',
      name: 'Flawless',
      description: 'Complete a run without taking damage',
      icon: '🛡️',
      unlocked: false,
      progress: 0,
      target: 1,
      category: 'special',
      tier: AchievementTier.GOLD,
      points: 75,
    },
    {
      id: 'speed-demon',
      name: 'Speed Demon',
      description: 'Reach maximum game speed',
      icon: '💨',
      unlocked: false,
      progress: 0,
      target: 1,
      category: 'special',
      tier: AchievementTier.SILVER,
      points: 30,
    },

    // Multiplayer Achievements
    {
      id: 'mp-first-win',
      name: 'First Victory',
      description: 'Win your first multiplayer match',
      icon: '🏆',
      unlocked: false,
      progress: 0,
      target: 1,
      category: 'multiplayer',
      tier: AchievementTier.BRONZE,
      points: 15,
    },
    {
      id: 'mp-win-streak-5',
      name: 'Winning Streak',
      description: 'Win 5 matches in a row',
      icon: '🔥',
      unlocked: false,
      progress: 0,
      target: 5,
      category: 'multiplayer',
      tier: AchievementTier.SILVER,
      points: 40,
    },
    {
      id: 'mp-win-100',
      name: 'Champion',
      description: 'Win 100 multiplayer matches',
      icon: '👑',
      unlocked: false,
      progress: 0,
      target: 100,
      category: 'multiplayer',
      tier: AchievementTier.GOLD,
      points: 100,
    },

    // Skill Achievements
    {
      id: 'obstacle-dodge-100',
      name: 'Agile',
      description: 'Successfully dodge 100 obstacles',
      icon: '🤸',
      unlocked: false,
      progress: 0,
      target: 100,
      category: 'skill',
      tier: AchievementTier.BRONZE,
      points: 15,
    },
    {
      id: 'obstacle-dodge-500',
      name: 'Evasion Master',
      description: 'Successfully dodge 500 obstacles',
      icon: '🥷',
      unlocked: false,
      progress: 0,
      target: 500,
      category: 'skill',
      tier: AchievementTier.SILVER,
      points: 35,
    },
    {
      id: 'perfect-timing',
      name: 'Perfect Timing',
      description: 'Execute 10 perfect jumps',
      icon: '🎯',
      unlocked: false,
      progress: 0,
      target: 10,
      category: 'skill',
      tier: AchievementTier.GOLD,
      points: 50,
    },
  ]

  /**
   * Get all achievements
   */
  static getAll(): ExtendedAchievement[] {
    return [...this.achievements]
  }

  /**
   * Get achievement by ID
   */
  static getById(id: string): ExtendedAchievement | undefined {
    return this.achievements.find((a) => a.id === id)
  }

  /**
   * Get achievements by category
   */
  static getByCategory(category: string): ExtendedAchievement[] {
    return this.achievements.filter((a) => a.category === category)
  }

  /**
   * Get achievements by tier
   */
  static getByTier(tier: AchievementTier): ExtendedAchievement[] {
    return this.achievements.filter((a) => a.tier === tier)
  }

  /**
   * Get visible achievements (not hidden)
   */
  static getVisible(): ExtendedAchievement[] {
    return this.achievements.filter((a) => !a.hidden)
  }

  /**
   * Get hidden achievements
   */
  static getHidden(): ExtendedAchievement[] {
    return this.achievements.filter((a) => a.hidden)
  }

  /**
   * Calculate total possible points
   */
  static getTotalPoints(): number {
    return this.achievements.reduce((sum, a) => sum + a.points, 0)
  }

  /**
   * Get achievements with rewards
   */
  static getWithRewards(): ExtendedAchievement[] {
    return this.achievements.filter((a) => a.reward !== undefined)
  }

  /**
   * Get achievement categories
   */
  static getCategories(): string[] {
    const categories = new Set(this.achievements.map((a) => a.category))
    return Array.from(categories)
  }

  /**
   * Get achievement tier colors
   */
  static getTierColor(tier: AchievementTier): string {
    const colors: Record<AchievementTier, string> = {
      [AchievementTier.BRONZE]: '#CD7F32',
      [AchievementTier.SILVER]: '#C0C0C0',
      [AchievementTier.GOLD]: '#FFD700',
      [AchievementTier.PLATINUM]: '#E5E4E2',
      [AchievementTier.DIAMOND]: '#B9F2FF',
    }
    return colors[tier]
  }

  /**
   * Get tier name
   */
  static getTierName(tier: AchievementTier): string {
    const names: Record<AchievementTier, string> = {
      [AchievementTier.BRONZE]: 'Bronze',
      [AchievementTier.SILVER]: 'Silver',
      [AchievementTier.GOLD]: 'Gold',
      [AchievementTier.PLATINUM]: 'Platinum',
      [AchievementTier.DIAMOND]: 'Diamond',
    }
    return names[tier]
  }
}

export default AchievementRegistry
