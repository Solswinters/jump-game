/**
 * Steering behaviors for AI movement
 */

export interface Vector2D {
  x: number
  y: number
}

export interface MovingEntity {
  position: Vector2D
  velocity: Vector2D
  maxSpeed: number
  maxForce: number
}

export class SteeringBehaviors {
  static seek(entity: MovingEntity, target: Vector2D): Vector2D {
    const desired = {
      x: target.x - entity.position.x,
      y: target.y - entity.position.y,
    }

    const length = Math.sqrt(desired.x * desired.x + desired.y * desired.y)
    if (length > 0) {
      desired.x = (desired.x / length) * entity.maxSpeed
      desired.y = (desired.y / length) * entity.maxSpeed
    }

    return {
      x: desired.x - entity.velocity.x,
      y: desired.y - entity.velocity.y,
    }
  }

  static flee(entity: MovingEntity, target: Vector2D): Vector2D {
    const seekForce = this.seek(entity, target)
    return {
      x: -seekForce.x,
      y: -seekForce.y,
    }
  }

  static arrive(entity: MovingEntity, target: Vector2D, slowingRadius = 100): Vector2D {
    const toTarget = {
      x: target.x - entity.position.x,
      y: target.y - entity.position.y,
    }

    const distance = Math.sqrt(toTarget.x * toTarget.x + toTarget.y * toTarget.y)

    if (distance === 0) {
      return { x: 0, y: 0 }
    }

    const speed =
      distance < slowingRadius ? entity.maxSpeed * (distance / slowingRadius) : entity.maxSpeed

    const desired = {
      x: (toTarget.x / distance) * speed,
      y: (toTarget.y / distance) * speed,
    }

    return {
      x: desired.x - entity.velocity.x,
      y: desired.y - entity.velocity.y,
    }
  }

  static pursue(entity: MovingEntity, target: MovingEntity, predictionTime = 1): Vector2D {
    const prediction = {
      x: target.position.x + target.velocity.x * predictionTime,
      y: target.position.y + target.velocity.y * predictionTime,
    }

    return this.seek(entity, prediction)
  }

  static evade(entity: MovingEntity, target: MovingEntity, predictionTime = 1): Vector2D {
    const pursueForce = this.pursue(entity, target, predictionTime)
    return {
      x: -pursueForce.x,
      y: -pursueForce.y,
    }
  }

  static wander(
    entity: MovingEntity,
    wanderRadius = 50,
    wanderDistance = 100,
    wanderAngle = 0
  ): Vector2D {
    const circleCenter = {
      x: entity.velocity.x,
      y: entity.velocity.y,
    }

    const length = Math.sqrt(circleCenter.x * circleCenter.x + circleCenter.y * circleCenter.y)
    if (length > 0) {
      circleCenter.x = (circleCenter.x / length) * wanderDistance
      circleCenter.y = (circleCenter.y / length) * wanderDistance
    }

    const displacement = {
      x: Math.cos(wanderAngle) * wanderRadius,
      y: Math.sin(wanderAngle) * wanderRadius,
    }

    return {
      x: circleCenter.x + displacement.x,
      y: circleCenter.y + displacement.y,
    }
  }

  static separation(entity: MovingEntity, neighbors: MovingEntity[], radius = 50): Vector2D {
    const force = { x: 0, y: 0 }

    for (const neighbor of neighbors) {
      const toEntity = {
        x: entity.position.x - neighbor.position.x,
        y: entity.position.y - neighbor.position.y,
      }

      const distance = Math.sqrt(toEntity.x * toEntity.x + toEntity.y * toEntity.y)

      if (distance > 0 && distance < radius) {
        force.x += toEntity.x / distance
        force.y += toEntity.y / distance
      }
    }

    return force
  }

  static limitForce(force: Vector2D, maxForce: number): Vector2D {
    const length = Math.sqrt(force.x * force.x + force.y * force.y)

    if (length > maxForce) {
      return {
        x: (force.x / length) * maxForce,
        y: (force.y / length) * maxForce,
      }
    }

    return force
  }
}
