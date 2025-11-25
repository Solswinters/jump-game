/**
 * Asset Manager - Load, cache, and manage game assets
 */

export type AssetType = 'image' | 'audio' | 'font' | 'json' | 'video'

export interface Asset {
  id: string
  type: AssetType
  url: string
  data: any
  loaded: boolean
  error?: Error
}

export interface LoadProgress {
  loaded: number
  total: number
  percentage: number
  currentAsset?: string
}

export type ProgressCallback = (progress: LoadProgress) => void
export type CompleteCallback = () => void
export type ErrorCallback = (error: Error, assetId: string) => void

export class AssetManager {
  private assets: Map<string, Asset> = new Map()
  private loadingQueue: Asset[] = []
  private onProgress?: ProgressCallback
  private onComplete?: CompleteCallback
  private onError?: ErrorCallback
  private isLoading: boolean = false

  /**
   * Register an asset to be loaded
   */
  register(id: string, url: string, type: AssetType): void {
    if (this.assets.has(id)) {
      console.warn(`Asset with ID "${id}" already registered`)
      return
    }

    const asset: Asset = {
      id,
      type,
      url,
      data: null,
      loaded: false,
    }

    this.assets.set(id, asset)
    this.loadingQueue.push(asset)
  }

  /**
   * Register multiple assets
   */
  registerBatch(assets: Array<{ id: string; url: string; type: AssetType }>): void {
    assets.forEach((asset) => {
      this.register(asset.id, asset.url, asset.type)
    })
  }

  /**
   * Load all registered assets
   */
  async loadAll(): Promise<void> {
    if (this.isLoading) {
      throw new Error('Asset loading already in progress')
    }

    this.isLoading = true
    const total = this.loadingQueue.length

    for (let i = 0; i < this.loadingQueue.length; i++) {
      const asset = this.loadingQueue[i]

      try {
        await this.loadAsset(asset)

        if (this.onProgress) {
          this.onProgress({
            loaded: i + 1,
            total,
            percentage: ((i + 1) / total) * 100,
            currentAsset: asset.id,
          })
        }
      } catch (error) {
        asset.error = error as Error

        if (this.onError) {
          this.onError(error as Error, asset.id)
        } else {
          console.error(`Failed to load asset "${asset.id}":`, error)
        }
      }
    }

    this.loadingQueue = []
    this.isLoading = false

    if (this.onComplete) {
      this.onComplete()
    }
  }

  /**
   * Load a single asset
   */
  private async loadAsset(asset: Asset): Promise<void> {
    switch (asset.type) {
      case 'image':
        asset.data = await this.loadImage(asset.url)
        break
      case 'audio':
        asset.data = await this.loadAudio(asset.url)
        break
      case 'font':
        asset.data = await this.loadFont(asset.url, asset.id)
        break
      case 'json':
        asset.data = await this.loadJSON(asset.url)
        break
      case 'video':
        asset.data = await this.loadVideo(asset.url)
        break
      default:
        throw new Error(`Unknown asset type: ${asset.type}`)
    }

    asset.loaded = true
  }

