/**
 * Jest setup for integration tests
 */

// Increase timeout for integration tests
jest.setTimeout(30000)

// Mock environment variables for integration tests
process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID = 'test-project-id'
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000'
process.env.NEXT_PUBLIC_BASE_RPC_URL = 'http://localhost:8545'

// Global test utilities
global.waitFor = (condition, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()
    const checkCondition = () => {
      if (condition()) {
        resolve()
      } else if (Date.now() - startTime > timeout) {
        reject(new Error('Timeout waiting for condition'))
      } else {
        setTimeout(checkCondition, 100)
      }
    }
    checkCondition()
  })
}

// eslint-disable-next-line no-console
console.log('Integration test environment initialized')
