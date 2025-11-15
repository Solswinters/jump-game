/**
 * API response types
 */

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp?: string
}

export interface ApiError {
  code: string
  message: string
  details?: unknown
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy'
  timestamp: string
  uptime: number
  environment: string
}

export interface StatsResponse {
  totalPlayers: number
  totalGamesPlayed: number
  totalRewardsClaimed: number
  averageScore: number
  highestScore: number
}

export interface LeaderboardResponse {
  rankings: LeaderboardEntry[]
  userRank?: number
  totalPlayers: number
}

export interface LeaderboardEntry {
  rank: number
  address: string
  score: number
  gamesPlayed: number
  totalClaimed: number
}

export interface PlayerStatsResponse {
  address: string
  totalClaimed: number
  gamesPlayed: number
  highestScore: number
  lastPlayedAt?: string
  rank?: number
}

export interface ClaimResponse {
  success: boolean
  txHash?: string
  amount?: string
  message?: string
}
