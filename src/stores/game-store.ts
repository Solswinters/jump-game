import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export type GameMode = 'menu' | 'single' | 'multi' | 'time-trial' | 'endless' | 'story'
export type GameState = 'idle' | 'playing' | 'paused' | 'ended'
export type Difficulty = 'easy' | 'normal' | 'hard' | 'extreme'

interface GameSettings {
  difficulty: Difficulty
  soundEnabled: boolean
  musicEnabled: boolean
  sfxVolume: number
  musicVolume: number
  particlesEnabled: boolean
  screenShakeEnabled: boolean
  showFPS: boolean
  reducedMotion: boolean
}

interface GameStats {
  score: number
  highScore: number
  distance: number
  obstacles: number
  powerUpsCollected: number
  comboMultiplier: number
  timeElapsed: number
}

interface GameStoreState {
  // Game Mode & State
  mode: GameMode
  state: GameState
  settings: GameSettings
  stats: GameStats

  // Game Status
  isMultiplayer: boolean
  isWinner: boolean
  finalScore: number

  // Actions
  setMode: (mode: GameMode) => void
  setState: (state: GameState) => void
  setMultiplayer: (isMultiplayer: boolean) => void
  updateSettings: (settings: Partial<GameSettings>) => void
  updateStats: (stats: Partial<GameStats>) => void
  setFinalScore: (score: number, winner: boolean) => void
  resetGame: () => void
  resetStats: () => void
  incrementScore: (points: number) => void
  incrementCombo: () => void
  resetCombo: () => void
}

const defaultSettings: GameSettings = {
  difficulty: 'normal',
  soundEnabled: true,
  musicEnabled: true,
  sfxVolume: 0.7,
  musicVolume: 0.5,
  particlesEnabled: true,
  screenShakeEnabled: true,
  showFPS: false,
  reducedMotion: false,
}

const defaultStats: GameStats = {
  score: 0,
  highScore: 0,
  distance: 0,
  obstacles: 0,
  powerUpsCollected: 0,
  comboMultiplier: 1,
  timeElapsed: 0,
}

export const useGameStore = create<GameStoreState>()(
  devtools(
    persist(
      immer(set => ({
        mode: 'menu',
        state: 'idle',
        settings: defaultSettings,
        stats: defaultStats,
        isMultiplayer: false,
        isWinner: false,
        finalScore: 0,

        setMode: mode => set({ mode, state: 'idle' }),

        setState: state => set({ state }),

        setMultiplayer: isMultiplayer => set({ isMultiplayer }),

        updateSettings: newSettings =>
          set(state => {
            state.settings = { ...state.settings, ...newSettings }
          }),

        updateStats: newStats =>
          set(state => {
            state.stats = { ...state.stats, ...newStats }
            if (newStats.score && newStats.score > state.stats.highScore) {
              state.stats.highScore = newStats.score
            }
          }),

        setFinalScore: (score, winner) =>
          set({ finalScore: score, isWinner: winner, state: 'ended' }),

        resetGame: () =>
          set({
            state: 'idle',
            mode: 'menu',
            stats: defaultStats,
            finalScore: 0,
            isWinner: false,
          }),

        resetStats: () => set({ stats: { ...defaultStats, highScore: 0 } }),

        incrementScore: points =>
          set(state => {
            state.stats.score += points * state.stats.comboMultiplier
            if (state.stats.score > state.stats.highScore) {
              state.stats.highScore = state.stats.score
            }
          }),

        incrementCombo: () =>
          set(state => {
            state.stats.comboMultiplier = Math.min(state.stats.comboMultiplier + 0.1, 5)
          }),

        resetCombo: () =>
          set(state => {
            state.stats.comboMultiplier = 1
          }),
      })),
      {
        name: 'game-store',
        partialize: state => ({
          settings: state.settings,
          stats: { highScore: state.stats.highScore },
        }),
      }
    ),
    { name: 'GameStore' }
  )
)
