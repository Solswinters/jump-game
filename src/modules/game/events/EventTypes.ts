/**
 * Game event types for event-driven architecture
 */

export interface GameEvent {
  type: string
  timestamp: number
  data?: Record<string, unknown>
}

export interface PlayerEvent extends GameEvent {
  playerId: string
}

export interface ScoreEvent extends PlayerEvent {
  type: 'SCORE_INCREASED' | 'SCORE_MILESTONE' | 'HIGH_SCORE'
  score: number
  delta?: number
}

export interface CollisionEvent extends PlayerEvent {
  type: 'COLLISION_OBSTACLE' | 'COLLISION_POWERUP' | 'COLLISION_WALL'
  entityId: string
  position: { x: number; y: number }
}

export interface PowerUpEvent extends PlayerEvent {
  type: 'POWERUP_COLLECTED' | 'POWERUP_ACTIVATED' | 'POWERUP_EXPIRED'
  powerUpType: string
  duration?: number
}

export interface GameStateEvent extends GameEvent {
  type: 'GAME_STARTED' | 'GAME_PAUSED' | 'GAME_RESUMED' | 'GAME_OVER' | 'LEVEL_UP'
  state: string
}

export interface AchievementEvent extends PlayerEvent {
  type: 'ACHIEVEMENT_UNLOCKED' | 'ACHIEVEMENT_PROGRESS'
  achievementId: string
  progress?: number
}

export type GameEventUnion =
  | ScoreEvent
  | CollisionEvent
  | PowerUpEvent
  | GameStateEvent
  | AchievementEvent

export type GameEventHandler<T extends GameEvent = GameEvent> = (event: T) => void
