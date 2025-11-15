// Error code constants

export const ERROR_CODES = {
  // General errors (1000-1099)
  UNKNOWN_ERROR: 'ERR_1000',
  INVALID_INPUT: 'ERR_1001',
  MISSING_PARAMETER: 'ERR_1002',
  INVALID_PARAMETER: 'ERR_1003',
  OPERATION_FAILED: 'ERR_1004',

  // Authentication errors (1100-1199)
  UNAUTHORIZED: 'ERR_1100',
  INVALID_TOKEN: 'ERR_1101',
  TOKEN_EXPIRED: 'ERR_1102',
  INSUFFICIENT_PERMISSIONS: 'ERR_1103',

  // Wallet errors (1200-1299)
  WALLET_NOT_CONNECTED: 'ERR_1200',
  INVALID_ADDRESS: 'ERR_1201',
  WALLET_CONNECTION_FAILED: 'ERR_1202',
  SIGNATURE_VERIFICATION_FAILED: 'ERR_1203',

  // Contract errors (1300-1399)
  CONTRACT_CALL_FAILED: 'ERR_1300',
  CONTRACT_NOT_FOUND: 'ERR_1301',
  INSUFFICIENT_BALANCE: 'ERR_1302',
  TRANSACTION_FAILED: 'ERR_1303',
  TRANSACTION_REVERTED: 'ERR_1304',
  GAS_ESTIMATION_FAILED: 'ERR_1305',

  // Game errors (1400-1499)
  INVALID_SCORE: 'ERR_1400',
  GAME_NOT_FOUND: 'ERR_1401',
  GAME_ALREADY_STARTED: 'ERR_1402',
  GAME_ALREADY_ENDED: 'ERR_1403',
  INVALID_GAME_STATE: 'ERR_1404',

  // Reward errors (1500-1599)
  COOLDOWN_ACTIVE: 'ERR_1500',
  REWARD_CLAIM_FAILED: 'ERR_1501',
  INVALID_REWARD_AMOUNT: 'ERR_1502',
  REWARD_ALREADY_CLAIMED: 'ERR_1503',

  // Multiplayer errors (1600-1699)
  ROOM_NOT_FOUND: 'ERR_1600',
  ROOM_FULL: 'ERR_1601',
  PLAYER_NOT_FOUND: 'ERR_1602',
  CONNECTION_FAILED: 'ERR_1603',
  SYNC_FAILED: 'ERR_1604',

  // Rate limiting errors (1700-1799)
  RATE_LIMIT_EXCEEDED: 'ERR_1700',
  TOO_MANY_REQUESTS: 'ERR_1701',

  // Server errors (1800-1899)
  INTERNAL_SERVER_ERROR: 'ERR_1800',
  SERVICE_UNAVAILABLE: 'ERR_1801',
  DATABASE_ERROR: 'ERR_1802',
  EXTERNAL_API_ERROR: 'ERR_1803',
} as const

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES]

// Error messages
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ERROR_CODES.UNKNOWN_ERROR]: 'An unknown error occurred',
  [ERROR_CODES.INVALID_INPUT]: 'Invalid input provided',
  [ERROR_CODES.MISSING_PARAMETER]: 'Required parameter is missing',
  [ERROR_CODES.INVALID_PARAMETER]: 'Invalid parameter provided',
  [ERROR_CODES.OPERATION_FAILED]: 'Operation failed',

  [ERROR_CODES.UNAUTHORIZED]: 'Unauthorized access',
  [ERROR_CODES.INVALID_TOKEN]: 'Invalid authentication token',
  [ERROR_CODES.TOKEN_EXPIRED]: 'Authentication token has expired',
  [ERROR_CODES.INSUFFICIENT_PERMISSIONS]: 'Insufficient permissions',

  [ERROR_CODES.WALLET_NOT_CONNECTED]: 'Wallet is not connected',
  [ERROR_CODES.INVALID_ADDRESS]: 'Invalid wallet address',
  [ERROR_CODES.WALLET_CONNECTION_FAILED]: 'Failed to connect wallet',
  [ERROR_CODES.SIGNATURE_VERIFICATION_FAILED]: 'Signature verification failed',

  [ERROR_CODES.CONTRACT_CALL_FAILED]: 'Contract call failed',
  [ERROR_CODES.CONTRACT_NOT_FOUND]: 'Contract not found',
  [ERROR_CODES.INSUFFICIENT_BALANCE]: 'Insufficient balance',
  [ERROR_CODES.TRANSACTION_FAILED]: 'Transaction failed',
  [ERROR_CODES.TRANSACTION_REVERTED]: 'Transaction was reverted',
  [ERROR_CODES.GAS_ESTIMATION_FAILED]: 'Gas estimation failed',

  [ERROR_CODES.INVALID_SCORE]: 'Invalid game score',
  [ERROR_CODES.GAME_NOT_FOUND]: 'Game not found',
  [ERROR_CODES.GAME_ALREADY_STARTED]: 'Game has already started',
  [ERROR_CODES.GAME_ALREADY_ENDED]: 'Game has already ended',
  [ERROR_CODES.INVALID_GAME_STATE]: 'Invalid game state',

  [ERROR_CODES.COOLDOWN_ACTIVE]: 'Reward cooldown is still active',
  [ERROR_CODES.REWARD_CLAIM_FAILED]: 'Failed to claim reward',
  [ERROR_CODES.INVALID_REWARD_AMOUNT]: 'Invalid reward amount',
  [ERROR_CODES.REWARD_ALREADY_CLAIMED]: 'Reward has already been claimed',

  [ERROR_CODES.ROOM_NOT_FOUND]: 'Room not found',
  [ERROR_CODES.ROOM_FULL]: 'Room is full',
  [ERROR_CODES.PLAYER_NOT_FOUND]: 'Player not found',
  [ERROR_CODES.CONNECTION_FAILED]: 'Connection failed',
  [ERROR_CODES.SYNC_FAILED]: 'Synchronization failed',

  [ERROR_CODES.RATE_LIMIT_EXCEEDED]: 'Rate limit exceeded',
  [ERROR_CODES.TOO_MANY_REQUESTS]: 'Too many requests',

  [ERROR_CODES.INTERNAL_SERVER_ERROR]: 'Internal server error',
  [ERROR_CODES.SERVICE_UNAVAILABLE]: 'Service is currently unavailable',
  [ERROR_CODES.DATABASE_ERROR]: 'Database error occurred',
  [ERROR_CODES.EXTERNAL_API_ERROR]: 'External API error',
}

// Get error message by code
export function getErrorMessage(code: ErrorCode): string {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR]
}

// Create error object
export function createError(code: ErrorCode, details?: string) {
  return {
    code,
    message: getErrorMessage(code),
    details,
    timestamp: new Date().toISOString(),
  }
}

