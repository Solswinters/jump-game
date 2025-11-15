// Game constants - extracted from magic numbers

export const GAME_CONSTANTS = {
  // Canvas dimensions
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 400,

  // Player dimensions
  PLAYER_WIDTH: 40,
  PLAYER_HEIGHT: 60,
  PLAYER_START_X: 100,

  // Physics
  GRAVITY: 0.8,
  JUMP_FORCE: -15,
  GROUND_Y: 320,

  // Game speed
  INITIAL_GAME_SPEED: 5,
  MAX_GAME_SPEED: 15,
  SPEED_INCREMENT: 0.5,

  // Obstacles
  OBSTACLE_WIDTH: 30,
  OBSTACLE_MIN_HEIGHT: 40,
  OBSTACLE_MAX_HEIGHT: 80,
  OBSTACLE_SPAWN_DISTANCE: 400,

  // Difficulty
  DIFFICULTY_INCREASE_INTERVAL: 10000, // 10 seconds in ms
  DIFFICULTY_MULTIPLIER: 0.3,
  MAX_DIFFICULTY: 5,

  // Scoring
  SCORE_PER_SECOND: 10,
  SCORE_PER_OBSTACLE: 5,
  TIME_TO_SCORE_DIVISOR: 100,

  // Rewards
  BASE_REWARD: 10,
  SCORE_BONUS_DIVISOR: 100,
  WINNER_MULTIPLIER: 1.5,
  COOLDOWN_PERIOD: 3600, // 1 hour in seconds

  // Multiplayer
  MAX_PLAYERS_PER_ROOM: 4,
  ROOM_TIMEOUT: 300000, // 5 minutes in ms
  SYNC_INTERVAL: 16, // ~60fps in ms
} as const

export const PLAYER_COLORS = [
  '#3B82F6', // blue
  '#EF4444', // red
  '#10B981', // green
  '#F59E0B', // yellow
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#14B8A6', // teal
  '#F97316', // orange
] as const

export const GAME_STATES = {
  MENU: 'menu',
  WAITING: 'waiting',
  PLAYING: 'playing',
  PAUSED: 'paused',
  ENDED: 'ended',
} as const

export const GAME_MODES = {
  SINGLE: 'single',
  MULTI: 'multi',
} as const

export type GameState = (typeof GAME_STATES)[keyof typeof GAME_STATES]
export type GameMode = (typeof GAME_MODES)[keyof typeof GAME_MODES]
export type PlayerColor = (typeof PLAYER_COLORS)[number]

