/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server'
import { ethers } from 'ethers'
import { ClaimRequestSchema } from '@/validators/api'
import { ERROR_CODES, createError } from '@/constants/errors'
import { HTTP_STATUS } from '@/constants/api'
import { VALIDATION_RULES } from '@/constants/validation'

// Store used nonces to prevent replay attacks
// TODO: Move to Redis or database in production
const usedNonces = new Set<number>()

// Helper to clean old nonces
function cleanOldNonces(): void {
  const oneHourAgo = Date.now() - 3600000
  usedNonces.forEach(n => {
    if (n < oneHourAgo) {
      usedNonces.delete(n)
    }
  })
}

// Helper to generate unique nonce
function generateNonce(): number {
  let nonce = Date.now()
  while (usedNonces.has(nonce)) {
    nonce += 1
  }
  usedNonces.add(nonce)
  cleanOldNonces()
  return nonce
}

// Main POST handler
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body: unknown = await request.json()
    const validation = ClaimRequestSchema.safeParse(body)

    if (!validation.success) {
      const errors = validation.error.errors
      const errorMessages =
        errors.length > 0 ? (errors[0]?.message ?? 'Invalid input') : 'Invalid input'
      return NextResponse.json(createError(ERROR_CODES.INVALID_INPUT, errorMessages), {
        status: HTTP_STATUS.BAD_REQUEST,
      })
    }

    const { address, score, isWinner } = validation.data

    // Anti-cheat validation
    if (score > VALIDATION_RULES.SCORE.MAX_REASONABLE) {
      console.warn(`Suspicious score detected: ${score} for address ${address}`)
      return NextResponse.json(
        createError(
          ERROR_CODES.INVALID_SCORE,
          'Score appears to be invalid (possible cheating detected)'
        ),
        { status: HTTP_STATUS.BAD_REQUEST }
      )
    }

    // Check for verifier private key
    const privateKey = process.env.VERIFIER_PRIVATE_KEY
    if (!privateKey || privateKey === '') {
      console.error('VERIFIER_PRIVATE_KEY not set')
      return NextResponse.json(
        createError(
          ERROR_CODES.SERVICE_UNAVAILABLE,
          'Backend signature verification is not configured'
        ),
        { status: HTTP_STATUS.SERVICE_UNAVAILABLE }
      )
    }

    // Generate unique nonce
    const nonce = generateNonce()

    // Create wallet instance for signing
    const wallet = new ethers.Wallet(privateKey)

    // Create message hash matching the smart contract
    const messageHash = ethers.solidityPackedKeccak256(
      ['address', 'uint256', 'bool', 'uint256'],
      [address, score, isWinner, nonce]
    )

    // Sign the message
    const signature = await wallet.signMessage(ethers.getBytes(messageHash))

    // Log the claim attempt (in production, store in database)
    console.info('Claim request processed:', {
      address,
      score,
      isWinner,
      nonce,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      {
        success: true,
        data: {
          nonce,
          signature,
        },
        message: 'Signature generated successfully',
        timestamp: new Date().toISOString(),
      },
      { status: HTTP_STATUS.OK }
    )
  } catch (error: unknown) {
    console.error('Claim API error:', error)

    // Handle specific error types
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        createError(ERROR_CODES.INVALID_INPUT, 'Invalid JSON in request body'),
        { status: HTTP_STATUS.BAD_REQUEST }
      )
    }

    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'

    return NextResponse.json(createError(ERROR_CODES.INTERNAL_SERVER_ERROR, errorMessage), {
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    })
  }
}

// OPTIONS handler for CORS preflight
export function OPTIONS() {
  return new NextResponse(null, {
    status: HTTP_STATUS.NO_CONTENT,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
