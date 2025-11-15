// API endpoint constants

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

// API endpoints
export const API_ENDPOINTS = {
  // Game endpoints
  GAME: {
    CLAIM: '/game/claim',
    ESTIMATE: '/game/estimate',
    VERIFY: '/game/verify',
    STATS: '/game/stats',
    LEADERBOARD: '/game/leaderboard',
  },

  // Health check
  HEALTH: '/health',

  // User endpoints (future)
  USER: {
    PROFILE: '/user/profile',
    STATS: '/user/stats',
    HISTORY: '/user/history',
  },
} as const

// Build full API URL
export function buildApiUrl(endpoint: string): string {
  return `${API_BASE_URL}${endpoint}`
}

// API method types
export const API_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const

export type ApiMethod = (typeof API_METHODS)[keyof typeof API_METHODS]

// API headers
export const API_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  X_API_KEY: 'X-API-Key',
  X_REQUEST_ID: 'X-Request-ID',
} as const

// Content types
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded',
} as const

// API status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const

export type HttpStatus = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS]

// API error codes
export const API_ERROR_CODES = {
  INVALID_REQUEST: 'INVALID_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  INVALID_SIGNATURE: 'INVALID_SIGNATURE',
  COOLDOWN_ACTIVE: 'COOLDOWN_ACTIVE',
  INVALID_SCORE: 'INVALID_SCORE',
  CONTRACT_ERROR: 'CONTRACT_ERROR',
} as const

export type ApiErrorCode = (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES]

// Request timeouts (in ms)
export const REQUEST_TIMEOUTS = {
  DEFAULT: 30000, // 30 seconds
  LONG: 60000, // 1 minute
  SHORT: 10000, // 10 seconds
} as const

