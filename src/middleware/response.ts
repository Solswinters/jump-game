/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { NextResponse } from 'next/server'
import { HTTP_STATUS } from '@/constants/api'
import { ERROR_CODES, createError } from '@/constants/errors'

// Standard API response types
export interface ApiSuccessResponse<T> {
  success: true
  data: T
  message?: string
  timestamp: string
  meta?: Record<string, unknown>
}

export interface ApiErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
  timestamp: string
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

// Success response helper
/**
 * successResponse utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of successResponse.
 */
export function successResponse<T>(
  data: T,
  message?: string,
  meta?: Record<string, unknown>,
  status: number = HTTP_STATUS.OK
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
      meta,
    },
    { status }
  )
}

// Error response helper
/**
 * errorResponse utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of errorResponse.
 */
export function errorResponse(
  code: string,
  message: string,
  status: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  details?: unknown
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: createError(code, message, details),
      timestamp: new Date().toISOString(),
    },
    { status }
  )
}

// Common error responses
/**
 * badRequestResponse utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of badRequestResponse.
 */
export function badRequestResponse(
  message = 'Bad request',
  details?: unknown
): NextResponse<ApiErrorResponse> {
  return errorResponse(ERROR_CODES.INVALID_INPUT, message, HTTP_STATUS.BAD_REQUEST, details)
}

/**
 * unauthorizedResponse utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of unauthorizedResponse.
 */
export function unauthorizedResponse(
  message = 'Unauthorized',
  details?: unknown
): NextResponse<ApiErrorResponse> {
  return errorResponse(ERROR_CODES.UNAUTHORIZED, message, HTTP_STATUS.UNAUTHORIZED, details)
}

/**
 * forbiddenResponse utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of forbiddenResponse.
 */
export function forbiddenResponse(
  message = 'Forbidden',
  details?: unknown
): NextResponse<ApiErrorResponse> {
  return errorResponse(ERROR_CODES.FORBIDDEN, message, HTTP_STATUS.FORBIDDEN, details)
}

/**
 * notFoundResponse utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of notFoundResponse.
 */
export function notFoundResponse(
  message = 'Resource not found',
  details?: unknown
): NextResponse<ApiErrorResponse> {
  return errorResponse(ERROR_CODES.NOT_FOUND, message, HTTP_STATUS.NOT_FOUND, details)
}

/**
 * conflictResponse utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of conflictResponse.
 */
export function conflictResponse(
  message = 'Conflict',
  details?: unknown
): NextResponse<ApiErrorResponse> {
  return errorResponse(ERROR_CODES.CONFLICT, message, HTTP_STATUS.CONFLICT, details)
}

/**
 * tooManyRequestsResponse utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of tooManyRequestsResponse.
 */
export function tooManyRequestsResponse(
  message = 'Too many requests',
  details?: unknown
): NextResponse<ApiErrorResponse> {
  return errorResponse(
    ERROR_CODES.RATE_LIMIT_EXCEEDED,
    message,
    HTTP_STATUS.TOO_MANY_REQUESTS,
    details
  )
}

/**
 * internalServerErrorResponse utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of internalServerErrorResponse.
 */
export function internalServerErrorResponse(
  message = 'Internal server error',
  details?: unknown
): NextResponse<ApiErrorResponse> {
  return errorResponse(
    ERROR_CODES.INTERNAL_SERVER_ERROR,
    message,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    details
  )
}

/**
 * serviceUnavailableResponse utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of serviceUnavailableResponse.
 */
export function serviceUnavailableResponse(
  message = 'Service unavailable',
  details?: unknown
): NextResponse<ApiErrorResponse> {
  return errorResponse(
    ERROR_CODES.SERVICE_UNAVAILABLE,
    message,
    HTTP_STATUS.SERVICE_UNAVAILABLE,
    details
  )
}

// Paginated response helper
export interface PaginatedData<T> {
  items: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

/**
 * paginatedResponse utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of paginatedResponse.
 */
export function paginatedResponse<T>(
  items: T[],
  page: number,
  pageSize: number,
  total: number,
  message?: string
): NextResponse<ApiSuccessResponse<PaginatedData<T>>> {
  const totalPages = Math.ceil(total / pageSize)

  return successResponse<PaginatedData<T>>(
    {
      items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    },
    message
  )
}
