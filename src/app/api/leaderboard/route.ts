/**
 * Leaderboard API endpoint
 */

import { NextResponse } from 'next/server'

export async function GET() {
  // In a real app, fetch from database
  const leaderboard = [
    { rank: 1, address: '0x1234...5678', score: 15420, username: 'Player1' },
    { rank: 2, address: '0xabcd...efgh', score: 14230, username: 'Player2' },
    { rank: 3, address: '0x9876...5432', score: 13450, username: 'Player3' },
    { rank: 4, address: '0xfedc...ba98', score: 12890, username: 'Player4' },
    { rank: 5, address: '0x1111...2222', score: 11670, username: 'Player5' },
  ]

  return NextResponse.json(leaderboard)
}
