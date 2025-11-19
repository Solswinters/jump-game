import { useCallback } from 'react'
import { useGameStore } from '../game-store'
import type { GameMode, Difficulty } from '../game-store'

export function useGameActions() {
  const store = useGameStore()

  const startGame = useCallback(
    (mode: GameMode) => {
      store.setMode(mode)
      store.setState('playing')
      store.resetStats()
    },
    [store]
  )

  const pauseGame = useCallback(() => {
    if (store.state === 'playing') {
      store.setState('paused')
    }
  }, [store])

  const resumeGame = useCallback(() => {
    if (store.state === 'paused') {
      store.setState('playing')
    }
  }, [store])

  const endGame = useCallback(
    (score: number, winner: boolean) => {
      store.setFinalScore(score, winner)
    },
    [store]
  )

  const restartGame = useCallback(() => {
    store.resetGame()
  }, [store])

  const updateDifficulty = useCallback(
    (difficulty: Difficulty) => {
      store.updateSettings({ difficulty })
    },
    [store]
  )

  const toggleSound = useCallback(() => {
    store.updateSettings({ soundEnabled: !store.settings.soundEnabled })
  }, [store])

  const toggleMusic = useCallback(() => {
    store.updateSettings({ musicEnabled: !store.settings.musicEnabled })
  }, [store])

  const setSfxVolume = useCallback(
    (volume: number) => {
      store.updateSettings({ sfxVolume: Math.max(0, Math.min(1, volume)) })
    },
    [store]
  )

  const setMusicVolume = useCallback(
    (volume: number) => {
      store.updateSettings({ musicVolume: Math.max(0, Math.min(1, volume)) })
    },
    [store]
  )

  const toggleParticles = useCallback(() => {
    store.updateSettings({ particlesEnabled: !store.settings.particlesEnabled })
  }, [store])

  const toggleScreenShake = useCallback(() => {
    store.updateSettings({ screenShakeEnabled: !store.settings.screenShakeEnabled })
  }, [store])

  const toggleFPS = useCallback(() => {
    store.updateSettings({ showFPS: !store.settings.showFPS })
  }, [store])

  const addPoints = useCallback(
    (points: number) => {
      store.incrementScore(points)
    },
    [store]
  )

  const incrementCombo = useCallback(() => {
    store.incrementCombo()
  }, [store])

  const resetCombo = useCallback(() => {
    store.resetCombo()
  }, [store])

  return {
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    restartGame,
    updateDifficulty,
    toggleSound,
    toggleMusic,
    setSfxVolume,
    setMusicVolume,
    toggleParticles,
    toggleScreenShake,
    toggleFPS,
    addPoints,
    incrementCombo,
    resetCombo,
  }
}
