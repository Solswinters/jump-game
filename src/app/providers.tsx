'use client'

import React from 'react'
import { GameProvider } from '@/modules/game/providers/GameProvider'
import { WalletProvider } from '@/modules/wallet/providers/WalletProvider'
import { MultiplayerProvider } from '@/modules/multiplayer/providers/MultiplayerProvider'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <GameProvider>
      <WalletProvider>
        <MultiplayerProvider>{children}</MultiplayerProvider>
      </WalletProvider>
    </GameProvider>
  )
}

export default Providers
