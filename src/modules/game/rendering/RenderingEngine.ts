/**
 * Rendering Engine - Advanced rendering system with layers, effects, and optimization
 */

export interface RenderContext {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  width: number
  height: number
  pixelRatio: number
}

export interface RenderLayer {
  id: string
  zIndex: number
  visible: boolean
  opacity: number
  blendMode: GlobalCompositeOperation
  objects: RenderObject[]
}

export interface RenderObject {
  id: string
  type: 'sprite' | 'shape' | 'text' | 'particle' | 'custom'
  position: { x: number; y: number }
  size?: { width: number; height: number }
  rotation?: number
  scale?: { x: number; y: number }
  opacity?: number
  visible?: boolean
  data?: any
  render: (ctx: CanvasRenderingContext2D) => void
}

export interface RenderStats {
  fps: number
  drawCalls: number
  objectsRendered: number
  layersRendered: number
  renderTime: number
}

export interface RenderConfig {
  antialias: boolean
  smoothing: boolean
  alpha: boolean
  pixelRatio: number
  backgroundColor: string
  clearBeforeRender: boolean
}

export class RenderingEngine {
  private context: RenderContext
  private layers: Map<string, RenderLayer> = new Map()
  private config: RenderConfig
  private stats: RenderStats = {
    fps: 0,
    drawCalls: 0,
    objectsRendered: 0,
    layersRendered: 0,
    renderTime: 0,
  }
  private lastFrameTime: number = 0
  private frameCount: number = 0
  private fpsUpdateTime: number = 0

  constructor(canvas: HTMLCanvasElement, config?: Partial<RenderConfig>) {
    this.config = {
      antialias: true,
      smoothing: true,
      alpha: true,
      pixelRatio: window.devicePixelRatio || 1,
      backgroundColor: '#000000',
      clearBeforeRender: true,
      ...config,
    }

    const ctx = canvas.getContext('2d', {
      alpha: this.config.alpha,
      desynchronized: true,
    })

    if (!ctx) {
      throw new Error('Failed to get 2D context')
    }

    this.context = {
      canvas,
      ctx,
      width: canvas.width,
      height: canvas.height,
      pixelRatio: this.config.pixelRatio,
    }

    this.setupCanvas()
  }

  /**
   * Setup canvas with optimal settings
   */
  private setupCanvas(): void {
    const { canvas, ctx, pixelRatio } = this.context

    // Set display size
    canvas.style.width = `${canvas.width / pixelRatio}px`
    canvas.style.height = `${canvas.height / pixelRatio}px`

    // Configure context
    ctx.imageSmoothingEnabled = this.config.smoothing
    if (this.config.antialias) {
      ctx.imageSmoothingQuality = 'high'
    }
  }

  /**
   * Create a new layer
   */
  createLayer(id: string, zIndex: number = 0): RenderLayer {
    const layer: RenderLayer = {
      id,
      zIndex,
      visible: true,
      opacity: 1,
      blendMode: 'source-over',
      objects: [],
    }

    this.layers.set(id, layer)
    return layer
  }

  /**
   * Get layer by ID
   */
  getLayer(id: string): RenderLayer | undefined {
    return this.layers.get(id)
  }

  /**
   * Remove layer
   */
  removeLayer(id: string): void {
    this.layers.delete(id)
  }

  /**
   * Add object to layer
   */
  addObject(layerId: string, object: RenderObject): void {
    const layer = this.layers.get(layerId)
    if (layer) {
      layer.objects.push(object)
    }
  }

  /**
   * Remove object from layer
   */
  removeObject(layerId: string, objectId: string): void {
    const layer = this.layers.get(layerId)
    if (layer) {
      layer.objects = layer.objects.filter((obj) => obj.id !== objectId)
    }
  }

  /**
   * Clear all objects from layer
   */
  clearLayer(layerId: string): void {
    const layer = this.layers.get(layerId)
    if (layer) {
      layer.objects = []
    }
  }

  /**
   * Render a single frame
   */
  render(): void {
    const startTime = performance.now()
    const { ctx, width, height } = this.context

    // Clear canvas
    if (this.config.clearBeforeRender) {
      ctx.clearRect(0, 0, width, height)
      if (this.config.backgroundColor) {
        ctx.fillStyle = this.config.backgroundColor
        ctx.fillRect(0, 0, width, height)
      }
    }

    // Reset stats
    this.stats.drawCalls = 0
    this.stats.objectsRendered = 0
    this.stats.layersRendered = 0

    // Sort layers by z-index
    const sortedLayers = Array.from(this.layers.values()).sort((a, b) => a.zIndex - b.zIndex)

    // Render each layer
    for (const layer of sortedLayers) {
      if (!layer.visible) continue

      this.renderLayer(layer)
      this.stats.layersRendered++
    }

    // Update stats
    const renderTime = performance.now() - startTime
    this.stats.renderTime = renderTime
    this.updateFPS()
  }

  /**
   * Render a single layer
   */
  private renderLayer(layer: RenderLayer): void {
    const { ctx } = this.context

    ctx.save()

    // Apply layer-level transformations
    ctx.globalAlpha = layer.opacity
    ctx.globalCompositeOperation = layer.blendMode

    // Render all objects in layer
    for (const object of layer.objects) {
      if (object.visible === false) continue

      this.renderObject(object)
      this.stats.objectsRendered++
      this.stats.drawCalls++
    }

    ctx.restore()
  }

  /**
   * Render a single object
   */
  private renderObject(object: RenderObject): void {
    const { ctx } = this.context

    ctx.save()

    // Apply transformations
    ctx.translate(object.position.x, object.position.y)

    if (object.rotation) {
      ctx.rotate(object.rotation)
    }

    if (object.scale) {
      ctx.scale(object.scale.x, object.scale.y)
    }

    if (object.opacity !== undefined) {
      ctx.globalAlpha *= object.opacity
    }

    // Render the object
    object.render(ctx)

    ctx.restore()
  }

