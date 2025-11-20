/**
 * Animation System - Handle sprite animations, tweening, and animation sequences
 */

export interface AnimationFrame {
  frameIndex: number
  duration: number
  offsetX?: number
  offsetY?: number
  flipX?: boolean
  flipY?: boolean
}

export interface Animation {
  id: string
  frames: AnimationFrame[]
  loop: boolean
  onComplete?: () => void
}

export interface AnimationState {
  animationId: string
  currentFrame: number
  elapsedTime: number
  isPlaying: boolean
  isPaused: boolean
  speed: number
}

export interface Tween {
  id: string
  target: any
  property: string
  from: number
  to: number
  duration: number
  elapsed: number
  easing: EasingFunction
  onUpdate?: (value: number) => void
  onComplete?: () => void
  isComplete: boolean
}

export type EasingFunction = (t: number) => number

export class AnimationSystem {
  private animations: Map<string, Animation> = new Map()
  private activeStates: Map<string, AnimationState> = new Map()
  private tweens: Map<string, Tween> = new Map()
  private nextTweenId: number = 0

  /**
   * Register an animation
   */
  registerAnimation(animation: Animation): void {
    this.animations.set(animation.id, animation)
  }

  /**
   * Play an animation
   */
  play(entityId: string, animationId: string, speed: number = 1): void {
    const animation = this.animations.get(animationId)

    if (!animation) {
      console.warn(`Animation "${animationId}" not found`)
      return
    }

    this.activeStates.set(entityId, {
      animationId,
      currentFrame: 0,
      elapsedTime: 0,
      isPlaying: true,
      isPaused: false,
      speed,
    })
  }

  /**
   * Stop an animation
   */
  stop(entityId: string): void {
    this.activeStates.delete(entityId)
  }

  /**
   * Pause an animation
   */
  pause(entityId: string): void {
    const state = this.activeStates.get(entityId)
    if (state) {
      state.isPaused = true
    }
  }

  /**
   * Resume an animation
   */
  resume(entityId: string): void {
    const state = this.activeStates.get(entityId)
    if (state) {
      state.isPaused = false
    }
  }

  /**
   * Set animation speed
   */
  setSpeed(entityId: string, speed: number): void {
    const state = this.activeStates.get(entityId)
    if (state) {
      state.speed = speed
    }
  }

  /**
   * Update all animations
   */
  update(deltaTime: number): void {
    // Update animations
    for (const [entityId, state] of this.activeStates.entries()) {
      if (!state.isPlaying || state.isPaused) {
        continue
      }

      this.updateAnimation(entityId, state, deltaTime)
    }

    // Update tweens
    for (const [id, tween] of this.tweens.entries()) {
      if (tween.isComplete) {
        continue
      }

      this.updateTween(tween, deltaTime)

      if (tween.isComplete) {
        this.tweens.delete(id)
      }
    }
  }

  /**
   * Update a single animation
   */
  private updateAnimation(entityId: string, state: AnimationState, deltaTime: number): void {
    const animation = this.animations.get(state.animationId)

    if (!animation) {
      this.activeStates.delete(entityId)
      return
    }

    const currentFrame = animation.frames[state.currentFrame]
    const frameDuration = currentFrame.duration / state.speed

    state.elapsedTime += deltaTime

    if (state.elapsedTime >= frameDuration) {
      state.elapsedTime -= frameDuration
      state.currentFrame++

      // Check if animation is complete
      if (state.currentFrame >= animation.frames.length) {
        if (animation.loop) {
          state.currentFrame = 0
        } else {
          state.isPlaying = false

          if (animation.onComplete) {
            animation.onComplete()
          }
        }
      }
    }
  }

  /**
   * Get current frame
   */
  getCurrentFrame(entityId: string): AnimationFrame | null {
    const state = this.activeStates.get(entityId)

    if (!state) {
      return null
    }

    const animation = this.animations.get(state.animationId)

    if (!animation) {
      return null
    }

    return animation.frames[state.currentFrame] || null
  }

  /**
   * Check if animation is playing
   */
  isPlaying(entityId: string): boolean {
    const state = this.activeStates.get(entityId)
    return state?.isPlaying || false
  }

  /**
   * Create a tween
   */
  tween(
    target: any,
    property: string,
    to: number,
    duration: number,
    options?: {
      from?: number
      easing?: EasingFunction
      onUpdate?: (value: number) => void
      onComplete?: () => void
    }
  ): string {
    const id = `tween-${this.nextTweenId++}`
    const from = options?.from !== undefined ? options.from : target[property]

    const tween: Tween = {
      id,
      target,
      property,
      from,
      to,
      duration,
      elapsed: 0,
      easing: options?.easing || this.easings.linear,
      onUpdate: options?.onUpdate,
      onComplete: options?.onComplete,
      isComplete: false,
    }

    this.tweens.set(id, tween)
    return id
  }

