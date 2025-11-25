/**
 * Feature flags service
 */

export interface FeatureFlags {
  multiplayer: boolean
  analytics: boolean
  achievements: boolean
  powerUps: boolean
  replay: boolean
  leaderboard: boolean
  chat: boolean
  tournaments: boolean
}

class FeatureFlagService {
  private flags: FeatureFlags

  constructor() {
    this.flags = this.getDefaultFlags()
  }

  private getDefaultFlags(): FeatureFlags {
    return {
      multiplayer: process.env.NEXT_PUBLIC_ENABLE_MULTIPLAYER !== 'false',
      analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
      achievements: true,
      powerUps: false,
      replay: false,
      leaderboard: true,
      chat: false,
      tournaments: false,
    }
  }

  isEnabled(feature: keyof FeatureFlags): boolean {
    return this.flags[feature] ?? false
  }

  enable(feature: keyof FeatureFlags): void {
    this.flags[feature] = true
  }

  disable(feature: keyof FeatureFlags): void {
    this.flags[feature] = false
  }

  getAllFlags(): FeatureFlags {
    return { ...this.flags }
  }

  setFlags(flags: Partial<FeatureFlags>): void {
    this.flags = { ...this.flags, ...flags }
  }
}

/**
 * featureFlags utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of featureFlags.
 */
export const featureFlags = new FeatureFlagService()
