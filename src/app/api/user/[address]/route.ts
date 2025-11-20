import { NextRequest, NextResponse } from 'next/server'
import { NotFoundError } from '@/lib/errors'

interface RouteContext {
  params: Promise<{
    address: string
  }>
}

export async function GET(request: NextRequest, context: RouteContext) {
  const params = await context.params
  const { address } = params

  try {
    // Mock user data - replace with actual database query
    const userData = {
      address,
      highScore: 5000,
      totalGames: 150,
      averageScore: 1200,
      rank: 42,
      achievements: [
        {
          id: 'first_win',
          name: 'First Victory',
          unlockedAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'high_scorer',
          name: 'High Scorer',
          unlockedAt: '2024-01-15T00:00:00.000Z',
        },
      ],
    }

    if (!userData) {
      throw new NotFoundError('User not found')
    }

    return NextResponse.json(userData)
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
