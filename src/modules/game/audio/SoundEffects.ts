/**
 * Sound Effects Library - Comprehensive sound effects management
 */

export enum SoundEffectType {
  // UI Sounds
  UI_CLICK = 'ui_click',
  UI_HOVER = 'ui_hover',
  UI_SUCCESS = 'ui_success',
  UI_ERROR = 'ui_error',
  UI_NOTIFICATION = 'ui_notification',
  UI_MENU_OPEN = 'ui_menu_open',
  UI_MENU_CLOSE = 'ui_menu_close',

  // Game Actions
  JUMP = 'jump',
  DOUBLE_JUMP = 'double_jump',
  LAND = 'land',
  SLIDE = 'slide',
  DASH = 'dash',

  // Collectibles
  COIN_COLLECT = 'coin_collect',
  POWERUP_COLLECT = 'powerup_collect',
  TOKEN_COLLECT = 'token_collect',
  STAR_COLLECT = 'star_collect',

  // Power-ups
  SHIELD_ACTIVATE = 'shield_activate',
  SHIELD_BREAK = 'shield_break',
  MAGNET_ACTIVATE = 'magnet_activate',
  SPEED_BOOST = 'speed_boost',
  INVINCIBILITY = 'invincibility',

  // Obstacles and Collisions
  HIT_OBSTACLE = 'hit_obstacle',
  DESTROY_OBSTACLE = 'destroy_obstacle',
  EXPLOSION = 'explosion',
  CRASH = 'crash',

  // Achievements
  ACHIEVEMENT_UNLOCK = 'achievement_unlock',
  LEVEL_UP = 'level_up',
  MILESTONE = 'milestone',
  NEW_HIGH_SCORE = 'new_high_score',

  // Multiplayer
  PLAYER_JOIN = 'player_join',
  PLAYER_LEAVE = 'player_leave',
  CHAT_MESSAGE = 'chat_message',
  MATCH_START = 'match_start',
  MATCH_END = 'match_end',

  // Ambient
  WIND = 'wind',
  FOOTSTEPS = 'footsteps',
  BACKGROUND_CROWD = 'background_crowd',

  // Game States
  GAME_START = 'game_start',
  GAME_OVER = 'game_over',
  PAUSE = 'pause',
  RESUME = 'resume',
  COUNTDOWN = 'countdown',
}

export interface SoundEffect {
  id: SoundEffectType
  path: string
  volume: number
  variants?: string[] // Multiple sound variants for variety
  cooldown?: number // Minimum time between plays (ms)
  maxInstances?: number // Maximum concurrent instances
  priority?: number // Higher priority sounds can interrupt lower priority
}

export interface SoundEffectConfig {
  enabled: boolean
  masterVolume: number
  categoryVolumes: {
    ui: number
    gameplay: number
    ambient: number
    music: number
  }
}

export class SoundEffectsLibrary {
  private static effects: Map<SoundEffectType, SoundEffect> = new Map()
  private static lastPlayed: Map<SoundEffectType, number> = new Map()
  private static activeInstances: Map<SoundEffectType, number> = new Map()
  private static config: SoundEffectConfig = {
    enabled: true,
    masterVolume: 1.0,
    categoryVolumes: {
      ui: 0.7,
      gameplay: 1.0,
      ambient: 0.5,
      music: 0.8,
    },
  }

