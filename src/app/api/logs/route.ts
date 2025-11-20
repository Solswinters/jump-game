import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { level, message, data, context } = body

    // Log the client-side error
    switch (level) {
      case 0:
        logger.debug(message, data, context)
        break
      case 1:
        logger.info(message, data, context)
        break
      case 2:
        logger.warn(message, data, context)
        break
      case 3:
      case 4:
        logger.error(message, data, context)
        break
      default:
        logger.info(message, data, context)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Failed to log client message', { error })
    return NextResponse.json({ error: 'Failed to log message' }, { status: 500 })
  }
}
