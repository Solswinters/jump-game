/**
 * File upload component
 */

'use client'

import { useRef, useState } from 'react'

export interface FileUploadProps {
  accept?: string
  maxSize?: number
  multiple?: boolean
  onUpload: (files: File[]) => void | Promise<void>
  disabled?: boolean
}

export function FileUpload({
  accept,
  maxSize = 5 * 1024 * 1024,
  multiple = false,
  onUpload,
  disabled = false,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)
    const oversized = fileArray.find(f => f.size > maxSize)

    if (oversized) {
      setError(`File ${oversized.name} exceeds ${maxSize / 1024 / 1024}MB limit`)
      return
    }

    setError(null)
    await onUpload(fileArray)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (!disabled) {
      handleFiles(e.dataTransfer.files)
    }
  }

  return (
    <div>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          dragActive
            ? 'border-purple-500 bg-purple-500/10'
            : 'border-gray-600 hover:border-gray-500'
        } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        <div className="text-4xl text-gray-400">📁</div>
        <p className="mt-2 text-sm text-gray-300">
          {dragActive ? 'Drop files here' : 'Click or drag files to upload'}
        </p>
        <p className="mt-1 text-xs text-gray-500">Max size: {maxSize / 1024 / 1024}MB</p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={e => handleFiles(e.target.files)}
          className="hidden"
          disabled={disabled}
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  )
}
