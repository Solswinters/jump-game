/**
 * Obstacle Manager - Handle obstacle spawning, movement, and collision
 */

export interface Obstacle {
  id: string
  type: ObstacleType
  x: number
  y: number
  width: number
  height: number
  speed: number
  active: boolean
  damage: number
  points: number
  sprite?: string
  animation?: {
    frame: number
    frameCount: number
    frameRate: number
    lastUpdate: number
  }
}

export enum ObstacleType {
  GROUND_STATIC = 'ground_static',
  GROUND_MOVING = 'ground_moving',
  AIR_STATIC = 'air_static',
  AIR_MOVING = 'air_moving',
  ROTATING = 'rotating',
  PROJECTILE = 'projectile',
}

export interface ObstacleConfig {
  spawnRate: number
  minDistance: number
  maxDistance: number
  baseSpeed: number
  speedIncrement: number
  maxSpeed: number
  poolSize: number
}

export interface ObstaclePattern {
  name: string
  obstacles: Array<{
    type: ObstacleType
    offsetX: number
    offsetY: number
  }>
  frequency: number
}

export class ObstacleManager {
  private obstacles: Obstacle[] = []
  private obstaclePool: Obstacle[] = []
  private config: ObstacleConfig
  private nextObstacleId: number = 0
  private lastSpawnTime: number = 0
  private gameSpeed: number = 1
  private patterns: ObstaclePattern[] = []
  private score: number = 0
  private canvasWidth: number
  private canvasHeight: number

  constructor(config: ObstacleConfig, canvasWidth: number, canvasHeight: number) {
    this.config = config
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    this.initializePool()
    this.initializePatterns()
  }

  /**
   * Initialize object pool
   */
  private initializePool(): void {
    for (let i = 0; i < this.config.poolSize; i++) {
      this.obstaclePool.push(this.createObstacle(ObstacleType.GROUND_STATIC, 0, 0))
    }
  }

  /**
   * Initialize obstacle patterns
   */
  private initializePatterns(): void {
    this.patterns = [
      {
        name: 'single_ground',
        obstacles: [{ type: ObstacleType.GROUND_STATIC, offsetX: 0, offsetY: 0 }],
        frequency: 0.5,
      },
      {
        name: 'double_ground',
        obstacles: [
          { type: ObstacleType.GROUND_STATIC, offsetX: 0, offsetY: 0 },
          { type: ObstacleType.GROUND_STATIC, offsetX: 100, offsetY: 0 },
        ],
        frequency: 0.3,
      },
      {
        name: 'air_obstacle',
        obstacles: [{ type: ObstacleType.AIR_STATIC, offsetX: 0, offsetY: -100 }],
        frequency: 0.2,
      },
      {
        name: 'mixed',
        obstacles: [
          { type: ObstacleType.GROUND_STATIC, offsetX: 0, offsetY: 0 },
          { type: ObstacleType.AIR_STATIC, offsetX: 150, offsetY: -100 },
        ],
        frequency: 0.15,
      },
    ]
  }

  /**
   * Create a new obstacle
   */
  private createObstacle(type: ObstacleType, x: number, y: number): Obstacle {
    const id = `obstacle-${this.nextObstacleId++}`

    const dimensions = this.getObstacleDimensions(type)
    const speed = this.calculateObstacleSpeed()

    return {
      id,
      type,
      x,
      y,
      width: dimensions.width,
      height: dimensions.height,
      speed,
      active: false,
      damage: 10,
      points: 10,
      sprite: this.getObstacleSprite(type),
      animation: {
        frame: 0,
        frameCount: 4,
        frameRate: 100,
        lastUpdate: 0,
      },
    }
  }

  /**
   * Get obstacle dimensions based on type
   */
  private getObstacleDimensions(type: ObstacleType): { width: number; height: number } {
    switch (type) {
      case ObstacleType.GROUND_STATIC:
        return { width: 50, height: 60 }
      case ObstacleType.GROUND_MOVING:
        return { width: 50, height: 60 }
      case ObstacleType.AIR_STATIC:
        return { width: 60, height: 40 }
      case ObstacleType.AIR_MOVING:
        return { width: 60, height: 40 }
      case ObstacleType.ROTATING:
        return { width: 70, height: 70 }
      case ObstacleType.PROJECTILE:
        return { width: 30, height: 30 }
      default:
        return { width: 50, height: 50 }
    }
  }

  /**
   * Get obstacle sprite
   */
  private getObstacleSprite(type: ObstacleType): string {
    const sprites: Record<ObstacleType, string> = {
      [ObstacleType.GROUND_STATIC]: 'cactus',
      [ObstacleType.GROUND_MOVING]: 'rolling_rock',
      [ObstacleType.AIR_STATIC]: 'bird',
      [ObstacleType.AIR_MOVING]: 'drone',
      [ObstacleType.ROTATING]: 'spinner',
      [ObstacleType.PROJECTILE]: 'fireball',
    }

    return sprites[type]
  }

  /**
   * Calculate obstacle speed based on game progress
   */
  private calculateObstacleSpeed(): number {
    const baseSpeed = this.config.baseSpeed * this.gameSpeed
    const progressSpeed = Math.floor(this.score / 1000) * this.config.speedIncrement

    return Math.min(baseSpeed + progressSpeed, this.config.maxSpeed)
  }

