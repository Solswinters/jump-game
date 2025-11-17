/**
 * File handling utilities
 */

export class FileUtils {
  /**
   * Get file extension
   */
  static getExtension(filename: string): string {
    const parts = filename.split('.')
    return parts.length > 1 ? (parts[parts.length - 1]?.toLowerCase() ?? '') : ''
  }

  /**
   * Get filename without extension
   */
  static getBasename(filename: string): string {
    return filename.replace(/\.[^/.]+$/, '')
  }

  /**
   * Format file size
   */
  static formatSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return `${size.toFixed(2)} ${units[unitIndex] ?? 'B'}`
  }

  /**
   * Check if filename is valid
   */
  static isValidFilename(filename: string): boolean {
    const invalidChars = /[<>:"/\\|?*\x00-\x1F]/g
    return !invalidChars.test(filename) && filename.length > 0 && filename.length <= 255
  }

  /**
   * Read file as text
   */
  static async readAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(new Error(reader.error?.message ?? 'Failed to read file'))
      reader.readAsText(file)
    })
  }

  /**
   * Read file as data URL
   */
  static async readAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(new Error(reader.error?.message ?? 'Failed to read file'))
      reader.readAsDataURL(file)
    })
  }

  /**
   * Download data as file
   */
  static download(data: string | Blob, filename: string, mimeType = 'text/plain'): void {
    const blob = typeof data === 'string' ? new Blob([data], { type: mimeType }) : data
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }
}
