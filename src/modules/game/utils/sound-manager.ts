/**
 * Sound management for game audio
 */

import { logger } from '@/utils/logger'

interface SoundEffect {
  id: string
  audio: HTMLAudioElement
  volume: number
}

class SoundManager {
  private sounds: Map<string, SoundEffect> = new Map()
  private masterVolume: number = 0.7
  private muted: boolean = false

  loadSound(id: string, src: string, volume: number = 1.0): void {
    if (typeof window === 'undefined') {
      logger.warn('Cannot load sound: Window is undefined')
      return
    }

    try {
      const audio = new Audio(src)
      audio.volume = volume * this.masterVolume
      this.sounds.set(id, { id, audio, volume })
      logger.debug(`Sound loaded: ${id}`)
    } catch (error) {
      logger.error(`Failed to load sound: ${id}`, error)
    }
  }

  playSound(id: string): void {
    if (this.muted) {return}

    const sound = this.sounds.get(id)
    if (!sound) {
      logger.warn(`Sound not found: ${id}`)
      return
    }

    try {
      sound.audio.currentTime = 0
      void sound.audio.play()
    } catch (error) {
      logger.error(`Failed to play sound: ${id}`, error)
    }
  }

  stopSound(id: string): void {
    const sound = this.sounds.get(id)
    if (!sound) {return}

    try {
      sound.audio.pause()
      sound.audio.currentTime = 0
    } catch (error) {
      logger.error(`Failed to stop sound: ${id}`, error)
    }
  }

  loopSound(id: string): void {
    const sound = this.sounds.get(id)
    if (!sound) {
      logger.warn(`Sound not found: ${id}`)
      return
    }

    try {
      sound.audio.loop = true
      void sound.audio.play()
    } catch (error) {
      logger.error(`Failed to loop sound: ${id}`, error)
    }
  }

  setVolume(id: string, volume: number): void {
    const sound = this.sounds.get(id)
    if (!sound) {return}

    sound.volume = Math.max(0, Math.min(1, volume))
    sound.audio.volume = sound.volume * this.masterVolume
  }

  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume))
    this.sounds.forEach(sound => {
      sound.audio.volume = sound.volume * this.masterVolume
    })
  }

  getMasterVolume(): number {
    return this.masterVolume
  }

  mute(): void {
    this.muted = true
    this.sounds.forEach(sound => {
      sound.audio.muted = true
    })
  }

  unmute(): void {
    this.muted = false
    this.sounds.forEach(sound => {
      sound.audio.muted = false
    })
  }

  isMuted(): boolean {
    return this.muted
  }

  stopAll(): void {
    this.sounds.forEach(sound => {
      try {
        sound.audio.pause()
        sound.audio.currentTime = 0
      } catch (error) {
        logger.error('Failed to stop sound', error)
      }
    })
  }

  preloadAll(): Promise<void[]> {
    const promises: Promise<void>[] = []

    this.sounds.forEach(sound => {
      const promise = new Promise<void>((resolve, reject) => {
        sound.audio.addEventListener('canplaythrough', () => resolve(), { once: true })
        sound.audio.addEventListener(
          'error',
          () => reject(new Error(`Failed to load ${sound.id}`)),
          { once: true }
        )
        sound.audio.load()
      })
      promises.push(promise)
    })

    return Promise.all(promises)
  }

  unloadSound(id: string): void {
    const sound = this.sounds.get(id)
    if (sound) {
      sound.audio.pause()
      sound.audio.src = ''
      this.sounds.delete(id)
      logger.debug(`Sound unloaded: ${id}`)
    }
  }

  unloadAll(): void {
    this.stopAll()
    this.sounds.forEach((_, id) => {
      this.unloadSound(id)
    })
    this.sounds.clear()
  }
}

export const soundManager = new SoundManager()

// Preload common game sounds
if (typeof window !== 'undefined') {
  soundManager.loadSound('jump', '/sounds/jump.mp3', 0.5)
  soundManager.loadSound('collision', '/sounds/collision.mp3', 0.6)
  soundManager.loadSound('score', '/sounds/score.mp3', 0.4)
  soundManager.loadSound('gameOver', '/sounds/game-over.mp3', 0.7)
  soundManager.loadSound('bgMusic', '/sounds/background-music.mp3', 0.3)
}
