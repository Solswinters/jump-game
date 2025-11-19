import { featureFlagManager, defaultFeatureFlags } from '@/config/feature-flags'

describe('Config - Feature Flags', () => {
  beforeEach(() => {
    featureFlagManager.reset()
    localStorage.clear()
  })

  describe('defaultFeatureFlags', () => {
    it('should have all required flags', () => {
      expect(defaultFeatureFlags).toHaveProperty('enableMultiplayer')
      expect(defaultFeatureFlags).toHaveProperty('enableWalletConnect')
      expect(defaultFeatureFlags).toHaveProperty('enableDarkMode')
      expect(defaultFeatureFlags).toHaveProperty('enableAnalytics')
    })

    it('should enable critical features by default', () => {
      expect(defaultFeatureFlags.enableMultiplayer).toBe(true)
      expect(defaultFeatureFlags.enableWalletConnect).toBe(true)
      expect(defaultFeatureFlags.enableAnalytics).toBe(true)
    })
  })

  describe('FeatureFlagManager', () => {
    it('should check if feature is enabled', () => {
      expect(featureFlagManager.isEnabled('enableMultiplayer')).toBe(true)
    })

    it('should enable a feature', () => {
      featureFlagManager.disable('enableMultiplayer')
      expect(featureFlagManager.isEnabled('enableMultiplayer')).toBe(false)

      featureFlagManager.enable('enableMultiplayer')
      expect(featureFlagManager.isEnabled('enableMultiplayer')).toBe(true)
    })

    it('should disable a feature', () => {
      featureFlagManager.enable('enableMultiplayer')
      expect(featureFlagManager.isEnabled('enableMultiplayer')).toBe(true)

      featureFlagManager.disable('enableMultiplayer')
      expect(featureFlagManager.isEnabled('enableMultiplayer')).toBe(false)
    })

    it('should toggle a feature', () => {
      const initial = featureFlagManager.isEnabled('enableMultiplayer')
      featureFlagManager.toggle('enableMultiplayer')
      expect(featureFlagManager.isEnabled('enableMultiplayer')).toBe(!initial)
    })

    it('should get all flags', () => {
      const flags = featureFlagManager.getAll()
      expect(flags).toHaveProperty('enableMultiplayer')
      expect(flags).toHaveProperty('enableWalletConnect')
    })

    it('should persist changes to localStorage', () => {
      featureFlagManager.enable('enableNFTs')
      const stored = localStorage.getItem('feature-flags')
      expect(stored).toBeTruthy()

      const parsed = JSON.parse(stored!)
      expect(parsed.enableNFTs).toBe(true)
    })

    it('should reset to defaults', () => {
      featureFlagManager.disable('enableMultiplayer')
      featureFlagManager.reset()
      expect(featureFlagManager.isEnabled('enableMultiplayer')).toBe(
        defaultFeatureFlags.enableMultiplayer
      )
    })
  })
})
