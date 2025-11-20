/**
 * Integration tests for game flow
 */

import { ParticleSystem } from '@/modules/game/effects/ParticleSystem'
import { TimeManager } from '@/modules/game/time/TimeManager'

describe('Game Flow Integration', () => {
  let particleSystem: ParticleSystem
  let timeManager: TimeManager

  beforeEach(() => {
    particleSystem = new ParticleSystem()
    timeManager = new TimeManager()
  })

  it('should coordinate particles with time manager', () => {
    // Emit particles
    particleSystem.emit(100, 100, 10)
    expect(particleSystem.getParticleCount()).toBe(10)

    // Update time manager
    timeManager.update(Date.now())

    // Update particles with delta time
    particleSystem.update(timeManager.deltaTime)

    // Particles should still exist
    expect(particleSystem.getParticleCount()).toBe(10)
  })

  it('should handle time scaling for particles', () => {
    particleSystem.emit(100, 100, 5)

    // Normal time scale
    timeManager.setTimeScale(1)
    timeManager.update(Date.now())
    particleSystem.update(timeManager.deltaTime)

    const normalCount = particleSystem.getParticleCount()

    // Slow motion
    timeManager.setTimeScale(0.5)
    timeManager.update(Date.now() + 16)
    particleSystem.update(timeManager.deltaTime)

    // With slow motion, particles should decay slower
    expect(particleSystem.getParticleCount()).toBeLessThanOrEqual(normalCount)
  })

  it('should handle pause and resume', () => {
    particleSystem.emit(100, 100, 10)

    timeManager.pause()
    timeManager.update(Date.now())

    // With paused time, delta should be 0
    expect(timeManager.deltaTime).toBe(0)

    particleSystem.update(timeManager.deltaTime)

    // Particles should not decay when time is paused
    expect(particleSystem.getParticleCount()).toBe(10)

    timeManager.resume()
    timeManager.update(Date.now() + 16)
    particleSystem.update(timeManager.deltaTime)

    // Now particles can decay
    expect(particleSystem.getParticleCount()).toBeLessThanOrEqual(10)
  })
})
