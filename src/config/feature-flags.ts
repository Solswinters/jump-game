/**
 * Feature flag configuration
 */

export interface FeatureFlags {
  // Game features
  enableMultiplayer: boolean
  enablePowerUps: boolean
  enableLeaderboard: boolean
  enableAchievements: boolean
  enableDailyRewards: boolean

  // Web3 features
  enableWalletConnect: boolean
  enableTokenRewards: boolean
  enableNFTs: boolean
  enableStaking: boolean

  // UI features
  enableDarkMode: boolean
  enableAnimations: boolean
  enableSoundEffects: boolean
  enableNotifications: boolean

  // Performance features
  enableServiceWorker: boolean
  enableLazyLoading: boolean
  enableCodeSplitting: boolean

  // Analytics features
  enableAnalytics: boolean
  enableErrorTracking: boolean
  enablePerformanceMonitoring: boolean

  // Developer features
  enableDebugMode: boolean
  enableDevTools: boolean
  enableHotReload: boolean
}

/**
 * Default feature flags
 */
export const defaultFeatureFlags: FeatureFlags = {
  // Game features
  enableMultiplayer: true,
  enablePowerUps: true,
  enableLeaderboard: true,
  enableAchievements: true,
  enableDailyRewards: false,

  // Web3 features
  enableWalletConnect: true,
  enableTokenRewards: true,
  enableNFTs: false,
  enableStaking: false,

  // UI features
  enableDarkMode: true,
  enableAnimations: true,
  enableSoundEffects: true,
  enableNotifications: true,

  // Performance features
  enableServiceWorker: true,
  enableLazyLoading: true,
  enableCodeSplitting: true,

  // Analytics features
  enableAnalytics: true,
  enableErrorTracking: true,
  enablePerformanceMonitoring: true,

  // Developer features
  enableDebugMode: process.env.NODE_ENV === 'development',
  enableDevTools: process.env.NODE_ENV === 'development',
  enableHotReload: process.env.NODE_ENV === 'development',
}

/**
 * Feature flag manager
 */
class FeatureFlagManager {
  private flags: FeatureFlags = { ...defaultFeatureFlags }
  private overrides: Partial<FeatureFlags> = {}

  /**
   * Initialize feature flags from environment or remote config
   */
  async initialize(): Promise<void> {
    // Load from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('feature-flags')
      if (stored) {
        try {
          this.overrides = JSON.parse(stored)
        } catch (error) {
          console.error('Failed to parse feature flags:', error)
        }
      }
    }

    // Load from environment variables
    Object.keys(this.flags).forEach(key => {
      const envKey = `NEXT_PUBLIC_FEATURE_${key.toUpperCase()}`
      const envValue = process.env[envKey]

      if (envValue !== undefined) {
        this.overrides[key as keyof FeatureFlags] = envValue === 'true'
      }
    })

    this.applyOverrides()
  }

  /**
   * Apply overrides to flags
   */
  private applyOverrides(): void {
    this.flags = { ...defaultFeatureFlags, ...this.overrides }
  }

  /**
   * Check if a feature is enabled
   */
  isEnabled(flag: keyof FeatureFlags): boolean {
    return this.flags[flag]
  }

  /**
   * Enable a feature
   */
  enable(flag: keyof FeatureFlags): void {
    this.overrides[flag] = true
    this.applyOverrides()
    this.persist()
  }

  /**
   * Disable a feature
   */
  disable(flag: keyof FeatureFlags): void {
    this.overrides[flag] = false
    this.applyOverrides()
    this.persist()
  }

  /**
   * Toggle a feature
   */
  toggle(flag: keyof FeatureFlags): void {
    const current = this.flags[flag]
    if (current) {
      this.disable(flag)
    } else {
      this.enable(flag)
    }
  }

  /**
   * Get all flags
   */
  getAll(): FeatureFlags {
    return { ...this.flags }
  }

  /**
   * Reset to defaults
   */
  reset(): void {
    this.overrides = {}
    this.applyOverrides()
    this.persist()
  }

  /**
   * Persist to localStorage
   */
  private persist(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('feature-flags', JSON.stringify(this.overrides))
    }
  }
}

/**
 * Global feature flag manager instance
 */
export const featureFlagManager = new FeatureFlagManager()

/**
 * Hook to check feature flags
 */
export function useFeatureFlag(flag: keyof FeatureFlags): boolean {
  return featureFlagManager.isEnabled(flag)
}
