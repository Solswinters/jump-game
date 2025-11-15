/**
 * Browser utility functions
 */

export function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

export function isServer(): boolean {
  return typeof window === 'undefined'
}

export function getUserAgent(): string {
  return isBrowser() ? window.navigator.userAgent : ''
}

export function isMobile(): boolean {
  if (!isBrowser()) {
    return false
  }

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(getUserAgent())
}

export function isIOS(): boolean {
  if (!isBrowser()) {
    return false
  }

  return /iPad|iPhone|iPod/.test(getUserAgent())
}

export function isAndroid(): boolean {
  if (!isBrowser()) {
    return false
  }

  return /Android/.test(getUserAgent())
}

export function isTouchDevice(): boolean {
  if (!isBrowser()) {
    return false
  }

  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

export function getScreenSize(): { width: number; height: number } {
  if (!isBrowser()) {
    return { width: 0, height: 0 }
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

export function copyToClipboard(text: string): Promise<void> {
  if (!isBrowser()) {
    return Promise.reject(new Error('Not in browser environment'))
  }

  return navigator.clipboard.writeText(text)
}

export function openInNewTab(url: string): void {
  if (!isBrowser()) {
    return
  }

  window.open(url, '_blank', 'noopener,noreferrer')
}

export function scrollToTop(smooth: boolean = true): void {
  if (!isBrowser()) {
    return
  }

  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto',
  })
}

export function scrollToElement(elementId: string, smooth: boolean = true): void {
  if (!isBrowser()) {
    return
  }

  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
      block: 'start',
    })
  }
}

export function getQueryParam(name: string): string | null {
  if (!isBrowser()) {
    return null
  }

  const params = new URLSearchParams(window.location.search)
  return params.get(name)
}

export function setQueryParam(name: string, value: string): void {
  if (!isBrowser()) {
    return
  }

  const params = new URLSearchParams(window.location.search)
  params.set(name, value)

  const newUrl = `${window.location.pathname}?${params.toString()}`
  window.history.pushState({}, '', newUrl)
}

export function getCurrentUrl(): string {
  if (!isBrowser()) {
    return ''
  }

  return window.location.href
}

export function getCurrentPath(): string {
  if (!isBrowser()) {
    return ''
  }

  return window.location.pathname
}
