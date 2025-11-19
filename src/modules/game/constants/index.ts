/**
 * Game module constants
 */

export const GAME_STATES = {
  IDLE: 'idle',
  PLAYING: 'playing',
  PAUSED: 'paused',
  ENDED: 'ended',
} as const

export const GAME_MODES = {
  MENU: 'menu',
  SINGLE: 'single',
  MULTI: 'multi',
} as const

export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  NORMAL: 'normal',
  HARD: 'hard',
  EXPERT: 'expert',
} as const

export const PHYSICS = {
  GRAVITY: 0.6,
  JUMP_POWER: 12,
  DOUBLE_JUMP_POWER: 10,
  TERMINAL_VELOCITY: 20,
} as const

export const PLAYER = {
  SIZE: 40,
  START_X: 100,
  START_Y: 0,
  COLOR: '#4F46E5',
} as const

export const OBSTACLE = {
  WIDTH: 30,
  MIN_HEIGHT: 40,
  MAX_HEIGHT: 80,
  SPEED: 5,
  SPAWN_INTERVAL: 1500,
  MIN_GAP: 200,
} as const

export const SCORING = {
  POINTS_PER_OBSTACLE: 10,
  COMBO_MULTIPLIER_INCREMENT: 0.1,
  MAX_COMBO_MULTIPLIER: 5,
  COMBO_TIMEOUT: 3000,
} as const

export const REWARDS = {
  BASE_REWARD: 10,
  SCORE_BONUS_DIVISOR: 100,
  MULTIPLAYER_WINNER_MULTIPLIER: 1.5,
  COOLDOWN_MS: 3600000, // 1 hour
} as const

export const CANVAS = {
  WIDTH: 800,
  HEIGHT: 400,
  GROUND_Y: 350,
} as const

export type GameState = (typeof GAME_STATES)[keyof typeof GAME_STATES]
export type GameMode = (typeof GAME_MODES)[keyof typeof GAME_MODES]
export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[keyof typeof DIFFICULTY_LEVELS]
