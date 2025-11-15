/**
 * Score calculation utilities for game
 */

import { GAME_CONSTANTS } from '@/constants/game'

export interface ScoreComponents {
  timeScore: number
  obstacleScore: number
  difficultyBonus: number
  comboBonus: number
  totalScore: number
}

export function calculateTimeScore(gameTime: number): number {
  const seconds = Math.floor(gameTime / 1000)
  return seconds * GAME_CONSTANTS.SCORE_PER_SECOND
}

export function calculateObstacleScore(obstaclesCleared: number): number {
  return obstaclesCleared * GAME_CONSTANTS.SCORE_PER_OBSTACLE
}

export function calculateDifficultyBonus(difficulty: number, baseScore: number): number {
  const bonusMultiplier = 1 + (difficulty - 1) * 0.1
  return Math.floor(baseScore * bonusMultiplier) - baseScore
}

export function calculateComboBonus(comboCount: number, baseScore: number): number {
  if (comboCount < 5) {
    return 0
  }
  const comboMultiplier = Math.min(1 + (comboCount - 5) * 0.05, 2)
  return Math.floor(baseScore * comboMultiplier) - baseScore
}

export function calculateTotalScore(
  gameTime: number,
  obstaclesCleared: number,
  difficulty: number = 1,
  comboCount: number = 0
): ScoreComponents {
  const timeScore = calculateTimeScore(gameTime)
  const obstacleScore = calculateObstacleScore(obstaclesCleared)
  const baseScore = timeScore + obstacleScore

  const difficultyBonus = calculateDifficultyBonus(difficulty, baseScore)
  const comboBonus = calculateComboBonus(comboCount, baseScore)

  const totalScore = baseScore + difficultyBonus + comboBonus

  return {
    timeScore,
    obstacleScore,
    difficultyBonus,
    comboBonus,
    totalScore,
  }
}

export function getScoreRank(score: number): string {
  if (score >= 10000) {
    return 'S'
  }
  if (score >= 5000) {
    return 'A'
  }
  if (score >= 2500) {
    return 'B'
  }
  if (score >= 1000) {
    return 'C'
  }
  if (score >= 500) {
    return 'D'
  }
  return 'F'
}

export function isHighScore(score: number, previousHighScore: number): boolean {
  return score > previousHighScore
}

export function formatScore(score: number): string {
  return score.toLocaleString('en-US')
}
