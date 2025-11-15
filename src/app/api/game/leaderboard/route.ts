/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import type { NextRequest } from 'next/server'
import { z } from 'zod'
import { successResponse, badRequestResponse } from '@/middleware/response'
import { validateQuery } from '@/middleware/validation'

// Leaderboard query schema
const LeaderboardQuerySchema = z.object({
  page: z.string().optional().default('1').transform(Number),
  pageSize: z.string().optional().default('20').transform(Number),
  period: z.enum(['daily', 'weekly', 'monthly', 'all-time']).optional().default('all-time'),
})

// Leaderboard entry type
interface LeaderboardEntry {
  rank: number
  address: string
  score: number
  gamesPlayed: number
  wins: number
  lastPlayed: string
}

// In-memory leaderboard storage
// TODO: Replace with database in production
const leaderboardData: Map<string, LeaderboardEntry> = new Map()

// Generate mock data for demonstration
function generateMockLeaderboard(): LeaderboardEntry[] {
  const mockEntries: LeaderboardEntry[] = []

  for (let i = 0; i < 100; i++) {
    const address = `0x${Math.random().toString(16).substr(2, 40)}`
    mockEntries.push({
      rank: i + 1,
      address,
      score: Math.floor(Math.random() * 50000),
      gamesPlayed: Math.floor(Math.random() * 100) + 1,
      wins: Math.floor(Math.random() * 50),
      lastPlayed: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    })
  }

  return mockEntries.sort((a, b) => b.score - a.score)
}

// Initialize mock data
let mockLeaderboard = generateMockLeaderboard()

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const validation = validateQuery(LeaderboardQuerySchema, searchParams)

  if (!validation.success) {
    return badRequestResponse(validation.error)
  }

  const { page, pageSize, period } = validation.data

  // Validate pagination parameters
  if (page < 1 || pageSize < 1 || pageSize > 100) {
    return badRequestResponse('Invalid pagination parameters')
  }

  // TODO: Filter by period (daily, weekly, monthly, all-time)
  // For now, return all-time leaderboard

  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedData = mockLeaderboard.slice(startIndex, endIndex)

  return successResponse(
    {
      entries: paginatedData,
      pagination: {
        page,
        pageSize,
        total: mockLeaderboard.length,
        totalPages: Math.ceil(mockLeaderboard.length / pageSize),
        hasNextPage: endIndex < mockLeaderboard.length,
        hasPreviousPage: page > 1,
      },
      period,
    },
    'Leaderboard fetched successfully'
  )
}

// Update leaderboard (for internal use)
export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json()
    const { address, score, gamesPlayed, wins } = body as {
      address: string
      score: number
      gamesPlayed: number
      wins: number
    }

    if (!address || typeof score !== 'number') {
      return badRequestResponse('Invalid request data')
    }

    // Update or create entry
    const existingEntry = leaderboardData.get(address)

    if (existingEntry) {
      if (score > existingEntry.score) {
        existingEntry.score = score
      }
      existingEntry.gamesPlayed = (existingEntry.gamesPlayed || 0) + 1
      existingEntry.wins = (existingEntry.wins || 0) + (wins ? 1 : 0)
      existingEntry.lastPlayed = new Date().toISOString()
    } else {
      leaderboardData.set(address, {
        rank: 0, // Will be calculated
        address,
        score,
        gamesPlayed: gamesPlayed || 1,
        wins: wins || 0,
        lastPlayed: new Date().toISOString(),
      })
    }

    // Recalculate ranks
    mockLeaderboard = Array.from(leaderboardData.values())
      .sort((a, b) => b.score - a.score)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }))

    return successResponse({ message: 'Leaderboard updated' }, 'Score recorded successfully')
  } catch {
    return badRequestResponse('Failed to update leaderboard')
  }
}
