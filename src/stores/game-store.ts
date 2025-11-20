import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export type GameMode = 'menu' | 'single' | 'multi' | 'time-trial' | 'endless' | 'story'
export type GameState = 'idle' | 'playing' | 'paused' | 'ended'
export type Difficulty = 'easy' | 'normal' | 'hard' | 'extreme'

export const GAME_MODES: ReadonlyArray<GameMode> = [
  'menu',
  'single',
  'multi',
  'time-trial',
  'endless',
  'story',
] as const

export const GAME_STATES: ReadonlyArray<GameState> = ['idle', 'playing', 'paused', 'ended'] as const

export const DIFFICULTIES: ReadonlyArray<Difficulty> = [
  'easy',
  'normal',
  'hard',
  'extreme',
] as const

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
  isPaused: boolean
  startTime: number | null
  endTime: number | null

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
  pause: () => void
  resume: () => void
  startGame: () => void
  endGame: (winner: boolean) => void
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
      immer((set) => ({
        mode: 'menu',
        state: 'idle',
        settings: defaultSettings,
        stats: defaultStats,
        isMultiplayer: false,
        isWinner: false,
        finalScore: 0,
        isPaused: false,
        startTime: null,
        endTime: null,

        setMode: (mode) =>
          set((state) => {
            state.mode = mode
            state.state = 'idle'
            state.stats = { ...defaultStats, highScore: state.stats.highScore }
          }),

        setState: (newState) =>
          set((state) => {
            state.state = newState
            state.isPaused = newState === 'paused'
          }),

        setMultiplayer: (isMultiplayer) => set({ isMultiplayer }),

        updateSettings: (newSettings) =>
          set((state) => {
            state.settings = { ...state.settings, ...newSettings }
          }),

        updateStats: (newStats) =>
          set((state) => {
            state.stats = { ...state.stats, ...newStats }
            if (newStats.score !== undefined && newStats.score > state.stats.highScore) {
              state.stats.highScore = newStats.score
            }
          }),

        setFinalScore: (score, winner) =>
          set((state) => {
            state.finalScore = score
            state.isWinner = winner
            state.state = 'ended'
            state.endTime = Date.now()
          }),

        resetGame: () =>
          set((state) => {
            state.state = 'idle'
            state.mode = 'menu'
            state.stats = { ...defaultStats, highScore: state.stats.highScore }
            state.finalScore = 0
            state.isWinner = false
            state.isPaused = false
            state.startTime = null
            state.endTime = null
          }),

        resetStats: () =>
          set((state) => {
            state.stats = { ...defaultStats, highScore: 0 }
          }),

        incrementScore: (points) =>
          set((state) => {
            const earnedPoints = Math.floor(points * state.stats.comboMultiplier)
            state.stats.score += earnedPoints
            if (state.stats.score > state.stats.highScore) {
              state.stats.highScore = state.stats.score
            }
          }),

        incrementCombo: () =>
          set((state) => {
            state.stats.comboMultiplier = Math.min(state.stats.comboMultiplier + 0.1, 5)
          }),

        resetCombo: () =>
          set((state) => {
            state.stats.comboMultiplier = 1
          }),

        pause: () =>
          set((state) => {
            if (state.state === 'playing') {
              state.state = 'paused'
              state.isPaused = true
            }
          }),

        resume: () =>
          set((state) => {
            if (state.state === 'paused') {
              state.state = 'playing'
              state.isPaused = false
            }
          }),

        startGame: () =>
          set((state) => {
            state.state = 'playing'
            state.stats = { ...defaultStats, highScore: state.stats.highScore }
            state.startTime = Date.now()
            state.endTime = null
            state.isPaused = false
          }),

        endGame: (winner) =>
          set((state) => {
            state.state = 'ended'
            state.endTime = Date.now()
            state.isWinner = winner
            state.finalScore = state.stats.score
            state.isPaused = false
          }),
      })),
      {
        name: 'game-store',
        partialize: (state) => ({
          settings: state.settings,
          stats: { highScore: state.stats.highScore },
        }),
      }
    ),
    { name: 'GameStore' }
  )
)
