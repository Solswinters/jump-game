import { NextRequest, NextResponse } from 'next/server'
import { ValidationError } from '@/lib/errors'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { address, score, signature, gameData } = body

    // Validation
    if (!address || !score || !signature) {
      throw new ValidationError('Missing required fields')
    }

    if (typeof score !== 'number' || score < 0) {
      throw new ValidationError('Invalid score')
    }

    // TODO: Verify signature
    // const isValid = await verifySignature(address, score, signature)
    // if (!isValid) {
    //   throw new ValidationError('Invalid signature')
    // }

    // TODO: Save to database
    // await db.scores.create({
    //   address,
    //   score,
    //   gameData,
    //   timestamp: new Date(),
    // })

    logger.info('Score submitted', {
      address,
      score,
      gameData,
    })

    // Mock response
    const response = {
      success: true,
      rank: Math.floor(Math.random() * 100) + 1,
      isNewHighScore: Math.random() > 0.5,
    }

    return NextResponse.json(response)
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    logger.error('Failed to submit score', { error })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