  /**
   * Spawn an obstacle
   */
  spawnObstacle(type?: ObstacleType): void {
    const obstacle = this.obstaclePool.pop()

    if (!obstacle) {
      console.warn('Obstacle pool exhausted')
      return
    }

    // Determine obstacle type
    const obstacleType = type || this.selectRandomObstacleType()

    // Reset obstacle properties
    Object.assign(obstacle, {
      type: obstacleType,
      x: this.canvasWidth,
      y: this.getObstacleYPosition(obstacleType),
      ...this.getObstacleDimensions(obstacleType),
      speed: this.calculateObstacleSpeed(),
      active: true,
      sprite: this.getObstacleSprite(obstacleType),
    })

    this.obstacles.push(obstacle)
  }

  /**
   * Spawn obstacle pattern
   */
  spawnPattern(patternName?: string): void {
    let pattern: ObstaclePattern

    if (patternName) {
      pattern = this.patterns.find((p) => p.name === patternName)!
    } else {
      pattern = this.selectRandomPattern()
    }

    if (!pattern) {
      return
    }

    pattern.obstacles.forEach((obstacleConfig) => {
      const obstacle = this.obstaclePool.pop()

      if (!obstacle) {
        return
      }

      Object.assign(obstacle, {
        type: obstacleConfig.type,
        x: this.canvasWidth + obstacleConfig.offsetX,
        y: this.getObstacleYPosition(obstacleConfig.type) + obstacleConfig.offsetY,
        ...this.getObstacleDimensions(obstacleConfig.type),
        speed: this.calculateObstacleSpeed(),
        active: true,
        sprite: this.getObstacleSprite(obstacleConfig.type),
      })

      this.obstacles.push(obstacle)
    })
  }

  /**
   * Select random obstacle type
   */
  private selectRandomObstacleType(): ObstacleType {
    const types = Object.values(ObstacleType)
    return types[Math.floor(Math.random() * types.length)]
  }

  /**
   * Select random pattern
   */
  private selectRandomPattern(): ObstaclePattern {
    const rand = Math.random()
    let cumulativeFrequency = 0

    for (const pattern of this.patterns) {
      cumulativeFrequency += pattern.frequency
      if (rand <= cumulativeFrequency) {
        return pattern
      }
    }

    return this.patterns[0]
  }

  /**
   * Get Y position for obstacle type
   */
  private getObstacleYPosition(type: ObstacleType): number {
    switch (type) {
      case ObstacleType.GROUND_STATIC:
      case ObstacleType.GROUND_MOVING:
        return this.canvasHeight - 100 // Ground level
      case ObstacleType.AIR_STATIC:
      case ObstacleType.AIR_MOVING:
        return this.canvasHeight - 200 // Air level
      case ObstacleType.ROTATING:
        return this.canvasHeight - 150 // Mid level
      case ObstacleType.PROJECTILE:
        return this.canvasHeight - 120 // Variable
      default:
        return this.canvasHeight - 100
    }
  }

  /**
   * Update obstacles
   */
  update(deltaTime: number): void {
    const now = Date.now()

    // Auto spawn obstacles
    if (now - this.lastSpawnTime > this.config.spawnRate) {
      this.spawnPattern()
      this.lastSpawnTime = now
    }

    // Update each obstacle
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obstacle = this.obstacles[i]

      if (!obstacle.active) {
        continue
      }

      // Move obstacle
      obstacle.x -= obstacle.speed * deltaTime * 0.06

      // Update animation
      if (
        obstacle.animation &&
        now - obstacle.animation.lastUpdate > obstacle.animation.frameRate
      ) {
        obstacle.animation.frame = (obstacle.animation.frame + 1) % obstacle.animation.frameCount
        obstacle.animation.lastUpdate = now
      }

      // Special behavior for moving obstacles
      if (obstacle.type === ObstacleType.GROUND_MOVING) {
        obstacle.y += Math.sin(now * 0.002) * 2
      }

      // Remove obstacles that are off-screen
      if (obstacle.x + obstacle.width < 0) {
        obstacle.active = false
        this.obstacles.splice(i, 1)
        this.obstaclePool.push(obstacle)
      }
    }
  }

  /**
   * Render obstacles
   */
  render(ctx: CanvasRenderingContext2D): void {
    this.obstacles.forEach((obstacle) => {
      if (!obstacle.active) {
        return
      }

      // Draw placeholder (replace with sprite rendering)
      ctx.fillStyle = '#FF6B6B'
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)

      // Draw hitbox in debug mode
      if (process.env.NODE_ENV === 'development') {
        ctx.strokeStyle = '#FF0000'
        ctx.lineWidth = 2
        ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
      }
    })
  }

  /**
   * Get active obstacles
   */
  getObstacles(): Obstacle[] {
    return this.obstacles.filter((o) => o.active)
  }

  /**
   * Remove obstacle
   */
  removeObstacle(id: string): void {
    const index = this.obstacles.findIndex((o) => o.id === id)

    if (index !== -1) {
      const obstacle = this.obstacles[index]
      obstacle.active = false
      this.obstacles.splice(index, 1)
      this.obstaclePool.push(obstacle)
    }
  }

  /**
   * Clear all obstacles
   */
  clear(): void {
    this.obstacles.forEach((obstacle) => {
      obstacle.active = false
      this.obstaclePool.push(obstacle)
    })

    this.obstacles = []
  }

  /**
   * Set game speed
   */
  setGameSpeed(speed: number): void {
    this.gameSpeed = speed
  }

  /**
   * Update score
   */
  setScore(score: number): void {
    this.score = score
  }

  /**
   * Add custom pattern
   */
  addPattern(pattern: ObstaclePattern): void {
    this.patterns.push(pattern)
  }

  /**
   * Get statistics
   */
  getStats(): {
    activeCount: number
    poolSize: number
    totalSpawned: number
  } {
    return {
      activeCount: this.obstacles.length,
      poolSize: this.obstaclePool.length,
      totalSpawned: this.nextObstacleId,
    }
  }
}

export default ObstacleManager
