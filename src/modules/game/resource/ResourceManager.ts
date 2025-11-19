/**
 * Resource management for game assets
 */

export type ResourceType = 'image' | 'audio' | 'json' | 'font'

export interface ResourceConfig {
  id: string
  type: ResourceType
  url: string
}

export class ResourceManager {
  private resources: Map<string, unknown>
  private loading: Map<string, Promise<unknown>>
  private loadedCount: number
  private totalCount: number

  constructor() {
    this.resources = new Map()
    this.loading = new Map()
    this.loadedCount = 0
    this.totalCount = 0
  }

  async load(config: ResourceConfig): Promise<unknown> {
    if (this.resources.has(config.id)) {
      return this.resources.get(config.id)
    }

    if (this.loading.has(config.id)) {
      return this.loading.get(config.id)
    }

    this.totalCount++

    const promise = this.loadResource(config)
    this.loading.set(config.id, promise)

    try {
      const resource = await promise
      this.resources.set(config.id, resource)
      this.loading.delete(config.id)
      this.loadedCount++
      return resource
    } catch (error) {
      this.loading.delete(config.id)
      throw error
    }
  }

  async loadAll(configs: ResourceConfig[]): Promise<void> {
    await Promise.all(configs.map(config => this.load(config)))
  }

  private async loadResource(config: ResourceConfig): Promise<unknown> {
    switch (config.type) {
      case 'image':
        return this.loadImage(config.url)
      case 'audio':
        return this.loadAudio(config.url)
      case 'json':
        return this.loadJSON(config.url)
      case 'font':
        return this.loadFont(config.url)
      default:
        throw new Error(`Unknown resource type: ${config.type}`)
    }
  }

  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`))
      img.src = url
    })
  }

  private async loadAudio(url: string): Promise<HTMLAudioElement> {
    return new Promise((resolve, reject) => {
      const audio = new Audio()
      audio.oncanplaythrough = () => resolve(audio)
      audio.onerror = () => reject(new Error(`Failed to load audio: ${url}`))
      audio.src = url
    })
  }

  private async loadJSON(url: string): Promise<unknown> {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to load JSON: ${url}`)
    }
    return response.json()
  }

  private async loadFont(url: string): Promise<FontFace> {
    const font = new FontFace('CustomFont', `url(${url})`)
    await font.load()
    document.fonts.add(font)
    return font
  }

  get<T>(id: string): T | undefined {
    return this.resources.get(id) as T | undefined
  }

  has(id: string): boolean {
    return this.resources.has(id)
  }

  getProgress(): number {
    if (this.totalCount === 0) return 0
    return (this.loadedCount / this.totalCount) * 100
  }

  isLoading(): boolean {
    return this.loading.size > 0
  }

  clear(): void {
    this.resources.clear()
    this.loading.clear()
    this.loadedCount = 0
    this.totalCount = 0
  }
}
