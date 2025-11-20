import { GAME_CONFIG } from '@/config/game'

describe('Game Configuration', () => {
  it('should have canvas configuration', () => {
    expect(GAME_CONFIG.CANVAS_WIDTH).toBe(800)
    expect(GAME_CONFIG.CANVAS_HEIGHT).toBe(600)
    expect(GAME_CONFIG.CANVAS_BG_COLOR).toBe('#1a1a2e')
  })

  it('should have player configuration', () => {
    expect(GAME_CONFIG.PLAYER_WIDTH).toBe(40)
    expect(GAME_CONFIG.PLAYER_HEIGHT).toBe(40)
    expect(GAME_CONFIG.PLAYER_SPEED).toBe(5)
    expect(GAME_CONFIG.PLAYER_JUMP_FORCE).toBe(12)
    expect(GAME_CONFIG.PLAYER_COLOR).toBe('#00ff00')
  })

  it('should have physics configuration', () => {
    expect(GAME_CONFIG.GRAVITY).toBe(0.5)
    expect(GAME_CONFIG.FRICTION).toBe(0.9)
    expect(GAME_CONFIG.MAX_FALL_SPEED).toBe(15)
  })

  it('should have obstacle configuration', () => {
    expect(GAME_CONFIG.OBSTACLE_SPAWN_INTERVAL).toBe(2000)
    expect(GAME_CONFIG.OBSTACLE_MIN_WIDTH).toBe(30)
    expect(GAME_CONFIG.OBSTACLE_MAX_WIDTH).toBe(80)
    expect(GAME_CONFIG.OBSTACLE_SPEED).toBe(3)
  })

  it('should have power-up configuration', () => {
    expect(GAME_CONFIG.POWERUP_SPAWN_INTERVAL).toBe(5000)
    expect(GAME_CONFIG.POWERUP_SIZE).toBe(30)
    expect(GAME_CONFIG.POWERUP_DURATION).toBe(5000)
  })

  it('should have scoring configuration', () => {
    expect(GAME_CONFIG.SCORE_PER_OBSTACLE).toBe(10)
    expect(GAME_CONFIG.COMBO_MULTIPLIER).toBe(0.2)
    expect(GAME_CONFIG.TIME_BONUS_MULTIPLIER).toBe(1)
  })

  it('should have difficulty configuration', () => {
    expect(GAME_CONFIG.DIFFICULTY_INCREASE_INTERVAL).toBe(30000)
    expect(GAME_CONFIG.DIFFICULTY_MULTIPLIER).toBe(0.1)
    expect(GAME_CONFIG.MAX_DIFFICULTY).toBe(3)
  })

  it('should have audio configuration', () => {
    expect(GAME_CONFIG.MASTER_VOLUME).toBe(1)
    expect(GAME_CONFIG.SFX_VOLUME).toBe(0.7)
    expect(GAME_CONFIG.MUSIC_VOLUME).toBe(0.5)
  })

  it('should have UI configuration', () => {
    expect(GAME_CONFIG.HUD_PADDING).toBe(20)
    expect(GAME_CONFIG.MINIMAP_WIDTH).toBe(150)
    expect(GAME_CONFIG.MINIMAP_HEIGHT).toBe(100)
  })

  it('should have performance configuration', () => {
    expect(GAME_CONFIG.TARGET_FPS).toBe(60)
    expect(GAME_CONFIG.MAX_PARTICLES).toBe(1000)
  })

  it('should be immutable', () => {
    expect(() => {
      // @ts-expect-error Testing immutability
      GAME_CONFIG.CANVAS_WIDTH = 1000
    }).toThrow()
  })
})
