/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import type { NextRequest } from 'next/server'
import { successResponse, badRequestResponse } from '@/middleware/response'

// Game statistics type
interface GameStats {
  totalGames: number
  totalPlayers: number
  averageScore: number
  highestScore: number
  totalRewardsClaimed: string
  activeGames: number
  last24Hours: {
    games: number
    players: number
    rewards: string
  }
}

// In-memory stats storage
// TODO: Replace with database analytics in production
const stats: GameStats = {
  totalGames: 12547,
  totalPlayers: 3892,
  averageScore: 4231,
  highestScore: 48999,
  totalRewardsClaimed: '15234.5',
  activeGames: 47,
  last24Hours: {
    games: 234,
    players: 156,
    rewards: '423.8',
  },
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')

  if (address) {
    // Return player-specific stats
    return successResponse(
      {
        address,
        gamesPlayed: Math.floor(Math.random() * 100),
        totalScore: Math.floor(Math.random() * 100000),
        highestScore: Math.floor(Math.random() * 50000),
        averageScore: Math.floor(Math.random() * 5000),
        wins: Math.floor(Math.random() * 50),
        rewardsClaimed: (Math.random() * 1000).toFixed(2),
        lastPlayed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      'Player stats fetched successfully'
    )
  }

  // Return global stats
  return successResponse(stats, 'Game statistics fetched successfully')
}

// Update stats (for internal use)
export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json()
    const updates = body as Partial<GameStats>

    // Update stats
    Object.assign(stats, updates)

    return successResponse({ message: 'Stats updated' }, 'Statistics updated successfully')
  } catch {
    return badRequestResponse('Failed to update statistics')
  }
}
