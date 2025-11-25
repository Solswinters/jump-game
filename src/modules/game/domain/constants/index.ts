/**
 * Game constants consolidated from various sources
 */

/**
 * GAME_CONSTANTS utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of GAME_CONSTANTS.
 */
export const GAME_CONSTANTS = {
  // Canvas dimensions
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 400,

  // Player properties
  PLAYER_WIDTH: 40,
  PLAYER_HEIGHT: 40,
  PLAYER_START_X: 100,
  JUMP_FORCE: -12,
  GRAVITY: 0.5,
  MAX_FALL_SPEED: 15,

  // Ground
  GROUND_Y: 350,

  // Obstacles
  OBSTACLE_WIDTH: 30,
  OBSTACLE_MIN_HEIGHT: 30,
  OBSTACLE_MAX_HEIGHT: 80,
  OBSTACLE_SPAWN_DISTANCE: 400,

  // Game speed
  INITIAL_GAME_SPEED: 5,
  MAX_GAME_SPEED: 12,
  SPEED_INCREASE_RATE: 0.5,

  // Difficulty
  DIFFICULTY_INCREASE_INTERVAL: 30000, // 30 seconds
  MAX_DIFFICULTY: 10,

  // Scoring
  BASE_POINTS_PER_SECOND: 10,
  OBSTACLE_POINTS: 100,
  DIFFICULTY_MULTIPLIER: 1.5,

  // Colors
  PLAYER_COLORS: ['#4CAF50', '#2196F3', '#FF9800', '#E91E63', '#9C27B0'],
} as const

/**
 * PLAYER_COLORS utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of PLAYER_COLORS.
 */
export const PLAYER_COLORS = GAME_CONSTANTS.PLAYER_COLORS
/**
 * GAME_CONFIG utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of GAME_CONFIG.
 */
export const GAME_CONFIG = GAME_CONSTANTS
