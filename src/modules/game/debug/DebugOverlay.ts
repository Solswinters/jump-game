/**
 * Debug overlay for development
 */

export interface DebugInfo {
  fps: number
  deltaTime: number
  playerPosition: { x: number; y: number }
  obstacleCount: number
  score: number
  combo: number
  difficulty: number
  memory?: number
}

export class DebugOverlay {
  private enabled: boolean = false
  private fpsHistory: number[] = []
  private maxHistory: number = 60

  enable(): void {
    this.enabled = true
  }

  disable(): void {
    this.enabled = false
  }

  toggle(): void {
    this.enabled = !this.enabled
  }

  isEnabled(): boolean {
    return this.enabled
  }

  updateFPS(fps: number): void {
    this.fpsHistory.push(fps)
    if (this.fpsHistory.length > this.maxHistory) {
      this.fpsHistory.shift()
    }
  }

  getAverageFPS(): number {
    if (this.fpsHistory.length === 0) return 0
    const sum = this.fpsHistory.reduce((a, b) => a + b, 0)
    return Math.round(sum / this.fpsHistory.length)
  }

  draw(ctx: CanvasRenderingContext2D, info: DebugInfo): void {
    if (!this.enabled) return

    ctx.save()

    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.fillRect(10, 10, 250, 180)

    // Text
    ctx.fillStyle = '#00ff00'
    ctx.font = '14px monospace'

    let y = 30
    const lineHeight = 20

    ctx.fillText(`FPS: ${info.fps} (avg: ${this.getAverageFPS()})`, 20, y)
    y += lineHeight

    ctx.fillText(`Delta: ${info.deltaTime.toFixed(2)}ms`, 20, y)
    y += lineHeight

    ctx.fillText(
      `Position: ${info.playerPosition.x.toFixed(0)}, ${info.playerPosition.y.toFixed(0)}`,
      20,
      y
    )
    y += lineHeight

    ctx.fillText(`Obstacles: ${info.obstacleCount}`, 20, y)
    y += lineHeight

    ctx.fillText(`Score: ${info.score}`, 20, y)
    y += lineHeight

    ctx.fillText(`Combo: ${info.combo}x`, 20, y)
    y += lineHeight

    ctx.fillText(`Difficulty: ${info.difficulty.toFixed(2)}`, 20, y)
    y += lineHeight

    if (info.memory !== undefined) {
      ctx.fillText(`Memory: ${(info.memory / 1024 / 1024).toFixed(2)} MB`, 20, y)
    }

    ctx.restore()
  }

  drawHitboxes(
    ctx: CanvasRenderingContext2D,
    entities: Array<{ x: number; y: number; width: number; height: number; type: string }>
  ): void {
    if (!this.enabled) return

    ctx.save()
    ctx.strokeStyle = '#ff0000'
    ctx.lineWidth = 2

    entities.forEach(entity => {
      ctx.strokeRect(entity.x, entity.y, entity.width, entity.height)

      // Label
      ctx.fillStyle = '#ffffff'
      ctx.font = '10px monospace'
      ctx.fillText(entity.type, entity.x, entity.y - 5)
    })

    ctx.restore()
  }
}

export const debugOverlay = new DebugOverlay()
