/**
 * AI Opponent - Intelligent computer-controlled opponent for the game
 */

export enum AIDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert',
}

export interface AIConfig {
  difficulty: AIDifficulty
  reactionTime: number // milliseconds
  accuracy: number // 0-1
  decisionInterval: number // milliseconds
  lookAheadDistance: number // pixels
  riskTolerance: number // 0-1
}

export interface AIState {
  position: { x: number; y: number }
  velocity: { x: number; y: number }
  isJumping: boolean
  health: number
  score: number
  powerUps: string[]
}

export interface Obstacle {
  x: number
  y: number
  width: number
  height: number
  type: string
}

export interface PowerUp {
  x: number
  y: number
  width: number
  height: number
  type: string
}

export type AIDecision = 'jump' | 'duck' | 'boost' | 'wait' | 'collect_powerup'

export class AIOpponent {
  private config: AIConfig
  private state: AIState
  private lastDecisionTime: number = 0
  private decisionQueue: AIDecision[] = []
  private performanceMetrics: {
    totalDecisions: number
    successfulDodges: number
    failedDodges: number
    powerUpsCollected: number
  }

  constructor(difficulty: AIDifficulty = AIDifficulty.MEDIUM) {
    this.config = this.getConfigForDifficulty(difficulty)
    this.state = {
      position: { x: 100, y: 300 },
      velocity: { x: 0, y: 0 },
      isJumping: false,
      health: 100,
      score: 0,
      powerUps: [],
    }
    this.performanceMetrics = {
      totalDecisions: 0,
      successfulDodges: 0,
      failedDodges: 0,
      powerUpsCollected: 0,
    }
  }

  /**
   * Get configuration based on difficulty level
   */
  private getConfigForDifficulty(difficulty: AIDifficulty): AIConfig {
    const configs: Record<AIDifficulty, AIConfig> = {
      [AIDifficulty.EASY]: {
        difficulty: AIDifficulty.EASY,
        reactionTime: 800,
        accuracy: 0.5,
        decisionInterval: 500,
        lookAheadDistance: 200,
        riskTolerance: 0.7,
      },
      [AIDifficulty.MEDIUM]: {
        difficulty: AIDifficulty.MEDIUM,
        reactionTime: 500,
        accuracy: 0.7,
        decisionInterval: 300,
        lookAheadDistance: 400,
        riskTolerance: 0.5,
      },
      [AIDifficulty.HARD]: {
        difficulty: AIDifficulty.HARD,
        reactionTime: 250,
        accuracy: 0.85,
        decisionInterval: 200,
        lookAheadDistance: 600,
        riskTolerance: 0.3,
      },
      [AIDifficulty.EXPERT]: {
        difficulty: AIDifficulty.EXPERT,
        reactionTime: 100,
        accuracy: 0.95,
        decisionInterval: 100,
        lookAheadDistance: 800,
        riskTolerance: 0.1,
      },
    }
    return configs[difficulty]
  }

  /**
   * Update AI state and make decisions
   */
  update(
    deltaTime: number,
    obstacles: Obstacle[],
    powerUps: PowerUp[],
    gameSpeed: number
  ): AIDecision | null {
    const now = Date.now()

    // Update state
    this.state.position.x += this.state.velocity.x * deltaTime
    this.state.position.y += this.state.velocity.y * deltaTime

    // Check if it's time to make a new decision
    if (now - this.lastDecisionTime < this.config.decisionInterval) {
      return null
    }

    this.lastDecisionTime = now

    // Analyze environment and make decision
    const decision = this.makeDecision(obstacles, powerUps, gameSpeed)

    if (decision) {
      this.performanceMetrics.totalDecisions++
    }

    return decision
  }

  /**
   * Make intelligent decision based on environment
   */
  private makeDecision(
    obstacles: Obstacle[],
    powerUps: PowerUp[],
    gameSpeed: number
  ): AIDecision | null {
    // Get obstacles and power-ups within look-ahead distance
    const nearbyObstacles = this.getObstaclesInRange(obstacles)
    const nearbyPowerUps = this.getPowerUpsInRange(powerUps)

    // Calculate threat levels
    const immediateThreat = this.assessImmediateThreat(nearbyObstacles)
    const powerUpOpportunity = this.assessPowerUpOpportunity(nearbyPowerUps)

    // Decision priority:
    // 1. Avoid immediate threats
    // 2. Collect valuable power-ups if safe
    // 3. Maintain optimal position

    // Handle immediate threats
    if (immediateThreat) {
      return this.decideAvoidanceAction(immediateThreat)
    }

    // Try to collect power-ups if safe
    if (powerUpOpportunity && this.isSafeToCollect(powerUpOpportunity, nearbyObstacles)) {
      return 'collect_powerup'
    }

    // Use power-ups strategically
    if (this.shouldUsePowerUp()) {
      return 'boost'
    }

    // Default: maintain position
    return 'wait'
  }

  /**
   * Get obstacles within look-ahead range
   */
  private getObstaclesInRange(obstacles: Obstacle[]): Obstacle[] {
    return obstacles.filter(
      (obstacle) =>
        obstacle.x >= this.state.position.x &&
        obstacle.x <= this.state.position.x + this.config.lookAheadDistance
    )
  }

  /**
   * Get power-ups within look-ahead range
   */
  private getPowerUpsInRange(powerUps: PowerUp[]): PowerUp[] {
    return powerUps.filter(
      (powerUp) =>
        powerUp.x >= this.state.position.x &&
        powerUp.x <= this.state.position.x + this.config.lookAheadDistance
    )
  }

