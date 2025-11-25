/**
 * CORS middleware configuration
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * CORS_HEADERS utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of CORS_HEADERS.
 */
export const CORS_HEADERS = {
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL ?? '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
}

/**
 * corsMiddleware utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of corsMiddleware.
 */
export function corsMiddleware(request: NextRequest): NextResponse | null {
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: CORS_HEADERS,
    })
  }

  return null
}

/**
 * addCorsHeaders utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of addCorsHeaders.
 */
export function addCorsHeaders(response: NextResponse): NextResponse {
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}

/**
 * createCorsResponse utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of createCorsResponse.
 */
export function createCorsResponse(data: unknown, status: number = 200): NextResponse {
  const response = NextResponse.json(data, { status })
  return addCorsHeaders(response)
}
