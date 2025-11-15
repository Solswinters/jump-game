/**
 * API configuration and endpoint definitions
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

export const API_ENDPOINTS = {
  health: '/api/health',
  stats: '/api/stats',
  leaderboard: '/api/leaderboard',
  player: '/api/player',
  claim: '/api/claim',
  signature: '/api/signature',
  session: '/api/session',
} as const

export function getApiUrl(endpoint: keyof typeof API_ENDPOINTS): string {
  return `${API_BASE_URL}${API_ENDPOINTS[endpoint]}`
}

export const API_CONFIG = {
  timeout: 30000, // 30 seconds
  retries: 3,
  retryDelay: 1000,
  headers: {
    'Content-Type': 'application/json',
  },
} as const

export const WS_CONFIG = {
  url: process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:3000',
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
} as const

export type ApiEndpoint = keyof typeof API_ENDPOINTS
