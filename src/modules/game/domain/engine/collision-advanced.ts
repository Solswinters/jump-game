/**
 * Advanced collision detection system
 */

import { Player, Obstacle, PowerUp } from "../models";

export interface CollisionResult {
  hasCollision: boolean;
  type: "obstacle" | "powerup" | "boundary" | "none";
  target?: Obstacle | PowerUp;
  penetrationDepth?: number;
  normal?: { x: number; y: number };
}

/**
 * AABB collision detection
 */
export function checkAABBCollision(
  x1: number,
  y1: number,
  w1: number,
  h1: number,
  x2: number,
  y2: number,
  w2: number,
  h2: number
): boolean {
  return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}

/**
 * Circle collision detection
 */
export function checkCircleCollision(
  x1: number,
  y1: number,
  r1: number,
  x2: number,
  y2: number,
  r2: number
): boolean {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < r1 + r2;
}

/**
 * Advanced collision check with detailed result
 */
export function checkCollisionAdvanced(
  player: Player,
  obstacles: Obstacle[],
  powerUps?: PowerUp[],
  playerWidth: number = 40,
  playerHeight: number = 40
): CollisionResult {
  // Check obstacle collisions
  for (const obstacle of obstacles) {
    if (
      checkAABBCollision(
        player.x,
        player.y,
        playerWidth,
        playerHeight,
        obstacle.x,
        obstacle.y,
        obstacle.width,
        obstacle.height
      )
    ) {
      const penetrationDepth = calculatePenetrationDepth(
        player.x,
        player.y,
        playerWidth,
        playerHeight,
        obstacle.x,
        obstacle.y,
        obstacle.width,
        obstacle.height
      );

      return {
        hasCollision: true,
        type: "obstacle",
        target: obstacle,
        penetrationDepth,
        normal: calculateCollisionNormal(player, obstacle, playerWidth, playerHeight),
      };
    }
  }

  // Check power-up collisions
  if (powerUps) {
    for (const powerUp of powerUps) {
      if (
        checkAABBCollision(
          player.x,
          player.y,
          playerWidth,
          playerHeight,
          powerUp.x,
          powerUp.y,
          powerUp.width,
          powerUp.height
        )
      ) {
        return {
          hasCollision: true,
          type: "powerup",
          target: powerUp,
        };
      }
    }
  }

  return {
    hasCollision: false,
    type: "none",
  };
}

/**
 * Calculate penetration depth for collision response
 */
function calculatePenetrationDepth(
  x1: number,
  y1: number,
  w1: number,
  h1: number,
  x2: number,
  y2: number,
  w2: number,
  h2: number
): number {
  const overlapX = Math.min(x1 + w1, x2 + w2) - Math.max(x1, x2);
  const overlapY = Math.min(y1 + h1, y2 + h2) - Math.max(y1, y2);
  return Math.min(overlapX, overlapY);
}

/**
 * Calculate collision normal for physics response
 */
function calculateCollisionNormal(
  player: Player,
  obstacle: Obstacle,
  playerWidth: number,
  playerHeight: number
): { x: number; y: number } {
  const playerCenterX = player.x + playerWidth / 2;
  const playerCenterY = player.y + playerHeight / 2;
  const obstacleCenterX = obstacle.x + obstacle.width / 2;
  const obstacleCenterY = obstacle.y + obstacle.height / 2;

  const dx = playerCenterX - obstacleCenterX;
  const dy = playerCenterY - obstacleCenterY;
  const magnitude = Math.sqrt(dx * dx + dy * dy);

  return {
    x: dx / magnitude,
    y: dy / magnitude,
  };
}

/**
 * Predict collision along movement path
 */
export function predictCollision(
  player: Player,
  velocity: { x: number; y: number },
  obstacles: Obstacle[],
  deltaTime: number,
  playerWidth: number = 40,
  playerHeight: number = 40
): { willCollide: boolean; timeToCollision?: number; obstacle?: Obstacle } {
  const steps = 10;
  const stepX = (velocity.x * deltaTime) / steps;
  const stepY = (velocity.y * deltaTime) / steps;

  for (let step = 1; step <= steps; step++) {
    const futureX = player.x + stepX * step;
    const futureY = player.y + stepY * step;

    for (const obstacle of obstacles) {
      if (
        checkAABBCollision(
          futureX,
          futureY,
          playerWidth,
          playerHeight,
          obstacle.x,
          obstacle.y,
          obstacle.width,
          obstacle.height
        )
      ) {
        return {
          willCollide: true,
          timeToCollision: (deltaTime * step) / steps,
          obstacle,
        };
      }
    }
  }

  return { willCollide: false };
}

