import {
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  RateLimitError,
  errorHandler,
} from '@/lib/errors/error-handler'

describe('Error Classes', () => {
  describe('AppError', () => {
    it('should create app error with custom properties', () => {
      const error = new AppError('CUSTOM_ERROR', 'Custom message', 400, true)

      expect(error.code).toBe('CUSTOM_ERROR')
      expect(error.message).toBe('Custom message')
      expect(error.statusCode).toBe(400)
      expect(error.isOperational).toBe(true)
    })

    it('should have correct default values', () => {
      const error = new AppError('ERROR', 'Message')

      expect(error.statusCode).toBe(500)
      expect(error.isOperational).toBe(true)
    })
  })

  describe('ValidationError', () => {
    it('should create validation error', () => {
      const error = new ValidationError('Invalid input')

      expect(error.code).toBe('VALIDATION_ERROR')
      expect(error.statusCode).toBe(400)
    })
  })

  describe('NotFoundError', () => {
    it('should create not found error', () => {
      const error = new NotFoundError()

      expect(error.code).toBe('NOT_FOUND')
      expect(error.statusCode).toBe(404)
    })

    it('should use custom message', () => {
      const error = new NotFoundError('User not found')

      expect(error.message).toBe('User not found')
    })
  })

  describe('UnauthorizedError', () => {
    it('should create unauthorized error', () => {
      const error = new UnauthorizedError()

      expect(error.code).toBe('UNAUTHORIZED')
      expect(error.statusCode).toBe(401)
    })
  })

  describe('ForbiddenError', () => {
    it('should create forbidden error', () => {
      const error = new ForbiddenError()

      expect(error.code).toBe('FORBIDDEN')
      expect(error.statusCode).toBe(403)
    })
  })

  describe('ConflictError', () => {
    it('should create conflict error', () => {
      const error = new ConflictError()

      expect(error.code).toBe('CONFLICT')
      expect(error.statusCode).toBe(409)
    })
  })

  describe('RateLimitError', () => {
    it('should create rate limit error', () => {
      const error = new RateLimitError()

      expect(error.code).toBe('RATE_LIMIT_EXCEEDED')
      expect(error.statusCode).toBe(429)
    })
  })
})

describe('ErrorHandler', () => {
  describe('formatError', () => {
    it('should format AppError', () => {
      const error = new ValidationError('Invalid input')
      const formatted = errorHandler.formatError(error)

      expect(formatted.error.code).toBe('VALIDATION_ERROR')
      expect(formatted.error.message).toBe('Invalid input')
      expect(formatted.error.statusCode).toBe(400)
    })

    it('should format unknown error', () => {
      const error = new Error('Unknown error')
      const formatted = errorHandler.formatError(error)

      expect(formatted.error.code).toBe('INTERNAL_ERROR')
      expect(formatted.error.statusCode).toBe(500)
    })
  })

  describe('isOperationalError', () => {
    it('should identify operational errors', () => {
      const error = new ValidationError('Test')
      expect(errorHandler.isOperationalError(error)).toBe(true)
    })

    it('should identify non-operational errors', () => {
      const error = new Error('Unknown')
      expect(errorHandler.isOperationalError(error)).toBe(false)
    })
  })
})