  /**
   * Update a tween
   */
  private updateTween(tween: Tween, deltaTime: number): void {
    tween.elapsed += deltaTime

    if (tween.elapsed >= tween.duration) {
      tween.elapsed = tween.duration
      tween.isComplete = true
    }

    const progress = Math.min(tween.elapsed / tween.duration, 1)
    const easedProgress = tween.easing(progress)
    const value = tween.from + (tween.to - tween.from) * easedProgress

    tween.target[tween.property] = value

    if (tween.onUpdate) {
      tween.onUpdate(value)
    }

    if (tween.isComplete && tween.onComplete) {
      tween.onComplete()
    }
  }

  /**
   * Cancel a tween
   */
  cancelTween(id: string): void {
    this.tweens.delete(id)
  }

  /**
   * Cancel all tweens for a target
   */
  cancelTweensFor(target: any): void {
    for (const [id, tween] of this.tweens.entries()) {
      if (tween.target === target) {
        this.tweens.delete(id)
      }
    }
  }

  /**
   * Easing functions
   */
  easings = {
    linear: (t: number): number => t,

    easeInQuad: (t: number): number => t * t,

    easeOutQuad: (t: number): number => t * (2 - t),

    easeInOutQuad: (t: number): number => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),

    easeInCubic: (t: number): number => t * t * t,

    easeOutCubic: (t: number): number => --t * t * t + 1,

    easeInOutCubic: (t: number): number =>
      t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

    easeInQuart: (t: number): number => t * t * t * t,

    easeOutQuart: (t: number): number => 1 - --t * t * t * t,

    easeInOutQuart: (t: number): number => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),

    easeInQuint: (t: number): number => t * t * t * t * t,

    easeOutQuint: (t: number): number => 1 + --t * t * t * t * t,

    easeInOutQuint: (t: number): number =>
      t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,

    easeInSine: (t: number): number => 1 - Math.cos((t * Math.PI) / 2),

    easeOutSine: (t: number): number => Math.sin((t * Math.PI) / 2),

    easeInOutSine: (t: number): number => -(Math.cos(Math.PI * t) - 1) / 2,

    easeInExpo: (t: number): number => (t === 0 ? 0 : Math.pow(2, 10 * t - 10)),

    easeOutExpo: (t: number): number => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),

    easeInOutExpo: (t: number): number =>
      t === 0
        ? 0
        : t === 1
          ? 1
          : t < 0.5
            ? Math.pow(2, 20 * t - 10) / 2
            : (2 - Math.pow(2, -20 * t + 10)) / 2,

    easeInCirc: (t: number): number => 1 - Math.sqrt(1 - Math.pow(t, 2)),

    easeOutCirc: (t: number): number => Math.sqrt(1 - Math.pow(t - 1, 2)),

    easeInOutCirc: (t: number): number =>
      t < 0.5
        ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2
        : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2,

    easeInElastic: (t: number): number => {
      const c4 = (2 * Math.PI) / 3
      return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4)
    },

    easeOutElastic: (t: number): number => {
      const c4 = (2 * Math.PI) / 3
      return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
    },

    easeInBounce: (t: number): number => 1 - this.easings.easeOutBounce(1 - t),

    easeOutBounce: (t: number): number => {
      const n1 = 7.5625
      const d1 = 2.75

      if (t < 1 / d1) {
        return n1 * t * t
      } else if (t < 2 / d1) {
        return n1 * (t -= 1.5 / d1) * t + 0.75
      } else if (t < 2.5 / d1) {
        return n1 * (t -= 2.25 / d1) * t + 0.9375
      } else {
        return n1 * (t -= 2.625 / d1) * t + 0.984375
      }
    },

    easeInOutBounce: (t: number): number =>
      t < 0.5
        ? (1 - this.easings.easeOutBounce(1 - 2 * t)) / 2
        : (1 + this.easings.easeOutBounce(2 * t - 1)) / 2,
  }

  /**
   * Create animation sequence
   */
  sequence(entityId: string, animationIds: string[], onComplete?: () => void): void {
    if (animationIds.length === 0) return

    let currentIndex = 0

    const playNext = () => {
      if (currentIndex >= animationIds.length) {
        if (onComplete) {
          onComplete()
        }
        return
      }

      const animationId = animationIds[currentIndex]
      const animation = this.animations.get(animationId)

      if (animation) {
        const originalOnComplete = animation.onComplete

        animation.onComplete = () => {
          if (originalOnComplete) {
            originalOnComplete()
          }

          currentIndex++
          playNext()
        }

        this.play(entityId, animationId)
      } else {
        currentIndex++
        playNext()
      }
    }

    playNext()
  }

  /**
   * Get all active animations
   */
  getActiveAnimations(): Map<string, AnimationState> {
    return new Map(this.activeStates)
  }

  /**
   * Get all active tweens
   */
  getActiveTweens(): Map<string, Tween> {
    return new Map(this.tweens)
  }

  /**
   * Clear all animations
   */
  clear(): void {
    this.activeStates.clear()
    this.tweens.clear()
  }

  /**
   * Clear all tweens
   */
  clearTweens(): void {
    this.tweens.clear()
  }
}

export default AnimationSystem
