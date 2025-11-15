// Validation rule constants

export const VALIDATION_RULES = {
  // Score validation
  SCORE: {
    MIN: 0,
    MAX: 1000000,
    MAX_REASONABLE: 50000, // Max reasonable score for anti-cheat
  },

  // Address validation
  ADDRESS: {
    LENGTH: 42,
    PREFIX: '0x',
    PATTERN: /^0x[a-fA-F0-9]{40}$/,
  },

  // Transaction hash validation
  TX_HASH: {
    LENGTH: 66,
    PREFIX: '0x',
    PATTERN: /^0x[a-fA-F0-9]{64}$/,
  },

  // Signature validation
  SIGNATURE: {
    LENGTH: 132,
    PREFIX: '0x',
    PATTERN: /^0x[a-fA-F0-9]{130}$/,
  },

  // Username validation
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[a-zA-Z0-9_-]+$/,
  },

  // Password validation (if needed)
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: false,
  },

  // Pagination validation
  PAGINATION: {
    PAGE_MIN: 0,
    PAGE_SIZE_MIN: 1,
    PAGE_SIZE_MAX: 100,
    PAGE_SIZE_DEFAULT: 10,
  },

  // Game validation
  GAME: {
    MIN_PLAY_TIME: 1000, // 1 second
    MAX_PLAY_TIME: 3600000, // 1 hour
    MIN_OBSTACLES: 0,
    MAX_OBSTACLES: 10000,
  },

  // Room validation
  ROOM: {
    MIN_PLAYERS: 1,
    MAX_PLAYERS: 4,
    ROOM_ID_LENGTH: 16,
  },
} as const

// Error messages for validation
export const VALIDATION_MESSAGES = {
  SCORE: {
    REQUIRED: 'Score is required',
    INVALID: 'Score must be a valid number',
    TOO_LOW: 'Score cannot be negative',
    TOO_HIGH: 'Score exceeds maximum limit',
    SUSPICIOUS: 'Score appears to be invalid (possible cheating)',
  },
  ADDRESS: {
    REQUIRED: 'Wallet address is required',
    INVALID: 'Invalid Ethereum address format',
    INVALID_CHECKSUM: 'Address checksum validation failed',
  },
  TX_HASH: {
    REQUIRED: 'Transaction hash is required',
    INVALID: 'Invalid transaction hash format',
  },
  SIGNATURE: {
    REQUIRED: 'Signature is required',
    INVALID: 'Invalid signature format',
    VERIFICATION_FAILED: 'Signature verification failed',
  },
  USERNAME: {
    REQUIRED: 'Username is required',
    TOO_SHORT: `Username must be at least ${VALIDATION_RULES.USERNAME.MIN_LENGTH} characters`,
    TOO_LONG: `Username must be at most ${VALIDATION_RULES.USERNAME.MAX_LENGTH} characters`,
    INVALID_FORMAT: 'Username can only contain letters, numbers, dashes, and underscores',
  },
  PASSWORD: {
    REQUIRED: 'Password is required',
    TOO_SHORT: `Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters`,
    TOO_LONG: `Password must be at most ${VALIDATION_RULES.PASSWORD.MAX_LENGTH} characters`,
    MISSING_UPPERCASE: 'Password must contain at least one uppercase letter',
    MISSING_LOWERCASE: 'Password must contain at least one lowercase letter',
    MISSING_NUMBER: 'Password must contain at least one number',
    MISSING_SPECIAL: 'Password must contain at least one special character',
  },
  PAGINATION: {
    INVALID_PAGE: 'Invalid page number',
    INVALID_PAGE_SIZE: 'Invalid page size',
  },
  GAME: {
    INVALID_PLAY_TIME: 'Invalid play time',
    INVALID_OBSTACLES: 'Invalid obstacle count',
  },
  ROOM: {
    INVALID_PLAYER_COUNT: 'Invalid player count',
    ROOM_FULL: 'Room has reached maximum capacity',
  },
} as const

// Validation helper functions
export function isValidEthereumAddress(address: string): boolean {
  return VALIDATION_RULES.ADDRESS.PATTERN.test(address)
}

export function isValidTransactionHash(hash: string): boolean {
  return VALIDATION_RULES.TX_HASH.PATTERN.test(hash)
}

export function isValidSignature(signature: string): boolean {
  return VALIDATION_RULES.SIGNATURE.PATTERN.test(signature)
}

export function isValidScore(score: number): boolean {
  return (
    typeof score === 'number' &&
    score >= VALIDATION_RULES.SCORE.MIN &&
    score <= VALIDATION_RULES.SCORE.MAX
  )
}

export function isReasonableScore(score: number): boolean {
  return (
    isValidScore(score) &&
    score <= VALIDATION_RULES.SCORE.MAX_REASONABLE
  )
}

export function isValidUsername(username: string): boolean {
  return (
    username.length >= VALIDATION_RULES.USERNAME.MIN_LENGTH &&
    username.length <= VALIDATION_RULES.USERNAME.MAX_LENGTH &&
    VALIDATION_RULES.USERNAME.PATTERN.test(username)
  )
}

