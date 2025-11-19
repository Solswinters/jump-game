/**
 * Manager for game lighting effects
 */

import { Light, LightConfig } from './Light'

export class LightingManager {
  private lights: Map<string, Light>
  private ambientLight: Light
  private enabled: boolean

  constructor() {
    this.lights = new Map()
    this.ambientLight = new Light({
      type: 'ambient',
      color: '#ffffff',
      intensity: 0.3,
    })
    this.enabled = true
  }

  addLight(id: string, config: LightConfig): Light {
    const light = new Light(config)
    this.lights.set(id, light)
    return light
  }

  removeLight(id: string): void {
    this.lights.delete(id)
  }

  getLight(id: string): Light | undefined {
    return this.lights.get(id)
  }

  getAllLights(): Light[] {
    return Array.from(this.lights.values())
  }

  setAmbientLight(intensity: number, color?: string): void {
    this.ambientLight.setIntensity(intensity)
    if (color) {
      this.ambientLight.color = color
    }
  }

  getLightingAt(x: number, y: number): number {
    if (!this.enabled) {
      return 1
    }

    let totalInfluence = this.ambientLight.getInfluenceAt(x, y)

    for (const light of this.lights.values()) {
      totalInfluence += light.getInfluenceAt(x, y)
    }

    return Math.min(totalInfluence, 1)
  }

  applyLighting(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    if (!this.enabled) {
      return
    }

    ctx.save()
    ctx.globalCompositeOperation = 'multiply'

    // Create gradient for each light
    for (const light of this.lights.values()) {
      if (!light.enabled || light.type !== 'point') {
        continue
      }

      const gradient = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, light.radius)

      const alpha = light.intensity
      gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`)
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
    }

    ctx.restore()
  }

  toggle(): void {
    this.enabled = !this.enabled
  }

  clear(): void {
    this.lights.clear()
  }
}
