/**
 * Lighting system for visual effects
 */

export type LightType = 'point' | 'directional' | 'ambient'

export interface LightConfig {
  type: LightType
  x?: number
  y?: number
  color: string
  intensity: number
  radius?: number
  direction?: { x: number; y: number }
}

export class Light {
  type: LightType
  x: number
  y: number
  color: string
  intensity: number
  radius: number
  direction: { x: number; y: number }
  enabled: boolean

  constructor(config: LightConfig) {
    this.type = config.type
    this.x = config.x ?? 0
    this.y = config.y ?? 0
    this.color = config.color
    this.intensity = config.intensity
    this.radius = config.radius ?? 100
    this.direction = config.direction ?? { x: 0, y: 1 }
    this.enabled = true
  }

  setPosition(x: number, y: number): void {
    this.x = x
    this.y = y
  }

  setIntensity(intensity: number): void {
    this.intensity = Math.max(0, Math.min(1, intensity))
  }

  setRadius(radius: number): void {
    this.radius = Math.max(0, radius)
  }

  toggle(): void {
    this.enabled = !this.enabled
  }

  getInfluenceAt(x: number, y: number): number {
    if (!this.enabled) {
      return 0
    }

    switch (this.type) {
      case 'point': {
        const dx = x - this.x
        const dy = y - this.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const falloff = Math.max(0, 1 - distance / this.radius)
        return this.intensity * falloff
      }
      case 'directional':
        return this.intensity
      case 'ambient':
        return this.intensity
      default:
        return 0
    }
  }
}
