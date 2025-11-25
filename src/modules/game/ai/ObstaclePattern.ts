/**
 * AI-driven obstacle patterns
 */

import type { Obstacle } from '../obstacles/types'
import { obstacleFactory } from '../obstacles/factory'

export interface Pattern {
  name: string
  obstacles: Array<{ x: number; type: Obstacle['type'] }>
  width: number
}

export class ObstaclePatternGenerator {
  private patterns: Pattern[] = []

  constructor() {
    this.initializePatterns()
  }

  private initializePatterns(): void {
    this.patterns = [
      {
        name: 'single',
        obstacles: [{ x: 0, type: 'static' }],
        width: 200,
      },
      {
        name: 'double',
        obstacles: [
          { x: 0, type: 'static' },
          { x: 150, type: 'static' },
        ],
        width: 350,
      },
      {
        name: 'staircase',
        obstacles: [
          { x: 0, type: 'static' },
          { x: 100, type: 'static' },
          { x: 200, type: 'static' },
        ],
        width: 400,
      },
      {
        name: 'gauntlet',
        obstacles: [
          { x: 0, type: 'moving' },
          { x: 200, type: 'static' },
          { x: 350, type: 'moving' },
        ],
        width: 550,
      },
      {
        name: 'rotating-pair',
        obstacles: [
          { x: 0, type: 'rotating' },
          { x: 200, type: 'rotating' },
        ],
        width: 400,
      },
      {
        name: 'laser-corridor',
        obstacles: [
          { x: 0, type: 'laser' },
          { x: 150, type: 'static' },
          { x: 300, type: 'laser' },
        ],
        width: 500,
      },
    ]
  }

  selectPattern(difficulty: number): Pattern {
    // Filter patterns by difficulty
    const availablePatterns = this.patterns.filter((_, index) => {
      const patternDifficulty = index / this.patterns.length
      return patternDifficulty <= difficulty
    })

    const randomIndex = Math.floor(Math.random() * availablePatterns.length)
    return availablePatterns[randomIndex] || this.patterns[0]!
  }

  generateFromPattern(pattern: Pattern, startX: number): Obstacle[] {
    return pattern.obstacles.map((obstacleConfig) => {
      const x = startX + obstacleConfig.x

      switch (obstacleConfig.type) {
        case 'static':
          return obstacleFactory.createStatic(x)
        case 'moving':
          return obstacleFactory.createMoving(x)
        case 'rotating':
          return obstacleFactory.createRotating(x)
        case 'spikes':
          return obstacleFactory.createSpikes(x)
        case 'laser':
          return obstacleFactory.createLaser(x)
        case 'breakable':
          return obstacleFactory.createBreakable(x)
      }
    })
  }

  getPatternWidth(pattern: Pattern): number {
    return pattern.width
  }
}

/**
 * patternGenerator utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of patternGenerator.
 */
export const patternGenerator = new ObstaclePatternGenerator()
