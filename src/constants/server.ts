// Server-side constants

// Socket.io configuration
/**
 * SOCKET_CONFIG utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of SOCKET_CONFIG.
 */
export const SOCKET_CONFIG = {
  PING_TIMEOUT: 60000, // 60 seconds
  PING_INTERVAL: 25000, // 25 seconds
  MAX_BUFFER_SIZE: 1e6, // 1MB
  MAX_HTTP_BUFFER_SIZE: 1e8, // 100MB
  COMPRESSION_THRESHOLD: 1024, // 1KB
} as const

// Room configuration
/**
 * ROOM_CONFIG utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of ROOM_CONFIG.
 */
export const ROOM_CONFIG = {
  MAX_PLAYERS_DEFAULT: 4,
  MAX_PLAYERS_LIMIT: 8,
  MIN_PLAYERS: 2,
  ROOM_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  IDLE_KICK_TIMEOUT: 5 * 60 * 1000, // 5 minutes
} as const

// Game configuration
/**
 * GAME_CONFIG utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of GAME_CONFIG.
 */
export const GAME_CONFIG = {
  MIN_GAME_DURATION: 5000, // 5 seconds
  MAX_GAME_DURATION: 60 * 60 * 1000, // 1 hour
  TICK_RATE: 60, // 60 FPS
  UPDATE_INTERVAL: 1000 / 60, // ~16ms
  STATE_SYNC_INTERVAL: 100, // 100ms
} as const

// Anti-cheat configuration
/**
 * ANTI_CHEAT_CONFIG utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of ANTI_CHEAT_CONFIG.
 */
export const ANTI_CHEAT_CONFIG = {
  MAX_SCORE_PER_SECOND: 50,
  MAX_OBSTACLES_PER_SECOND: 5,
  MAX_SCORE: 50000,
  MIN_SCORE_OBSTACLE_RATIO: 0.5, // Minimum score per obstacle
  MAX_SCORE_OBSTACLE_RATIO: 2.0, // Maximum score per obstacle
} as const

// Database configuration
/**
 * DB_CONFIG utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of DB_CONFIG.
 */
export const DB_CONFIG = {
  CONNECTION_TIMEOUT: 10000, // 10 seconds
  QUERY_TIMEOUT: 30000, // 30 seconds
  POOL_SIZE_MIN: 2,
  POOL_SIZE_MAX: 10,
} as const

// Cache configuration
/**
 * CACHE_CONFIG utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of CACHE_CONFIG.
 */
export const CACHE_CONFIG = {
  DEFAULT_TTL: 300, // 5 minutes
  SHORT_TTL: 60, // 1 minute
  LONG_TTL: 3600, // 1 hour
  MAX_KEYS: 10000,
} as const

// Signature configuration
/**
 * SIGNATURE_CONFIG utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of SIGNATURE_CONFIG.
 */
export const SIGNATURE_CONFIG = {
  NONCE_EXPIRY: 60 * 60 * 1000, // 1 hour
  MAX_NONCE_CACHE: 10000,
  CLEANUP_INTERVAL: 60 * 1000, // 1 minute
} as const

// Blockchain configuration
/**
 * BLOCKCHAIN_CONFIG utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of BLOCKCHAIN_CONFIG.
 */
export const BLOCKCHAIN_CONFIG = {
  BLOCK_CONFIRMATIONS: 2,
  TRANSACTION_TIMEOUT: 5 * 60 * 1000, // 5 minutes
  GAS_LIMIT_MULTIPLIER: 1.2,
  MAX_PRIORITY_FEE: '2', // 2 Gwei
} as const

// API configuration
/**
 * API_CONFIG utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of API_CONFIG.
 */
export const API_CONFIG = {
  MAX_REQUEST_SIZE: '10mb',
  REQUEST_TIMEOUT: 30000, // 30 seconds
  BODY_PARSER_LIMIT: '10mb',
} as const

// Logging configuration
/**
 * LOG_CONFIG utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of LOG_CONFIG.
 */
export const LOG_CONFIG = {
  LEVEL: process.env.LOG_LEVEL ?? 'info',
  PRETTY_PRINT: process.env.NODE_ENV === 'development',
  MAX_FILE_SIZE: '20m',
  MAX_FILES: '14d',
} as const

// Environment variables
/**
 * ENV utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of ENV.
 */
export const ENV = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: parseInt(process.env.PORT ?? '3000', 10),
  HOST: process.env.HOST ?? 'localhost',
  DATABASE_URL: process.env.DATABASE_URL,
  REDIS_URL: process.env.REDIS_URL,
  VERIFIER_PRIVATE_KEY: process.env.VERIFIER_PRIVATE_KEY,
  RPC_URL: process.env.NEXT_PUBLIC_RPC_URL,
  APP_URL: process.env.NEXT_PUBLIC_APP_URL,
} as const

// Server status
/**
 * SERVER_STATUS utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of SERVER_STATUS.
 */
export const SERVER_STATUS = {
  STARTING: 'starting',
  READY: 'ready',
  ERROR: 'error',
  SHUTTING_DOWN: 'shutting_down',
} as const

// Error codes
/**
 * SERVER_ERROR_CODES utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of SERVER_ERROR_CODES.
 */
export const SERVER_ERROR_CODES = {
  ROOM_FULL: 'ROOM_FULL',
  ROOM_NOT_FOUND: 'ROOM_NOT_FOUND',
  PLAYER_NOT_FOUND: 'PLAYER_NOT_FOUND',
  GAME_ALREADY_STARTED: 'GAME_ALREADY_STARTED',
  NOT_ENOUGH_PLAYERS: 'NOT_ENOUGH_PLAYERS',
  INVALID_ROOM_CONFIG: 'INVALID_ROOM_CONFIG',
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_SIGNATURE: 'INVALID_SIGNATURE',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  DATABASE_ERROR: 'DATABASE_ERROR',
  BLOCKCHAIN_ERROR: 'BLOCKCHAIN_ERROR',
} as const
