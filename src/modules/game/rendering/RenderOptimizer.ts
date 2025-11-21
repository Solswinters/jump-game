/**
 * Render Optimizer - Performance optimizations for game rendering
 * HIGH PRIORITY: Performance improvements for smooth 60fps gameplay
 */

export interface RenderStats {
  fps: number
  frameTime: number
  drawCalls: number
  triangles: number
  textures: number
  memory: number
}

export interface OptimizationSettings {
  enableBatching: boolean
  enableCulling: boolean
  enableLOD: boolean
  maxDrawCalls: number
  cullDistance: number
}

export class RenderOptimizer {
  private stats: RenderStats = {
    fps: 0,
    frameTime: 0,
    drawCalls: 0,
    triangles: 0,
    textures: 0,
    memory: 0,
  }

  private settings: OptimizationSettings = {
    enableBatching: true,
    enableCulling: true,
    enableLOD: true,
    maxDrawCalls: 1000,
    cullDistance: 2000,
  }

  private frameBuffer: HTMLCanvasElement | null = null
  private offscreenCanvas: HTMLCanvasElement | null = null
  private batchedObjects: Map<string, any[]> = new Map()
  private visibleObjects: Set<any> = new Set()

  constructor() {
    this.initializeOffscreenCanvas()
  }

  /**
   * Initialize offscreen canvas for pre-rendering
   */
  private initializeOffscreenCanvas(): void {
    if (typeof window === 'undefined') return

    this.offscreenCanvas = document.createElement('canvas')
    this.offscreenCanvas.width = 256
    this.offscreenCanvas.height = 256
  }

  /**
   * Optimize draw calls through batching
   */
  public batchDrawCalls(objects: any[]): Map<string, any[]> {
    if (!this.settings.enableBatching) {
      return new Map()
    }

    this.batchedObjects.clear()

    for (const obj of objects) {
      const key = this.getBatchKey(obj)
      const batch = this.batchedObjects.get(key) || []
      batch.push(obj)
      this.batchedObjects.set(key, batch)
    }

    return this.batchedObjects
  }

  /**
   * Generate batch key for grouping objects
   */
  private getBatchKey(obj: any): string {
    return `${obj.type}_${obj.texture}_${obj.shader}`
  }

  /**
   * Frustum culling to skip off-screen objects
   */
  public cullObjects(
    objects: any[],
    camera: { x: number; y: number; width: number; height: number }
  ): any[] {
    if (!this.settings.enableCulling) {
      return objects
    }

    this.visibleObjects.clear()

    const cullPadding = 100 // Extra padding for smooth transitions
    const minX = camera.x - cullPadding
    const maxX = camera.x + camera.width + cullPadding
    const minY = camera.y - cullPadding
    const maxY = camera.y + camera.height + cullPadding

    for (const obj of objects) {
      if (this.isInViewport(obj, minX, maxX, minY, maxY)) {
        this.visibleObjects.add(obj)
      }
    }

    return Array.from(this.visibleObjects)
  }

  /**
   * Check if object is in viewport
   */
  private isInViewport(obj: any, minX: number, maxX: number, minY: number, maxY: number): boolean {
    const objMaxX = obj.x + (obj.width || 0)
    const objMaxY = obj.y + (obj.height || 0)

    return !(objMaxX < minX || obj.x > maxX || objMaxY < minY || obj.y > maxY)
  }

  /**
   * Level of Detail (LOD) management
   */
  public selectLOD(distance: number): 'high' | 'medium' | 'low' {
    if (!this.settings.enableLOD) {
      return 'high'
    }

    if (distance < 500) return 'high'
    if (distance < 1000) return 'medium'
    return 'low'
  }

  /**
   * Pre-render static objects to texture
   */
  public preRenderStatic(ctx: CanvasRenderingContext2D, objects: any[]): ImageData | null {
    if (!this.offscreenCanvas) return null

    const offCtx = this.offscreenCanvas.getContext('2d')
    if (!offCtx) return null

    offCtx.clearRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height)

    // Render all static objects to offscreen canvas
    for (const obj of objects) {
      // Custom rendering logic for each object
      this.renderObject(offCtx, obj)
    }

    return offCtx.getImageData(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height)
  }

  /**
   * Render single object
   */
  private renderObject(ctx: CanvasRenderingContext2D, obj: any): void {
    if (obj.render && typeof obj.render === 'function') {
      obj.render(ctx)
    }
  }

  /**
   * Update performance statistics
   */
  public updateStats(deltaTime: number, drawCalls: number): void {
    this.stats.frameTime = deltaTime
    this.stats.fps = deltaTime > 0 ? Math.round(1000 / deltaTime) : 0
    this.stats.drawCalls = drawCalls
  }

  /**
   * Get current performance stats
   */
  public getStats(): RenderStats {
    return { ...this.stats }
  }

  /**
   * Update optimization settings
   */
  public setSettings(settings: Partial<OptimizationSettings>): void {
    this.settings = { ...this.settings, ...settings }
  }

  /**
   * Get current settings
   */
  public getSettings(): OptimizationSettings {
    return { ...this.settings }
  }

  /**
   * Check if rendering is bottlenecked
   */
  public isBottlenecked(): boolean {
    return this.stats.fps < 30 || this.stats.frameTime > 33
  }

  /**
   * Auto-adjust quality based on performance
   */
  public autoAdjustQuality(): void {
    if (this.isBottlenecked()) {
      // Reduce quality
      if (!this.settings.enableCulling) {
        this.settings.enableCulling = true
      } else if (!this.settings.enableBatching) {
        this.settings.enableBatching = true
      } else if (!this.settings.enableLOD) {
        this.settings.enableLOD = true
      }
    } else if (this.stats.fps > 55) {
      // Can afford higher quality
      if (this.settings.enableLOD) {
        this.settings.enableLOD = false
      }
    }
  }

  /**
   * Clear cached data
   */
  public clear(): void {
    this.batchedObjects.clear()
    this.visibleObjects.clear()
  }
}

export default RenderOptimizer
