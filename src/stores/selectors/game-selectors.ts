import { useGameStore } from '../game-store'

// Selector hooks for better performance and cleaner code
export const useGameMode = () => useGameStore(state => state.mode)
export const useGameState = () => useGameStore(state => state.state)
export const useGameSettings = () => useGameStore(state => state.settings)
export const useGameStats = () => useGameStore(state => state.stats)
export const useScore = () => useGameStore(state => state.stats.score)
export const useHighScore = () => useGameStore(state => state.stats.highScore)
export const useIsMultiplayer = () => useGameStore(state => state.isMultiplayer)
export const useFinalScore = () => useGameStore(state => state.finalScore)
export const useIsWinner = () => useGameStore(state => state.isWinner)

// Computed selectors
export const useIsPlaying = () => useGameStore(state => state.state === 'playing')
export const useIsPaused = () => useGameStore(state => state.state === 'paused')
export const useIsEnded = () => useGameStore(state => state.state === 'ended')
export const useIsMenu = () => useGameStore(state => state.mode === 'menu')

// Combined selectors for complex UI state
export const useGameStatus = () =>
  useGameStore(state => ({
    mode: state.mode,
    state: state.state,
    isMultiplayer: state.isMultiplayer,
    score: state.stats.score,
    highScore: state.stats.highScore,
  }))

export const useGameSoundSettings = () =>
  useGameStore(state => ({
    soundEnabled: state.settings.soundEnabled,
    musicEnabled: state.settings.musicEnabled,
    sfxVolume: state.settings.sfxVolume,
    musicVolume: state.settings.musicVolume,
  }))

export const useGameVisualSettings = () =>
  useGameStore(state => ({
    particlesEnabled: state.settings.particlesEnabled,
    screenShakeEnabled: state.settings.screenShakeEnabled,
    reducedMotion: state.settings.reducedMotion,
    showFPS: state.settings.showFPS,
  }))
