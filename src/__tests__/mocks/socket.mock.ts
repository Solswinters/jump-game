import { vi } from 'vitest'

export const mockSocket = {
  on: vi.fn(),
  off: vi.fn(),
  emit: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  connected: true,
  id: 'mock-socket-id',
}

export const mockIo = vi.fn(() => mockSocket)

