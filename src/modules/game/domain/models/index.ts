/**
 * Domain models for game module
 */

export interface Player {
  id: string;
  x: number;
  y: number;
  velocityY: number;
  isJumping: boolean;
  isGrounded: boolean;
  score: number;
  isAlive: boolean;
  color: string;
}

export interface Obstacle {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GameSession {
  id: string;
  playerId: string;
  startTime: number;
  endTime?: number;
  finalScore: number;
  obstaclesCleared: number;
  difficulty: number;
  isMultiplayer: boolean;
  roomId?: string;
}

export interface PowerUp {
  id: string;
  type: "shield" | "double-points" | "slow-motion" | "invincibility";
  x: number;
  y: number;
  width: number;
  height: number;
  duration: number;
  active: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (session: GameSession) => boolean;
  unlocked: boolean;
  unlockedAt?: number;
}

export type GameDifficulty = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface GameMetrics {
  fps: number;
  deltaTime: number;
  obstacles: number;
  players: number;
  latency?: number;
}