  /**
   * Draw a rectangle
   */
  drawRect(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    fill: boolean = true
  ): void {
    const { ctx } = this.context

    if (fill) {
      ctx.fillStyle = color
      ctx.fillRect(x, y, width, height)
    } else {
      ctx.strokeStyle = color
      ctx.strokeRect(x, y, width, height)
    }

    this.stats.drawCalls++
  }

  /**
   * Draw a circle
   */
  drawCircle(x: number, y: number, radius: number, color: string, fill: boolean = true): void {
    const { ctx } = this.context

    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)

    if (fill) {
      ctx.fillStyle = color
      ctx.fill()
    } else {
      ctx.strokeStyle = color
      ctx.stroke()
    }

    this.stats.drawCalls++
  }

  /**
   * Draw a line
   */
  drawLine(x1: number, y1: number, x2: number, y2: number, color: string, width: number = 1): void {
    const { ctx } = this.context

    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.strokeStyle = color
    ctx.lineWidth = width
    ctx.stroke()

    this.stats.drawCalls++
  }

  /**
   * Draw text
   */
  drawText(
    text: string,
    x: number,
    y: number,
    font: string = '16px Arial',
    color: string = '#000000',
    align: CanvasTextAlign = 'left',
    baseline: CanvasTextBaseline = 'top'
  ): void {
    const { ctx } = this.context

    ctx.font = font
    ctx.fillStyle = color
    ctx.textAlign = align
    ctx.textBaseline = baseline
    ctx.fillText(text, x, y)

    this.stats.drawCalls++
  }

  /**
   * Draw image
   */
  drawImage(
    image: HTMLImageElement | HTMLCanvasElement,
    x: number,
    y: number,
    width?: number,
    height?: number
  ): void {
    const { ctx } = this.context

    if (width !== undefined && height !== undefined) {
      ctx.drawImage(image, x, y, width, height)
    } else {
      ctx.drawImage(image, x, y)
    }

    this.stats.drawCalls++
  }

  /**
   * Draw sprite with source rectangle
   */
  drawSprite(
    image: HTMLImageElement | HTMLCanvasElement,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    dx: number,
    dy: number,
    dw: number,
    dh: number
  ): void {
    const { ctx } = this.context

    ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
    this.stats.drawCalls++
  }

  /**
   * Clear the entire canvas
   */
  clear(): void {
    const { ctx, width, height } = this.context
    ctx.clearRect(0, 0, width, height)
  }

  /**
   * Clear a specific area
   */
  clearArea(x: number, y: number, width: number, height: number): void {
    const { ctx } = this.context
    ctx.clearRect(x, y, width, height)
  }

  /**
   * Apply a filter effect
   */
  applyFilter(filter: string): void {
    this.context.ctx.filter = filter
  }

  /**
   * Reset filter
   */
  resetFilter(): void {
    this.context.ctx.filter = 'none'
  }

  /**
   * Save canvas state
   */
  save(): void {
    this.context.ctx.save()
  }

  /**
   * Restore canvas state
   */
  restore(): void {
    this.context.ctx.restore()
  }

  /**
   * Update FPS calculation
   */
  private updateFPS(): void {
    const now = performance.now()

    if (now - this.fpsUpdateTime >= 1000) {
      this.stats.fps = Math.round((this.frameCount * 1000) / (now - this.fpsUpdateTime))
      this.frameCount = 0
      this.fpsUpdateTime = now
    }

    this.frameCount++
    this.lastFrameTime = now
  }

  /**
   * Get rendering statistics
   */
  getStats(): RenderStats {
    return { ...this.stats }
  }

  /**
   * Get context
   */
  getContext(): RenderContext {
    return this.context
  }

  /**
   * Resize canvas
   */
  resize(width: number, height: number): void {
    const { canvas, pixelRatio } = this.context

    canvas.width = width * pixelRatio
    canvas.height = height * pixelRatio
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    this.context.width = canvas.width
    this.context.height = canvas.height

    this.setupCanvas()
  }

  /**
   * Set layer visibility
   */
  setLayerVisibility(layerId: string, visible: boolean): void {
    const layer = this.layers.get(layerId)
    if (layer) {
      layer.visible = visible
    }
  }

  /**
   * Set layer opacity
   */
  setLayerOpacity(layerId: string, opacity: number): void {
    const layer = this.layers.get(layerId)
    if (layer) {
      layer.opacity = Math.max(0, Math.min(1, opacity))
    }
  }

  /**
   * Set layer blend mode
   */
  setLayerBlendMode(layerId: string, blendMode: GlobalCompositeOperation): void {
    const layer = this.layers.get(layerId)
    if (layer) {
      layer.blendMode = blendMode
    }
  }

  /**
   * Get all layers
   */
  getLayers(): RenderLayer[] {
    return Array.from(this.layers.values())
  }

  /**
   * Clear all layers
   */
  clearAll(): void {
    this.layers.clear()
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<RenderConfig>): void {
    this.config = { ...this.config, ...config }
    this.setupCanvas()
  }

  /**
   * Get configuration
   */
  getConfig(): RenderConfig {
    return { ...this.config }
  }

  /**
   * Take screenshot
   */
  toDataURL(type: string = 'image/png', quality?: number): string {
    return this.context.canvas.toDataURL(type, quality)
  }

  /**
   * Export as blob
   */
  toBlob(callback: BlobCallback, type?: string, quality?: number): void {
    this.context.canvas.toBlob(callback, type, quality)
  }
}

export default RenderingEngine
