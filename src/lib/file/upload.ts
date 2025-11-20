/**
 * File upload and handling utilities
 */

export interface FileUploadOptions {
  maxSize?: number // bytes
  allowedTypes?: string[]
  multiple?: boolean
  onProgress?: (progress: number) => void
}

export interface FileValidationResult {
  valid: boolean
  error?: string
}

export class FileUpload {
  /**
   * Validate file against constraints
   */
  static validateFile(file: File, options: FileUploadOptions = {}): FileValidationResult {
    const { maxSize, allowedTypes } = options

    // Check file size
    if (maxSize && file.size > maxSize) {
      return {
        valid: false,
        error: `File size exceeds maximum allowed size of ${this.formatFileSize(maxSize)}`,
      }
    }

    // Check file type
    if (allowedTypes && allowedTypes.length > 0) {
      const fileType = file.type
      const isAllowed = allowedTypes.some((type) => {
        if (type.includes('*')) {
          const baseType = type.split('/')[0]
          return fileType.startsWith(baseType)
        }
        return fileType === type
      })

      if (!isAllowed) {
        return {
          valid: false,
          error: `File type ${fileType} is not allowed`,
        }
      }
    }

    return { valid: true }
  }

  /**
   * Read file as text
   */
  static readAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(reader.error)
      reader.readAsText(file)
    })
  }

  /**
   * Read file as data URL
   */
  static readAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(file)
    })
  }

  /**
   * Read file as array buffer
   */
  static readAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as ArrayBuffer)
      reader.onerror = () => reject(reader.error)
      reader.readAsArrayBuffer(file)
    })
  }

  /**
   * Format file size for display
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  /**
   * Get file extension
   */
  static getExtension(filename: string): string {
    const parts = filename.split('.')
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : ''
  }

  /**
   * Get file name without extension
   */
  static getBaseName(filename: string): string {
    const lastDot = filename.lastIndexOf('.')
    return lastDot > 0 ? filename.substring(0, lastDot) : filename
  }

  /**
   * Check if file is an image
   */
  static isImage(file: File): boolean {
    return file.type.startsWith('image/')
  }

  /**
   * Check if file is a video
   */
  static isVideo(file: File): boolean {
    return file.type.startsWith('video/')
  }

  /**
   * Check if file is an audio
   */
  static isAudio(file: File): boolean {
    return file.type.startsWith('audio/')
  }

  /**
   * Check if file is a document
   */
  static isDocument(file: File): boolean {
    const documentTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ]
    return documentTypes.includes(file.type)
  }

  /**
   * Create file from blob
   */
  static createFile(blob: Blob, filename: string, type?: string): File {
    return new File([blob], filename, {
      type: type || blob.type,
      lastModified: Date.now(),
    })
  }

  /**
   * Download file
   */
  static download(data: Blob | string, filename: string): void {
    const blob = typeof data === 'string' ? new Blob([data]) : data
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}
