'use client'

import React, { useEffect } from 'react'
import { useMultiplayerStore } from '@/stores'
import { logger } from '@/shared/logger'

interface MultiplayerProviderProps {
  children: React.ReactNode
}

export const MultiplayerProvider: React.FC<MultiplayerProviderProps> = ({ children }) => {
  const reset = useMultiplayerStore(state => state.reset)

  useEffect(() => {
    logger.info('Multiplayer provider initialized')

    // Cleanup on unmount
    return () => {
      logger.info('Multiplayer provider cleanup')
      reset()
    }
  }, [reset])

  return <>{children}</>
}

export default MultiplayerProvider
