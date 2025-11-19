/**
 * Game module exports
 */

// Core
export { GameEngine } from './core/GameEngine'

// Player
export { Player, type PlayerState } from './player/Player'

// Obstacles
export * from './obstacles/types'
export { obstacleFactory } from './obstacles/factory'
export { ObstaclePoolManager } from './obstacles/pool'
export { updateObstacle, isObstacleOffscreen, sortObstaclesByDistance } from './obstacles/updater'

// Physics
export * from './physics/collision/aabb'
export * from './physics/collision/sat'
export { Quadtree } from './physics/spatial/quadtree'
export { SpatialHashGrid } from './physics/spatial/grid'

// Effects
export { Particle, type ParticleConfig } from './effects/particles/Particle'
export { ParticleSystem, type EmitterConfig } from './effects/particles/ParticleSystem'
export { Trail } from './effects/trail/Trail'
export { ScreenShake } from './effects/camera/ScreenShake'

// Powerups
export * from './powerups/types'
export { powerUpFactory } from './powerups/factory'

// Levels
export { LevelGenerator, levelGenerator, type LevelConfig } from './levels/Generator'

// Difficulty
export { DifficultyManager, type DifficultyConfig } from './difficulty/DifficultyManager'

// Input
export { InputManager, inputManager, type InputAction, type InputState } from './input/InputManager'

// Audio
export { SoundManager, soundManager, type SoundEffect, type Music } from './audio/SoundManager'

// Scoring
export { ScoreManager, type ScoreState } from './scoring/ScoreManager'

// State
export { GameStateMachine, type GameState, type StateTransition } from './state/GameStateMachine'

// Rendering
export { Renderer } from './rendering/Renderer'

// Animation
export { Animator, Easing, type Animation, type EasingFunction } from './animation/Animator'

// Achievements
export { AchievementManager, achievementManager } from './achievements/AchievementManager'
export * from './achievements/types'

// Camera
export { Camera, type CameraConfig } from './camera/Camera'

// Game Loop
export { GameLoop } from './loop/GameLoop'

// Time
export { TimeManager } from './time/TimeManager'

// Background
export { Background, type BackgroundLayer } from './background/Background'

// Modes
export {
  GameMode,
  EndlessModeconfig,
  TimeAttackMode,
  HardcoreMode,
  gameModes,
} from './modes/GameMode'

// AI
export { ObstaclePatternGenerator, patternGenerator, type Pattern } from './ai/ObstaclePattern'

// Save
export { SaveManager, saveManager, type SaveData } from './save/SaveManager'

// Stats
export { StatsTracker, statsTracker, type GameStats } from './stats/StatsTracker'

// Leaderboard
export {
  LeaderboardManager,
  leaderboardManager,
  type LeaderboardEntry,
} from './leaderboard/LeaderboardManager'

// Settings
export { SettingsManager, settingsManager, type GameSettings } from './settings/Settings'

// Constants
export * from './constants'

// Utils
export * from './utils/score-calculator'
export * from './utils/physics'
