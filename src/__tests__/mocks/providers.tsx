import React, { ReactNode } from 'react'
import { WagmiProvider, Config } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createConfig, http } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'

// Mock Wagmi Config
export const mockWagmiConfig = createConfig({
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
})

// Mock Query Client
export const mockQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
})

// Mock Web3 Provider
export const MockWeb3Provider = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiProvider config={mockWagmiConfig as Config}>
      <QueryClientProvider client={mockQueryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

// Mock Socket.io Context
interface MockSocketContextValue {
  socket: any
  isConnected: boolean
  roomId: string | null
}

export const MockSocketContext = React.createContext<MockSocketContextValue>({
  socket: null,
  isConnected: false,
  roomId: null,
})

export const MockSocketProvider = ({ 
  children, 
  value 
}: { 
  children: ReactNode
  value?: Partial<MockSocketContextValue>
}) => {
  const defaultValue: MockSocketContextValue = {
    socket: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      connect: jest.fn(),
      disconnect: jest.fn(),
    },
    isConnected: false,
    roomId: null,
    ...value,
  }

  return (
    <MockSocketContext.Provider value={defaultValue}>
      {children}
    </MockSocketContext.Provider>
  )
}

// Combined Mock Provider
export const MockProviders = ({ 
  children,
  socketValue,
}: { 
  children: ReactNode
  socketValue?: Partial<MockSocketContextValue>
}) => {
  return (
    <MockWeb3Provider>
      <MockSocketProvider value={socketValue}>
        {children}
      </MockSocketProvider>
    </MockWeb3Provider>
  )
}

