/**
 * Obstacle factory for creating different obstacle types
 */

import type {
  Obstacle,
  StaticObstacle,
  MovingObstacle,
  RotatingObstacle,
  SpikesObstacle,
  LaserObstacle,
  BreakableObstacle,
} from './types'
import { OBSTACLE, CANVAS } from '../constants'
import { randomInt } from '@/shared/math'

function generateId(): string {
  return `obstacle-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export class ObstacleFactory {
  private static instance: ObstacleFactory

  static getInstance(): ObstacleFactory {
    if (!ObstacleFactory.instance) {
      ObstacleFactory.instance = new ObstacleFactory()
    }
    return ObstacleFactory.instance
  }

  createStatic(x: number, customHeight?: number): StaticObstacle {
    const height = customHeight ?? randomInt(OBSTACLE.MIN_HEIGHT, OBSTACLE.MAX_HEIGHT)
    return {
      id: generateId(),
      type: 'static',
      x,
      y: CANVAS.GROUND_Y - height,
      width: OBSTACLE.WIDTH,
      height,
      speed: OBSTACLE.SPEED,
      passed: false,
    }
  }

  createMoving(x: number): MovingObstacle {
    const height = randomInt(OBSTACLE.MIN_HEIGHT, OBSTACLE.MAX_HEIGHT)
    const y = CANVAS.GROUND_Y - height - 50
    return {
      id: generateId(),
      type: 'moving',
      x,
      y,
      width: OBSTACLE.WIDTH,
      height,
      speed: OBSTACLE.SPEED,
      passed: false,
      direction: 'vertical',
      range: 100,
      originalY: y,
    }
  }

  createRotating(x: number): RotatingObstacle {
    const size = 60
    return {
      id: generateId(),
      type: 'rotating',
      x,
      y: CANVAS.GROUND_Y - size,
      width: size,
      height: size,
      speed: OBSTACLE.SPEED,
      passed: false,
      angle: 0,
      rotationSpeed: 0.05,
    }
  }

  createSpikes(x: number): SpikesObstacle {
    const height = 30
    return {
      id: generateId(),
      type: 'spikes',
      x,
      y: CANVAS.GROUND_Y - height,
      width: OBSTACLE.WIDTH * 2,
      height,
      speed: OBSTACLE.SPEED,
      passed: false,
      damage: 1,
    }
  }

  createLaser(x: number): LaserObstacle {
    const height = CANVAS.GROUND_Y
    return {
      id: generateId(),
      type: 'laser',
      x,
      y: 0,
      width: 5,
      height,
      speed: OBSTACLE.SPEED,
      passed: false,
      active: true,
      cycleTime: 0,
      activeDuration: 2000,
    }
  }

  createBreakable(x: number): BreakableObstacle {
    const height = randomInt(OBSTACLE.MIN_HEIGHT, OBSTACLE.MAX_HEIGHT)
    return {
      id: generateId(),
      type: 'breakable',
      x,
      y: CANVAS.GROUND_Y - height,
      width: OBSTACLE.WIDTH,
      height,
      speed: OBSTACLE.SPEED,
      passed: false,
      health: 2,
      broken: false,
    }
  }

  createRandom(x: number): Obstacle {
    const types = ['static', 'moving', 'rotating', 'spikes', 'laser', 'breakable'] as const
    const type = types[randomInt(0, types.length - 1)]

    switch (type) {
      case 'static':
        return this.createStatic(x)
      case 'moving':
        return this.createMoving(x)
      case 'rotating':
        return this.createRotating(x)
      case 'spikes':
        return this.createSpikes(x)
      case 'laser':
        return this.createLaser(x)
      case 'breakable':
        return this.createBreakable(x)
      default:
        return this.createStatic(x)
    }
  }
}

export const obstacleFactory = ObstacleFactory.getInstance()
