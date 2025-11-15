import { vi } from 'vitest'

export const mockUseAccount = vi.fn(() => ({
  address: '0x1234567890123456789012345678901234567890',
  isConnected: true,
  isConnecting: false,
  isDisconnected: false,
}))

export const mockUseReadContract = vi.fn(() => ({
  data: undefined,
  isLoading: false,
  isError: false,
  refetch: vi.fn(),
}))

export const mockUseWriteContract = vi.fn(() => ({
  writeContract: vi.fn(),
  data: undefined,
  isPending: false,
  isError: false,
}))

export const mockUseWaitForTransactionReceipt = vi.fn(() => ({
  isLoading: false,
  isSuccess: false,
}))

