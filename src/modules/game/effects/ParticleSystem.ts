/**
 * Particle System for visual effects
 */

export interface Particle {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
  alpha: number
}

export interface ParticleSystemConfig {
  maxParticles: number
  emissionRate: number
  particleLife: number
  particleSize: number
  gravity: number
  friction: number
}

export class ParticleSystem {
  private particles: Particle[] = []
  private config: ParticleSystemConfig
  private nextId = 0
  private timeSinceLastEmission = 0

  constructor(config: Partial<ParticleSystemConfig> = {}) {
    this.config = {
      maxParticles: 1000,
      emissionRate: 10,
      particleLife: 2000,
      particleSize: 4,
      gravity: 0.2,
      friction: 0.98,
      ...config,
    }
  }

  emit(x: number, y: number, count: number, options: Partial<Particle> = {}): void {
    for (let i = 0; i < count && this.particles.length < this.config.maxParticles; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 2 + Math.random() * 3

      this.particles.push({
        id: `particle-${this.nextId++}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: this.config.particleLife,
        maxLife: this.config.particleLife,
        size: this.config.particleSize,
        color: '#ffffff',
        alpha: 1,
        ...options,
      })
    }
  }

  update(deltaTime: number): void {
    this.timeSinceLastEmission += deltaTime

    this.particles = this.particles.filter((particle) => {
      // Update velocity
      particle.vy += (this.config.gravity * deltaTime) / 16
      particle.vx *= this.config.friction
      particle.vy *= this.config.friction

      // Update position
      particle.x += particle.vx
      particle.y += particle.vy

      // Update life
      particle.life -= deltaTime
      particle.alpha = particle.life / particle.maxLife

      return particle.life > 0
    })
  }

  render(ctx: CanvasRenderingContext2D): void {
    this.particles.forEach((particle) => {
      ctx.save()
      ctx.globalAlpha = particle.alpha
      ctx.fillStyle = particle.color
      ctx.fillRect(
        particle.x - particle.size / 2,
        particle.y - particle.size / 2,
        particle.size,
        particle.size
      )
      ctx.restore()
    })
  }

  clear(): void {
    this.particles = []
  }

  getParticleCount(): number {
    return this.particles.length
  }
}
