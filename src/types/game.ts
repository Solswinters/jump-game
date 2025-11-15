// Re-export game types from modules
export type { Player, Obstacle, GameState } from '@/modules/game/domain/engine'

export type GameMode = 'menu' | 'single' | 'multi'
export type GameStatus = 'waiting' | 'playing' | 'ended'

export interface GameOverData {
  score: number
  isWinner: boolean
  finalTime: number
  obstaclesCleared: number
}