  /**
   * Load an image
   */
  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = () => reject(new Error(`Failed to load image: ${url}`))
      image.src = url
    })
  }

  /**
   * Load audio
   */
  private loadAudio(url: string): Promise<HTMLAudioElement> {
    return new Promise((resolve, reject) => {
      const audio = new Audio()
      audio.oncanplaythrough = () => resolve(audio)
      audio.onerror = () => reject(new Error(`Failed to load audio: ${url}`))
      audio.src = url
      audio.load()
    })
  }

  /**
   * Load font
   */
  private async loadFont(url: string, fontFamily: string): Promise<FontFace> {
    const fontFace = new FontFace(fontFamily, `url(${url})`)
    const loadedFont = await fontFace.load()
    document.fonts.add(loadedFont)
    return loadedFont
  }

  /**
   * Load JSON data
   */
  private async loadJSON(url: string): Promise<any> {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to load JSON: ${url}`)
    }
    return response.json()
  }

  /**
   * Load video
   */
  private loadVideo(url: string): Promise<HTMLVideoElement> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      video.oncanplaythrough = () => resolve(video)
      video.onerror = () => reject(new Error(`Failed to load video: ${url}`))
      video.src = url
      video.load()
    })
  }

  /**
   * Get an asset by ID
   */
  get<T = any>(id: string): T | null {
    const asset = this.assets.get(id)
    return asset?.loaded ? asset.data : null
  }

  /**
   * Get image asset
   */
  getImage(id: string): HTMLImageElement | null {
    return this.get<HTMLImageElement>(id)
  }

  /**
   * Get audio asset
   */
  getAudio(id: string): HTMLAudioElement | null {
    return this.get<HTMLAudioElement>(id)
  }

  /**
   * Get JSON asset
   */
  getJSON<T = any>(id: string): T | null {
    return this.get<T>(id)
  }

  /**
   * Get video asset
   */
  getVideo(id: string): HTMLVideoElement | null {
    return this.get<HTMLVideoElement>(id)
  }

  /**
   * Check if asset is loaded
   */
  isLoaded(id: string): boolean {
    const asset = this.assets.get(id)
    return asset?.loaded || false
  }

  /**
   * Check if all assets are loaded
   */
  areAllLoaded(): boolean {
    return Array.from(this.assets.values()).every((asset) => asset.loaded)
  }

  /**
   * Get loading progress
   */
  getProgress(): LoadProgress {
    const total = this.assets.size
    const loaded = Array.from(this.assets.values()).filter((a) => a.loaded).length

    return {
      loaded,
      total,
      percentage: total > 0 ? (loaded / total) * 100 : 0,
    }
  }

  /**
   * Set progress callback
   */
  setProgressCallback(callback: ProgressCallback): void {
    this.onProgress = callback
  }

  /**
   * Set complete callback
   */
  setCompleteCallback(callback: CompleteCallback): void {
    this.onComplete = callback
  }

  /**
   * Set error callback
   */
  setErrorCallback(callback: ErrorCallback): void {
    this.onError = callback
  }

  /**
   * Unload an asset
   */
  unload(id: string): void {
    const asset = this.assets.get(id)

    if (!asset) {
      return
    }

    // Clean up based on type
    if (asset.type === 'audio' && asset.data) {
      asset.data.pause()
      asset.data.src = ''
    }

    if (asset.type === 'video' && asset.data) {
      asset.data.pause()
      asset.data.src = ''
    }

    this.assets.delete(id)
  }

  /**
   * Unload all assets
   */
  unloadAll(): void {
    Array.from(this.assets.keys()).forEach((id) => {
      this.unload(id)
    })
  }

  /**
   * Get all assets
   */
  getAll(): Asset[] {
    return Array.from(this.assets.values())
  }

  /**
   * Get assets by type
   */
  getByType(type: AssetType): Asset[] {
    return Array.from(this.assets.values()).filter((asset) => asset.type === type)
  }

  /**
   * Check if asset exists
   */
  has(id: string): boolean {
    return this.assets.has(id)
  }

  /**
   * Get total memory usage (approximate)
   */
  getMemoryUsage(): { images: number; audio: number; video: number; total: number } {
    const images = this.getByType('image').length
    const audio = this.getByType('audio').length
    const video = this.getByType('video').length

    return {
      images,
      audio,
      video,
      total: images + audio + video,
    }
  }

  /**
   * Clone an image asset
   */
  cloneImage(id: string): HTMLImageElement | null {
    const original = this.getImage(id)
    if (!original) return null

    const clone = new Image()
    clone.src = original.src
    return clone
  }

  /**
   * Preload single asset
   */
  async preload(id: string): Promise<void> {
    const asset = this.assets.get(id)

    if (!asset) {
      throw new Error(`Asset with ID "${id}" not found`)
    }

    if (asset.loaded) {
      return
    }

    await this.loadAsset(asset)
  }

  /**
   * Get failed assets
   */
  getFailedAssets(): Asset[] {
    return Array.from(this.assets.values()).filter((asset) => asset.error)
  }

  /**
   * Retry failed assets
   */
  async retryFailed(): Promise<void> {
    const failed = this.getFailedAssets()

    for (const asset of failed) {
      asset.error = undefined
      asset.loaded = false

      try {
        await this.loadAsset(asset)
      } catch (error) {
        asset.error = error as Error
        console.error(`Retry failed for asset "${asset.id}":`, error)
      }
    }
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.unloadAll()
    this.loadingQueue = []
    this.onProgress = undefined
    this.onComplete = undefined
    this.onError = undefined
  }

  /**
   * Get statistics
   */
  getStats(): {
    total: number
    loaded: number
    failed: number
    pending: number
    byType: Record<AssetType, number>
  } {
    const all = this.getAll()

    const byType: Record<AssetType, number> = {
      image: 0,
      audio: 0,
      font: 0,
      json: 0,
      video: 0,
    }

    all.forEach((asset) => {
      byType[asset.type] = (byType[asset.type] || 0) + 1
    })

    return {
      total: all.length,
      loaded: all.filter((a) => a.loaded).length,
      failed: all.filter((a) => a.error).length,
      pending: all.filter((a) => !a.loaded && !a.error).length,
      byType,
    }
  }
}

// Singleton instance
let assetManagerInstance: AssetManager | null = null

/**
 * getAssetManager utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of getAssetManager.
 */
export const getAssetManager = (): AssetManager => {
  if (!assetManagerInstance) {
    assetManagerInstance = new AssetManager()
  }
  return assetManagerInstance
}

export default AssetManager
