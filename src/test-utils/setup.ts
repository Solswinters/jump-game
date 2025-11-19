/**
 * Global test setup
 */

import { server } from './msw/server'

// Establish API mocking before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))

// Reset any request handlers added during tests
afterEach(() => server.resetHandlers())

// Clean up after all tests
afterAll(() => server.close())

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
}
