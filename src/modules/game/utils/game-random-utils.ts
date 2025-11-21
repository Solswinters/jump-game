/**
 * Random number generation utilities with seeded and non-seeded options
 * Provides predictable randomness for procedural generation
 */

export class GameRandomUtils {
  /**
   * Simple pseudo-random number generator (Mulberry32)
   * Provides reproducible randomness with a seed
   */
  private static mulberry32(seed: number): () => number {
    return function () {
      let t = (seed += 0x6d2b79f5)
      t = Math.imul(t ^ (t >>> 15), t | 1)
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
  }

  /**
   * Create a seeded random number generator
   */
  static createSeededRandom(seed: number): SeededRandom {
    const rng = this.mulberry32(seed)

    return {
      random: () => rng(),
      randomInt: (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min,
      randomFloat: (min: number, max: number) => rng() * (max - min) + min,
      randomBool: (probability: number = 0.5) => rng() < probability,
      randomChoice: <T>(array: T[]) => array[Math.floor(rng() * array.length)],
      shuffle: <T>(array: T[]) => {
        const shuffled = [...array]
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(rng() * (i + 1))
          ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }
        return shuffled
      },
      reset: (newSeed: number) => {
        const newRng = this.mulberry32(newSeed)
        return {
          random: () => newRng(),
          randomInt: (min: number, max: number) => Math.floor(newRng() * (max - min + 1)) + min,
          randomFloat: (min: number, max: number) => newRng() * (max - min) + min,
          randomBool: (probability: number = 0.5) => newRng() < probability,
          randomChoice: <T>(array: T[]) => array[Math.floor(newRng() * array.length)],
          shuffle: <T>(array: T[]) => {
            const shuffled = [...array]
            for (let i = shuffled.length - 1; i > 0; i--) {
              const j = Math.floor(newRng() * (i + 1))
              ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
            }
            return shuffled
          },
          reset: () => {
            throw new Error('Not implemented')
          },
        }
      },
    }
  }

  /**
   * Generate random integer between min and max (inclusive)
   */
  static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  /**
   * Generate random float between min and max
   */
  static randomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min
  }

  /**
   * Generate random boolean with optional probability
   */
  static randomBool(probability: number = 0.5): boolean {
    return Math.random() < probability
  }

  /**
   * Pick random element from array
   */
  static randomChoice<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
  }

  /**
   * Pick random n elements from array
   */
  static randomChoiceN<T>(array: T[], n: number): T[] {
    const shuffled = this.shuffle(array)
    return shuffled.slice(0, Math.min(n, array.length))
  }

  /**
   * Shuffle array (Fisher-Yates algorithm)
   */
  static shuffle<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  /**
   * Generate random string
   */
  static randomString(
    length: number,
    charset: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  ): string {
    let result = ''
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    return result
  }

  /**
   * Generate random color (hex)
   */
  static randomColor(): string {
    return `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0')}`
  }

  /**
   * Generate random RGB color
   */
  static randomRGB(): { r: number; g: number; b: number } {
    return {
      r: this.randomInt(0, 255),
      g: this.randomInt(0, 255),
      b: this.randomInt(0, 255),
    }
  }

  /**
   * Weighted random choice
   */
  static weightedChoice<T>(items: T[], weights: number[]): T {
    if (items.length !== weights.length) {
      throw new Error('Items and weights arrays must have the same length')
    }

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
    let random = Math.random() * totalWeight

    for (let i = 0; i < items.length; i++) {
      random -= weights[i]
      if (random <= 0) {
        return items[i]
      }
    }

    return items[items.length - 1]
  }

  /**
   * Generate random point in circle
   */
  static randomPointInCircle(radius: number): { x: number; y: number } {
    const angle = Math.random() * 2 * Math.PI
    const r = Math.sqrt(Math.random()) * radius

    return {
      x: r * Math.cos(angle),
      y: r * Math.sin(angle),
    }
  }

  /**
   * Generate random point in rectangle
   */
  static randomPointInRect(width: number, height: number): { x: number; y: number } {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
    }
  }

  /**
   * Generate random angle in radians
   */
  static randomAngle(): number {
    return Math.random() * 2 * Math.PI
  }

  /**
   * Generate random angle in degrees
   */
  static randomAngleDegrees(): number {
    return Math.random() * 360
  }

  /**
   * Generate gaussian (normal) distributed random number
   * Uses Box-Muller transform
   */
  static randomGaussian(mean: number = 0, standardDeviation: number = 1): number {
    const u1 = Math.random()
    const u2 = Math.random()

    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)

    return z0 * standardDeviation + mean
  }

  /**
   * Generate Perlin noise value (simplified)
   */
  static perlinNoise(x: number, y: number): number {
    // Simplified Perlin noise implementation
    const dotGridGradient = (ix: number, iy: number, fx: number, fy: number): number => {
      const random =
        2920 * Math.sin(ix * 21942 + iy * 171324 + 8912) * Math.cos(ix * 23157 * iy * 217832 + 9758)
      const dx = fx - ix
      const dy = fy - iy
      return dx * Math.cos(random) + dy * Math.sin(random)
    }

    const interpolate = (a: number, b: number, w: number): number => {
      return (b - a) * ((w * (w * 6.0 - 15.0) + 10.0) * w * w * w) + a
    }

    const x0 = Math.floor(x)
    const x1 = x0 + 1
    const y0 = Math.floor(y)
    const y1 = y0 + 1

    const sx = x - x0
    const sy = y - y0

    const n0 = dotGridGradient(x0, y0, x, y)
    const n1 = dotGridGradient(x1, y0, x, y)
    const ix0 = interpolate(n0, n1, sx)

    const n2 = dotGridGradient(x0, y1, x, y)
    const n3 = dotGridGradient(x1, y1, x, y)
    const ix1 = interpolate(n2, n3, sx)

    return interpolate(ix0, ix1, sy)
  }

  /**
   * Generate UUID v4
   */
  static uuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  /**
   * Random with exponential distribution
   */
  static randomExponential(lambda: number = 1): number {
    return -Math.log(1 - Math.random()) / lambda
  }

  /**
   * Random with Poisson distribution
   */
  static randomPoisson(lambda: number): number {
    const L = Math.exp(-lambda)
    let k = 0
    let p = 1

    do {
      k++
      p *= Math.random()
    } while (p > L)

    return k - 1
  }

  /**
   * Generate random maze (using recursive backtracking)
   */
  static generateMaze(width: number, height: number): boolean[][] {
    const maze: boolean[][] = Array.from({ length: height }, () => Array(width).fill(false))

    const visited: boolean[][] = Array.from({ length: height }, () => Array(width).fill(false))

    const directions = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ]

    const visit = (x: number, y: number) => {
      visited[y][x] = true
      maze[y][x] = true

      const shuffledDirections = this.shuffle(directions)

      for (const [dx, dy] of shuffledDirections) {
        const nx = x + dx * 2
        const ny = y + dy * 2

        if (nx >= 0 && nx < width && ny >= 0 && ny < height && !visited[ny][nx]) {
          maze[y + dy][x + dx] = true
          visit(nx, ny)
        }
      }
    }

    visit(0, 0)

    return maze
  }
}

/**
 * Seeded random interface
 */
export interface SeededRandom {
  random: () => number
  randomInt: (min: number, max: number) => number
  randomFloat: (min: number, max: number) => number
  randomBool: (probability?: number) => boolean
  randomChoice: <T>(array: T[]) => T
  shuffle: <T>(array: T[]) => T[]
  reset: (seed: number) => SeededRandom
}
