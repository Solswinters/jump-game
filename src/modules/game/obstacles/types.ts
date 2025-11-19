/**
 * Obstacle type definitions
 */

export interface BaseObstacle {
  id: string
  x: number
  y: number
  width: number
  height: number
  speed: number
  passed: boolean
}

export interface StaticObstacle extends BaseObstacle {
  type: 'static'
}

export interface MovingObstacle extends BaseObstacle {
  type: 'moving'
  direction: 'horizontal' | 'vertical'
  range: number
  originalY: number
}

export interface RotatingObstacle extends BaseObstacle {
  type: 'rotating'
  angle: number
  rotationSpeed: number
}

export interface SpikesObstacle extends BaseObstacle {
  type: 'spikes'
  damage: number
}

export interface LaserObstacle extends BaseObstacle {
  type: 'laser'
  active: boolean
  cycleTime: number
  activeDuration: number
}

export interface BreakableObstacle extends BaseObstacle {
  type: 'breakable'
  health: number
  broken: boolean
}

export type Obstacle =
  | StaticObstacle
  | MovingObstacle
  | RotatingObstacle
  | SpikesObstacle
  | LaserObstacle
  | BreakableObstacle

export interface ObstaclePool {
  available: Obstacle[]
  active: Obstacle[]
}
