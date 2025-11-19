'use client'

import React, { useEffect } from 'react'
import { useGameStore } from '@/stores'
import { logger } from '@/shared/logger'

interface GameProviderProps {
  children: React.ReactNode
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const resetGame = useGameStore(state => state.resetGame)

  useEffect(() => {
    logger.info('Game provider initialized')

    // Cleanup on unmount
    return () => {
      logger.info('Game provider cleanup')
      resetGame()
    }
  }, [resetGame])

  return <>{children}</>
}

export default GameProvider
