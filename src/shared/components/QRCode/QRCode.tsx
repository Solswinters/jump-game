/**
 * QR Code generator component
 */

'use client'

import { useEffect, useRef } from 'react'

export interface QRCodeProps {
  value: string
  size?: number
  fgColor?: string
  bgColor?: string
}

export function QRCode({
  value,
  size = 200,
  fgColor = '#000000',
  bgColor = '#ffffff',
}: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Simple QR code placeholder - in production, use a library like qrcode
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Draw background
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, size, size)

    // Draw simple pattern as placeholder
    ctx.fillStyle = fgColor
    const moduleSize = size / 10
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (Math.random() > 0.5) {
          ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize)
        }
      }
    }
  }, [value, size, fgColor, bgColor])

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="rounded-lg border border-gray-700"
    />
  )
}
