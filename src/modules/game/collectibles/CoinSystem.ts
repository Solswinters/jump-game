/**
 * Coin System - Collectible coins with magnets and bonuses
 */

export interface Coin {
  id: string
  x: number
  y: number
  value: number
  type: 'bronze' | 'silver' | 'gold' | 'special'
  radius: number
  collected: boolean
  magnetized: boolean
  velocityX: number
  velocityY: number
}

export class CoinSystem {
  private coins: Coin[] = []
  private nextCoinId: number = 0
  private totalCoinsCollected: number = 0
  private totalValue: number = 0
  private magnetRadius: number = 100
  private magnetStrength: number = 0.5

  /**
   * Spawn coin
   */
  spawnCoin(x: number, y: number, type: 'bronze' | 'silver' | 'gold' | 'special' = 'bronze'): void {
    const coin: Coin = {
      id: `coin-${this.nextCoinId++}`,
      x,
      y,
      value: this.getCoinValue(type),
      type,
      radius: this.getCoinRadius(type),
      collected: false,
      magnetized: false,
      velocityX: 0,
      velocityY: 0,
    }

    this.coins.push(coin)
  }

  /**
   * Get coin value by type
   */
  private getCoinValue(type: string): number {
    switch (type) {
      case 'bronze':
        return 1
      case 'silver':
        return 5
      case 'gold':
        return 10
      case 'special':
        return 50
      default:
        return 1
    }
  }

  /**
   * Get coin radius by type
   */
  private getCoinRadius(type: string): number {
    switch (type) {
      case 'bronze':
        return 10
      case 'silver':
        return 12
      case 'gold':
        return 15
      case 'special':
        return 20
      default:
        return 10
    }
  }

  /**
   * Update coins
   */
  update(deltaTime: number, playerX: number, playerY: number, gameSpeed: number): void {
    for (let i = this.coins.length - 1; i >= 0; i--) {
      const coin = this.coins[i]

      if (coin.collected) continue

      // Move with game speed
      coin.x -= gameSpeed * deltaTime * 0.06

      // Check for magnet effect
      const dx = playerX - coin.x
      const dy = playerY - coin.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < this.magnetRadius) {
        coin.magnetized = true
        const angle = Math.atan2(dy, dx)
        coin.velocityX = Math.cos(angle) * this.magnetStrength * deltaTime
        coin.velocityY = Math.sin(angle) * this.magnetStrength * deltaTime
      }

      // Apply magnet velocity
      if (coin.magnetized) {
        coin.x += coin.velocityX
        coin.y += coin.velocityY
      }

      // Remove off-screen coins
      if (coin.x < -50) {
        this.coins.splice(i, 1)
      }
    }
  }

  /**
   * Collect coin
   */
  collectCoin(coinId: string): number {
    const coin = this.coins.find((c) => c.id === coinId)

    if (!coin || coin.collected) return 0

    coin.collected = true
    this.totalCoinsCollected++
    this.totalValue += coin.value

    // Remove from array
    const index = this.coins.indexOf(coin)
    if (index > -1) {
      this.coins.splice(index, 1)
    }

    return coin.value
  }

  /**
   * Check collision with player
   */
  checkCollisions(playerX: number, playerY: number, playerRadius: number): Coin[] {
    const collected: Coin[] = []

    for (const coin of this.coins) {
      if (coin.collected) continue

      const dx = playerX - coin.x
      const dy = playerY - coin.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < playerRadius + coin.radius) {
        this.collectCoin(coin.id)
        collected.push(coin)
      }
    }

    return collected
  }

  /**
   * Render coins
   */
  render(ctx: CanvasRenderingContext2D): void {
    for (const coin of this.coins) {
      if (coin.collected) continue

      const colors = {
        bronze: '#CD7F32',
        silver: '#C0C0C0',
        gold: '#FFD700',
        special: '#FF1493',
      }

      // Draw coin
      ctx.beginPath()
      ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2)
      ctx.fillStyle = colors[coin.type]
      ctx.fill()
      ctx.strokeStyle = '#FFFFFF'
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw value
      if (coin.type === 'special') {
        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 12px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('★', coin.x, coin.y + 4)
      }
    }
  }

  /**
   * Get coins
   */
  getCoins(): Coin[] {
    return this.coins.filter((c) => !c.collected)
  }

  /**
   * Get total collected
   */
  getTotalCollected(): number {
    return this.totalCoinsCollected
  }

  /**
   * Get total value
   */
  getTotalValue(): number {
    return this.totalValue
  }

  /**
   * Set magnet radius
   */
  setMagnetRadius(radius: number): void {
    this.magnetRadius = radius
  }

  /**
   * Get magnet radius
   */
  getMagnetRadius(): number {
    return this.magnetRadius
  }

  /**
   * Set magnet strength
   */
  setMagnetStrength(strength: number): void {
    this.magnetStrength = strength
  }

  /**
   * Clear all coins
   */
  clear(): void {
    this.coins = []
  }

  /**
   * Reset statistics
   */
  reset(): void {
    this.coins = []
    this.totalCoinsCollected = 0
    this.totalValue = 0
  }
}

export default CoinSystem
