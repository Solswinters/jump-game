/**
 * HUD Manager - Heads-up display for game information
 */

export interface HUDElement {
  id: string
  type: 'text' | 'bar' | 'icon' | 'image' | 'custom'
  x: number
  y: number
  width?: number
  height?: number
  visible: boolean
  data: any
  render: (ctx: CanvasRenderingContext2D, data: any) => void
}

export interface HUDConfig {
  showScore: boolean
  showHealth: boolean
  showLives: boolean
  showTimer: boolean
  showCoins: boolean
  showCombo: boolean
  showFPS: boolean
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

export class HUDManager {
  private elements: Map<string, HUDElement> = new Map()
  private config: HUDConfig
  private canvasWidth: number
  private canvasHeight: number
  private visible: boolean = true

  constructor(config: HUDConfig, canvasWidth: number, canvasHeight: number) {
    this.config = config
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    this.initializeDefaultElements()
  }

  /**
   * Initialize default HUD elements
   */
  private initializeDefaultElements(): void {
    // Score display
    if (this.config.showScore) {
      this.addElement({
        id: 'score',
        type: 'text',
        x: 20,
        y: 40,
        visible: true,
        data: { value: 0, label: 'Score' },
        render: (ctx, data) => {
          ctx.font = 'bold 24px sans-serif'
          ctx.fillStyle = '#FFFFFF'
          ctx.strokeStyle = '#000000'
          ctx.lineWidth = 3
          ctx.strokeText(`${data.label}: ${data.value}`, data.x, data.y)
          ctx.fillText(`${data.label}: ${data.value}`, data.x, data.y)
        },
      })
    }

    // Health bar
    if (this.config.showHealth) {
      this.addElement({
        id: 'health',
        type: 'bar',
        x: 20,
        y: 70,
        width: 200,
        height: 20,
        visible: true,
        data: { current: 100, max: 100, label: 'Health' },
        render: (ctx, data) => {
          // Background
          ctx.fillStyle = '#333333'
          ctx.fillRect(data.x, data.y, data.width, data.height)

          // Health bar
          const percentage = data.current / data.max
          const barWidth = data.width * percentage

          ctx.fillStyle = percentage > 0.5 ? '#22C55E' : percentage > 0.25 ? '#F59E0B' : '#EF4444'
          ctx.fillRect(data.x, data.y, barWidth, data.height)

          // Border
          ctx.strokeStyle = '#FFFFFF'
          ctx.lineWidth = 2
          ctx.strokeRect(data.x, data.y, data.width, data.height)

          // Text
          ctx.font = '14px sans-serif'
          ctx.fillStyle = '#FFFFFF'
          ctx.textAlign = 'center'
          ctx.fillText(
            `${Math.ceil(data.current)}/${data.max}`,
            data.x + data.width / 2,
            data.y + data.height / 2 + 5
          )
          ctx.textAlign = 'left'
        },
      })
    }

    // Lives display
    if (this.config.showLives) {
      this.addElement({
        id: 'lives',
        type: 'icon',
        x: 20,
        y: 100,
        visible: true,
        data: { count: 3, icon: '❤️' },
        render: (ctx, data) => {
          ctx.font = '20px sans-serif'
          for (let i = 0; i < data.count; i++) {
            ctx.fillText(data.icon, data.x + i * 30, data.y)
          }
        },
      })
    }

    // Timer display
    if (this.config.showTimer) {
      this.addElement({
        id: 'timer',
        type: 'text',
        x: this.canvasWidth - 150,
        y: 40,
        visible: true,
        data: { time: 0, label: 'Time' },
        render: (ctx, data) => {
          const minutes = Math.floor(data.time / 60)
          const seconds = Math.floor(data.time % 60)
          const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`

          ctx.font = 'bold 24px sans-serif'
          ctx.fillStyle = '#FFFFFF'
          ctx.strokeStyle = '#000000'
          ctx.lineWidth = 3
          ctx.strokeText(`${data.label}: ${timeString}`, data.x, data.y)
          ctx.fillText(`${data.label}: ${timeString}`, data.x, data.y)
        },
      })
    }

    // Coins display
    if (this.config.showCoins) {
      this.addElement({
        id: 'coins',
        type: 'text',
        x: this.canvasWidth - 150,
        y: 70,
        visible: true,
        data: { count: 0, icon: '🪙' },
        render: (ctx, data) => {
          ctx.font = 'bold 20px sans-serif'
          ctx.fillStyle = '#FFFFFF'
          ctx.strokeStyle = '#000000'
          ctx.lineWidth = 2
          const text = `${data.icon} ${data.count}`
          ctx.strokeText(text, data.x, data.y)
          ctx.fillText(text, data.x, data.y)
        },
      })
    }

    // Combo display
    if (this.config.showCombo) {
      this.addElement({
        id: 'combo',
        type: 'text',
        x: this.canvasWidth / 2 - 50,
        y: 100,
        visible: false,
        data: { count: 0, multiplier: 1 },
        render: (ctx, data) => {
          if (data.count <= 0) return

          ctx.font = 'bold 32px sans-serif'
          ctx.fillStyle = '#FFD700'
          ctx.strokeStyle = '#FF6B00'
          ctx.lineWidth = 3
          const text = `x${data.multiplier} COMBO!`
          ctx.strokeText(text, data.x, data.y)
          ctx.fillText(text, data.x, data.y)
        },
      })
    }

    // FPS display
    if (this.config.showFPS) {
      this.addElement({
        id: 'fps',
        type: 'text',
        x: this.canvasWidth - 80,
        y: this.canvasHeight - 20,
        visible: true,
        data: { value: 0 },
        render: (ctx, data) => {
          ctx.font = '14px monospace'
          ctx.fillStyle = '#00FF00'
          ctx.fillText(`FPS: ${data.value}`, data.x, data.y)
        },
      })
    }
  }

  /**
   * Add HUD element
   */
  addElement(element: HUDElement): void {
    this.elements.set(element.id, element)
  }

  /**
   * Remove HUD element
   */
  removeElement(elementId: string): void {
    this.elements.delete(elementId)
  }

  /**
   * Get HUD element
   */
  getElement(elementId: string): HUDElement | undefined {
    return this.elements.get(elementId)
  }

  /**
   * Update HUD element data
   */
  updateElement(elementId: string, data: any): void {
    const element = this.elements.get(elementId)

    if (element) {
      element.data = { ...element.data, ...data }
    }
  }

  /**
   * Show/hide element
   */
  setElementVisibility(elementId: string, visible: boolean): void {
    const element = this.elements.get(elementId)

    if (element) {
      element.visible = visible
    }
  }

  /**
   * Update score
   */
  updateScore(score: number): void {
    this.updateElement('score', { value: score })
  }

  /**
   * Update health
   */
  updateHealth(current: number, max?: number): void {
    const data: any = { current }
    if (max !== undefined) {
      data.max = max
    }
    this.updateElement('health', data)
  }

  /**
   * Update lives
   */
  updateLives(lives: number): void {
    this.updateElement('lives', { count: lives })
  }

  /**
   * Update timer
   */
  updateTimer(seconds: number): void {
    this.updateElement('timer', { time: seconds })
  }

  /**
   * Update coins
   */
  updateCoins(coins: number): void {
    this.updateElement('coins', { count: coins })
  }

  /**
   * Update combo
   */
  updateCombo(count: number, multiplier: number): void {
    this.updateElement('combo', { count, multiplier })
    this.setElementVisibility('combo', count > 0)
  }

  /**
   * Update FPS
   */
  updateFPS(fps: number): void {
    this.updateElement('fps', { value: Math.round(fps) })
  }

  /**
   * Render all HUD elements
   */
  render(ctx: CanvasRenderingContext2D): void {
    if (!this.visible) {
      return
    }

    ctx.save()

    this.elements.forEach((element) => {
      if (!element.visible) {
        return
      }

      const data = {
        ...element.data,
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
      }

      element.render(ctx, data)
    })

    ctx.restore()
  }

  /**
   * Show HUD
   */
  show(): void {
    this.visible = true
  }

  /**
   * Hide HUD
   */
  hide(): void {
    this.visible = false
  }

  /**
   * Toggle HUD visibility
   */
  toggle(): void {
    this.visible = !this.visible
  }

  /**
   * Check if HUD is visible
   */
  isVisible(): boolean {
    return this.visible
  }

  /**
   * Get all elements
   */
  getAllElements(): HUDElement[] {
    return Array.from(this.elements.values())
  }

  /**
   * Clear all elements
   */
  clear(): void {
    this.elements.clear()
  }

  /**
   * Reset to default
   */
  reset(): void {
    this.clear()
    this.initializeDefaultElements()
  }

  /**
   * Set canvas size
   */
  setCanvasSize(width: number, height: number): void {
    this.canvasWidth = width
    this.canvasHeight = height

    // Update positions for right-aligned elements
    const timer = this.getElement('timer')
    if (timer) {
      timer.x = width - 150
    }

    const coins = this.getElement('coins')
    if (coins) {
      coins.x = width - 150
    }

    const fps = this.getElement('fps')
    if (fps) {
      fps.x = width - 80
      fps.y = height - 20
    }

    const combo = this.getElement('combo')
    if (combo) {
      combo.x = width / 2 - 50
    }
  }
}

export default HUDManager
