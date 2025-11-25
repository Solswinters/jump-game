/**
 * React hook for game engine integration
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import { GameEngine } from '../core/GameEngine'

/**
 * useGame utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of useGame.
 */
export function useGame() {
  const engineRef = useRef<GameEngine | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [score, setScore] = useState(0)
  const [gameState, setGameState] = useState('idle')

  useEffect(() => {
    engineRef.current = new GameEngine()
    engineRef.current.initialize()

    return () => {
      engineRef.current?.cleanup()
    }
  }, [])

  const startGame = () => {
    if (engineRef.current) {
      engineRef.current.start()
      setIsPlaying(true)
      setGameState('playing')
    }
  }

  const stopGame = () => {
    if (engineRef.current) {
      engineRef.current.stop()
      setIsPlaying(false)
      setGameState('idle')
    }
  }

  const getEngine = () => engineRef.current

  return {
    engine: engineRef.current,
    isPlaying,
    score,
    gameState,
    startGame,
    stopGame,
    getEngine,
  }
}
