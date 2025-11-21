/**
 * Sound and audio utilities for game
 * Provides audio playback, management, and effects
 */

export interface SoundOptions {
  volume?: number
  loop?: boolean
  playbackRate?: number
  fadeIn?: number
  fadeOut?: number
}

export interface Sound {
  id: string
  audio: HTMLAudioElement
  isPlaying: boolean
  volume: number
}

export class GameSoundUtils {
  private static sounds: Map<string, Sound> = new Map()
  private static masterVolume = 1.0
  private static musicVolume = 0.7
  private static sfxVolume = 0.9
  private static muted = false
  private static audioContext: AudioContext | null = null

  /**
   * Initialize audio context
   */
  static initialize(): void {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      this.audioContext = new AudioContext()
    }
  }

  /**
   * Load sound
   */
  static loadSound(id: string, url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(url)

      audio.addEventListener('canplaythrough', () => {
        this.sounds.set(id, {
          id,
          audio,
          isPlaying: false,
          volume: 1.0,
        })
        resolve()
      })

      audio.addEventListener('error', (error) => {
        reject(new Error(`Failed to load sound: ${id}`))
      })

      audio.load()
    })
  }

  /**
   * Play sound
   */
  static play(id: string, options: SoundOptions = {}): void {
    const sound = this.sounds.get(id)
    if (!sound || this.muted) return

    const { volume = 1.0, loop = false, playbackRate = 1.0, fadeIn = 0 } = options

    sound.audio.volume = this.masterVolume * this.sfxVolume * volume
    sound.audio.loop = loop
    sound.audio.playbackRate = playbackRate

    if (fadeIn > 0) {
      this.fadeInSound(sound, fadeIn, volume)
    }

    sound.audio.currentTime = 0
    sound.audio.play().catch((error) => {
      console.error(`Failed to play sound ${id}:`, error)
    })

    sound.isPlaying = true
  }

  /**
   * Stop sound
   */
  static stop(id: string, fadeOut: number = 0): void {
    const sound = this.sounds.get(id)
    if (!sound) return

    if (fadeOut > 0) {
      this.fadeOutSound(sound, fadeOut, () => {
        sound.audio.pause()
        sound.audio.currentTime = 0
        sound.isPlaying = false
      })
    } else {
      sound.audio.pause()
      sound.audio.currentTime = 0
      sound.isPlaying = false
    }
  }

  /**
   * Pause sound
   */
  static pause(id: string): void {
    const sound = this.sounds.get(id)
    if (!sound) return

    sound.audio.pause()
    sound.isPlaying = false
  }

  /**
   * Resume sound
   */
  static resume(id: string): void {
    const sound = this.sounds.get(id)
    if (!sound || this.muted) return

    sound.audio.play().catch((error) => {
      console.error(`Failed to resume sound ${id}:`, error)
    })

    sound.isPlaying = true
  }

  /**
   * Set sound volume
   */
  static setVolume(id: string, volume: number): void {
    const sound = this.sounds.get(id)
    if (!sound) return

    sound.volume = Math.max(0, Math.min(1, volume))
    sound.audio.volume = this.masterVolume * this.sfxVolume * sound.volume
  }

  /**
   * Set master volume
   */
  static setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume))
    this.updateAllVolumes()
  }

  /**
   * Set music volume
   */
  static setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume))
    this.updateAllVolumes()
  }

  /**
   * Set SFX volume
   */
  static setSFXVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume))
    this.updateAllVolumes()
  }

  /**
   * Mute all sounds
   */
  static mute(): void {
    this.muted = true
    this.sounds.forEach((sound) => {
      sound.audio.muted = true
    })
  }

  /**
   * Unmute all sounds
   */
  static unmute(): void {
    this.muted = false
    this.sounds.forEach((sound) => {
      sound.audio.muted = false
    })
  }

  /**
   * Toggle mute
   */
  static toggleMute(): void {
    if (this.muted) {
      this.unmute()
    } else {
      this.mute()
    }
  }

  /**
   * Check if sound is playing
   */
  static isPlaying(id: string): boolean {
    const sound = this.sounds.get(id)
    return sound ? sound.isPlaying : false
  }

  /**
   * Get sound duration
   */
  static getDuration(id: string): number {
    const sound = this.sounds.get(id)
    return sound ? sound.audio.duration : 0
  }

  /**
   * Get sound current time
   */
  static getCurrentTime(id: string): number {
    const sound = this.sounds.get(id)
    return sound ? sound.audio.currentTime : 0
  }

  /**
   * Seek to time
   */
  static seek(id: string, time: number): void {
    const sound = this.sounds.get(id)
    if (!sound) return

    sound.audio.currentTime = Math.max(0, Math.min(sound.audio.duration, time))
  }

  /**
   * Fade in sound
   */
  private static fadeInSound(sound: Sound, duration: number, targetVolume: number): void {
    const startVolume = 0
    const startTime = Date.now()

    sound.audio.volume = 0

    const fade = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      sound.audio.volume =
        this.masterVolume * this.sfxVolume * (startVolume + (targetVolume - startVolume) * progress)

      if (progress < 1) {
        requestAnimationFrame(fade)
      }
    }

    fade()
  }

  /**
   * Fade out sound
   */
  private static fadeOutSound(sound: Sound, duration: number, onComplete?: () => void): void {
    const startVolume = sound.audio.volume
    const startTime = Date.now()

    const fade = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      sound.audio.volume = startVolume * (1 - progress)

      if (progress < 1) {
        requestAnimationFrame(fade)
      } else {
        onComplete?.()
      }
    }

    fade()
  }

  /**
   * Update all sound volumes
   */
  private static updateAllVolumes(): void {
    this.sounds.forEach((sound) => {
      sound.audio.volume = this.masterVolume * this.sfxVolume * sound.volume
    })
  }

  /**
   * Stop all sounds
   */
  static stopAll(): void {
    this.sounds.forEach((sound) => {
      sound.audio.pause()
      sound.audio.currentTime = 0
      sound.isPlaying = false
    })
  }

  /**
   * Preload sounds
   */
  static async preloadSounds(sounds: Array<{ id: string; url: string }>): Promise<void> {
    const promises = sounds.map((sound) => this.loadSound(sound.id, sound.url))
    await Promise.all(promises)
  }

  /**
   * Unload sound
   */
  static unloadSound(id: string): void {
    const sound = this.sounds.get(id)
    if (!sound) return

    sound.audio.pause()
    sound.audio.src = ''
    this.sounds.delete(id)
  }

  /**
   * Unload all sounds
   */
  static unloadAll(): void {
    this.sounds.forEach((sound, id) => {
      this.unloadSound(id)
    })
    this.sounds.clear()
  }

  /**
   * Create sound sprite
   */
  static createSprite(
    id: string,
    url: string,
    sprites: Record<string, { start: number; duration: number }>
  ): void {
    this.loadSound(id, url).then(() => {
      Object.entries(sprites).forEach(([name, sprite]) => {
        const spriteId = `${id}_${name}`
        const sound = this.sounds.get(id)

        if (sound) {
          // Create a reference to the main sound with sprite data
          this.sounds.set(spriteId, {
            id: spriteId,
            audio: sound.audio.cloneNode() as HTMLAudioElement,
            isPlaying: false,
            volume: 1.0,
          })
        }
      })
    })
  }

  /**
   * Play sound sprite
   */
  static playSprite(baseId: string, spriteName: string, options: SoundOptions = {}): void {
    const spriteId = `${baseId}_${spriteName}`
    this.play(spriteId, options)
  }

  /**
   * Get loaded sounds count
   */
  static getLoadedCount(): number {
    return this.sounds.size
  }

  /**
   * Check if sound is loaded
   */
  static isLoaded(id: string): boolean {
    return this.sounds.has(id)
  }

  /**
   * Get master volume
   */
  static getMasterVolume(): number {
    return this.masterVolume
  }

  /**
   * Get music volume
   */
  static getMusicVolume(): number {
    return this.musicVolume
  }

  /**
   * Get SFX volume
   */
  static getSFXVolume(): number {
    return this.sfxVolume
  }

  /**
   * Check if muted
   */
  static isMuted(): boolean {
    return this.muted
  }

  /**
   * Create sound pool for reusing audio instances
   */
  static createSoundPool(id: string, size: number = 5): void {
    const baseSound = this.sounds.get(id)
    if (!baseSound) return

    for (let i = 0; i < size; i++) {
      const poolId = `${id}_pool_${i}`
      this.sounds.set(poolId, {
        id: poolId,
        audio: baseSound.audio.cloneNode() as HTMLAudioElement,
        isPlaying: false,
        volume: 1.0,
      })
    }
  }

  /**
   * Play from pool (finds available instance)
   */
  static playFromPool(id: string, options: SoundOptions = {}): void {
    let availableSound: Sound | null = null

    // Find available sound in pool
    this.sounds.forEach((sound) => {
      if (sound.id.startsWith(`${id}_pool_`) && !sound.isPlaying) {
        availableSound = sound
      }
    })

    if (availableSound) {
      this.play(availableSound.id, options)
    } else {
      // Fallback to base sound
      this.play(id, options)
    }
  }
}
