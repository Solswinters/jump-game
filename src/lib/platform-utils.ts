/**
 * Platform detection utilities
 */

export class PlatformUtils {
  private static ua = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : ''

  static isIOS(): boolean {
    return /iphone|ipad|ipod/.test(this.ua)
  }

  static isAndroid(): boolean {
    return /android/.test(this.ua)
  }

  static isMobile(): boolean {
    return this.isIOS() || this.isAndroid() || /mobile/.test(this.ua)
  }

  static isTablet(): boolean {
    return /ipad|android(?!.*mobile)/.test(this.ua)
  }

  static isDesktop(): boolean {
    return !this.isMobile() && !this.isTablet()
  }

  static isChrome(): boolean {
    return /chrome/.test(this.ua) && !/edge|edg/.test(this.ua)
  }

  static isFirefox(): boolean {
    return /firefox/.test(this.ua)
  }

  static isSafari(): boolean {
    return /safari/.test(this.ua) && !/chrome|chromium/.test(this.ua)
  }

  static isEdge(): boolean {
    return /edge|edg/.test(this.ua)
  }

  static getOS(): string {
    if (this.isIOS()) {return 'iOS'}
    if (this.isAndroid()) {return 'Android'}
    if (/mac/.test(this.ua)) {return 'macOS'}
    if (/win/.test(this.ua)) {return 'Windows'}
    if (/linux/.test(this.ua)) {return 'Linux'}
    return 'Unknown'
  }

  static getTouchSupport(): boolean {
    return (
      typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
    )
  }

  static getScreenSize(): { width: number; height: number } {
    return {
      width: typeof window !== 'undefined' ? window.innerWidth : 0,
      height: typeof window !== 'undefined' ? window.innerHeight : 0,
    }
  }
}