  /**
   * Assess immediate threat from obstacles
   */
  private assessImmediateThreat(obstacles: Obstacle[]): Obstacle | null {
    if (obstacles.length === 0) return null

    // Find closest obstacle
    const closest = obstacles.reduce((prev, curr) => (curr.x < prev.x ? curr : prev))

    // Calculate time to collision
    const distance = closest.x - this.state.position.x
    const relativeSpeed = 5 // assume game speed

    const timeToCollision = distance / relativeSpeed

    // If collision is imminent, return as threat
    if (timeToCollision < this.config.reactionTime / 1000) {
      return closest
    }

    return null
  }

  /**
   * Assess power-up collection opportunity
   */
  private assessPowerUpOpportunity(powerUps: PowerUp[]): PowerUp | null {
    if (powerUps.length === 0) return null

    // Prioritize power-ups based on type and distance
    const scored = powerUps.map((powerUp) => ({
      powerUp,
      score: this.scorePowerUp(powerUp),
    }))

    scored.sort((a, b) => b.score - a.score)

    return scored[0]?.powerUp || null
  }

  /**
   * Score power-up value
   */
  private scorePowerUp(powerUp: PowerUp): number {
    const distance = powerUp.x - this.state.position.x
    const distanceScore = 1 - distance / this.config.lookAheadDistance

    // Type bonuses
    const typeScores: Record<string, number> = {
      invincibility: 1.0,
      'score-multiplier': 0.9,
      'speed-boost': 0.7,
      'double-jump': 0.6,
      'slow-motion': 0.5,
    }

    const typeScore = typeScores[powerUp.type] || 0.5

    return distanceScore * typeScore
  }

  /**
   * Check if it's safe to collect power-up
   */
  private isSafeToCollect(powerUp: PowerUp, obstacles: Obstacle[]): boolean {
    // Check if collecting power-up would lead to collision
    for (const obstacle of obstacles) {
      const powerUpDistance = powerUp.x - this.state.position.x
      const obstacleDistance = obstacle.x - this.state.position.x

      // If obstacle is between AI and power-up, it's not safe
      if (obstacleDistance < powerUpDistance && obstacleDistance < 100) {
        return false
      }
    }

    return Math.random() < 1 - this.config.riskTolerance
  }

  /**
   * Decide avoidance action for threat
   */
  private decideAvoidanceAction(obstacle: Obstacle): AIDecision {
    // Apply accuracy - AI might make mistakes
    if (Math.random() > this.config.accuracy) {
      this.performanceMetrics.failedDodges++
      return 'wait' // Mistake: failed to react
    }

    this.performanceMetrics.successfulDodges++

    // Determine best avoidance action based on obstacle position
    const obstacleHeight = obstacle.y + obstacle.height
    const playerHeight = this.state.position.y + 50 // assume player height

    if (obstacleHeight < playerHeight) {
      return 'jump'
    } else {
      return 'duck'
    }
  }

  /**
   * Check if AI should use power-up
   */
  private shouldUsePowerUp(): boolean {
    if (this.state.powerUps.length === 0) return false

    // Use power-ups strategically based on difficulty
    const useChance = 1 - this.config.riskTolerance
    return Math.random() < useChance
  }

  /**
   * Update AI state after action
   */
  updateState(newState: Partial<AIState>): void {
    this.state = { ...this.state, ...newState }
  }

  /**
   * Get current AI state
   */
  getState(): AIState {
    return { ...this.state }
  }

  /**
   * Get current configuration
   */
  getConfig(): AIConfig {
    return { ...this.config }
  }

  /**
   * Set difficulty level
   */
  setDifficulty(difficulty: AIDifficulty): void {
    this.config = this.getConfigForDifficulty(difficulty)
  }

  /**
   * Get performance metrics
   */
  getMetrics() {
    const totalAttempts =
      this.performanceMetrics.successfulDodges + this.performanceMetrics.failedDodges
    const successRate =
      totalAttempts > 0 ? this.performanceMetrics.successfulDodges / totalAttempts : 0

    return {
      ...this.performanceMetrics,
      successRate,
      decisionsPerSecond: this.performanceMetrics.totalDecisions / (Date.now() / 1000),
    }
  }

  /**
   * Reset AI state and metrics
   */
  reset(): void {
    this.state = {
      position: { x: 100, y: 300 },
      velocity: { x: 0, y: 0 },
      isJumping: false,
      health: 100,
      score: 0,
      powerUps: [],
    }
    this.performanceMetrics = {
      totalDecisions: 0,
      successfulDodges: 0,
      failedDodges: 0,
      powerUpsCollected: 0,
    }
    this.lastDecisionTime = 0
    this.decisionQueue = []
  }

  /**
   * Simulate reaction time delay
   */
  private async applyReactionDelay(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, this.config.reactionTime)
    })
  }

  /**
   * Learn from mistakes (adaptive difficulty)
   */
  adapt(success: boolean): void {
    if (success) {
      // Slightly increase difficulty after successful actions
      this.config.accuracy = Math.min(0.99, this.config.accuracy + 0.01)
      this.config.reactionTime = Math.max(50, this.config.reactionTime - 10)
    } else {
      // Slightly decrease difficulty after failures
      this.config.accuracy = Math.max(0.3, this.config.accuracy - 0.02)
      this.config.reactionTime = Math.min(1000, this.config.reactionTime + 20)
    }
  }
}

export default AIOpponent
