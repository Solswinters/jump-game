import {
  GAME_CONSTANTS,
  BLOCKCHAIN_CONSTANTS,
  MULTIPLAYER_CONSTANTS,
  UI_CONSTANTS,
  API_CONSTANTS,
  STORAGE_KEYS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from '@/config/constants'

describe('Config - Constants', () => {
  describe('GAME_CONSTANTS', () => {
    it('should have canvas dimensions', () => {
      expect(GAME_CONSTANTS.CANVAS_WIDTH).toBeGreaterThan(0)
      expect(GAME_CONSTANTS.CANVAS_HEIGHT).toBeGreaterThan(0)
    })

    it('should have player properties', () => {
      expect(GAME_CONSTANTS.PLAYER_WIDTH).toBeGreaterThan(0)
      expect(GAME_CONSTANTS.PLAYER_HEIGHT).toBeGreaterThan(0)
      expect(GAME_CONSTANTS.PLAYER_SPEED).toBeGreaterThan(0)
    })

    it('should have physics constants', () => {
      expect(GAME_CONSTANTS.GRAVITY).toBeGreaterThan(0)
      expect(GAME_CONSTANTS.JUMP_FORCE).toBeLessThan(0) // Negative for upward force
    })

    it('should have scoring constants', () => {
      expect(GAME_CONSTANTS.SCORE_PER_OBSTACLE).toBeGreaterThan(0)
      expect(GAME_CONSTANTS.COMBO_MULTIPLIER).toBeGreaterThan(1)
    })
  })

  describe('BLOCKCHAIN_CONSTANTS', () => {
    it('should have gas configuration', () => {
      expect(BLOCKCHAIN_CONSTANTS.DEFAULT_GAS_LIMIT).toBeDefined()
      expect(BLOCKCHAIN_CONSTANTS.MAX_GAS_PRICE).toBeDefined()
    })

    it('should have token configuration', () => {
      expect(BLOCKCHAIN_CONSTANTS.TOKEN_DECIMALS).toBe(18)
    })

    it('should have transaction configuration', () => {
      expect(BLOCKCHAIN_CONSTANTS.TX_TIMEOUT).toBeGreaterThan(0)
      expect(BLOCKCHAIN_CONSTANTS.MAX_RETRIES).toBeGreaterThan(0)
    })
  })

  describe('MULTIPLAYER_CONSTANTS', () => {
    it('should have connection configuration', () => {
      expect(MULTIPLAYER_CONSTANTS.WS_RECONNECT_INTERVAL).toBeGreaterThan(0)
      expect(MULTIPLAYER_CONSTANTS.WS_MAX_RECONNECT_ATTEMPTS).toBeGreaterThan(0)
    })

    it('should have room configuration', () => {
      expect(MULTIPLAYER_CONSTANTS.MIN_PLAYERS).toBeGreaterThan(0)
      expect(MULTIPLAYER_CONSTANTS.MAX_PLAYERS).toBeGreaterThan(MULTIPLAYER_CONSTANTS.MIN_PLAYERS)
    })

    it('should have chat configuration', () => {
      expect(MULTIPLAYER_CONSTANTS.MAX_MESSAGE_LENGTH).toBeGreaterThan(0)
      expect(MULTIPLAYER_CONSTANTS.CHAT_RATE_LIMIT).toBeGreaterThan(0)
    })
  })

  describe('UI_CONSTANTS', () => {
    it('should have toast configuration', () => {
      expect(UI_CONSTANTS.TOAST_DURATION).toBeGreaterThan(0)
      expect(UI_CONSTANTS.TOAST_MAX_VISIBLE).toBeGreaterThan(0)
    })

    it('should have breakpoints', () => {
      expect(UI_CONSTANTS.MOBILE_BREAKPOINT).toBeGreaterThan(0)
      expect(UI_CONSTANTS.TABLET_BREAKPOINT).toBeGreaterThan(UI_CONSTANTS.MOBILE_BREAKPOINT)
      expect(UI_CONSTANTS.DESKTOP_BREAKPOINT).toBeGreaterThan(UI_CONSTANTS.TABLET_BREAKPOINT)
    })
  })

  describe('API_CONSTANTS', () => {
    it('should have timeout configuration', () => {
      expect(API_CONSTANTS.REQUEST_TIMEOUT).toBeGreaterThan(0)
      expect(API_CONSTANTS.UPLOAD_TIMEOUT).toBeGreaterThan(API_CONSTANTS.REQUEST_TIMEOUT)
    })

    it('should have retry configuration', () => {
      expect(API_CONSTANTS.MAX_RETRIES).toBeGreaterThan(0)
      expect(API_CONSTANTS.RETRY_DELAY).toBeGreaterThan(0)
      expect(API_CONSTANTS.BACKOFF_MULTIPLIER).toBeGreaterThan(1)
    })

    it('should have rate limiting configuration', () => {
      expect(API_CONSTANTS.RATE_LIMIT_REQUESTS).toBeGreaterThan(0)
      expect(API_CONSTANTS.RATE_LIMIT_WINDOW).toBeGreaterThan(0)
    })
  })

  describe('STORAGE_KEYS', () => {
    it('should have user keys', () => {
      expect(STORAGE_KEYS.USER_ID).toBeDefined()
      expect(STORAGE_KEYS.USERNAME).toBeDefined()
    })

    it('should have settings keys', () => {
      expect(STORAGE_KEYS.SOUND_ENABLED).toBeDefined()
      expect(STORAGE_KEYS.THEME).toBeDefined()
    })

    it('should have game keys', () => {
      expect(STORAGE_KEYS.HIGH_SCORE).toBeDefined()
      expect(STORAGE_KEYS.GAME_STATE).toBeDefined()
    })
  })

  describe('ERROR_MESSAGES', () => {
    it('should have network error messages', () => {
      expect(ERROR_MESSAGES.NETWORK_ERROR).toBeDefined()
      expect(ERROR_MESSAGES.TIMEOUT_ERROR).toBeDefined()
    })

    it('should have wallet error messages', () => {
      expect(ERROR_MESSAGES.WALLET_NOT_CONNECTED).toBeDefined()
      expect(ERROR_MESSAGES.TRANSACTION_FAILED).toBeDefined()
    })

    it('should have multiplayer error messages', () => {
      expect(ERROR_MESSAGES.ROOM_NOT_FOUND).toBeDefined()
      expect(ERROR_MESSAGES.ROOM_FULL).toBeDefined()
    })
  })

  describe('SUCCESS_MESSAGES', () => {
    it('should have wallet success messages', () => {
      expect(SUCCESS_MESSAGES.WALLET_CONNECTED).toBeDefined()
      expect(SUCCESS_MESSAGES.TRANSACTION_SUCCESS).toBeDefined()
    })

    it('should have game success messages', () => {
      expect(SUCCESS_MESSAGES.SCORE_SUBMITTED).toBeDefined()
      expect(SUCCESS_MESSAGES.ACHIEVEMENT_UNLOCKED).toBeDefined()
    })

    it('should have multiplayer success messages', () => {
      expect(SUCCESS_MESSAGES.ROOM_CREATED).toBeDefined()
      expect(SUCCESS_MESSAGES.ROOM_JOINED).toBeDefined()
    })
  })
})
