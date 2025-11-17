/**
 * DOM manipulation and query utilities
 */

export class DOMUtils {
  /**
   * Check if code is running in browser
   */
  static isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof document !== 'undefined'
  }

  /**
   * Wait for DOM to be ready
   */
  static ready(): Promise<void> {
    if (!this.isBrowser()) {return Promise.resolve()}

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      return Promise.resolve()
    }

    return new Promise(resolve => {
      document.addEventListener('DOMContentLoaded', () => resolve(), { once: true })
    })
  }

  /**
   * Query selector with type safety
   */
  static query<T extends Element = Element>(selector: string): T | null {
    if (!this.isBrowser()) {return null}
    return document.querySelector<T>(selector)
  }

  /**
   * Query all with type safety
   */
  static queryAll<T extends Element = Element>(selector: string): T[] {
    if (!this.isBrowser()) {return []}
    return Array.from(document.querySelectorAll<T>(selector))
  }

  /**
   * Create element with attributes
   */
  static createElement<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    attributes?: Record<string, string>,
    children?: (Node | string)[]
  ): HTMLElementTagNameMap[K] {
    const element = document.createElement(tag)

    if (attributes) {
      for (const [key, value] of Object.entries(attributes)) {
        element.setAttribute(key, value)
      }
    }

    if (children) {
      for (const child of children) {
        if (typeof child === 'string') {
          element.appendChild(document.createTextNode(child))
        } else {
          element.appendChild(child)
        }
      }
    }

    return element
  }

  /**
   * Add event listener with cleanup
   */
  static on<K extends keyof WindowEventMap>(
    target: EventTarget,
    event: K,
    handler: (ev: WindowEventMap[K]) => void,
    options?: AddEventListenerOptions
  ): () => void {
    target.addEventListener(event, handler as EventListener, options)
    return () => target.removeEventListener(event, handler as EventListener, options)
  }

  /**
   * Get element offset relative to document
   */
  static getOffset(element: HTMLElement): { top: number; left: number } {
    const rect = element.getBoundingClientRect()
    return {
      top: rect.top + window.pageYOffset,
      left: rect.left + window.pageXOffset,
    }
  }

  /**
   * Check if element is in viewport
   */
  static isInViewport(element: HTMLElement, offset = 0): boolean {
    const rect = element.getBoundingClientRect()
    return (
      rect.top >= -offset &&
      rect.left >= -offset &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) + offset
    )
  }

  /**
   * Scroll to element smoothly
   */
  static scrollTo(element: HTMLElement, behavior: ScrollBehavior = 'smooth'): void {
    element.scrollIntoView({ behavior, block: 'start' })
  }

  /**
   * Copy text to clipboard
   */
  static async copyToClipboard(text: string): Promise<boolean> {
    if (!this.isBrowser()) {return false}

    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      return false
    }
  }
}
