/**
 * Jest configuration for integration tests
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require('./jest.config')

module.exports = {
  ...baseConfig,
  testMatch: ['**/__tests__/**/*.integration.test.{ts,tsx}'],
  testTimeout: 30000, // Longer timeout for integration tests
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js', '<rootDir>/jest.setup.integration.js'],
  collectCoverageFrom: [...baseConfig.collectCoverageFrom, '!**/__tests__/**', '!**/test-utils/**'],
}
