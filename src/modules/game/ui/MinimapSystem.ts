/**
 * Minimap System - Real-time miniature map for navigation
 * FEATURE: Gameplay enhancement for better spatial awareness
 */

export interface MinimapConfig {
  width: number
  height: number
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  scale: number
  padding: number
  backgroundColor: string
  borderColor: string
  borderWidth: number
  opacity: number
  showGrid: boolean
  gridColor: string
  gridSpacing: number
  showFog: boolean
  fogColor: string
  updateInterval: number
}

export interface MinimapObject {
  id: string
  type: 'player' | 'enemy' | 'obstacle' | 'powerup' | 'checkpoint' | 'custom'
  x: number
  y: number
  width?: number
  height?: number
  color: string
  icon?: string
  visible: boolean
  pulsate?: boolean
  label?: string
}

export interface MinimapViewport {
  x: number
  y: number
  width: number
  height: number
  rotation: number
}

export class MinimapSystem {
  private config: MinimapConfig
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private objects: Map<string, MinimapObject> = new Map()
  private viewport: MinimapViewport
  private worldBounds: { width: number; height: number }
  private lastUpdate: number = 0
  private visible: boolean = true
  private dragStartPos: { x: number; y: number } | null = null
  private isDragging: boolean = false
  private exploredAreas: Set<string> = new Set()
  private icons: Map<string, HTMLImageElement> = new Map()

  constructor(config: Partial<MinimapConfig>, worldBounds: { width: number; height: number }) {
    this.config = {
      width: config.width || 200,
      height: config.height || 200,
      position: config.position || 'top-right',
      scale: config.scale || 0.1,
      padding: config.padding || 10,
      backgroundColor: config.backgroundColor || 'rgba(0, 0, 0, 0.8)',
      borderColor: config.borderColor || '#ffffff',
      borderWidth: config.borderWidth || 2,
      opacity: config.opacity || 0.9,
      showGrid: config.showGrid !== undefined ? config.showGrid : true,
      gridColor: config.gridColor || 'rgba(255, 255, 255, 0.2)',
      gridSpacing: config.gridSpacing || 50,
      showFog: config.showFog !== undefined ? config.showFog : false,
      fogColor: config.fogColor || 'rgba(0, 0, 0, 0.5)',
      updateInterval: config.updateInterval || 16, // ~60fps
    }

    this.worldBounds = worldBounds
    this.canvas = this.createCanvas()
    this.ctx = this.canvas.getContext('2d')!

    this.viewport = {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      rotation: 0,
    }

    this.setupEventListeners()
  }

  /**
   * Create canvas element
   */
  private createCanvas(): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.width = this.config.width
    canvas.height = this.config.height
    canvas.style.position = 'fixed'
    canvas.style.zIndex = '1000'
    canvas.style.opacity = this.config.opacity.toString()
    canvas.style.cursor = 'pointer'

    // Position based on config
    const pos = this.config.position
    const padding = this.config.padding + 'px'

    if (pos.includes('top')) canvas.style.top = padding
    if (pos.includes('bottom')) canvas.style.bottom = padding
    if (pos.includes('left')) canvas.style.left = padding
    if (pos.includes('right')) canvas.style.right = padding

    document.body.appendChild(canvas)

