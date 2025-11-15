/**
 * Game-related type definitions
 */

export type GameMode = 'single' | 'multi'
export type GameState = 'waiting' | 'playing' | 'paused' | 'ended'
export type PlayerColor = string

export interface GameSettings {
  soundEnabled: boolean
  musicVolume: number
  sfxVolume: number
  showFPS: boolean
  difficulty: 'easy' | 'normal' | 'hard'
}

export interface GameSession {
  id: string
  mode: GameMode
  startTime: number
  endTime?: number
  score: number
  duration: number
  obstaclesCleared: number
}

export interface PowerUp {
  id: string
  type: 'shield' | 'speed' | 'double-jump' | 'magnet'
  x: number
  y: number
  active: boolean
  duration: number
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt?: number
  progress: number
  maxProgress: number
}

export interface GameStats {
  totalScore: number
  highScore: number
  gamesPlayed: number
  totalPlayTime: number
  obstaclesCleared: number
  achievements: Achievement[]
}

export interface Particle {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}
