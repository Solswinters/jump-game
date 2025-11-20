/**
 * Data compression utilities
 */

export class Compression {
  /**
   * Compress string using LZ-based algorithm (simplified)
   */
  static compressString(str: string): string {
    if (!str) return ''

    const dict: Record<string, number> = {}
    const data = str.split('')
    const result = []
    let phrase = data[0]
    let code = 256
    const dictSize = 256

    for (let i = 1; i < data.length; i++) {
      const currChar = data[i]
      const combined = phrase + currChar

      if (dict[combined] !== undefined) {
        phrase = combined
      } else {
        result.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0))
        dict[combined] = code
        code++
        phrase = currChar
      }
    }

    result.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0))

    // Convert to base64
    return Buffer.from(JSON.stringify(result)).toString('base64')
  }

  /**
   * Decompress compressed string
   */
  static decompressString(compressed: string): string {
    if (!compressed) return ''

    try {
      const data: number[] = JSON.parse(Buffer.from(compressed, 'base64').toString('utf8'))
      const dict: Record<number, string> = {}
      let currChar = String.fromCharCode(data[0])
      let phrase = currChar
      const result = [currChar]
      let code = 256

      for (let i = 1; i < data.length; i++) {
        const currCode = data[i]
        let entry: string

        if (dict[currCode] !== undefined) {
          entry = dict[currCode]
        } else if (currCode === code) {
          entry = phrase + currChar
        } else {
          throw new Error('Bad compressed data')
        }

        result.push(entry)
        currChar = entry.charAt(0)
        dict[code] = phrase + currChar
        code++
        phrase = entry
      }

      return result.join('')
    } catch (error) {
      console.error('Decompression error:', error)
      return ''
    }
  }

  /**
   * Compress JSON object
   */
  static compressJSON(obj: unknown): string {
    return this.compressString(JSON.stringify(obj))
  }

  /**
   * Decompress to JSON object
   */
  static decompressJSON<T = unknown>(compressed: string): T | null {
    try {
      const str = this.decompressString(compressed)
      return JSON.parse(str) as T
    } catch (error) {
      console.error('JSON decompression error:', error)
      return null
    }
  }

  /**
   * Get compression ratio
   */
  static getCompressionRatio(original: string, compressed: string): number {
    if (!original || !compressed) return 0
    return 1 - compressed.length / original.length
  }
}