    return canvas
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Mouse events for dragging
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this))
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this))
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this))
    this.canvas.addEventListener('mouseleave', this.handleMouseUp.bind(this))

    // Click to navigate
    this.canvas.addEventListener('click', this.handleClick.bind(this))

    // Touch events for mobile
    this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this))
    this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this))
    this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this))
  }

  /**
   * Handle mouse down
   */
  private handleMouseDown(event: MouseEvent): void {
    this.dragStartPos = {
      x: event.clientX,
      y: event.clientY,
    }
    this.isDragging = true
  }

  /**
   * Handle mouse move
   */
  private handleMouseMove(event: MouseEvent): void {
    if (!this.isDragging || !this.dragStartPos) return

    // Could implement dragging to move viewport
    // For now, just update cursor
    this.canvas.style.cursor = 'grabbing'
  }

  /**
   * Handle mouse up
   */
  private handleMouseUp(): void {
    this.isDragging = false
    this.dragStartPos = null
    this.canvas.style.cursor = 'pointer'
  }

  /**
   * Handle click
   */
  private handleClick(event: MouseEvent): void {
    if (this.isDragging) return

    const rect = this.canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Convert minimap coordinates to world coordinates
    const worldX = (x / this.config.width) * this.worldBounds.width
    const worldY = (y / this.config.height) * this.worldBounds.height

    // Emit event for viewport navigation
    this.emitNavigationEvent(worldX, worldY)
  }

  /**
   * Handle touch events
   */
  private handleTouchStart(event: TouchEvent): void {
    event.preventDefault()
    const touch = event.touches[0]
    this.handleMouseDown({ clientX: touch.clientX, clientY: touch.clientY } as MouseEvent)
  }

  private handleTouchMove(event: TouchEvent): void {
    event.preventDefault()
    const touch = event.touches[0]
    this.handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY } as MouseEvent)
  }

  private handleTouchEnd(event: TouchEvent): void {
    event.preventDefault()
    this.handleMouseUp()
  }

  /**
   * Emit navigation event
   */
  private emitNavigationEvent(worldX: number, worldY: number): void {
    const event = new CustomEvent('minimap:navigate', {
      detail: { worldX, worldY },
    })
    window.dispatchEvent(event)
  }

  /**
   * Add object to minimap
   */
  addObject(object: MinimapObject): void {
    this.objects.set(object.id, object)
  }

  /**
   * Remove object from minimap
   */
  removeObject(id: string): void {
    this.objects.delete(id)
  }

  /**
   * Update object position
   */
  updateObject(id: string, updates: Partial<MinimapObject>): void {
    const object = this.objects.get(id)
    if (object) {
      Object.assign(object, updates)
    }
  }

  /**
   * Set viewport
   */
  setViewport(viewport: Partial<MinimapViewport>): void {
    Object.assign(this.viewport, viewport)
  }

  /**
   * Update minimap
   */
  update(deltaTime: number): void {
    const now = Date.now()
    if (now - this.lastUpdate < this.config.updateInterval) {
      return
    }
    this.lastUpdate = now

    if (!this.visible) return

    this.render()
  }

  /**
   * Render minimap
   */
  private render(): void {
    const ctx = this.ctx
    const width = this.config.width
    const height = this.config.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw background
    ctx.fillStyle = this.config.backgroundColor
    ctx.fillRect(0, 0, width, height)

    // Draw grid
    if (this.config.showGrid) {
      this.drawGrid()
    }

    // Draw fog of war
    if (this.config.showFog) {
      this.drawFog()
    }

    // Draw objects
    this.drawObjects()

    // Draw viewport indicator
    this.drawViewport()

    // Draw border
    ctx.strokeStyle = this.config.borderColor
    ctx.lineWidth = this.config.borderWidth
    ctx.strokeRect(0, 0, width, height)
  }

  /**
   * Draw grid
   */
  private drawGrid(): void {
    const ctx = this.ctx
    const spacing = this.config.gridSpacing * this.config.scale

    ctx.strokeStyle = this.config.gridColor
    ctx.lineWidth = 1

    // Vertical lines
    for (let x = 0; x < this.config.width; x += spacing) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, this.config.height)
      ctx.stroke()
    }

    // Horizontal lines
    for (let y = 0; y < this.config.height; y += spacing) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(this.config.width, y)
      ctx.stroke()
    }
  }

  /**
   * Draw fog of war
   */
  private drawFog(): void {
    const ctx = this.ctx

    // Draw fog over unexplored areas
    ctx.fillStyle = this.config.fogColor

    for (let x = 0; x < this.worldBounds.width; x += 50) {
      for (let y = 0; y < this.worldBounds.height; y += 50) {
        const key = `${Math.floor(x / 50)},${Math.floor(y / 50)}`
        if (!this.exploredAreas.has(key)) {
          const screenX = (x / this.worldBounds.width) * this.config.width
          const screenY = (y / this.worldBounds.height) * this.config.height
          const size = (50 / this.worldBounds.width) * this.config.width

          ctx.fillRect(screenX, screenY, size, size)
        }
      }
    }
  }

  /**
   * Draw objects
   */
  private drawObjects(): void {
    const ctx = this.ctx

    for (const object of this.objects.values()) {
      if (!object.visible) continue

      const screenX = (object.x / this.worldBounds.width) * this.config.width
      const screenY = (object.y / this.worldBounds.height) * this.config.height

      // Draw pulsating effect
      if (object.pulsate) {
        const pulse = Math.sin(Date.now() / 200) * 0.3 + 0.7
        ctx.globalAlpha = pulse
      }

      ctx.fillStyle = object.color

      // Draw based on type
      if (object.icon && this.icons.has(object.icon)) {
        const icon = this.icons.get(object.icon)!
        const size = 8
        ctx.drawImage(icon, screenX - size / 2, screenY - size / 2, size, size)
      } else {
        // Default: draw as circle or rectangle
        if (object.width && object.height) {
          const w = (object.width / this.worldBounds.width) * this.config.width
          const h = (object.height / this.worldBounds.height) * this.config.height
          ctx.fillRect(screenX - w / 2, screenY - h / 2, w, h)
        } else {
          const radius = 3
          ctx.beginPath()
          ctx.arc(screenX, screenY, radius, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Draw label
      if (object.label) {
        ctx.fillStyle = '#ffffff'
        ctx.font = '10px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(object.label, screenX, screenY - 10)
      }

      ctx.globalAlpha = 1
    }
  }

  /**
   * Draw viewport indicator
   */
  private drawViewport(): void {
    const ctx = this.ctx

    const x = (this.viewport.x / this.worldBounds.width) * this.config.width
    const y = (this.viewport.y / this.worldBounds.height) * this.config.height
    const w = (this.viewport.width / this.worldBounds.width) * this.config.width
    const h = (this.viewport.height / this.worldBounds.height) * this.config.height

    ctx.strokeStyle = '#00ff00'
    ctx.lineWidth = 2
    ctx.strokeRect(x, y, w, h)
  }

  /**
   * Reveal area (for fog of war)
   */
  revealArea(x: number, y: number, radius: number = 100): void {
    const gridX = Math.floor(x / 50)
    const gridY = Math.floor(y / 50)
    const gridRadius = Math.ceil(radius / 50)

    for (let dx = -gridRadius; dx <= gridRadius; dx++) {
      for (let dy = -gridRadius; dy <= gridRadius; dy++) {
        if (dx * dx + dy * dy <= gridRadius * gridRadius) {
          const key = `${gridX + dx},${gridY + dy}`
          this.exploredAreas.add(key)
        }
      }
    }
  }

  /**
   * Load icon
   */
  loadIcon(name: string, src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        this.icons.set(name, img)
        resolve()
      }
      img.onerror = reject
      img.src = src
    })
  }

  /**
   * Show/hide minimap
   */
  setVisible(visible: boolean): void {
    this.visible = visible
    this.canvas.style.display = visible ? 'block' : 'none'
  }

  /**
   * Toggle minimap
   */
  toggle(): void {
    this.setVisible(!this.visible)
  }

  /**
   * Set opacity
   */
  setOpacity(opacity: number): void {
    this.config.opacity = opacity
    this.canvas.style.opacity = opacity.toString()
  }

  /**
   * Resize minimap
   */
  resize(width: number, height: number): void {
    this.config.width = width
    this.config.height = height
    this.canvas.width = width
    this.canvas.height = height
  }

  /**
   * Clear all objects
   */
  clear(): void {
    this.objects.clear()
  }

  /**
   * Get objects in area
   */
  getObjectsInArea(x: number, y: number, radius: number): MinimapObject[] {
    const result: MinimapObject[] = []

    for (const object of this.objects.values()) {
      const dx = object.x - x
      const dy = object.y - y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance <= radius) {
        result.push(object)
      }
    }

    return result
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.canvas.remove()
    this.objects.clear()
    this.icons.clear()
  }
}

export default MinimapSystem
