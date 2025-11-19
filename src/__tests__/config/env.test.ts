import { env, isDevelopment, isProduction, isTest, isClient, isServer } from '@/config/env'

describe('Config - Environment', () => {
  describe('env', () => {
    it('should have NODE_ENV defined', () => {
      expect(env.NODE_ENV).toBeDefined()
    })

    it('should have APP_URL defined', () => {
      expect(env.APP_URL).toBeDefined()
      expect(typeof env.APP_URL).toBe('string')
    })

    it('should have CHAIN_ID as number', () => {
      expect(typeof env.CHAIN_ID).toBe('number')
    })

    it('should have blockchain addresses', () => {
      expect(env.GAME_TOKEN_ADDRESS).toBeDefined()
      expect(env.GAME_REWARDS_ADDRESS).toBeDefined()
    })

    it('should have multiplayer configuration', () => {
      expect(env.WS_URL).toBeDefined()
      expect(typeof env.MAX_PLAYERS).toBe('number')
    })
  })

  describe('environment flags', () => {
    it('should determine if development', () => {
      expect(typeof isDevelopment).toBe('boolean')
    })

    it('should determine if production', () => {
      expect(typeof isProduction).toBe('boolean')
    })

    it('should determine if test', () => {
      expect(typeof isTest).toBe('boolean')
    })

    it('should only be one environment', () => {
      const count = [isDevelopment, isProduction, isTest].filter(Boolean).length
      expect(count).toBe(1)
    })
  })

  describe('runtime flags', () => {
    it('should determine if client', () => {
      expect(typeof isClient).toBe('boolean')
    })

    it('should determine if server', () => {
      expect(typeof isServer).toBe('boolean')
    })

    it('should be mutually exclusive', () => {
      expect(isClient).toBe(!isServer)
    })
  })
})