  /**
   * Initialize sound effects library
   */
  static initialize(): void {
    // UI Sounds
    this.register({
      id: SoundEffectType.UI_CLICK,
      path: '/sounds/ui/click.mp3',
      volume: 0.5,
      variants: ['/sounds/ui/click1.mp3', '/sounds/ui/click2.mp3'],
    })

    this.register({
      id: SoundEffectType.UI_HOVER,
      path: '/sounds/ui/hover.mp3',
      volume: 0.3,
      cooldown: 100,
    })

    this.register({
      id: SoundEffectType.UI_SUCCESS,
      path: '/sounds/ui/success.mp3',
      volume: 0.6,
    })

    this.register({
      id: SoundEffectType.UI_ERROR,
      path: '/sounds/ui/error.mp3',
      volume: 0.6,
    })

    // Game Actions
    this.register({
      id: SoundEffectType.JUMP,
      path: '/sounds/actions/jump.mp3',
      volume: 0.7,
      variants: [
        '/sounds/actions/jump1.mp3',
        '/sounds/actions/jump2.mp3',
        '/sounds/actions/jump3.mp3',
      ],
      maxInstances: 2,
    })

    this.register({
      id: SoundEffectType.DOUBLE_JUMP,
      path: '/sounds/actions/double-jump.mp3',
      volume: 0.8,
    })

    this.register({
      id: SoundEffectType.LAND,
      path: '/sounds/actions/land.mp3',
      volume: 0.6,
      cooldown: 200,
    })

    // Collectibles
    this.register({
      id: SoundEffectType.COIN_COLLECT,
      path: '/sounds/collectibles/coin.mp3',
      volume: 0.5,
      variants: [
        '/sounds/collectibles/coin1.mp3',
        '/sounds/collectibles/coin2.mp3',
        '/sounds/collectibles/coin3.mp3',
      ],
      cooldown: 50,
    })

    this.register({
      id: SoundEffectType.POWERUP_COLLECT,
      path: '/sounds/collectibles/powerup.mp3',
      volume: 0.8,
    })

    this.register({
      id: SoundEffectType.TOKEN_COLLECT,
      path: '/sounds/collectibles/token.mp3',
      volume: 0.9,
    })

    // Power-ups
    this.register({
      id: SoundEffectType.SHIELD_ACTIVATE,
      path: '/sounds/powerups/shield-on.mp3',
      volume: 0.7,
    })

    this.register({
      id: SoundEffectType.SHIELD_BREAK,
      path: '/sounds/powerups/shield-break.mp3',
      volume: 0.8,
    })

    this.register({
      id: SoundEffectType.MAGNET_ACTIVATE,
      path: '/sounds/powerups/magnet.mp3',
      volume: 0.6,
    })

    this.register({
      id: SoundEffectType.SPEED_BOOST,
      path: '/sounds/powerups/speed.mp3',
      volume: 0.7,
    })

    this.register({
      id: SoundEffectType.INVINCIBILITY,
      path: '/sounds/powerups/invincible.mp3',
      volume: 0.8,
    })

    // Obstacles
    this.register({
      id: SoundEffectType.HIT_OBSTACLE,
      path: '/sounds/obstacles/hit.mp3',
      volume: 0.9,
      variants: ['/sounds/obstacles/hit1.mp3', '/sounds/obstacles/hit2.mp3'],
    })

    this.register({
      id: SoundEffectType.EXPLOSION,
      path: '/sounds/obstacles/explosion.mp3',
      volume: 1.0,
      maxInstances: 3,
    })

    this.register({
      id: SoundEffectType.CRASH,
      path: '/sounds/obstacles/crash.mp3',
      volume: 0.9,
    })

    // Achievements
    this.register({
      id: SoundEffectType.ACHIEVEMENT_UNLOCK,
      path: '/sounds/achievements/unlock.mp3',
      volume: 0.8,
    })

    this.register({
      id: SoundEffectType.LEVEL_UP,
      path: '/sounds/achievements/level-up.mp3',
      volume: 0.9,
    })

    this.register({
      id: SoundEffectType.NEW_HIGH_SCORE,
      path: '/sounds/achievements/high-score.mp3',
      volume: 1.0,
      priority: 10,
    })

    // Game States
    this.register({
      id: SoundEffectType.GAME_START,
      path: '/sounds/game/start.mp3',
      volume: 0.8,
    })

    this.register({
      id: SoundEffectType.GAME_OVER,
      path: '/sounds/game/game-over.mp3',
      volume: 0.9,
    })

    this.register({
      id: SoundEffectType.PAUSE,
      path: '/sounds/game/pause.mp3',
      volume: 0.6,
    })

    this.register({
      id: SoundEffectType.COUNTDOWN,
      path: '/sounds/game/countdown.mp3',
      volume: 0.7,
    })

    // Multiplayer
    this.register({
      id: SoundEffectType.PLAYER_JOIN,
      path: '/sounds/multiplayer/join.mp3',
      volume: 0.5,
    })

    this.register({
      id: SoundEffectType.PLAYER_LEAVE,
      path: '/sounds/multiplayer/leave.mp3',
      volume: 0.5,
    })

    this.register({
      id: SoundEffectType.MATCH_START,
      path: '/sounds/multiplayer/match-start.mp3',
      volume: 0.8,
    })
  }

