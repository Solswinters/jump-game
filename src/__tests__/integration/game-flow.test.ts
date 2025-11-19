import { GameEngine } from '@/modules/game/core/GameEngine'
import { createMockGameState } from '@/test-utils/factories'

describe('Game Flow Integration', () => {
  let engine: GameEngine

  beforeEach(() => {
    engine = new GameEngine()
  })

  it('should initialize game correctly', () => {
    expect(engine.isRunning).toBe(false)
    expect(engine.score).toBe(0)
  })

  it('should handle full game session', () => {
    engine.start()
    expect(engine.isRunning).toBe(true)

    engine.update(16)
    expect(engine.frameCount).toBeGreaterThan(0)

    engine.pause()
    expect(engine.isPaused).toBe(true)

    engine.resume()
    expect(engine.isPaused).toBe(false)

    engine.gameOver()
    expect(engine.isRunning).toBe(false)
  })

  it('should track score correctly', () => {
    engine.start()
    engine.addScore(100)
    expect(engine.score).toBe(100)

    engine.addScore(50)
    expect(engine.score).toBe(150)
  })
})
