/**
 * Test data factories for game objects
 */

import { Player } from '@/modules/game/player/Player'
import { AABB } from '@/modules/game/physics/collision/aabb'

export const createMockPlayer = (overrides?: Partial<Player>): Player => ({
  id: 'player-1',
  x: 0,
  y: 0,
  width: 32,
  height: 32,
  velocityX: 0,
  velocityY: 0,
  health: 100,
  energy: 100,
  score: 0,
  isJumping: false,
  isGrounded: true,
  powerUps: [],
  ...overrides,
})

export const createMockObstacle = (overrides?: Partial<AABB>): AABB => ({
  x: 100,
  y: 10,
  width: 50,
  height: 50,
  ...overrides,
})

export const createMockPowerUp = (type: string = 'speed') => ({
  id: `powerup-${Date.now()}`,
  type,
  x: 150,
  y: 20,
  width: 20,
  height: 20,
  duration: 5000,
  active: false,
})

export const createMockGameState = () => ({
  player: createMockPlayer(),
  obstacles: [createMockObstacle()],
  powerUps: [],
  score: 0,
  level: 1,
  isPaused: false,
  isGameOver: false,
})