  /**
   * Register a sound effect
   */
  static register(effect: SoundEffect): void {
    this.effects.set(effect.id, effect)
  }

  /**
   * Get sound effect
   */
  static get(id: SoundEffectType): SoundEffect | undefined {
    return this.effects.get(id)
  }

  /**
   * Get sound path (with random variant if available)
   */
  static getPath(id: SoundEffectType): string | null {
    const effect = this.effects.get(id)

    if (!effect) {
      return null
    }

    // Return random variant if available
    if (effect.variants && effect.variants.length > 0) {
      const randomIndex = Math.floor(Math.random() * effect.variants.length)
      return effect.variants[randomIndex]
    }

    return effect.path
  }

  /**
   * Check if sound can be played (cooldown and max instances)
   */
  static canPlay(id: SoundEffectType): boolean {
    const effect = this.effects.get(id)

    if (!effect || !this.config.enabled) {
      return false
    }

    // Check cooldown
    if (effect.cooldown) {
      const lastPlayed = this.lastPlayed.get(id) || 0
      const now = Date.now()

      if (now - lastPlayed < effect.cooldown) {
        return false
      }
    }

    // Check max instances
    if (effect.maxInstances) {
      const activeCount = this.activeInstances.get(id) || 0

      if (activeCount >= effect.maxInstances) {
        return false
      }
    }

    return true
  }

  /**
   * Mark sound as played
   */
  static markAsPlayed(id: SoundEffectType): void {
    this.lastPlayed.set(id, Date.now())

    const currentCount = this.activeInstances.get(id) || 0
    this.activeInstances.set(id, currentCount + 1)
  }

  /**
   * Mark sound as finished
   */
  static markAsFinished(id: SoundEffectType): void {
    const currentCount = this.activeInstances.get(id) || 0
    this.activeInstances.set(id, Math.max(0, currentCount - 1))
  }

  /**
   * Get effective volume for sound effect
   */
  static getEffectiveVolume(id: SoundEffectType): number {
    const effect = this.effects.get(id)

    if (!effect) {
      return 0
    }

    let categoryVolume = this.config.categoryVolumes.gameplay

    // Determine category
    if (id.startsWith('ui_')) {
      categoryVolume = this.config.categoryVolumes.ui
    } else if (
      [SoundEffectType.WIND, SoundEffectType.FOOTSTEPS, SoundEffectType.BACKGROUND_CROWD].includes(
        id
      )
    ) {
      categoryVolume = this.config.categoryVolumes.ambient
    }

    return effect.volume * categoryVolume * this.config.masterVolume
  }

  /**
   * Update configuration
   */
  static setConfig(config: Partial<SoundEffectConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    }
  }

  /**
   * Get configuration
   */
  static getConfig(): SoundEffectConfig {
    return { ...this.config }
  }

  /**
   * Enable/disable sound effects
   */
  static setEnabled(enabled: boolean): void {
    this.config.enabled = enabled
  }

  /**
   * Set master volume
   */
  static setMasterVolume(volume: number): void {
    this.config.masterVolume = Math.max(0, Math.min(1, volume))
  }

  /**
   * Set category volume
   */
  static setCategoryVolume(
    category: keyof SoundEffectConfig['categoryVolumes'],
    volume: number
  ): void {
    this.config.categoryVolumes[category] = Math.max(0, Math.min(1, volume))
  }

  /**
   * Reset all cooldowns and instances
   */
  static reset(): void {
    this.lastPlayed.clear()
    this.activeInstances.clear()
  }

  /**
   * Get all sound effects
   */
  static getAll(): SoundEffect[] {
    return Array.from(this.effects.values())
  }

  /**
   * Get statistics
   */
  static getStats(): {
    totalEffects: number
    activeInstances: number
    config: SoundEffectConfig
  } {
    let totalActive = 0

    for (const count of this.activeInstances.values()) {
      totalActive += count
    }

    return {
      totalEffects: this.effects.size,
      activeInstances: totalActive,
      config: this.config,
    }
  }
}

export default SoundEffectsLibrary
