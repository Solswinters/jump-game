/**
 * Stats API endpoint
 */

import { NextResponse } from 'next/server'

export async function GET() {
  // In a real app, fetch from database
  const stats = {
    totalPlayers: 1250,
    activeGames: 47,
    totalRewards: '15,000',
    averageScore: 4523,
  }

  return NextResponse.json(stats)
}
