/**
 * Application constants
 */

/**
 * Game constants
 */
export const GAME_CONSTANTS = {
  // Canvas
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
  TARGET_FPS: 60,
  DELTA_TIME: 1000 / 60,

  // Player
  PLAYER_WIDTH: 40,
  PLAYER_HEIGHT: 40,
  PLAYER_SPEED: 5,
  JUMP_FORCE: -15,
  GRAVITY: 0.8,

  // Obstacles
  OBSTACLE_MIN_WIDTH: 20,
  OBSTACLE_MAX_WIDTH: 60,
  OBSTACLE_MIN_HEIGHT: 20,
  OBSTACLE_MAX_HEIGHT: 100,
  OBSTACLE_SPEED: 5,
  OBSTACLE_SPAWN_INTERVAL: 1500,

  // Power-ups
  POWERUP_WIDTH: 30,
  POWERUP_HEIGHT: 30,
  POWERUP_DURATION: 5000,
  POWERUP_SPAWN_CHANCE: 0.1,

  // Scoring
  SCORE_PER_OBSTACLE: 10,
  COMBO_MULTIPLIER: 1.5,
  MAX_COMBO: 10,
  DISTANCE_SCORE_MULTIPLIER: 1,

  // Difficulty
  INITIAL_DIFFICULTY: 1,
  MAX_DIFFICULTY: 10,
  DIFFICULTY_INCREASE_INTERVAL: 30000,
  DIFFICULTY_SPEED_MULTIPLIER: 1.1,

  // Lives
  MAX_LIVES: 3,
  STARTING_LIVES: 3,

  // Rewards
  MIN_SCORE_FOR_REWARD: 1000,
  REWARD_MULTIPLIER: 0.001,
} as const

/**
 * Blockchain constants
 */
export const BLOCKCHAIN_CONSTANTS = {
  // Gas
  DEFAULT_GAS_LIMIT: '200000',
  MAX_GAS_PRICE: '100',

  // Confirmations
  REQUIRED_CONFIRMATIONS: 2,
  BLOCK_TIME: 2000, // 2 seconds for Base

  // Tokens
  TOKEN_DECIMALS: 18,
  MIN_TOKEN_BALANCE: '0',

  // Transactions
  TX_TIMEOUT: 60000, // 1 minute
  MAX_RETRIES: 3,
} as const

/**
 * Multiplayer constants
 */
export const MULTIPLAYER_CONSTANTS = {
  // Connection
  WS_RECONNECT_INTERVAL: 5000,
  WS_MAX_RECONNECT_ATTEMPTS: 5,
  WS_HEARTBEAT_INTERVAL: 30000,

  // Room
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 4,
  ROOM_NAME_MAX_LENGTH: 50,
  ROOM_CODE_LENGTH: 6,

  // Game
  COUNTDOWN_DURATION: 3,
  LOBBY_TIMEOUT: 300000, // 5 minutes
  GAME_TIMEOUT: 600000, // 10 minutes

  // Chat
  MAX_MESSAGE_LENGTH: 200,
  CHAT_HISTORY_LIMIT: 100,
  CHAT_RATE_LIMIT: 10, // messages per minute
} as const

/**
 * UI constants
 */
export const UI_CONSTANTS = {
  // Toast
  TOAST_DURATION: 3000,
  TOAST_MAX_VISIBLE: 3,

  // Modal
  MODAL_ANIMATION_DURATION: 200,
  MODAL_Z_INDEX: 1000,

  // Loader
  LOADER_DELAY: 200,
  LOADER_MIN_DURATION: 500,

  // Animation
  TRANSITION_DURATION: 300,
  HOVER_SCALE: 1.05,

  // Breakpoints
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
  DESKTOP_BREAKPOINT: 1280,
} as const

/**
 * API constants
 */
export const API_CONSTANTS = {
  // Timeouts
  REQUEST_TIMEOUT: 30000,
  UPLOAD_TIMEOUT: 60000,

  // Retry
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  BACKOFF_MULTIPLIER: 2,

  // Rate limiting
  RATE_LIMIT_REQUESTS: 100,
  RATE_LIMIT_WINDOW: 60000, // 1 minute

  // Cache
  CACHE_DURATION: 300000, // 5 minutes
  MAX_CACHE_SIZE: 100,
} as const

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
  // User
  USER_ID: 'user-id',
  USERNAME: 'username',
  HIGH_SCORE: 'high-score',
  TOTAL_SCORE: 'total-score',

  // Settings
  SOUND_ENABLED: 'sound-enabled',
  MUSIC_ENABLED: 'music-enabled',
  THEME: 'theme',

  // Game
  GAME_STATE: 'game-state',
  LAST_PLAYED: 'last-played',
  ACHIEVEMENTS: 'achievements',

  // Web3
  WALLET_ADDRESS: 'wallet-address',
  LAST_REWARD_CLAIM: 'last-reward-claim',
} as const

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  // Network
  NETWORK_ERROR: 'Network error. Please check your connection.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  SERVER_ERROR: 'Server error. Please try again later.',

  // Wallet
  WALLET_NOT_CONNECTED: 'Please connect your wallet.',
  WALLET_CONNECTION_FAILED: 'Failed to connect wallet.',
  INSUFFICIENT_BALANCE: 'Insufficient balance.',
  TRANSACTION_FAILED: 'Transaction failed.',
  TRANSACTION_REJECTED: 'Transaction rejected by user.',

  // Game
  GAME_START_FAILED: 'Failed to start game.',
  SCORE_SUBMIT_FAILED: 'Failed to submit score.',
  LEADERBOARD_LOAD_FAILED: 'Failed to load leaderboard.',

  // Multiplayer
  CONNECTION_FAILED: 'Failed to connect to server.',
  ROOM_JOIN_FAILED: 'Failed to join room.',
  ROOM_CREATE_FAILED: 'Failed to create room.',
  ROOM_FULL: 'Room is full.',
  ROOM_NOT_FOUND: 'Room not found.',
} as const

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  // Wallet
  WALLET_CONNECTED: 'Wallet connected successfully.',
  TRANSACTION_SUCCESS: 'Transaction completed successfully.',
  REWARD_CLAIMED: 'Reward claimed successfully.',

  // Game
  SCORE_SUBMITTED: 'Score submitted successfully.',
  ACHIEVEMENT_UNLOCKED: 'Achievement unlocked!',

  // Multiplayer
  ROOM_CREATED: 'Room created successfully.',
  ROOM_JOINED: 'Joined room successfully.',
} as const
