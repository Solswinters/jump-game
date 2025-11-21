/**
 * Color manipulation utilities for game graphics
 * Provides color conversion, interpolation, and manipulation functions
 */

export interface RGB {
  r: number
  g: number
  b: number
}

export interface RGBA extends RGB {
  a: number
}

export interface HSL {
  h: number
  s: number
  l: number
}

export interface HSLA extends HSL {
  a: number
}

export class GameColorUtils {
  /**
   * Convert hex color to RGB
   */
  static hexToRgb(hex: string): RGB | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null
  }

  /**
   * Convert RGB to hex color
   */
  static rgbToHex(r: number, g: number, b: number): string {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
  }

  /**
   * Convert RGB to HSL
   */
  static rgbToHsl(r: number, g: number, b: number): HSL {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6
          break
        case g:
          h = ((b - r) / d + 2) / 6
          break
        case b:
          h = ((r - g) / d + 4) / 6
          break
      }
    }

    return { h: h * 360, s: s * 100, l: l * 100 }
  }

  /**
   * Convert HSL to RGB
   */
  static hslToRgb(h: number, s: number, l: number): RGB {
    h /= 360
    s /= 100
    l /= 100

    let r: number, g: number, b: number

    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q

      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    }
  }

  /**
   * Interpolate between two colors
   */
  static lerp(color1: RGB, color2: RGB, t: number): RGB {
    return {
      r: Math.round(color1.r + (color2.r - color1.r) * t),
      g: Math.round(color1.g + (color2.g - color1.g) * t),
      b: Math.round(color1.b + (color2.b - color1.b) * t),
    }
  }

  /**
   * Lighten color
   */
  static lighten(color: RGB, amount: number): RGB {
    const hsl = this.rgbToHsl(color.r, color.g, color.b)
    hsl.l = Math.min(100, hsl.l + amount)
    return this.hslToRgb(hsl.h, hsl.s, hsl.l)
  }

  /**
   * Darken color
   */
  static darken(color: RGB, amount: number): RGB {
    const hsl = this.rgbToHsl(color.r, color.g, color.b)
    hsl.l = Math.max(0, hsl.l - amount)
    return this.hslToRgb(hsl.h, hsl.s, hsl.l)
  }

  /**
   * Saturate color
   */
  static saturate(color: RGB, amount: number): RGB {
    const hsl = this.rgbToHsl(color.r, color.g, color.b)
    hsl.s = Math.min(100, hsl.s + amount)
    return this.hslToRgb(hsl.h, hsl.s, hsl.l)
  }

  /**
   * Desaturate color
   */
  static desaturate(color: RGB, amount: number): RGB {
    const hsl = this.rgbToHsl(color.r, color.g, color.b)
    hsl.s = Math.max(0, hsl.s - amount)
    return this.hslToRgb(hsl.h, hsl.s, hsl.l)
  }

  /**
   * Adjust hue
   */
  static adjustHue(color: RGB, degrees: number): RGB {
    const hsl = this.rgbToHsl(color.r, color.g, color.b)
    hsl.h = (hsl.h + degrees) % 360
    if (hsl.h < 0) hsl.h += 360
    return this.hslToRgb(hsl.h, hsl.s, hsl.l)
  }

  /**
   * Invert color
   */
  static invert(color: RGB): RGB {
    return {
      r: 255 - color.r,
      g: 255 - color.g,
      b: 255 - color.b,
    }
  }

  /**
   * Grayscale
   */
  static grayscale(color: RGB): RGB {
    const gray = Math.round(0.299 * color.r + 0.587 * color.g + 0.114 * color.b)
    return { r: gray, g: gray, b: gray }
  }

  /**
   * Get complementary color
   */
  static complement(color: RGB): RGB {
    return this.adjustHue(color, 180)
  }

  /**
   * Mix two colors
   */
  static mix(color1: RGB, color2: RGB, weight: number = 0.5): RGB {
    return this.lerp(color1, color2, weight)
  }

  /**
   * Get color brightness (0-255)
   */
  static brightness(color: RGB): number {
    return Math.round((color.r * 299 + color.g * 587 + color.b * 114) / 1000)
  }

  /**
   * Check if color is light
   */
  static isLight(color: RGB): boolean {
    return this.brightness(color) > 127
  }

  /**
   * Check if color is dark
   */
  static isDark(color: RGB): boolean {
    return !this.isLight(color)
  }

  /**
   * Get contrasting color (black or white)
   */
  static getContrastingColor(color: RGB): RGB {
    return this.isLight(color) ? { r: 0, g: 0, b: 0 } : { r: 255, g: 255, b: 255 }
  }

  /**
   * Calculate color contrast ratio
   */
  static contrastRatio(color1: RGB, color2: RGB): number {
    const luminance = (color: RGB): number => {
      const [r, g, b] = [color.r, color.g, color.b].map((val) => {
        val /= 255
        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
      })
      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }

    const lum1 = luminance(color1)
    const lum2 = luminance(color2)
    const brightest = Math.max(lum1, lum2)
    const darkest = Math.min(lum1, lum2)

    return (brightest + 0.05) / (darkest + 0.05)
  }

  /**
   * Generate color palette
   */
  static generatePalette(baseColor: RGB, count: number): RGB[] {
    const palette: RGB[] = []
    const hsl = this.rgbToHsl(baseColor.r, baseColor.g, baseColor.b)

    for (let i = 0; i < count; i++) {
      const h = (hsl.h + (i * 360) / count) % 360
      palette.push(this.hslToRgb(h, hsl.s, hsl.l))
    }

    return palette
  }

  /**
   * Generate analogous colors
   */
  static analogous(color: RGB, angle: number = 30, count: number = 3): RGB[] {
    const colors: RGB[] = [color]
    for (let i = 1; i < count; i++) {
      colors.push(this.adjustHue(color, angle * i))
      colors.push(this.adjustHue(color, -angle * i))
    }
    return colors.slice(0, count)
  }

  /**
   * Generate triadic colors
   */
  static triadic(color: RGB): [RGB, RGB, RGB] {
    return [color, this.adjustHue(color, 120), this.adjustHue(color, 240)]
  }

  /**
   * Generate tetradic colors
   */
  static tetradic(color: RGB): [RGB, RGB, RGB, RGB] {
    return [
      color,
      this.adjustHue(color, 90),
      this.adjustHue(color, 180),
      this.adjustHue(color, 270),
    ]
  }

  /**
   * Generate split complementary colors
   */
  static splitComplementary(color: RGB, angle: number = 30): [RGB, RGB, RGB] {
    return [color, this.adjustHue(color, 180 - angle), this.adjustHue(color, 180 + angle)]
  }

  /**
   * Convert RGB to CSS string
   */
  static rgbToString(color: RGB): string {
    return `rgb(${color.r}, ${color.g}, ${color.b})`
  }

  /**
   * Convert RGBA to CSS string
   */
  static rgbaToString(color: RGBA): string {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
  }

  /**
   * Convert HSL to CSS string
   */
  static hslToString(color: HSL): string {
    return `hsl(${color.h}, ${color.s}%, ${color.l}%)`
  }

  /**
   * Parse CSS color string
   */
  static parseColor(colorString: string): RGB | null {
    // Try hex
    if (colorString.startsWith('#')) {
      return this.hexToRgb(colorString)
    }

    // Try rgb/rgba
    const rgbMatch = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
    if (rgbMatch) {
      return {
        r: parseInt(rgbMatch[1]),
        g: parseInt(rgbMatch[2]),
        b: parseInt(rgbMatch[3]),
      }
    }

    return null
  }

  /**
   * Random color
   */
  static random(): RGB {
    return {
      r: Math.floor(Math.random() * 256),
      g: Math.floor(Math.random() * 256),
      b: Math.floor(Math.random() * 256),
    }
  }

  /**
   * Random pastel color
   */
  static randomPastel(): RGB {
    const hsl = {
      h: Math.random() * 360,
      s: 25 + Math.random() * 25,
      l: 85 + Math.random() * 10,
    }
    return this.hslToRgb(hsl.h, hsl.s, hsl.l)
  }

  /**
   * Random vibrant color
   */
  static randomVibrant(): RGB {
    const hsl = {
      h: Math.random() * 360,
      s: 70 + Math.random() * 30,
      l: 45 + Math.random() * 10,
    }
    return this.hslToRgb(hsl.h, hsl.s, hsl.l)
  }
}
