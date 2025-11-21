/**
 * Game Store Actions - Typed action creators for better state management
 * Refactored to improve type safety and maintainability
 */

import type { GameMode, GameState, Difficulty } from './game-store'

export interface GameAction {
  type: string
  payload?: any
}

// Action types as constants for type safety
export const GAME_ACTIONS = {
  // Game state actions
  START_GAME: 'game/start',
  PAUSE_GAME: 'game/pause',
  RESUME_GAME: 'game/resume',
  END_GAME: 'game/end',
  RESET_GAME: 'game/reset',

  // Mode actions
  SET_MODE: 'game/setMode',
  TOGGLE_MULTIPLAYER: 'game/toggleMultiplayer',

  // Score actions
  ADD_SCORE: 'game/addScore',
  SET_HIGH_SCORE: 'game/setHighScore',
  UPDATE_COMBO: 'game/updateCombo',
  RESET_COMBO: 'game/resetCombo',

  // Settings actions
  UPDATE_SETTINGS: 'game/updateSettings',
  TOGGLE_SOUND: 'game/toggleSound',
  TOGGLE_MUSIC: 'game/toggleMusic',
  SET_VOLUME: 'game/setVolume',
  SET_DIFFICULTY: 'game/setDifficulty',

  // Stats actions
  UPDATE_STATS: 'game/updateStats',
  INCREMENT_OBSTACLES: 'game/incrementObstacles',
  COLLECT_POWERUP: 'game/collectPowerup',

  // Winner actions
  SET_WINNER: 'game/setWinner',
  CLEAR_WINNER: 'game/clearWinner',
} as const

// Action creators with proper typing
export const gameActions = {
  startGame: (mode: GameMode): GameAction => ({
    type: GAME_ACTIONS.START_GAME,
    payload: { mode },
  }),

  pauseGame: (): GameAction => ({
    type: GAME_ACTIONS.PAUSE_GAME,
  }),

  resumeGame: (): GameAction => ({
    type: GAME_ACTIONS.RESUME_GAME,
  }),

  endGame: (finalScore: number): GameAction => ({
    type: GAME_ACTIONS.END_GAME,
    payload: { finalScore },
  }),

  resetGame: (): GameAction => ({
    type: GAME_ACTIONS.RESET_GAME,
  }),

  setMode: (mode: GameMode): GameAction => ({
    type: GAME_ACTIONS.SET_MODE,
    payload: { mode },
  }),

  toggleMultiplayer: (enabled: boolean): GameAction => ({
    type: GAME_ACTIONS.TOGGLE_MULTIPLAYER,
    payload: { enabled },
  }),

  addScore: (points: number): GameAction => ({
    type: GAME_ACTIONS.ADD_SCORE,
    payload: { points },
  }),

  setHighScore: (score: number): GameAction => ({
    type: GAME_ACTIONS.SET_HIGH_SCORE,
    payload: { score },
  }),

  updateCombo: (multiplier: number): GameAction => ({
    type: GAME_ACTIONS.UPDATE_COMBO,
    payload: { multiplier },
  }),

  resetCombo: (): GameAction => ({
    type: GAME_ACTIONS.RESET_COMBO,
  }),

  updateSettings: (
    settings: Partial<{
      difficulty: Difficulty
      soundEnabled: boolean
      musicEnabled: boolean
      sfxVolume: number
      musicVolume: number
      particlesEnabled: boolean
      screenShakeEnabled: boolean
      showFPS: boolean
      reducedMotion: boolean
    }>
  ): GameAction => ({
    type: GAME_ACTIONS.UPDATE_SETTINGS,
    payload: settings,
  }),

  toggleSound: (): GameAction => ({
    type: GAME_ACTIONS.TOGGLE_SOUND,
  }),

  toggleMusic: (): GameAction => ({
    type: GAME_ACTIONS.TOGGLE_MUSIC,
  }),

  setVolume: (type: 'sfx' | 'music', volume: number): GameAction => ({
    type: GAME_ACTIONS.SET_VOLUME,
    payload: { type, volume },
  }),

  setDifficulty: (difficulty: Difficulty): GameAction => ({
    type: GAME_ACTIONS.SET_DIFFICULTY,
    payload: { difficulty },
  }),

  updateStats: (
    stats: Partial<{
      score: number
      distance: number
      obstacles: number
      powerUpsCollected: number
      timeElapsed: number
    }>
  ): GameAction => ({
    type: GAME_ACTIONS.UPDATE_STATS,
    payload: stats,
  }),

  incrementObstacles: (): GameAction => ({
    type: GAME_ACTIONS.INCREMENT_OBSTACLES,
  }),

  collectPowerup: (): GameAction => ({
    type: GAME_ACTIONS.COLLECT_POWERUP,
  }),

  setWinner: (isWinner: boolean): GameAction => ({
    type: GAME_ACTIONS.SET_WINNER,
    payload: { isWinner },
  }),

  clearWinner: (): GameAction => ({
    type: GAME_ACTIONS.CLEAR_WINNER,
  }),
}

// Action type guards for type narrowing
export const isGameAction = (action: any): action is GameAction => {
  return action && typeof action.type === 'string'
}

export const isStartGameAction = (
  action: GameAction
): action is GameAction & { type: typeof GAME_ACTIONS.START_GAME } => {
  return action.type === GAME_ACTIONS.START_GAME
}

export const isEndGameAction = (
  action: GameAction
): action is GameAction & { type: typeof GAME_ACTIONS.END_GAME } => {
  return action.type === GAME_ACTIONS.END_GAME
}

// Action validation helpers
export const validateGameMode = (mode: unknown): mode is GameMode => {
  const validModes: GameMode[] = ['menu', 'single', 'multi', 'time-trial', 'endless', 'story']
  return typeof mode === 'string' && validModes.includes(mode as GameMode)
}

export const validateGameState = (state: unknown): state is GameState => {
  const validStates: GameState[] = ['idle', 'playing', 'paused', 'ended']
  return typeof state === 'string' && validStates.includes(state as GameState)
}

export const validateDifficulty = (difficulty: unknown): difficulty is Difficulty => {
  const validDifficulties: Difficulty[] = ['easy', 'normal', 'hard', 'extreme']
  return typeof difficulty === 'string' && validDifficulties.includes(difficulty as Difficulty)
}

export default gameActions
