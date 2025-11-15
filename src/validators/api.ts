import { z } from 'zod'
import { EthereumAddressSchema } from './wallet'

// Claim request validation
export const ClaimRequestSchema = z.object({
  address: EthereumAddressSchema,
  score: z.number().int().min(0).max(1000000),
  isWinner: z.boolean(),
})

// Estimate request validation
export const EstimateRequestSchema = z.object({
  score: z.number().int().min(0).max(1000000),
  isWinner: z.boolean(),
})

// Pagination validation
export const PaginationSchema = z.object({
  page: z.number().int().min(0).default(0),
  pageSize: z.number().int().min(1).max(100).default(10),
})

// Sort order validation
export const SortOrderSchema = z.enum(['asc', 'desc']).default('desc')

// Leaderboard query validation
export const LeaderboardQuerySchema = z.object({
  page: z.number().int().min(0).default(0),
  pageSize: z.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['score', 'gamesPlayed', 'winRate', 'totalRewards']).default('score'),
  order: SortOrderSchema,
})

// Health check response validation
export const HealthCheckSchema = z.object({
  status: z.enum(['healthy', 'unhealthy', 'degraded']),
  uptime: z.number().min(0),
  timestamp: z.string(),
  services: z.object({
    database: z.enum(['up', 'down']).optional(),
    blockchain: z.enum(['up', 'down']).optional(),
    socket: z.enum(['up', 'down']).optional(),
  }),
})

