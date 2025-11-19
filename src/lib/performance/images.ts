/**
 * Image optimization utilities
 */

export interface ImageOptimizationConfig {
  quality?: number
  format?: 'webp' | 'avif' | 'jpeg' | 'png'
  sizes?: string
  priority?: boolean
}

/**
 * Generate srcset for responsive images
 */
export function generateSrcSet(
  src: string,
  widths: number[] = [640, 750, 828, 1080, 1200, 1920, 2048, 3840]
): string {
  return widths.map(width => `${src}?w=${width} ${width}w`).join(', ')
}

/**
 * Get optimal image format based on browser support
 */
export function getOptimalImageFormat(): 'avif' | 'webp' | 'jpeg' {
  if (typeof window === 'undefined') return 'jpeg'

  // Check AVIF support
  const avifSupport = document
    .createElement('canvas')
    .toDataURL('image/avif')
    .startsWith('data:image/avif')

  if (avifSupport) return 'avif'

  // Check WebP support
  const webpSupport = document
    .createElement('canvas')
    .toDataURL('image/webp')
    .startsWith('data:image/webp')

  if (webpSupport) return 'webp'

  return 'jpeg'
}

/**
 * Calculate image dimensions maintaining aspect ratio
 */
export function calculateAspectRatioDimensions(
  originalWidth: number,
  originalHeight: number,
  targetWidth?: number,
  targetHeight?: number
): { width: number; height: number } {
  const aspectRatio = originalWidth / originalHeight

  if (targetWidth && !targetHeight) {
    return {
      width: targetWidth,
      height: Math.round(targetWidth / aspectRatio),
    }
  }

  if (targetHeight && !targetWidth) {
    return {
      width: Math.round(targetHeight * aspectRatio),
      height: targetHeight,
    }
  }

  return {
    width: originalWidth,
    height: originalHeight,
  }
}

/**
 * Generate blur placeholder data URL
 */
export function generateBlurDataURL(width = 10, height = 10): string {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  // Create gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#f3f4f6')
  gradient.addColorStop(1, '#e5e7eb')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  return canvas.toDataURL()
}

/**
 * Lazy load image with IntersectionObserver
 */
export function lazyLoadImage(
  img: HTMLImageElement,
  src: string,
  options: IntersectionObserverInit = {}
): void {
  if (!('IntersectionObserver' in window)) {
    img.src = src
    return
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        img.src = src
        observer.disconnect()
      }
    })
  }, options)

  observer.observe(img)
}
