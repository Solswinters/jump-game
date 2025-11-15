/**
 * Particle effects system
 */

export interface Particle {
  id: string;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  alpha: number;
  gravity: number;
}

export type ParticleEffect = "explosion" | "jump" | "collect" | "death" | "trail";

export class ParticleSystem {
  private particles: Particle[] = [];
  private nextId = 0;

  /**
   * Create particle effect
   */
  createEffect(type: ParticleEffect, x: number, y: number, color: string = "#ffffff"): void {
    switch (type) {
      case "explosion":
        this.createExplosion(x, y, color);
        break;
      case "jump":
        this.createJumpEffect(x, y, color);
        break;
      case "collect":
        this.createCollectEffect(x, y, color);
        break;
      case "death":
        this.createDeathEffect(x, y, color);
        break;
      case "trail":
        this.createTrailEffect(x, y, color);
        break;
    }
  }

  /**
   * Create explosion particles
   */
  private createExplosion(x: number, y: number, color: string): void {
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 2 + Math.random() * 3;
      this.particles.push({
        id: `particle-${this.nextId++}`,
        x,
        y,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        life: 1,
        maxLife: 1,
        size: 3 + Math.random() * 3,
        color,
        alpha: 1,
        gravity: 0.1,
      });
    }
  }

  /**
   * Create jump effect particles
   */
  private createJumpEffect(x: number, y: number, color: string): void {
    for (let i = 0; i < 5; i++) {
      this.particles.push({
        id: `particle-${this.nextId++}`,
        x: x + Math.random() * 20,
        y: y + 20,
        velocityX: (Math.random() - 0.5) * 2,
        velocityY: Math.random() * 2,
        life: 1,
        maxLife: 1,
        size: 2 + Math.random() * 2,
        color,
        alpha: 1,
        gravity: 0.05,
      });
    }
  }

  /**
   * Create collect effect particles
   */
  private createCollectEffect(x: number, y: number, color: string): void {
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI * 2 * i) / 10;
      this.particles.push({
        id: `particle-${this.nextId++}`,
        x,
        y,
        velocityX: Math.cos(angle) * 3,
        velocityY: Math.sin(angle) * 3,
        life: 1,
        maxLife: 1,
        size: 4,
        color,
        alpha: 1,
        gravity: 0,
      });
    }
  }

  /**
   * Create death effect particles
   */
  private createDeathEffect(x: number, y: number, color: string): void {
    for (let i = 0; i < 30; i++) {
      this.particles.push({
        id: `particle-${this.nextId++}`,
        x,
        y,
        velocityX: (Math.random() - 0.5) * 10,
        velocityY: (Math.random() - 0.5) * 10,
        life: 1,
        maxLife: 1,
        size: 2 + Math.random() * 4,
        color,
        alpha: 1,
        gravity: 0.2,
      });
    }
  }

  /**
   * Create trail effect particle
   */
  private createTrailEffect(x: number, y: number, color: string): void {
    this.particles.push({
      id: `particle-${this.nextId++}`,
      x: x + Math.random() * 10,
      y: y + Math.random() * 10,
      velocityX: 0,
      velocityY: 0,
      life: 1,
      maxLife: 1,
      size: 3,
      color,
      alpha: 0.5,
      gravity: 0,
    });
  }

  /**
   * Update particles
   */
  update(deltaTime: number): void {
    this.particles = this.particles.filter((particle) => {
      // Update position
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;
      particle.velocityY += particle.gravity;

      // Update life
      particle.life -= deltaTime / 1000;
      particle.alpha = particle.life / particle.maxLife;

      return particle.life > 0;
    });
  }

  /**
   * Render particles to canvas
   */
  render(ctx: CanvasRenderingContext2D): void {
    this.particles.forEach((particle) => {
      ctx.save();
      ctx.globalAlpha = particle.alpha;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  /**
   * Get particle count
   */
  getCount(): number {
    return this.particles.length;
  }

  /**
   * Clear all particles
   */
  clear(): void {
    this.particles = [];
  }
}

