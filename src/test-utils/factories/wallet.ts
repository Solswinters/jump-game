/**
 * Test data factories for wallet objects
 */

export const createMockWalletAddress = (suffix: string = '1234') => `0x${suffix.padStart(40, '0')}`

export const createMockTransaction = (overrides?: any) => ({
  hash: createMockWalletAddress('tx'),
  from: createMockWalletAddress('from'),
  to: createMockWalletAddress('to'),
  value: '1000000000000000000',
  timestamp: Date.now(),
  status: 'pending',
  ...overrides,
})

export const createMockTokenBalance = (symbol: string = 'ETH', amount: string = '1.5') => ({
  symbol,
  amount,
  decimals: 18,
  address: createMockWalletAddress(symbol),
  usdValue: '2500.00',
})

export const createMockWalletState = () => ({
  address: createMockWalletAddress(),
  isConnected: true,
  chainId: 8453,
  balance: '1500000000000000000',
  transactions: [],
})
