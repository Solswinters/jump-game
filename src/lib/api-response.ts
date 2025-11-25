/**
 * Standard API response utilities
 */

import { NextResponse } from 'next/server'

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
  meta?: {
    timestamp: number
    [key: string]: unknown
  }
}

/**
 * successResponse utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of successResponse.
 */
export function successResponse<T>(data: T, status: number = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      meta: {
        timestamp: Date.now(),
      },
    },
    { status }
  )
}

/**
 * errorResponse utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of errorResponse.
 */
export function errorResponse(
  message: string,
  code: string = 'ERROR',
  status: number = 500
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
      },
      meta: {
        timestamp: Date.now(),
      },
    },
    { status }
  )
}
