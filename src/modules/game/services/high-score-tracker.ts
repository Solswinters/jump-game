/**
 * High score tracking service
 */

import { storage } from '@/utils/storage'
import { logger } from '@/utils/logger'

export interface ScoreEntry {
  score: number
  timestamp: number
  playerAddress: string
  difficulty: number
}

export interface HighScoreStats {
  allTimeHigh: ScoreEntry | null
  last10Games: ScoreEntry[]
  averageScore: number
  totalGames: number
}

const STORAGE_KEY = 'high-scores'
const MAX_STORED_SCORES = 100

class HighScoreTracker {
  private scores: ScoreEntry[] = []

  constructor() {
    this.loadScores()
  }

  private loadScores(): void {
    try {
      const stored = storage.get<ScoreEntry[]>(STORAGE_KEY, [])
      this.scores = stored || []
      logger.info(`Loaded ${this.scores.length} high scores from storage`)
    } catch (error) {
      logger.error('Failed to load high scores', error)
      this.scores = []
    }
  }

  private saveScores(): void {
    try {
      storage.set(STORAGE_KEY, this.scores)
      logger.debug('High scores saved to storage')
    } catch (error) {
      logger.error('Failed to save high scores', error)
    }
  }

  submitScore(score: number, playerAddress: string, difficulty: number): void {
    const newEntry: ScoreEntry = {
      score,
      timestamp: Date.now(),
      playerAddress,
      difficulty,
    }

    this.scores.push(newEntry)
    this.scores.sort((a, b) => b.score - a.score) // Sort descending by score

    // Keep only the top scores
    if (this.scores.length > MAX_STORED_SCORES) {
      this.scores = this.scores.slice(0, MAX_STORED_SCORES)
    }

    this.saveScores()
    logger.info(`New score submitted: ${score} by ${playerAddress}`)
  }

  getHighScore(): ScoreEntry | null {
    if (this.scores.length === 0) {
      return null
    }
    return this.scores[0] || null
  }

  getPersonalBest(playerAddress: string): ScoreEntry | null {
    const playerScores = this.scores.filter(s => s.playerAddress === playerAddress)
    if (playerScores.length === 0) {
      return null
    }
    return playerScores[0] || null
  }

  getLast10Games(playerAddress?: string): ScoreEntry[] {
    let filteredScores = this.scores
    if (playerAddress) {
      filteredScores = this.scores.filter(s => s.playerAddress === playerAddress)
    }
    return filteredScores.slice(0, 10)
  }

  getAverageScore(playerAddress?: string): number {
    let scoresToAverage = this.scores
    if (playerAddress) {
      scoresToAverage = this.scores.filter(s => s.playerAddress === playerAddress)
    }

    if (scoresToAverage.length === 0) {
      return 0
    }

    const sum = scoresToAverage.reduce((acc, entry) => acc + entry.score, 0)
    return Math.floor(sum / scoresToAverage.length)
  }

  getTotalGames(playerAddress?: string): number {
    if (playerAddress) {
      return this.scores.filter(s => s.playerAddress === playerAddress).length
    }
    return this.scores.length
  }

  getStats(playerAddress?: string): HighScoreStats {
    const filteredScores = playerAddress
      ? this.scores.filter(s => s.playerAddress === playerAddress)
      : this.scores

    return {
      allTimeHigh: filteredScores[0] || null,
      last10Games: this.getLast10Games(playerAddress),
      averageScore: this.getAverageScore(playerAddress),
      totalGames: this.getTotalGames(playerAddress),
    }
  }

  clearScores(): void {
    this.scores = []
    this.saveScores()
    logger.info('All high scores cleared')
  }

  clearPlayerScores(playerAddress: string): void {
    this.scores = this.scores.filter(s => s.playerAddress !== playerAddress)
    this.saveScores()
    logger.info(`Cleared scores for player ${playerAddress}`)
  }
}

export const highScoreTracker = new HighScoreTracker()
