/**
 * Lazy loading utilities
 */

/**
 * lazyLoadImages utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of lazyLoadImages.
 */
export function lazyLoadImages() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          img.src = img.dataset.src || ''
          img.classList.remove('lazy')
          imageObserver.unobserve(img)
        }
      })
    })

    const images = document.querySelectorAll('img.lazy')
    images.forEach((img) => imageObserver.observe(img))
  }
}

/**
 * preloadCriticalResources utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of preloadCriticalResources.
 */
export function preloadCriticalResources(resources: string[]) {
  resources.forEach((resource) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = resource

    if (resource.endsWith('.js')) {
      link.as = 'script'
    } else if (resource.endsWith('.css')) {
      link.as = 'style'
    } else if (resource.match(/\.(jpg|jpeg|png|webp|gif)$/)) {
      link.as = 'image'
    } else if (resource.match(/\.(woff|woff2|ttf|otf)$/)) {
      link.as = 'font'
      link.crossOrigin = 'anonymous'
    }

    document.head.appendChild(link)
  })
}

/**
 * prefetchNextPage utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of prefetchNextPage.
 */
export function prefetchNextPage(url: string) {
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = url
  document.head.appendChild(link)
}

/**
 * preconnectToOrigin utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of preconnectToOrigin.
 */
export function preconnectToOrigin(origin: string) {
  const link = document.createElement('link')
  link.rel = 'preconnect'
  link.href = origin
  document.head.appendChild(link)
}
