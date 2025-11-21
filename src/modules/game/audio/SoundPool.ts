/**
 * Sound Pool - Audio pooling for performance optimization
 * Reduces memory usage and prevents audio lag through object pooling
 */

export interface SoundPoolConfig {
  maxSounds: number
  preloadCount?: number
}

export interface PooledSound {
  audio: HTMLAudioElement
  isPlaying: boolean
  volume: number
  loop: boolean
}

export class SoundPool {
  private pool: Map<string, PooledSound[]> = new Map()
  private config: SoundPoolConfig

  constructor(config: SoundPoolConfig = { maxSounds: 10 }) {
    this.config = {
      maxSounds: config.maxSounds,
      preloadCount: config.preloadCount || 3,
    }
  }

  /**
   * Preload sounds into the pool
   */
  public async preload(soundId: string, src: string): Promise<void> {
    if (this.pool.has(soundId)) {
      return // Already preloaded
    }

    const sounds: PooledSound[] = []

    for (let i = 0; i < (this.config.preloadCount || 3); i++) {
      const audio = new Audio(src)
      audio.preload = 'auto'

      sounds.push({
        audio,
        isPlaying: false,
        volume: 1,
        loop: false,
      })
    }

    this.pool.set(soundId, sounds)

    // Wait for all to load
    await Promise.all(
      sounds.map(
        (sound) =>
          new Promise<void>((resolve) => {
            sound.audio.addEventListener('canplaythrough', () => resolve(), {
              once: true,
            })
          })
      )
    )
  }

  /**
   * Play a sound from the pool
   */
  public play(
    soundId: string,
    options: { volume?: number; loop?: boolean } = {}
  ): PooledSound | null {
    const sounds = this.pool.get(soundId)

    if (!sounds) {
      console.warn(`Sound ${soundId} not preloaded`)
      return null
    }

    // Find available sound
    let sound = sounds.find((s) => !s.isPlaying)

    // If all busy and can expand pool, create new
    if (!sound && sounds.length < this.config.maxSounds) {
      const newAudio = new Audio(sounds[0].audio.src)
      sound = {
        audio: newAudio,
        isPlaying: false,
        volume: options.volume ?? 1,
        loop: options.loop ?? false,
      }
      sounds.push(sound)
    }

    // If still no sound, stop oldest and reuse
    if (!sound) {
      sound = sounds[0]
      sound.audio.pause()
      sound.audio.currentTime = 0
    }

    // Configure and play
    sound.volume = options.volume ?? 1
    sound.loop = options.loop ?? false
    sound.audio.volume = sound.volume
    sound.audio.loop = sound.loop

    sound.audio.currentTime = 0
    sound.isPlaying = true

    sound.audio.play().catch((error) => {
      console.error(`Failed to play sound ${soundId}:`, error)
      sound!.isPlaying = false
    })

    // Mark as not playing when ended
    sound.audio.addEventListener(
      'ended',
      () => {
        sound!.isPlaying = false
      },
      { once: true }
    )

    return sound
  }

  /**
   * Stop a specific sound
   */
  public stop(soundId: string): void {
    const sounds = this.pool.get(soundId)
    if (!sounds) return

    for (const sound of sounds) {
      if (sound.isPlaying) {
        sound.audio.pause()
        sound.audio.currentTime = 0
        sound.isPlaying = false
      }
    }
  }

  /**
   * Stop all sounds
   */
  public stopAll(): void {
    for (const sounds of this.pool.values()) {
      for (const sound of sounds) {
        if (sound.isPlaying) {
          sound.audio.pause()
          sound.audio.currentTime = 0
          sound.isPlaying = false
        }
      }
    }
  }

  /**
   * Set volume for a sound type
   */
  public setVolume(soundId: string, volume: number): void {
    const sounds = this.pool.get(soundId)
    if (!sounds) return

    for (const sound of sounds) {
      sound.volume = volume
      sound.audio.volume = volume
    }
  }

  /**
   * Set volume for all sounds
   */
  public setMasterVolume(volume: number): void {
    for (const sounds of this.pool.values()) {
      for (const sound of sounds) {
        sound.volume = volume
        sound.audio.volume = volume
      }
    }
  }

  /**
   * Get number of active sounds
   */
  public getActiveSoundsCount(soundId?: string): number {
    if (soundId) {
      const sounds = this.pool.get(soundId)
      return sounds ? sounds.filter((s) => s.isPlaying).length : 0
    }

    let count = 0
    for (const sounds of this.pool.values()) {
      count += sounds.filter((s) => s.isPlaying).length
    }
    return count
  }

  /**
   * Get pool statistics
   */
  public getStats(): {
    totalSounds: number
    activeSounds: number
    pooledSoundTypes: number
  } {
    let totalSounds = 0
    let activeSounds = 0

    for (const sounds of this.pool.values()) {
      totalSounds += sounds.length
      activeSounds += sounds.filter((s) => s.isPlaying).length
    }

    return {
      totalSounds,
      activeSounds,
      pooledSoundTypes: this.pool.size,
    }
  }

  /**
   * Clear specific sound from pool
   */
  public clear(soundId: string): void {
    const sounds = this.pool.get(soundId)
    if (!sounds) return

    for (const sound of sounds) {
      sound.audio.pause()
      sound.audio.src = ''
    }

    this.pool.delete(soundId)
  }

  /**
   * Clear all sounds from pool
   */
  public clearAll(): void {
    for (const sounds of this.pool.values()) {
      for (const sound of sounds) {
        sound.audio.pause()
        sound.audio.src = ''
      }
    }

    this.pool.clear()
  }

  /**
   * Check if sound is loaded
   */
  public isLoaded(soundId: string): boolean {
    return this.pool.has(soundId)
  }

  /**
   * Get all loaded sound IDs
   */
  public getLoadedSounds(): string[] {
    return Array.from(this.pool.keys())
  }
}

export default SoundPool
