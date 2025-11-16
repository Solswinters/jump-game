/**
 * Game-related constants
 */

export const GAME_CONSTANTS = {
  // Canvas dimensions
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,

  // Player configuration
  PLAYER_WIDTH: 50,
  PLAYER_HEIGHT: 50,
  PLAYER_SPEED: 5,
  JUMP_FORCE: -15,
  GRAVITY: 0.8,

  // Obstacle configuration
  OBSTACLE_MIN_HEIGHT: 30,
  OBSTACLE_MAX_HEIGHT: 150,
  OBSTACLE_WIDTH: 30,
  OBSTACLE_SPAWN_DISTANCE: 300,
  OBSTACLE_SPEED: 5,

  // Game mechanics
  GROUND_Y: 500,
  BASE_SCORE_PER_SECOND: 10,
  SCORE_PER_OBSTACLE: 50,
  WINNER_BONUS: 1000,

  // Difficulty
  INITIAL_SPEED: 5,
  MAX_SPEED: 15,
  SPEED_INCREMENT: 0.5,
  DIFFICULTY_INTERVAL: 10000, // ms
  MAX_DIFFICULTY: 5,

  // Rewards
  BASE_REWARD: 10, // tokens
  SCORE_BONUS_DIVISOR: 100,
  WINNER_MULTIPLIER: 1.5,
  COOLDOWN_PERIOD: 3600, // seconds (1 hour)

  // Multiplayer
  MAX_PLAYERS_PER_ROOM: 4,
  ROOM_TIMEOUT: 300000, // ms (5 minutes)
  SYNC_INTERVAL: 100, // ms

  // Animation
  ANIMATION_FPS: 60,
  FRAME_TIME: 1000 / 60,

  // UI
  HUD_PADDING: 20,
  LEADERBOARD_WIDTH: 200,
  FONT_SIZE_LARGE: 32,
  FONT_SIZE_MEDIUM: 24,
  FONT_SIZE_SMALL: 16,
} as const

export const PLAYER_COLORS = {
  BLUE: '#3B82F6',
  RED: '#EF4444',
  GREEN: '#10B981',
  YELLOW: '#F59E0B',
  PURPLE: '#8B5CF6',
  PINK: '#EC4899',
  ORANGE: '#F97316',
  CYAN: '#06B6D4',
} as const

export type PlayerColor = (typeof PLAYER_COLORS)[keyof typeof PLAYER_COLORS]

export const GAME_STATES = {
  WAITING: 'waiting',
  PLAYING: 'playing',
  PAUSED: 'paused',
  ENDED: 'ended',
} as const

export const POWER_UP_TYPES = {
  SHIELD: 'shield',
  SPEED_BOOST: 'speed',
  DOUBLE_JUMP: 'double-jump',
  MAGNET: 'magnet',
} as const

export const ACHIEVEMENT_IDS = {
  FIRST_GAME: 'first-game',
  SCORE_1000: 'score-1000',
  SCORE_5000: 'score-5000',
  SCORE_10000: 'score-10000',
  WIN_10_GAMES: 'win-10-games',
  WIN_50_GAMES: 'win-50-games',
  PLAY_100_GAMES: 'play-100-games',
  PERFECT_RUN: 'perfect-run',
  SPEEDRUNNER: 'speedrunner',
  COLLECTOR: 'collector',
} as const

export const ACHIEVEMENT_NAMES: Record<string, string> = {
  [ACHIEVEMENT_IDS.FIRST_GAME]: 'First Steps',
  [ACHIEVEMENT_IDS.SCORE_1000]: 'Novice',
  [ACHIEVEMENT_IDS.SCORE_5000]: 'Skilled Player',
  [ACHIEVEMENT_IDS.SCORE_10000]: 'Master',
  [ACHIEVEMENT_IDS.WIN_10_GAMES]: 'Champion',
  [ACHIEVEMENT_IDS.WIN_50_GAMES]: 'Legend',
  [ACHIEVEMENT_IDS.PLAY_100_GAMES]: 'Dedicated',
  [ACHIEVEMENT_IDS.PERFECT_RUN]: 'Perfectionist',
  [ACHIEVEMENT_IDS.SPEEDRUNNER]: 'Speed Demon',
  [ACHIEVEMENT_IDS.COLLECTOR]: 'Token Collector',
}

export const KEYBINDINGS = {
  JUMP: [' ', 'w', 'ArrowUp'],
  PAUSE: ['p', 'Escape'],
  RESTART: ['r'],
  MUTE: ['m'],
} as const

export const STORAGE_KEYS = {
  HIGH_SCORES: 'high-scores',
  SETTINGS: 'game-settings',
  ACHIEVEMENTS: 'achievements',
  PLAYER_STATS: 'player-stats',
} as const
